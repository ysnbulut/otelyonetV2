import AuthenticatedLayout from '@/Layouts/HotelAuthenticatedLayout'
import {Head, Link, router} from '@inertiajs/react'
import {PageProps} from './types'
import Lucide from '@/Components/Lucide'
import OccupancyWeeklyChart from './components/weeklyLineChart'
import RoomStatusTodayDonutChartCard from './components/RoomStatusDonutChartCard'
import GeneralReports from './components/GeneralReports'
import route from 'ziggy-js'
import {twMerge} from 'tailwind-merge'
import UpcomingBokingsSection from './components/UpcomingBokingsSection'
import React, {useEffect, useState} from 'react'
import Clock from 'react-clock'
import CurrencyInput from 'react-currency-input-field'
import Select from 'react-select'
import axios from 'axios'

export default function Index({
	is_tenant,
	eur_exchange_rate,
	room_count,
	booked_rooms,
	booked_rooms_percent,
	available_rooms,
	available_rooms_percent,
	dirty_rooms,
	dirty_rooms_percent,
	out_of_order_rooms,
	out_of_order_rooms_percent, // guest_count,
	// today_check_in_guest_count,
	// today_check_out_guest_count,
	// tomorrow_check_in_guest_count,
	// tomorrow_check_out_guest_count,
	// booked_rooms_yearly,
	booked_rooms_weekly,
	transactions,
}: PageProps) {
	const [clock, setClock] = useState(new Date())
	//['EUR','USD', 'GBP', 'SAR', 'AUD', 'CHF', 'CAD', 'KWD', 'JPY', 'DKK', 'SEK', 'NOK']
	const currencies = [
		{value: 'EUR', label: 'EUR'},
		{value: 'USD', label: 'USD'},
		{value: 'GBP', label: 'GBP'},
		{value: 'SAR', label: 'SAR'},
		{value: 'AUD', label: 'AUD'},
		{value: 'CHF', label: 'CHF'},
		{value: 'CAD', label: 'CAD'},
		{value: 'KWD', label: 'KWD'},
		{value: 'JPY', label: 'JPY'},
		{value: 'DKK', label: 'DKK'},
		{value: 'SEK', label: 'SEK'},
		{value: 'NOK', label: 'NOK'},
	]
	const [currency, setCurrency] = useState(currencies[0])
	const [currencyRate, setCurrencyRate] = useState(eur_exchange_rate)
	const [amount, setAmount] = useState<number>(1)
	useEffect(() => {
		const interval = setInterval(() => setClock(new Date()), 1000)

		return () => {
			clearInterval(interval)
		}
	}, [])

	useEffect(() => {
		axios
			.post(route('amount.exchange'), {
				currency: currency.value,
				amount: amount,
			})
			.then(
				(response: {
					data: {
						exchange_rate: number
						currency: string
						amount: number
					}
				}) => {
					setCurrencyRate(response.data.exchange_rate)
				},
			)
			.catch((error) => {
				console.error(error)
			})
	}, [currency, amount])

	return (
		<>
			<Head title="Dashboard" />
			<div className="grid grid-cols-12 gap-6">
				<div className="col-span-12 2xl:col-span-9">
					<div className="grid grid-cols-12 gap-6">
						{/* BEGIN: General Report */}
						<GeneralReports
							bookedRooms={booked_rooms}
							bookedRoomsPercent={booked_rooms_percent}
							availableRooms={available_rooms}
							availableRoomsPercent={available_rooms_percent}
							dirtyRooms={dirty_rooms}
							dirtyRoomsPercent={dirty_rooms_percent}
							outOfOrderRooms={out_of_order_rooms}
							outOfOrderRoomsPercent={out_of_order_rooms_percent}
						/>
						{/* END: General Report */}
						{/* BEGIN: Sales Report */}
						<div className="col-span-12 mt-8 sm:col-span-6 lg:col-span-6">
							<div className="intro-y flex h-10 items-center">
								<h2 className="mr-5 truncate text-lg font-medium">Haftalık Doluluk Grafiği (Bu Hafta)</h2>
							</div>
							<div className="intro-y box mt-6 p-5 sm:mt-5">
								<div className="mt-3">
									<OccupancyWeeklyChart
										dataSet={booked_rooms_weekly}
										max_room={room_count}
										height={213}
									/>
								</div>
							</div>
							<div className="intro-y mt-4 block h-10 items-center sm:flex">
								<h2 className="mr-5 truncate text-lg font-medium">Yıllık Doluluk Grafiği</h2>
							</div>
							<div className="intro-y box mt-6 p-5 sm:mt-5">
								<OccupancyWeeklyChart
									dataSet={booked_rooms_weekly}
									max_room={room_count}
									height={213}
								/>
							</div>
						</div>
						{/* END: Sales Report */}
						{/* BEGIN: Sales Report */}
						<RoomStatusTodayDonutChartCard
							bookedRoomsPercent={booked_rooms_percent}
							availableRoomsPercent={available_rooms_percent}
							dirtyRoomsPercent={dirty_rooms_percent}
							outOfOrderRoomsPercent={out_of_order_rooms_percent}
						/>
						{/* END: Sales Report */}
						{/* BEGIN: Weekly Top Products */}
						<UpcomingBokingsSection
							onEnterViewport={() => console.log('inner')}
							onLeaveViewport={() => console.log('leave')}
						/>
						{/* END: Weekly Top Products */}
					</div>
				</div>
				<div className="col-span-12 2xl:col-span-3">
					<div className="-mb-10 pb-10 2xl:border-l">
						<div className="grid grid-cols-12 gap-x-6 gap-y-6 2xl:gap-x-0 2xl:pl-6">
							{/* BEGIN: Transactions */}
							<div className="col-span-12 mt-3 md:col-span-6 xl:col-span-4 2xl:col-span-12 2xl:mt-8">
								<div className="box flex items-center justify-center gap-4 p-4">
									<Clock
										className="rounded-full bg-slate-100 dark:bg-darkmode-700"
										value={clock}
										size={100}
										minuteMarksWidth={1}
										hourHandWidth={5}
										hourMarksLength={14}
										hourMarksWidth={4}
									/>
									<span className="min-w-[90px] rounded-md bg-slate-100 px-2 py-1 text-center text-lg font-semibold dark:bg-darkmode-700">
										{clock.toLocaleTimeString()}
									</span>
								</div>
							</div>
							<div className="col-span-12 mt-1 md:col-span-6 xl:col-span-4 2xl:col-span-12 2xl:mt-2">
								<div className="intro-x flex h-10 items-center">
									<h2 className="mr-5 truncate text-lg font-medium">Kurlar</h2>
								</div>
								<div className="box flex flex-col gap-1 p-4">
									<div className="flex gap-1">
										<Select
											id="currency"
											name="currency"
											options={currencies}
											className="remove-all my-select-container w-44"
											classNamePrefix="my-select"
											styles={{
												input: (base) => ({
													...base,
													'input:focus': {
														boxShadow: 'none',
													},
												}),
											}}
											value={currency}
											onChange={(e: any) =>
												e && setCurrency(currencies.find((c) => c.value === e.value) || currencies[0])
											}
										/>
										<CurrencyInput
											id="input-example"
											name="input-name"
											suffix={` ${currency.label}`}
											allowDecimals={true}
											decimalsLimit={2}
											allowNegativeValue={false}
											decimalSeparator=","
											decimalScale={2}
											value={amount}
											onValueChange={(value, name, values) => values && setAmount(values.float || 1)}
											className="w-full rounded-md border-slate-200 text-right text-sm shadow-sm transition duration-200 ease-in-out placeholder:text-slate-400/90 focus:border-primary focus:border-opacity-40 focus:ring-4 focus:ring-primary focus:ring-opacity-20 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-transparent dark:bg-darkmode-800 dark:placeholder:text-slate-500/80 dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:disabled:border-transparent dark:disabled:bg-darkmode-800/50 [&[readonly]]:cursor-not-allowed [&[readonly]]:bg-slate-100 [&[readonly]]:dark:border-transparent [&[readonly]]:dark:bg-darkmode-800/50"
										/>
									</div>
									<div className="flex flex-col items-end justify-center">
										<div className="text-gray-500">
											1 {currency.value} = {currencyRate} TRY
										</div>
										<div className="font-bold text-success">
											{amount} {currency.value} = {(amount * currencyRate).toFixed(2)} EUR
										</div>
									</div>
								</div>
							</div>
							<div className="z-0 col-span-12 mt-3 md:col-span-6 xl:col-span-4 2xl:col-span-12 2xl:mt-2">
								<div className="intro-x flex h-10 items-center">
									<h2 className="mr-5 truncate text-lg font-medium">Son 10 İşlem</h2>
								</div>
								<div className="mt-5">
									{transactions.map((transaction, key) => (
										<div
											key={key}
											className="intro-x">
											<Link
												href={
													transaction.type === 'Ödeme'
														? route('hotel.customers.show', transaction.customer_id)
														: route('hotel.bookings.show', transaction.id)
												}
												className="box zoom-in mb-3 flex items-center px-5 py-3">
												<div className="image-fit flex items-center overflow-hidden rounded-full">
													{transaction.type === 'Ödeme' ? (
														<Lucide
															icon={'Banknote'}
															className="h-6 w-6 text-slate-900"
														/>
													) : (
														<Lucide
															icon={'CalendarPlus'}
															className="h-6 w-6 text-slate-900"
														/>
													)}
												</div>
												<div className="ml-4 mr-auto">
													<div className="font-medium">{transaction.type}</div>
													<div className="mt-0.5 text-xs text-slate-500">{transaction.date}</div>
												</div>
												<div className={twMerge(['text-success', transaction.type === 'Ödeme' && 'text-danger'])}>
													{transaction.amount}
												</div>
											</Link>
										</div>
									))}
								</div>
							</div>
							{/* END: Transactions */}
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

Index.layout = (page: React.ReactNode) => (
	<AuthenticatedLayout
		//todo burda bir header var ama kullanılmıyor. Ayrıca buraya breadcumb için bir dizi obje gönder topbarın içinde düzenle
		// header={<h2 className='font-semibold text-xl text-gray-800 leading-tight'>Show</h2>}
		breadcrumb={[
			{
				title: 'Dashboard',
				href: route('hotel.dashboard.index'),
			},
		]}>
		{page}
	</AuthenticatedLayout>
)
