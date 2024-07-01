import React, {useEffect, useState} from 'react'
import BookedRoomCard from '@/Pages/Hotel/Dashboard/components/BookedRoomCard'
import {AvailableRoomRackCardProps, BookedRoomRackCardProps, IdName} from '@/Pages/Hotel/Dashboard/types'
import AvailableRoomCard from '@/Pages/Hotel/Dashboard/components/AvailableRoomCard'
import DirtyRoomCard from '@/Pages/Hotel/Dashboard/components/DirtyRoomCard'
import OutOfOrderRoomCard from '@/Pages/Hotel/Dashboard/components/OutOfOrderRoomCard'

interface RoomRackCardsProps {
	room: BookedRoomRackCardProps | IdName | AvailableRoomRackCardProps
	roomRackType: string
}

function RoomRackCards(props: RoomRackCardsProps) {
	const [type, setType] = useState(props.roomRackType)

	useEffect(() => {
		setType(props.roomRackType)
	}, [props.roomRackType])

	if (type === 'booked_rooms') {
		return <BookedRoomCard room={props.room as BookedRoomRackCardProps} />
	}
	if (type === 'available_rooms') {
		return <AvailableRoomCard room={props.room as AvailableRoomRackCardProps} />
	}
	if (type === 'dirty_rooms') {
		return <DirtyRoomCard room={props.room} />
	}
	if (type === 'out_of_order_rooms') {
		return <OutOfOrderRoomCard room={props.room} />
	}
}

export default RoomRackCards
