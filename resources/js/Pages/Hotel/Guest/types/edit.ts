import {PageProps as BasePageProps} from '@/types'

export interface Guest {
	id: number
	name: string
	surname: string
	full_name: string
	birthday: string
	citizen_id: number
	is_foreign_national: boolean
	identification_number: string
	phone: string
	email: string
	gender: string
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = BasePageProps<T> & {
	citizens: Array<{id: number; name: string; code: number}>
	guest: Guest
}
