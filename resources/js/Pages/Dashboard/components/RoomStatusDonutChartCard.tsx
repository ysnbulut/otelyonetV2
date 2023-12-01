import { memo } from 'react'
import RoomStatusTodayDonutChart from '@/Components/RoomStatusTodayDonutChart'

interface Props {
	bookedRoomsPercent: string;
	availableRoomsPercent: string;
	dirtyRoomsPercent: string;
	outOfOrderRoomsPercent: string;
}

const index = (props: Props) => {
		return (
			<div className='col-span-12 mt-8 sm:col-span-6 lg:col-span-6'>
				<div className='flex items-center h-10 intro-y'>
					<h2 className='mr-5 text-lg font-medium truncate'>
						Sales Report
					</h2>
				</div>
				<div className='p-5 mt-5 intro-y box'>
					<div className='mt-3'>
						<RoomStatusTodayDonutChart
							dataSet={[props.bookedRoomsPercent, props.availableRoomsPercent, props.dirtyRoomsPercent, props.outOfOrderRoomsPercent]}
							height={382} />
					</div>
					<div className='mx-auto mt-8 w-52 sm:w-auto'>
						<div className='flex items-center'>
							<div className='mr-3 h-2 w-2 rounded-full bg-success'></div>
							<span className='truncate'>Dolu Oda</span>
							<span className='ml-auto font-medium'>{props.bookedRoomsPercent}</span>
						</div>
						<div className='mt-4 flex items-center'>
							<div className='mr-3 h-2 w-2 rounded-full bg-pending'></div>
							<span className='truncate'>Boş Oda</span>
							<span className='ml-auto font-medium'>{props.availableRoomsPercent}</span>
						</div>
						<div className='mt-4 flex items-center'>
							<div className='mr-3 h-2 w-2 rounded-full bg-danger'></div>
							<span className='truncate'>Kirli Oda</span>
							<span className='ml-auto font-medium'>{props.dirtyRoomsPercent}</span>
						</div>
						<div className='mt-4 flex items-center'>
							<div className='mr-3 h-2 w-2 rounded-full bg-dark'></div>
							<span className='truncate'>Satışa Kapalı Oda</span>
							<span className='ml-auto font-medium'>{props.outOfOrderRoomsPercent}</span>
						</div>
					</div>
				</div>
			</div>
		)
}

export default memo(index)
