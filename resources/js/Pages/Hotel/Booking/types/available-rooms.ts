import {PricesProps, StepOneRequestProps} from '@/Pages/Hotel/Booking/types/response'
import {StepsProps, CheckedRoomsProps, RoomTypeRoomGuestsProps, CheckedRoomsDailyPriceProps} from '@/Pages/Hotel/Booking/types/steps'

interface BedProps {
	name: string
	count: number
	person_num: number
}

interface RoomProps {
	id: number
	name: string
}

interface ResultDataProps {
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
	prices: PricesProps
}

export interface AvailableRoomsProps extends StepsProps {
	accommodationType: string
	selectedPrice: {[key: number]: string} | undefined
	currency: string
	item: ResultDataProps
	request: StepOneRequestProps
	checkedRooms: CheckedRoomsProps | undefined
	setSelectedPrice: React.Dispatch<React.SetStateAction<{[key: number]: string} | undefined>>
	setCheckedRooms: React.Dispatch<React.SetStateAction<CheckedRoomsProps | undefined>>
	setRoomsGuests: React.Dispatch<React.SetStateAction<RoomTypeRoomGuestsProps>>
	setDailyPrices: React.Dispatch<React.SetStateAction<CheckedRoomsDailyPriceProps | undefined>>
}
