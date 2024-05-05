import {PageProps as BasePageProps} from '@/types'

export interface BookingsData {
	id: number
	check_in: string
	check_out: null | string
	customer_id: number
	customer: string
	rooms: string
	rooms_count: number
	number_of_adults: number
	number_of_children: number
	amount: null | number
	amount_formatted: null | string
	remaining_balance: null | number
	remaining_balance_formatted: null | string
}

export interface Bookings {
	data: BookingsData[]
	path: string
	per_page: number
	next_cursor: string
	next_page_url: null | string
	prev_cursor: null | string
	prev_page_url: null | string
}

export interface IdName {
	id: number
	name: string
}

interface GuestProps {
	id: number
	name: string
	surname: string
	check_in: boolean
	check_out: boolean
	status: string
	check_in_date: string
	check_out_date: string
}

export interface BookedRoomRackCardProps extends IdName {
	booking_id: number
	guests: GuestProps[]
	check_in: string
	check_out: string
	alert_for_check_out: boolean
	now: string
	stay_duration: number
	remaining_time: number
	remaining_time_text: string
	remaining_time_bgcolor: string
}

export interface AvailableRoomRackCardProps extends IdName {
	available_text_bgcolor: string
	available_text: string
}

export interface Transactions {
	id: number
	customer_id: number
	type: string
	date: string
	amount: string
	info: string
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = BasePageProps<T> & {
	eur_exchange_rate: number
	room_count: number
	booked_rooms: BookedRoomRackCardProps[]
	booked_rooms_percent: string
	available_rooms: AvailableRoomRackCardProps[]
	available_rooms_percent: string
	dirty_rooms: IdName[]
	dirty_rooms_percent: string
	out_of_order_rooms: IdName[]
	out_of_order_rooms_percent: string
	guest_count: number
	today_check_in_guest_count: number
	today_check_out_guest_count: number
	tomorrow_check_in_guest_count: number
	tomorrow_check_out_guest_count: number
	// booked_rooms_yearly: number[]
	// booked_rooms_weekly: number[]
	transactions: Transactions[]
	is_tenant: boolean
}
