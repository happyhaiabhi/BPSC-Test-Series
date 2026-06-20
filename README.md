# BPSC Test Series

A self-contained quiz / test-series web app with **GitHub sync** for cross-device progress tracking.

## ⚡ Quick Start

```bash
# Run the app
cd test-series
python3 -m http.server 8000
# Open http://localhost:8000
```

## ☁️ GitHub Sync (NEW!)

Sync your progress across laptop, phone, and tablet automatically via GitHub:

1. **Get a GitHub token**: https://github.com/settings/tokens (check `gist` scope)
2. **Click ☁ Sync** in the app (top-right)
3. **Paste your token** and click "Test Connection"
4. **Done!** Your progress now syncs every 30 seconds across all devices

👉 See [GITHUB_SYNC_GUIDE.md](../GITHUB_SYNC_GUIDE.md) for detailed steps.

## 📁 Folder layout

```
test-series/
├── index.html                 ← the app (HTML + CSS + JS, single file)
└── data/
    └── tests/
        ├── test_01.json       ← (drop in to unlock)
        ├── test_02.json
        ├── ...
        └── test_10.json       ← already included (150 questions, Biology & Sci-Tech)
```

The HTML never has to be edited when you add a new test. Just drop the JSON file in `data/tests/` and the corresponding card unlocks automatically.

## 🚀 Run it

Browsers block `fetch()` of local files when you open `index.html` directly via `file://`, so you must serve the folder over HTTP.

```bash
# Python 3 (already on most systems)
cd test-series
python3 -m http.server 8000
# then open http://localhost:8000
```

```bash
# Node.js
npx serve .
```

Any static hosting works too — GitHub Pages, Netlify, Firebase Hosting, Cloudflare Pages, etc.

## ➕ How to add a new test

1. **Create a JSON file** following the schema below.
2. **Save it** as `data/tests/test_XX.json` (replace XX with 01–10 or beyond).
3. **(Optional)** If you want a test slot beyond #10, open `index.html`, find the `TESTS_CONFIG` array near the top of the `<script>` block, and add an entry:

   ```js
   {id:'test_11', name:'Test 11', icon:'🧪', subtitle:'Your subject', file:'data/tests/test_11.json'},
   ```

   Slots 01–10 are already declared, so for those you only need to drop in the JSON.

4. **Reload the page.** The card unlocks automatically and shows the question count.

## 📄 JSON schema (`test_XX.json`)

```json
{
  "questions": [
    {
      "id": 1,
      "text": "Which hormone is secreted by the adrenal medulla?",
      "options": {
        "A": "Cortisol",
        "B": "Aldosterone",
        "C": "Epinephrine",
        "D": "Glucagon"
      },
      "correctAnswer": "C",
      "explanation": "The adrenal medulla secretes epinephrine..."
    }
  ]
}
```

| Field           | Required | Description                                           |
| --------------- | -------- | ----------------------------------------------------- |
| `id`            | yes      | Integer, unique within the test                       |
| `text`          | yes      | The question prompt. Supports plain `\n` line breaks. |
| `options`       | yes      | Object with keys `A`, `B`, `C`, `D` (4 options)       |
| `correctAnswer` | yes      | One of `"A"`, `"B"`, `"C"`, `"D"`                     |
| `explanation`   | yes      | Shown after the user answers                          |

That's it — no other top-level fields are needed.

## 🗂 What changed vs the two original files

|                      | `test-series.html` (v1) | `Test Series.html` (v2)      | **This build**                              |
| -------------------- | ----------------------- | ---------------------------- | ------------------------------------------- |
| Size                 | 85 KB                   | 167 KB                       | 86 KB                                       |
| Data location        | external JSON files     | **embedded** inline in HTML  | external JSON files                         |
| Add a new test       | drop JSON in folder     | edit HTML, paste JSON inside | drop JSON in folder                         |
| Works from `file://` | no (silent lock)        | yes                          | no — but now shows a helpful note + command |

**Picked:** v1 as the base — it already keeps data and HTML separate, which is exactly what was requested. v2 only existed to work around the `file://` limitation by inlining test_10 into the HTML, which defeats the whole "drop in more tests" workflow.

**Small polish added on top of v1:**

- When the page is opened via `file://`, locked cards now say "Run via local server" instead of the confusing "Coming Soon".
- A one-line orange banner appears above the grid in that case, telling the user the exact `python3 -m http.server 8000` command to run.

Nothing else was changed — all original features (timer, bookmarks, mistakes bank, skips bank, archive, history, mastery scoring) are intact.
