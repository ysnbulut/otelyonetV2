import React, {useEffect, useState} from 'react'
import Button from '@/Components/Button'
import {RoomCheckButtonProps} from '@/Pages/Hotel/Booking/types/room-check-button'

function RoomCheckButton({room, checkedRoom, setCheckedRoom}: RoomCheckButtonProps) {
	const [check, setCheck] = useState<boolean>(false)
	useEffect(() => {
		if (checkedRoom === false && !check) {
			setCheck(false)
		} else {
			checkedRoom === room.id ? setCheck(true) : setCheck(false)
		}
	}, [checkedRoom])
	return (
		<Button
			onClick={() => {
				if (checkedRoom === room.id && check) {
					setCheck(false)
					setCheckedRoom(false)
				} else {
					setCheckedRoom(room.id)
				}
			}}
			variant={check ? 'primary' : 'secondary'}
			className="col-span-1 flex items-center justify-center rounded px-0 py-0 font-bold">
			{room.name}
		</Button>
	)
}

export default RoomCheckButton
