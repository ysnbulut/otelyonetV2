interface BedProps {
	name: string
	count: number
	person_num: number
}

interface RoomProps {
	id: number
	name: string
}

interface GroupPriceProps {
	text: string
	total_price: string
	total_price_formatter: string
	multiplier: number
}
interface PriceProps {
	id: number
	type_id: number
	view_id: number
	prices: GroupPriceProps[]
}

interface ResultDataProps {
	id: number
	name: string
	size: number
	room_count: number
	available_room_count: number
	adult_capacity: number
	child_capacity: number
	beds: BedProps[]
	rooms: RoomProps[]
	price: PriceProps
}

export interface GroupResultProps {
	currency: string
	data: ResultDataProps[]
}
