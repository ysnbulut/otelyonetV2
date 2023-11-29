import { User } from '@/Pages/Customer/types/index'

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
  auth: {
    user: User;
    role: string;
    permissions: string[];
    pricing_policy: string;
  },
}
