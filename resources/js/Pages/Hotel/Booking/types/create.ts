import {PageProps as BasePageProps} from '@/types'

export interface FirstStepProps {
	check_in: string
	check_out: string | null
	booking_type: string
	days_open?: number
	number_of_adults?: number
	number_of_children?: number
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = BasePageProps<T> & {}
