import {PageProps as BasePageProps} from '@/types'

export interface SeasonCalendarProps {
	uid: string
	name: string
	description: string
	start_date: string
	end_date: string
	channels: boolean
	web: boolean
	agency: boolean
	reception: boolean
}

export interface SeasonDataProps {
	id: string
	uid: string
	name: string
	description: string
	start_date: string
	end_date: string
	channels: boolean
	online: boolean
	web: boolean
	agency: boolean
	reception: boolean
	backgroundColor: string
	textColor: string
	borderColor: string
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = BasePageProps<T> & {
	seasons: SeasonDataProps[]
}
