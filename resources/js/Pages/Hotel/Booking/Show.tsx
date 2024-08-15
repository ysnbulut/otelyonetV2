import React, {useEffect, useState, useRef, createRef} from 'react'
import AuthenticatedLayout from '@/Layouts/HotelAuthenticatedLayout'
import {Head, Link, router, useForm} from '@inertiajs/react'
import Button from '@/Components/Button'
import route from 'ziggy-js'
import Lucide from '@/Components/Lucide'
import {twMerge} from 'tailwind-merge'
import {FormInput, FormLabel} from '@/Components/Form'
import Litepicker, {LitepickerElement} from '@/Components/Litepicker'
import TomSelect from '@/Components/TomSelect'
import CurrencyInput from 'react-currency-input-field'
import {PageProps, RoomsProps} from '@/Pages/Hotel/Booking/types/show'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import Tippy from '@/Components/Tippy'
import BookingRooms from '@/Pages/Hotel/Booking/components/BookingRooms'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Select, {SelectInstance} from 'react-select'
import axios from 'axios'
import {Page} from '@inertiajs/inertia'
import {motion} from 'framer-motion'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import {DateTime} from 'litepicker/dist/types/datetime'
import ExpendBookingPeriod from '@/Pages/Hotel/Booking/components/ExpendBookingPeriod'

dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)
dayjs.extend(customParseFormat)

function Show(props: PageProps) {
	const expendableDaysPicker = createRef<LitepickerElement>()
	const paymentTypeSelectRef = useRef<SelectInstance>(null)
	const buttonRef = useRef<HTMLButtonElement>(null)
	const MySwal = withReactContent(Swal)
	const [isLitepickerVisible, setIsLitepickerVisible] = useState(false)
	const [showPaymentForm, setShowPaymentForm] = useState<boolean>(false)
	const [bookingRooms, setBookingRooms] = useState<RoomsProps[]>(props.booking.rooms)
	const [expendBookingPeriodModalOpen, setExpendBookingPeriodModalOpen] = useState<boolean>(false)
	const [balance, setBalance] = useState<{number: number; formatted: string}>({
		number: props.remaining_balance,
		formatted: props.remaining_balance_formatted,
	})
	const [documentsBalance, setDocumentsBalance] = useState<{[key: number]: {number: number; formatted: string}}>(
		props.booking.rooms
			.map((room) =>
				room.documents.map((document) => ({
					[document.id]: {number: document.balance, formatted: document.balance_formatted},
				})),
			)
			.flat()
			.reduce((acc, val) => ({...acc, ...val}), {}),
	)
	const [paymentDocumentIndex, setPaymentDocumentIndex] = useState<number>(0)
	const [maxAmount, setMaxAmount] = useState<number>(props.remaining_balance)
	const [maxAmountErr, setMaxAmountErr] = useState<string>('Girilen tutar bakiyeden fazla olamaz!')
	const {data, setData, post, processing, errors, setError} = useForm({
		customer_id: props.customer.id,
		type: 'income',
		payment_date: dayjs().format('DD.MM.YYYY'),
		bank_id: '',
		currency: 'TRY',
		currency_rate: 1, //todo buuuuu
		payment_method: '',
		amount: props.remaining_balance > 0 ? Math.abs(props.remaining_balance).toString() : '0', //TODO bunları checket
		description: '',
	})

	const Toast = MySwal.mixin({
		toast: true,
		position: 'top-end',
		showConfirmButton: false,
		timer: 3000,
		timerProgressBar: true,
		didOpen: (toast) => {
			toast.addEventListener('mouseenter', MySwal.stopTimer)
			toast.addEventListener('mouseleave', MySwal.resumeTimer)
		},
	})

	useEffect(() => {
		setData((data) => ({...data, currency: 'TRY', bank_id: '', payment_method: '', description: ''}))
		paymentTypeSelectRef.current?.selectOption(paymentTypeOptions[paymentDocumentIndex])
		const document = props.booking.rooms.flatMap((room) => room.documents).find((document) => document.id === paymentTypeOptions[paymentDocumentIndex].value)
		if (document) {
			if (paymentDocumentIndex > 0 && document.balance) {
				setData((data) => ({
					...data,
					document_id: paymentTypeOptions[paymentDocumentIndex].value,
					amount: document.balance.toFixed(2),
				}))
				setMaxAmount(document.balance)
				setMaxAmountErr('Girilen tutar seçilen folyo bakiyesinden fazla olamaz!')
			} else {
				setData((data) => ({...data, amount: props.remaining_balance.toFixed(2)}))
				setMaxAmountErr('Girilen tutar bakiyeden fazla olamaz!')
			}
		} else {
			setData((data) => ({...data, amount: props.remaining_balance.toFixed(2)}))
			setMaxAmountErr('Girilen tutar bakiyeden fazla olamaz!')
		}
	}, [paymentDocumentIndex])

	useEffect(() => {
		setData((data) => ({...data, amount: '0'}))
		if (data.currency !== 'TRY') {
			axios
				.post(route('amount.exchange'), {
					amount: props.remaining_balance > 0 ? Math.abs(props.remaining_balance).toString() : '0',
					currency: data.currency,
				})
				.then((response) => {
					setData((data) => ({
						...data,
						amount: response.data.total,
						currency_rate: response.data.exchange_rate,
					}))
					setMaxAmount(response.data.total)
				})
				.catch((error) => {
					console.log(error)
				})
		} else {
			setData((data) => ({
				...data,
				amount: props.remaining_balance > 0 ? Math.abs(props.remaining_balance).toString() : '0',
				currency_rate: 1,
			}))
		}
	}, [data.currency])

	const accommodationTypes: {[key: string]: string} = {
		only_room: 'Sadece Oda',
		room_breakfast: 'Oda ve Kahvaltı',
		half_board: 'Yarım Pansiyon',
		full_board: 'Tam Pansiyon',
		all_inclusive: 'Her Şey Dahil',
		ultra_all_inclusive: 'Ultra Her Şey Dahil',
	}

	const accommodationType = accommodationTypes[props.accommodation_type] || 'Sadece Oda'

	const paymentTypeOptions = [
		{
			value: 0,
			label: 'Genel Tahsilat',
		},
	].concat(
		props.booking.rooms.flatMap((room) =>
			room.documents.map((document) => ({
				value: document.id,
				label: `${document.number}'nolu Folyo`,
			})),
		),
	)

	const paymentFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		post(route('hotel.bookings.transaction.store', props.booking.id), {
			// @ts-ignore
			onSuccess: (response: Page<PageProps>) => {
				setBalance({number: response.props.remaining_balance, formatted: response.props.remaining_balance_formatted})
				setDocumentsBalance(
					response.props.booking.rooms
						.map((room) =>
							room.documents.map((document) => ({
								[document.id]: {number: document.balance, formatted: document.balance_formatted},
							})),
						)
						.flat()
						.reduce((acc, val) => ({...acc, ...val}), {}),
				)
				setShowPaymentForm(false)
				setData((data) => ({
					...data,
					payment_date: dayjs().format('DD.MM.YYYY'),
					bank_id: '',
					currency: 'TRY',
					payment_method: '',
					amount: response.props.remaining_balance > 0 ? Math.abs(response.props.remaining_balance).toString() : '0',
					description: '',
				}))
			},
			preserveState: false,
			preserveScroll: true,
		})
	}

	const bookingCancel = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		router.delete(route('hotel.bookings.destroy', props.booking.id), {
			onSuccess: () => {
				Toast.fire({
					icon: 'success',
					title: 'Rezervasyon iptal edildi',
				})
			},
		})
	}

	const handleFinishBooking = () => {
		MySwal.fire({
			title: 'Rezervasyonu Erken Bitir',
			text: 'Rezervasyonu erken bitirmek istediğinizden emin misiniz?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Evet',
			cancelButtonText: 'Hayır',
			confirmButtonColor: '#d33',
			cancelButtonColor: '#3085d6',
		}).then((result) => {
			if (result.isConfirmed) {
				props.booking.rooms.forEach((room) => {
					room.daily_prices.forEach((dailyPrice) => {
						console.log(dailyPrice)
					})
					room.documents.forEach((document) => {
						document.payments.forEach((payment) => {
							console.log(payment)
						})
					})
				})
			}
		})
	}

	const expendableDays =
		props.extendable_number_of_days !== null ? (
			props.extendable_number_of_days
		) : (
			<Lucide
				icon="Infinity"
				className="h-4 w-4"
			/>
		)

	const showLitepicker = () => {
		const button = buttonRef.current // Butonun referansı
		const litepicker = expendableDaysPicker.current // Litepicker'ın referansı
		if (button && litepicker && litepicker.litePickerInstance) {
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
	}

	const handleShowLitepicker = () => {
		const litepicker = expendableDaysPicker.current // Litepicker'ın referansı
		if (litepicker && litepicker.litePickerInstance) {
			if (isLitepickerVisible) {
				// Litepicker şu anda gösteriliyorsa, gizle
				litepicker.litePickerInstance.hide()
			} else {
				// Litepicker şu anda gizliyse, göster
				showLitepicker()
			}
		}
		setIsLitepickerVisible(!isLitepickerVisible)
	}

	return (
		<>
			<Head title="Rezervasyon Detayı" />
			<div className="flex grid-cols-12 flex-col-reverse gap-3 xl:flex-row">
				<div className="w-full xl:w-2/3">
					<div className="box relative mt-5 grid grid-cols-12">
						<motion.div
							initial={{scale: 0.5, y: -11, x: 32}}
							animate={{scale: 1, y: 0, x: 0}}
							whileHover={{
								scale: 1.1,
								y: 2,
								x: -8,
								transition: {duration: 1},
							}}
							className="absolute right-0 top-0 z-50 flex">
							<Tippy
								className="h-11 w-40 rounded-tr-md border-b border-l border-slate-100/20 bg-white/30 p-2"
								content="Rezervasyon Kodu">
								<h3 className="text-center text-base font-extrabold text-slate-50">{props.booking.booking_code}</h3>
							</Tippy>
							<Tippy
								content="Rezervasyon Kanalı"
								className="absolute right-0 top-11 w-40 rounded-bl border-y border-l border-indigo-500/80 bg-indigo-600/80 p-2 shadow">
								<h6 className="rounded text-center text-xs font-semibold text-slate-50">{props.booking.channel}</h6>
							</Tippy>
						</motion.div>
						<div className="-intro-y col-span-12 rounded-t-md border-b border-teal-700 bg-teal-600 px-4 py-5 dark:bg-teal-700/40">
							<h3 className="rounded-md text-xl font-bold text-light">Rezervasyon Bilgileri</h3>
							<div className="flex flex-col items-start justify-between justify-items-start py-3 text-light lg:flex-row">
								<div className="flex w-full flex-col text-sm font-semibold">
									<span className="font-semibold">
										Giriş Tarihi :<span className="ml-1 font-normal">{props.booking.check_in}</span>
									</span>
									<span className="font-semibold">
										Çıkış Tarihi :<span className="ml-1 font-normal">{props.booking.check_out}</span>
									</span>
									<span className="font-semibold">
										Seçilen Oda Türleri :<span className="ml-1 font-normal">{bookingRooms.map((room) => room.room_type_full_name).join(', ')}</span>
									</span>
								</div>
								<div className="flex w-full flex-col text-sm font-semibold lg:ml-5">
									<span className="font-semibold">
										Konaklama Süresi :<span className="ml-1 font-normal">{props.booking.stay_duration_nights}</span>
									</span>
									<span className="font-semibold">
										Rezervasyon Tipi :
										<span className="ml-1 font-normal">
											{props.booking.check_out === null && ' Açık'}
											{props.booking.number_of_rooms > 1 ? ' Gurup' : ' Normal'} Rezervasyon
										</span>
									</span>
									<span className="font-semibold">
										Konaklama Türü :<span className="ml-1 font-normal">{accommodationType}</span>
									</span>
								</div>
							</div>
							<div className="mt-2 flex w-full justify-end gap-3">
								{dayjs(props.booking.check_out, 'DD.MM.YYYY').isSameOrAfter(dayjs(), 'day') && (
									<>
										{/*{((props.extendable_number_of_days !== null && props.extendable_number_of_days > 0) || props.extendable_number_of_days === null) && (*/}
										{/*	<>*/}
										{/*		<Button*/}
										{/*			variant="soft-success"*/}
										{/*			ref={buttonRef}*/}
										{/*			onClick={(e: any) => {*/}
										{/*				e.preventDefault()*/}
										{/*				handleShowLitepicker()*/}
										{/*			}}*/}
										{/*			className="intro-x relative flex items-center justify-center border-2 border-success/60 py-1 text-white/70">*/}
										{/*			<Lucide*/}
										{/*				icon="CalendarPlus"*/}
										{/*				className="mr-1 h-5 w-5"*/}
										{/*			/>*/}
										{/*			SÜREYİ UZAT*/}
										{/*			<span className="absolute -right-3 -top-3 flex h-6 w-6 items-center justify-center rounded-full border-2 border-success/60 bg-danger text-xs">{expendableDays}</span>*/}
										{/*		</Button>*/}
										{/*		<Litepicker*/}
										{/*			ref={expendableDaysPicker}*/}
										{/*			className="hidden"*/}
										{/*			id="check_in"*/}
										{/*			value={`${props.booking.check_out} - ${props.booking.check_out}`}*/}
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
										{/*				startDate: dayjs(props.booking.check_out, 'DD.MM.YYYY').format('YYYY-MM-DD'),*/}
										{/*				endDate: dayjs(props.booking.check_out, 'DD.MM.YYYY').add(1, 'day').format('YYYY-MM-DD'), // Başlangıç için varsayılan bitiş tarihi*/}
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
										{/*						if (date1Dayjs.isBefore(dayjs(props.booking.check_out, 'DD.MM.YYYY'))) {*/}
										{/*							return true*/}
										{/*						}*/}
										{/*						if (props.extendable_number_of_days !== null) {*/}
										{/*							if (date1Dayjs.isAfter(dayjs(props.booking.check_out, 'DD.MM.YYYY').add(props.extendable_number_of_days, 'day'))) {*/}
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
										{/*				if (!dayjs(expendableStartDay, 'DD.MM.YYYY').isSame(dayjs(props.booking.check_out, 'DD.MM.YYYY'))) {*/}
										{/*					Toast.fire({*/}
										{/*						icon: 'error',*/}
										{/*						title: 'Süre Uzatma başlangıç tarihi rezervasyon çıkış tarihinden farklı olamaz!',*/}
										{/*					})*/}
										{/*					//Burda Litepickerin tarihini sıfırlamak lazım*/}
										{/*					if (expendableDaysPicker.current?.litePickerInstance) {*/}
										{/*						expendableDaysPicker.current.litePickerInstance.setDateRange(*/}
										{/*							dayjs(props.booking.check_out, 'DD.MM.YYYY').format('YYYY-MM-DD'),*/}
										{/*							dayjs(props.booking.check_out, 'DD.MM.YYYY').add(1, 'day').format('YYYY-MM-DD'),*/}
										{/*						)*/}
										{/*					}*/}
										{/*				}*/}
										{/*				if (dayjs(expendableStartDay, 'DD.MM.YYYY').isSame(dayjs(expendableEndDay, 'DD.MM.YYYY'))) {*/}
										{/*					Toast.fire({*/}
										{/*						icon: 'info',*/}
										{/*						title: 'En az 1 gece uzatılabilir!',*/}
										{/*					})*/}
										{/*				}*/}
										{/*				console.log('date', date)*/}
										{/*			}}*/}
										{/*		/>*/}
										{/*		<ExpendBookingPeriod*/}
										{/*			open={expendBookingPeriodModalOpen}*/}
										{/*			onClose={setExpendBookingPeriodModalOpen}*/}
										{/*		/>*/}
										{/*	</>*/}
										{/*)}*/}
										{/*{dayjs(props.booking.check_in, 'DD.MM.YYYY').isSameOrBefore(dayjs(), 'day') &&*/}
										{/*	bookingRooms.every((room) => room.guests.every((guest) => guest.is_check_in || room.guests.length === 0)) && (*/}
										{/*		<Button*/}
										{/*			variant="soft-pending"*/}
										{/*			onClick={(e: any) => {*/}
										{/*				e.preventDefault()*/}
										{/*				handleFinishBooking()*/}
										{/*			}}*/}
										{/*			className="intro-x flex items-center justify-center border-2 border-pending/60 py-1 text-white/70">*/}
										{/*			<Lucide*/}
										{/*				icon="CalendarMinus"*/}
										{/*				className="mr-1 h-5 w-5"*/}
										{/*			/>*/}
										{/*			ERKEN BİTİR*/}
										{/*		</Button>*/}
										{/*	)}*/}
										{['reception', 'agency'].includes(props.booking.channel_code) && (
											<Button
												variant="soft-danger"
												onClick={(e: any) => bookingCancel(e)}
												className="intro-x flex items-center justify-center border-2 border-danger/60 py-1 text-white/70">
												<Lucide
													icon="CalendarX2"
													className="mr-1 h-5 w-5"
												/>
												İPTAL ET
											</Button>
										)}
									</>
								)}
							</div>
						</div>
						<div className="intro-y relative col-span-12 border-b border-slate-300 bg-slate-200 px-4 py-5 dark:bg-darkmode-300/70">
							<h3 className="rounded-md text-xl font-bold text-dark dark:text-light">Müşteri Bilgileri</h3>
							<div className="flex flex-col items-start justify-between justify-items-start py-3 text-dark lg:flex-row dark:text-light">
								<div className="flex w-full flex-col text-sm font-semibold">
									<span className="font-semibold">
										Müşteri Türü :<span className="ml-1 font-normal">{props.customer.type}</span>
									</span>
									<span className="font-semibold">
										Ad Soyad / Ünvan :<span className="ml-1 font-normal">{props.customer.title}</span>
									</span>
									<span className="font-semibold">
										Vergi Dairesi :<span className="ml-1 font-normal">{props.customer.tax_office}</span>
									</span>
									<span className="font-semibold">
										T.C. Kimlik No / Vergi No :<span className="ml-1 font-normal">{props.customer.tax_number}</span>
									</span>
								</div>
								<div className="flex w-full flex-col text-sm font-semibold lg:ml-5">
									<span className="font-semibold">
										Ülke :<span className="ml-1 font-normal">{props.customer.country}</span>
										<span className="ml-1">Şehir :</span>
										<span className="ml-1 font-normal">{props.customer.city}</span>
									</span>
									<span className="font-semibold">
										Adres :<span className="ml-1 font-normal">{props.customer.address}</span>
									</span>
									<span className="font-semibold">
										Telefon :<span className="ml-1 font-normal">{props.customer.phone}</span>
									</span>
									<span className="font-semibold">
										Email :<span className="ml-1 font-normal">{props.customer.email}</span>
									</span>
								</div>
							</div>
							<div className="absolute right-5 top-5">
								<Link href={route('hotel.customers.show', props.customer.id)}>
									<Lucide
										icon="MousePointerSquareDashed"
										className="text-black hover:h-7 hover:w-7 hover:-translate-y-0.5 hover:translate-x-0.5 dark:text-white"
									/>
								</Link>
							</div>
						</div>
						<div className="col-span-12 border-b border-slate-200 bg-white px-4 py-5 dark:bg-darkmode-200/70">
							<h3 className="rounded-md text-xl font-bold text-dark dark:text-light">Oda Bilgileri</h3>
							<div className="flex flex-col items-start justify-between justify-items-start gap-3 py-3 text-dark dark:text-light">
								{bookingRooms.map((room, index) => (
									<BookingRooms
										key={index}
										room={room}
										currency={props.currency}
										taxes={props.taxes}
										citizens={props.citizens}
										pricingPolicy={props.pricing_policy}
										kbs={props.kbs}
										items={props.items}
										bookingRooms={bookingRooms}
										setBookingRooms={setBookingRooms}
										setBalance={setBalance}
										documentsBalance={documentsBalance}
										check_in={props.booking.check_in}
										setShowPaymentForm={setShowPaymentForm}
										paymentTypeOptions={paymentTypeOptions}
										setPaymentDocumentIndex={setPaymentDocumentIndex}
									/>
								))}
							</div>
						</div>
					</div>
				</div>
				<div className="w-full xl:w-1/3">
					<div className="xl:h-full xl:border-l xl:p-5">
						<div className="-intro-y box flex items-center justify-between p-5">
							<h3 className="-intro-x font-semibold xl:text-lg 2xl:text-2xl">Bakiye</h3>
							<span className={twMerge(['intro-y font-sans font-bold xl:text-xl 2xl:text-3xl', balance.number > 0 ? 'text-red-600' : 'text-green-700'])}>{balance.formatted}</span>
						</div>
						<div className="intro-x box mt-5 flex flex-col items-center justify-between gap-2 p-5">
							<Button
								variant={balance.number > 0 ? 'primary' : 'soft-dark'}
								onClick={() => balance.number > 0 && setShowPaymentForm(!showPaymentForm)}
								className="-intro-x w-full text-xl font-semibold shadow-md"
								type="button"
								disabled={balance.number == 0}>
								TAHSİLAT EKLE
							</Button>
							<form
								onSubmit={(e) => paymentFormSubmit(e)}
								id="payment-form"
								className={twMerge(['intro-y mt-5 w-full', !errors || (!showPaymentForm && 'hidden')])}>
								<h3 className="mb-5 text-center text-lg font-extrabold"> TAHSİLAT EKLE </h3>
								<div>
									<FormLabel
										htmlFor="payment-date"
										className="flex items-center justify-between">
										Tahsilat Türü
										<span className="text-[9px] font-thin text-slate-400">(Folyo Bazlı / Genel)</span>
									</FormLabel>
									<Select
										ref={paymentTypeSelectRef}
										id="payment-type"
										name="payment_type"
										className="remove-all my-select-container"
										classNamePrefix="my-select"
										isMulti={false}
										value={paymentTypeOptions[paymentDocumentIndex]}
										styles={{
											input: (base) => ({
												...base,
												'input:focus': {
													boxShadow: 'none',
												},
											}),
										}}
										options={paymentTypeOptions}
										onChange={(e: any, action: any) => {
											if (action.action === 'select-option') {
												e && setPaymentDocumentIndex(paymentTypeOptions.findIndex((option) => option.value === e.value))
											}
										}}
									/>
								</div>
								<div className="form-control mt-5">
									<FormLabel htmlFor="payment-date">Tahsilat Tarihi</FormLabel>
									<Litepicker
										id="payment-date"
										name="payment_date"
										data-single-mode="true"
										value={data.payment_date}
										onChange={(e) => setData((data) => ({...data, payment_date: e}))}
										className="w-full text-center"
										options={{
											lang: 'tr-TR',
											format: 'DD.MM.YYYY',
											numberOfColumns: 1,
											numberOfMonths: 1,
											plugins: ['mobilefriendly'],
											mobileFriendly: true,
											lockDaysFormat: 'YYYY-MM-DD',
											lockDays: [dayjs().subtract(1, 'day').format('YYYY-MM-DD')],
											lockDaysFilter: (date1: DateTime | null) => {
												if (date1) {
													const date1Dayjs = dayjs(date1.toJSDate())
													return date1Dayjs.isBefore(dayjs().subtract(1, 'day'))
												}
												return false
											},
										}}
									/>
									{errors.payment_date && <div className="text-theme-6 mt-2 text-danger">{errors.payment_date}</div>}
								</div>
								<div className="form-control mt-5">
									<FormLabel
										htmlFor="currency"
										className="justify-beetwen flex">
										Döviz Cinsi
									</FormLabel>
									<TomSelect
										id="currency"
										name="currency"
										data-placeholder="Döviz Cinsi"
										value={data.currency}
										onChange={(e) => setData((data) => ({...data, currency: e.toString()}))}
										className="w-full rounded-md">
										<option value="TRY">Türk Lirası</option>
										<option value="USD">Amerikan Doları</option>
										<option value="EUR">Euro</option>
										<option value="GBP">İngiliz Sterlini</option>
										<option value="SAR">Suudi Arabistan Riyali</option>
										<option value="AUD">Avustralya Doları</option>
										<option value="CHF">İsveç Frangı</option>
										<option value="CAD">Kanada Doları</option>
										<option value="KWD">Kuveyt Dinarı</option>
										<option value="JPY">Japon Yeni</option>
										<option value="DKK">Danimarka Kronu</option>
										<option value="SEK">İsveç Kronu</option>
										<option value="NOK">Norveç Kronu</option>
									</TomSelect>
									{errors.currency && <div className="text-theme-6 mt-2 text-danger">{errors.currency}</div>}
								</div>
								<div className="form-control mt-5">
									<FormLabel htmlFor="currency-amount">Meblağ</FormLabel>
									<CurrencyInput
										id="currency-amount"
										allowNegativeValue={false}
										allowDecimals={true}
										decimalSeparator=","
										decimalScale={2}
										suffix={` ${data.currency}` || ' TRY'}
										value={data.amount}
										decimalsLimit={2}
										required={true}
										onValueChange={(value, name, values) => {
											setData((data) => ({...data, amount: values?.float?.toFixed(2) || '0'}))
											if (values && values.float !== null && values.float > maxAmount) {
												Toast.fire({
													icon: 'error',
													title: maxAmountErr,
												})
												setData((data) => ({...data, amount: maxAmount.toFixed(2)}))
											}
										}}
										name="amount"
										className="w-full rounded-md border-slate-200 text-right text-xl font-extrabold shadow-sm transition duration-200 ease-in-out placeholder:text-slate-400/90 focus:border-primary focus:border-opacity-40 focus:ring-4 focus:ring-primary focus:ring-opacity-20 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-transparent dark:bg-darkmode-800 dark:placeholder:text-slate-500/80 dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:disabled:border-transparent dark:disabled:bg-darkmode-800/50 [&[readonly]]:cursor-not-allowed [&[readonly]]:bg-slate-100 [&[readonly]]:dark:border-transparent [&[readonly]]:dark:bg-darkmode-800/50"
									/>
									{errors.amount && <div className="text-theme-6 mt-2 text-danger">{errors.amount}</div>}
								</div>
								<div className="form-control mt-5">
									<FormLabel htmlFor="case">Kasa / Banka</FormLabel>
									<TomSelect
										id="case"
										name="bank_id"
										className="w-full"
										options={{
											placeholder: 'Kasa / Banka Seçiniz',
										}}
										value={data.bank_id}
										onChange={(e) => setData((data) => ({...data, bank_id: e.toString()}))}>
										<option>Seçiniz</option>
										{props.banks.map((bank) => (
											<option
												key={bank.id}
												value={bank.id}>
												{bank.name}
											</option>
										))}
									</TomSelect>
									{errors.bank_id && <div className="text-theme-6 mt-2 text-danger">{errors.bank_id}</div>}
								</div>
								<div className="form-control mt-5">
									<FormLabel
										htmlFor="payment-method"
										className="justify-beetwen flex">
										Ödeme Türü
									</FormLabel>
									<TomSelect
										id="payment-method"
										name="payment_method"
										data-placeholder="Ödeme Türü"
										value={data.payment_method}
										onChange={(e) => setData((data) => ({...data, payment_method: e.toString()}))}
										className="w-full rounded-md">
										<option>Seçiniz</option>
										<option value="cash">Nakit</option>
										<option value="credit_card">Kredi Kartı</option>
										<option value="bank_transfer">Banka Havale/EFT</option>
									</TomSelect>
									{errors.payment_method && <div className="text-theme-6 mt-2 text-danger">{errors.payment_method}</div>}
								</div>

								<div className="form-control mt-5">
									<FormLabel htmlFor="description">Açıkalama</FormLabel>
									<FormInput
										id="payment-description"
										type="text"
										placeholder="Açıklama"
										name="description"
										value={data.description}
										onChange={(e) => setData((data) => ({...data, description: e.target.value}))}
										className="w-full"
									/>
									{errors.description && <div className="text-theme-6 mt-2 text-danger">{errors.description}</div>}
								</div>
								<div className="form-control mt-5 flex justify-end gap-3">
									<Button
										id="payment-cancel"
										className="shadow-md"
										variant="secondary"
										onClick={() => setShowPaymentForm(false)}
										type="button">
										Vazgeç
									</Button>
									<Button
										className="shadow-md"
										variant="primary"
										type="submit">
										Tahsilat Ekle
									</Button>
								</div>
							</form>
						</div>
						{props.booking_messages.length > 0 && (
							<div className="box mt-5 flex flex-col items-center justify-between gap-2 p-5">
								<h3 className="text-lg font-semibold">Rezevasyon Mesajları</h3>
								<div>
									{props.booking_messages.map((message, index) => (
										<div
											key={index}
											className="flex flex-col items-start justify-between justify-items-start gap-3 rounded-md border border-slate-200 p-3">
											<p className="text-sm font-normal">{message.message}</p>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	)
}

Show.layout = (page: any) => (
	<AuthenticatedLayout
		// header={<h2 className='font-semibold text-xl text-gray-800 leading-tight'>asdasdas</h2>}
		breadcrumb={[
			{
				href: route('hotel.dashboard.index'),
				title: 'Dashboard',
			},
			{
				href: route('hotel.bookings.index'),
				title: 'Rezervasyonlar',
			},
			{
				href: route('hotel.bookings.show', page.props.booking.id),
				title: 'Rezervasyon Detayı',
			},
		]}
		children={page}
	/>
)
export default Show
