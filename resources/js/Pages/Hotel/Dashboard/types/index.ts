import { PageProps as BasePageProps } from '@/types'

export interface BookingsData {
	id: number;
	check_in: string;
	check_out: null | string;
	open_booking: null | boolean;
	customer_id: number;
	customer: string;
	rooms: string;
	rooms_count: number;
	number_of_adults: number;
	number_of_children: number;
	amount: null | number;
	amount_formatted: null | string;
	remaining_balance: null | number;
	remaining_balance_formatted: null | string;
}

export interface Bookings {
    data: BookingsData[],
    path: string,
    per_page: number,
    next_cursor: string,
    next_page_url: null | string,
    prev_cursor: null | string,
    prev_page_url: null | string,
}

export interface Transactions {
    id: number;
    customer_id: number;
    type: string;
    date: string;
    amount: string;
    info: string;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = BasePageProps<T> & {
    room_count: number,
    booked_rooms: number,
    booked_rooms_percent: string,
    available_rooms: number,
    available_rooms_percent: string,
    dirty_rooms: number,
    dirty_rooms_percent: string,
    out_of_order_rooms: number,
    out_of_order_rooms_percent: string,
    guest_count: number,
    today_check_in_guest_count: number,
    today_check_out_guest_count: number,
    tomorrow_check_in_guest_count: number,
    tomorrow_check_out_guest_count: number,
    booked_rooms_yearly: string,
    booked_rooms_weekly: number[],
    transactions: Transactions[],
};
