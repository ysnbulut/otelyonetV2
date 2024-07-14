import {PageProps as BasePageProps} from '@/types'

interface RoomsProps {
	id: number
	title: string
	building: string
	floor: string
	type_and_view: string
	type_and_view_id: number
}

interface BookingsProps {
	id: number
	resourceId: number
	typeHasViewId: number
	title: string
	start: string
	end: string
	nights: number
	earlyCheckOut: boolean
	backgroundColor: string
	textColor: string
	borderColor: string
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = BasePageProps<T> & {
	check_in_time: string
	check_out_time: string
	rooms: RoomsProps[]
	bookings: BookingsProps[]
}
