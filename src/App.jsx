import React, { useState, useMemo, useEffect, createContext, useContext } from "react";
import { SCENARIOS } from "./data/scenarios";
import { EN, META_KEY_EN } from "./data/scenarios.en";
import { RULES } from "./data/rules";
import { UI, CATS } from "./data/ui";

/* PhishGuard School
   src/data/scenarios.js      tinh huong tieng Viet / Vietnamese cases
   src/data/scenarios.en.js   ban dich tieng Anh / English translations
   src/data/rules.js          bo luat cua May soi / scanner rules
   src/data/ui.js             chuoi giao dien song ngu / bilingual interface strings */

/* ---------------------------------------------------------------- tokens */

const C = {
  bg: "#0A0E13",
  panel: "#111821",
  panelUp: "#161F2A",
  line: "#1E2833",
  line2: "#2A3644",
  text: "#E6ECF3",
  dim: "#8496A9",
  paper: "#FFFFFF",
  paperInk: "#131E2B",
  paperDim: "#5D6D80",
  paperLine: "#E3E8EE",
  amber: "#F0B429",
  amberSoft: "#FFF1C9",
  mint: "#37D39B",
  red: "#F0574E",
};

const MONO = '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
const SANS = '"Inter", ui-sans-serif, system-ui, "Segoe UI", Roboto, Arial, sans-serif';

const LS_KEY = "phishguard-state-v2";

function loadState() {
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function saveState(s) {
  try {
    window.localStorage.setItem(LS_KEY, JSON.stringify(s));
  } catch (e) {
    /* trinh duyet chan localStorage thi bo qua / ignore blocked storage */
  }
}

/* ---------------------------------------------------------------- i18n */

const Ctx = createContext({ lang: "vi", L: UI.vi });
const useL = () => useContext(Ctx);

/* Ghep tinh huong voi ban dich theo dung thu tu meta va lines.
   Merge a case with its translation, matching meta and lines by position. */
function localize(s, lang) {
  const tr = lang === "en" ? EN[s.id] : null;
  const meta = s.meta.map((m, i) => {
    const t = tr && tr.meta && tr.meta[i];
    return {
      key: "m" + i,
      type: "meta",
      k: lang === "en" ? META_KEY_EN[m.k] || m.k : m.k,
      t: t ? t.v : m.v,
      why: t ? t.why || null : m.why || null,
    };
  });
  const lines = s.lines.map((l, i) => {
    const raw = typeof l === "string" ? { t: l, why: null } : { t: l.t, why: l.why };
    const t = tr && tr.lines && tr.lines[i];
    return { key: "l" + i, type: "line", t: t ? t.t : raw.t, why: t ? t.why || null : raw.why };
  });
  return {
    parts: [...meta, ...lines],
    why: tr ? tr.why : s.why,
    tip: tr ? tr.tip : s.tip,
  };
}

const scnCode = (s) => "SCN-" + s.id.toUpperCase();

/* ---------------------------------------------------------------- scanner */

function analyze(text, lang) {
  const hits = [];
  const ranges = [];
  for (const r of RULES) {
    if (r.re) {
      const re = new RegExp(r.re.source, r.re.flags);
      let m;
      const found = [];
      while ((m = re.exec(text)) !== null) {
        if (m[0].length === 0) {
          re.lastIndex++;
          continue;
        }
        found.push(m[0]);
        ranges.push([m.index, m.index + m[0].length]);
        if (found.length > 6) break;
      }
      if (found.length)
        hits.push({ id: r.id, label: r.label[lang], why: r.why[lang], w: r.w, samples: [...new Set(found)].slice(0, 4) });
    } else if (r.fn && r.fn(text)) {
      hits.push({ id: r.id, label: r.label[lang], why: r.why[lang], w: r.w, samples: [] });
    }
  }
  const score = Math.min(100, hits.reduce((a, h) => a + h.w, 0));
  ranges.sort((a, b) => a[0] - b[0]);
  const merged = [];
  for (const rg of ranges) {
    const last = merged[merged.length - 1];
    if (last && rg[0] <= last[1]) last[1] = Math.max(last[1], rg[1]);
    else merged.push([rg[0], rg[1]]);
  }
  return { hits: hits.sort((a, b) => b.w - a.w), score, ranges: merged };
}

const pct = (a, b) => (b === 0 ? 0 : Math.round((a / b) * 100));

/* ---------------------------------------------------------------- atoms */

function Tag({ children, color, solid }) {
  return (
    <span
      style={{
        fontFamily: MONO,
        fontSize: 10.5,
        letterSpacing: "0.12em",
        padding: "3px 7px",
        border: "1px solid " + (color || C.line2),
        color: solid ? C.bg : color || C.dim,
        background: solid ? color : "transparent",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

function Eyebrow({ children }) {
  return (
    <div style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: "0.22em", color: C.dim }} className="uppercase mb-3">
      {children}
    </div>
  );
}

function Panel({ children, className }) {
  return (
    <div style={{ background: C.panel, border: "1px solid " + C.line }} className={className}>
      {children}
    </div>
  );
}

function Marker({ children, dark }) {
  return (
    <span
      style={{
        backgroundImage: `linear-gradient(${dark ? "rgba(240,180,41,0.28)" : C.amber}, ${dark ? "rgba(240,180,41,0.28)" : C.amber})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 62%",
        backgroundPosition: "0 78%",
        boxDecorationBreak: "clone",
        WebkitBoxDecorationBreak: "clone",
      }}
    >
      {children}
    </span>
  );
}

function Btn({ children, onClick, kind = "solid", disabled, mono }) {
  const solid = kind === "solid";
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        fontFamily: mono ? MONO : SANS,
        fontSize: 13.5,
        fontWeight: 500,
        letterSpacing: mono ? "0.06em" : 0,
        padding: "9px 16px",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        border: "1px solid " + (solid ? C.amber : C.line2),
        background: solid ? C.amber : "transparent",
        color: solid ? "#12181F" : C.text,
        borderRadius: 0,
      }}
    >
      {children}
    </button>
  );
}

function Field(props) {
  return (
    <input
      {...props}
      style={{
        fontFamily: SANS,
        fontSize: 14,
        padding: "9px 11px",
        border: "1px solid " + C.line2,
        background: C.bg,
        color: C.text,
        borderRadius: 0,
        minWidth: 180,
        flex: 1,
      }}
    />
  );
}

function QRArt() {
  const grid = ["111010111", "100010001", "101110101", "000101000", "110011011", "001100100", "101010111", "100110001", "111011101"];
  return (
    <svg viewBox="0 0 9 9" width="76" height="76" role="img" aria-label="QR">
      <rect width="9" height="9" fill="#fff" />
      {grid.map((row, y) => row.split("").map((c, x) => (c === "1" ? <rect key={x + "-" + y} x={x} y={y} width="1" height="1" fill={C.paperInk} /> : null)))}
    </svg>
  );
}

function Verdict({ scam }) {
  const { L } = useL();
  return <Tag color={scam ? C.red : C.mint}>[ {scam ? L.verdict.scam : L.verdict.safe} ]</Tag>;
}

/* ---------------------------------------------------------------- case view */

function PartRow({ p, mode, marked, onToggle, revealed }) {
  const { L } = useL();
  const isFlag = !!p.why;
  const clickable = mode === "mark";
  let border = "1px solid transparent";
  let bg = "transparent";
  if (revealed) {
    if (isFlag && marked) border = "1px solid " + C.mint;
    else if (isFlag && !marked) border = "1px dashed " + C.red;
    else if (!isFlag && marked) {
      border = "1px solid " + C.paperLine;
      bg = "#F5F7F9";
    }
  } else if (marked) {
    border = "1px solid " + C.paperInk;
    bg = C.amberSoft;
  }

  const inner = (
    <div style={{ padding: "7px 10px", border, background: bg }}>
      <div style={{ fontFamily: SANS, fontSize: 14.5, lineHeight: 1.55, color: C.paperInk }}>
        {p.type === "meta" && (
          <span style={{ fontFamily: MONO, fontSize: 10.5, color: C.paperDim, letterSpacing: "0.14em" }}>{p.k.toUpperCase()}&nbsp;&nbsp;</span>
        )}
        {revealed && isFlag ? <Marker>{p.t}</Marker> : p.t}
      </div>
      {revealed && isFlag && (
        <div style={{ fontFamily: SANS, fontSize: 12.5, lineHeight: 1.5, color: C.paperDim, marginTop: 6, paddingLeft: 10, borderLeft: "2px solid " + C.amber }}>
          {p.why}
        </div>
      )}
      {revealed && !isFlag && marked && (
        <div style={{ fontFamily: SANS, fontSize: 12, color: C.paperDim, marginTop: 5 }}>{L.practice.extraMark}</div>
      )}
    </div>
  );

  if (!clickable) return <div className="mb-1">{inner}</div>;
  return (
    <button type="button" onClick={onToggle} className="mb-1 block w-full text-left" style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}>
      {inner}
    </button>
  );
}

function CaseCard({ s, view, mode, marks, onToggle, revealed }) {
  const { L } = useL();
  const metaPs = view.parts.filter((p) => p.type === "meta");
  const linePs = view.parts.filter((p) => p.type === "line");
  const flags = view.parts.filter((p) => p.why).length;
  return (
    <div style={{ border: "1px solid " + C.line, background: C.panel }}>
      <div className="flex items-center justify-between gap-2 px-3 py-2 flex-wrap" style={{ borderBottom: "1px solid " + C.line }}>
        <div className="flex items-center gap-2 flex-wrap">
          <span style={{ fontFamily: MONO, fontSize: 11, color: C.amber, letterSpacing: "0.1em" }}>{scnCode(s)}</span>
          <span style={{ fontFamily: MONO, fontSize: 11, color: C.dim, letterSpacing: "0.1em" }}>{L.kinds[s.kind].toUpperCase()}</span>
        </div>
        <div className="flex items-center gap-2">
          <span style={{ fontFamily: MONO, fontSize: 11, color: C.dim }}>{L.cats[s.cat]}</span>
          {revealed && <span style={{ fontFamily: MONO, fontSize: 11, color: C.amber }}>{flags} flags</span>}
        </div>
      </div>
      <div style={{ background: C.paper, padding: 16 }}>
        {s.kind === "qr" && (
          <div className="mb-3 flex items-center gap-3">
            <QRArt />
            <div style={{ fontFamily: SANS, fontSize: 12.5, color: C.paperDim, lineHeight: 1.5 }}>{L.qrNote}</div>
          </div>
        )}
        <div className="mb-3">
          {metaPs.map((p) => (
            <PartRow key={p.key} p={p} mode={mode} marked={marks.has(p.key)} onToggle={() => onToggle(p.key)} revealed={revealed} />
          ))}
        </div>
        <div style={{ borderTop: "1px solid " + C.paperLine }} className="pt-3">
          {linePs.map((p) => (
            <PartRow key={p.key} p={p} mode={mode} marked={marks.has(p.key)} onToggle={() => onToggle(p.key)} revealed={revealed} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Debrief({ view }) {
  return (
    <Panel className="p-4 mt-2">
      <div style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.7, color: C.text, whiteSpace: "pre-line" }} className="mb-3">
        {view.why}
      </div>
      <div style={{ borderLeft: "2px solid " + C.amber, paddingLeft: 12, fontFamily: MONO, fontSize: 13.5, lineHeight: 1.6, color: C.amber }}>{view.tip}</div>
    </Panel>
  );
}

/* ---------------------------------------------------------------- screens */

function Home({ go, learner, setLearner, state }) {
  const { L } = useL();
  const preDone = !!state.pre;
  return (
    <div>
      <Panel className="p-6 mb-4">
        <Eyebrow>PHISHGUARD // SCHOOL</Eyebrow>
        <h1 style={{ fontFamily: MONO, fontSize: 30, lineHeight: 1.25, letterSpacing: "-0.02em", color: C.text, fontWeight: 700 }} className="mb-4">
          {L.home.h1a}
          <Marker dark>{L.home.h1b}</Marker>
          {L.home.h1c}
        </h1>
        <p style={{ fontFamily: SANS, fontSize: 15, lineHeight: 1.7, color: C.dim, maxWidth: 620 }} className="mb-5">
          {L.home.lede}
        </p>
        <div className="flex flex-wrap gap-2">
          <Btn onClick={() => go(preDone ? "practice" : "pre")}>{preDone ? L.home.cont : L.home.start}</Btn>
          <Btn kind="ghost" onClick={() => go("analyzer")}>
            {L.home.toAnalyzer}
          </Btn>
        </div>
      </Panel>

      <div className="grid gap-3 mb-4" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))" }}>
        {L.home.steps.map((x, i) => (
          <Panel key={i} className="p-4">
            <div style={{ fontFamily: MONO, fontSize: 11, color: C.amber, letterSpacing: "0.18em" }}>{String(i + 1).padStart(2, "0")}</div>
            <div style={{ fontFamily: MONO, fontSize: 15, color: C.text, marginTop: 8, marginBottom: 8, fontWeight: 600 }}>{x.t}</div>
            <div style={{ fontFamily: SANS, fontSize: 13, lineHeight: 1.6, color: C.dim }}>{x.d}</div>
          </Panel>
        ))}
      </div>

      <Panel className="p-4">
        <Eyebrow>{L.home.enroll}</Eyebrow>
        <div style={{ fontFamily: SANS, fontSize: 13, color: C.dim, lineHeight: 1.6 }} className="mb-3">
          {L.home.enrollNote}
        </div>
        <div className="flex flex-wrap gap-2">
          <Field value={learner.name} onChange={(e) => setLearner({ ...learner, name: e.target.value })} placeholder={L.home.name} />
          <Field value={learner.klass} onChange={(e) => setLearner({ ...learner, klass: e.target.value })} placeholder={L.home.klass} />
        </div>
      </Panel>
    </div>
  );
}

function TestRunner({ set, onDone, existing, go }) {
  const { L, lang } = useL();
  const items = useMemo(() => SCENARIOS.filter((s) => s.set === set), [set]);
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState([]);
  const label = set === "pre" ? L.test.pre : L.test.post;

  if (existing && answers.length === 0) {
    return (
      <Panel className="p-6">
        <Eyebrow>{label}</Eyebrow>
        <h2 style={{ fontFamily: MONO, fontSize: 22, color: C.text, fontWeight: 600 }} className="mb-3">
          {L.test.doneTitle}
        </h2>
        <p style={{ fontFamily: SANS, fontSize: 14.5, color: C.dim, lineHeight: 1.7 }} className="mb-4">
          {L.test.doneBody(existing.correct, existing.total)}
        </p>
        <div className="flex gap-2 flex-wrap">
          <Btn onClick={() => go("progress")}>{L.test.viewProgress}</Btn>
          <Btn
            kind="ghost"
            onClick={() => {
              setAnswers([]);
              setI(0);
              onDone(null);
            }}
          >
            {L.test.redo}
          </Btn>
        </div>
      </Panel>
    );
  }

  if (i >= items.length) {
    const correct = answers.filter((a) => a.ok).length;
    return (
      <Panel className="p-6">
        <Eyebrow>{L.test.finished}</Eyebrow>
        <div style={{ fontFamily: MONO, fontSize: 34, color: C.amber, fontWeight: 700 }} className="mb-3">
          {L.test.score(correct, items.length)}
        </div>
        <p style={{ fontFamily: SANS, fontSize: 14.5, color: C.dim, lineHeight: 1.7 }} className="mb-4">
          {set === "pre" ? L.test.afterPre : L.test.afterPost}
        </p>
        <Btn onClick={() => go(set === "pre" ? "practice" : "progress")}>{set === "pre" ? L.test.toPractice : L.test.viewProgress}</Btn>
      </Panel>
    );
  }

  const s = items[i];
  const view = localize(s, lang);
  const answer = (choice) => {
    const ok = choice === s.scam;
    const next = [...answers, { id: s.id, cat: s.cat, ok, choice }];
    setAnswers(next);
    if (i + 1 >= items.length)
      onDone({ set, correct: next.filter((a) => a.ok).length, total: items.length, items: next, at: new Date().toISOString() });
    setI(i + 1);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Eyebrow>{label}</Eyebrow>
        <span style={{ fontFamily: MONO, fontSize: 11, color: C.dim }}>
          {String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </span>
      </div>
      <div style={{ height: 2, background: C.line, marginBottom: 14 }}>
        <div style={{ height: 2, width: pct(i, items.length) + "%", background: C.amber, transition: "width 240ms ease" }} />
      </div>
      <CaseCard s={s} view={view} mode="read" marks={new Set()} onToggle={() => {}} revealed={false} />
      <Panel className="p-4 mt-2">
        <div style={{ fontFamily: SANS, fontSize: 14.5, color: C.text }} className="mb-3">
          {L.test.q}
        </div>
        <div className="flex flex-wrap gap-2">
          <Btn kind="ghost" onClick={() => answer(false)}>
            {L.test.safe}
          </Btn>
          <Btn onClick={() => answer(true)}>{L.test.scam}</Btn>
        </div>
        <div style={{ fontFamily: SANS, fontSize: 12.5, color: C.dim }} className="mt-3">
          {L.test.noAnswer}
        </div>
      </Panel>
    </div>
  );
}

function Practice({ log, onLog, go }) {
  const { L, lang } = useL();
  const [cat, setCat] = useState("all");
  const pool = useMemo(() => SCENARIOS.filter((s) => s.set === "practice" && (cat === "all" || s.cat === cat)), [cat]);
  const [i, setI] = useState(0);
  const [phase, setPhase] = useState("decide");
  const [choice, setChoice] = useState(null);
  const [marks, setMarks] = useState(new Set());

  const s = pool[i % Math.max(pool.length, 1)];
  if (!s) return <div style={{ fontFamily: SANS, color: C.dim }}>{L.practice.empty}</div>;

  const view = localize(s, lang);
  const flagKeys = view.parts.filter((p) => p.why).map((p) => p.key);
  const hitCount = flagKeys.filter((k) => marks.has(k)).length;

  const reset = (n) => {
    setI(n);
    setPhase("decide");
    setChoice(null);
    setMarks(new Set());
  };
  const toggle = (k) => {
    const n = new Set(marks);
    if (n.has(k)) n.delete(k);
    else n.add(k);
    setMarks(n);
  };
  const reveal = () => {
    setPhase("reveal");
    onLog({ id: s.id, cat: s.cat, ok: choice === s.scam, recall: flagKeys.length ? hitCount / flagKeys.length : null, at: new Date().toISOString() });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <Eyebrow>{L.practice.title}</Eyebrow>
        <select
          value={cat}
          onChange={(e) => {
            setCat(e.target.value);
            reset(0);
          }}
          style={{ fontFamily: MONO, fontSize: 12, padding: "6px 9px", border: "1px solid " + C.line2, background: C.bg, color: C.text, borderRadius: 0 }}
        >
          <option value="all">{L.practice.all}</option>
          {CATS.map((k) => (
            <option key={k} value={k}>
              {L.cats[k]}
            </option>
          ))}
        </select>
      </div>

      <CaseCard s={s} view={view} mode={phase === "mark" ? "mark" : "read"} marks={marks} onToggle={toggle} revealed={phase === "reveal"} />

      <Panel className="p-4 mt-2">
        {phase === "decide" && (
          <>
            <div style={{ fontFamily: SANS, fontSize: 14.5, color: C.text }} className="mb-3">
              {L.test.q}
            </div>
            <div className="flex flex-wrap gap-2">
              <Btn
                kind="ghost"
                onClick={() => {
                  setChoice(false);
                  setPhase("mark");
                }}
              >
                {L.test.safe}
              </Btn>
              <Btn
                onClick={() => {
                  setChoice(true);
                  setPhase("mark");
                }}
              >
                {L.test.scam}
              </Btn>
            </div>
          </>
        )}

        {phase === "mark" && (
          <>
            <div style={{ fontFamily: SANS, fontSize: 14.5, color: C.text }} className="mb-1">
              {L.practice.markTitle}
            </div>
            <div style={{ fontFamily: SANS, fontSize: 12.5, color: C.dim, lineHeight: 1.6 }} className="mb-3">
              {L.practice.markHint}
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <Btn onClick={reveal}>{L.practice.check}</Btn>
              <span style={{ fontFamily: MONO, fontSize: 11, color: C.dim }}>{L.practice.marked(marks.size)}</span>
            </div>
          </>
        )}

        {phase === "reveal" && (
          <>
            <div className="flex items-center gap-3 flex-wrap mb-3">
              <Verdict scam={s.scam} />
              <span style={{ fontFamily: SANS, fontSize: 14.5, fontWeight: 600, color: choice === s.scam ? C.mint : C.red }}>
                {choice === s.scam ? L.practice.right : L.practice.wrong}
              </span>
              {flagKeys.length > 0 && (
                <span style={{ fontFamily: MONO, fontSize: 11, color: C.dim }}>{L.practice.flags(hitCount, flagKeys.length)}</span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Btn onClick={() => reset((i + 1) % pool.length)}>{L.practice.next}</Btn>
              <Btn kind="ghost" onClick={() => go("progress")}>
                {L.test.viewProgress}
              </Btn>
            </div>
          </>
        )}
      </Panel>

      {phase === "reveal" && <Debrief view={view} />}

      <div style={{ fontFamily: MONO, fontSize: 11, color: C.dim }} className="mt-3">
        {L.practice.count(log.length)}
      </div>
    </div>
  );
}

function Library() {
  const { L, lang } = useL();
  const [open, setOpen] = useState(null);
  return (
    <div>
      <Eyebrow>{L.lib.title}</Eyebrow>
      <p style={{ fontFamily: SANS, fontSize: 14.5, color: C.dim, lineHeight: 1.7, maxWidth: 640 }} className="mb-5">
        {L.lib.lede}
      </p>
      {CATS.map((c) => {
        const items = SCENARIOS.filter((s) => s.cat === c);
        if (!items.length) return null;
        return (
          <div key={c} className="mb-6">
            <div className="flex items-baseline justify-between pb-2 mb-3" style={{ borderBottom: "1px solid " + C.line }}>
              <span style={{ fontFamily: MONO, fontSize: 15, color: C.text, fontWeight: 600 }}>{L.cats[c]}</span>
              <span style={{ fontFamily: MONO, fontSize: 11, color: C.dim }}>{String(items.length).padStart(2, "0")}</span>
            </div>
            {items.map((s) => {
              const view = localize(s, lang);
              return (
                <div key={s.id} className="mb-2">
                  <button
                    type="button"
                    onClick={() => setOpen(open === s.id ? null : s.id)}
                    className="w-full text-left flex items-center justify-between gap-3"
                    style={{ background: C.panel, border: "1px solid " + C.line, padding: "10px 12px", cursor: "pointer" }}
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <span style={{ fontFamily: MONO, fontSize: 11, color: C.amber }}>{scnCode(s)}</span>
                      <span style={{ fontFamily: SANS, fontSize: 14, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {view.parts[0] ? view.parts[0].t : s.id}
                      </span>
                    </span>
                    <span className="flex items-center gap-2 shrink-0">
                      <Verdict scam={s.scam} />
                      <span style={{ fontFamily: MONO, fontSize: 11, color: C.dim }}>{open === s.id ? L.lib.close : L.lib.open}</span>
                    </span>
                  </button>
                  {open === s.id && (
                    <div className="mt-2">
                      <CaseCard s={s} view={view} mode="read" marks={new Set()} onToggle={() => {}} revealed={true} />
                      <Debrief view={view} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function Analyzer() {
  const { L, lang } = useL();
  const [text, setText] = useState("");
  const [res, setRes] = useState(null);

  const highlighted = useMemo(() => {
    if (!res) return null;
    const out = [];
    let last = 0;
    res.ranges.forEach(([a, b], idx) => {
      if (a > last) out.push(<span key={"n" + idx}>{text.slice(last, a)}</span>);
      out.push(<Marker key={"m" + idx}>{text.slice(a, b)}</Marker>);
      last = b;
    });
    out.push(<span key="end">{text.slice(last)}</span>);
    return out;
  }, [res, text]);

  const level = res ? (res.score >= 50 ? L.an.level.high : res.score >= 20 ? L.an.level.mid : L.an.level.low) : null;
  const lc = res ? (res.score >= 50 ? C.red : res.score >= 20 ? C.amber : C.mint) : C.text;
  const segs = 20;
  const filled = res ? Math.round((res.score / 100) * segs) : 0;

  return (
    <div>
      <Eyebrow>{L.an.title}</Eyebrow>
      <p style={{ fontFamily: SANS, fontSize: 14.5, color: C.dim, lineHeight: 1.7, maxWidth: 640 }} className="mb-4">
        {L.an.lede}
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        placeholder={L.an.ph}
        style={{
          fontFamily: MONO,
          fontSize: 13,
          lineHeight: 1.7,
          width: "100%",
          padding: 13,
          border: "1px solid " + C.line2,
          background: C.panel,
          color: C.text,
          borderRadius: 0,
          resize: "vertical",
        }}
      />
      <div className="flex flex-wrap gap-2 mt-3">
        <Btn onClick={() => setRes(text.trim() ? analyze(text, lang) : null)} disabled={!text.trim()}>
          {L.an.run}
        </Btn>
        <Btn
          kind="ghost"
          onClick={() => {
            setText(L.an.sampleText);
            setRes(null);
          }}
        >
          {L.an.sample}
        </Btn>
        <Btn
          kind="ghost"
          onClick={() => {
            setText("");
            setRes(null);
          }}
        >
          {L.an.clear}
        </Btn>
      </div>

      {res && (
        <div className="mt-5">
          <Panel className="p-4 mb-2">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span style={{ fontFamily: MONO, fontSize: 40, color: lc, lineHeight: 1, fontWeight: 700 }}>{String(res.score).padStart(2, "0")}</span>
              <span style={{ fontFamily: MONO, fontSize: 11, color: C.dim }}>{L.an.unit}</span>
              <span style={{ fontFamily: MONO, fontSize: 13, fontWeight: 600, color: lc }}>{level}</span>
            </div>
            <div className="flex gap-1 mt-3">
              {Array.from({ length: segs }).map((_, i) => (
                <div key={i} style={{ height: 8, flex: 1, background: i < filled ? lc : C.line }} />
              ))}
            </div>
            <div style={{ fontFamily: SANS, fontSize: 13, color: C.dim, lineHeight: 1.6 }} className="mt-3">
              {res.hits.length === 0 ? L.an.none : L.an.some(res.hits.length)}
            </div>
          </Panel>

          {res.hits.map((h) => (
            <Panel key={h.id} className="p-4 mb-2">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <span style={{ fontFamily: MONO, fontSize: 13.5, fontWeight: 600, color: C.text }}>{h.label}</span>
                <span style={{ fontFamily: MONO, fontSize: 11, color: C.amber }}>+{String(h.w).padStart(2, "0")}</span>
              </div>
              <div style={{ fontFamily: SANS, fontSize: 13, lineHeight: 1.6, color: C.dim }} className="mt-1">
                {h.why}
              </div>
              {h.samples.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {h.samples.map((x, i) => (
                    <span key={i} style={{ fontFamily: MONO, fontSize: 11.5, color: C.amber, border: "1px solid " + C.line2, padding: "2px 6px" }}>
                      {x}
                    </span>
                  ))}
                </div>
              )}
            </Panel>
          ))}

          <Panel className="p-4 mt-2">
            <Eyebrow>{L.an.marked}</Eyebrow>
            <div style={{ background: C.paper, padding: 14, fontFamily: SANS, fontSize: 14, lineHeight: 1.8, color: C.paperInk, whiteSpace: "pre-wrap" }}>
              {highlighted}
            </div>
          </Panel>
        </div>
      )}
    </div>
  );
}

function Progress({ state, learner, go, onReset }) {
  const { L } = useL();
  const { pre, post, log } = state;

  const catStats = useMemo(() => {
    const m = {};
    const add = (cat, ok) => {
      if (!m[cat]) m[cat] = { n: 0, ok: 0 };
      m[cat].n++;
      if (ok) m[cat].ok++;
    };
    if (pre) pre.items.forEach((a) => add(a.cat, a.ok));
    if (post) post.items.forEach((a) => add(a.cat, a.ok));
    log.forEach((a) => add(a.cat, a.ok));
    return m;
  }, [pre, post, log]);

  const weak = Object.keys(catStats)
    .filter((k) => catStats[k].n >= 2 && pct(catStats[k].ok, catStats[k].n) < 70)
    .sort((a, b) => pct(catStats[a].ok, catStats[a].n) - pct(catStats[b].ok, catStats[b].n));

  const postUnlocked = !!pre && log.length >= 6;
  const delta = pre && post ? pct(post.correct, post.total) - pct(pre.correct, pre.total) : null;

  const exportData = () => {
    const payload = {
      app: "PhishGuard School",
      learner,
      exportedAt: new Date().toISOString(),
      pretest: pre ? { correct: pre.correct, total: pre.total, at: pre.at, items: pre.items } : null,
      posttest: post ? { correct: post.correct, total: post.total, at: post.at, items: post.items } : null,
      practice: log,
      byCategory: catStats,
    };
    const txt = JSON.stringify(payload, null, 2);
    try {
      const blob = new Blob([txt], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "phishguard-" + (learner.name || "results").replace(/\s+/g, "-").toLowerCase() + ".json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      try {
        navigator.clipboard.writeText(txt);
      } catch (e2) {
        /* ignore */
      }
    }
  };

  const Score = ({ label, r }) => (
    <Panel className="p-4 flex-1">
      <Eyebrow>{label}</Eyebrow>
      {r ? (
        <>
          <div style={{ fontFamily: MONO, fontSize: 34, color: C.text, lineHeight: 1, fontWeight: 700 }}>
            {pct(r.correct, r.total)}
            <span style={{ fontSize: 15, color: C.dim }}>%</span>
          </div>
          <div style={{ fontFamily: MONO, fontSize: 11, color: C.dim }} className="mt-2">
            {L.prog.correctOf(r.correct, r.total)}
          </div>
        </>
      ) : (
        <div style={{ fontFamily: MONO, fontSize: 13, color: C.dim }}>{L.prog.notYet}</div>
      )}
    </Panel>
  );

  return (
    <div>
      <Eyebrow>{L.prog.title}</Eyebrow>
      <div className="flex gap-2 flex-wrap mb-2">
        <Score label={L.prog.pre} r={pre} />
        <Score label={L.prog.post} r={post} />
        <Panel className="p-4 flex-1">
          <Eyebrow>{L.prog.delta}</Eyebrow>
          {delta === null ? (
            <div style={{ fontFamily: MONO, fontSize: 13, color: C.dim }}>{L.prog.needBoth}</div>
          ) : (
            <div style={{ fontFamily: MONO, fontSize: 34, lineHeight: 1, fontWeight: 700, color: delta > 0 ? C.mint : delta < 0 ? C.red : C.text }}>
              {delta > 0 ? "+" : ""}
              {delta}
              <span style={{ fontSize: 15, color: C.dim }}>%</span>
            </div>
          )}
        </Panel>
      </div>

      <Panel className="p-4 mb-2">
        <Eyebrow>{L.prog.byCat}</Eyebrow>
        {Object.keys(catStats).length === 0 && <div style={{ fontFamily: SANS, fontSize: 13.5, color: C.dim }}>{L.prog.noData}</div>}
        {Object.keys(catStats).map((k) => {
          const p = pct(catStats[k].ok, catStats[k].n);
          return (
            <div key={k} className="mb-3">
              <div className="flex justify-between items-baseline gap-3">
                <span style={{ fontFamily: SANS, fontSize: 13.5, color: C.text }}>{L.cats[k]}</span>
                <span style={{ fontFamily: MONO, fontSize: 11, color: C.dim }}>
                  {String(p).padStart(2, "0")}% · {L.prog.attempts(catStats[k].n)}
                </span>
              </div>
              <div style={{ height: 4, background: C.line, marginTop: 6 }}>
                <div style={{ height: 4, width: p + "%", background: p >= 70 ? C.mint : p >= 40 ? C.amber : C.red }} />
              </div>
            </div>
          );
        })}
      </Panel>

      <Panel className="p-4 mb-2">
        <Eyebrow>{L.prog.next}</Eyebrow>
        {weak.length > 0 ? (
          <>
            <div style={{ fontFamily: SANS, fontSize: 14, color: C.text, lineHeight: 1.7 }} className="mb-3">
              {L.prog.weak(L.cats[weak[0]], weak[1] ? L.cats[weak[1]] : null)}
            </div>
            <Btn onClick={() => go("practice")}>{L.prog.practiceThis}</Btn>
          </>
        ) : (
          <div style={{ fontFamily: SANS, fontSize: 14, color: C.dim, lineHeight: 1.7 }}>
            {Object.keys(catStats).length === 0 ? L.prog.notEnough : L.prog.allGood}
          </div>
        )}
      </Panel>

      <Panel className="p-4">
        <Eyebrow>{L.prog.postCard}</Eyebrow>
        <div style={{ fontFamily: SANS, fontSize: 14, color: C.dim, lineHeight: 1.7 }} className="mb-3">
          {postUnlocked ? L.prog.unlocked : L.prog.locked(!!pre, log.length)}
        </div>
        <div className="flex gap-2 flex-wrap">
          <Btn onClick={() => go("post")} disabled={!postUnlocked}>
            {L.prog.doPost}
          </Btn>
          <Btn kind="ghost" onClick={exportData}>
            {L.prog.download}
          </Btn>
          <Btn kind="ghost" onClick={() => window.confirm(L.prog.confirmReset) && onReset()}>
            {L.prog.reset}
          </Btn>
        </div>
      </Panel>
    </div>
  );
}

/* ---------------------------------------------------------------- shell */

export default function App() {
  const saved = loadState();
  const [lang, setLang] = useState(saved?.lang === "en" ? "en" : "vi");
  const [tab, setTab] = useState("home");
  const [learner, setLearner] = useState(saved?.learner || { name: "", klass: "" });
  const [pre, setPre] = useState(saved?.pre || null);
  const [post, setPost] = useState(saved?.post || null);
  const [log, setLog] = useState(saved?.log || []);

  useEffect(() => {
    saveState({ lang, learner, pre, post, log });
  }, [lang, learner, pre, post, log]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const L = UI[lang];
  const navKeys = ["home", "pre", "practice", "library", "analyzer", "progress"];

  const status = [
    "PRE " + (pre ? String(pre.correct).padStart(2, "0") + "/" + String(pre.total).padStart(2, "0") : "--"),
    "DRILLS " + String(log.length).padStart(2, "0"),
    "POST " + (post ? String(post.correct).padStart(2, "0") + "/" + String(post.total).padStart(2, "0") : "--"),
  ].join("  ·  ");

  return (
    <Ctx.Provider value={{ lang, L: { ...L, qrNote: lang === "en" ? "A QR code cannot tell you where it leads. The address only appears after you scan it." : "Mã QR không cho bạn biết nó dẫn tới đâu. Địa chỉ chỉ hiện ra sau khi quét.", practice: { ...L.practice, extraMark: lang === "en" ? "This detail is normal. Marking it costs you nothing." : "Chi tiết này bình thường. Bạn đánh dấu thừa, không bị trừ điểm." } } }}>
      <div
        style={{
          background: C.bg,
          minHeight: "100vh",
          color: C.text,
          backgroundImage: `linear-gradient(${C.line} 1px, transparent 1px), linear-gradient(90deg, ${C.line} 1px, transparent 1px)`,
          backgroundSize: "44px 44px",
          backgroundPosition: "-1px -1px",
        }}
      >
        <style>{`
          * { box-sizing: border-box; }
          body { margin: 0; background: ${C.bg}; }
          ::selection { background: ${C.amber}; color: #12181F; }
          button:focus-visible, select:focus-visible, textarea:focus-visible, input:focus-visible {
            outline: 1px solid ${C.amber}; outline-offset: 2px;
          }
          textarea::placeholder, input::placeholder { color: ${C.dim}; }
          @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
        `}</style>

        <header style={{ borderBottom: "1px solid " + C.line, background: "rgba(10,14,19,0.92)", backdropFilter: "blur(6px)", position: "sticky", top: 0, zIndex: 10 }}>
          <div className="mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-3" style={{ maxWidth: 960 }}>
            <div className="flex items-baseline gap-2">
              <span style={{ fontFamily: MONO, fontSize: 16, fontWeight: 700, letterSpacing: "-0.02em", color: C.text }}>PHISHGUARD</span>
              <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.22em", color: C.amber }}>// {L.brandSub}</span>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ fontFamily: MONO, fontSize: 10.5, color: C.dim, letterSpacing: "0.08em" }} className="hidden sm:inline">
                {status}
              </span>
              <div className="flex" style={{ border: "1px solid " + C.line2 }}>
                {["vi", "en"].map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setLang(k)}
                    style={{
                      fontFamily: MONO,
                      fontSize: 11,
                      letterSpacing: "0.1em",
                      padding: "4px 9px",
                      border: "none",
                      cursor: "pointer",
                      background: lang === k ? C.amber : "transparent",
                      color: lang === k ? "#12181F" : C.dim,
                    }}
                  >
                    {k.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div style={{ borderTop: "1px solid " + C.line }}>
            <nav className="mx-auto px-4 flex flex-wrap" style={{ maxWidth: 960 }}>
              {navKeys.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setTab(k)}
                  style={{
                    fontFamily: MONO,
                    fontSize: 12,
                    letterSpacing: "0.04em",
                    padding: "10px 12px",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    color: tab === k ? C.amber : C.dim,
                    borderBottom: "2px solid " + (tab === k ? C.amber : "transparent"),
                  }}
                >
                  {L.nav[k]}
                </button>
              ))}
            </nav>
          </div>
        </header>

        <main className="mx-auto px-4 py-6" style={{ maxWidth: 960 }}>
          {tab === "home" && <Home go={setTab} learner={learner} setLearner={setLearner} state={{ pre, post, log }} />}
          {tab === "pre" && <TestRunner set="pre" existing={pre} onDone={setPre} go={setTab} />}
          {tab === "post" && <TestRunner set="post" existing={post} onDone={setPost} go={setTab} />}
          {tab === "practice" && <Practice log={log} onLog={(x) => setLog((l) => [...l, x])} go={setTab} />}
          {tab === "library" && <Library />}
          {tab === "analyzer" && <Analyzer />}
          {tab === "progress" && (
            <Progress
              state={{ pre, post, log }}
              learner={learner}
              go={setTab}
              onReset={() => {
                setPre(null);
                setPost(null);
                setLog([]);
                setLearner({ name: "", klass: "" });
                setTab("home");
              }}
            />
          )}
        </main>

        <footer style={{ borderTop: "1px solid " + C.line }} className="mt-10">
          <div className="mx-auto px-4 py-5" style={{ maxWidth: 960, fontFamily: SANS, fontSize: 12, color: C.dim, lineHeight: 1.7 }}>
            {L.footer}
          </div>
        </footer>
      </div>
    </Ctx.Provider>
  );
}
