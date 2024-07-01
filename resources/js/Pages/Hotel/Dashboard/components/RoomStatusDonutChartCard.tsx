import {memo} from 'react'
import RoomStatusTodayDonutChart from './RoomStatusDonutChart'

interface Props {
	bookedRoomsPercent: string
	availableRoomsPercent: string
	dirtyRoomsPercent: string
	outOfOrderRoomsPercent: string
}

const index = (props: Props) => {
	return (
		<div className="col-span-12 mt-8 sm:col-span-6 lg:col-span-6">
			<div className="intro-y flex h-10 items-center">
				<h2 className="mr-5 truncate text-lg font-medium">Sales Report</h2>
			</div>
			<div className="intro-y box mt-5 p-5">
				<div className="mt-3">
					<RoomStatusTodayDonutChart
						dataSet={[
							props.bookedRoomsPercent,
							props.availableRoomsPercent,
							props.dirtyRoomsPercent,
							props.outOfOrderRoomsPercent,
						]}
						height={382}
					/>
				</div>
				<div className="mx-auto mt-8 w-52 sm:w-auto">
					<div className="flex items-center">
						<div className="mr-3 h-2 w-2 rounded-full bg-success"></div>
						<span className="truncate">Dolu Oda</span>
						<span className="ml-auto font-medium">{props.bookedRoomsPercent}</span>
					</div>
					<div className="mt-4 flex items-center">
						<div className="mr-3 h-2 w-2 rounded-full bg-secondary"></div>
						<span className="truncate">Boş Oda</span>
						<span className="ml-auto font-medium">{props.availableRoomsPercent}</span>
					</div>
					<div className="mt-4 flex items-center">
						<div className="mr-3 h-2 w-2 rounded-full bg-pending"></div>
						<span className="truncate">Kirli Oda</span>
						<span className="ml-auto font-medium">{props.dirtyRoomsPercent}</span>
					</div>
					<div className="mt-4 flex items-center">
						<div className="mr-3 h-2 w-2 rounded-full bg-danger"></div>
						<span className="truncate">Satışa Kapalı Oda</span>
						<span className="ml-auto font-medium">{props.outOfOrderRoomsPercent}</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export default memo(index)
