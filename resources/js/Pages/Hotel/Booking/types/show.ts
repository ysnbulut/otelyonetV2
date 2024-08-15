import {PageProps as BasePageProps} from '@/types'

export interface GuestsProps {
	booking_guests_id: number
	id: number
	name: string
	surname: string
	birthday: string
	gender: string
	citizen: string
	citizen_id: string
	identification_number: string
	can_be_check_in: boolean
	can_be_check_out: boolean
	is_check_in?: boolean
	is_check_out?: boolean
	status: string
	check_in_date: string
	check_out_date: string
	check_in_kbs: boolean
	check_out_kbs: boolean
}

export interface DocumentItemsProps {
	name: string
	description: string
	price: number
	price_formatted: string
	quantity: number
	tax_name: string
	tax_rate: number
	tax: number
	tax_formatted: string
	total: number
	total_formatted: string
	discount: number
	discount_formatted: string
	grand_total: number
	grand_total_formatted: string
}

interface DocumentTotalsProps {
	type: string
	amount: number
	amount_formatted: string
	sort_order: number
}

interface DocumentPaymentsProps {
	id: number
	transaction_id: number
	paid_at: string
	amount: number
	amount_formatted: string
	description: string
}

interface DocumentCustomerProps {
	id: number
	type: string
	title: string
	tax_office: string
	tax_number: string
	email: string
	phone: string
	country: string
	city: string
	address: string
}

export interface DocumentProps {
	id: number
	type: string
	customer: DocumentCustomerProps
	number: string
	status: string
	currency: string
	currency_rate: number
	issue_date: string
	due_date: string
	items: DocumentItemsProps[]
	totals: DocumentTotalsProps[]
	payments: DocumentPaymentsProps[]
	balance: number
	balance_formatted: string
}

interface DailyPricesProps {
	date: string
	original_price: number
	original_price_formatted: string
	discount: number
	discount_formatted: string
	price: number
	price_formatted: string
}

export interface RoomsProps {
	booking_room_id: number
	id: number
	name: string
	room_type: string
	room_view: string
	room_type_full_name: string
	check_in: string
	check_out: string
	number_of_adults: number
	number_of_children: number
	children_ages: number[]
	daily_prices: DailyPricesProps[]
	documents: DocumentProps[]
	guests: GuestsProps[]
	extendable_number_of_days: number | null
}

interface BookingProps {
	id: number
	booking_code: string
	channel_id: number
	channel_code: string
	channel: string
	check_in: string
	check_out: string
	number_of_rooms: number
	number_of_adults: number
	number_of_children: number
	stay_duration_days: string
	stay_duration_nights: string
	rooms: RoomsProps[]
}

interface CustomerProps {
	id: number
	title: string
	type: string
	tax_number: string
	tax_office: string
	country: string
	city: string
	address: string
	phone: string
	email: string
}

interface BankProps {
	id: number
	name: string
}

interface BookingPaymentsProps {
	id: number
	payment_date: string
	bank: BankProps & {currency: string}
	currency: string
	currency_amount: number
	currency_amount_formatted: string
	amount_paid: number
	amount_paid_formatted: string
	payment_method: string
	description: string
}

interface AmountsProps {
	id: number
	price: number
	price_formatted: string
	campaign: number
	discount: number
	discount_formatted: string
	total_price: number
	total_price_formatted: string
	tax_rate: number
	tax: number
	tax_formatted: string
	grand_total: number
	grand_total_formatted: string
}

interface BookingMessagesProps {
	id: number
	message: string
	is_reminder: boolean
	reminder_date: string
	is_read: boolean
}

export interface CitizenProps {
	id: number
	name: string
}

export interface TaxesProps {
	id: number
	name: string
	rate: number
}

export interface ItemsProps {
	id: number
	item_category_id: number
	item_category: string
	name: string
	description: string
	type: string
	price: number
	price_formatted: string
	tax_id: number
	tax_name: string
	tax_rate: number
	tax: number
	tax_formatted: string
	total_price: number
	total_price_formatted: string
	preparation_time: number
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = BasePageProps<T> & {
	currency: string
	accommodation_type: string
	pricing_policy: string
	kbs: boolean
	citizens: CitizenProps[]
	taxes: TaxesProps[]
	items: ItemsProps[]
	booking: BookingProps
	customer: CustomerProps
	booking_payments: BookingPaymentsProps[]
	amounts: AmountsProps
	banks: BankProps[]
	extendable_number_of_days: number
	remaining_balance: number
	remaining_balance_formatted: string
	booking_messages: BookingMessagesProps[]
}
