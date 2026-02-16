Project: VIT Library — Frontend (TypeScript + Vite + React)

Goal:
- Create a production-ready React TypeScript frontend for the existing VIT library backend (baseURL: http://localhost:5000/api).
- Provide UI for Sprint-1 features only: Authentication (student & employee), Profile, KYC upload, Wallet (view, add source, add funds).
- Implement component, hook, API layers, React Query integration, MSW mocking, unit tests (Jest + React Testing Library), and E2E tests (Playwright). No backend code changes.

Tech stack:
- React 18 + TypeScript
- Vite
- Tailwind CSS
- axios
- @tanstack/react-query
- react-router-dom v6
- MSW for mock during dev/test
- Jest + React Testing Library for unit tests
- Playwright for E2E
- ESLint + Prettier
- GitHub Actions CI (lint, typecheck, unit tests, build, e2e)

Deliverables (file-level):
1. `package.json` scripts:
   - dev, build, preview, lint, test, test:unit, test:e2e, format, typecheck
2. `src/main.tsx` — app bootstrap: import Tailwind CSS and mount App inside React.StrictMode
3. `src/App.tsx` — returns `<AppRoutes/>`
4. `src/routes/AppRoutes.tsx` — BrowserRouter & routes for "/", "/register", "/dashboard", "/profile", "/wallet", "/kyc"
5. `src/api/client.ts` — axios instance with baseURL from env and auth header attach
6. `src/api/hooks/*` — react-query hooks: `useLogin`, `useRegisterStudent`, `useRegisterEmployee`, `useGetWallet`, `useAddPaymentSource`, `useAddFunds`, `useUploadKyc`, `useProfile`
7. `src/context/AuthContext.tsx` — provides `user`, `login(token)`, `logout()`, and `isAuthenticated` to app; uses `localStorage` for token
8. `src/pages/Auth/LoginPage.tsx`, `src/pages/Auth/RegisterPage.tsx`
9. `src/pages/Dashboard.tsx`, `src/pages/ProfilePage.tsx`, `src/pages/WalletPage.tsx`, `src/pages/KycPage.tsx`
10. `src/components/layout/Header.tsx` — shows app name, wallet balance preview, Login/Register/Profile links; uses AuthContext
11. `src/components/ui/*` — Button, Input, Card, Modal (generic)
12. `src/components/wallet/WalletView.tsx`, `src/components/kyc/KycUpload.tsx` — responsibility-limited components
13. `src/styles/index.css` — Tailwind entry
14. `src/types/index.ts` — types for Account, Wallet, PaymentSource, Transaction, Booking, KycDocument, API responses
15. `src/services/msw/handlers.ts` and `src/services/msw/browser.ts` — MSW setup and example handlers for auth, wallet, kyc
16. `tests/unit/*` — sample unit tests for LoginPage and WalletView with RTL
17. `tests/e2e/*` — Playwright scripts that run Register→Login→Upload KYC→Add UPI→Add funds and assert wallet balance
18. `tailwind.config.js`, `postcss.config.cjs` and `tsconfig.json`
19. `.eslintrc.cjs` and `.prettierrc`
20. GitHub Actions workflow `.github/workflows/ci.yml` to run `npm ci`, `npm run lint`, `npm run typecheck`, `npm run test:unit`, `npm run build`, `npm run test:e2e` (with `start:ci`)

Behaviour & API contract:
- Use these endpoints:
  - POST /api/auth/register/student
  - POST /api/auth/register/employee
  - POST /api/auth/login
  - GET /api/wallet
  - POST /api/wallet/source
  - POST /api/wallet/fund
  - POST /api/kyc/upload
  - GET/PUT /api/profile
- Axios must attach `Authorization: Bearer <token>` for authenticated requests.
- React Query hooks must expose `isLoading`, `error`, and `mutate`/`data` as appropriate.

Testing:
- Unit tests: mock axios via MSW or jest mocks; assert validation and UI flows.
- E2E Playwright: run against a dev backend if available; otherwise run with MSW started in browser mode.

Acceptance criteria (automated checks):
1. `npm run dev` launches Vite app and shows Login page.
2. `npm run test:unit` passes.
3. `npx playwright test` passes against CI server or with MSW emulation.
4. `npm run build` succeeds.

Development sequence instructions (to the AI IDE):
1. Scaffold Vite + TS + React + Tailwind project.
2. Install libraries: axios, @tanstack/react-query, react-router-dom, msw, jest, @testing-library/react, playwright, eslint, prettier.
3. Add base layout and routing.
4. Implement AuthContext and axios client.
5. Implement minimal pages with validation and UI components.
6. Implement react-query hooks that call the backend.
7. Implement MSW handlers that mirror the API contract.
8. Add unit tests for Login and Wallet components.
9. Add Playwright tests for full user flow.
10. Add linting, formatting, and CI configuration.
11. Run `npm run test:unit` and `npx playwright test` and report results and any failing assertions.

Extra constraints for the AI:
- Use TypeScript for all `.tsx` / `.ts` files.
- Keep components small and pure; prefer composition.
- Provide README.md with exact commands to run dev server, unit tests, and e2e tests.
- Do not implement booking features (Sprint-2). Only implement Sprint-1 endpoints.
- Use MSW in dev mode so the frontend can work if backend is not running—but prefer real backend if `VITE_API_BASE_URL` is set to non-mock address.

Output required from AI:
- A ZIP or patch of generated project files (if the IDE supports) or a GitHub repo.
- A short runbook with commands: `npm install`, `npm run dev`, `npm run test:unit`, `npx playwright test`, `npm run build`.
- A short verification report: list of tests, pass/fail, and any mock fallbacks used.

End of prompt.
