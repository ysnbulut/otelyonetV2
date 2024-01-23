import React, {useState} from 'react'
import {PageProps} from './types'
import {Head, Link, useForm} from '@inertiajs/react'
import Alert from '@/Components/Alert'
import Lucide from '@/Components/Lucide'
import Button from '@/Components/Button'
import Pagination from '@/Components/Pagination'
import {FormInput, FormLabel, FormSelect} from '@/Components/Form'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import {Inertia} from '@inertiajs/inertia'
import {pickBy} from 'lodash'
import TomSelect from '@/Components/TomSelect'

function Index(props: PageProps) {
	const [formVisible, setFormVisible] = useState<boolean>(true)
	const [filter, setFilter] = useState({
		search: props.filters.search || '',
		per_page: props.rooms.per_page || 10,
	})

	const {data, setData, post, processing, errors, reset, setError, clearErrors} = useForm({
		name: '',
		type_has_view_id: '',
	})

	const handleKeyDown = (e: any): void => {
		if (e.key === 'Enter') {
			const query = Object.keys(pickBy(filter)).length ? pickBy(filter) : {remember: 'forget'}
			Inertia.get(route('hotel.rooms.index'), query, {
				replace: false,
				preserveState: true,
				only: ['customers'],
			})
		}
	}

	const handlePerPage = (e: any): void => {
		const query = Object.keys(pickBy(filter)).length ? pickBy(filter) : {remember: 'forget'}
		Inertia.get(route('hotel.customers.index'), query, {
			replace: true,
			preserveState: false,
		})
		setFilter((filter) => ({...filter, per_page: e.target.value}))
	}

	const handleDestroy = (id: number) => {
		Inertia.delete(route('hotel.rooms.destroy', id), {
			preserveState: false,
			onSuccess: () => {
				console.log('silindi')
			},
		})
	}

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		Inertia.post(route('hotel.rooms.store'), data, {
			preserveState: true,
			onSuccess: () => {
				setFormVisible(false)
			},
		})
	}

	return (
		<>
			<Head title="Odalar" />
			{props.flash.success && (
				<Alert
					variant="soft-success"
					dismissible
					className="mb-2 mt-5 flex items-center font-semibold">
					{({dismiss}) => (
						<>
							<Lucide
								icon="CheckCircle"
								className="mr-4 h-6 w-6"
							/>
							{props.flash.success}
							<Alert.DismissButton
								type="button"
								className="btn-close text-success"
								aria-label="Close"
								onClick={dismiss}>
								<Lucide
									icon="X"
									className="h-6 w-6"
								/>
							</Alert.DismissButton>
						</>
					)}
				</Alert>
			)}
			<h2 className="intro-y my-5 text-lg font-medium">Odalar</h2>
			{formVisible && (
				<fieldset className="-intro-y box mb-10 flex w-full flex-col items-center justify-between gap-3 rounded-lg p-5">
					<legend className="text-xl font-bold">Oda Ekle</legend>
					<form
						id="add-bed-type-form"
						onSubmit={(e) => handleSubmit(e)}
						className="w-full">
						<div className="flex w-full flex-col gap-3 md:flex-row">
							<div className="w-full flex-grow">
								<FormLabel
									htmlFor="features"
									className="pl-2 text-base font-semibold">
									Oda Adı
								</FormLabel>
								<FormInput
									id="features"
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
								data-placeholder="Rol İzinlerini Seçiniz"
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
			<div className="grid grid-cols-12 gap-6">
				<div className="intro-y col-span-12 mt-2 flex flex-wrap items-center justify-between px-5 sm:flex-nowrap">
					<Button
						as={Link}
						href={route('hotel.roles.create')}
						variant="primary"
						className="mr-2 shadow-md">
						Yeni Oda Ekle
					</Button>
					<div className="hidden text-slate-500 md:block">
						{`${props.rooms.total} kayıttan ${props.rooms.from} ile ${props.rooms.to} arası gösteriliyor`}
					</div>
					<div className="mt-3 w-full sm:ml-auto sm:mt-0 sm:w-auto md:ml-0">
						<div className="relative w-56 text-slate-500">
							<FormInput
								type="text"
								className="!box w-56 pr-10"
								placeholder="Search..."
								onChange={(e) => {
									e.preventDefault()
									setFilter((filter) => ({...filter, search: e.target.value}))
								}}
								onKeyDown={handleKeyDown}
								name={'search'}
								value={filter.search}
							/>
							<Lucide
								icon="Search"
								className="absolute inset-y-0 right-0 my-auto mr-3 h-4 w-4"
							/>
						</div>
					</div>
				</div>
				{props.rooms.data.map((room) => (
					<div
						key={room.id}
						className="intro-x col-span-12 sm:col-span-6 md:col-span-6 lg:col-span-4 xl:col-span-4 2xl:col-span-3">
						{/*{ border border-success/60 bg-success/20 dark:bg-success/15}*/}
						{/*{ border border-slate-400/60border-slate-400/20 dark:border-slate-400/15}*/}
						{/*{ border-pending/40 bg-pending/15 dark:bg-pending/10}*/}
						{/*{ border-danger/40 bg-danger/20 dark:bg-danger/10}*/}
						<div className="flex items-center justify-center rounded-md border border-danger/40 bg-danger/20 p-5 shadow dark:bg-danger/10">
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
				<div className="intro-y col-span-12 flex flex-col lg:flex-row">
					<Pagination className="w-full flex-shrink">
						<Pagination.Link href={props.rooms.first_page_url}>
							<Lucide
								icon="ChevronsLeft"
								className="h-4 w-4"
							/>
						</Pagination.Link>
						<Pagination.Link
							href={props.rooms.prev_page_url !== null ? props.rooms.prev_page_url : '#'}
							preserveScroll>
							<Lucide
								icon="ChevronLeft"
								className="h-4 w-4"
							/>
						</Pagination.Link>
						<Pagination.Link href={'#'}>...</Pagination.Link>
						{props.rooms.links.map((link, key) => {
							if (key > 0 && key < props.rooms.links.length - 1) {
								if (props.rooms.current_page - 2 <= key && key <= props.rooms.current_page + 2) {
									return (
										<Pagination.Link
											key={key}
											href={link.url !== null ? link.url : '#'}
											active={link.active}>
											{link.label}
										</Pagination.Link>
									)
								}
							}
						})}
						<Pagination.Link href={'#'}>...</Pagination.Link>
						<Pagination.Link href={props.rooms.next_page_url !== null ? props.rooms.next_page_url : '#'}>
							<Lucide
								icon="ChevronRight"
								className="h-4 w-4"
							/>
						</Pagination.Link>
						<Pagination.Link href={props.rooms.last_page_url}>
							<Lucide
								icon="ChevronsRight"
								className="h-4 w-4"
							/>
						</Pagination.Link>
					</Pagination>
					<FormSelect
						onChange={handlePerPage}
						defaultValue={filter.per_page}
						className="!box ml-auto mt-2 w-20 lg:mt-0">
						{[10, 20, 25, 30, 40, 50, 100].map((item, key) => (
							<option key={key}>{item}</option>
						))}
					</FormSelect>
				</div>
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
