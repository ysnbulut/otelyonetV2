import React, {useEffect, useState} from 'react'
import AuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout'
import {Head, router, useForm} from '@inertiajs/react'
import Tippy from '@/Components/Tippy'
import Button from '@/Components/Button'
import Lucide from '@/Components/Lucide'
import {FormInput, FormLabel, FormTextarea, InputGroup} from '@/Components/Form'
import Litepicker from '@/Components/Litepicker'
import CurrencyInput from 'react-currency-input-field'
import Select from 'react-select'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)
interface Province {
	id: number
	name: string
}

interface District {
	id: number
	province_id: number
	name: string
}

interface TaxOffice {
	id: number
	province_id: number
	tax_office: string
}

interface PageProps {
	provinces: Province[]
	districts: District[]
	tax_offices: TaxOffice[]
}

function Create(props: PageProps) {
	const {data, setData, errors, post, processing} = useForm({
		name: '',
		subdomain: '',
		register_date: dayjs().format('DD.MM.YYYY'),
		renew_date: dayjs().add(1, 'year').format('DD.MM.YYYY'),
		price: '0',
		renew_price: '0',
		title: '',
		address: '',
		province_id: '',
		district_id: '',
		tax_office_id: '',
		tax_number: '',
		phone: '',
		email: '',
	})
	const [province, setProvince] = useState<{label: string; value: number} | null>(null)
	const [districts, setDistricts] = useState<District[] | []>(
		props.districts.filter((district) => district.province_id === province?.value) || [],
	)
	const [district, setDistrict] = useState<{label: string; value: number} | null>(null)

	const [taxOffices, setTaxOffices] = useState<TaxOffice[] | []>(
		props.tax_offices.filter((tax_offices) => tax_offices.province_id === province?.value) || [],
	)
	const [taxOffice, setTaxOffice] = useState<{label: string; value: number} | null>(null)

	useEffect(() => {
		province !== null && province && setData((data) => ({...data, province_id: province.value.toString()}))
		province !== null &&
			province &&
			setDistricts(props.districts.filter((district) => district.province_id === province.value) || [])
		province !== null &&
			province &&
			setTaxOffices(props.tax_offices.filter((tax_office) => tax_office.province_id === province.value) || [])
	}, [province])

	useEffect(() => {
		district !== null && district && setData((data) => ({...data, district_id: district.value.toString()}))
	}, [district])

	useEffect(() => {
		taxOffice !== null && taxOffice && setData((data) => ({...data, tax_office_id: taxOffice.value.toString()}))
	}, [taxOffice])

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		post(route('admin.hotels.store'), {
			preserveScroll: true,
			onSuccess: (response: any) => {
				console.log(response)
			},
			onError: (errors: any) => {
				console.log(errors)
			},
		})
	}

	return (
		<>
			<Head title="Müşteri Ekle" />
			<div className="flex items-center justify-between">
				<h2 className="intro-y my-5 text-lg font-medium">Otel Ekle</h2>
				<Tippy
					as={Button}
					onClick={() => router.visit(route('admin.hotels.index'))}
					variant="soft-pending"
					className="intro-x"
					content="Geri">
					<Lucide
						icon="Undo2"
						className="h-5 w-5"
					/>
				</Tippy>
			</div>
			<form
				onSubmit={(e) => handleSubmit(e)}
				className="box flex flex-col gap-2 p-5">
				<div className="flex w-full flex-col gap-2 lg:flex-row">
					<div className="w-full lg:w-2/3">
						<FormLabel htmlFor="name">Adı</FormLabel>
						<FormInput
							type="text"
							id="name"
							name="name"
							value={data.name}
							onChange={(e) => setData((data) => ({...data, name: e.target.value}))}
						/>
					</div>
					<div className="w-full lg:w-1/3">
						<FormLabel htmlFor="subdomain">Subdomain</FormLabel>
						<InputGroup>
							<FormInput
								type="text"
								id="subdomain"
								name="subdomain"
								value={data.subdomain}
								onChange={(e) => setData((data) => ({...data, subdomain: e.target.value}))}
							/>
							<InputGroup.Text id="input-group-price">.otelyonet.com</InputGroup.Text>
						</InputGroup>
					</div>
				</div>
				<div className="flex w-full flex-col gap-2 lg:flex-row">
					<div className="w-full">
						<FormLabel htmlFor="register_date">Başlangıç Tarihi</FormLabel>
						<Litepicker
							id="register_date"
							name="register_date"
							value={data.register_date}
							onChange={(e) => {
								setData((data) => ({...data, register_date: e}))
								setData((data) => ({...data, renew_date: dayjs(e, 'DD.MM.YYYY').add(1, 'year').format('DD.MM.YYYY')}))
							}}
						/>
					</div>
					<div className="w-full">
						<FormLabel htmlFor="renew_date">Yenileme Tarihi</FormLabel>
						<Litepicker
							id="renew_date"
							name="renew_date"
							value={data.renew_date}
							onChange={(e) => setData((data) => ({...data, renew_date: e}))}
						/>
					</div>
				</div>
				<div className="flex w-full flex-col	gap-2 lg:flex-row">
					<div className="w-full">
						<FormLabel htmlFor="sales-price">Satış Fiyatı</FormLabel>
						<CurrencyInput
							id="sales-price"
							name="price"
							placeholder="Satış Fiyatı"
							allowNegativeValue={false}
							allowDecimals={true}
							decimalSeparator=","
							decimalScale={2}
							suffix=" USD"
							value={data.price}
							decimalsLimit={2}
							required={true}
							// disabled={!editable}
							onValueChange={(value, name, values) =>
								values && setData((data) => ({...data, price: values.float !== null ? values.float.toFixed(2) : '0'}))
							}
							className="w-full rounded-md border-slate-200 text-right shadow-sm transition duration-200 ease-in-out placeholder:text-slate-400/90 focus:border-primary focus:border-opacity-40 focus:ring-4 focus:ring-primary focus:ring-opacity-20 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-transparent dark:bg-darkmode-800 dark:placeholder:text-slate-500/80 dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:disabled:border-transparent dark:disabled:bg-darkmode-800/50 [&[readonly]]:cursor-not-allowed [&[readonly]]:bg-slate-100 [&[readonly]]:dark:border-transparent [&[readonly]]:dark:bg-darkmode-800/50"
						/>
					</div>
					<div className="w-full">
						<FormLabel htmlFor="renew_price">Yenileme Ücreti</FormLabel>
						<CurrencyInput
							id="renew_price"
							name="renew_price"
							placeholder="asdasd"
							allowNegativeValue={false}
							allowDecimals={true}
							decimalSeparator=","
							decimalScale={2}
							suffix=" USD"
							value={data.renew_price}
							decimalsLimit={2}
							required={true}
							// disabled={!editable}
							onValueChange={(value, name, values) =>
								values &&
								setData((data) => ({...data, renew_price: values.float !== null ? values.float.toFixed(2) : '0'}))
							}
							className="w-full rounded-md border-slate-200 text-right shadow-sm transition duration-200 ease-in-out placeholder:text-slate-400/90 focus:border-primary focus:border-opacity-40 focus:ring-4 focus:ring-primary focus:ring-opacity-20 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-transparent dark:bg-darkmode-800 dark:placeholder:text-slate-500/80 dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:disabled:border-transparent dark:disabled:bg-darkmode-800/50 [&[readonly]]:cursor-not-allowed [&[readonly]]:bg-slate-100 [&[readonly]]:dark:border-transparent [&[readonly]]:dark:bg-darkmode-800/50"
						/>
					</div>
				</div>
				<div>
					<FormLabel htmlFor="title">Ünvan</FormLabel>
					<FormInput
						type="text"
						name="title"
						id="title"
						value={data.title}
						onChange={(e) => setData((data) => ({...data, title: e.target.value}))}
					/>
				</div>
				<div className="w-full">
					<div>
						<FormLabel htmlFor="address">Adres</FormLabel>
						<FormTextarea
							name="address"
							rows={4}
							id="address"
							value={data.address}
							onChange={(e) => setData((data) => ({...data, address: e.target.value}))}
						/>
					</div>
				</div>
				<div className="flex w-full flex-col	gap-2 lg:flex-row">
					<div className="w-full">
						<FormLabel htmlFor="province">İl</FormLabel>
						<Select
							id="province"
							name="province"
							defaultValue={province}
							onChange={(e: any, action: any) => {
								if (action.action === 'select-option') {
									e && setProvince(e)
								} else if (action.action === 'clear') {
									setProvince(null)
								} else {
									setProvince(null)
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
							options={props.provinces.map((province) => ({
								value: province.id,
								label: province.name,
							}))}
							placeholder="İl Seçiniz."
						/>
					</div>
					<div className="w-full">
						<FormLabel htmlFor="district">İlçe</FormLabel>
						<Select
							id="district"
							name="district"
							defaultValue={district}
							onChange={(e: any, action: any) => {
								if (action.action === 'select-option') {
									e && setDistrict(e)
								} else if (action.action === 'clear') {
									setDistrict(null)
								} else {
									setDistrict(null)
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
							options={districts.map((province) => ({
								value: province.id,
								label: province.name,
							}))}
							placeholder="İlçe Seçiniz."
						/>
					</div>
				</div>
				<div className="flex w-full flex-col	gap-2 lg:flex-row">
					<div className="w-full">
						<FormLabel htmlFor="tax_office">Vergi Dairesi</FormLabel>
						<Select
							id="tax_office"
							name="tax_office"
							defaultValue={taxOffice}
							onChange={(e: any, action: any) => {
								if (action.action === 'select-option') {
									e && setTaxOffice(e)
								} else if (action.action === 'clear') {
									setTaxOffice(null)
								} else {
									setTaxOffice(null)
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
							options={taxOffices.map((taxOffice) => ({
								value: taxOffice.id,
								label: taxOffice.tax_office,
							}))}
							placeholder="Vergi Dairesi Seçiniz."
						/>
					</div>
					<div className="w-full">
						<FormLabel htmlFor="tax_number">Vergi Numarası</FormLabel>
						<FormInput
							type="text"
							name="tax_number"
							id="tax_number"
							value={data.tax_number}
							onChange={(e) => setData((data) => ({...data, tax_number: e.target.value}))}
						/>
					</div>
				</div>
				<div className="flex w-full flex-col	gap-2 lg:flex-row">
					<div className="w-full">
						<FormLabel htmlFor="phone">Telefon</FormLabel>
						<FormInput
							type="text"
							name="phone"
							id="phone"
							value={data.phone}
							onChange={(e) => setData((data) => ({...data, phone: e.target.value}))}
						/>
					</div>
					<div className="w-full">
						<FormLabel htmlFor="name">E-Mail</FormLabel>
						<FormInput
							type="text"
							name="email"
							id="email"
							value={data.email}
							onChange={(e) => setData((data) => ({...data, email: e.target.value}))}
						/>
					</div>
				</div>
				<div className="flex items-center justify-end">
					<Button
						variant="soft-secondary"
						className="gap-1 px-4">
						Kaydet
						<Lucide
							icon="CheckCheck"
							className="h-5 w-5 text-success"
						/>
					</Button>
				</div>
			</form>
		</>
	)
}

Create.layout = (page: any) => (
	<AuthenticatedLayout
		breadcrumb={[
			{
				title: 'Dashboard',
				href: route('admin.dashboard.index'),
			},
			{
				title: 'Oteller',
				href: route('admin.hotels.index'),
			},

			{
				title: 'Otel Ekle',
				href: route('admin.hotels.create'),
			},
		]}
		children={page}
	/>
)
export default Create
