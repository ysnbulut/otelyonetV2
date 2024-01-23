import React, {useRef, useState} from 'react'
import {Head, router} from '@inertiajs/react'
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

function Create(props: PageProps) {
	const productImageDropzoneRef = useRef<DropzoneElement>()
	const [productPhoto, setProductPhoto] = useState<string | null>(null)
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
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
						{productPhoto ? (
							<>
								<Zoom>
									<img
										src={productPhoto}
										alt="Product Photo"
										className="h-auto w-full rounded object-cover md:h-44 md:w-44"
									/>
								</Zoom>
								<FormInput
									type="hidden"
									name="photo"
									value={productPhoto}
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
											setProductPhoto(response.url)
											// this.removeFile(file)
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
						/>
					</div>
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
