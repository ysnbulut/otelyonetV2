import React from 'react'

interface SummarySelectedRoomProps {
	room: {
		name: string
		count: number
	}
}

function SummarySelectedRoom(props: SummarySelectedRoomProps) {
	return (
		<div className="flex items-center justify-between border-b py-1 last:border-b-0">
			<span className="text-xs font-semibold">{props.room.name}</span>
			<span className="text-xs">{props.room.count} Adet</span>
		</div>
	)
}

export default SummarySelectedRoom
