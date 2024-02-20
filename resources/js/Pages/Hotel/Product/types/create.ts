import {PageProps as BasePageProps} from '@/types/index'

export interface IdNameProps {
	id: number
	name: string
}

export interface ChannelProps extends IdNameProps {
	sales_unit_channel_id: number
}

export interface UnitChannelsProductPriceProps {
	sales_unit_channel_id: number
	price: string
}

export type setDataByMethod = (data: (previousData: any) => any) => void

export interface SalesUnitProps extends IdNameProps {
	channels: ChannelProps[]
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = BasePageProps<T> & {
	categories: IdNameProps[]
	sales_units: SalesUnitProps[]
}
