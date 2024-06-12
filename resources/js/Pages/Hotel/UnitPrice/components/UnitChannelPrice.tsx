import React, {useEffect, useState} from 'react'
import CurrencyInput from 'react-currency-input-field'
import {router, useForm} from '@inertiajs/react'
import {twMerge} from 'tailwind-merge'
import axios from 'axios'
import Button from '@/Components/Button'
import {SeasonListItemProps} from '../types/unit-channel-price'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import {FormLabel} from '@/Components/Form'
import Lucide from '@/Components/Lucide'

export function UnitChannelPrice(props: SeasonListItemProps) {
	const [submitClick, setSubmitClick] = useState<boolean>(false)
	const MySwall = withReactContent(Swal)
	const [editable, setEditable] = useState(false)
	const {data, setData, post, put, processing, errors} = useForm({
		type_has_view_id: props.roomTypeAndViewId,
		season_id: props?.season?.id || null,
		booking_channel_id: props.bookingChannel?.id || null,
		unit_price: Array.isArray(props.season?.unit_prices)
			? props.season?.unit_prices?.find((unit_price) => unit_price.booking_channel_id === props.bookingChannel?.id)?.unit_price ?? '0'
			: props.season?.unit_prices?.booking_channel_id === (props.bookingChannel?.id || null)
				? props.season?.unit_prices?.unit_price ?? '0'
				: '0' ?? '0',
	})
	const [price, setPrice] = useState(parseFloat(data.unit_price.toString()) / (1 + props.taxRate))
	const [tax, setTax] = useState(parseFloat(data.unit_price.toString()) - price)
	const [changePriceType, setChangePriceType] = useState<string>()
	const [postCheck, setPostCheck] = useState(false)

	useEffect(() => {
		const check = !((
			Array.isArray(props.season?.unit_prices)
				? props.season?.unit_prices?.find((unit_price) => unit_price.booking_channel_id === props.bookingChannel?.id)?.unit_price ?? '0'
				: props.season?.unit_prices?.unit_price
		)
			? (Array.isArray(props.season?.unit_prices)
					? props.season?.unit_prices?.find((unit_price) => unit_price.booking_channel_id === props.bookingChannel?.id)?.unit_price ?? '0'
					: props.season?.unit_prices?.unit_price) !== '0'
			: false)
		setPostCheck(check)
	}, [props.season])

	useEffect(() => {
		props.setWarning((warning) => (!warning ? warning : data.unit_price === '0' || data.unit_price === '0,00' ? true : props.setableSubmitClick ? !submitClick : false))
	}, [data.unit_price, submitClick])

	useEffect(() => {
		if (data.unit_price === '0' || data.unit_price === '0,00') {
			setEditable(true)
		}
		const price = parseFloat(data.unit_price.toString()) / (1 + props.taxRate)
		changePriceType === 'unit_price' && setPrice(price)
		changePriceType === 'unit_price' && setTax(parseFloat(data.unit_price.toString()) - price)
	}, [data.unit_price])

	useEffect(() => {
		changePriceType === 'price' &&
			setData((data) => ({
				...data,
				unit_price: price + price * props.taxRate,
			}))
		changePriceType === 'price' && setTax(price * props.taxRate)
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
		if (!postCheck) {
			const id = Array.isArray(props.season.unit_prices) ? props.season.unit_prices?.find((unit_price) => unit_price.booking_channel_id === props.bookingChannel?.id)?.id : props.season.unit_prices?.id

			put(route('hotel.unit_prices.update', id), {
				preserveState: true,
				preserveScroll: true,
				onSuccess: () => {
					Toast.fire({
						icon: 'success',
						title: 'Ünite Fiyatı Güncellendi!',
					})
					setEditable(false)
				},
			})
		} else {
			if (data.unit_price === '0,00' || data.unit_price === '0') {
				Toast.fire({
					icon: 'error',
					title: 'Ünite Fiyatı 0 Olamaz!',
				})
			} else {
				post(route('hotel.unit_prices.store'), {
					preserveState: true,
					preserveScroll: true,
					onSuccess: () => {
						Toast.fire({
							icon: 'success',
							title: 'Ünite Fiyatı Eklendi!',
						})
						setEditable(false)
					},
					onError: (error) => {
						console.log('error', error)
						Toast.fire({
							icon: 'error',
							title: 'Ünite Fiyatı Eklenemedi!',
						})
					},
				})
			}
		}
	}

	return (
		<form
			onSubmit={(e) => handleSubmit(e)}
			className="intro-x grid grid-cols-1 items-center gap-2 bg-transparent px-4 pb-4 pt-2 lg:grid-cols-12">
			<div className="col-span-7 mt-2 flex items-center justify-center border-b border-slate-100 lg:justify-start lg:border-b-0">
				<Lucide
					icon="GripHorizontal"
					className="mr-2 h-6 w-6 text-primary dark:text-white/50"
				/>
				<h3 className={twMerge('text-base font-normal', data.unit_price === '0' || data.unit_price === '0,00' ? 'text-danger' : props.season.name ? '' : 'text-pending')}>
					{props.bookingChannel ? props.bookingChannel?.name : 'Kanallar'}
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
							onValueChange={(value, name, values) => {
								setPrice(values?.float || 0)
								setChangePriceType('price')
							}}
							name="unit_price"
							className={twMerge(
								'w-full rounded-md border-slate-200 py-0.5 text-right shadow-sm transition duration-200' +
									' ease-in-out placeholder:text-slate-400/90 focus:border-primary focus:border-opacity-40 focus:ring-4' +
									' focus:ring-opacity-20 disabled:cursor-not-allowed disabled:bg-slate-100' +
									' dark:border-transparent dark:bg-darkmode-800 dark:placeholder:text-slate-500/80' +
									' dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:disabled:border-transparent' +
									' dark:disabled:bg-darkmode-800/50 [&[readonly]]:cursor-not-allowed [&[readonly]]:bg-slate-100' +
									' [&[readonly]]:dark:border-transparent [&[readonly]]:dark:bg-darkmode-800/50',
								data.unit_price === '0' || data.unit_price === '0,00' ? 'border-danger text-danger focus:border-danger focus:ring-danger ' : 'focus:border-primary focus:ring-primary ',
							)}
						/>
					</div>
					<div className="flex flex-col">
						<FormLabel
							htmlFor="tax"
							className="mb-0.5 mt-0 pl-0.5 text-xs font-semibold leading-none">
							Kdv (%{(props.taxRate * 100).toFixed(0)})
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
								'w-full rounded-md border-slate-200 py-0.5 text-right shadow-sm transition duration-200' +
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
							onValueChange={(value, name, values) => {
								setData((data) => ({
									...data,
									unit_price: values?.float || '0',
								}))
								setChangePriceType('unit_price')
							}}
							name="unit_price"
							className={twMerge(
								'w-full rounded-md border-slate-200 py-0.5 text-right shadow-sm transition duration-200' +
									' ease-in-out placeholder:text-slate-400/90 focus:border-primary focus:border-opacity-40 focus:ring-4' +
									' focus:ring-opacity-20 disabled:cursor-not-allowed disabled:bg-slate-100' +
									' dark:border-transparent dark:bg-darkmode-800 dark:placeholder:text-slate-500/80' +
									' dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:disabled:border-transparent' +
									' dark:disabled:bg-darkmode-800/50 [&[readonly]]:cursor-not-allowed [&[readonly]]:bg-slate-100' +
									' [&[readonly]]:dark:border-transparent [&[readonly]]:dark:bg-darkmode-800/50',
								data.unit_price === '0' || data.unit_price === '0,00' ? 'border-danger text-danger focus:border-danger focus:ring-danger ' : 'focus:border-primary focus:ring-primary ',
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
						className={twMerge('ml-2 mt-3 py-1 text-dark', processing ? 'btn-loading' : '')}>
						Düzenle
					</Button>
				) : postCheck ? (
					<Button
						type="submit"
						variant="soft-secondary"
						className="ml-2 mt-3 py-1 text-danger">
						Kaydet
					</Button>
				) : (
					<Button
						type="submit"
						variant="soft-secondary"
						className="ml-2 mt-3 py-1 text-primary">
						Güncelle
					</Button>
				)}
			</div>
		</form>
	)
}

export default UnitChannelPrice
