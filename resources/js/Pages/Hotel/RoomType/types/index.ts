import {PageProps as BasePageProps} from '@/types'
export interface RoomTypeDataProps {
	id: number
	name: string
	description: string
	size: number
	adult_capacity: number
	child_capacity: number
	room_count: number
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = BasePageProps<T> & {
	roomTypes: RoomTypeDataProps[]
}
