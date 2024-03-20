import {CustomerProps, GuestProps, StepOneResponseProps, StepOneDataProps} from '@/Pages/Hotel/Booking/types/response'
import {CitizenProps} from '@/Pages/Hotel/Booking/types/show'

export interface StepOneRequestProps {
	check_in: string
	check_out: string | null
	booking_type: string
	days_open?: number
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
}

export interface CheckedRoomsProps {
	[key: number]: number[]
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
		price: string
		total_price: string
	}[]
	grand_total_price?: string
}

export interface StepTwoProps extends StepsProps {
	accommodationType: string
	stepOneResults: StepOneResponseProps
	bookingType: string
	checkedRooms: CheckedRoomsProps | undefined
	setCheckedRooms: React.Dispatch<React.SetStateAction<CheckedRoomsProps | undefined>>
	setRoomsGuests: React.Dispatch<React.SetStateAction<RoomTypeRoomGuestsProps>>
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
	setStep: React.Dispatch<React.SetStateAction<number>>
	data: StepOneDataProps[]
	roomsGuests: RoomTypeRoomGuestsProps
	setRoomsGuests: React.Dispatch<React.SetStateAction<RoomTypeRoomGuestsProps>>
}

export interface RoomGuestsProps {
	[key: number]: GuestProps[]
}

export interface RoomTypeRoomGuestsProps {
	[key: number]: RoomGuestsProps
}
