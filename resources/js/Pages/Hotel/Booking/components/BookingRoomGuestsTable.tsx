import React, {useEffect, useState} from 'react'
import {FormCheck} from '@/Components/Form'
import TableItem from '@/Pages/Hotel/Booking/components/TableItem'
import {GuestsProps} from '@/Pages/Hotel/Booking/types/show'

interface BookingRoomGuestsTableProps {
	guests: GuestsProps[]
	setSelectedBookingGuests: React.Dispatch<React.SetStateAction<number[]>>
}

function BookingRoomGuestsTable(props: BookingRoomGuestsTableProps) {
	const [guestAllChecked, setGuestAllChecked] = useState<boolean>(false)

	useEffect(() => {
		if (guestAllChecked) {
			props.setSelectedBookingGuests(props.guests.map((guest) => guest.booking_guests_id))
		}
	}, [guestAllChecked])

	return (
		<table
			id="responsive-table"
			className="w-full border-spacing-y-[10px] border border-x-0 bg-white dark:bg-darkmode-600">
			<thead className="border-b">
				<tr>
					<th
						className="text-xs"
						style={{paddingLeft: '0.75rem', paddingRight: '0.50rem', width: '2rem'}}>
						<FormCheck>
							<FormCheck.Input
								type="checkbox"
								id="check-all"
								name="check-all"
								checked={guestAllChecked}
								onChange={(e) => setGuestAllChecked(e.target.checked)}
							/>
						</FormCheck>
					</th>
					<th
						className="text-xs"
						style={{
							paddingLeft: '0.50rem',
							paddingRight: '0.50rem',
							textAlign: 'center',
						}}>
						Durum
					</th>
					<th
						className="text-left text-xs"
						style={{paddingLeft: '0.50rem', paddingRight: '0.50rem'}}>
						Ad
					</th>
					<th
						className="text-left text-xs"
						style={{paddingLeft: '0.50rem', paddingRight: '0.50rem'}}>
						Soyad
					</th>
					<th
						className="text-left text-xs"
						style={{paddingLeft: '0.50rem', paddingRight: '0.50rem', textAlign: 'center'}}>
						Uyruk
					</th>
					<th
						className="text-left text-xs"
						style={{paddingLeft: '0.50rem', paddingRight: '0.50rem', textAlign: 'right'}}>
						Kimlik / Pasaport No
					</th>
				</tr>
			</thead>
			<tbody>
				{props.guests.map((guest, index) => (
					<TableItem
						key={index}
						index={index}
						guest={guest}
						checked={guestAllChecked}
						setSelectedBookingGuests={props.setSelectedBookingGuests}
					/>
				))}
			</tbody>
		</table>
	)
}

export default BookingRoomGuestsTable
