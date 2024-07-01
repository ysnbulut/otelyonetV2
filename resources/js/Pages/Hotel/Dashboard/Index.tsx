import AuthenticatedLayout from '@/Layouts/HotelAuthenticatedLayout'
import {Head, Link} from '@inertiajs/react'
import {BookedRoomRackCardProps, IdName, PageProps} from './types'
import GeneralReports from './components/GeneralReports'
import route from 'ziggy-js'
import UpcomingBokingsSection from './components/UpcomingBokingsSection'
import React, {Fragment, useEffect, useState} from 'react'
import CurrencyInput from 'react-currency-input-field'
import Select from 'react-select'
import axios from 'axios'
import DashboardClock from '@/Pages/Hotel/Dashboard/components/DashboardClock'
import {twMerge} from 'tailwind-merge'
import Lucide from '@/Components/Lucide'
import Tippy from '@/Components/Tippy'
import Menu from '@/Components/Headless/Menu'
import Button from '@/Components/Button'
import BookedRoomCard from '@/Pages/Hotel/Dashboard/components/BookedRoomCard'
import RoomRackCards from '@/Pages/Hotel/Dashboard/components/RoomRackCards'

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
	// booked_rooms_weekly,
	transactions,
}: PageProps) {
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

	const links = [
		{label: 'Dolu Odalar', value: 'booked_rooms'},
		{label: 'Boş Odalar', value: 'available_rooms'},
		{label: 'Kirli Odalar', value: 'dirty_rooms'},
		{label: 'Satışa Kapalı Odalar', value: 'out_of_order_rooms'},
	]
	const [currency, setCurrency] = useState(currencies[0])
	const [currencyRate, setCurrencyRate] = useState(eur_exchange_rate)
	const [amount, setAmount] = useState<number>(1)
	const [roomRack, setRoomRack] = useState<BookedRoomRackCardProps[] | IdName[]>(booked_rooms)
	const [selectedRack, setSelectedRack] = useState<{label: string; value: string}>({
		label: 'Dolu Odalar',
		value: 'booked_rooms',
	})

	useEffect(() => {
		switch (selectedRack.value) {
			case 'booked_rooms':
				setRoomRack(booked_rooms)
				break
			case 'available_rooms':
				setRoomRack(available_rooms)
				break
			case 'dirty_rooms':
				setRoomRack(dirty_rooms)
				break
			case 'out_of_order_rooms':
				setRoomRack(out_of_order_rooms)
				break
			default:
				setRoomRack(booked_rooms)
				break
		}
	}, [selectedRack])

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
			<div className="grid grid-cols-12 gap-4">
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
						{/*TODO: Buraya ROOMRACK GELECEK*/}
						<fieldset className="relative col-span-12 grid grid-cols-12 gap-4 rounded-lg border p-2">
							<legend className="col-span-12 text-center text-lg font-thin text-[#e5e7eb] dark:text-white/5">
								Room Rack
							</legend>
							<Menu className="absolute -top-8 right-3">
								<div className="rounded-md bg-white dark:bg-darkmode-700">
									<Menu.Button
										className={twMerge(
											'flex w-44 items-center justify-between rounded-md px-2 py-1 text-center text-xs font-bold' +
												' shadow',
											selectedRack.value === 'booked_rooms' && 'border-2 border-success bg-success/10',
											selectedRack.value === 'available_rooms' && 'border-2 border-slate-300 bg-slate-300/10',
											selectedRack.value === 'dirty_rooms' && 'border-2 border-pending bg-pending/10',
											selectedRack.value === 'out_of_order_rooms' && 'border-2 border-danger bg-danger/10',
										)}>
										<span>{selectedRack.label}</span>
										<Lucide
											icon="ChevronDown"
											className="mt-0.5 h-4 w-4"
										/>
									</Menu.Button>
								</div>
								<Menu.Items>
									{links.map((link) => (
										/* Use the `active` state to conditionally style the active item. */
										<Menu.Item
											key={link.value}
											as={Fragment}>
											<Button
												type="button"
												className="flex w-full justify-start whitespace-nowrap rounded-none border-none text-left text-xs shadow-none ring-0 focus:border-none focus:ring-0"
												onClick={(e: any) => {
													e.preventDefault()
													setSelectedRack(link)
												}}>
												{link.label}
											</Button>
										</Menu.Item>
									))}
								</Menu.Items>
							</Menu>
							{roomRack.length > 0 ? (
								roomRack.map((room, index) => (
									<RoomRackCards
										roomRackType={selectedRack.value}
										room={room}
										key={index}
									/>
								))
							) : (
								<div className="col-span-12 flex h-40 items-center justify-center text-center text-lg font-thin text-[#e5e7eb] dark:text-white/5">
									Oda Bulunamadı...
								</div>
							)}
						</fieldset>
						{/* BEGIN: Weekly Top Items */}
						<UpcomingBokingsSection
							onEnterViewport={() => console.log('inner')}
							onLeaveViewport={() => console.log('leave')}
						/>
						{/* END: Weekly Top Items */}
					</div>
				</div>
				<div className="col-span-12 2xl:col-span-3">
					<div className="-mb-10 pb-10 2xl:border-l">
						<div className="grid grid-cols-12 gap-x-6 gap-y-2 2xl:gap-x-0 2xl:pl-4">
							{/* BEGIN: Transactions */}
							<div className="col-span-12 mt-1 md:col-span-6 xl:col-span-4 2xl:col-span-12 2xl:mt-5">
								<div className="intro-x flex h-10 items-center">
									<h2 className="mr-5 truncate text-lg font-medium">Saat</h2>
								</div>
								<DashboardClock />
							</div>
							<div className="col-span-12 mt-1 md:col-span-6 xl:col-span-4 2xl:col-span-12 2xl:mt-2">
								<div className="intro-x flex h-10 items-center">
									<h2 className="mr-5 truncate text-lg font-medium">Kurlar</h2>
								</div>
								<div className="box flex min-h-36 flex-col gap-3.5 px-4 py-5">
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
											onChange={(e: any) => {
												e && setCurrency(currencies.find((c) => c.value === e.value) || currencies[0])
												e && setAmount(1)
											}}
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
									<div className="flex flex-col items-end justify-center py-2">
										<div className="text-gray-500">
											1 {currency.value} = {currencyRate} TRY
										</div>
										<div className="font-bold text-success">
											{amount} {currency.value} = {(amount * currencyRate).toFixed(2)} TRY
										</div>
									</div>
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
