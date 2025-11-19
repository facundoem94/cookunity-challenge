## CookUnity - Playwright Tests

This project contains API and Frontend end-to-end tests for CookUnity QA Engineer Challenge.

### Folder structure
- `src/pages/`: Page Object Models used by frontend tests
- `src/fixtures/baseTest.ts`: Frontend base test and shared fixtures
- `src/fixtures/baseApiTest.ts`: API base test (provides authenticated `api` request context)
- `tests/e2e/frontend/`: Frontend test specs (e.g. `order.spec.ts`)
- `tests/api/`: API test specs (e.g. `posts.spec.ts`)
- `tests/auth.setup.ts`: Pre-auth step that logs in and saves storage state for frontend tests
- `scripts/generate-report.js`: Aggregates API + Frontend JSON results into a single HTML report
- `playwright.config.ts`: Frontend Playwright configuration
- `playwright.api.config.ts`: API Playwright configuration
- `artifacts/`: All test outputs (HTML reports, JSON results, traces, screenshots, videos)

### Setup
1) Install dependencies

```bash
npm install
```

2) Install Playwright browsers

```bash
npx playwright install
```

3) Linux system dependencies (Linux only)

```bash
npx playwright install-deps
```

4) Environment variables

Create a `.env` file at the project root (automatically loaded via `dotenv`) and set the variables you need:

```bash
# Frontend base URL (optional; has a default)
CU_BASE_URL=https://app.business.qa.cookunity.com

# Required for frontend auth setup (tests/auth.setup.ts)
CU_EMAIL=your-email@example.com
CU_PASSWORD=your-password

# Optional API base URL (has a default)
GOREST_BASE_URL=https://gorest.co.in/public/v1

# Required for API POST/PATCH test
GOREST_TOKEN=your-gorest-api-token
```

Notes:
- Frontend tests require `CU_EMAIL` and `CU_PASSWORD` to authenticate and generate `playwright/.auth/user.json`.
- The API suite requires `GOREST_TOKEN` for the POST/PATCH scenario; without it that test will fail explicitly.

### Running tests
- API tests:

```bash
npm run test:api
```

- Frontend tests:

```bash
npm run test:frontend
```

- All tests + custom report:

```bash
npm run test:all
```

This runs API then Frontend tests and generates a combined HTML report at `artifacts/custom-report.html`.

### Reports and artifacts
- Custom combined report:
  - `artifacts/custom-report.html`

- Built-in Playwright HTML reports:
  - API: `artifacts/playwright-report/api/index.html`
  - Frontend: `artifacts/playwright-report/frontend/index.html`
  - You can open these with:

```bash
npx playwright show-report artifacts/playwright-report/api
npx playwright show-report artifacts/playwright-report/frontend
```

- Raw JSON results (used by the custom report generator):
  - API: `artifacts/results/api.json`
  - Frontend: `artifacts/results/frontend.json`

- Low-level test outputs (traces, screenshots, videos):
  - API: `artifacts/test-results/api`
  - Frontend: `artifacts/test-results/frontend`

### Cleaning artifacts

```bash
npm run clean
```

