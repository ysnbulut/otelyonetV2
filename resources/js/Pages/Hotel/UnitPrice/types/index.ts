import {PageProps as BasePageProps} from '@/types'

interface UnitPriceProps {
	id: number
	booking_channel_id: number | null
	unit_price: number | null
}

export interface SeasonDataProps {
	id: number | null
	name?: string
	start_date?: string
	end_date?: string
	unit_prices: UnitPriceProps[] | UnitPriceProps | null
	channels?: boolean
	web?: boolean
	agency?: boolean
	reception?: boolean
}

interface OffSeasonDataProps {
	id: number | null
	name: string
	unit_prices: UnitPriceProps | null
}

export interface ActivatedChannelProps {
	id: number
	code: string
	name: string
}

export interface roomTypesAndViews {
	id: number
	name: string
	room_count: number
	warning: boolean
	seasons: SeasonDataProps[] | []
	unit_reception_base_price: OffSeasonDataProps
	unit_web_base_price: OffSeasonDataProps
	unit_channels_base_price: OffSeasonDataProps
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = BasePageProps<T> & {
	activatedChannels: ActivatedChannelProps[]
	roomTypesAndViews: roomTypesAndViews[]
	pricingPolicy: string
	pricingCurrency: string
	taxRate: number
}
