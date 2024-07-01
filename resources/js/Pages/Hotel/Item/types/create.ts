import {PageProps as BasePageProps} from '@/types/index'

export interface IdNameProps {
	id: number
	name: string
}

export interface ValueLabelProps {
	rate: number
	value: number
	label: string
}

export interface ChannelProps extends IdNameProps {
	sales_unit_channel_id: number
}

export interface UnitChannelsItemPriceProps {
	sales_unit_channel_id: number
	price_rate: string
}

export type setDataByMethod = (data: (previousData: any) => any) => void

export interface SalesUnitProps extends IdNameProps {
	channels: ChannelProps[]
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = BasePageProps<T> & {
	currency: string
	categories: IdNameProps[]
	taxes: ValueLabelProps[]
	sales_units: SalesUnitProps[]
}
