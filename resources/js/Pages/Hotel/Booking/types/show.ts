interface GuestsProps {
	booking_guests_id: number
	id: number
	name: string
	surname: string
	date_of_birth: string
	gender: string
	nationality: string
	identification_number: string
	is_check_in: boolean
	is_check_out: boolean
	status: string
	check_in_date: string
	check_out_date: string
	check_in_kbs: boolean
	check_out_kbs: boolean
}

interface RoomsProps {
	name: string
	room_type: string
	room_view: string
	room_type_full_name: string
	number_of_adults: number
	number_of_children: number
	children_ages: number[]
	guests: GuestsProps[]
}

interface BookingProps {
	id: number
	check_in: string
	check_out: string
	number_of_rooms: number
	number_of_adults: number
	number_of_children: number
	open_booking: string
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
interface CaseAndBankProps {
	id: number
	name: string
}

interface BookingPaymentsProps {
	id: number
	payment_date: string
	case_and_bank: CaseAndBankProps & {currency: string}
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

export type BookingShowProps = {
	currency: string
	accommodation_type: string
	booking: BookingProps
	customer: CustomerProps
	booking_payments: BookingPaymentsProps[]
	amounts: AmountsProps
	case_and_banks: CaseAndBankProps[]
	remaining_balance: number
	remaining_balance_formatted: string
}
