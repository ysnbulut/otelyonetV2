import {CheckedRoomsProps} from '@/Pages/Hotel/Booking/types/steps'

export interface RoomCheckButtonProps {
	itemId: number
	room: {id: number; name: string}
	checkedRooms: CheckedRoomsProps | undefined
	setCheckedRooms: React.Dispatch<React.SetStateAction<CheckedRoomsProps | undefined>>
	setRoomCount: React.Dispatch<React.SetStateAction<number>>
}
