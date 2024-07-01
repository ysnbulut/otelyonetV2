import {PageProps as BasePageProps} from '@/types'

interface MultiplierProps {
	id: number
	multiplier: number | null
}

export interface VariationDataProps {
	id: number | null
	number_of_adults: number
	number_of_children: number
	multiplier: MultiplierProps | null
}

export interface roomTypes {
	id: number
	name: string
	room_count: number
	warning: boolean
	variations: VariationDataProps[]
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = BasePageProps<T> & {
	roomTypes: roomTypes[]
}
