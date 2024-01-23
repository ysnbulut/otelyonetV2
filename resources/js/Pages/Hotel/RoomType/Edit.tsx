import React, {useEffect, useRef, useState} from 'react'
import {PageProps, SelectedFeatures} from './types/edit'
import {Head, router, useForm} from '@inertiajs/react'
import Button from '@/Components/Button'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import {FormInput, FormLabel, FormTextarea, InputGroup} from '@/Components/Form'
import BedsSection from '@/Pages/Hotel/RoomType/components/BedsSection'
import ViewsSection from '@/Pages/Hotel/RoomType/components/ViewsSection'
import Dropzone, {DropzoneElement} from '@/Components/Dropzone'
import axios from 'axios'
import {ReactSortable} from 'react-sortablejs'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import {ArrowRightLeft, Trash2} from 'lucide-react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Features from '@/Pages/Hotel/RoomType/components/Features'
import Lucide from '@/Components/Lucide'
import Tippy from '@/Components/Tippy'

export default function Edit(props: PageProps) {
	const MySwal = withReactContent(Swal)
	const dropzoneMultipleRef = useRef<DropzoneElement>()
	const [photos, setPhotos] = useState(props.roomType.photos)
	const [features, setFeatures] = useState(props.features)
	const [selectedFeatures, setSelectedFeatures] = useState<SelectedFeatures[]>(
		props.features
			.filter((feature) => props.roomType.features.some((item) => item.id === feature.id))
			.map((feature) => ({feature_id: feature.id, order_no: feature.order_no})),
	)

	const {data, setData, errors, setError, clearErrors} = useForm({
		name: props.roomType.name,
		size: props.roomType.size.toString(),
		room_count: props.roomType.room_count.toString(),
		adult_capacity: props.roomType.adult_capacity.toString(),
		child_capacity: props.roomType.child_capacity.toString(),
		description: props.roomType.description || '',
		room_type_features: selectedFeatures,
	})

	useEffect(() => {
		setData((data) => ({...data, room_type_features: selectedFeatures}))
		// setData('features', selectedFeatures)
		// console.log('data.features', data.features)
		// console.log('selectedFeatures', selectedFeatures)
	}, [selectedFeatures])

	const Toast = MySwal.mixin({
		toast: true,
		position: 'top-end',
		showConfirmButton: false,
		timer: 3000,
		timerProgressBar: false,
		didOpen: (toast) => {
			toast.addEventListener('mouseenter', MySwal.stopTimer)
			toast.addEventListener('mouseleave', MySwal.resumeTimer)
		},
	})

	const deletePhoto = (id: number) => {
		MySwal.fire({
			text: 'Fotoğrafı silmek istediğinize emin misiniz?',
			showCancelButton: true,
			confirmButtonText: 'Evet',
			cancelButtonText: 'Hayır',
			confirmButtonColor: '#1e40af',
			cancelButtonColor: '#1e293b',
			width: 400,
			reverseButtons: true,
		}).then((result) => {
			if (result.isConfirmed) {
				axios
					.delete(route('hotel.room_types.photo_delete', {room_type: props.roomType.id, photo_id: id}))
					.then(() => {
						const newPhotos = photos.filter((photo) => photo.id !== id)
						setPhotos(newPhotos)
						Toast.fire({
							icon: 'success',
							title: 'Fotoğraf başarıyla silindi.',
						}).then((e) => {
							console.log(e)
						})
					})
					.catch(() => {})
			}
		})
	}

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		// @ts-ignore
		router.put(route('hotel.room_types.update', props.roomType.id), data, {
			onSuccess: () => {
				Toast.fire({
					icon: 'success',
					title: 'Oda türü başarıyla güncellendi.',
				})
				clearErrors()
				router.visit(route('hotel.room_types.index'))
			},
			onError: (errors: any) => {
				setError(errors)
			},
		})
		// axios.put(route('hotel.room_types.update', props.roomType.id), data).then((response) => {
		// 	Toast.fire({
		// 		icon: 'success',
		// 		title: 'Oda türü başarıyla güncellendi.',
		// 	}).catch((e) => {
		// 		console.log(e)
		// 	})
		// })
	}

	return (
		<>
			<Head title="Oda Türleri" />
			<div className="mb-5 mt-10 flex w-full items-center justify-between">
				<h2 className="intro-y text-lg font-medium">
					<strong>{props.roomType.name}</strong> Oda Türünü <strong>Düzenle</strong>
				</h2>
				<Tippy
					as={Button}
					onClick={() => router.visit(route('hotel.room_types.index'))}
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
				className="box flex flex-col gap-4 p-5">
				<div>
					<FormLabel htmlFor="name">Oda Türü Adı</FormLabel>
					<FormInput
						id="name"
						type="text"
						value={data.name}
						onChange={(e) => {
							setData((data) => ({...data, name: e.target.value}))
						}}
					/>
					{errors.name && <div className="text-theme-6 mt-2 text-danger">{errors.name}</div>}
				</div>
				<div className="grid grid-cols-1 items-center justify-between gap-4 sm:grid-cols-2 lg:grid-cols-4">
					<div className="w-full">
						<FormLabel htmlFor="name">Oda Boyutu</FormLabel>
						<InputGroup className="w-full">
							<FormInput
								id="size"
								type="number"
								value={data.size}
								onChange={(e) => {
									setData((data) => ({...data, size: e.target.value.toString()}))
								}}
							/>
							<InputGroup.Text>
								m<sup>2</sup>
							</InputGroup.Text>
						</InputGroup>
						{errors.size && <div className="text-theme-6 mt-2 text-danger">{errors.size}</div>}
					</div>
					<div className="w-full">
						<FormLabel htmlFor="name">Kaç Odalı</FormLabel>
						<InputGroup className="w-full">
							<FormInput
								id="room_count"
								type="number"
								className="w-full"
								value={data.room_count}
								onChange={(e) => {
									setData((data) => ({...data, room_count: e.target.value.toString()}))
								}}
							/>
							<InputGroup.Text>Odalı</InputGroup.Text>
						</InputGroup>
						{errors.room_count && <div className="text-theme-6 mt-2 text-danger">{errors.room_count}</div>}
					</div>
					<div className="w-full">
						<FormLabel htmlFor="name">Yetişkin Kapasitesi</FormLabel>
						<InputGroup className="w-full">
							<FormInput
								id="adult_capacity"
								type="number"
								className="w-full"
								value={data.adult_capacity}
								onChange={(e) => {
									setData((data) => ({...data, adult_capacity: e.target.value.toString()}))
								}}
							/>
							<InputGroup.Text>Yetişkin</InputGroup.Text>
						</InputGroup>
						{errors.adult_capacity && <div className="text-theme-6 mt-2 text-danger">{errors.adult_capacity}</div>}
					</div>
					<div className="w-full">
						<FormLabel htmlFor="name">Çocuk Kapasitesi</FormLabel>
						<InputGroup className="w-full">
							<FormInput
								id="child_capacity"
								type="number"
								className="w-full"
								value={data.child_capacity}
								onChange={(e) => {
									setData((data) => ({...data, child_capacity: e.target.value.toString()}))
								}}
							/>
							<InputGroup.Text>Çocuk</InputGroup.Text>
						</InputGroup>
						{errors.child_capacity && <div className="text-theme-6 mt-2 text-danger">{errors.child_capacity}</div>}
					</div>
				</div>
				<div>
					<FormLabel htmlFor="name">Açıklama</FormLabel>
					<FormTextarea
						id="description"
						value={data.description}
						onChange={(e) => {
							setData((data) => ({...data, description: e.target.value}))
						}}
					/>
					{errors.description && <div className="text-theme-6 mt-2 text-danger">{errors.description}</div>}
				</div>
				<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
					<BedsSection
						roomTypeId={props.roomType.id}
						bedTypes={props.beds}
						roomTypeBeds={props.roomType.beds}
					/>
					<ViewsSection
						roomTypeId={props.roomType.id}
						views={props.views}
						roomTypeViews={props.roomType.views}
					/>
				</div>
				<Features
					features={features}
					setFeatures={setFeatures}
					selectedFeatures={selectedFeatures}
					setSelectedFeatures={setSelectedFeatures}
				/>
				{errors.room_type_features && <div className="text-theme-6 mt-2 text-danger">{errors.room_type_features}</div>}
				<div className="relative rounded-lg bg-slate-100 p-4 dark:bg-darkmode-700">
					{photos.length > 0 ? (
						<ReactSortable
							group="photos"
							list={photos}
							setList={setPhotos}
							animation={500}
							delay={5}
							ghostClass="sortable-ghost"
							chosenClass="sortable-chosen"
							dragClass="sortable-drag"
							handle="#handlePhoto"
							draggable="#photoItem"
							onEnd={(evt) => {
								axios
									.post(route('hotel.room_type_features.photos_orders_update', props.roomType.id), {
										media_id: evt.item.dataset.id,
										old_order_no: evt.oldIndex ? evt.oldIndex + 1 : 1,
										new_order_no: evt.newIndex ? evt.newIndex + 1 : 1,
									})
									.then(() => console.log('success'))
									.catch(() => {})
							}}
							className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
							{photos.map((photo, key) => (
								<div
									id="photoItem"
									key={photo.id}
									className="box rouded">
									<div className="flex h-32 min-w-full items-center justify-center overflow-hidden rounded shadow">
										<div
											id="handlePhoto"
											className="absolute left-0 top-0 z-10 rounded-br rounded-tl bg-slate-300/60 p-1 text-slate-800 dark:bg-darkmode-700/70 dark:text-slate-100">
											<ArrowRightLeft className="h-5 w-5" />
										</div>
										<Button
											id="trashPhoto"
											variant="danger"
											type="button"
											className="absolute right-0 top-0 z-10 rounded-bl rounded-br-none rounded-tl-none rounded-tr p-1 focus:ring-0"
											onClick={() => {
												deletePhoto(photo.id)
											}}>
											<Trash2 className="h-4 w-4" />
										</Button>
										<Zoom>
											<img
												src={photo.url}
												alt=""
												className="min-h-32 min-w-full rounded object-cover"
											/>
										</Zoom>
										<span className="absolute bottom-0 right-0 rounded-br rounded-tl bg-slate-300/60 px-1 text-xs font-bold  text-slate-800 dark:bg-darkmode-700/70 dark:text-slate-100">
											{key + 1}
										</span>
									</div>
								</div>
							))}
							<Dropzone
								getRef={(el) => {
									dropzoneMultipleRef.current = el
								}}
								options={{
									url: route('hotel.room_types.photo_add', props.roomType.id),
									thumbnailWidth: 200,
									headers: {'X-CSRF-TOKEN': props.csrf_token},
									uploadMultiple: false,
									init() {
										this.on('success', (file, response: {message: string; photo: {id: number; url: string}}) => {
											setPhotos((photos) => [...photos, response.photo])
											this.removeFile(file)
										})
									},
								}}
								className="flex w-full items-center p-0">
								<div className="text-xs text-gray-600">Fotoğraf Eklemek İçin Buraya Sürükleyin veya Tıklayın</div>
							</Dropzone>
						</ReactSortable>
					) : (
						<Dropzone
							getRef={(el) => {
								dropzoneMultipleRef.current = el
							}}
							options={{
								url: route('hotel.room_types.photo_add', props.roomType.id),
								thumbnailWidth: 200,
								headers: {'X-CSRF-TOKEN': props.csrf_token},
								uploadMultiple: false,
								init() {
									this.on('success', (file, response: {message: string; photo: {id: number; url: string}}) => {
										setPhotos((photos) => [...photos, response.photo])
										this.removeFile(file)
									})
								},
							}}
							className="flex w-full items-center justify-center p-0">
							<div className="text-lg text-gray-600"> Henüz Fotoğraf Eklenmemiş.</div>
							<div className="text-xs text-gray-600">Fotoğraf Eklemek İçin Buraya Sürükleyin veya Tıklayın</div>
						</Dropzone>
					)}
				</div>
				<div className="flex justify-end">
					<Button
						type="submit"
						variant="soft-secondary"
						className="px-5">
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

Edit.layout = (page: any) => (
	<AuthenticatedLayout
		breadcrumb={[
			{
				title: 'Dashboard',
				href: route('hotel.dashboard.index'),
			},
			{
				title: 'Oda Türleri',
				href: route('hotel.room_types.index'),
			},
			{
				title: `${page.props.roomType.name} Oda Türünü Düzenle`,
				href: route('hotel.room_types.edit', page.props.roomType.id),
			},
		]}>
		{page}
	</AuthenticatedLayout>
)
