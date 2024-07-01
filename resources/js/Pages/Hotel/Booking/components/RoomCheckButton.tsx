import React, {useEffect, useState} from 'react'
import Button from '@/Components/Button'
import {RoomCheckButtonProps} from '@/Pages/Hotel/Booking/types/room-check-button'

function RoomCheckButton({itemId, room, checkedRooms, setCheckedRooms, setRoomCount}: RoomCheckButtonProps) {
	const [check, setCheck] = useState<boolean>(false)

	useEffect(() => {
		checkedRooms && setCheck(Array.isArray(checkedRooms[itemId]) && checkedRooms[itemId].includes(room.id))
	}, [checkedRooms, room.id])

	return (
		<Button
			onClick={() => {
				setCheckedRooms((prevCheckedRooms) => {
					const updatedCheckedRooms = prevCheckedRooms ? [...(prevCheckedRooms[itemId] || [])] : []
					const roomIndex = updatedCheckedRooms.indexOf(room.id)
					if (roomIndex !== -1) {
						updatedCheckedRooms.splice(roomIndex, 1)
					} else {
						updatedCheckedRooms.push(room.id)
					}
					if (updatedCheckedRooms.length === 0) {
						prevCheckedRooms && delete prevCheckedRooms[itemId]
						setRoomCount(0)
						return prevCheckedRooms ? {...prevCheckedRooms} : undefined
					} else {
						return prevCheckedRooms
							? {...prevCheckedRooms, [itemId]: updatedCheckedRooms}
							: {[itemId]: updatedCheckedRooms}
					}
				})
			}}
			variant={check ? 'primary' : 'secondary'}
			className="col-span-4 flex items-center justify-center rounded px-0 py-0 font-bold sm:col-span-3 md:col-span-3 lg:col-span-2 xl:col-span-2">
			{room.name}
		</Button>
	)
}

export default RoomCheckButton
