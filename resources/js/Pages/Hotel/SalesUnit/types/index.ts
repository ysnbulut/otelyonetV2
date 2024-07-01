import {PageProps as BasePageProps} from '@/types'

export interface AreaDataProps {
	id: number
	name: string
}
export interface SalesUnitDataProps {
	id: number
	name: string
	description: string
	areas: AreaDataProps[]
	warning_message?: string
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = BasePageProps<T> & {
	salesUnits: SalesUnitDataProps[]
}
