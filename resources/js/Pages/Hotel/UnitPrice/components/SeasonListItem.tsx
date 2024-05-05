import React, {useEffect, useState} from 'react'
import CurrencyInput from 'react-currency-input-field'
import {router, useForm} from '@inertiajs/react'
import {twMerge} from 'tailwind-merge'
import axios from 'axios'
import Button from '@/Components/Button'
import {SeasonListItemProps} from '../types/season-list-item'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import {FormLabel} from '@/Components/Form'

export function SeasonListItem(props: SeasonListItemProps) {
	const [submitClick, setSubmitClick] = useState<boolean>(false)
	const MySwall = withReactContent(Swal)
	const [editable, setEditable] = useState(false)
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

	const [price, setPrice] = useState(parseFloat(data.unit_price.toString()) / (1 + 0.2))
	const [tax, setTax] = useState(parseFloat(data.unit_price.toString()) - price)

	useEffect(() => {
		props.setWarnings((warnings) => ({
			...warnings,
			[props.season.id !== null ? props.season.id : 0]:
				data.unit_price === '0' || data.unit_price === '0,00' ? true : props.setableSubmitClick ? !submitClick : false,
		}))
	}, [data.unit_price, submitClick])

	useEffect(() => {
		if (data.unit_price === '0' || data.unit_price === '0,00') {
			setEditable(true)
		}
		setPrice(parseFloat(data.unit_price.toString()) / (1 + 0.2))
		setTax(parseFloat(data.unit_price.toString()) - price)
	}, [data.unit_price])

	useEffect(() => {
		setData((data) => ({
			...data,
			unit_price: price + price * 0.2,
		}))
		setTax(price * 0.2)
	}, [price])

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
					setEditable(false)
				})
				.catch((error) => {
					Toast.fire({
						icon: 'error',
						title: error.response.data.message,
					})
				})
		} else {
			if (data.unit_price === '0' || data.unit_price === '0,00') {
				Toast.fire({
					icon: 'error',
					title: 'Ünite Fiyatı 0 Olamaz!',
				})
			} else {
				axios
					.post(route('hotel.unit_prices.store'), data)
					.then((response) => {
						setEditable(false)
						Toast.fire({
							icon: 'success',
							title: 'Ünite Fiyatı Eklendi!',
						})
					})
					.catch((error) => {
						Toast.fire({
							icon: 'error',
							title: error.response.data.message,
						}).finally(() => {
							router.reload()
						})
					})
			}
		}
	}

	return (
		<form
			onSubmit={(e) => handleSubmit(e)}
			className="intro-x grid grid-cols-1 items-center gap-2 rounded p-3 lg:grid-cols-12">
			<div className="col-span-7 flex items-center justify-center border-b border-slate-100 lg:justify-start lg:border-b-0">
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
			<div className="col-span-5 flex items-center justify-center lg:justify-center">
				<div className="flex gap-2">
					<div className="flex flex-col">
						<FormLabel
							htmlFor="price"
							className="mb-0.5 mt-0 pl-0.5 text-xs font-semibold leading-none">
							Fiyat
						</FormLabel>
						<CurrencyInput
							id="price"
							placeholder={props.pricingPolicy === 'person_based' ? 'Kişi bazlı Oda Fİyatı' : 'Oda Fiyatı'}
							allowNegativeValue={false}
							allowDecimals={true}
							decimalSeparator=","
							decimalScale={2}
							suffix={` ${props.pricingCurrency}` || ' TRY'}
							value={price}
							decimalsLimit={2}
							required={true}
							disabled={!editable}
							onValueChange={(value) => value && setPrice(parseFloat(value))}
							name="unit_price"
							className={twMerge(
								'w-full rounded-md border-slate-200 py-1.5 text-right shadow-sm transition duration-200' +
									' ease-in-out placeholder:text-slate-400/90 focus:border-primary focus:border-opacity-40 focus:ring-4' +
									' focus:ring-opacity-20 disabled:cursor-not-allowed disabled:bg-slate-100' +
									' dark:border-transparent dark:bg-darkmode-800 dark:placeholder:text-slate-500/80' +
									' dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:disabled:border-transparent' +
									' dark:disabled:bg-darkmode-800/50 [&[readonly]]:cursor-not-allowed [&[readonly]]:bg-slate-100' +
									' [&[readonly]]:dark:border-transparent [&[readonly]]:dark:bg-darkmode-800/50',
								data.unit_price === '0' || data.unit_price === '0,00'
									? 'border-danger text-danger focus:border-danger focus:ring-danger '
									: 'focus:border-primary focus:ring-primary ',
							)}
						/>
					</div>
					<div className="flex flex-col">
						<FormLabel
							htmlFor="tax"
							className="mb-0.5 mt-0 pl-0.5 text-xs font-semibold leading-none">
							Kdv (%20)
						</FormLabel>
						<CurrencyInput
							id="tax"
							placeholder="KDV"
							allowNegativeValue={false}
							allowDecimals={true}
							decimalSeparator=","
							decimalScale={2}
							suffix={` ${props.pricingCurrency}` || ' TRY'}
							value={tax}
							decimalsLimit={2}
							required={true}
							disabled
							name="tax"
							className={twMerge(
								'w-full rounded-md border-slate-200 py-1.5 text-right shadow-sm transition duration-200' +
									' ease-in-out placeholder:text-slate-400/90 focus:border-primary focus:border-opacity-40 focus:ring-4' +
									' focus:ring-opacity-20 disabled:cursor-not-allowed disabled:bg-slate-100' +
									' dark:border-transparent dark:bg-darkmode-800 dark:placeholder:text-slate-500/80' +
									' dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:disabled:border-transparent' +
									' dark:disabled:bg-darkmode-800/50 [&[readonly]]:cursor-not-allowed [&[readonly]]:bg-slate-100' +
									' [&[readonly]]:dark:border-transparent [&[readonly]]:dark:bg-darkmode-800/50',
								'focus:border-primary focus:ring-primary ',
							)}
						/>
					</div>
					<div className="flex flex-col">
						<FormLabel
							htmlFor="price"
							className="mb-0.5 mt-0 pl-0.5 text-xs font-semibold leading-none">
							Toplam Fiyat
						</FormLabel>
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
							disabled={!editable}
							onValueChange={(value) =>
								setData((data) => ({
									...data,
									unit_price: value || '0',
								}))
							}
							name="unit_price"
							className={twMerge(
								'w-full rounded-md border-slate-200 py-1.5 text-right shadow-sm transition duration-200' +
									' ease-in-out placeholder:text-slate-400/90 focus:border-primary focus:border-opacity-40 focus:ring-4' +
									' focus:ring-opacity-20 disabled:cursor-not-allowed disabled:bg-slate-100' +
									' dark:border-transparent dark:bg-darkmode-800 dark:placeholder:text-slate-500/80' +
									' dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:disabled:border-transparent' +
									' dark:disabled:bg-darkmode-800/50 [&[readonly]]:cursor-not-allowed [&[readonly]]:bg-slate-100' +
									' [&[readonly]]:dark:border-transparent [&[readonly]]:dark:bg-darkmode-800/50',
								data.unit_price === '0' || data.unit_price === '0,00'
									? 'border-danger text-danger focus:border-danger focus:ring-danger '
									: 'focus:border-primary focus:ring-primary ',
							)}
						/>
					</div>
				</div>
				{!editable ? (
					<Button
						type="button"
						onClick={(e: any) => {
							e.preventDefault()
							setEditable(true)
						}}
						variant="soft-secondary"
						className={twMerge(
							'ml-2 mt-2.5',
							processing ? 'btn-loading' : '',
							data.unit_price === '0' || data.unit_price === '0,00' ? 'text-danger' : 'text-primary',
						)}>
						Düzenle
					</Button>
				) : !props.season.unit_price?.unit_price ? (
					<Button
						type="submit"
						variant="soft-secondary"
						className="ml-2 mt-2.5 text-danger">
						Kaydet {props.season.unit_price?.unit_price}
					</Button>
				) : (
					<Button
						type="submit"
						variant="soft-secondary"
						className="ml-2 mt-2.5 text-primary">
						Güncelle
					</Button>
				)}
			</div>
		</form>
	)
}

export default SeasonListItem
