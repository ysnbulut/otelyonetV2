import { PageProps as BasePageProps } from '@/types'

interface Links {
  url: null | string;
  label: string;
  active: boolean;
}
interface UserDataProps {
  id: number;
  name: string;
  email: string;
  role: string;
  photo: string;
  gender: string;
  active: boolean;
}

interface Users {
  current_page: number;
  data: UserDataProps[] | [];
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
  users: Users;
  filters: {
    search: string;
    trashed: boolean;
  }
}
