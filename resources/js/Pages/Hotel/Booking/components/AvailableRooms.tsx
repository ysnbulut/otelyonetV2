import React, {useEffect, useState} from 'react'
import Lucide from '@/Components/Lucide'
import {Disclosure, Menu} from '@/Components/Headless'
import RoomCheckButton from '@/Pages/Hotel/Booking/components/RoomCheckButton'
import {AvailableRoomsProps} from '@/Pages/Hotel/Booking/types/available-rooms'
import {twMerge} from 'tailwind-merge'
import CurrencyInput from 'react-currency-input-field'
import Button from '@/Components/Button'
import {CheckedRoomsDailyPriceProps, RoomDailyPriceProps, RoomGuestsProps, RoomTypeRoomGuestsProps} from '@/Pages/Hotel/Booking/types/steps'
import {DailyPriceProps, GuestProps} from '@/Pages/Hotel/Booking/types/response'
import {useAppSelector} from '@/stores/hooks'
import {selectDarkMode} from '@/stores/darkModeSlice'
import image from '../../../../../images/image.jpg'
import image_dark from '../../../../../images/image_dark.jpg'
import Select from 'react-select'

function AvailableRooms(props: AvailableRoomsProps) {
	const darkMode = useAppSelector(selectDarkMode)
	const [roomCount, setRoomCount] = useState<number>(0)
	const [calcTotalPrice, setCalcTotalPrice] = useState(props.selectedPrice && props.item.prices[props.selectedPrice[props.item.id]].total_price.price)
	const formatToTurkishLira = (amount: any): string => {
		return new Intl.NumberFormat('tr-TR', {minimumFractionDigits: 2, maximumFractionDigits: 2}).format(amount)
	}
	const totalElementCount = (checkedRooms: {[key: number]: number[]} | undefined) => {
		if (checkedRooms !== undefined) {
			let totalElementCount = 0
			for (let key in checkedRooms) {
				let count = checkedRooms[key].length
				totalElementCount += count
			}
			return totalElementCount
		} else {
			return 0
		}
	}

	const accommodationTypes: {[key: string]: string} = {
		only_room: 'Sadece Oda',
		room_breakfast: 'Oda ve Kahvaltı',
		half_board: 'Yarım Pansiyon',
		full_board: 'Tam Pansiyon',
		all_inclusive: 'Her Şey Dahil',
		ultra_all_inclusive: 'Ultra Her Şey Dahil',
	}

	const accommodationType = accommodationTypes[props.accommodationType] || 'Sadece Oda'

	// useEffect(() => {
	// 	props.selectedPrice && setCalcTotalPrice(props.item.prices[props.selectedPrice[props.item.id]].total_price.price)
	// }, [props.selectedPrice])

	useEffect(() => {
		if (props.checkedRooms !== undefined && props.checkedRooms[props.item.id] !== undefined) {
			const newPrice = props.selectedPrice && props.item.prices[props.selectedPrice[props.item.id]].total_price.price * props.checkedRooms[props.item.id].length
			const newRoomCount = props.checkedRooms[props.item.id].length
			if (totalElementCount(props.checkedRooms) > 0 && props.checkedRooms[props.item.id].length > 0 && newPrice !== calcTotalPrice) {
				setCalcTotalPrice(newPrice)
			}
			if (newRoomCount !== roomCount) {
				setRoomCount(newRoomCount)
			}

			let generateD: RoomTypeRoomGuestsProps = {}
			Object.keys(props.checkedRooms).forEach((key) => {
				generateD[parseInt(key)] = {} as RoomGuestsProps
				props.checkedRooms &&
					props.checkedRooms[parseInt(key)].forEach((room) => {
						generateD[parseInt(key)][room] = [] as GuestProps[]
						generateD[parseInt(key)][room].push({
							name: '',
							surname: '',
							citizen_id: '1',
							birthday: '',
							gender: '',
							identification_number: '',
							is_foreign_national: false,
						})
					})
			})
			props.setRoomsGuests((prevState) => ({...prevState, ...generateD}))
		} else {
			const newPrice = props.selectedPrice && props.item.prices[props.selectedPrice[props.item.id]].total_price.price
			if (newPrice !== calcTotalPrice) {
				setCalcTotalPrice(newPrice)
			}

			if (roomCount !== 0) {
				setRoomCount(0)
			}
		}
	}, [props.checkedRooms, props.item.id, props.selectedPrice])

	useEffect(() => {
		if (props.checkedRooms !== undefined && props.checkedRooms[props.item.id] !== undefined) {
			let generateDP: {[key: number]: any[]} = {} //burayı anlamadım
			generateDP[props.item.id] = [] as RoomDailyPriceProps[]
			props.checkedRooms &&
				props.checkedRooms[props.item.id] &&
				props.selectedPrice &&
				Object.values(props.checkedRooms[props.item.id]).forEach((room) => {
					generateDP[props.item.id][room] = [] as DailyPriceProps[]
					generateDP[props.item.id][room] = props.selectedPrice && props.item.prices[props.selectedPrice[props.item.id]].daily_prices
				})
			generateDP && generateDP[props.item.id] && props.setDailyPrices((prevState) => ({...prevState, ...generateDP}))
		}
	}, [props.checkedRooms])

	return (
		<div className="box w-full p-5">
			<div className="flex gap-4">
				<div className="flex flex-col items-center justify-start gap-2 lg:w-36">
					<img
						className="h-32 w-32 rounded object-cover shadow-sm"
						alt={props.item.name}
						src={props.item.photos.length > 0 ? props.item.photos[0] : darkMode ? image_dark : image}
					/>
					{props.item.rooms && (
						<>
							<p className="text-center text-xs">Seçilen oda sayısı</p>
							<div className="flex items-center justify-between gap-1 rounded border bg-slate-50 p-2 shadow-sm dark:bg-darkmode-700">
								<Button
									onClick={() => {
										if (roomCount > 0) {
											const newCheckedRooms = props.item.rooms.slice(0, roomCount - 1)
											props.setCheckedRooms((prevCheckedRooms) => ({
												...prevCheckedRooms,
												[props.item.id]: newCheckedRooms.map((room) => room.id),
											}))
										}
									}}
									className="bg-white p-1 dark:bg-darkmode-800">
									<Lucide
										icon="Minus"
										className="h-4 w-4"
									/>
								</Button>
								<CurrencyInput
									id="roomCount"
									placeholder={'Oda Sayısı'}
									allowNegativeValue={false}
									allowDecimals={true}
									decimalSeparator=","
									decimalScale={0}
									suffix=" Oda"
									value={roomCount}
									decimalsLimit={0}
									required={true}
									onValueChange={(value) => {
										const newCheckedRooms = props.item.rooms.slice(0, value !== undefined ? parseInt(value) : 0)
										props.setCheckedRooms((prevCheckedRooms) => ({
											...prevCheckedRooms,
											[props.item.id]: newCheckedRooms.map((room) => room.id),
										}))
									}}
									name="room_count"
									className={twMerge(
										'rounded-md text-right shadow-sm transition duration-200' +
											' ease-in-out placeholder:text-slate-400/90' +
											' disabled:cursor-not-allowed disabled:bg-slate-100' +
											' dark:border-transparent dark:bg-darkmode-800 dark:placeholder:text-slate-500/80' +
											' dark:focus:ring-slate-700 dark:disabled:border-transparent' +
											' dark:disabled:bg-darkmode-800/50 [&[readonly]]:cursor-not-allowed [&[readonly]]:bg-slate-100' +
											' [&[readonly]]:dark:border-transparent [&[readonly]]:dark:bg-darkmode-800/50',
										'focus:border-primary focus:ring-primary ',
										'w-16 rounded-none border-x-0 border-b-2 border-t-0 border-slate-900 p-0 text-center text-base' +
											' font-bold shadow-none focus:border-x-0 focus:border-b-2 focus:border-t-0 focus:border-b-slate-900' +
											' focus:border-opacity-70 focus:ring-0',
									)}
								/>
								<Button
									onClick={() => {
										const newCheckedRooms =
											props.checkedRooms && props.checkedRooms[props.item.id]
												? props.item.rooms.filter((room) => props.checkedRooms && props.checkedRooms[props.item.id] && !props.checkedRooms[props.item.id].includes(room.id)).slice(0, 1)
												: props.item.rooms.slice(0, 1)
										props.setCheckedRooms((prevCheckedRooms) => ({
											...prevCheckedRooms,
											[props.item.id]:
												(prevCheckedRooms && prevCheckedRooms[props.item.id] && prevCheckedRooms[props.item.id].concat(newCheckedRooms.map((room) => room.id))) ||
												newCheckedRooms.map((room) => room.id),
										}))
									}}
									className="bg-white p-1 dark:bg-darkmode-800">
									<Lucide
										icon="Plus"
										className="h-4 w-4"
									/>
								</Button>
							</div>
						</>
					)}
				</div>
				<div className="flex flex-1 flex-col gap-2">
					<h3 className="px-2 text-left text-2xl font-medium">{props.item.name}</h3>
					<div className="flex justify-between">
						<div className="flex justify-start">
							<div className="flex items-center justify-center border-r px-2 py-1">
								<Lucide
									icon="Ungroup"
									className="h-5 w-5"
								/>
								<span className="ml-2 text-sm">{props.item.room_count} odalı</span>
							</div>
							<div className="flex items-center justify-center border-r px-2 py-1">
								<Lucide
									icon="Scaling"
									className="h-5 w-5"
								/>
								<span className="ml-2 text-sm">
									{props.item.size} m<sup>2</sup>
								</span>
							</div>
							{props.item.beds.map((bed, bedKey) => (
								<div
									key={bedKey}
									className="flex items-center justify-center px-2 py-1">
									<Lucide
										icon={bed.person_num > 1 ? 'BedDouble' : 'BedSingle'}
										className="h-5 w-5"
									/>
									<span className="ml-2 text-sm">
										{bed.count} adet {bed.name}
									</span>
								</div>
							))}
						</div>
					</div>
					<Disclosure.Group>
						<Disclosure defaultOpen={false}>
							<Disclosure.Button className="my-2 flex justify-between rounded-md border px-5 py-2  shadow-sm">
								{props.item.rooms ? (
									<span className="text-xl font-semibold text-primary dark:text-light">
										{props.item.available_room_count} <span className="font-light">uygun oda</span>
										<span className="ml-2 text-xs font-thin">oda seçimi yapmak için tıklayın.</span>
									</span>
								) : (
									<span className="text-xl font-semibold text-danger">
										<span className="font-semibold">Uygun oda bulunamadı..</span>
									</span>
								)}
							</Disclosure.Button>
							<Disclosure.Panel className="grid grid-cols-12 gap-2 leading-relaxed text-slate-600 dark:text-slate-500">
								{props.item.rooms &&
									props.item.rooms.map((room, roomKey) => (
										<RoomCheckButton
											key={roomKey}
											room={room}
											itemId={props.item.id}
											checkedRooms={props.checkedRooms}
											setCheckedRooms={props.setCheckedRooms}
											setRoomCount={setRoomCount}
										/>
									))}
							</Disclosure.Panel>
						</Disclosure>
					</Disclosure.Group>
					{props.item.rooms && (
						<div className="flex flex-col items-stretch justify-between gap-4 xl:flex-row xl:items-start">
							<span className=" rounded-md border bg-slate-100 px-4 py-1 text-center text-lg font-semibold text-primary shadow-sm xl:text-left dark:bg-darkmode-700 dark:text-light">
								{accommodationType}
							</span>
							<div className="min-w-80 rounded-md border shadow-sm">
								<Menu>
									<Menu.Button className="mb-0 flex w-full items-center justify-between gap-2 rounded-t-md border-b bg-slate-100 px-1.5 py-2 font-semibold dark:bg-darkmode-700 dark:text-light">
										<span className="flex items-center justify-center gap-1">
											<Lucide
												icon="ChevronsRight"
												className="h-5 w-5 text-pending"
											/>
											{props.selectedPrice ? (props.selectedPrice[props.item.id] === 'agency' ? 'Acente Fiyatı' : 'Resepsiyon Fiyatı') : 'Resepsiyon Fiyatı'}
										</span>
										{Object.keys(props.item.prices).length > 1 && (
											<Lucide
												icon="ChevronDown"
												className="h-5 w-5 text-danger"
											/>
										)}
									</Menu.Button>
									{Object.keys(props.item.prices).length > 1 && (
										<Menu.Items className="bg-white p-0 font-semibold text-slate-900">
											{Object.keys(props.item.prices).map((price) => (
												<Menu.Item
													key={price}
													className="flex items-center justify-start gap-2 hover:rounded-none hover:bg-slate-100 first:hover:rounded-t-md last:hover:rounded-b-md"
													onClick={() =>
														props.setSelectedPrice((prevState: any) => {
															return {
																...prevState,
																[props.item.id]: price,
															}
														})
													}>
													<Lucide
														icon="ChevronsRight"
														className="h-4 w-4 text-primary"
													/>

													{price === 'agency' ? 'Acente Fiyatı' : 'Resepsiyon Fiyatı'}
												</Menu.Item>
											))}
										</Menu.Items>
									)}
								</Menu>
								<div className="flex w-full justify-between rounded-b-md bg-slate-100 px-3 py-1 text-xl dark:bg-darkmode-700">
									<span>Toplam Tutar : </span>
									<span className="ml-2 text-xl font-semibold text-danger">
										{formatToTurkishLira(calcTotalPrice)} {props.currency}
									</span>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default AvailableRooms
