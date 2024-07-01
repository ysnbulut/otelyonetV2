import {roomTypes} from './index'

export interface RoomTypesListProps {
	roomType: roomTypes
	setWarningBadge: (updateFunction: (prevWarnings: {[key: number]: boolean}) => {[key: number]: boolean}) => void
}
