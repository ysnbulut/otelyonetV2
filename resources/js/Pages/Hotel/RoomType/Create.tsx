import React, {useEffect, useState} from 'react'
import {PageProps, SelectedFeatures, FormDataProps} from './types/create'
import {Head, router, useForm} from '@inertiajs/react' //useForm
import Button from '@/Components/Button'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import {FormInput, FormLabel, FormTextarea, InputGroup} from '@/Components/Form'
import 'react-medium-image-zoom/dist/styles.css'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Features from '@/Pages/Hotel/RoomType/components/Features'
import Lucide from '@/Components/Lucide'
import Tippy from '@/Components/Tippy'

const Create = (props: PageProps) => {
	const MySwal = withReactContent(Swal)
	const [features, setFeatures] = useState(props.features)
	const [selectedFeatures, setSelectedFeatures] = useState<SelectedFeatures[]>([])
	const {data, setData, errors, setError, clearErrors, post, reset, processing} = useForm({
		name: '',
		size: '',
		room_count: '',
		adult_capacity: '',
		child_capacity: '',
		description: '',
		room_type_features: [] as SelectedFeatures[],
	})

	useEffect(() => {
		setData((data) => ({...data, room_type_features: selectedFeatures}))
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

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		post(route('hotel.room_types.store'), {
			preserveScroll: true,
			onSuccess: (response: any) => {
				console.log(response)
				Toast.fire({
					icon: 'success',
					title: 'Oda türü başarıyla eklendi.',
				}).then((r) => {
					console.log(r)
				})
				reset()
			},
			onError: (errors: any) => {
				console.log(errors)
				// setError(errors)
			},
		})
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
					title: 'Oda Türleri',
					href: route('hotel.room_types.index'),
				},
				{
					title: 'Oda Türü Oluştur',
					href: route('hotel.room_types.create'),
				},
			]}>
			<Head title="Oda Türleri" />
			<div className="mb-5 mt-10 flex w-full items-center justify-between">
				<h2 className="intro-y text-lg font-medium">
					Oda Türü <strong>Oluştur</strong>
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
				<Features
					features={features}
					setFeatures={setFeatures}
					selectedFeatures={selectedFeatures}
					setSelectedFeatures={setSelectedFeatures}
				/>
				<div className="flex justify-end">
					<Button
						disabled={processing}
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
		</AuthenticatedLayout>
	)
}
export default Create
