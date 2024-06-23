import React, {useEffect, useState} from 'react'
import {twMerge} from 'tailwind-merge'
import Tippy from '@/Components/Tippy'
import Lucide from '@/Components/Lucide'
import Button from '@/Components/Button'
import {BookingResultProps, CheckedRoomsDailyPriceProps, CheckedRoomsProps, RoomDailyPriceProps, RoomTypeRoomGuestsProps} from '@/Pages/Hotel/Booking/types/steps'
import {CustomerProps, DailyPriceProps, StepOneDataProps} from '@/Pages/Hotel/Booking/types/response'
import CurrencyInput from 'react-currency-input-field'
import SummarySelectedRoom from '@/Pages/Hotel/Booking/components/SummarySelectedRoom'
import SummaryTypedRoom from '@/Pages/Hotel/Booking/components/SummaryTypedRoom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import {router} from '@inertiajs/react'
import {CitizenProps} from '@/Pages/Hotel/Booking/types/show'
import {floor} from 'lodash'

interface BookingSummaryProps {
	number_of_adults: number
	number_of_children: number
	children_ages: number[]
	checkinRequired: boolean
	step: number
	setStep: React.Dispatch<React.SetStateAction<number>>
	bookingResult: BookingResultProps | undefined
	checkedRooms: CheckedRoomsProps | undefined
	setCheckedRooms: React.Dispatch<React.SetStateAction<CheckedRoomsProps | undefined>>
	dailyPrices: CheckedRoomsDailyPriceProps | undefined
	grandTotal: number
	customerId: number | undefined
	bookingCustomer: CustomerProps | undefined
	data: StepOneDataProps[]
	roomsGuests: RoomTypeRoomGuestsProps | undefined
	pricingCurrency: string
	citizens: CitizenProps[]
}

function BookingSummary(props: BookingSummaryProps) {
	const mySwal = withReactContent(Swal)
	const [nextStepDisabled, setNextStepDisabled] = useState(true)
	const [grandTotal, setGrandTotal] = useState<number>(parseFloat(props.grandTotal.toFixed(2)))
	const [discountRate, setDiscountRate] = useState(1)
	const [discountableDailyPrices, setDiscountableDailyPrices] = useState(props.dailyPrices)

	const formatter = new Intl.NumberFormat('en-US', {
		style: 'decimal',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})

	const Toast = mySwal.mixin({
		toast: true,
		position: 'top-end',
		showConfirmButton: false,
		timer: 3000,
		timerProgressBar: true,
		didOpen: (toast) => {
			toast.addEventListener('mouseenter', mySwal.stopTimer)
			toast.addEventListener('mouseleave', mySwal.resumeTimer)
		},
	})

	useEffect(() => {
		if (props.step === 2) {
			props.checkedRooms && setNextStepDisabled(Object.values(props.checkedRooms).filter((item) => item.length > 0).length === 0)
			!props.checkedRooms && setDiscountableDailyPrices(undefined)
		}
		if (props.step === 3) {
			setNextStepDisabled(props.customerId === undefined)
		}
		if (props.step === 4) {
			if (props.checkinRequired) {
				let checker: boolean[] = []
				if (props.roomsGuests) {
					Object.values(props.roomsGuests).forEach((room) => {
						Object.values(room).forEach((groom) => {
							groom &&
								Object.values(groom).forEach((guest) => {
									if (guest.name === '' || guest.surname === '' || guest.identification_number === '') {
										checker.push(false)
									}
								})
						})
					})
				}
				if (checker.length > 0 && checker.includes(false)) {
					setNextStepDisabled(true)
				} else {
					setNextStepDisabled(false)
				}
			} else {
				setNextStepDisabled(false)
			}
		}
	}, [props.step, props.checkedRooms, props.customerId, props.roomsGuests])

	useEffect(() => {
		setGrandTotal(parseFloat(props.grandTotal.toFixed(2)))
	}, [props.grandTotal])

	useEffect(() => {
		const rate = grandTotal / props.grandTotal
		setDiscountRate(rate)
		const newDailyPrices: {[key: number]: any[]} = {}
		if (props.dailyPrices) {
			Object.keys(props.dailyPrices).forEach((key_rt) => {
				newDailyPrices[parseInt(key_rt)] = [] as RoomDailyPriceProps[]
				props.dailyPrices &&
					Object.keys(props.dailyPrices[parseInt(key_rt)]).forEach((key_r) => {
						newDailyPrices[parseInt(key_rt)][parseInt(key_r)] = [] as DailyPriceProps[]
						props.dailyPrices &&
							Object.values(props.dailyPrices[parseInt(key_rt)][parseInt(key_r)]).forEach((daily_price, key_day) => {
								// @ts-ignore
								const price = floor(props.dailyPrices[parseInt(key_rt)][parseInt(key_r)][key_day].price * rate, 2)
								const fprice = formatter.format(price)
								newDailyPrices[parseInt(key_rt)][parseInt(key_r)][key_day] = {
									date: daily_price.date,
									price: price,
									fprice: fprice,
									fprice_with_currency: `${fprice} ${props.pricingCurrency}`,
								}
							})
					})
			})
		}
		//newDailyPrices için içi boş dizi elamanlarının hepsini temizle
		setDiscountableDailyPrices(newDailyPrices)
	}, [grandTotal])

	const handleSubmit = (e: any) => {
		e.preventDefault()
		if (props.step === 5 && props.bookingResult && props.checkedRooms && props.customerId && props.roomsGuests) {
			const data = {
				booking_result: props.bookingResult,
				checked_rooms: props.checkedRooms,
				checkin_required: props.checkinRequired,
				discount_rate: discountRate,
				daily_prices: discountableDailyPrices,
				grand_total: grandTotal,
				discount: props.grandTotal - grandTotal,
				customer_id: props.customerId,
				rooms_guests: props.roomsGuests,
				number_of_adults: props.number_of_adults,
				number_of_children: props.number_of_children,
				children_ages: props.children_ages,
			}
			// @ts-ignore
			router.post(route('hotel.bookings.store'), data, {
				onSuccess: () => {
					Toast.fire({
						icon: 'success',
						title: 'Rezervasyon başarıyla oluşturuldu.',
					})
				},
			})
		}
	}

	return (
		<div className={twMerge('box relative w-full', props.step <= 2 && 'lg:mt-5', props.step < 5 && 'lg:w-1/3')}>
			<div className="flex items-center justify-center rounded-t-md border-b py-2">
				<h3 className="text-xl font-semibold">Rezervasyon Özeti</h3>
			</div>
			{props.bookingResult && (
				<div className="flex flex-col p-2">
					<fieldset className="rounded border p-2">
						<legend className="text-xs font-thin">Rezervasyon Bilgileri</legend>
						<div>
							<div className="flex items-center justify-between border-b py-1">
								<span className="text-xs font-semibold">Check-in</span>
								<span className="text-xs">{props.bookingResult.check_in}</span>
							</div>
							<div className="flex items-center justify-between border-b py-1">
								<span className="text-xs font-semibold">Check-out</span>
								<span className="text-xs">{props.bookingResult.check_out}</span>
							</div>
							<div className="flex items-center justify-between border-b py-1">
								<span className="text-xs font-semibold">Konaklama Süresi</span>
								<span className="text-xs">{props.bookingResult.night_count} gece</span>
							</div>
							<div className="flex items-center justify-between py-1">
								<span className="text-xs font-semibold">Rezervasyon Tipi</span>
								<span className="text-xs">{props.bookingResult.booking_type}</span>
							</div>
						</div>
					</fieldset>
				</div>
			)}
			{props.bookingResult && props.bookingResult.typed_rooms && (
				<div className="flex flex-col p-2">
					<fieldset className="rounded border p-2">
						<legend className="text-xs font-thin">Seçilen Odalar</legend>
						<div>
							{props.bookingResult.typed_rooms.map((room, index) => {
								return (
									<SummarySelectedRoom
										key={index}
										room={room}
									/>
								)
							})}
						</div>
					</fieldset>
				</div>
			)}
			{props.bookingResult && (
				<div className="flex flex-col p-2">
					<fieldset className="rounded border p-2">
						<legend className="text-xs font-thin">Misafir Sayı Bilgisi</legend>
						<div className="flex items-center justify-between border-b py-1">
							<span className="text-xs font-semibold">Yetişkin</span>
							<span className="text-xs">{props.bookingResult.number_of_adults_total}</span>
						</div>
						<div className="flex items-center justify-between py-1">
							<span className="text-xs font-semibold">Çocuk</span>
							<span className="text-xs">{props.bookingResult.number_of_children_total}</span>
						</div>
					</fieldset>
				</div>
			)}
			{props.bookingCustomer && (
				<div className="flex flex-col p-2">
					<fieldset className="rounded border p-2">
						<legend className="text-xs font-thin">Müşteri Bilgileri</legend>
						<div className="flex items-center justify-between border-b py-1">
							<span className="text-xs font-semibold">{props.bookingCustomer.title}</span>
						</div>
						<div className="flex items-center justify-between py-1">
							<span className="text-xs">{props.bookingCustomer.tax_office}</span>
							<span className="text-xs">{props.bookingCustomer.tax_number}</span>
						</div>
						<div className="flex items-center justify-between border-b py-1">
							<span className="text-xs font-thin">Adres: {props.bookingCustomer.address}</span>
						</div>
					</fieldset>
				</div>
			)}
			{props.step > 4 && props.bookingResult && props.bookingResult.typed_rooms && props.roomsGuests && (
				<div className="flex flex-col p-2">
					<fieldset className="rounded border p-2">
						<legend className="items-centerm flex w-full justify-between text-xs font-thin">
							<span>Oda Misafir Bilgileri</span>
							<hr className="mx-0.5 mt-2 flex-grow border border-x-0 border-b border-t-0" />
							{props.checkinRequired && <span className="rounded bg-slate-100 px-1 py-0.5 font-extrabold text-danger dark:bg-darkmode-700 dark:text-danger/70">Check in yapılacak.</span>}
						</legend>
						{props.data.map(
							(room_type, index) =>
								props.checkedRooms &&
								props.checkedRooms[room_type.id] &&
								props.checkedRooms[room_type.id].length > 0 && (
									<div
										key={index}
										className="rounded border">
										<div className="flex items-center justify-between rounded-t px-2 py-1">
											<span className="text-sm font-bold">{room_type.name}</span>
										</div>
										{props.checkedRooms[room_type.id].map((room, index) => {
											const groom = room_type.rooms.find((r) => r.id === room)
											return (
												<div key={index}>
													<div className="flex items-center justify-center border-y bg-slate-50 py-0.5 text-right dark:bg-darkmode-600">
														<span className="text-xs font-semibold">{groom?.name} No'lu Oda Misafirleri</span>
													</div>
													{props.roomsGuests && props.roomsGuests[room_type.id] && groom && (
														<table
															id="responsive-table"
															className="w-full border-spacing-y-[10px] border-none">
															<thead className="border-b">
																<tr>
																	<th className="text-left text-xs">#</th>
																	<th className="text-left text-xs">Ad</th>
																	<th className="text-left text-xs">Soyad</th>
																	<th className="text-left text-xs">D. Tarihi</th>
																	<th className="text-left text-xs">Cinsiyet</th>
																	<th className="text-left text-xs">Uyruk</th>
																	<th className="text-left text-xs">TC \ Yabancı Kimlik No</th>
																</tr>
															</thead>
															<tbody>
																{Object.values(props.roomsGuests[room_type.id][groom.id]).map((guest, index) => {
																	if (guest.name !== '' && guest.surname !== '') {
																		return (
																			<tr
																				key={index}
																				className="border-b">
																				<td
																					data-label="#"
																					className="border-none text-xs font-bold">
																					{index + 1}
																				</td>
																				<td
																					data-label="Ad"
																					className="border-none text-xs">
																					{guest.name}
																				</td>
																				<td
																					data-label="Soyad"
																					className="border-none text-xs">
																					{guest.surname}
																				</td>
																				<td
																					data-label="D. Tarihi"
																					className="border-none text-xs">
																					{guest.birthday}
																				</td>
																				<td
																					data-label="Cinsiyet"
																					className="border-none text-xs">
																					{guest.gender === 'male' ? 'Erkek' : 'Kadın'}
																				</td>
																				<td
																					data-label="Uyruk"
																					className="border-none text-xs">
																					{props.citizens.find((citizen) => citizen.id === parseInt(guest.citizen_id))?.name}
																				</td>
																				<td
																					data-label="Kimlik No"
																					className="border-none text-xs">
																					{guest.identification_number}
																				</td>
																			</tr>
																		)
																	} else {
																		return (
																			<div
																				key={index}
																				className="flex items-center justify-center py-1">
																				<span className="text-xs font-semibold text-danger">Misafir bilgisi girilmedi.</span>
																			</div>
																		)
																	}
																})}
															</tbody>
														</table>
													)}
												</div>
											)
										})}
									</div>
								),
						)}
					</fieldset>
				</div>
			)}
			{props.bookingResult && props.bookingResult.typed_rooms && props.bookingResult.typed_rooms.length !== 0 && (
				<div className="flex flex-col p-2">
					<fieldset className="flex flex-col gap-2 rounded border p-2">
						<legend className="flex items-center justify-center text-xs font-thin">
							Fiyatlandırma
							<Tippy content="Sezon geçişleri olabileceğinden gecelik fiyat için ortalama ibaresi kullanılmıştır. Bu bölümdeki gecelik fiyat seçilen tarih aralığındaki toplam tutarın konaklama süresine bölünmesi sonucu hesaplanmıştır net gecelik fiyat değildir.">
								<Lucide
									icon="HelpCircle"
									className="ml-1 h-4 w-4 rounded-full bg-slate-300 dark:bg-darkmode-800"
								/>
							</Tippy>
						</legend>
						{props.bookingResult.typed_rooms.map((room, index) => (
							<SummaryTypedRoom
								key={index}
								step={props.step}
								bookingResult={props.bookingResult}
								pricingCurrency={props.pricingCurrency}
								grandTotal={grandTotal}
								setGrandTotal={setGrandTotal}
								discountableDailyPrices={discountableDailyPrices || {}}
								discountRate={discountRate}
								room={room}
								roomType={props.data.find((r) => r.id === room.id) as StepOneDataProps}
							/>
						))}
						{grandTotal < props.grandTotal && (
							<div className="flex items-center justify-between py-1">
								<span className="text-base font-semibold">Toplam İndirim</span>
								<CurrencyInput
									id="discount-price"
									allowNegativeValue={false}
									allowDecimals={true}
									decimalSeparator=","
									decimalScale={2}
									suffix={` ${props.pricingCurrency}` || ' TRY'}
									value={props.grandTotal - grandTotal}
									decimalsLimit={2}
									required={true}
									disabled={true}
									name="discount_price"
									className="w-48 border-none px-0.5 py-0.5 text-right text-lg font-bold text-danger focus:border-none focus:ring-0 dark:bg-darkmode-600"
								/>
							</div>
						)}
						<div className="flex items-center justify-between py-1">
							<span className="flex items-center justify-center text-base font-semibold">
								Genel Toplam
								<Tippy
									content="Geri Al"
									onClick={() => {
										setGrandTotal(parseFloat(props.grandTotal.toFixed(2) || '0'))
									}}>
									<Lucide
										icon="Undo2"
										className="ml-1 h-4 w-4 rounded-full bg-slate-200 p-0.5 dark:bg-darkmode-800"
									/>
								</Tippy>
							</span>
							<CurrencyInput
								id="unit-price"
								allowNegativeValue={false}
								allowDecimals={true}
								decimalSeparator=","
								decimalScale={2}
								suffix={` ${props.pricingCurrency}` || ' TRY'}
								value={grandTotal}
								decimalsLimit={2}
								required={true}
								disabled={props.step < 5}
								onValueChange={(value, name, values) => {
									values && setGrandTotal(values?.float || 0)
								}}
								name="unit_price"
								className="w-48 border-none px-0.5 py-0.5 text-right text-lg font-bold text-danger focus:border-none focus:ring-0 dark:bg-darkmode-600"
							/>
						</div>
					</fieldset>
				</div>
			)}
			<div className="flex w-full items-center justify-between p-2">
				<Button
					variant="secondary"
					onClick={(e: any) => {
						e.preventDefault()
						window.scrollTo(0, 0)
						if (props.step === 1) {
							props.setCheckedRooms(undefined)
						}
						props.setStep((prev) => (prev > 1 ? prev - 1 : 1))
					}}
					className="border-white/30 bg-white shadow">
					<Lucide
						icon="ChevronLeft"
						className="ml-2 h-5 w-5 text-success"
					/>
					Önceki Adım
				</Button>
				<Button
					variant="secondary"
					onClick={(e: any) => {
						e.preventDefault()
						window.scrollTo(0, 0)
						if (props.step < 5) {
							props.setStep((prev) => prev + 1)
						} else {
							handleSubmit(e)
						}
					}}
					disabled={nextStepDisabled}
					className="border-white/30 bg-white shadow">
					{props.step === 5 ? 'Rezervasyonu Tamamla' : 'Sonraki Adım'}
					<Lucide
						icon={props.step === 5 ? 'CheckCheck' : 'ChevronRight'}
						className="ml-2 h-5 w-5 text-success"
					/>
				</Button>
			</div>
		</div>
	)
}

export default BookingSummary
