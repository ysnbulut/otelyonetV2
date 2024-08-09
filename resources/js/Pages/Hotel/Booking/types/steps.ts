import {CustomerProps, GuestProps, StepOneResponseProps, StepOneDataProps, DailyPriceProps} from '@/Pages/Hotel/Booking/types/response'
import {CitizenProps} from '@/Pages/Hotel/Booking/types/show'

export interface StepOneRequestProps {
	check_in: string
	check_out: string | null
	booking_type: string
	number_of_adults?: number
	number_of_children?: number
}

export interface StepsProps {
	setStep: React.Dispatch<React.SetStateAction<number>>
}

export interface StepOneProps extends StepsProps {
	baby_age_limit: number
	child_age_limit: number
	accommodation_type: string
	setBookingType: React.Dispatch<React.SetStateAction<string>>
	setStepOneResults: React.Dispatch<React.SetStateAction<StepOneResponseProps | undefined>>
	setCheckinRequired: React.Dispatch<React.SetStateAction<boolean>>
	setCheckedRooms: React.Dispatch<React.SetStateAction<CheckedRoomsProps | undefined>>
	setDailyPrices: React.Dispatch<React.SetStateAction<CheckedRoomsDailyPriceProps | undefined>>
}

export interface CheckedRoomsProps {
	[key: number]: number[]
}

// export type RoomDailyPriceProps = DailyPriceProps[]
export interface RoomDailyPriceProps {
	[key: number]: DailyPriceProps[]
}

// export type CheckedRoomsDailyPriceProps = RoomDailyPriceProps[]
export interface CheckedRoomsDailyPriceProps {
	[key: number]: RoomDailyPriceProps[]
}

export interface BookingResultProps {
	check_in: string
	check_out: string | null
	night_count?: number | null | undefined | string
	booking_type: string
	number_of_adults_total?: number
	number_of_children_total?: number
	typed_rooms?: {
		id: number
		name: string
		count: number
		price: number
		total_price: number
	}[]
	grand_total_price?: string
}

export interface StepTwoProps extends StepsProps {
	accommodationType: string
	selectedPrice: {[key: number]: string} | undefined
	stepOneResults: StepOneResponseProps
	bookingType: string
	checkedRooms: CheckedRoomsProps | undefined
	setSelectedPrice: React.Dispatch<React.SetStateAction<{[key: number]: string} | undefined>>
	setCheckedRooms: React.Dispatch<React.SetStateAction<CheckedRoomsProps | undefined>>
	setRoomsGuests: React.Dispatch<React.SetStateAction<RoomTypeRoomGuestsProps>>
	setDailyPrices: React.Dispatch<React.SetStateAction<CheckedRoomsDailyPriceProps | undefined>>
}

export interface StepThreeProps extends StepsProps {
	customers: CustomerProps[]
	customerId: number | undefined
	setCustomerId: React.Dispatch<React.SetStateAction<number | undefined>>
	setStepOneResults: React.Dispatch<React.SetStateAction<StepOneResponseProps | undefined>>
	setBookingCustomer: React.Dispatch<React.SetStateAction<CustomerProps | undefined>>
}

export interface StepFourProps {
	guests: GuestProps[]
	checkedRooms: CheckedRoomsProps | undefined
	citizens: CitizenProps[]
	pricingPolicy: string
	setStep: React.Dispatch<React.SetStateAction<number>>
	data: StepOneDataProps[]
	totalGuests: number
	roomsGuests: RoomTypeRoomGuestsProps
	setRoomsGuests: React.Dispatch<React.SetStateAction<RoomTypeRoomGuestsProps>>
}

export interface RoomGuestsProps {
	[key: number]: GuestProps[]
}

export interface RoomTypeRoomGuestsProps {
	[key: number]: RoomGuestsProps
}
