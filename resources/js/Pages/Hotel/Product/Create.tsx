import React, {useEffect, useRef, useState} from 'react'
import {Head, router, useForm} from '@inertiajs/react'
import Tippy from '@/Components/Tippy'
import Button from '@/Components/Button'
import Lucide from '@/Components/Lucide'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import {PageProps, SalesUnitProps, UnitChannelsProductPriceProps} from '@/Pages/Hotel/Product/types/create'
import Dropzone, {DropzoneElement} from '@/Components/Dropzone'
import {FormInput, FormLabel} from '@/Components/Form'
import FormTextarea from '@/Components/Form/FormTextarea'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import Select, {SelectInstance, ActionMeta, OnChangeValue} from 'react-select'
import CurrencyInput from 'react-currency-input-field'
import ProductSalesUnitsList from '@/Pages/Hotel/Product/components/ProductSalesUnitsList'

function Create(props: PageProps) {
	const ref = useRef<SelectInstance>(null)
	const productImageDropzoneRef = useRef<DropzoneElement>()
	const [photo, setPhoto] = useState<string>('')
	const [selectedUnits, setSelectedUnits] = useState<SalesUnitProps[]>([])
	const [salesUnits, setSalesUnits] = useState<SalesUnitProps>()
	const [unitChannelProductPrices, setUnitChannelProductPrices] = useState<UnitChannelsProductPriceProps[]>()
	const {data, setData, errors, setError, clearErrors} = useForm({
		name: '',
		description: '',
		sku: '',
		price: '0',
		tax_rate: '',
		preparation_time: '',
		photo_path: '',
		category_id: '',
	})

	useEffect(() => {
		setData((data) => ({...data, sales_units: selectedUnits.map((unit) => unit.id)}))
	}, [selectedUnits])

	useEffect(() => {
		setData((data) => ({
			...data,
			unit_channel_product_prices: unitChannelProductPrices,
		}))
	}, [unitChannelProductPrices])

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		router.post(route('hotel.products.store'), data, {
			onSuccess: (response) => {
				console.log('success', response)
			},
			onFinish: () => {
				clearErrors()
			},
			onError: (errors) => {
				// setError('name', errors.name)
			},
		})
		clearErrors()
	}
	return (
		<>
			<Head title="Oda Türleri" />
			<div className="my-5 flex w-full items-center justify-between">
				<h2 className="intro-y text-lg font-medium">
					Ürün <strong>Oluştur</strong>
				</h2>
				<Tippy
					as={Button}
					onClick={() => router.visit(route('hotel.products.index'))}
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
				className="box grid grid-cols-12 gap-4 p-5">
				<div className="col-span-12 flex flex-col items-stretch gap-4 md:flex-row md:items-center">
					<div className="flex w-full items-center justify-center rounded md:h-44 md:w-44">
						{photo !== '' ? (
							<>
								<Zoom>
									<img
										src={photo}
										alt="Product Photo"
										className="h-auto w-full rounded object-cover md:h-44 md:w-44"
									/>
								</Zoom>
								<FormInput
									type="hidden"
									name="photo"
									value={data.photo_path}
								/>
							</>
						) : (
							<Dropzone
								getRef={(el) => {
									productImageDropzoneRef.current = el
								}}
								options={{
									url: route('upload-media'),
									thumbnailWidth: 200,
									thumbnailHeight: 200,
									headers: {'X-CSRF-TOKEN': props.csrf_token},
									uploadMultiple: false,
									maxFiles: 1,
									init() {
										this.on(
											'success',
											(file, response: {name: string; original_name: string; url: string; path: string}) => {
												setData((data) => ({...data, photo_path: response.path}))
												setPhoto(response.url)
												this.removeFile(file)
											},
										)
									},
								}}
								className="flex h-full items-center rounded">
								<div className="text-xs text-gray-600">Fotoğraf Eklemek İçin Buraya Sürükleyin veya Tıklayın</div>
							</Dropzone>
						)}
					</div>
					<div className="flex-1">
						<>
							<FormLabel
								htmlFor="name"
								className="font-medium">
								Ürün Adı
							</FormLabel>
							<FormInput
								id="name"
								name="name"
								type="text"
								value={data.name}
								onChange={(e) => {
									setData((data) => ({...data, name: e.target.value}))
								}}
							/>
						</>
						<div className="mt-2">
							<FormLabel
								htmlFor="description"
								className="font-medium">
								Ürün Açıklaması
							</FormLabel>
							<FormTextarea
								id="description"
								name="description"
								value={data.description}
								onChange={(e) => {
									setData((data) => ({...data, description: e.target.value}))
								}}
							/>
						</div>
					</div>
				</div>
				<div className="col-span-12 grid grid-cols-12 gap-4">
					<div className="col-span-12 mt-2 lg:col-span-4">
						<FormLabel
							htmlFor="sku"
							className="font-medium">
							Ürün Kodu
						</FormLabel>
						<FormInput
							id="sku"
							name="sku"
							value={data.sku}
							onChange={(e) => {
								setData((data) => ({...data, sku: e.target.value}))
							}}
						/>
					</div>
					<div className="col-span-12 mt-2 lg:col-span-4">
						<FormLabel
							htmlFor="preparation_time"
							className="font-medium">
							Kategori
						</FormLabel>
						<Select
							id="preparation_time"
							name="preparation_time"
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
							options={props.categories.map((category) => ({
								label: category.name,
								value: category.id,
							}))}
							onChange={(e) => {
								e && setData((data) => ({...data, category_id: e.value.toString()}))
							}}
						/>
					</div>
					<div className="col-span-12 mt-2 lg:col-span-4">
						<FormLabel
							htmlFor="preparation_time"
							className="font-medium">
							Hazırlanma Süresi
						</FormLabel>
						<FormInput
							id="preparation_time"
							name="preparation_time"
							value={data.preparation_time}
							onChange={(e) => {
								setData((data) => ({...data, preparation_time: e.target.value}))
							}}
						/>
					</div>
					<div className="col-span-12 mt-2 lg:col-span-6">
						<FormLabel
							htmlFor="price"
							className="font-medium">
							Fiyatı
						</FormLabel>
						<CurrencyInput
							id="price"
							allowNegativeValue={false}
							allowDecimals={true}
							decimalSeparator=","
							decimalScale={2}
							suffix=" TRY"
							value={data.price}
							decimalsLimit={2}
							required
							onValueChange={(value) => value && setData((data) => ({...data, price: value}))}
							name="price"
							className="w-full rounded-md border-slate-200 text-right text-sm shadow-sm transition duration-200 ease-in-out placeholder:text-slate-400/90 focus:border-primary focus:border-opacity-40 focus:ring-4 focus:ring-primary focus:ring-opacity-20 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-transparent dark:bg-darkmode-800 dark:placeholder:text-slate-500/80 dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:disabled:border-transparent dark:disabled:bg-darkmode-800/50 [&[readonly]]:cursor-not-allowed [&[readonly]]:bg-slate-100 [&[readonly]]:dark:border-transparent [&[readonly]]:dark:bg-darkmode-800/50"
						/>
					</div>
					<div className="col-span-12 mt-2 lg:col-span-6">
						<FormLabel
							htmlFor="tax_rate"
							className="font-medium">
							Vergi Oranı
						</FormLabel>
						<FormInput
							id="tax_rate"
							name="tax_rate"
							value={data.tax_rate}
							onChange={(e) => {
								setData((data) => ({...data, tax_rate: e.target.value}))
							}}
						/>
					</div>
				</div>
				<div className="col-span-12 mt-2">
					<FormLabel
						htmlFor="preparation_time"
						className="font-medium">
						Ürünün Satılacağı Üniteleri Seç
					</FormLabel>
					<div className="grid grid-cols-12 gap-2">
						<Select
							ref={ref}
							id="preparation_time"
							name="preparation_time"
							className="remove-all my-select-container col-span-12 sm:col-span-9 md:col-span-10 lg:col-span-11"
							classNamePrefix="my-select"
							placeholder="Satış üniteleri"
							styles={{
								input: (base) => ({
									...base,
									'input:focus': {
										boxShadow: 'none',
									},
								}),
							}}
							options={props.sales_units
								.filter((unit) => !selectedUnits.find((selected_unit) => selected_unit.id === unit.id))
								.map((unit) => ({
									label: unit.name,
									value: unit.id,
								}))}
							onChange={(newValue: OnChangeValue<any, any>, actionMeta: ActionMeta<any>) => {
								if (actionMeta.action === 'select-option') {
									newValue &&
										setSalesUnits(
											props.sales_units.find((unit: {id: number; name: string}) => unit.id === newValue.value),
										)
								}
							}}
						/>
						<Button
							type="button"
							className="col-span-12 sm:col-span-3 md:col-span-2 lg:col-span-1"
							variant="soft-secondary"
							onClick={(e: any) => {
								e.preventDefault()
								if (salesUnits) {
									setSelectedUnits((selectedUnits) => [...selectedUnits, salesUnits])
									ref.current && ref.current.clearValue()
								}
							}}>
							Ekle
							<Lucide
								icon="Plus"
								className="ml-2 hidden h-5 w-5 lg:block"
							/>
						</Button>
					</div>
				</div>
				<ProductSalesUnitsList
					productPrice={data.price}
					selectedUnits={selectedUnits}
					unitChannelProductPrices={unitChannelProductPrices}
					setUnitChannelProductPrices={setUnitChannelProductPrices}
				/>
				<div className="col-span-12 flex justify-end">
					<Button
						type="submit"
						className="px-5"
						variant="soft-secondary">
						Kaydet
						<Lucide
							icon="CheckCheck"
							className="ml-2 h-5 w-5 text-success"
						/>
					</Button>
				</div>
			</form>
		</>
	)
}

Create.layout = (page: React.ReactNode) => (
	<AuthenticatedLayout
		breadcrumb={[
			{
				title: 'Dashboard',
				href: route('hotel.dashboard.index'),
			},
			{
				title: 'Ürünler',
				href: route('hotel.products.index'),
			},
			{
				title: 'Ürün Oluştur',
				href: route('hotel.products.create'),
			},
		]}>
		{page}
	</AuthenticatedLayout>
)
export default Create
