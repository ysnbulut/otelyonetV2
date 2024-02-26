import {PageProps as BasePageProps} from '@/types'

export interface Guest {
	id: number
	name: string
	surname: string
	full_name: string
	date_of_birth: string
	nationality: string
	identification_number: string
	phone: string
	email: string
	gender: string
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = BasePageProps<T> & {
	guest: Guest
}
