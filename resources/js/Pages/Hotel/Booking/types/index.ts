import {PageProps as BasePageProps} from '@/types'

interface BookingDataProps {
	id: number
	check_in: string
	check_out: string | null
	open_booking: boolean
	customer_id: number
	customer: string
	rooms: string
	rooms_count: number
	number_of_adults: number
	number_of_children: number
	amount: number
	amount_formatted: string
	remaining_balance: number
	remaining_balance_formatted: string
}

export interface Links {
	url: null | string
	label: string
	active: boolean
}

export interface BookingsProps {
	current_page: number
	data: BookingDataProps[] | []
	first_page_url: string
	from: number
	last_page: number
	last_page_url: string
	links: Links[]
	next_page_url: string | null
	path: string | null
	per_page: number
	prev_page_url: string | null
	to: number
	total: number
}

interface FiltersProps {
	search: string
	trashed: boolean
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = BasePageProps<T> & {
	currency: string
	bookings: BookingsProps
	filters: FiltersProps
}
