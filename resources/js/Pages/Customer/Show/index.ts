import { BookingsData } from '@/Pages/Dashboard/index'

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
}
interface CaseAndBank {
    id: number;
    name: string;
    type: string;
    currency: string;
}

export interface Transactions {
    data: Transaction[] | [],
    path: string,
    per_page: number,
    next_cursor: string,
    next_page_url: null | string,
    prev_cursor: null | string,
    prev_page_url: null | string,
}

export interface Transaction {
    id: number;
    customer_id: number;
    type: string;
    date: string;
    amount: number;
    info: string;
}

interface Customer {
    id: number;
    title: string;
    type: string;
    tax_number: string;
    email: string;
    phone: string;
    country: string;
    city: string;
    address: string;
    remaining_balance: number;
    remaining_balance_formatted: string;
    transactions: Transactions;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
        role: string;
        permissions: string[];
        pricing_policy: string;
    },
    currency: string;
    customer: Customer;
    case_and_banks: CaseAndBank[];
}
