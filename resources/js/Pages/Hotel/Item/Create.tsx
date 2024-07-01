import React, {useEffect, useRef, useState} from 'react'
import {Head, router, useForm} from '@inertiajs/react'
import Tippy from '@/Components/Tippy'
import Button from '@/Components/Button'
import Lucide from '@/Components/Lucide'
import AuthenticatedLayout from '@/Layouts/HotelAuthenticatedLayout'
import {PageProps, SalesUnitProps, UnitChannelsItemPriceProps} from '@/Pages/Hotel/Item/types/create'
import Dropzone, {DropzoneElement} from '@/Components/Dropzone'
import {FormInput, FormLabel} from '@/Components/Form'
import FormTextarea from '@/Components/Form/FormTextarea'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import Select, {SelectInstance, ActionMeta, OnChangeValue} from 'react-select'
import CurrencyInput from 'react-currency-input-field'
import ItemSalesUnitsList from '@/Pages/Hotel/Item/components/ItemSalesUnitsList'
function Create(props: PageProps) {
	const ref = useRef<SelectInstance>(null)
	const itemImageDropzoneRef = useRef<DropzoneElement>()
	const [image, setImage] = useState<string>('')
	const [selectedUnits, setSelectedUnits] = useState<SalesUnitProps[]>([])
	const [salesUnits, setSalesUnits] = useState<SalesUnitProps>()
	const [unitChannelItemPrices, setUnitChannelItemPrices] = useState<UnitChannelsItemPriceProps[]>()
	const [lastChanged, setLastChanged] = useState<'price' | 'totalPrice'>('price')
	const {data, setData, errors, setError, clearErrors} = useForm({
		name: '',
		description: '',
		type: '',
		preparation_time: '',
		price: '0',
		tax_id: '',
		tax: '0',
		total_price: '0',
		image_id: '',
		category_id: '',
	})

	const itemTypes = [
		{label: 'Ürün', value: 'product'},
		{label: 'Servis', value: 'service'},
		{label: 'Extra', value: 'extras'},
	]

	useEffect(() => {
		setData((data) => ({...data, sales_units: selectedUnits.map((unit) => unit.id)}))
	}, [selectedUnits])

	useEffect(() => {
		setData((data) => ({
			...data,
			unit_channel_item_prices: unitChannelItemPrices,
		}))
	}, [unitChannelItemPrices])

	useEffect(() => {
		if (lastChanged === 'price') {
			const taxRate = props.taxes.find((tax) => tax.value === parseInt(data.tax_id))?.rate || 0
			const totalPrice = (parseFloat(data.price.replace(',', '.')) * (1 + taxRate / 100)).toFixed(2)
			setData((data) => ({
				...data,
				total_price: totalPrice,
			}))
			const tax = (parseFloat(totalPrice) - parseFloat(data.price.replace(',', '.'))).toFixed(2)
			setData((data) => ({...data, tax: tax}))
		}
	}, [data.price, data.tax_id])

	useEffect(() => {
		if (lastChanged === 'totalPrice') {
			const taxRate = props.taxes.find((tax) => tax.value === parseInt(data.tax_id))?.rate || 0
			const price = (parseFloat(data.total_price.replace(',', '.')) / (1 + taxRate / 100)).toFixed(2)
			setData((data) => ({...data, price: price}))
			const tax = (parseFloat(data.total_price.replace(',', '.')) - parseFloat(price)).toFixed(2)
			setData((data) => ({...data, tax: tax}))
		}
	}, [data.total_price, data.tax_id])

	const handlePriceChange = (value: string) => {
		setLastChanged('price')
		setData((data) => ({...data, price: value}))
	}

	// totalPrice input onChange handler
	const handleTotalPriceChange = (value: string) => {
		setLastChanged('totalPrice')
		setData((data) => ({...data, total_price: value}))
	}

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		router.post(route('hotel.items.store'), data, {
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
					onClick={() => router.visit(route('hotel.items.index'))}
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
						{image !== '' ? (
							<>
								<Zoom>
									<img
										src={image}
										alt="Item Image"
										className="h-auto w-full rounded object-cover md:h-44 md:w-44"
									/>
								</Zoom>
								<FormInput
									type="hidden"
									name="image"
									value={data.image_id}
								/>
							</>
						) : (
							<Dropzone
								getRef={(el) => {
									itemImageDropzoneRef.current = el
								}}
								options={{
									url: route('hotel.items.image_upload'),
									thumbnailWidth: 200,
									thumbnailHeight: 200,
									headers: {'X-CSRF-TOKEN': props.csrf_token},
									uploadMultiple: false,
									maxFiles: 1,
									init() {
										this.on('success', (file, response: {message: string; image: {id: number; url: string}}) => {
											setData((data) => ({...data, image_id: response.image.id.toString()}))
											setImage(response.image.url)
											this.removeFile(file)
											console.log(file)
										})
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
							{errors.name && <span className="pl-1 text-xs font-thin text-danger">{errors.name}</span>}
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
							{errors.description && <span className="pl-1 text-xs font-thin text-danger">{errors.description}</span>}
						</div>
					</div>
				</div>
				<div className="col-span-12 grid grid-cols-12 gap-4">
					<div className="col-span-12 mt-2 lg:col-span-4">
						<FormLabel
							htmlFor="sku"
							className="font-medium">
							Tür
						</FormLabel>
						<Select
							id="type"
							name="type"
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
							options={itemTypes}
							onChange={(e) => {
								e && setData((data) => ({...data, type: e.value.toString()}))
							}}
						/>
						{errors.type && <span className="pl-1 text-xs font-thin text-danger">{errors.type}</span>}
					</div>
					<div className="col-span-12 mt-2 lg:col-span-4">
						<FormLabel
							htmlFor="preparation_time"
							className="font-medium">
							Kategori
						</FormLabel>
						<Select
							id="category"
							name="category"
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
						{errors.category_id && <span className="pl-1 text-xs font-thin text-danger">{errors.category_id}</span>}
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
						{errors.preparation_time && (
							<span className="pl-1 text-xs font-thin text-danger">{errors.preparation_time}</span>
						)}
					</div>
					<div className="col-span-12 mt-2 lg:col-span-4">
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
							suffix={` ${props.currency}`}
							value={data.price}
							decimalsLimit={2}
							required
							onValueChange={(value) => value && handlePriceChange(value)}
							name="price"
							className="w-full rounded-md border-slate-200 text-right text-sm shadow-sm transition duration-200 ease-in-out placeholder:text-slate-400/90 focus:border-primary focus:border-opacity-40 focus:ring-4 focus:ring-primary focus:ring-opacity-20 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-transparent dark:bg-darkmode-800 dark:placeholder:text-slate-500/80 dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:disabled:border-transparent dark:disabled:bg-darkmode-800/50 [&[readonly]]:cursor-not-allowed [&[readonly]]:bg-slate-100 [&[readonly]]:dark:border-transparent [&[readonly]]:dark:bg-darkmode-800/50"
						/>
						{errors.price && <span className="pl-1 text-xs font-thin text-danger">{errors.price}</span>}
					</div>
					<div className="col-span-12 mt-2 lg:col-span-4">
						<FormLabel
							htmlFor="tax_rate"
							className="font-medium">
							Vergi Oranı
						</FormLabel>
						<Select
							ref={ref}
							id="tax_rate"
							defaultValue={props.taxes.find((tax) => tax.value === parseInt(data.tax_id))}
							onChange={(e: any, action: any) => {
								if (action.action === 'select-option') {
									e && setData((data) => ({...data, tax_id: e.value}))
								} else if (action.action === 'clear') {
									setData((data) => ({...data, tax_id: ''}))
								} else {
									setData((data) => ({...data, tax_id: ''}))
								}
							}}
							options={props.taxes}
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
							placeholder="Vergi Oranı"
						/>
						{errors.tax_id && <span className="pl-1 text-xs font-thin text-danger">{errors.tax_id}</span>}
					</div>
					<div className="col-span-12 mt-2 lg:col-span-4">
						<FormLabel
							htmlFor="price"
							className="font-medium">
							Toplam Fiyat
						</FormLabel>
						<CurrencyInput
							id="totalPrice"
							allowNegativeValue={false}
							allowDecimals={true}
							decimalSeparator=","
							decimalScale={2}
							suffix={` ${props.currency}`}
							value={data.total_price}
							decimalsLimit={2}
							required
							onValueChange={(value) => value && handleTotalPriceChange(value)}
							name="totalPrice"
							className="w-full rounded-md border-slate-200 text-right text-sm shadow-sm transition duration-200 ease-in-out placeholder:text-slate-400/90 focus:border-primary focus:border-opacity-40 focus:ring-4 focus:ring-primary focus:ring-opacity-20 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-transparent dark:bg-darkmode-800 dark:placeholder:text-slate-500/80 dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:disabled:border-transparent dark:disabled:bg-darkmode-800/50 [&[readonly]]:cursor-not-allowed [&[readonly]]:bg-slate-100 [&[readonly]]:dark:border-transparent [&[readonly]]:dark:bg-darkmode-800/50"
						/>
						{errors.total_price && <span className="pl-1 text-xs font-thin text-danger">{errors.total_price}</span>}
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
				<ItemSalesUnitsList
					itemPrice={data.total_price}
					selectedUnits={selectedUnits}
					unitChannelItemPrices={unitChannelItemPrices}
					setUnitChannelItemPrices={setUnitChannelItemPrices}
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
				href: route('hotel.items.index'),
			},
			{
				title: 'Ürün Oluştur',
				href: route('hotel.items.create'),
			},
		]}>
		{page}
	</AuthenticatedLayout>
)
export default Create
