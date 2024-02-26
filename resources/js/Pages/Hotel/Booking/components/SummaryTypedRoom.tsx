import React, {useEffect, useState} from 'react'
import CurrencyInput from 'react-currency-input-field'
import {BookingResultProps} from '@/Pages/Hotel/Booking/types/steps'
import Button from '@/Components/Button'
import Lucide from '@/Components/Lucide'

interface SummaryTypedRoomProps {
	step: number
	bookingResult: BookingResultProps | undefined
	pricingCurrency: string
	room: {
		name: string
		count: number
		price: string
		total_price: string
	}
	grandTotal: number
	setGrandTotal: React.Dispatch<React.SetStateAction<number>>
}

function SummaryTypedRoom(props: SummaryTypedRoomProps) {
	const [price, setPrice] = useState<number>(parseFloat(props.room.price))
	const [totalPrice, setTotalPrice] = useState<number>(parseFloat(props.room.total_price))
	// const [priceFocus, setPriceFocus] = useState<boolean>(false)
	// const [totalPriceFocus, setTotalPriceFocus] = useState<boolean>(false)

	return (
		<div className="rounded border p-2">
			<div className="flex flex-col items-end justify-center gap-1 py-1">
				<span className="text-xs font-semibold">
					{props.room.name} {props.bookingResult?.night_count} Gece Toplam Fiyat
				</span>
				<div className="flex items-center justify-end">
					{/*{priceFocus && (*/}
					{/*	<Button*/}
					{/*		type="button"*/}
					{/*		className="bg-slate-100 p-0.5 text-xs font-semibold text-success"*/}
					{/*		onClick={() => {*/}
					{/*			props.setGrandTotal(*/}
					{/*				parseFloat(props.grandTotal.toFixed(2) || '0') -*/}
					{/*					(parseFloat(props.room.price) - price) * props.room.count,*/}
					{/*			)*/}
					{/*			setPriceFocus(false)*/}
					{/*		}}>*/}
					{/*		<Lucide*/}
					{/*			icon="CheckCheck"*/}
					{/*			className="h-4 w-4"*/}
					{/*		/>*/}
					{/*	</Button>*/}
					{/*)}*/}
					<CurrencyInput
						id="unit-price"
						allowNegativeValue={false}
						allowDecimals={true}
						decimalSeparator=","
						decimalScale={2}
						suffix={` ${props.pricingCurrency}` || ' TRY'}
						value={price}
						decimalsLimit={2}
						required={true}
						disabled={true}
						// onValueChange={(value, name, values) => {
						// 	setPrice(values?.float || 0)
						// 	setTotalPrice((values?.float || 0) * props.room.count)
						// 	values && values.float !== parseFloat(props.room.price) && setPriceFocus(true)
						// }}
						name="unit_price"
						className="w-28 border-none px-0.5 py-0.5 text-right text-sm font-normal text-danger focus:border-none focus:ring-0 dark:bg-darkmode-600"
					/>
				</div>
			</div>
			<div className="flex flex-col items-end justify-center border-b py-1">
				<span className="text-xs font-semibold">{props.room.count} Adet</span>
			</div>
			<div className="flex items-center justify-between py-1">
				<span className="text-xs font-semibold">Toplam</span>
				<div className="flex items-center justify-end">
					{/*{totalPriceFocus && (*/}
					{/*	<Button*/}
					{/*		type="button"*/}
					{/*		className="bg-slate-100 p-0.5 text-xs font-semibold text-success"*/}
					{/*		onClick={() => {*/}
					{/*			props.setGrandTotal(*/}
					{/*				parseFloat(props.grandTotal.toFixed(2) || '0') - (parseFloat(props.room.total_price) - totalPrice),*/}
					{/*			)*/}
					{/*			setTotalPriceFocus(false)*/}
					{/*		}}>*/}
					{/*		<Lucide*/}
					{/*			icon="CheckCheck"*/}
					{/*			className="h-4 w-4"*/}
					{/*		/>*/}
					{/*	</Button>*/}
					{/*)}*/}
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
						// onValueChange={(value, name, values) => {
						// 	setTotalPrice(values?.float || 0)
						// 	setPrice((values?.float || 0) / props.room.count)
						// 	values && values.float !== parseFloat(props.room.price) && setTotalPriceFocus(true)
						// }}
						name="unit_price"
						className="w-32 border-none px-0.5 py-0.5 text-right text-sm font-bold text-danger focus:border-none focus:ring-0 dark:bg-darkmode-600"
					/>
				</div>
			</div>
		</div>
	)
}

export default SummaryTypedRoom
