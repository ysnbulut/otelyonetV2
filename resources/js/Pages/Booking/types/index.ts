import { PageProps as BasePageProps} from '@/types';
interface BookingDataProps {
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

export interface BookingsProps {
  current_page: number;
  data: BookingDataProps[] | [];
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

interface FiltersProps {
  search: string;
  trashed: boolean;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = BasePageProps<T> & {
  banks: Banks;
  filters: FiltersProps;
};
