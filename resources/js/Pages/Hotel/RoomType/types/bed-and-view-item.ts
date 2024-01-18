import {RoomTypeBedsDataProps, BedsDataProps, ViewsDataProps} from '@/Pages/Hotel/RoomType/types/edit'

export interface ItemProps {
	roomTypeId: number
	id: number
	name: string
	count?: number
	warning_message?: string
	setRoomTypeBeds?: React.Dispatch<React.SetStateAction<RoomTypeBedsDataProps[]>>
	setBedTypes?: React.Dispatch<React.SetStateAction<{label: string; value: number}[]>>
	setViews?: React.Dispatch<React.SetStateAction<{label: string; value: number}[]>>
	setRoomTypeViews?: React.Dispatch<React.SetStateAction<ViewsDataProps[]>>
}
