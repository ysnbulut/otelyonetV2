import { PageProps as BasePageProps } from '@/types'

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = BasePageProps<T> & {
  customer: {
    id: string;
    title: string,
    type: string,
    tax_number: string,
    email: string,
    phone: string,
    country: string,
    city: string,
    address: string,
  }
}
