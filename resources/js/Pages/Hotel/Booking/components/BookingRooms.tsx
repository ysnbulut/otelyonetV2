import React, {useEffect, useState} from 'react'
import dayjs from 'dayjs'
import Tippy from '@/Components/Tippy'
import Button from '@/Components/Button'
import Lucide from '@/Components/Lucide'
import {CitizenProps, GuestsProps, RoomsProps} from '@/Pages/Hotel/Booking/types/show'
import axios from 'axios'
import route from 'ziggy-js'
import GuestStatusColors from '@/Pages/Hotel/Booking/components/GuestStatusColors'
import BookingRoomGuestsTable from '@/Pages/Hotel/Booking/components/BookingRoomGuestsTable'
import ShowRoomGuestAdd from '@/Pages/Hotel/Booking/components/ShowRoomGuestAdd'
import {CheckedRoomsProps} from '@/Pages/Hotel/Booking/types/steps'

interface BookingRoomsProps {
	room: RoomsProps
	citizens: CitizenProps[]
	bookingRooms: RoomsProps[]
	setBookingRooms: React.Dispatch<React.SetStateAction<RoomsProps[]>>
	setBalance: React.Dispatch<React.SetStateAction<number>>
	check_in: string
}

function BookingRooms(props: BookingRoomsProps) {
	const [selectedBookingGuests, setSelectedBookingGuests] = useState<number[]>([])
	const [roomGuests, setRoomGuests] = useState<GuestsProps[]>(props.room.guests)
	const handleDeleteBookingRoom = (bookingRoomId: number) => {
		axios
			.delete(route('hotel.booking_rooms.destroy', bookingRoomId))
			.then((response) => {
				props.setBookingRooms((prev) => prev.filter((room) => room.booking_room_id !== bookingRoomId))
				props.setBalance((prev) => parseFloat((prev - response.data.total_price).toFixed(2)))
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
			{props.bookingRooms.length > 1 && dayjs(props.check_in, 'DD.MM.YYYY').isAfter(dayjs(), 'day') && (
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
				<h3 className="w-full rounded-t-lg border-b bg-white px-5 py-1 text-center text-sm font-semibold lg:flex-row lg:gap-2 dark:bg-darkmode-600">
					{props.room.name}'nolu oda misafirleri
				</h3>
				<div className="flex w-full flex-col items-center justify-center gap-1 bg-white px-5 py-1 text-center text-sm font-semibold lg:flex-row lg:gap-2 dark:bg-darkmode-600">
					<span className="font-semibold">
						Yetişkin Sayısı :<span className="ml-1 font-normal">{props.room.number_of_adults}</span>
					</span>
					{props.room.number_of_children > 0 && (
						<span className="font-semibold">
							Çocuk Sayısı :<span className="ml-1 font-normal">{props.room.number_of_children}</span>
						</span>
					)}
					{props.room.number_of_children > 0 && (
						<span className="font-semibold">
							Çocuk Yaşları :
							<span className="ml-1 font-normal">
								{props.room.children_ages.length > 0 ? props.room.children_ages.join(', ') : 'Çocuk Yok'}
							</span>
						</span>
					)}
				</div>
				{roomGuests.length > 0 && <GuestStatusColors />}
				<div className="flex w-full flex-col text-sm font-semibold">
					{roomGuests.length > 0 ? (
						<BookingRoomGuestsTable
							guests={roomGuests}
							setSelectedBookingGuests={setSelectedBookingGuests}
						/>
					) : (
						<ShowRoomGuestAdd
							citizens={props.citizens}
							setRoomGuests={setRoomGuests}
							totalGuests={props.room.number_of_adults + props.room.number_of_children}
							bookingRoomId={props.room.booking_room_id}
						/>
					)}
					{roomGuests.length > 0 && (
						<div className="flex items-center justify-between gap-1 rounded-b-lg bg-white px-2 py-2 dark:bg-darkmode-600">
							<h3 className="text-xs font-semibold">Toplu İşlemler</h3>
							<div className="flex gap-2">
								{dayjs(props.check_in, 'DD.MM.YYYY').isSame(dayjs(), 'day') &&
									props.room.can_be_check_in &&
									roomGuests.length > 0 && (
										<Tippy content="Seçilenleri Check-in Yap">
											<Button
												variant="soft-success"
												className="border border-success/70 px-2 py-1 shadow"
												onClick={(e: any) => handleSelectedGuestCheckIn(e)}>
												Check-in
											</Button>
										</Tippy>
									)}
								{props.room.can_be_check_out && roomGuests.length > 0 && (
									<Tippy content="Seçilenleri Check-out Yap">
										<Button
											variant="soft-dark"
											className="border border-dark/40 px-2 py-1 text-slate-800 shadow dark:bg-darkmode-300"
											onClick={(e: any) => handleSelectedGuestCheckOut(e)}>
											Check-out
										</Button>
									</Tippy>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
		</fieldset>
	)
}

export default BookingRooms
