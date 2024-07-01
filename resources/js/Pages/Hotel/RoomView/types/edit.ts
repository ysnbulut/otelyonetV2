import {RoomViewProps} from './index'

export interface EditItemDataProps {
	roomView: RoomViewProps
	setRoomViews: React.Dispatch<React.SetStateAction<RoomViewProps[]>>
	setEdit: React.Dispatch<React.SetStateAction<boolean>>
}
