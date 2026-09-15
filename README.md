# PhishGuard School

A bilingual Vietnamese-English cybersecurity learning platform that helps secondary school students recognize phishing and online scams.

Learners classify messages as safe or suspicious, identify warning signs, and review explanations. Pre- and post-assessments track changes in recognition scores, while a progress dashboard helps learners identify topics that need more practice.

## Key Features

- **22 annotated scenarios** covering emails, SMS messages, chats, fake login pages, and QR-code scams, including legitimate examples to encourage careful judgment.
- **Interactive guided practice** that asks learners to classify a scenario and mark suspicious details before revealing explanations.
- **A content scanner with 17 heuristic rules** for Vietnamese and English text, with a risk score from 0 to 100 and explanations of detected warning signs.
- **Pre- and post-assessments** with score comparisons and topic-level performance tracking.
- **A progress dashboard** with study recommendations, local data storage, and JSON export.
- **Vietnamese and English interfaces** with localized scenarios and feedback.

The application runs in the browser and does not require a backend. The scanner uses predefined rules, not a trained machine learning model. Its scores indicate matched warning signs rather than a verified probability that a message is fraudulent.

## Technology Stack

| Area | Technologies |
| --- | --- |
| User interface | React 18, JavaScript, Tailwind CSS |
| Development and build tools | Vite, npm |
| Local persistence | Browser localStorage |
| Content analysis | Regular expressions and custom heuristic functions |
| Deployment workflow | GitHub Actions and GitHub Pages |

## Running Locally

The project's current setup requires Node.js 18 or newer and npm. The included deployment workflow uses Node.js 20.

```bash
git clone https://github.com/dohaduyphong/phishguard-school.git
cd phishguard-school
npm ci
npm run dev
```

Open the local URL shown in the terminal. With the current base path, this is typically `http://localhost:5173/phishguard-school/`.

```bash
npm run build    # Create the production bundle in dist/
npm run preview  # Preview the production build locally
```

## Deployment

### GitHub Pages

The repository includes a deployment workflow at `.github/workflows/deploy.yml`.

1. Push the project to the `main` branch of your GitHub repository.
2. Check that `base` in `vite.config.js` matches the repository name:

   ```js
   const base = "/phishguard-school/";
   ```

3. In the repository, open **Settings > Pages** and select **GitHub Actions** as the source.
4. Push a change to `main`, or manually run the **Deploy to GitHub Pages** workflow from the Actions tab.
5. Once deployment succeeds, open the URL shown in the deployment output. For this repository, the expected address is `https://dohaduyphong.github.io/phishguard-school/`.

If you rename the repository, update the base path accordingly. For a repository named `<username>.github.io`, use `/` as the base path.

### Vercel

1. Import the GitHub repository into Vercel.
2. Select the Vite framework preset, with `npm run build` as the build command and `dist` as the output directory.
3. Set `base` in `vite.config.js` to `/` when serving the application at the root of the domain.
4. Deploy the project and use the URL provided by Vercel.

Choose a base path that matches your deployment target. A path configured for a GitHub Pages project site may need to change when deploying at a domain root.

## Project Structure

```text
src/
  App.jsx                  Application interface and learning logic
  main.jsx                 React entry point
  index.css                Tailwind CSS imports
  data/
    scenarios.js           Primary scenario data in Vietnamese
    scenarios.en.js        English translations matched by scenario ID
    rules.js               Heuristic rules for the content scanner
    ui.js                  Localized interface strings and category definitions
.github/
  workflows/
    deploy.yml             GitHub Pages build and deployment workflow
```

Most content updates can be made in `src/data`.

## Adding Scenarios

Add a new object to the `SCENARIOS` array in `src/data/scenarios.js`. The example below uses English placeholders to illustrate the schema; replace them with the appropriate Vietnamese source content and add the English translation separately.

```js
{
  id: "r11",                 // Must be unique across all scenarios
  set: "practice",           // "pre" | "post" | "practice"
  cat: "nganhang",           // Existing banking category ID from ui.js
  kind: "email",             // "email" | "sms" | "chat" | "web" | "qr"
  scam: true,                // true for a scam; false for a legitimate case
  meta: [
    { k: "From", v: "Example sender", why: "Why this sender is suspicious" },
    { k: "Subject", v: "Example subject" }, // No warning sign on this field
  ],
  lines: [
    "An ordinary line of text",
    { t: "A suspicious line", why: "An explanation of this warning sign" },
  ],
  why: "An overall explanation of the scenario",
  tip: "A short takeaway for the learner",
}
```

Use the source language's metadata labels consistently with `META_KEY_EN` in `scenarios.en.js`. Keep category IDs unchanged unless you also update the category definitions.

Add the English translation to `src/data/scenarios.en.js` using the same scenario ID. The `meta` and `lines` arrays must match the source in order and length. Any field with a warning explanation in the source must have a corresponding explanation in the translation. Scenarios without an English translation fall back to the Vietnamese source.

When expanding the scenario library:

- Include legitimate examples as well as scams; aim for roughly 30% legitimate cases so learners cannot succeed by always selecting "scam."
- Explain each warning sign clearly and specifically.
- Match the pre- and post-assessment sets by topic and difficulty to support meaningful comparisons.
- Use fictional identities and contact details, and safe example domains in newly authored scenarios.

## Adding Scanner Rules

Add a rule to the `RULES` array in `src/data/rules.js`:

```js
{
  id: "example_rule",
  w: 12, // Weight added to the risk score; the total is capped at 100
  label: {
    vi: "[Vietnamese display label]",
    en: "Example warning sign",
  },
  why: {
    vi: "[Vietnamese explanation]",
    en: "Why this pattern may be suspicious",
  },
  re: /example pattern|another pattern/gi,
  // Alternatively, use fn: (text) => boolean for a custom condition.
}
```

Replace the placeholders with localized text. Vietnamese patterns should account for both accented and unaccented spelling where appropriate.

Test new rules against suspicious and legitimate messages to check for false positives. A rule match is a prompt for further inspection, not proof of fraud. Regular-expression rules can highlight matching text spans; custom Boolean rules return explanations without character-level highlights.

## Customizing the Interface

The color palette and font settings are defined near the top of `src/App.jsx` in `C`, `MONO`, and `SANS`.

Fonts are loaded through Google Fonts in `index.html`:

- **JetBrains Mono** for headings, labels, and numeric displays.
- **Inter** for body text.

Both fonts support Vietnamese characters. When changing fonts, update both the imports in `index.html` and the font constants in `src/App.jsx`.

Interface translations are defined in `src/data/ui.js`, with some additional localized strings in `App.jsx`. Supporting another language also requires updating the language selector and localization logic, along with translating scenarios and rule explanations.

## Saving and Exporting Results

Learning results are stored in the browser's `localStorage` and persist across page reloads on the same browser and site. They are not automatically synchronized across devices or uploaded to a server.

The progress dashboard provides options to:

- **Export results as JSON** for review or collection during a pilot study.
- **Reset local data** when learners share a classroom computer.

For larger pilots, possible extensions include collecting exported results through a Google Form or implementing a backend integration such as Supabase. These are proposed extensions and are not included in the current application. A backend integration would require a suitable data model and access controls.

## Evaluation Notes

The application provides assessment tools; the repository does not establish that the platform has improved student outcomes in a completed study.

A higher post-assessment score can reflect learning, familiarity with the question format, or differences between the assessment sets. For a more informative evaluation, use comparable pre- and post-assessments and, where feasible, a comparison group that takes the assessments without using the learning modules between them.

## Educational Content

Scenarios illustrate common phishing and online scam patterns for educational use. They should be treated as training examples, not reports about particular people or organizations. Before distributing new scenarios, review links and contact details so they cannot direct learners to a harmful destination.
Enable
