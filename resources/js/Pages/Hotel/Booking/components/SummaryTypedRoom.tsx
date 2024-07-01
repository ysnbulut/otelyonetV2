import React, {useEffect, useState} from 'react'
import CurrencyInput from 'react-currency-input-field'
import {BookingResultProps, CheckedRoomsDailyPriceProps, RoomDailyPriceProps} from '@/Pages/Hotel/Booking/types/steps'
import {DailyPriceProps, StepOneDataProps} from '@/Pages/Hotel/Booking/types/response'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

interface SummaryTypedRoomProps {
	step: number
	bookingResult: BookingResultProps | undefined
	pricingCurrency: string
	room: {
		id: number
		name: string
		count: number
		price: number
		total_price: number
	}
	roomType: StepOneDataProps
	grandTotal: number
	setGrandTotal: React.Dispatch<React.SetStateAction<number>>
	discountableDailyPrices: CheckedRoomsDailyPriceProps | {[key: number]: any}
	discountRate: number
}

function SummaryTypedRoom(props: SummaryTypedRoomProps) {
	const [price, setPrice] = useState<number>(props.room.price)
	const [totalPrice, setTotalPrice] = useState<number>(props.room.total_price * props.room.count)

	const roomTypeFirstRoomId =
		props.discountableDailyPrices &&
		props.discountableDailyPrices[props.room.id] &&
		parseInt(Object.keys(props.discountableDailyPrices[props.room.id])[0])

	const groom = roomTypeFirstRoomId && props.roomType.rooms.find((room) => room.id === roomTypeFirstRoomId)

	useEffect(() => {
		setTotalPrice(props.room.total_price * props.discountRate)
	}, [props.room.count, props.discountRate])

	return (
		<div className="rounded border p-2">
			<div className="flex flex-col items-end justify-center gap-1 py-1">
				<span className="w-full border-b text-center text-xs font-semibold">{props.room.name}</span>
				<div className="w-full border-b px-1">
					{roomTypeFirstRoomId &&
						props.discountableDailyPrices &&
						props.discountableDailyPrices[props.room.id] &&
						props.discountableDailyPrices[props.room.id][roomTypeFirstRoomId].map(
							(dailyPrice: DailyPriceProps, index: number) => {
								return (
									<div
										key={index}
										className="flex items-center justify-between">
										<span className="text-xs font-semibold">
											{dayjs(dailyPrice.date, 'YYYY-MM-DD').format('DD.MM.YYYY')}
										</span>
										<div className="flex items-center justify-end">
											<CurrencyInput
												id="unit-price"
												allowNegativeValue={false}
												allowDecimals={true}
												decimalSeparator=","
												decimalScale={2}
												suffix={` ${props.pricingCurrency}` || ' TRY'}
												value={dailyPrice.price}
												decimalsLimit={2}
												required={true}
												disabled={true}
												name="unit_price"
												className="w-28 border-none px-0.5 py-0.5 text-right text-sm font-normal text-danger focus:border-none focus:ring-0 dark:bg-darkmode-600"
											/>
										</div>
									</div>
								)
							},
						)}
				</div>
			</div>
			<div className="flex flex-col items-end justify-center border-b py-1">
				<span className="text-xs font-semibold">{props.room.count} Adet</span>
			</div>
			<div className="flex items-center justify-between py-1">
				<span className="text-xs font-semibold">Toplam</span>
				<div className="flex items-center justify-end">
					<CurrencyInput
						id="unit-price"
						allowNegativeValue={false}
						allowDecimals={true}
						decimalSeparator=","
						decimalScale={2}
						suffix={` ${props.pricingCurrency}` || ' TRY'}
						value={totalPrice}
						decimalsLimit={2}
						required={true}
						disabled={true}
						name="unit_price"
						className="w-32 border-none px-0.5 py-0.5 text-right text-sm font-bold text-danger focus:border-none focus:ring-0 dark:bg-darkmode-600"
					/>
				</div>
			</div>
		</div>
	)
}

export default SummaryTypedRoom
