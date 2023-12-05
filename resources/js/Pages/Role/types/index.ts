import { PageProps as BasePageProps } from '@/types'

interface Links {
	url: null | string;
	label: string;
	active: boolean;
}
interface RoleDataProps {
	id: number;
	name: string;
	guard_name: string;
	permissions: string;
}

interface Roles {
	current_page: number;
	data: RoleDataProps[] | [];
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
	roles: Roles;
	filters: {
		search: string;
		trashed: boolean;
	},
  flash: {
    success: string;
    errors: string[];
    message: string;
    info: string;
    warning: string;
    status: string;
    old: string[];
  },
  can: {
    create: boolean;
    update: boolean;
    edit: boolean;
    delete: boolean;
    restore: boolean;
    forceDelete: boolean;
  }
}
