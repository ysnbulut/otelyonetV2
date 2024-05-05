export interface StepOneRequestProps {
	booking_type: string
	check_in: string
	check_out: string | null
	number_of_adults: number
	number_of_children: number
	children_ages: number[]
}
export interface StepOneResponseProps {
	currency: string
	request: StepOneRequestProps
	night_count: number
	customers: CustomerProps[]
	guests: GuestProps[]
	data: StepOneDataProps[]
}

interface StepTwoRequestProps {
	room_type: string
	check_in: string
	check_out: string | null
	number_of_adults: number
	number_of_children: number
	children_ages: number[]
	checked_rooms: number[] | null
	rooms: string[] | null
	price: number
	price_formatter: string
}

export interface StepTwoResponseProps {
	currency: string
	request: StepTwoRequestProps
	data: StepTwoDataProps
}

interface BedProps {
	name: string
	count: number
	person_num: number
}

export interface RoomProps {
	id: number
	name: string
}

interface IdAndProps {
	id: number
	type_id: number
	view_id: number
}

export interface DailyPriceProps {
	date: string
	price: number
	fprice: string
	fprice_with_currency: string
}

interface TotalPriceProps {
	price: number
	fprice: string
	fprice_with_currency: string
}

export interface PriceProps extends IdAndProps {
	exchange_rate: number
	currency: string
	daily_prices: DailyPriceProps[]
	multiplier: number
	total_price: TotalPriceProps
}

export interface StepOneDataProps {
	id: number
	name: string
	photos: string[]
	size: number
	room_count: number
	available_room_count: number
	adult_capacity: number
	child_capacity: number
	beds: BedProps[]
	rooms: RoomProps[]
	price: PriceProps
}

export interface CustomerProps {
	id: number
	title: string
	type: string
	tax_office: string
	tax_number: string
	country: string
	city: string
	address: string
	phone: string
	email: string
}

export interface GuestProps {
	id?: number
	name: string
	surname: string
	birthday: string
	is_foreign_national: boolean
	citizen_id: string
	citizen?: string | null
	identification_number: string
	phone?: string | null
	email?: string | null
	gender?: string | null
}

interface StepTwoDataProps {
	night_count: number
	day_count: number
	rooms: RoomProps[]
	currency: string
	customers: CustomerProps[]
}
