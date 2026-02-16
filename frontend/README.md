# VIT Library Frontend

Modern React + TypeScript frontend for the VIT Library Management System.

## Features (Sprint 1)

- **Authentication**: Student & Employee login/registration.
- **Wallet**: View balance, add funds (UPI/Card), manage payment sources.
- **KYC**: Upload identity documents.
- **Profile**: View and edit user profile.
- **Design**: Glassmorphism UI using Tailwind CSS.

## Getting Started

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Environment Setup**
   The app connects to `http://localhost:5000/api` by default.
   To change this, create a `.env` file:
   ```
   VITE_API_BASE_URL=http://your-backend-api
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Run Tests**
   ```bash
   npm run test
   ```

## Project Structure

- `src/api`: Axios client and React Query hooks.
- `src/components`: Reusable UI components.
- `src/context`: Global state (Auth).
- `src/pages`: Route components.
- `src/styles`: Tailwind layers and variables.
