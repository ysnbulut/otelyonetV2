import React from 'react'
import {FormInput, FormLabel, FormSelect, FormTextarea} from '@/Components/Form'
import {Head, Link, useForm} from '@inertiajs/react'
import Button from '@/Components/Button'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import {PageProps} from './types/edit'

function Edit(props: PageProps) {
	const {data, setData, put, processing, errors} = useForm({
		title: props.customer.title,
		type: props.customer.type,
		tax_number: props.customer.tax_number,
		email: props.customer.email,
		phone: props.customer.phone,
		country: props.customer.country,
		city: props.customer.city,
		address: props.customer.address,
	})

	const handleSubmit = (e: any): void => {
		e.preventDefault()
		put(route('hotel.customers.update', props.customer.id))
	}

	return (
		<AuthenticatedLayout
			user={props.auth.user}
			role={props.auth.role}
			permissions={props.auth.permissions}
			pricingPolicy={props.auth.pricing_policy}
			breadcrumb={[
				{
					title: 'Dashboard',
					href: route('hotel.dashboard.index'),
				},
				{
					title: 'Müşteriler',
					href: route('hotel.customers.index'),
				},
				{
					title: 'Müşteri Düzenle',
					href: route('hotel.customers.edit', props.customer.id),
				},
			]}>
			<Head title="Müşteri Düzenle" />
			<h2 className="intro-y my-5 text-lg font-medium">Müşteri Düzenle</h2>
			<form
				onSubmit={(e) => {
					handleSubmit(e)
				}}
				className="intro-y box p-5">
				<div className="flex flex-col">
					<div className="mb-2 w-full">
						<FormLabel
							htmlFor="title"
							className="form-label flex justify-between">
							Müşteri Ad Soyad / Ünvan
							<span className="mt-1 text-xs text-slate-500 sm:ml-auto sm:mt-0">Required, birini seçiniz</span>
						</FormLabel>
						<FormInput
							id="title"
							type="text"
							placeholder="Müşteri Ad Soyad / Ünvan"
							minLength={1}
							required={true}
							name="title"
							value={data.title}
							onChange={(e) => setData((data) => ({...data, title: e.target.value}))}
							className="w-full"
						/>
					</div>
					<div className="flex flex-col gap-2 lg:flex-row">
						<div className="input-form my-2 w-full lg:w-1/2">
							<FormLabel
								htmlFor="type"
								className="form-label flex justify-between">
								Müşteri Türü
								<span className="mt-1 text-xs text-slate-500 sm:ml-auto sm:mt-0">Required, birini seçiniz</span>
							</FormLabel>
							<FormSelect
								id="type"
								name="type"
								data-placeholder="Müşteri Türü"
								value={data.type}
								onChange={(e) => setData((data) => ({...data, type: e.target.value}))}
								className="w-full">
								<option value="individual">Şahıs</option>
								<option value="company">Şirket</option>
							</FormSelect>
							{errors.type && <div className="text-theme-6 mt-2 text-danger">{errors.type}</div>}
						</div>
						<div className="input-form my-2 w-full lg:w-1/2">
							<FormLabel
								htmlFor="tax_number"
								className="flex justify-between">
								Vergi Numarası
								<span className="mt-1 text-xs text-slate-500 sm:ml-auto sm:mt-0">Required, at least 2 characters</span>
							</FormLabel>
							<FormInput
								id="tax_number"
								type="text"
								placeholder="Vergi numarası"
								minLength={1}
								required={true}
								name="tax_number"
								value={data.tax_number}
								onChange={(e) => setData((data) => ({...data, tax_number: e.target.value}))}
								className="w-full"
							/>
							{errors.tax_number && <div className="text-theme-6 mt-2 text-danger">{errors.tax_number}</div>}
						</div>
					</div>
					<div className="flex flex-col gap-2 lg:flex-row">
						<div className="input-form my-2 w-full lg:w-1/2">
							<FormLabel
								htmlFor="email"
								className="form-label flex justify-between">
								Email
								<span className="mt-1 text-xs text-slate-500 sm:ml-auto sm:mt-0">Required, birini seçiniz</span>
							</FormLabel>
							<FormInput
								id="email"
								type="text"
								placeholder="Email"
								minLength={1}
								required={true}
								name="email"
								value={data.email}
								onChange={(e) => setData((data) => ({...data, email: e.target.value}))}
								className="w-full"
							/>
							{errors.email && <div className="text-theme-6 mt-2 text-danger">{errors.email}</div>}
						</div>
						<div className="input-form my-2 w-full lg:w-1/2">
							<FormLabel
								htmlFor="phone"
								className="form-label flex justify-between">
								Telefon
								<span className="mt-1 text-xs text-slate-500 sm:ml-auto sm:mt-0">Required, birini seçiniz</span>
							</FormLabel>
							<FormInput
								id="phone"
								type="text"
								placeholder="Telefon"
								minLength={1}
								required={true}
								name="phone"
								value={data.phone}
								onChange={(e) => setData((data) => ({...data, phone: e.target.value}))}
								className="w-full"
							/>
							{errors.phone && <div className="text-theme-6 mt-2 text-danger">{errors.phone}</div>}
						</div>
					</div>
					<div className="flex flex-col gap-2 lg:flex-row">
						<div className="input-form my-2 w-full lg:w-1/2">
							<FormLabel
								htmlFor="type"
								className="form-label flex justify-between">
								Ülke
								<span className="mt-1 text-xs text-slate-500 sm:ml-auto sm:mt-0">Required, birini seçiniz</span>
							</FormLabel>
							<FormInput
								id="country"
								type="text"
								placeholder="Ülke"
								minLength={1}
								required={true}
								name="country"
								value={data.country}
								onChange={(e) => setData((data) => ({...data, country: e.target.value}))}
								className="w-full"
							/>

							{errors.country && <div className="text-theme-6 mt-2 text-danger">{errors.country}</div>}
						</div>
						<div className="input-form my-2 w-full lg:w-1/2">
							<FormLabel
								htmlFor="type"
								className="form-label flex justify-between">
								Şehir
								<span className="mt-1 text-xs text-slate-500 sm:ml-auto sm:mt-0">Required, birini seçiniz</span>
							</FormLabel>
							<FormInput
								id="city"
								type="text"
								placeholder="Şehir"
								minLength={1}
								required={true}
								name="city"
								value={data.city}
								onChange={(e) => setData((data) => ({...data, city: e.target.value}))}
								className="w-full"
							/>
							{errors.city && <div className="text-theme-6 mt-2 text-danger">{errors.city}</div>}
						</div>
					</div>
					<div className="flex flex-col gap-2 lg:flex-row">
						<div className="input-form my-2 w-full">
							<FormLabel
								htmlFor="type"
								className="form-label flex justify-between">
								Adres
								<span className="mt-1 text-xs text-slate-500 sm:ml-auto sm:mt-0">Required, birini seçiniz</span>
							</FormLabel>
							<FormTextarea
								id="address"
								placeholder="Adres"
								minLength={1}
								required={true}
								name="address"
								value={data.address}
								onChange={(e) => setData((data) => ({...data, address: e.target.value}))}
								className="w-full"
							/>
						</div>
					</div>
				</div>
				<div className="my-5 flex justify-end">
					<Button
						type="submit"
						variant="success"
						className="px-5">
						Kaydet
					</Button>
				</div>
			</form>
		</AuthenticatedLayout>
	)
}

export default Edit
