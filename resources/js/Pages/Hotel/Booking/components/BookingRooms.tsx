import React, {createRef, useEffect, useRef, useState} from 'react'
import dayjs from 'dayjs'
import Tippy from '@/Components/Tippy'
import Button from '@/Components/Button'
import Lucide from '@/Components/Lucide'
import {CitizenProps, GuestsProps, ItemsProps, PageProps, RoomsProps, TaxesProps} from '@/Pages/Hotel/Booking/types/show'
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
import {DateTime} from 'litepicker/dist/types/datetime'
import Litepicker, {LitepickerElement} from '@/Components/Litepicker'
import {includes} from 'lodash'

interface BookingRoomsProps {
	room: RoomsProps
	currency: string
	citizens: CitizenProps[]
	pricingPolicy: string
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
	const expendableDaysPicker = createRef<LitepickerElement>()
	const buttonRef = useRef<HTMLButtonElement>(null)
	const [selectedBookingGuests, setSelectedBookingGuests] = useState<number[]>([])
	const [roomGuests, setRoomGuests] = useState<GuestsProps[]>(props.room.guests)
	const [isLitepickerVisible, setIsLitepickerVisible] = useState(false)

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
		if (selectedBookingGuests.length === 0) {
			Toast.fire({
				icon: 'warning',
				title: 'Check-out yapılacak misafir seçilmedi',
			})
			return
		}
		router.post(
			route('hotel.booking_guests.check_out'),
			{
				booking_room_id: props.room.booking_room_id,
				booking_guests: selectedBookingGuests,
			},
			{
				preserveScroll: true,
				preserveState: true,
				// @ts-ignore
				onSuccess: (response: {props: PageProps}) => {
					setRoomGuests(response.props.booking.rooms.find((room: RoomsProps) => room.booking_room_id === props.room.booking_room_id)?.guests ?? props.room.guests)
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
		if (selectedBookingGuests.length === 0) {
			Toast.fire({
				icon: 'warning',
				title: 'Check-in yapılacak misafir seçilmedi',
			})
			return
		}
		router.post(
			route('hotel.booking_guests.check_in'),
			{
				booking_room_id: props.room.booking_room_id,
				booking_guests: selectedBookingGuests,
			},
			{
				preserveScroll: true,
				preserveState: false,
				// @ts-ignore
				onSuccess: (response: {props: PageProps}) => {
					// setRoomGuests(response.props.booking.rooms.find((room: RoomsProps) => room.booking_room_id === props.room.booking_room_id)?.guests ?? props.room.guests)
					// setSelectedBookingGuests([])
					Toast.fire({
						icon: 'success',
						title: 'Seçilen Misafirler Check-in yapıldı',
					})
				},
			},
		)
	}

	const handleKBSCheckIn = (e: any) => {
		e.preventDefault()
		router.post(
			route('hotel.kbs.check_in'),
			{
				booking_room_id: props.room.booking_room_id,
				booking_guests: selectedBookingGuests,
			},
			{
				preseveScroll: true,
				preseveState: false,
				// @ts-ignore
				onSuccess: (response: {props: PageProps}) => {},
			},
		)
	}

	const handleKBSCheckOut = (e: any) => {
		e.preventDefault()
		router.post(
			route('hotel.kbs.check_out'),
			{
				booking_room_id: props.room.booking_room_id,
				booking_guests: selectedBookingGuests,
			},
			{
				preseveScroll: true,
				preseveState: false,
				// @ts-ignore
				onSuccess: (response: {props: PageProps}) => {},
			},
		)
	}

	const expendableDays =
		props.room.extendable_number_of_days !== null ? (
			props.room.extendable_number_of_days
		) : (
			<Lucide
				icon="Infinity"
				className="h-4 w-4"
			/>
		)

	const KBSCheckInButtonCheck = () => {
		return (
			roomGuests.some((guest) => guest.can_be_check_out) &&
			roomGuests.length > 0 &&
			selectedBookingGuests.every((id) => roomGuests.find((guest) => guest.booking_guests_id === id)?.can_be_check_out) &&
			selectedBookingGuests.every(
				(id) =>
					roomGuests.find((guest) => guest.booking_guests_id === id)?.can_be_check_out === true &&
					roomGuests.find((guest) => guest.booking_guests_id === id)?.can_be_check_in === false &&
					roomGuests.find((guest) => guest.booking_guests_id === id)?.check_in_kbs === false &&
					roomGuests.find((guest) => guest.booking_guests_id === id)?.check_in_kbs === false,
			)
		)
	}

	const KBSCheckOutButtonCheck = () => {
		return (
			roomGuests.some((guest) => !guest.can_be_check_out && !guest.can_be_check_in) &&
			roomGuests.length > 0 &&
			selectedBookingGuests.every(
				(id) =>
					roomGuests.find((guest) => guest.booking_guests_id === id)?.can_be_check_out === false &&
					roomGuests.find((guest) => guest.booking_guests_id === id)?.can_be_check_in === false &&
					roomGuests.find((guest) => guest.booking_guests_id === id)?.check_in_kbs === true &&
					roomGuests.find((guest) => guest.booking_guests_id === id)?.check_out_kbs === false,
			)
		)
	}

	const handleShowLitepicker = () => {
		const button = buttonRef.current // Butonun referansı
		const litepicker = expendableDaysPicker.current // Litepicker'ın referansı

		if (button && litepicker && litepicker.litePickerInstance) {
			if (isLitepickerVisible) {
				// Litepicker şu anda gösteriliyorsa, gizle
				litepicker.litePickerInstance.hide()
			} else {
				// Litepicker şu anda gizliyse, göster
				const rect = button.getBoundingClientRect()
				const top = rect.bottom + window.scrollY
				const left = rect.left + window.scrollX
				litepicker.litePickerInstance.setOptions({
					parentEl: document.body,
					buttonText: {
						apply: 'Uzat',
						cancel: 'İptal',
					},
				})
				litepicker.litePickerInstance.show()
				// @ts-ignore
				const style = litepicker.litePickerInstance.ui.style
				style.position = 'absolute'
				style.top = `${top}px`
				style.left = `${left}px`
			}
			// Litepicker'ın gösterim durumunu güncelle
			setIsLitepickerVisible(!isLitepickerVisible)
		}
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
				{/*{((props.room.extendable_number_of_days !== null && props.room.extendable_number_of_days > 0) || props.room.extendable_number_of_days === null) && (*/}
				{/*	<Tippy*/}
				{/*		content="Odayı Süresini Uzat"*/}
				{/*		className="text-xs">*/}
				{/*		<Button*/}
				{/*			className="relative px-1.5 py-1 dark:bg-opacity-80"*/}
				{/*			variant="success"*/}
				{/*			ref={buttonRef}*/}
				{/*			onClick={(e: any) => {*/}
				{/*				e.preventDefault()*/}
				{/*				handleShowLitepicker()*/}
				{/*			}}>*/}
				{/*			<span className="absolute -left-2.5 -top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-danger text-[10px] text-white dark:bg-opacity-70">{expendableDays}</span>*/}
				{/*			<Lucide*/}
				{/*				icon="CalendarPlus"*/}
				{/*				className="mr-1 h-4 w-4"*/}
				{/*			/>*/}
				{/*			Süreyi Uzat*/}
				{/*		</Button>*/}
				{/*		<Litepicker*/}
				{/*			ref={expendableDaysPicker}*/}
				{/*			className="hidden"*/}
				{/*			id="check_in"*/}
				{/*			value={`${props.room.check_out} - ${props.room.check_out}`}*/}
				{/*			options={{*/}
				{/*				lang: 'tr-TR',*/}
				{/*				singleMode: false,*/}
				{/*				// elementEnd: checkOutPicker.current,*/}
				{/*				autoApply: false,*/}
				{/*				selectBackward: false,*/}
				{/*				selectForward: true,*/}
				{/*				resetButton: true,*/}
				{/*				autoRefresh: true,*/}
				{/*				allowRepick: true,*/}
				{/*				numberOfColumns: 1,*/}
				{/*				numberOfMonths: 1,*/}
				{/*				startDate: dayjs(props.room.check_out, 'DD.MM.YYYY').format('YYYY-MM-DD'),*/}
				{/*				endDate: dayjs(props.room.check_out, 'DD.MM.YYYY').add(1, 'day').format('YYYY-MM-DD'), // Başlangıç için varsayılan bitiş tarihi*/}
				{/*				tooltipText: {*/}
				{/*					one: 'gece',*/}
				{/*					other: 'gece',*/}
				{/*				},*/}
				{/*				tooltipNumber: (totalDays) => {*/}
				{/*					return totalDays - 1*/}
				{/*				},*/}
				{/*				format: 'DD.MM.YYYY',*/}
				{/*				plugins: ['mobilefriendly'],*/}
				{/*				mobileFriendly: true,*/}
				{/*				lockDaysFormat: 'YYYY-MM-DD',*/}
				{/*				lockDaysFilter: (date1: DateTime | null) => {*/}
				{/*					if (date1) {*/}
				{/*						const date1Dayjs = dayjs(date1.toJSDate())*/}
				{/*						if (date1Dayjs.isBefore(dayjs(props.room.check_out, 'DD.MM.YYYY'))) {*/}
				{/*							return true*/}
				{/*						}*/}
				{/*						if (props.room.extendable_number_of_days !== null) {*/}
				{/*							if (date1Dayjs.isAfter(dayjs(props.room.check_out, 'DD.MM.YYYY').add(props.room.extendable_number_of_days, 'day'))) {*/}
				{/*								return true*/}
				{/*							}*/}
				{/*						}*/}
				{/*					}*/}
				{/*					return false*/}
				{/*				},*/}
				{/*			}}*/}
				{/*			onChange={(date: string) => {*/}
				{/*				const dates = date.split(' - ')*/}
				{/*				let expendableStartDay = dates[0]*/}
				{/*				let expendableEndDay = dates[1]*/}
				{/*				if (!dayjs(expendableStartDay, 'DD.MM.YYYY').isSame(dayjs(props.room.check_out, 'DD.MM.YYYY'))) {*/}
				{/*					Toast.fire({*/}
				{/*						icon: 'error',*/}
				{/*						title: 'Süre Uzatma başlangıç tarihi rezervasyon çıkış tarihinden farklı olamaz!',*/}
				{/*					})*/}
				{/*					//Burda Litepickerin tarihini sıfırlamak lazım*/}
				{/*					if (expendableDaysPicker.current?.litePickerInstance) {*/}
				{/*						expendableDaysPicker.current.litePickerInstance.setDateRange(*/}
				{/*							dayjs(props.room.check_out, 'DD.MM.YYYY').format('YYYY-MM-DD'),*/}
				{/*							dayjs(props.room.check_out, 'DD.MM.YYYY').add(1, 'day').format('YYYY-MM-DD'),*/}
				{/*						)*/}
				{/*					}*/}
				{/*				}*/}
				{/*				if (dayjs(expendableStartDay, 'DD.MM.YYYY').isSame(dayjs(expendableEndDay, 'DD.MM.YYYY'))) {*/}
				{/*					expendableEndDay = dayjs().add(1, 'day').format('DD.MM.YYYY')*/}
				{/*				}*/}
				{/*			}}*/}
				{/*		/>*/}
				{/*	</Tippy>*/}
				{/*)}*/}
				{/*{dayjs(props.room.check_in, 'DD.MM.YYYY').isSameOrBefore(dayjs(), 'day') &&*/}
				{/*	dayjs(props.room.check_out, 'DD.MM.YYYY').isSameOrAfter(dayjs(), 'day') &&*/}
				{/*	props.room.guests.every((guest) => guest.is_check_in || props.room.guests.length === 0) && (*/}
				{/*		<Tippy*/}
				{/*			content="Odayı Rezervasyonunu Erken Bitir"*/}
				{/*			className="text-xs">*/}
				{/*			<Button*/}
				{/*				className="px-1.5 py-1 dark:bg-opacity-80"*/}
				{/*				variant="pending"*/}
				{/*				onClick={() => handleDeleteBookingRoom(props.room.booking_room_id)}>*/}
				{/*				<Lucide*/}
				{/*					icon="CalendarMinus"*/}
				{/*					className="mr-1 h-4 w-4"*/}
				{/*				/>*/}
				{/*				Erken Bitir*/}
				{/*			</Button>*/}
				{/*		</Tippy>*/}
				{/*	)}*/}
				{/*TODO: Buranın Channel Manage rolayına backendden bak*/}
				{/*{props.bookingRooms.length > 1 && dayjs(props.check_in, 'DD.MM.YYYY').isSameOrAfter(dayjs(), 'day') && (*/}
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
				<h3 className="w-full rounded-t-lg border-b bg-white px-5 py-1 text-right text-sm font-bold text-slate-400 lg:flex-row lg:gap-2 dark:bg-darkmode-600">
					Check-in - Check-out :
					<span
						className="ml-2 font-bold text-primary"
						style={{textShadow: '0.5px 0.5px 2px rgba(177, 200, 222, 0.9), -0.5px -0.5px rgba(177, 200, 222, 0.9)'}}>
						{props.room.check_in} - {props.room.check_out}
					</span>
				</h3>
				<h3 className="w-full border-b bg-white px-5 py-1 text-center text-sm font-semibold lg:flex-row lg:gap-2 dark:bg-darkmode-600">{props.room.name}'nolu oda misafirleri</h3>
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
							Çocuk Yaşları :<span className="ml-1 font-normal">{props.room.children_ages.length > 0 ? props.room.children_ages.join(', ') : 'Çocuk Yok'}</span>
						</span>
					)}
				</div>
				{roomGuests.length > 0 && <GuestStatusColors />}
				<div className="flex w-full flex-col text-sm font-semibold">
					{/*{roomGuests.length > 0 ? (*/}
					<BookingRoomGuestsTable
						guests={roomGuests}
						setSelectedBookingGuests={setSelectedBookingGuests}
					/>
					{/*) : (*/}
					<ShowRoomGuestAdd
						citizens={props.citizens}
						pricingPolicy={props.pricingPolicy}
						roomGuests={roomGuests}
						setRoomGuests={setRoomGuests}
						totalGuests={props.room.number_of_adults + props.room.number_of_children}
						bookingRoomId={props.room.booking_room_id}
						roomId={props.room.id}
					/>
					{/*)}*/}
					{roomGuests.length > 0 && (
						<div className="flex items-center justify-between gap-1 rounded-b-lg bg-white px-2 py-2 dark:bg-darkmode-600">
							<h3 className="text-xs font-semibold">Toplu İşlemler</h3>
							<div className="flex gap-2">
								{roomGuests.find((guest) => guest.can_be_check_in) &&
									roomGuests.length > 0 &&
									!roomGuests.filter((guest) => selectedBookingGuests.includes(guest.booking_guests_id)).find((guest) => !guest.can_be_check_in) && (
										<Tippy content="Seçilenleri Check-in Yap">
											<Button
												variant="soft-success"
												className="border border-success/70 px-2 py-1 shadow"
												onClick={(e: any) => handleSelectedGuestCheckIn(e)}>
												Check-in
											</Button>
										</Tippy>
									)}
								{roomGuests.find((guest) => guest.can_be_check_out) &&
									roomGuests.length > 0 &&
									!roomGuests.filter((guest) => selectedBookingGuests.includes(guest.booking_guests_id)).find((guest) => !guest.can_be_check_out) && (
										<Tippy content="Seçilenleri Check-out Yap">
											<Button
												variant="soft-dark"
												className="border border-dark/40 px-2 py-1 text-slate-800 shadow dark:bg-darkmode-300"
												onClick={(e: any) => handleSelectedGuestCheckOut(e)}>
												Check-out
											</Button>
										</Tippy>
									)}
								{KBSCheckInButtonCheck() && (
									<Tippy content="Seçilenlerin KBS Bildirimini Yap">
										<Button
											variant="soft-primary"
											className="border border-primary/40 px-2 py-1 text-primary shadow dark:bg-darkmode-300"
											onClick={(e: any) => handleKBSCheckIn(e)}>
											KBS Giriş
										</Button>
									</Tippy>
								)}
								{KBSCheckOutButtonCheck() && (
									<Tippy content="Seçilenlerin KBS Bildirimini Yap">
										<Button
											variant="soft-primary"
											className="border border-danger/40 px-2 py-1 text-danger shadow dark:bg-darkmode-300"
											onClick={(e: any) => handleKBSCheckOut(e)}>
											KBS Çıkış
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
