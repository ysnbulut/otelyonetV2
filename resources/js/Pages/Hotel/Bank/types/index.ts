import { PageProps as BasePageProps, User } from '@/types'

interface BankDataProps {
  id: number;
  name: string;
  currency: string;
  type: string;
  balance: string;
}

export interface Links {
  url: null | string;
  label: string;
  active: boolean;
}

export interface Banks {
  current_page: number;
  data: BankDataProps[] | [];
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
  banks: Banks;
  filters: {
    search: string;
    trashed: boolean;
  }
}
