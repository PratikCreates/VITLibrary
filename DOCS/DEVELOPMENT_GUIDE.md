# VIT Library Application - Development & Setup Guide

This guide provides the necessary steps to set up and contribute to the VIT Library Management System.

## 1. System Requirements

To run this project locally, ensure you have the following installed:
*   **Node.js**: v18.x or higher
*   **PostgreSQL**: v14.x or higher
*   **npm**: v9.x or higher

## 2. Infrastructure Setup (PostgreSQL)

1.  **Install PostgreSQL**: Download and install from [postgresql.org](https://www.postgresql.org/).
2.  **Create Database**:
    ```sql
    CREATE DATABASE vit_library;
    ```
3.  **Environment Variables**: Create a `.env` file in the `backend/` directory based on the following template (do NOT share your actual `.env` file):
    ```env
    PORT=5000
    JWT_SECRET=your_secret_key_here
    DATABASE_URL="postgresql://db_user:db_password@localhost:5432/vit_library"
    ```

## 3. Backend Setup

1.  Navigate to the backend directory: `cd backend`
2.  Install dependencies: `npm install`
3.  Initialize Prisma (ORM):
    ```bash
    npx prisma migrate dev --name init
    ```
4.  Start the development server: `npm run dev`

## 4. Frontend Setup

1.  Navigate to the frontend directory: `cd frontend`
2.  Install dependencies: `npm install`
3.  Start the development server: `npm run dev`
4.  The application will be available at `http://localhost:5173`

## 5. Development Roadmap: Sprint 2

The next phase of development focuses on **Active Lending & Payments**:

### Key Features to Implement:
*   **Search & Discovery**: Advanced search for books by author, genre, and availability date.
*   **Wallet Integration**: Deducting balance for book lending and late fees.
*   **Lending Security**: Automatic "7-Day Block" for users with unpaid overdue bills.
*   **Feedback System**: Post-return feedback loop for books.

---
**Lead / Scrum Master**: Pratik A Shah (22MID0281)
