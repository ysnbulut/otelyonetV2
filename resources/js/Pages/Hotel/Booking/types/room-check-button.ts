export interface RoomCheckButtonProps {
	room: {id: number; name: string}
	checkedRoom: boolean | number
	setCheckedRoom: (room: boolean | number) => void
}
