import { PageProps as BasePageProps } from '@/types'

interface PermissionDataProps {
	id: number;
	name: string;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = BasePageProps<T> & {
	permissions: PermissionDataProps[];
}
