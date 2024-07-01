import {RoomTypeBedsDataProps, BedsDataProps} from './edit'

export interface BedSectionProps {
	roomTypeId: number
	bedTypes: BedsDataProps[]
	roomTypeBeds: RoomTypeBedsDataProps[]
}
