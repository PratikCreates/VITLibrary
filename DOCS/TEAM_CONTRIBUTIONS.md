# Internal Team Contributions - VIT Library Management System

This document details the role-based responsibilities and completed tasks for **Sprint 1**, along with the roadmap expectations for **Sprint 2**.

## 1. Team Composition & Roles

| Member | Role | ID Number |
| :--- | :--- | :--- |
| **Pratik A Shah** | **Scrum Master** | 22MID0281 |
| **Dhanya Prathiba Manivannan** | **Product Owner** | 22MID0242 |
| **Yogalakshmi G** | **Developer** | 22MID0261 |
| **Harshith Darisa** | **Developer** | 22MID0268 |
| **Nithin J** | **Tester** | 22MID0254 |
| **Mohammed Junaid** | **Tester** | 22MID0260 |

---

## 2. Sprint 1 Implementation Tasks

### 🛡️ Pratik A Shah (Scrum Master)
*   System Architecture & Lead Security Implementation.
*   Admin Console & JWT Authorization Logic.
*   KYC Verification Engine & Document Validation.
*   Technical Oversight of all Sprint 1 code.

### 📋 Dhanya Prathiba Manivannan (Product Owner)
*   **Documentation Lead**: Compiled the initial SRS (Software Requirements Specification) and System Design documents.
*   **Stakeholder Sync**: Managed the alignment between the VIT library requirements and the technical implementation checklist.
*   **Sprint Reviews**: Audited the application against the roadmap to ensure all mandatory features were accessible.

### 💻 Yogalakshmi G (Developer)
*   **UI Components**: Developed the base structure for the `ProfilePage` and `Wallet` views.
*   **Navigation Integration**: Built the frontend routing guards to handle unauthenticated user redirects.
*   **Visual Polish**: Implemented minor CSS adjustments to the "Under Construction" states to maintain professional aesthetics.

### 💻 Harshith Darisa (Developer)
*   **Registration Flow**: Assisted in refining the Registration form validation logic.
*   **KYC UI**: Implemented the file upload interaction for the Identity Verification screen.
*   **Utility Hooks**: Scripted basic frontend API hooks to connect common dashboard actions to the local server.

### 🔍 Nithin J (Tester)
*   **Manual Validation**: Conducted surface-level UI testing on the Header and Dashboard.
*   **Visual Evidence**: Captured [Login Page Evidence](../test_screenshots/6_LOGINPAGE_FRONTEND_TEST.png) and [Main Frontend Flow](../test_screenshots/8FRONTEND_!.png).
*   **Bug Discovery**: Identified initial discrepancies in the payment radio card selection which were later patched.

### 🔍 Mohammed Junaid (Tester)
*   **Input Integrity**: Verified that the Name, DOB, and Address fields correctly accept and store inputs.
*   **Visual Evidence**: Captured [Wallet Page Verification](../test_screenshots/7_WALLETPAGE_FRONTEND_TEST.png) and [Integration Logs](../test_screenshots/5INTEGRATION_TEST_SPRINT_1.png).
*   **KYC Mocking**: Tested the mock verification button to ensure it correctly triggers the "Verified" status on the profile.

---

## 3. Sprint 2 Expectations & Roadmap

The following members are tasked with the upcoming **Sprint 2** (Payment Enablement & Active Lending):

### 📅 Timeline & Documentation (Product Owner: Dhanya)
*   Create a **7-Day Implementation Timeline** for Sprint 2.
*   Formulate the **Final Expectation Document** defining clear success metrics for payment processing.

### 🛠️ Development & Requirements (Developers: Yogalakshmi, Harshith)
*   Create a **Step-by-Step Development Guide** for new contributors.
*   Document all **System Requirements** (from PostgreSQL installation to Environment variables).
*   Implement the **7-Day Late Payment Block** logic to prevent overdue users from lending.

### 📝 Project Handover (Testers: Nithin, Junaid)
*   Draft the official **Final README.md** for the GitHub repository.
*   Document the **Requirement Mapping** for Sprint 2 features (Extension of Due-dates, Bill payment, and Feedback loops).
