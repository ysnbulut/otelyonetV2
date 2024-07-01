import {PageProps as BasePageProps} from '@/types'

export interface RoomViewProps {
	id: number
	name: string
	description: string
	warning_message: string
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = BasePageProps<T> & {
	roomViews: RoomViewProps[]
}
