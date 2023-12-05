import { PageProps as BasePageProps } from '@/types'

export interface UpdateUserDataProps {
  id: number;
  name: string;
  email: string;
  photo: string;
  gender: string;
  active: boolean;
  password: string,
  password_confirmation: string,
  password_change: boolean,
  role: number,
}

interface UserDataProps {
  id: number;
  name: string;
  email: string;
  photo: string;
  gender: string;
  active: boolean;
}

interface RoleDataProps {
  id: number;
  name: string;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = BasePageProps<T> & {
  user: UserDataProps;
  user_role: string;
  roles: RoleDataProps[];
}
