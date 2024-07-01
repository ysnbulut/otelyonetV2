import React, {useEffect, useState} from 'react'
import {StepThreeProps} from '@/Pages/Hotel/Booking/types/steps'
import {FormInput, FormLabel, FormTextarea} from '@/Components/Form'
import CreatableSelect from 'react-select/creatable'
import Select, {ActionMeta, OnChangeValue} from 'react-select'
import {useForm} from '@inertiajs/react'
import axios from 'axios'
import Button from '@/Components/Button'

function Three(props: StepThreeProps) {
	const [newCustomer, setNewCustomer] = useState<boolean>(false)
	const customerTypes = [
		{label: 'Bireysel', value: 'individual'},
		{label: 'Kurumsal', value: 'company'},
	]

	const {data, setData, errors, setError, clearErrors, post} = useForm(
		props.customerId
			? props.customers.find((customer) => customer.id === props.customerId)
			: {
					title: '',
					type: customerTypes[0].value,
					tax_office: '',
					tax_number: '',
					phone: '',
					email: '',
					country: '',
					city: '',
					address: '',
			  },
	)

	const options = props.customers.map((customer: {id: number; title: string}) => ({
		value: customer.id,
		label: customer.title,
	}))
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (newCustomer) {
			//burda dönüşün tipi yok tipsiz.
			axios
				.post(route('hotel.bookings.customer_add'), data)
				.then((response) => {
					props.setCustomerId(response.data.customer.id)
					setData((data) => ({
						...data,
						title: response.data.customer.title,
						type: response.data.customer.type,
						tax_office: response.data.customer.tax_office,
						tax_number: response.data.customer.tax_number,
						phone: response.data.customer.phone,
						email: response.data.customer.email,
						country: response.data.customer.country,
						city: response.data.customer.city,
						address: response.data.customer.address,
					}))
					props.setStepOneResults((prevState) =>
						prevState ? {...prevState, customers: [...prevState.customers, response.data.customer]} : undefined,
					)
					props.setBookingCustomer(response.data.customer)
					// props.setStep(4)
				})
				.catch((error) => {
					console.log(error)
				})
		}
	}

	return (
		<form
			onSubmit={(e) => handleSubmit(e)}
			className="box p-5">
			<fieldset className="grid grid-cols-12 gap-4 rounded border p-5">
				<legend>Müşteri Bilgileri</legend>
				<div className="col-span-12 lg:col-span-6">
					<FormLabel htmlFor="customers">Müşteri Ad Soyad / Ünvan</FormLabel>
					<CreatableSelect
						// ref={ref}
						id="customers"
						name="customers"
						isClearable
						isMulti={false}
						className="remove-all my-select-container col-span-12 sm:col-span-9 md:col-span-10 lg:col-span-11"
						classNamePrefix="my-select"
						placeholder="Müşteri Seç"
						defaultValue={props.customerId ? options.find((customer) => customer.value === props.customerId) : null}
						styles={{
							input: (base) => ({
								...base,
								'input:focus': {
									boxShadow: 'none',
								},
							}),
						}}
						options={options}
						onChange={(newValue: OnChangeValue<any, any>, actionMeta: ActionMeta<any>) => {
							if (actionMeta.action === 'select-option') {
								newValue && setData((data) => ({...data, title: newValue.value}))
								newValue && props.setCustomerId(newValue.value)
								newValue && setNewCustomer(false)
								if (newValue) {
									const customer = props.customers.find((customer) => customer.id === newValue.value)
									props.setBookingCustomer(customer)
									if (customer) {
										setData((data) => ({...data, type: customer.type}))
										setData((data) => ({...data, tax_office: customer.tax_office}))
										setData((data) => ({...data, tax_number: customer.tax_number}))
										setData((data) => ({...data, phone: customer.phone}))
										setData((data) => ({...data, email: customer.email}))
										setData((data) => ({...data, country: customer.country}))
										setData((data) => ({...data, city: customer.city}))
										setData((data) => ({...data, address: customer.address}))
									}
								}
							}
							if (actionMeta.action === 'create-option') {
								props.setCustomerId(undefined)
								props.setBookingCustomer(undefined)
								newValue && setData((data) => ({...data, title: newValue.value}))
								newValue && setNewCustomer(true)
								setData((data) => ({...data, type: 'individual'}))
								setData((data) => ({...data, tax_office: ''}))
								setData((data) => ({...data, tax_number: ''}))
								setData((data) => ({...data, phone: ''}))
								setData((data) => ({...data, email: ''}))
								setData((data) => ({...data, country: ''}))
								setData((data) => ({...data, city: ''}))
								setData((data) => ({...data, address: ''}))
							}
							if (actionMeta.action === 'clear') {
								props.setCustomerId(undefined)
								props.setBookingCustomer(undefined)
							}
						}}
					/>
				</div>
				<div className="col-span-12 lg:col-span-6">
					<FormLabel htmlFor="customer_types">Müşteri Türü</FormLabel>
					<Select
						id="customer_types"
						name="customer_types"
						defaultValue={customerTypes[0]}
						onChange={(e: any, action: any) => {
							if (action.action === 'select-option') {
								e && setData((data) => ({...data, customer_type: e.value}))
							} else if (action.action === 'clear') {
								setData((data) => ({...data, customer_type: customerTypes[0].value}))
							} else {
								setData((data) => ({...data, customer_type: customerTypes[0].value}))
							}
						}}
						className="remove-all my-select-container"
						classNamePrefix="my-select"
						styles={{
							input: (base) => ({
								...base,
								'input:focus': {
									boxShadow: 'none',
								},
							}),
						}}
						isClearable
						hideSelectedOptions
						options={customerTypes}
						placeholder="Rezervasyon Türü Seçiniz."
					/>
				</div>
				<div className="col-span-12 lg:col-span-6">
					<FormLabel htmlFor="booking_date">Vergi Dairesi</FormLabel>
					<FormInput
						id="tax_office"
						type="text"
						className="w-full"
						value={data.tax_office}
						onChange={(e) => setData((data) => ({...data, tax_office: e.target.value}))}
					/>
				</div>
				<div className="col-span-12 lg:col-span-6">
					<FormLabel htmlFor="booking_date">Vergi No / Kimlik No</FormLabel>
					<FormInput
						id="tax_number"
						type="text"
						className="w-full"
						value={data.tax_number}
						onChange={(e) => setData((data) => ({...data, tax_number: e.target.value}))}
					/>
				</div>
				<div className="col-span-12 lg:col-span-6">
					<FormLabel htmlFor="booking_date">Telefon</FormLabel>
					<FormInput
						id="phone"
						type="text"
						className="w-full"
						value={data.phone}
						onChange={(e) => setData((data) => ({...data, phone: e.target.value}))}
					/>
				</div>
				<div className="col-span-12 lg:col-span-6">
					<FormLabel htmlFor="booking_date">Email</FormLabel>
					<FormInput
						id="email"
						type="text"
						className="w-full"
						value={data.email}
						onChange={(e) => setData((data) => ({...data, email: e.target.value}))}
					/>
				</div>
				<div className="col-span-12 lg:col-span-6">
					<FormLabel htmlFor="booking_date">Ülke</FormLabel>
					<FormInput
						id="country"
						type="text"
						className="w-full"
						value={data.country}
						onChange={(e) => setData((data) => ({...data, country: e.target.value}))}
					/>
				</div>
				<div className="col-span-12 lg:col-span-6">
					<FormLabel htmlFor="booking_date">Şehir</FormLabel>
					<FormInput
						id="city"
						type="text"
						className="w-full"
						value={data.city}
						onChange={(e) => setData((data) => ({...data, city: e.target.value}))}
					/>
				</div>
				<div className="col-span-12 lg:col-span-12">
					<FormLabel htmlFor="booking_date">Adres</FormLabel>
					<FormTextarea
						id="address"
						className="w-full"
						value={data.address}
						onChange={(e) => setData((data) => ({...data, address: e.target.value}))}
					/>
				</div>
				{newCustomer && !props.customerId && (
					<div className="col-span-12 flex items-center justify-between gap-2">
						<span className="text-xs font-thin text-danger">
							Yeni müşteri eklendiğinde önce kaydetmelisin. Bir sonra ki adıma kaydettikten sonra geçebilirsin...
						</span>
						<Button
							variant="primary"
							type="submit"
							className="px-5">
							Kaydet
						</Button>
					</div>
				)}
			</fieldset>
		</form>
	)
}

export default Three
