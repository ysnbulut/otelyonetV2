export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string;
}
export interface Guest {
  id: number;
  name: string;
  surname: string;
  full_name: string;
  nationality: string;
  identification_number: string;
  phone: string;
  email: string;
  gender: string;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
  auth: {
    user: User;
    role: string;
    permissions: string[];
    pricing_policy: string;
  },
  guest: Guest;
}
