'use strict';

const fs = require('fs');
const path = require('path');

const ARTIFACTS_DIR = path.resolve(__dirname, '..', 'artifacts');
const RESULTS_DIR = path.join(ARTIFACTS_DIR, 'results');
const OUTPUT_HTML = path.join(ARTIFACTS_DIR, 'custom-report.html');

function readJson(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Failed to read JSON at ${filePath}:`, err.message);
    return null;
  }
}

function collectStats(json) {
  const stats = {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    timedOut: 0,
    interrupted: 0,
    flaky: 0,
    durationMs: 0,
    failedTests: [],
  };

  if (!json || !Array.isArray(json.suites)) {
    return stats;
  }

  function traverseSuite(suite, ancestors) {
    const titles = Array.isArray(ancestors) ? ancestors : [];
    const currentTitles = [...titles, suite.title || ''];

    if (Array.isArray(suite.specs)) {
      for (const spec of suite.specs) {
        const specTitles = [...currentTitles, spec.title || ''];
        if (!Array.isArray(spec.tests)) continue;
        for (const test of spec.tests) {
          const testTitles = [...specTitles, test.title || ''];
          const results = Array.isArray(test.results) ? test.results : [];
          const lastResult = results.length > 0 ? results[results.length - 1] : {};
          const status = lastResult.status || (spec.ok ? 'passed' : 'failed');
          stats.total += 1;
          if (typeof stats[status] === 'number') {
            stats[status] += 1;
          } else if (status === 'skipped') {
            stats.skipped += 1;
          } else {
            stats.failed += 1;
          }
          const duration =
            typeof lastResult.duration === 'number'
              ? lastResult.duration
              : typeof lastResult.durationMs === 'number'
                ? lastResult.durationMs
                : 0;
          stats.durationMs += duration;

          if (status !== 'passed' && status !== 'skipped') {
            const errorMessage =
              (lastResult.error &&
                (lastResult.error.message ||
                  lastResult.error.value ||
                  lastResult.error.toString?.())) ||
              '';
            const projectName =
              test.projectName ||
              (test.project && test.project.name) ||
              '';
            const filePath =
              spec.file ||
              (spec.location && spec.location.file) ||
              '';
            stats.failedTests.push({
              title: testTitles.filter(Boolean).join(' › '),
              project: projectName,
              file: filePath,
              error: errorMessage,
            });
          }
        }
      }
    }
    if (Array.isArray(suite.suites)) {
      for (const child of suite.suites) {
        traverseSuite(child, currentTitles);
      }
    }
  }

  for (const root of json.suites) {
    traverseSuite(root, []);
  }

  return stats;
}

function formatMs(ms) {
  const seconds = ms / 1000;
  return `${seconds.toFixed(2)}s`;
}

function sectionHtml(title, stats) {
  return `
    <section>
      <h2>${title}</h2>
      <div class="cards">
        <div class="card"><div class="k">Total</div><div class="v">${stats.total}</div></div>
        <div class="card pass"><div class="k">Passed</div><div class="v">${stats.passed}</div></div>
        <div class="card fail"><div class="k">Failed</div><div class="v">${stats.failed}</div></div>
        <div class="card skip"><div class="k">Skipped</div><div class="v">${stats.skipped}</div></div>
        <div class="card"><div class="k">Timed Out</div><div class="v">${stats.timedOut}</div></div>
        <div class="card"><div class="k">Interrupted</div><div class="v">${stats.interrupted}</div></div>
        <div class="card"><div class="k">Flaky</div><div class="v">${stats.flaky}</div></div>
        <div class="card time"><div class="k">Duration</div><div class="v">${formatMs(stats.durationMs)}</div></div>
      </div>
      ${stats.failedTests.length ? `
        <details open>
          <summary>Failed tests (${stats.failedTests.length})</summary>
          <ul class="fails">
            ${stats.failedTests.map(ft => `
              <li>
                <div class="title">${escapeHtml(ft.title)}</div>
                <div class="meta">${escapeHtml([ft.project, ft.file].filter(Boolean).join(' • '))}</div>
                ${ft.error ? `<pre class="error">${escapeHtml(ft.error)}</pre>` : ''}
              </li>
            `).join('')}
          </ul>
        </details>
      ` : ''}
    </section>
  `;
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildHtml(frontend, api) {
  const combined = {
    total: frontend.total + api.total,
    passed: frontend.passed + api.passed,
    failed: frontend.failed + api.failed,
    skipped: frontend.skipped + api.skipped,
    timedOut: frontend.timedOut + api.timedOut,
    interrupted: frontend.interrupted + api.interrupted,
    flaky: frontend.flaky + api.flaky,
    durationMs: frontend.durationMs + api.durationMs,
  };
  return `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>CookUnity - Playwright Test Summary</title>
  <style>
    :root {
      --bg: #0b1020;
      --fg: #e7eaf3;
      --muted: #9aa3b2;
      --card: #151b2f;
      --green: #2ecc71;
      --red: #e74c3c;
      --yellow: #f1c40f;
      --blue: #3498db;
    }
    html, body { margin: 0; padding: 0; background: var(--bg); color: var(--fg); font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'; }
    .wrap { max-width: 1100px; margin: 0 auto; padding: 24px; }
    header { display: flex; align-items: baseline; gap: 12px; margin-bottom: 16px; }
    header h1 { font-size: 22px; margin: 0; }
    header .meta { color: var(--muted); font-size: 14px; }
    .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; margin: 12px 0 6px; }
    .card { background: var(--card); border-radius: 10px; padding: 14px; }
    .card .k { color: var(--muted); font-size: 12px; text-transform: uppercase; letter-spacing: .08em; }
    .card .v { font-size: 22px; font-weight: 700; margin-top: 6px; }
    .card.pass .v { color: var(--green); }
    .card.fail .v { color: var(--red); }
    .card.skip .v { color: var(--yellow); }
    .card.time .v { color: var(--blue); }
    section { margin: 22px 0; }
    details { background: #0f1630; border-radius: 10px; padding: 10px 14px; }
    details summary { cursor: pointer; font-weight: 600; }
    .fails { list-style: none; padding: 0; margin: 8px 0 0; }
    .fails li { padding: 10px 0; border-top: 1px solid #273152; }
    .fails li:first-child { border-top: 0; }
    .fails .title { font-weight: 600; }
    .fails .meta { color: var(--muted); font-size: 12px; margin-top: 2px; }
    .fails pre.error { margin: 6px 0 0; white-space: pre-wrap; background: #141a30; border-radius: 8px; padding: 10px; color: #ffb6b6; }
    footer { color: var(--muted); font-size: 12px; margin-top: 24px; }
    .grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
    @media (min-width: 900px) { .grid { grid-template-columns: 1fr 1fr; } }
  </style>
</head>
<body>
  <div class="wrap">
    <header>
      <h1>Playwright Test Summary</h1>
      <div class="meta">${new Date().toLocaleString()}</div>
    </header>
    <section>
      <h2>Combined</h2>
      <div class="cards">
        <div class="card"><div class="k">Total</div><div class="v">${combined.total}</div></div>
        <div class="card pass"><div class="k">Passed</div><div class="v">${combined.passed}</div></div>
        <div class="card fail"><div class="k">Failed</div><div class="v">${combined.failed}</div></div>
        <div class="card skip"><div class="k">Skipped</div><div class="v">${combined.skipped}</div></div>
        <div class="card"><div class="k">Timed Out</div><div class="v">${combined.timedOut}</div></div>
        <div class="card"><div class="k">Interrupted</div><div class="v">${combined.interrupted}</div></div>
        <div class="card"><div class="k">Flaky</div><div class="v">${combined.flaky}</div></div>
        <div class="card time"><div class="k">Duration</div><div class="v">${formatMs(combined.durationMs)}</div></div>
      </div>
    </section>
    <div class="grid">
      ${sectionHtml('Frontend', frontend)}
      ${sectionHtml('API', api)}
    </div>
    <footer>Generated by scripts/generate-report.js</footer>
  </div>
</body>
</html>
`;
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

(function main() {
  ensureDir(ARTIFACTS_DIR);
  ensureDir(RESULTS_DIR);
  const frontendJsonPath = path.join(RESULTS_DIR, 'frontend.json');
  const apiJsonPath = path.join(RESULTS_DIR, 'api.json');

  const frontendJson = readJson(frontendJsonPath);
  const apiJson = readJson(apiJsonPath);

  const frontendStats = collectStats(frontendJson);
  const apiStats = collectStats(apiJson);

  const html = buildHtml(frontendStats, apiStats);
  fs.writeFileSync(OUTPUT_HTML, html, 'utf8');
  console.log(`Custom report written to ${OUTPUT_HTML}`);
})();


