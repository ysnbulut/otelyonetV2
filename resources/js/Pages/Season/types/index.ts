import {PageProps as BasePageProps} from '@/types'

export interface SeasonDataProps {
	id: string
	uid: string
	name: string
	start_date: string
	end_date: string
	backgroundColor: string
	textColor: string
	borderColor: string
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = BasePageProps<T> & {
	seasons: SeasonDataProps[]
}
