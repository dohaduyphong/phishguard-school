# PhishGuard School

Nền tảng giáo dục chống lừa đảo trực tuyến cho học sinh, giao diện song ngữ Việt và Anh.
A bilingual (Vietnamese / English) anti-scam training platform for secondary school students.

Người học tự quyết định một nội dung là thật hay giả, tự đánh dấu chi tiết đáng ngờ, rồi mới thấy lời giải thích. Bài kiểm tra đầu vào và đầu ra đo mức thay đổi của khả năng nhận diện.

Learners make the call themselves, mark the parts that look wrong, and only then see the explanation. A pre-test and a post-test measure how much their detection actually improves.

---

## Tiếng Việt

### Chạy trên máy

Cần Node.js phiên bản 18 trở lên. Kiểm tra bằng `node -v`, nếu chưa có thì tải ở https://nodejs.org

```bash
cd phishguard-school
npm install
npm run dev
```

Mở địa chỉ hiện ra ở terminal, thường là http://localhost:5173

```bash
npm run build     # đóng gói bản production vào thư mục dist
npm run preview   # xem thử bản đã đóng gói
```

### Đưa lên mạng

Cả hai cách dưới đây đều miễn phí và không cần mua tên miền.

**Cách 1: GitHub Pages, địa chỉ dạng `https://<tên-github>.github.io/phishguard-school/`**

1. Tạo repository tên `phishguard-school` trên GitHub rồi đẩy thư mục này lên nhánh `main`.
2. Mở `vite.config.js`, kiểm tra biến `base` khớp với tên repository, dạng `/phishguard-school/`. Nếu bạn đặt tên repository khác thì sửa lại cho khớp, sai chỗ này là trang sẽ trắng.
3. Vào repository, chọn Settings rồi Pages, mục Source chọn GitHub Actions.
4. Push một lần nữa. Workflow có sẵn ở `.github/workflows/deploy.yml` sẽ tự build và deploy, mất khoảng hai phút.

Nếu bạn đặt tên repository đúng bằng `<tên-github>.github.io` thì trang chạy ở địa chỉ gốc, khi đó đổi `base` thành `"/"`.

**Cách 2: Vercel, địa chỉ dạng `https://phishguard-school.vercel.app`**

1. Vào vercel.com, đăng nhập bằng GitHub, chọn Import Project và trỏ tới repository.
2. Vercel tự nhận diện Vite. Giữ nguyên mặc định: build command `npm run build`, output directory `dist`.
3. Đổi `base` trong `vite.config.js` thành `"/"` vì Vercel chạy ở thư mục gốc.
4. Bấm Deploy. Mỗi lần push lên nhánh chính, trang sẽ tự cập nhật.

Địa chỉ .github.io và .vercel.app đều dùng được để ghi vào CV hay báo cáo. Chỉ mua tên miền riêng nếu bạn muốn một địa chỉ ngắn kiểu phishguard.school, và khi đó vẫn giữ nguyên chỗ hosting, chỉ trỏ tên miền vào.

### Cấu trúc thư mục

```
src/
  App.jsx                  giao diện và toàn bộ logic học tập
  main.jsx                 điểm khởi chạy React
  index.css                nạp Tailwind
  data/
    scenarios.js           tình huống, bản tiếng Việt (nguồn chính)
    scenarios.en.js        bản dịch tiếng Anh, khớp theo id
    rules.js               bộ luật heuristic của Máy soi
    ui.js                  toàn bộ chuỗi giao diện hai ngôn ngữ
```

Khi mở rộng nội dung, bạn gần như chỉ cần sửa các file trong `src/data`.

### Thêm một tình huống mới

Mở `src/data/scenarios.js` và thêm một object vào mảng `SCENARIOS`:

```js
{
  id: "r11",                 // duy nhất trong toàn bộ mảng
  set: "practice",           // "pre" | "post" | "practice"
  cat: "nganhang",           // một trong các khoá ở CATS trong ui.js
  kind: "email",             // email | sms | chat | web | qr
  scam: true,                // true = lừa đảo, false = an toàn
  meta: [
    { k: "Từ", v: "...", why: "vì sao dòng này đáng ngờ" },
    { k: "Chủ đề", v: "..." },            // không có "why" nghĩa là dòng bình thường
  ],
  lines: [
    "một dòng bình thường",
    { t: "một dòng đáng ngờ", why: "giải thích cho đúng dòng này" },
  ],
  why: "giải thích tổng cho cả tình huống",
  tip: "một câu rút gọn để người học nhớ",
}
```

Sau đó thêm bản dịch vào `src/data/scenarios.en.js` với cùng `id`. Thứ tự `meta` và `lines` phải khớp tuyệt đối, và một dòng có `why` ở bản tiếng Việt thì cũng phải có `why` ở bản tiếng Anh. Nếu chưa dịch, giao diện tự động hiển thị bản tiếng Việt.

Vài nguyên tắc nên giữ khi mở rộng lên 50 đến 100 tình huống:

- Giữ khoảng 30% tình huống an toàn. Nếu mọi tình huống đều là lừa đảo, người học sẽ học cách bấm "lừa đảo" chứ không học cách nhìn.
- Mỗi dấu hiệu đỏ giải thích đúng một lý do, viết ngắn và cụ thể.
- Bộ `pre` và bộ `post` phải ghép cặp theo chủ đề và độ khó. Đây là điều kiện để phép đo trước sau có ý nghĩa.
- Mọi tên người, số điện thoại, số tài khoản và tên miền phải là hư cấu.

### Thêm một luật cho Máy soi

Mở `src/data/rules.js`. Mỗi luật có dạng:

```js
{
  id: "ten_luat",
  w: 12,                                            // điểm rủi ro cộng thêm, tổng giới hạn 100
  label: { vi: "Tên hiển thị", en: "Display name" },
  why: { vi: "giải thích", en: "explanation" },
  re: /mẫu|mau|english pattern/gi,                  // hoặc fn: (text) => boolean
}
```

Mẫu tiếng Việt nên viết cả bản có dấu và không dấu vì học sinh thường nhận tin nhắn không dấu. Khi thêm luật mới, nhớ thử lại với vài tin nhắn thật và an toàn để tránh báo động giả. Hiện tại email giả mạo ngân hàng chấm 84 trên 100, tin nhắn OTP thật chấm 22, thông báo của trường chấm 0.

### Đổi giao diện

Bảng màu và font nằm ngay đầu `src/App.jsx` trong hằng `C`, `MONO` và `SANS`. Font được nạp từ Google Fonts trong `index.html`: JetBrains Mono cho tiêu đề, nhãn và số liệu, Inter cho phần văn xuôi. Cả hai font đều hỗ trợ đầy đủ dấu tiếng Việt. Đổi font chỉ cần sửa hai chỗ đó.

### Lưu kết quả và thu dữ liệu thử nghiệm

Kết quả lưu bằng `localStorage`, tức là nằm trên chính máy người học và không mất khi tải lại trang. Mục Tiến bộ có hai nút quan trọng:

- Tải kết quả (.json) để người học gửi file lại cho bạn.
- Xoá dữ liệu máy này, dùng khi nhiều học sinh dùng chung một máy trong phòng tin học.

Nếu thử nghiệm với 30 đến 100 học sinh, đi thu từng file .json bằng tay sẽ rất mệt. Hai cách gọn hơn:

1. Google Forms. Cuối bài đầu ra, thêm link tới form và cho học sinh dán nội dung JSON vào một ô văn bản dài. Không cần viết thêm code.
2. Supabase. Tạo bảng `results`, lấy URL và anon key, gọi một lần `fetch` khi người học bấm nộp. Cách này cho dữ liệu sạch để phân tích ngay.

### Ghi chú về thiết kế thử nghiệm

Nếu chỉ so sánh điểm trước và sau trên cùng một nhóm, phần cải thiện có thể đến từ việc quen dạng bài chứ không hẳn từ việc học. Nếu điều kiện cho phép, hãy chia lớp thành hai nhóm: một nhóm dùng nền tảng giữa hai bài kiểm tra, một nhóm chỉ làm hai bài kiểm tra cách nhau vài ngày. Chi phí gần như không tăng nhưng kết luận sẽ vững hơn nhiều.

---

## English

### Running locally

Requires Node.js 18 or newer.

```bash
cd phishguard-school
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
npm run preview  # serve the built bundle
```

### Deploying

Both options below are free and need no purchased domain.

**GitHub Pages** at `https://<user>.github.io/phishguard-school/`. Push to `main`, make sure `base` in `vite.config.js` matches the repository name, then set Settings, Pages, Source to GitHub Actions. The included workflow at `.github/workflows/deploy.yml` builds and publishes on every push.

**Vercel** at `https://phishguard-school.vercel.app`. Import the repository on vercel.com and accept the defaults; set `base` back to `"/"` because Vercel serves from the root.

### What is in the box

Four modules, all client side, no backend required:

1. **Case library** with 22 fully annotated cases (email, SMS, chat, fake login page, QR code), roughly a third of them legitimate so learners cannot win by always answering "scam".
2. **Guided practice** in two steps: call it safe or scam, then mark the individual lines that look wrong, then read a per-line explanation.
3. **Content scanner** with 17 heuristic rules covering both Vietnamese and English text. It returns a 0 to 100 risk score and highlights the exact spans that triggered each rule.
4. **Progress dashboard**: pre-test, post-test, the delta between them, per-topic accuracy, a study recommendation, and a JSON export for pilot data collection.

### Adding content

Vietnamese cases live in `src/data/scenarios.js` and are the source of truth. English translations live in `src/data/scenarios.en.js`, keyed by the same `id`, with `meta` and `lines` in exactly the same order; a line flagged in Vietnamese must be flagged in English too. Untranslated cases fall back to Vietnamese automatically.

Interface strings for both languages are in `src/data/ui.js`. Adding a third language means adding one key there plus a translation file for the cases.

### Design tokens

The palette and the type stack sit at the top of `src/App.jsx` (`C`, `MONO`, `SANS`). Fonts are loaded from Google Fonts in `index.html`: JetBrains Mono for headings, labels and figures, Inter for prose. Both cover the full Vietnamese diacritic set.

### Content and licence

Every case is reconstructed from common scam patterns. All names, phone numbers, account numbers and domains are fictional and refer to no real person or organisation.
