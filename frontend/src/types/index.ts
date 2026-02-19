export interface User {
    id: string;
    role: "STUDENT" | "EMPLOYEE" | "ADMIN";
    name: string;
}

export interface AuthResponse {
    token: string;
}

export interface Wallet {
    balance: number;
    paymentSources: PaymentSource[];
    transactions: Transaction[];
}

export interface PaymentSource {
    id: string;
    type: "UPI" | "CARD" | "BANK";
    provider: string;
    identifier: string;
}

export interface Transaction {
    id: string;
    wallet_id: string;
    amount: number;
    transaction_type: "CREDIT" | "DEBIT";
    description: string;
    created_at: string;
}

export interface Profile {
    name: string;
    email: string;
    dob: string;
    address?: string;
    mobile?: string;
    avatarUrl?: string;
    alternateEmail?: string;
    preferences?: string[];
}

export interface Booking {
    id: string;
    book_id: string;
    borrow_date: string;
    due_date: string;
    status: "ACTIVE" | "RETURNED" | "OVERDUE" | "LOST";
    book?: {
        title: string;
        author: string;
    }
}
