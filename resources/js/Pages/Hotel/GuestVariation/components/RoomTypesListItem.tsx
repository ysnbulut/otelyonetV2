import React, {useEffect, useState} from 'react'
import {useForm} from '@inertiajs/react'
import {twMerge} from 'tailwind-merge'
import axios from 'axios'
import {RoomTypesListItemProps} from '../types/room-types-list-item'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Button from '@/Components/Button'
import {FormInput} from '@/Components/Form'

export function RoomTypesListItem(props: RoomTypesListItemProps) {
	const [submitClick, setSubmitClick] = useState<boolean>(false)
	const MySwall = withReactContent(Swal)
	const {data, setData, processing} = useForm({
		room_type_id: props.roomTypeId,
		variation_id: props.variation.id,
		multiplier:
			props.variation.multiplier !== null
				? props.variation.multiplier.multiplier !== null
					? props.variation.multiplier.multiplier
					: ''
				: '',
	})

	useEffect(() => {
		props.setWarnings((warnings) => ({
			...warnings,
			[props.variation.id !== null ? props.variation.id : 0]:
				data.multiplier === '' || data.multiplier === '0' ? true : props.setableSubmitClick ? !submitClick : false,
		}))
	}, [data.multiplier, submitClick])

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
		if (props.variation !== null && props.variation.multiplier !== null) {
			axios
				.put(route('hotel.variations.update', props.variation.multiplier.id), data)
				.then(() => {
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
				.post(route('hotel.variations.store'), data)
				.then(() => {
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
						data.multiplier === '' || data.multiplier === '0' ? 'text-danger' : '',
					)}>
					{props.variationName}
				</h3>
			</div>
			<div className="flex items-center justify-center lg:justify-center">
				<FormInput
					id="multiplier"
					type="number"
					placeholder="Çarpan Katsayısı"
					value={data.multiplier}
					onChange={(e) => setData((data) => ({...data, multiplier: e.target.value}))}
					min={1}
					step={0.001}
					required={true}
					name="multiplier"
					className={twMerge(
						'text-right',
						data.multiplier === '' || data.multiplier === '0' ? 'border-danger text-danger' : '',
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

export default RoomTypesListItem
