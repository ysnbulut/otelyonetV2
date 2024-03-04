import React, {useEffect, useState} from 'react'
import dayjs from 'dayjs'
import Tippy from '@/Components/Tippy'
import Button from '@/Components/Button'
import Lucide from '@/Components/Lucide'
import {FormCheck} from '@/Components/Form'
import TableItem from '@/Pages/Hotel/Booking/components/TableItem'
import {RoomsProps} from '@/Pages/Hotel/Booking/types/show'
import axios from 'axios'
import route from 'ziggy-js'

interface BookingRoomsProps {
	room: RoomsProps
	booking_rooms: RoomsProps[]
	check_in: string
}

function BookingRooms(props: BookingRoomsProps) {
	const [selectedBookingGuests, setSelectedBookingGuests] = useState<number[]>([])
	const [guestAllChecked, setGuestAllChecked] = useState<boolean>(false)

	useEffect(() => {
		if (guestAllChecked) {
			setSelectedBookingGuests(props.room.guests.map((guest) => guest.booking_guests_id))
		}
	}, [guestAllChecked])

	useEffect(() => {
		console.log(selectedBookingGuests)
	}, [selectedBookingGuests])

	const handleDeleteBookingRoom = (bookingRoomId: number) => {
		axios
			.delete(route('hotel.booking_rooms.destroy', bookingRoomId))
			.then((response) => {
				console.log(response)
			})
			.catch((error) => {
				console.log(error)
			})
	}

	const handleSelectedGuestCheckOut = (e: any) => {
		e.preventDefault()
		axios
			.post(route('hotel.booking_guests.check_out'), {
				booking_guests: selectedBookingGuests,
			})
			.then((response) => {
				console.log(response)
			})
			.catch((error) => {
				console.log(error)
			})
	}

	const handleSelectedGuestCheckIn = (e: any) => {
		e.preventDefault()
		axios
			.post(route('hotel.booking_guests.check_in'), {
				booking_guests: selectedBookingGuests,
			})
			.then((response) => {
				console.log(response)
			})
			.catch((error) => {
				console.log(error)
			})
	}

	return (
		<fieldset className="relative w-full rounded-xl border-4 border-primary bg-primary/20 p-3 shadow-inner dark:border-red-500">
			<legend className="rounded-lg border-4  border-primary bg-primary px-3 py-1 text-lg font-extrabold text-white">
				{props.room.name}
			</legend>
			{props.booking_rooms.length > 1 && dayjs(props.check_in, 'DD.MM.YYYY').isAfter(dayjs(), 'day') && (
				<Tippy
					content="Odayı Rezervasyondan Çıkart"
					className="absolute -top-9 right-3">
					<Button
						className="px-1 py-0.5"
						variant="danger"
						onClick={() => handleDeleteBookingRoom(props.room.booking_room_id)}>
						<Lucide
							icon="X"
							className="h-5 w-5"
						/>
					</Button>
				</Tippy>
			)}
			<div className="intro-y flex flex-col items-start justify-between justify-items-start text-dark dark:text-light">
				<h3 className="w-full rounded-t-lg border-b bg-white px-5 py-1 text-center text-sm font-semibold lg:flex-row lg:gap-2 dark:bg-darkmode-200">
					{props.room.name}'nolu oda misafirleri
				</h3>
				<div className="flex w-full flex-col items-center justify-center gap-1 bg-white px-5 py-1 text-center text-sm font-semibold lg:flex-row lg:gap-2 dark:bg-darkmode-200">
					<span className="font-semibold">
						Yetişkin Sayısı :<span className="ml-1 font-normal">{props.room.number_of_adults}</span>
					</span>
					<span className="font-semibold">
						Çocuk Sayısı :<span className="ml-1 font-normal">{props.room.number_of_children}</span>
					</span>
					{props.room.number_of_children > 0 && (
						<span className="font-semibold">
							Çocuk Yaşları :
							<span className="ml-1 font-normal">
								{props.room.children_ages.length > 0 ? props.room.children_ages.join(', ') : 'Çocuk Yok'}
							</span>
						</span>
					)}
				</div>
				<div className="flex w-full items-center justify-between border-t bg-white px-3 py-2 dark:bg-darkmode-200">
					<h3 className="text-xs font-semibold">Misafir Durum Renkleri</h3>
					<div className="flex gap-2">
						<Tippy
							content="Bekleniyor"
							className="h-6 w-6 rounded-full bg-pending"
						/>
						<Tippy
							content="Gelmeyecek"
							className="h-6 w-6 rounded-full bg-danger"
						/>
						<Tippy
							content="Check İn"
							className="h-6 w-6 rounded-full bg-success"
						/>
						<Tippy
							content="Check Out"
							className="h-6 w-6 rounded-full bg-slate-700"
						/>
					</div>
				</div>
				<div className="flex w-full flex-col text-sm font-semibold">
					{props.room.guests.length > 0 ? (
						<table
							id="responsive-table"
							className="w-full border-spacing-y-[10px] border border-x-0 bg-white dark:bg-darkmode-200">
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
								{props.room.guests.map((guest, index) => (
									<TableItem
										key={index}
										index={index}
										guest={guest}
										checked={guestAllChecked}
										setSelectedBookingGuests={setSelectedBookingGuests}
									/>
								))}
							</tbody>
						</table>
					) : (
						<div className="w-full border border-x-0 bg-white px-2 py-2 dark:bg-darkmode-200">
							<h3 className="text-center text-sm text-danger">Misafir Bilgileri Henüz Girilmemiş.</h3>
						</div>
					)}
					<div className="flex items-center justify-between gap-1 rounded-b-lg bg-white px-2 py-2 dark:bg-darkmode-200">
						<h3 className="text-xs font-semibold">Toplu İşlemler</h3>
						<div className="flex gap-2">
							{dayjs(props.check_in, 'DD.MM.YYYY').isSame(dayjs(), 'day') &&
								props.room.can_be_check_in &&
								props.room.guests.length > 0 && (
									<Tippy content="Seçilenleri Check-in Yap">
										<Button
											variant="soft-success"
											className="border border-success/70 px-2 py-1 shadow"
											onClick={(e: any) => handleSelectedGuestCheckIn(e)}>
											Check-in
										</Button>
									</Tippy>
								)}
							{props.room.can_be_check_out && props.room.guests.length > 0 && (
								<Tippy content="Seçilenleri Check-out Yap">
									<Button
										variant="soft-dark"
										className="border border-dark/70 px-2 py-1 text-slate-800 shadow"
										onClick={(e: any) => handleSelectedGuestCheckOut(e)}>
										Check-out
									</Button>
								</Tippy>
							)}
						</div>
					</div>
				</div>
			</div>
		</fieldset>
	)
}

export default BookingRooms
