import React, {useEffect, useState} from 'react'
import CurrencyInput from 'react-currency-input-field'
import {useForm} from '@inertiajs/react'
import {twMerge} from 'tailwind-merge'
import axios from 'axios'
import Button from '@/Components/Button'
import {SeasonListItemProps} from '@/Pages/UnitPrice/types/season-list-item'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

export function SeasonListItem(props: SeasonListItemProps) {
	const [submitClick, setSubmitClick] = useState<boolean>(false)
	const MySwall = withReactContent(Swal)
	const {data, setData, post, processing, errors} = useForm({
		type_has_view_id: props.roomTypeAndViewId,
		season_id: props.season.id,
		unit_price:
			props.season.unit_price !== null
				? props.season.unit_price.unit_price !== null
					? props.season.unit_price.unit_price
					: '0'
				: '0',
	})

	useEffect(() => {
		console.log(data.unit_price === '0' || data.unit_price === '0,00', 'data.unit_price', submitClick, 'submitClick')
		props.setWarnings((warnings) => ({
			...warnings,
			[props.season.id !== null ? props.season.id : 0]:
				data.unit_price === '0' || data.unit_price === '0,00' ? true : props.setableSubmitClick ? !submitClick : false,
		}))
	}, [data.unit_price, submitClick])

	const Toast = MySwall.mixin({
		toast: true,
		position: 'top-end',
		showConfirmButton: false,
		timer: 3000,
		timerProgressBar: true,
		didOpen: (toast) => {
			toast.onmouseenter = Swal.stopTimer
			toast.onmouseleave = Swal.resumeTimer
		},
	})
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (props.setableSubmitClick) {
			setSubmitClick(true)
		}
		if (props.season !== null && props.season.unit_price !== null) {
			axios
				.put(route('hotel.unit_prices.update', props.season.unit_price.id), data)
				.then((response) => {
					Toast.fire({
						icon: 'success',
						title: 'Ünite Fiyatı Güncellendi!',
					})
				})
				.catch((error) => {
					Toast.fire({
						icon: 'error',
						title: error.response.data.message,
					})
				})
		} else {
			axios
				.post(route('hotel.unit_prices.store'), data)
				.then((response) => {
					Toast.fire({
						icon: 'success',
						title: 'Ünite Fiyatı Eklendi!',
					})
				})
				.catch((error) => {
					Toast.fire({
						icon: 'error',
						title: error.response.data.message,
					})
				})
		}
	}

	return (
		<form
			onSubmit={(e) => handleSubmit(e)}
			className="intro-x grid grid-cols-1 items-center gap-2 rounded p-3 lg:grid-cols-3">
			<div className="col-span-2 flex items-center justify-center border-b border-slate-300 dark:border-slate-700 lg:justify-start lg:border-b-0">
				<h3
					className={twMerge(
						'text-base font-semibold',
						data.unit_price === '0' || data.unit_price === '0,00'
							? 'text-danger'
							: props.season.name
							  ? ''
							  : 'text-pending',
					)}>
					{props.season.name ? props.season.name : 'Sezon Dışı' + ' Fiyatı'}
				</h3>
			</div>
			<div className="flex items-center justify-center lg:justify-center">
				<CurrencyInput
					id="unit-price"
					placeholder={props.pricingPolicy === 'person_based' ? 'Kişi bazlı Oda Fİyatı' : 'Oda Fiyatı'}
					allowNegativeValue={false}
					allowDecimals={true}
					decimalSeparator=","
					decimalScale={2}
					suffix={` ${props.pricingCurrency}` || ' TRY'}
					value={data.unit_price}
					decimalsLimit={2}
					required={true}
					onValueChange={(value) =>
						setData((data) => ({
							...data,
							unit_price: value || '0',
						}))
					}
					name="unit_price"
					className={twMerge(
						'w-full rounded-md border-slate-200 text-right shadow-sm transition duration-200' +
							' ease-in-out placeholder:text-slate-400/90 focus:border-primary focus:border-opacity-40 focus:ring-4' +
							' focus:ring-primary focus:ring-opacity-20 disabled:cursor-not-allowed disabled:bg-slate-100' +
							' dark:border-transparent dark:bg-darkmode-800 dark:placeholder:text-slate-500/80' +
							' dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:disabled:border-transparent' +
							' dark:disabled:bg-darkmode-800/50 [&[readonly]]:cursor-not-allowed [&[readonly]]:bg-slate-100' +
							' [&[readonly]]:dark:border-transparent [&[readonly]]:dark:bg-darkmode-800/50',
						data.unit_price === '0' || data.unit_price === '0,00' ? 'border-danger text-danger' : '',
					)}
				/>
				<Button
					type="submit"
					variant="outline-primary"
					className={twMerge('ml-2', processing ? 'btn-loading' : '')}>
					Kaydet
				</Button>
			</div>
		</form>
	)
}

export default SeasonListItem
