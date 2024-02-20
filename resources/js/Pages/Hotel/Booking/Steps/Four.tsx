import React, {useEffect} from 'react'
import {StepFourProps} from '@/Pages/Hotel/Booking/types/steps'
import RoomGuests from '@/Pages/Hotel/Booking/components/RoomGuests'
import Button from '@/Components/Button'
import Tippy from '@/Components/Tippy'
import Lucide from '@/Components/Lucide'

function Four(props: StepFourProps) {
	useEffect(() => {
		console.log('props.roomsGuests', props.roomsGuests)
	}, [props.data])
	return (
		<div className="box p-5">
			{props.data.map(
				(room_type, index) =>
					props.checkedRooms &&
					props.checkedRooms[room_type.id] &&
					props.checkedRooms[room_type.id].length > 0 && (
						<fieldset
							key={index}
							className="mb-5 rounded border p-5 last:mb-0">
							<legend>{room_type.name}</legend>
							{props.checkedRooms[room_type.id].map((room, index) => {
								const groom = room_type.rooms.find((r) => r.id === room)
								return (
									<div key={index}>
										<div className="border-b py-2">
											<h3 className="text-lg font-semibold">{groom?.name} No'lu Oda için Misafir Bilgileri</h3>
										</div>
										{props.roomsGuests &&
											props.roomsGuests[room_type.id] &&
											Object.values(props.roomsGuests[room_type.id]).length > 0 &&
											groom &&
											Object.keys(props.roomsGuests[room_type.id][groom.id]).map((guest, index) => (
												<RoomGuests
													key={index}
													guestIndex={index}
													guest={props.roomsGuests[room_type.id][groom.id][index]}
													roomTypeId={room_type.id}
													roomId={groom?.id}
													setRoomsGuests={props.setRoomsGuests}
												/>
											))}
										<div className="mt-2 flex justify-end">
											<Tippy content="Misafir Ekle">
												<Button
													type="button"
													variant="soft-primary"
													onClick={(e: any) => {
														e.preventDefault()
														props.setRoomsGuests((roomsGuests) => {
															return {
																...roomsGuests,
																[room_type.id]: {
																	...roomsGuests[room_type.id],
																	[room]: [
																		...roomsGuests[room_type.id][room],
																		{
																			name: '',
																			surname: '',
																			identification_number: '',
																			is_foreign_national: false,
																		},
																	],
																},
															}
														})
													}}>
													<Lucide
														icon="Plus"
														className="h-5 w-5"
													/>
												</Button>
											</Tippy>
										</div>
									</div>
								)
							})}
						</fieldset>
					),
			)}
		</div>
	)
}

export default Four
