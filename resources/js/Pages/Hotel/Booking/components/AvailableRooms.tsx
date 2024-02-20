import React, {useEffect, useState} from 'react'
import Lucide from '@/Components/Lucide'
import {Disclosure} from '@/Components/Headless'
import RoomCheckButton from '@/Pages/Hotel/Booking/components/RoomCheckButton'
import {AvailableRoomsProps} from '@/Pages/Hotel/Booking/types/available-rooms'
import {twMerge} from 'tailwind-merge'
import CurrencyInput from 'react-currency-input-field'
import Button from '@/Components/Button'
import {RoomGuestsProps, RoomTypeRoomGuestsProps} from '@/Pages/Hotel/Booking/types/steps'
import {GuestProps} from '@/Pages/Hotel/Booking/types/response'

function AvailableRooms(props: AvailableRoomsProps) {
	const [roomCount, setRoomCount] = useState<number>(0)
	const [calcTotalPrice, setCalcTotalPrice] = useState(
		props.item.price.total_price && parseFloat(props.item.price.total_price.replace(/,/g, '')),
	)
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

	useEffect(() => {
		setCalcTotalPrice(props.item.price.total_price && parseFloat(props.item.price.total_price.replace(/,/g, '')))
	}, [props.request])

	useEffect(() => {
		if (props.checkedRooms !== undefined && props.checkedRooms[props.item.id] !== undefined) {
			const totalPrice = props.item.price.total_price && parseFloat(props.item.price.total_price.replace(/,/g, ''))
			const newPrice = totalPrice && totalPrice * props.checkedRooms[props.item.id].length
			const newRoomCount = props.checkedRooms[props.item.id].length

			if (
				totalElementCount(props.checkedRooms) > 0 &&
				props.checkedRooms[props.item.id].length > 0 &&
				newPrice !== calcTotalPrice
			) {
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
							identification_number: '',
							is_foreign_national: false,
						})
					})
			})
			props.setRoomsGuests((prevState) => ({...prevState, ...generateD}))
		} else {
			const newPrice = props.item.price.total_price && parseFloat(props.item.price.total_price.replace(/,/g, ''))
			if (newPrice !== calcTotalPrice) {
				setCalcTotalPrice(newPrice)
			}

			if (roomCount !== 0) {
				setRoomCount(0)
			}
		}
	}, [props.checkedRooms, props.request, props.item.price.total_price, props.item.id])

	return (
		<div className="box w-full p-5">
			<div className="flex gap-4">
				<div className="flex flex-col items-center justify-start gap-2 lg:w-36">
					<img
						className="h-32 w-32 rounded object-cover"
						alt={props.item.name}
						src={props.item.photos[0]}
					/>
					<p className="text-center text-xs">Seçilen oda sayısı</p>
					<div className="flex items-center justify-between gap-1 rounded border bg-slate-50 p-2">
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
							className="p-1">
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
										? props.item.rooms
												.filter(
													(room) =>
														props.checkedRooms &&
														props.checkedRooms[props.item.id] &&
														!props.checkedRooms[props.item.id].includes(room.id),
												)
												.slice(0, 1)
										: props.item.rooms.slice(0, 1)
								props.setCheckedRooms((prevCheckedRooms) => ({
									...prevCheckedRooms,
									[props.item.id]:
										(prevCheckedRooms &&
											prevCheckedRooms[props.item.id] &&
											prevCheckedRooms[props.item.id].concat(newCheckedRooms.map((room) => room.id))) ||
										newCheckedRooms.map((room) => room.id),
								}))
							}}
							className="p-1">
							<Lucide
								icon="Plus"
								className="h-4 w-4"
							/>
						</Button>
					</div>
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
							<Disclosure.Button className="my-2 flex justify-between rounded-md border px-5 py-2">
								<span className="text-xl font-semibold text-primary">
									{props.item.available_room_count} <span className="font-light">uygun oda</span>
									<span className="ml-2 text-xs font-thin">oda seçimi yapmak için tıklayın.</span>
								</span>
							</Disclosure.Button>
							<Disclosure.Panel className="grid grid-cols-12 gap-2 leading-relaxed text-slate-600 dark:text-slate-500">
								{props.item.rooms.map((room, roomKey) => (
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
					<div className="flex justify-end">
						<h3 className="text-xl">
							Toplam Tutar :
							<span className="text-xl font-semibold text-danger">
								{formatToTurkishLira(calcTotalPrice)} {props.currency}
							</span>
						</h3>
					</div>
				</div>
			</div>
		</div>
	)
}

export default AvailableRooms
