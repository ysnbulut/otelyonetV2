import React, {useState} from 'react'
import AuthenticatedLayout from '@/Layouts/HotelAuthenticatedLayout'
import {Head, Link, useForm} from '@inertiajs/react'
import Button from '@/Components/Button'
import route from 'ziggy-js'
import Lucide from '@/Components/Lucide'
import TransactionsSection from '@/Pages/Hotel/Customer/components/TransactionsSection'
import {twMerge} from 'tailwind-merge'
import {FormInput, FormLabel} from '@/Components/Form'
import Litepicker from '@/Components/Litepicker'
import TomSelect from '@/Components/TomSelect'
import CurrencyInput from 'react-currency-input-field'
import {BookingShowProps} from '@/Pages/Hotel/Booking/types/show'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import Sqids from 'sqids'
import Tippy from '@/Components/Tippy'
import BookingRooms from '@/Pages/Hotel/Booking/components/BookingRooms'

dayjs.extend(customParseFormat)

function Show(props: BookingShowProps) {
	const sqids = new Sqids({
		minLength: 7,
		alphabet: 'ABCDEFGHJKLMNPQRSTUVWXYZ',
	})
	const [showPaymentForm, setShowPaymentForm] = useState<boolean>(false)
	const {data, setData, post, processing, errors} = useForm({
		booking_id: props.booking.id,
		customer_id: props.customer.id,
		payment_date: dayjs().format('DD.MM.YYYY'),
		case_and_banks_id: '',
		currency: 'TRY',
		payment_method: '',
		currency_amount: props.remaining_balance < 0 ? Math.abs(props.remaining_balance).toString() : '0',
		description: '',
	})

	// const booking_type = props.booking.check_out === null ? 'Açık' : 'Normal'

	const accommodationTypes: {[key: string]: string} = {
		only_room: 'Sadece Oda',
		room_breakfast: 'Oda ve Kahvaltı',
		half_board: 'Yarım Pansiyon',
		full_board: 'Tam Pansiyon',
		all_inclusive: 'Her Şey Dahil',
		ultra_all_inclusive: 'Ultra Her Şey Dahil',
	}

	const accommodationType = accommodationTypes[props.accommodation_type] || 'Sadece Oda'

	const paymentFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		// post(route('hotel.customer_payments.store'), {
		// 	onSuccess: () => {
		// 		setShowPaymentForm(false)
		// 		setData((data) => ({
		// 			...data,
		// 			payment_date: dayjs().format('DD.MM.YYYY'),
		// 			case_and_banks_id: '',
		// 			currency: 'TRY',
		// 			payment_method: '',
		// 			currency_amount:
		// 				props.remaining_balance < 0 ? Math.abs(props.remaining_balance).toString() : '0',
		// 			description: '',
		// 		}))
		// 	},
		// })
	}

	return (
		<>
			<Head title="Rezervasyon Oluştur" />
			<div className="flex grid-cols-12 flex-col-reverse gap-3 xl:flex-row">
				<div className="w-full xl:w-2/3">
					<div className="box relative mt-5 grid grid-cols-12">
						<Tippy
							content="Rezervasyon Kodu"
							className="absolute right-0 top-0 h-11 w-32 rounded-tr-md border-b border-l border-slate-100/20 bg-white/30 p-2">
							<h3 className="text-center text-lg font-extrabold text-slate-50">{sqids.encode([props.booking.id])}</h3>
						</Tippy>
						<Tippy
							content="Rezervasyon Kanalı"
							className="absolute right-0 top-11 w-32 rounded-bl border-y border-l border-indigo-500/80 bg-indigo-600/80 p-2 shadow">
							<h6 className="rounded text-center text-xs font-semibold text-slate-50">{props.booking.channel}</h6>
						</Tippy>
						<div className="col-span-12 rounded-t-md border-b border-teal-700 bg-teal-600 px-4 py-5 dark:bg-teal-700/40">
							<h3 className="rounded-md text-xl font-bold text-light">Rezervasyon Bilgileri</h3>
							<div className="flex flex-col items-start justify-between justify-items-start py-3 text-light lg:flex-row">
								<Link
									href={route('hotel.customers.show', props.customer.id)}
									className="flex w-full flex-col text-sm font-semibold">
									<span className="font-semibold">
										Giriş Tarihi :<span className="ml-1 font-normal">{props.booking.check_in}</span>
									</span>
									<span className="font-semibold">
										Çıkış Tarihi :<span className="ml-1 font-normal">{props.booking.check_out}</span>
									</span>
									<span className="font-semibold">
										Seçilen Oda Türleri :
										<span className="ml-1 font-normal">
											{props.booking.rooms.map((room) => room.room_type_full_name).join(', ')}
										</span>
									</span>
								</Link>
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
								{!props.booking.open_booking && (
									<Button
										variant="soft-success"
										className="intro-x relative flex items-center justify-center border-2 border-success/60 py-1 text-white/70">
										<Lucide
											icon="CalendarPlus"
											className="mr-1 h-5 w-5"
										/>
										SÜREYİ UZAT
										<span className="absolute -right-3 -top-3 flex h-6 w-6 items-center justify-center rounded-full border-2 border-success/60 bg-danger text-xs">
											{props.extendable_number_of_days}
										</span>
									</Button>
								)}
								{props.booking.open_booking && (
									<Button
										variant="soft-pending"
										className="intro-x flex items-center justify-center border-2 border-pending/60 py-1 text-white/70">
										<Lucide
											icon="CalendarMinus"
											className="mr-1 h-5 w-5"
										/>
										BİTİR
									</Button>
								)}
								{dayjs(props.booking.check_in, 'DD.MM.YYYY').isAfter(dayjs(), 'day') && (
									<Button
										variant="soft-danger"
										className="intro-x flex items-center justify-center border-2 border-danger/60 py-1 text-white/70">
										<Lucide
											icon="CalendarX2"
											className="mr-1 h-5 w-5"
										/>
										İPTAL ET
									</Button>
								)}
							</div>
						</div>
						<div className="col-span-12 border-b border-slate-300 bg-slate-200 px-4 py-5 dark:bg-darkmode-300/70">
							<h3 className="rounded-md text-xl font-bold text-dark dark:text-light">Müşteri Bilgileri</h3>
							<div className="flex flex-col items-start justify-between justify-items-start py-3 text-dark lg:flex-row dark:text-light">
								<Link
									href={route('hotel.customers.show', props.customer.id)}
									className="flex w-full flex-col text-sm font-semibold">
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
								</Link>
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
						</div>
						<div className="col-span-12 border-b border-slate-200 bg-white px-4 py-5 dark:bg-darkmode-200/70">
							<h3 className="rounded-md text-xl font-bold text-dark dark:text-light">Oda Bilgileri</h3>
							<div className="flex flex-col items-start justify-between justify-items-start gap-3 py-3 text-dark dark:text-light">
								{props.booking.rooms.map((room, index) => (
									<BookingRooms
										key={index}
										room={room}
										citizens={props.citizens}
										booking_rooms={props.booking.rooms}
										check_in={props.booking.check_in}
									/>
								))}
							</div>
						</div>
					</div>
					{/*<TransactionsSection customer={props.customer} />*/}
				</div>
				<div className="w-full xl:w-1/3">
					<div className="xl:h-full xl:border-l xl:p-5">
						<div className="box flex items-center justify-between p-5">
							<h3 className="font-semibold xl:text-lg 2xl:text-2xl">Bakiye</h3>
							<span
								className={twMerge([
									'font-sans font-bold xl:text-xl 2xl:text-3xl',
									props.remaining_balance > 0 ? 'text-red-600' : 'text-green-700',
								])}>
								{props.remaining_balance_formatted}
							</span>
						</div>
						<div className="box mt-5 flex flex-col items-center justify-between gap-2 p-5">
							<Button
								variant={props.remaining_balance > 0 ? 'primary' : 'soft-dark'}
								onClick={() => props.remaining_balance > 0 && setShowPaymentForm(!showPaymentForm)}
								className="w-full text-xl font-semibold shadow-md"
								type="button"
								disabled={props.remaining_balance == 0}>
								TAHSİLAT EKLE
							</Button>
							<form
								onSubmit={(e) => paymentFormSubmit(e)}
								id="payment-form"
								className={twMerge(['intro-y mt-5 w-full', !errors || (!showPaymentForm && 'hidden')])}>
								<h3 className="mb-5 text-center text-lg font-extrabold"> TAHSİLAT EKLE </h3>
								<div className="form-control">
									<FormLabel htmlFor="payment-date">Tahsilat Tarihi</FormLabel>
									<Litepicker
										id="payment-date"
										name="payment_date"
										data-single-mode="true"
										value={data.payment_date}
										onChange={(e) => setData((data) => ({...data, payment_date: e}))}
										className="w-full text-center"
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
										value={data.currency_amount}
										decimalsLimit={2}
										required={true}
										onValueChange={(value) => setData((data) => ({...data, currency_amount: value || '0'}))}
										name="currency_amount"
										className="w-full rounded-md border-slate-200 text-right text-xl font-extrabold shadow-sm transition duration-200 ease-in-out placeholder:text-slate-400/90 focus:border-primary focus:border-opacity-40 focus:ring-4 focus:ring-primary focus:ring-opacity-20 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-transparent dark:bg-darkmode-800 dark:placeholder:text-slate-500/80 dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:disabled:border-transparent dark:disabled:bg-darkmode-800/50 [&[readonly]]:cursor-not-allowed [&[readonly]]:bg-slate-100 [&[readonly]]:dark:border-transparent [&[readonly]]:dark:bg-darkmode-800/50"
									/>
									{errors.currency_amount && (
										<div className="text-theme-6 mt-2 text-danger">{errors.currency_amount}</div>
									)}
								</div>
								<div className="form-control mt-5">
									<FormLabel htmlFor="case">Kasa / Banka</FormLabel>
									<TomSelect
										id="case"
										name="case_and_banks_id"
										className="w-full"
										options={{
											placeholder: 'Kasa / Banka Seçiniz',
										}}
										value={data.case_and_banks_id}
										onChange={(e) => setData((data) => ({...data, case_and_banks_id: e.toString()}))}>
										<option>Seçiniz</option>
										{props.case_and_banks.map((case_and_bank) => (
											<option
												key={case_and_bank.id}
												value={case_and_bank.id}>
												{case_and_bank.name}
											</option>
										))}
									</TomSelect>
									{errors.case_and_banks_id && (
										<div className="text-theme-6 mt-2 text-danger">{errors.case_and_banks_id}</div>
									)}
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
									{errors.payment_method && (
										<div className="text-theme-6 mt-2 text-danger">{errors.payment_method}</div>
									)}
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
								<form>asdas</form>
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
