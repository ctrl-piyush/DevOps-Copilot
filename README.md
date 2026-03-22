# DevOps Copilot

An AI-powered assistant for root cause analysis, log diagnosis, and CI/CD failure debugging — built with React + Vite and powered by the Claude API.

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Set your API key

The app calls the Anthropic API directly from the browser. Open
`src/lib/claude.js` and the `fetch` call already points to
`https://api.anthropic.com/v1/messages`. The API key is injected by the
Claude.ai artifact runtime automatically when running inside Claude.

If you are running this **outside** Claude (locally or deployed), add your key
to the request headers in `src/lib/claude.js`:

```js
headers: {
  'Content-Type': 'application/json',
  'x-api-key': 'sk-ant-...', // your key here
  'anthropic-version': '2023-06-01',
},
```

> **Note:** Never commit your API key. Use an environment variable and a
> backend proxy for any public-facing deployment.

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### 4. Build for production

```bash
npm run build
```

Output goes to `dist/`.

---

## Project structure

```
src/
├── main.jsx                 # React entry point
├── App.jsx                  # Root layout, tab state
├── App.module.css
│
├── styles/
│   └── global.css           # CSS variables, resets, scrollbar
│
├── lib/
│   ├── claude.js            # Anthropic streaming API client
│   └── samples.js           # Pre-loaded failure scenarios + prompt chips
│
├── hooks/
│   └── useChat.js           # Chat state, message list, streaming logic
│
└── components/
    ├── Header.jsx            # Top bar with tab nav + status pills
    ├── Header.module.css
    ├── Sidebar.jsx           # Status counts + sample scenario cards
    ├── Sidebar.module.css
    ├── ChatView.jsx          # Message list, empty state, input bar
    ├── ChatView.module.css
    ├── LogView.jsx           # Raw log paste + analyze button
    ├── LogView.module.css
    ├── MdContent.jsx         # Markdown renderer (bold, code, lists)
    └── MdContent.module.css
```

---

## Extending the project

| What | Where |
|---|---|
| Change the AI persona / instructions | `src/lib/claude.js` → `SYSTEM_PROMPT` |
| Add more sample failures | `src/lib/samples.js` → `SAMPLES` array |
| Add a new tab (e.g. Metrics) | `src/App.jsx` + new component in `src/components/` |
| Swap in real pipeline data | `src/components/Sidebar.jsx` → replace `STATUS_ITEMS` with an API fetch |
