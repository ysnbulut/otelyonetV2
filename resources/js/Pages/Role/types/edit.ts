import { PageProps as BasePageProps } from '@/types'

interface RoleDataProps {
  id: number;
  name: string;
  guard_name: string;
}

interface PermissionDataProps {
  id: number;
  name: string;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = BasePageProps<T> & {
  role: RoleDataProps;
  rolePermissions: string[];
  permissions: PermissionDataProps[];
}
