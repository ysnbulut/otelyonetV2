import React from 'react'
import Lucide from '@/Components/Lucide'
import clsx from 'clsx'
import {twMerge} from 'tailwind-merge'
import GeneralReportCard from '@/Pages/Hotel/Dashboard/components/GeneralReportCard'

type IdName = {
	id: number
	name: string
}
interface Props {
	bookedRooms: IdName[]
	bookedRoomsPercent: string
	availableRooms: IdName[]
	availableRoomsPercent: string
	dirtyRooms: IdName[]
	dirtyRoomsPercent: string
	outOfOrderRooms: IdName[]
	outOfOrderRoomsPercent: string
}
function GeneralReports(props: Props) {
	return (
		<div className="col-span-12 mt-2">
			<div className="intro-y flex h-10 items-center">
				<h2 className="mr-5 truncate text-lg font-medium">Oda Raporu (Günlük)</h2>
			</div>
			<div className="mt-2 grid grid-cols-12 gap-6">
				<GeneralReportCard
					icon="DoorClosed"
					color="success"
					percent={props.bookedRoomsPercent}
					count={props.bookedRooms.length}
					title="Dolu Oda"
					content={props.bookedRooms}
				/>
				<GeneralReportCard
					icon="DoorOpen"
					color="slate-300"
					percent={props.availableRoomsPercent}
					count={props.availableRooms.length}
					title="Boş Oda"
					content={props.availableRooms}
				/>
				<GeneralReportCard
					icon="PartyPopper"
					color="pending"
					percent={props.dirtyRoomsPercent}
					count={props.dirtyRooms.length}
					title="Kirli Oda"
					content={props.dirtyRooms}
				/>
				<GeneralReportCard
					icon="Construction"
					color="danger"
					percent={props.outOfOrderRoomsPercent}
					count={props.outOfOrderRooms.length}
					title="Satışa Kapalı Oda"
					content={props.outOfOrderRooms}
				/>
			</div>
		</div>
	)
}

export default GeneralReports
