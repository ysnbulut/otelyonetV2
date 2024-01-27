import React, {useRef, useState} from 'react'
import {Head, router, useForm} from '@inertiajs/react'
import Tippy from '@/Components/Tippy'
import Button from '@/Components/Button'
import Lucide from '@/Components/Lucide'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import {PageProps} from '@/Pages/Hotel/Product/types/create'
import Dropzone, {DropzoneElement} from '@/Components/Dropzone'
import {FormInput, FormLabel} from '@/Components/Form'
import FormTextarea from '@/Components/Form/FormTextarea'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import Toastify from 'toastify-js'
import Select from 'react-select'

function Create(props: PageProps) {
	const productImageDropzoneRef = useRef<DropzoneElement>()
	const {data, setData, errors, setError, clearErrors} = useForm({
		name: '',
		description: '',
		sku: '',
		cost: '',
		price: '',
		tax_rate: '',
		preparation_time: '',
		photo: '',
	})
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		router.post(route('hotel.products.store'), data, {
			onSuccess: () => {
				Toastify({
					text: 'Ürün başarıyla oluşturuldu.',
					duration: 3000,
					gravity: 'bottom',
					position: 'right',
					backgroundColor: 'linear-gradient(to right, #00b09b, #96c93d)',
				}).showToast()
			},
			onFinish: () => {
				clearErrors()
			},
			onError: (errors) => {
				setError('name', errors.name)
			},
		})
		clearErrors()
	}
	return (
		<>
			<Head title="Oda Türleri" />
			<div className="mb-5 mt-10 flex w-full items-center justify-between">
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
						{data.photo !== '' ? (
							<>
								<Zoom>
									<img
										src={data.photo}
										alt="Product Photo"
										className="h-auto w-full rounded object-cover md:h-44 md:w-44"
									/>
								</Zoom>
								<FormInput
									type="hidden"
									name="photo"
									value={data.photo}
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
										this.on('success', (file, response: {name: string; original_name: string; url: string}) => {
											setData((data) => ({...data, photo: response.url}))
											this.removeFile(file)
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
				<div className="col-span-12 grid grid-cols-10 gap-4">
					<div className="col-span-10 mt-2 lg:col-span-2">
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
					<div className="col-span-10 mt-2 sm:col-span-5 lg:col-span-2">
						<FormLabel
							htmlFor="cost"
							className="font-medium">
							Ürün Maliyeti
						</FormLabel>
						<FormInput
							id="cost"
							name="cost"
							value={data.cost}
							onChange={(e) => {
								setData((data) => ({...data, cost: e.target.value}))
							}}
						/>
					</div>
					<div className="col-span-10 mt-2 sm:col-span-5 lg:col-span-2">
						<FormLabel
							htmlFor="price"
							className="font-medium">
							Fiyatı
						</FormLabel>
						<FormInput
							id="price"
							name="price"
							value={data.price}
							onChange={(e) => {
								setData((data) => ({...data, price: e.target.value}))
							}}
						/>
					</div>
					<div className="col-span-10 mt-2 sm:col-span-5 lg:col-span-2">
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
					<div className="col-span-10 mt-2 sm:col-span-5 lg:col-span-2">
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
					<div className="col-span-10 mt-2 sm:col-span-5 lg:col-span-2">
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
								e && setData((data) => ({...data, preparation_time: e.value.toString()}))
							}}
						/>
					</div>
				</div>
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
