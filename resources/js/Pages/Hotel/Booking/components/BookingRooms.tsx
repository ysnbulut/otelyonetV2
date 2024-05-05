import React, {useState} from 'react'
import dayjs from 'dayjs'
import Tippy from '@/Components/Tippy'
import Button from '@/Components/Button'
import Lucide from '@/Components/Lucide'
import {
	CitizenProps,
	GuestsProps,
	ItemsProps,
	PageProps,
	RoomsProps,
	TaxesProps,
} from '@/Pages/Hotel/Booking/types/show'
import axios from 'axios'
import route from 'ziggy-js'
import GuestStatusColors from '@/Pages/Hotel/Booking/components/GuestStatusColors'
import BookingRoomGuestsTable from '@/Pages/Hotel/Booking/components/BookingRoomGuestsTable'
import ShowRoomGuestAdd from '@/Pages/Hotel/Booking/components/ShowRoomGuestAdd'
import {motion} from 'framer-motion'
import BookingRoomDocuments from '@/Pages/Hotel/Booking/components/BookingRoomDocuments'
import {router} from '@inertiajs/react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

interface BookingRoomsProps {
	room: RoomsProps
	currency: string
	citizens: CitizenProps[]
	taxes: TaxesProps[]
	items: ItemsProps[]
	bookingRooms: RoomsProps[]
	setBookingRooms: React.Dispatch<React.SetStateAction<RoomsProps[]>>
	setBalance: React.Dispatch<React.SetStateAction<{number: number; formatted: string}>>
	documentsBalance: {[key: string]: {number: number; formatted: string}}
	check_in: string
	setShowPaymentForm: React.Dispatch<React.SetStateAction<boolean>>
	paymentTypeOptions: {label: string; value: number}[]
	setPaymentDocumentIndex: React.Dispatch<React.SetStateAction<number>>
}

function BookingRooms(props: BookingRoomsProps) {
	const MySwal = withReactContent(Swal)
	const [selectedBookingGuests, setSelectedBookingGuests] = useState<number[]>([])
	const [roomGuests, setRoomGuests] = useState<GuestsProps[]>(props.room.guests)

	const Toast = MySwal.mixin({
		toast: true,
		position: 'top-right',
		showConfirmButton: false,
		timer: 3000,
		timerProgressBar: true,
		didOpen: (toast) => {
			toast.addEventListener('mouseenter', MySwal.stopTimer)
			toast.addEventListener('mouseleave', MySwal.resumeTimer)
		},
	})
	const handleDeleteBookingRoom = (bookingRoomId: number) => {
		// TODO: Backendi Revize olacak kısım burda toplam tutar ve ödemeler de etkilenicektir.
		// axios
		// 	.delete(route('hotel.booking_rooms.destroy', bookingRoomId))
		// 	.then((response) => {
		// 		props.setBookingRooms((prev) => prev.filter((room) => room.booking_room_id !== bookingRoomId))
		// 		props.setBalance((prev) => parseFloat((prev - response.data.total_price).toFixed(2)))
		// 	})
		// 	.catch((error) => {
		// 		console.log(error)
		// 	})
	}

	const handleSelectedGuestCheckOut = (e: any) => {
		e.preventDefault()
		router.post(
			route('hotel.booking_guests.check_out'),
			{
				booking_guests: selectedBookingGuests,
			},
			{
				preserveScroll: true,
				preserveState: true,
				// @ts-ignore
				onSuccess: (response: {props: PageProps}) => {
					setRoomGuests(
						response.props.booking.rooms.find((room: RoomsProps) => room.booking_room_id === props.room.booking_room_id)
							?.guests ?? props.room.guests,
					)
					setSelectedBookingGuests([])
					Toast.fire({
						icon: 'success',
						title: 'Seçilen Misafirler Check-out yapıldı',
					})
				},
			},
		)
	}

	const handleSelectedGuestCheckIn = (e: any) => {
		e.preventDefault()
		router.post(
			route('hotel.booking_guests.check_in'),
			{
				booking_guests: selectedBookingGuests,
			},
			{
				// @ts-ignore
				onSuccess: (response: {props: PageProps}) => {
					setRoomGuests(
						response.props.booking.rooms.find((room: RoomsProps) => room.booking_room_id === props.room.booking_room_id)
							?.guests ?? props.room.guests,
					)
					setSelectedBookingGuests([])
					Toast.fire({
						icon: 'success',
						title: 'Seçilen Misafirler Check-in yapıldı',
					})
				},
			},
		)
	}

	return (
		<fieldset className="relative w-full rounded-xl border-4 border-primary bg-primary/20 p-3 shadow-inner dark:border-red-500 dark:bg-darkmode-800/20">
			<motion.legend
				whileHover={{
					rotate: [0, 25, -15, 15, -20, -20, -5, 0],
					transition: {duration: 2, repeat: Infinity, repeatType: 'loop'},
				}}
				className="rounded-lg border-4 border-primary bg-primary/90 text-lg font-extrabold text-white">
				<motion.h2
					className="px-4 py-3 leading-none"
					whileHover={{
						x: [0, 12, -7, 14, -14, -12, -5, 0],
						transition: {duration: 2, repeat: Infinity, repeatType: 'loop'},
					}}>
					{props.room.name}
				</motion.h2>
			</motion.legend>
			<div className="absolute -top-9 right-3 flex gap-2">
				<Tippy
					content="Odayı Süresini Uzat"
					className="text-xs">
					<Button
						className="relative px-1.5 py-1 dark:bg-opacity-80"
						variant="success"
						onClick={() => handleDeleteBookingRoom(props.room.booking_room_id)}>
						<span className="absolute -left-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] text-white dark:bg-opacity-70">
							{props.room.extendable_number_of_days}
						</span>
						<Lucide
							icon="CalendarPlus"
							className="mr-1 h-4 w-4"
						/>
						Süreyi Uzat
					</Button>
				</Tippy>
				<Tippy
					content="Odayı Rezervasyonunu Erken Bitir"
					className="text-xs">
					<Button
						className="px-1.5 py-1 dark:bg-opacity-80"
						variant="pending"
						onClick={() => handleDeleteBookingRoom(props.room.booking_room_id)}>
						<Lucide
							icon="CalendarMinus"
							className="mr-1 h-4 w-4"
						/>
						Erken Bitir
					</Button>
				</Tippy>
				{/*TODO: Backendi revize olan kısım*/}
				{/*{props.bookingRooms.length > 1 && dayjs(props.check_in, 'DD.MM.YYYY').isAfter(dayjs(), 'day') && (*/}
				{/*	<Tippy*/}
				{/*		content="Odayı Rezervasyondan Çıkart"*/}
				{/*		className="">*/}
				{/*		<Button*/}
				{/*			className="px-1 py-0.5"*/}
				{/*			variant="danger"*/}
				{/*			onClick={() => handleDeleteBookingRoom(props.room.booking_room_id)}>*/}
				{/*			<Lucide*/}
				{/*				icon="X"*/}
				{/*				className="h-5 w-5"*/}
				{/*			/>*/}
				{/*		</Button>*/}
				{/*	</Tippy>*/}
				{/*)}*/}
			</div>
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
							roomId={props.room.id}
						/>
					)}
					{roomGuests.length > 0 && (
						<div className="flex items-center justify-between gap-1 rounded-b-lg bg-white px-2 py-2 dark:bg-darkmode-600">
							<h3 className="text-xs font-semibold">Toplu İşlemler</h3>
							<div className="flex gap-2">
								{roomGuests.find((guest) => guest.can_be_check_in) && roomGuests.length > 0 && (
									<Tippy content="Seçilenleri Check-in Yap">
										<Button
											variant="soft-success"
											className="border border-success/70 px-2 py-1 shadow"
											onClick={(e: any) => handleSelectedGuestCheckIn(e)}>
											Check-in
										</Button>
									</Tippy>
								)}
								{roomGuests.find((guest) => guest.can_be_check_out) && roomGuests.length > 0 && (
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
			<BookingRoomDocuments
				currency={props.currency}
				taxes={props.taxes}
				items={props.items}
				room={props.room}
				documentsBalance={props.documentsBalance}
				setShowPaymentForm={props.setShowPaymentForm}
				paymentTypeOptions={props.paymentTypeOptions}
				setPaymentDocumentIndex={props.setPaymentDocumentIndex}
			/>
		</fieldset>
	)
}

export default BookingRooms
