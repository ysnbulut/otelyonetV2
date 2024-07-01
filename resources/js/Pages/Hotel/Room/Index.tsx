import React, {useState} from 'react'
import {PageProps, RoomDataProps} from './types'
import {Head, router, useForm} from '@inertiajs/react'
import Lucide from '@/Components/Lucide'
import Button from '@/Components/Button'
import Pagination from '@/Components/Pagination'
import {FormInput, FormLabel, FormSelect} from '@/Components/Form'
import AuthenticatedLayout from '@/Layouts/HotelAuthenticatedLayout'
import {pickBy} from 'lodash'
import TomSelect from '@/Components/TomSelect'
import Tippy from '@/Components/Tippy'
import axios from 'axios'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import {twMerge} from 'tailwind-merge'

function Index(props: PageProps) {
	const MySwal = withReactContent(Swal)
	const [formVisible, setFormVisible] = useState<boolean>(false)
	const [search, setSearch] = useState(props.filters.search || '')
	const {data, setData, post, processing, errors, reset, setError, clearErrors} = useForm({
		name: '',
		type_has_view_id: '',
	})
	const [rooms, setRooms] = useState<RoomDataProps[] | []>(props.rooms)

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

	const handleKeyDown = (e: any): void => {
		if (e.key === 'Enter') {
			// @ts-ignore
			router.get(
				route('hotel.rooms.index'),
				{search: search},
				{
					replace: true,
					preserveState: true,
					onSuccess: (response: any): void => {
						setRooms(response.props.rooms)
						Toast.fire({
							icon: 'success',
							title: 'Arama başarılı',
						})
					},
				},
			)
		}
	}

	const handleDelete = (id: number) => {
		MySwal.fire({
			title: 'Odayı silmek istiyor musun?',
			text: 'Bu işlem geri alınamaz!',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Evet, Sil',
			cancelButtonText: 'Vazgeç',
			confirmButtonColor: '#d33',
			cancelButtonColor: '#3085d6',
		}).then((result) => {
			if (result.isConfirmed) {
				axios
					.delete(route('hotel.rooms.destroy', id))
					.then(() => {
						setRooms((prevState) => prevState.filter((room) => room.id !== id))
						Toast.fire({
							icon: 'success',
							title: 'Oda başarıyla silindi',
						})
					})
					.catch((error) => {
						console.error(error)
						Toast.fire({
							icon: 'error',
							title: 'Oda silinirken bir hata oluştu',
						})
					})
			}
		})
	}

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		axios
			.post(route('hotel.rooms.store'), data)
			.then((response) => {
				setRooms((prevState) => [...prevState, response.data])
				reset()
				setFormVisible(false)
				Toast.fire({
					icon: 'success',
					title: 'Oda Manzarası başarıyla eklendi',
				})
				clearErrors()
			})
			.catch((error) => {
				setError(error.response.data.errors)
			})
	}

	return (
		<>
			<Head title="Odalar" />
			<div className="my-2 grid grid-cols-12 gap-6">
				<div className="intro-y col-span-12 mt-2 flex flex-col items-stretch gap-2 lg:flex-row lg:items-center lg:justify-between">
					<h2 className="intro-y text-lg font-medium">Odalar</h2>
					<div className="flex justify-end gap-2">
						<div className="relative text-slate-500">
							<FormInput
								type="text"
								className="!box w-56 pr-10"
								placeholder="Search..."
								onChange={(e) => {
									e.preventDefault()
									setSearch(e.target.value)
								}}
								onKeyDown={handleKeyDown}
								name={'search'}
								value={search}
							/>
							<Lucide
								icon="Search"
								onClick={() => handleKeyDown({key: 'Enter'})}
								className="absolute inset-y-0 right-0 my-auto mr-3 h-4 w-4"
							/>
						</div>
						<Tippy
							as={Button}
							onClick={() => setFormVisible(!formVisible)}
							variant={formVisible ? 'soft-danger' : 'soft-primary'}
							content={formVisible ? 'Yeni Ekle' : 'Vazgeç'}>
							{formVisible ? (
								<Lucide
									icon="Minus"
									className="h-5 w-5"
								/>
							) : (
								<Lucide
									icon="Plus"
									className="h-5 w-5"
								/>
							)}
						</Tippy>
					</div>
				</div>
				{formVisible && (
					<fieldset className="-intro-y box col-span-12 mb-10 flex w-full flex-col items-center justify-between gap-3 rounded-lg p-5">
						<legend className="text-xl font-bold">Oda Ekle</legend>
						<form
							id="add-bed-type-form"
							onSubmit={(e) => handleSubmit(e)}
							className="w-full">
							<div className="flex w-full flex-col gap-3 md:flex-row">
								<div className="w-full flex-grow">
									<FormLabel
										htmlFor="room-name"
										className="pl-2 text-base font-semibold">
										Oda Adı
									</FormLabel>
									<FormInput
										id="room-name"
										name="name"
										value={data.name}
										onChange={(event) => setData((data) => ({...data, name: event.target.value}))}
										type="text"
										placeholder="Oda Adı (Örn: 101)"
									/>
									{errors.name && <span className="pl-1 text-xs font-thin text-danger">{errors.name}</span>}
								</div>
							</div>
							<div className="mt-5 w-full">
								<FormLabel
									htmlFor="features"
									className="pl-2 text-base font-semibold">
									Oda Tipi ve Manzarası
								</FormLabel>
								<TomSelect
									id="role-select"
									name="permissions[]"
									data-placeholder="Oda Tipi - Manzara Seçiniz"
									value={data.type_has_view_id}
									onChange={(e: any) => setData((data) => ({...data, type_has_view_id: e}))}
									className="w-full">
									<option></option>
									{props.typeHasViews.map((type_has_view) => (
										<option
											key={type_has_view.id}
											value={type_has_view.id}>
											{type_has_view.name}
										</option>
									))}
								</TomSelect>
								{errors.type_has_view_id && (
									<span className="pl-1 text-xs font-thin text-danger">{errors.type_has_view_id}</span>
								)}
							</div>
							<Button
								type="submit"
								variant="soft-secondary"
								className="float-right mt-3 px-5">
								Ekle
								<Lucide
									icon="CheckCheck"
									className="ml-2 h-5 w-5 text-success"
								/>
							</Button>
						</form>
					</fieldset>
				)}
				{rooms.map((room) => (
					<div
						key={room.id}
						className="intro-x col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-4 xl:col-span-4 2xl:col-span-3">
						<div
							className={twMerge(
								'relative flex items-center justify-center rounded-md p-5 shadow-lg',
								!room.is_clean
									? 'border bg-white dark:bg-darkmode-400'
									: 'border-pending/40 bg-pending/15 dark:bg-pending/10',
							)}>
							<Button
								variant="soft-danger"
								onClick={() => handleDelete(room.id)}
								className="absolute right-1 top-1 p-0">
								<Lucide
									icon="X"
									className="h-5 w-5"
								/>
							</Button>
							<div>
								<h3 className="text-center text-3xl font-extrabold text-slate-600 dark:text-slate-400">{room.name}</h3>
								<div className="text-center text-base font-semibold text-slate-500">
									{room.type} {room.view}
								</div>
								<div className="text-xl font-semibold text-gray-600"></div>
							</div>
						</div>
					</div>
				))}
			</div>
		</>
	)
}

Index.layout = (page: any) => (
	<AuthenticatedLayout
		breadcrumb={[
			{
				title: 'Dashboard',
				href: route('hotel.dashboard.index'),
			},
			{
				title: 'Odalar',
				href: route('hotel.rooms.index'),
			},
		]}>
		{page}
	</AuthenticatedLayout>
)

export default Index
