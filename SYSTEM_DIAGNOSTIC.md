# System Diagnostic Report

## 1. Express Routes Discovered

| Method | Path | Controller Function | Description |
|---|---|---|---|
| POST | `/api/auth/register/student` | `authController.registerStudent` | Registers a new student account |
| POST | `/api/auth/register/employee` | `authController.registerEmployee` | Registers a new employee account |
| POST | `/api/auth/login` | `authController.login` | Authenticates user and returns JWT |
| GET | `/api/wallet/` | `walletController.getWallet` | Retrieves wallet balance and transactions |
| POST | `/api/wallet/source` | `walletController.addPaymentSource` | Adds a payment source (UPI, Card, etc.) |
| POST | `/api/wallet/fund` | `walletController.addFunds` | Adds funds to the wallet |
| POST | `/api/kyc/upload` | `kycController.uploadDocument` | Uploads a KYC document |

**Note:** The paths are mounted in `app.js` with prefixes:
- `/api/auth`
- `/api/wallet`
- `/api/kyc`

The routes within the router files (e.g., `walletRoutes.js`) are correctly defined relative to these prefixes. For example, `router.get('/', ...)` in `walletRoutes.js` becomes `/api/wallet/` when mounted.

## 2. Controller Exports vs Router Usage

All controller functions used in routers are correctly exported from their respective controllers.

- **Auth:** `registerStudent`, `registerEmployee`, `login` match.
- **Wallet:** `getWallet`, `addPaymentSource`, `addFunds` match. `addUPI` is exported but not used (generic `addPaymentSource` is used instead).
- **KYC:** `uploadDocument` matches.

## 3. JWT Contract and Auth Middleware

- **Generation:** `generateToken(account)` in `utils/jwt.js` signs a payload: `{ id: account.id, role: account.role }`.
- **Validation:** `authMiddleware.js` verifies the token and assigns the decoded payload to `req.user`.
- **Usage:** Controllers access `req.user.id` and `req.user.role`.
- **Consistency:** The contract is consistent. `req.user.id` is available for database queries.

## 4. Prisma Relations

- **Account <-> Wallet:** 1:1 relation. `Wallet` has `account_id` (unique). Consistent.
- **Wallet <-> Transactions:** 1:Many. `WalletTransaction` has `wallet_id`. Consistent.
- **Wallet <-> PaymentSource:** 1:Many. `PaymentSource` has `wallet_id`. Consistent.
- **Account <-> KycDocument:** 1:Many. `KycDocument` has `account_id`. Consistent.

## 5. Integration Tests Analysis

The project contains 4 integration test suites:
1.  `studentFlow.test.js`: Registers a student, logs in, accesses wallet.
2.  `employeeFlow.test.js`: Registers an employee, logs in, accesses wallet.
3.  `walletFlow.test.js`: Logs in (assuming student exists), adds funds.
4.  `kycFlow.test.js`: Logs in (assuming student exists), uploads document.

**Why Integration Tests Fail:**
The tests use a global setup file `tests/dbReset.js` which runs `beforeAll` for **every** test suite. This script wipes the database clean (`deleteMany` on all tables).

- `studentFlow.test.js` and `employeeFlow.test.js` PASS because they register their own users in the test.
- `walletFlow.test.js` and `kycFlow.test.js` FAIL because they attempt to login immediately, assuming a user exists. Since `dbReset.js` has wiped the database, the login fails (401), and subsequent requests fail.

## 6. Diagnosis and required repairs

The primary issue is the **test data lifecycle**. The `walletFlow` and `kycFlow` tests rely on a user being present, but the test infrastructure enforces a clean slate.

**Planned Fixes:**
1.  **Modify `tests/dbReset.js`:** 
    - Detect which test file is running.
    - If running `walletFlow.test.js` or `kycFlow.test.js`, **seed** a default student user after cleaning the database.
    - This ensures the dependencies for these tests are met without modifying the test files themselves.
2.  **Verify Server Stability:** 
    - Ensure `shutdown()` in `dbReset.js` correctly closes the Prisma connection and Postgres pool to prevent open handles and timeouts.
3.  **Review `prisma/client.js`:**
    - Ensure the Postgres adapter initialization is correct.
