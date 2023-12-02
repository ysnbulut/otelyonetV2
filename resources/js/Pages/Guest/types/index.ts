import { PageProps as BasePageProps } from '@/types'

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
}
export interface GuestDataProps {
    id: number;
    full_name: string;
    nationality: string;
    phone: string;
    email: string;
}

export interface Links {
    url: null | string;
    label: string;
    active: boolean;
}

export interface Guests {
    current_page: number;
    data: GuestDataProps[] | [];
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

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = BasePageProps<T> & {
    guests: Guests;
    filters: {
        search: string;
        trashed: boolean;
    }
}
