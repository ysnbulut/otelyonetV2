import { PageProps as BasePageProps } from '@/types'

interface UserDataProps {
  id: number;
  name: string;
  email: string;
  password: string,
  password_confirmation: string,
  role: number,
}

interface RoleDataProps {
	id: number;
	name: string;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = BasePageProps<T> & {
  user: UserDataProps;
	roles: RoleDataProps[];
}
