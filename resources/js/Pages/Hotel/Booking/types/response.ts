export interface ResponseProps {
	currency: string
	data: dataProps[]
}

interface BedProps {
	name: string
	count: number
	person_num: number
}

interface RoomProps {
	id: number
	name: string
}

interface GroupPricesProps {
	text: string
	multiplier: number
	total_price: string
	total_price_formatter: string
}

interface GroupPricePorps {
	id: number
	type_id: number
	view_id: number
	prices: GroupPricesProps[]
}

interface PriceProps {
	id: number
	type_id: number
	view_id: number
	total_price: string
	total_price_formatter: string
	multiplier: number
}

interface dataProps {
	id: number
	name: string
	size: number
	room_count: number
	available_room_count: number
	adult_capacity: number
	child_capacity: number
	beds: BedProps[]
	rooms: RoomProps[]
	price: PriceProps | GroupPricePorps
}
