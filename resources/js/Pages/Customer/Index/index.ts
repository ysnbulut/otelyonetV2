export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
}
interface CustomerDataProps {
    id: number;
    title: string;
    type: string;
    tax_number: string;
    remaining_balance: number;
    remaining_balance_formatted: string;
}

export interface Links {
    url: null | string;
    label: string;
    active: boolean;
}

interface Customers {
    current_page: number;
    data: CustomerDataProps[] | [];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Links[];
    next_page_url: string | null;
    path: string | null;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
        role: string;
        permissions: string[];
        pricing_policy: string;
    },
    customers: Customers;
    filters: {
        search: string;
        trashed: boolean;
    }
}
