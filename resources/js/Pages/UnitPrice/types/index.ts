import {PageProps as BasePageProps} from '@/types'

interface UnitPriceProps {
	id: number
	unit_price: number | null
}

export interface SeasonDataProps {
	id: number | null
	name: string
	unit_price: UnitPriceProps | null
}

interface OffSeasonDataProps {
	id: number
	name: string
	unit_price: UnitPriceProps | null
}

export interface roomTypesAndViews {
	id: number
	name: string
	room_count: number
	warning: boolean
	seasons: SeasonDataProps[] | []
	off_season: OffSeasonDataProps
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = BasePageProps<T> & {
	roomTypesAndViews: roomTypesAndViews[]
	pricingPolicy: string
	pricingCurrency: string
}
