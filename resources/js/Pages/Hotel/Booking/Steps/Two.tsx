import React from 'react'
import AvailableRooms from '@/Pages/Hotel/Booking/components/AvailableRooms'
import {StepTwoProps} from '@/Pages/Hotel/Booking/types/steps'
import Alert from '@/Components/Alert'
import Lucide from '@/Components/Lucide'

function Two(props: StepTwoProps) {
	return (
		<div className="mt-5 flex w-full flex-col items-center justify-center gap-5">
			{props.stepOneResults.data.length > 0 ? (
				props.stepOneResults.data.map((item, key) => (
					<AvailableRooms
						accommodationType={props.accommodationType}
						key={key}
						currency={props.stepOneResults.currency}
						item={item}
						request={props.stepOneResults.request}
						checkedRooms={props.checkedRooms}
						setCheckedRooms={props.setCheckedRooms}
						setDailyPrices={props.setDailyPrices}
						setRoomsGuests={props.setRoomsGuests}
						setStep={props.setStep}
					/>
				))
			) : (
				<div className="box w-full px-5 py-3">
					<Alert
						variant="outline-danger"
						className="mt-2 flex w-full items-center">
						{({dismiss}) => (
							<>
								<Lucide
									icon="AlertOctagon"
									className="mr-2 h-6 w-6"
								/>
								Uygun Oda Bulunamadı...
							</>
						)}
					</Alert>
				</div>
			)}
		</div>
	)
}

export default Two
