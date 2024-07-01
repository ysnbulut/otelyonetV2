import {RoomViewProps} from './index'
export interface DeleteItemDataProps {
	itemHeight: number
	roomView: RoomViewProps
	setRoomViews: React.Dispatch<React.SetStateAction<RoomViewProps[]>>
	setCanBeDeleted: React.Dispatch<React.SetStateAction<boolean>>
}
