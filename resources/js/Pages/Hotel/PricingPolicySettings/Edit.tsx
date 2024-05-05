import React, {useEffect, useRef, useState} from 'react'
import {Head, useForm} from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/HotelAuthenticatedLayout'
import {PageProps} from '@/Pages/Hotel/PricingPolicySettings/types/edit'
import {FormLabel, FormInput, FormCheck} from '@/Components/Form'
import Select, {SelectInstance} from 'react-select'
import _ from 'lodash'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Button from '@/Components/Button'
import SelectBox from '@/Pages/Hotel/PricingPolicySettings/components/SelactBox'

function Edit(props: PageProps) {
	const MySwal = withReactContent(Swal)
	const ref = useRef<SelectInstance>(null)
	const {data, setData, errors, setError, clearErrors, put} = useForm(
		_.fromPairs(_.map(props.settings, (setting) => [setting.name, setting.value])),
	)

	console.log(props.settings)

	const Toast = MySwal.mixin({
		toast: true,
		position: 'top-end',
		showConfirmButton: false,
		timer: 3000,
		timerProgressBar: true,
		didOpen: (toast) => {
			toast.addEventListener('mouseenter', MySwal.stopTimer)
			toast.addEventListener('mouseleave', MySwal.resumeTimer)
		},
	})
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		console.log(data)
		put(route('hotel.pricing_policy_settings.update'), {
			preserveState: true,
			onSuccess: (response) => {
				Toast.fire({
					icon: 'success',
					title: 'Fiyatlandırma Ayarları Güncellendi.',
				})
				clearErrors()
			},
		})
	}

	return (
		<>
			<Head title="Fiyatlandırma Ayarları" />
			<h2 className="intro-y my-2 text-lg font-medium lg:my-5">Fiyatlandırma Ayarları</h2>
			<form
				onSubmit={(e) => handleSubmit(e)}
				className="box w-full p-5">
				{_.map(props.settings, (setting, key) => (
					<div
						key={key}
						className="grid grid-cols-2 items-start gap-5 border-b py-5 last:border-b-0">
						<FormLabel
							htmlFor={setting.name}
							className="col-span-2 flex flex-col gap-1 lg:col-span-1">
							<h3 className="text-lg font-semibold">{setting.label}</h3>
							<span className="text-xs text-slate-500">{setting.description}</span>
						</FormLabel>
						<div className="col-span-2 flex flex-col lg:col-span-1">
							{setting.type === 'select' && (
								<SelectBox
									dynamicOptions={
										setting.type === 'select'
											? setting.options.type === 'dynamic'
												? props[setting.options.values as string]
												: setting.options.values
											: []
									}
									setting={setting}
									data={data}
									setData={setData}
								/>
							)}
							{setting.type === 'text' && (
								<FormInput
									id={setting.name}
									name={setting.name}
									type="text"
									value={data[setting.name].toString()}
									onChange={(e) => setData((data) => ({...data, [setting.name]: e.target.value}))}
								/>
							)}
							{setting.type === 'number' && (
								<FormInput
									id={setting.name}
									name={setting.name}
									type="number"
									value={data[setting.name].toString()}
									onChange={(e) => setData((data) => ({...data, [setting.name]: e.target.value}))}
								/>
							)}
							{errors[setting.name] && <div className="text-theme-6 mt-2 text-danger">{errors[setting.name]}</div>}
						</div>
					</div>
				))}
				<div className="mt-5 flex justify-end">
					<Button
						type="submit"
						variant="primary">
						Kaydet
					</Button>
				</div>
			</form>
		</>
	)
}

Edit.layout = (page: any) => (
	<AuthenticatedLayout
		breadcrumb={[
			{
				title: 'Dashboard',
				href: route('hotel.dashboard.index'),
			},
			{
				title: 'Ünite Fiyatları',
				href: route('hotel.unit_prices.index'),
			},
		]}>
		{page}
	</AuthenticatedLayout>
)

export default Edit
