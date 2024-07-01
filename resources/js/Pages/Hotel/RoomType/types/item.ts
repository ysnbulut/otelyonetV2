export interface RoomTypeDataProps {
	id: number
	name: string
	description: string
	size: number
	adult_capacity: number
	child_capacity: number
	room_count: number
	warning_message?: string
}

export interface ItemProps {
	roomType: RoomTypeDataProps
	setRoomTypes: React.Dispatch<React.SetStateAction<RoomTypeDataProps[]>>
}
