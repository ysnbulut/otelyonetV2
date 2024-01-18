import {PageProps as BasePageProps} from '@/types'

export interface BedTypeProps {
	id: number
	name: string
	person_num: number
	description: string
	warning_message: string
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = BasePageProps<T> & {
	bedTypes: BedTypeProps[]
}
