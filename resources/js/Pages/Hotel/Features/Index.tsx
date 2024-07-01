import React, {useState} from 'react'
import {Head, router, useForm} from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/HotelAuthenticatedLayout'
import {FeatureProps, PageProps} from './types'
import {FormInput, FormLabel, FormSwitch} from '@/Components/Form'
import Item from './components/Item'
import {ReactSortable} from 'react-sortablejs'
import axios from 'axios'
import Lucide from '@/Components/Lucide'
import Fuse from 'fuse.js'
import Button from '@/Components/Button'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Tippy from '@/Components/Tippy'

function Index(props: PageProps) {
	const MySwal = withReactContent(Swal)
	const {data, setData, errors, reset, setError, clearErrors} = useForm({
		name: '',
		is_paid: false,
	})
	const [formVisible, setFormVisible] = useState<boolean>(false)
	const [features, setFeatures] = useState<FeatureProps[]>(props.features)
	const [unModifiedFeatures, setUnModifiedFeatures] = useState<FeatureProps[]>(props.features)
	const [deletedFeatures, setDeletedFeatures] = useState<FeatureProps[]>(props.deletedFeatures)
	const [unModifiedDeletedFeatures, setUnModifiedDeletedFeatures] = useState<FeatureProps[]>(props.deletedFeatures)
	const fuseOptions: {keys: string[]} = {
		// isCaseSensitive: false,
		// includeScore: false,
		// shouldSort: true,
		// includeMatches: false,
		// findAllMatches: false,
		// minMatchCharLength: 1,
		// location: 0,
		// threshold: 0.6,
		// distance: 100,
		// useExtendedSearch: false,
		// ignoreLocation: false,
		// ignoreFieldNorm: false,
		// fieldNormWeight: 1,
		keys: ['name'],
	}

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

	const fuseFeatures = new Fuse(features, fuseOptions)
	const fuseDeletedFeatures = new Fuse(deletedFeatures, fuseOptions)

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		axios
			.post(route('hotel.room_type_features.store'), data)
			.then((response) => {
				setFeatures((prevState) => [...prevState, response.data])
				setUnModifiedFeatures((prevState) => [...prevState, response.data])
				reset()
				Toast.fire({
					icon: 'success',
					title: 'Oda özelliği/olanak eklendi.',
				})
				setFormVisible(false)
				clearErrors()
			})
			.catch((error) => {
				setError(error.response.data.errors)
			})
	}

	return (
		<>
			<Head title="Oda Özellikleri Ve Olanakları" />
			<div className="my-5 flex w-full items-center justify-between">
				<h2 className="intro-y truncate text-lg font-medium">Oda Özellikleri Ve Olanakları</h2>
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
			{formVisible && (
				<fieldset className="-intro-y box mb-10 flex w-full flex-col items-center justify-between gap-3 rounded-lg p-5">
					<legend className="text-xl font-bold">Oda Özelliği/Olanak Ekle</legend>
					<form
						onSubmit={(e) => handleSubmit(e)}
						className="w-full">
						<div className="w-full flex-1">
							<FormLabel
								htmlFor="features"
								className="pl-2 text-base font-semibold">
								Olanak Adı
							</FormLabel>
							<FormInput
								id="features"
								name="name"
								value={data.name}
								onChange={(event) => setData((data) => ({...data, name: event.target.value}))}
								type="text"
								placeholder="Olanak Adı"
							/>
							{errors.name && <span className="pl-1 text-xs font-thin text-danger">{errors.name}</span>}
						</div>
						<div className="flex w-full justify-between gap-4 md:w-auto">
							<FormSwitch className="mt-5 h-auto gap-2">
								<FormSwitch.Label
									htmlFor="is-paid"
									className="font-bold">
									Ücretli*
								</FormSwitch.Label>
								<FormSwitch.Input
									id="is-paid"
									type="checkbox"
									className="dark: h-6 w-14 bg-slate-300 before:bg-white before:checked:ml-8"
									name="is_paid"
									value={data.is_paid.toString()}
									checked={data.is_paid}
									onChange={(event) => setData((data) => ({...data, is_paid: event.target.checked}))}
								/>
								{errors.is_paid && <span className="pl-1 text-xs font-thin text-danger">{errors.name}</span>}
							</FormSwitch>
							<div className="mt-3 flex items-center justify-end gap-2">
								<Button
									size="sm"
									type="button"
									variant="soft-secondary"
									onClick={() => setFormVisible(!formVisible)}
									className="px-2">
									Vazgeç
									<Lucide
										icon="X"
										className="ml-2 h-5 w-5 text-danger"
									/>
								</Button>
								<Button
									size="sm"
									type="submit"
									variant="soft-secondary"
									className="px-2">
									Ekle
									<Lucide
										icon="CheckCheck"
										className="ml-2 h-5 w-5 text-success"
									/>
								</Button>
							</div>
						</div>
					</form>
				</fieldset>
			)}
			<div className="box intro-y grid grid-cols-1 gap-4 p-5 lg:grid-cols-2">
				<div className="-intro-x">
					<div className="flex items-center justify-between">
						<span className="pl-2 font-semibold">Aktif Oda Olanakları</span>
						<div className="relative mb-1 ml-auto flex w-64 items-center gap-2 rounded-lg bg-slate-100 p-2 dark:bg-darkmode-700">
							<Lucide
								icon="Search"
								className="absolute left-3 h-4 w-5 text-slate-500 dark:text-slate-400"
							/>
							<FormInput
								id="search"
								name="search"
								className="w-full pl-6"
								type="text"
								onChange={(event) =>
									event.target.value !== '' && event.target.value.length > 1
										? setFeatures(fuseFeatures.search(event.target.value).map((feature) => feature.item))
										: setFeatures(unModifiedFeatures)
								}
								placeholder="Aktiflerde Ara.."
							/>
						</div>
					</div>
					<ReactSortable
						group="features"
						multiDrag
						list={features}
						setList={setFeatures}
						animation={500}
						delay={5}
						ghostClass="sortable-ghost"
						chosenClass="sortable-chosen"
						dragClass="sortable-drag"
						handle="#featureHandle"
						draggable="#featureItem"
						onEnd={(evt) => {
							axios
								.post(route('hotel.room_type_features.update', evt.item.dataset.id), {
									old_order_no: evt.oldIndex ? evt.oldIndex + 1 : 1,
									new_order_no: evt.newIndex ? evt.newIndex + 1 : 1,
								})
								.then(() => console.log('success'))
								.catch(() => {})
						}}
						className="flex flex-col gap-2 rounded-lg bg-slate-100 p-4 lg:grid-cols-2 xl:grid-cols-3 dark:bg-darkmode-700">
						{features.length > 0 ? (
							features.map((feature, key) => (
								<Item
									key={feature.id}
									featureIndex={key}
									feature={feature}
									setFeatures={setFeatures}
									setDeletedFeatures={setDeletedFeatures}
									deleted={false}
								/>
							))
						) : (
							<span className="text-center text-slate-500 text-opacity-50 dark:text-slate-600 dark:text-opacity-50">
								Oda olanağı eklenmemiş.
							</span>
						)}
					</ReactSortable>
				</div>
				<div className="intro-x">
					<div className="flex items-center justify-between">
						<span className="pl-2 font-semibold">Pasif Oda Olanakları</span>
						<div className="relative mb-1 ml-auto flex w-64 items-center gap-2 rounded-lg bg-red-100 p-2 dark:bg-red-700/10">
							<Lucide
								icon="Search"
								className="absolute left-3 h-4 w-5 text-slate-500 dark:text-slate-400"
							/>
							<FormInput
								id="search"
								name="search"
								className="w-full pl-6"
								type="text"
								onChange={(event) =>
									event.target.value !== '' && event.target.value.length > 1
										? setDeletedFeatures(fuseDeletedFeatures.search(event.target.value).map((feature) => feature.item))
										: setDeletedFeatures(unModifiedDeletedFeatures)
								}
								placeholder="Pasiflerde Ara.."
							/>
						</div>
					</div>
					<ReactSortable
						group="features"
						multiDrag
						list={deletedFeatures}
						setList={(newState, sortable, store) => {
							setDeletedFeatures(newState)
							setUnModifiedDeletedFeatures(newState)
						}}
						animation={500}
						delay={5}
						ghostClass="sortable-ghost-deleted"
						chosenClass="sortable-chosen-deleted"
						dragClass="sortable-drag-deleted"
						handle="#featureHandle"
						draggable="#featureItem"
						onEnd={(evt) => {
							axios
								.post(route('hotel.room_type_features.update', evt.item.dataset.id), {
									old_order_no: evt.oldIndex ? evt.oldIndex + 1 : 1,
									new_order_no: evt.newIndex ? evt.newIndex + 1 : 1,
								})
								.then(() => console.log('success'))
								.catch(() => {})
						}}
						onAdd={(evt) => {
							axios
								.post(route('hotel.room_type_features.destroy', evt.item.dataset.id), {
									order_no: evt.newIndex ? evt.newIndex + 1 : 1,
								})
								.then(() => {
									evt.item.remove()
								})
								.catch(() => {
									evt.item.remove()
								})
						}}
						onRemove={(evt) => {
							axios
								.post(route('hotel.room_type_features.restore', evt.item.dataset.id), {
									order_no: evt.newIndex ? evt.newIndex + 1 : 1,
								})
								.then(() => {
									evt.item.remove()
								})
								.catch(() => {
									evt.item.remove()
								})
						}}
						className="flex min-h-[8rem] flex-col gap-2 rounded-lg bg-red-100 p-4 lg:grid-cols-2 xl:grid-cols-3 dark:bg-red-700/10">
						{deletedFeatures.length > 0 ? (
							deletedFeatures.map((feature, key) => (
								<Item
									key={feature.id}
									featureIndex={key}
									feature={feature}
									deleted
									setFeatures={setFeatures}
									setDeletedFeatures={setDeletedFeatures}
								/>
							))
						) : (
							<span className="my-auto text-center text-slate-500 text-opacity-50 dark:text-slate-600 dark:text-opacity-50">
								Henüz pasif durumda oda olanağı yok.
							</span>
						)}
					</ReactSortable>
				</div>
			</div>
		</>
	)
}

Index.layout = (page: React.ReactNode) => (
	<AuthenticatedLayout
		breadcrumb={[
			{
				title: 'Dashboard',
				href: route('hotel.dashboard.index'),
			},
			{
				title: 'Oda Özellikleri Ve Olanakları',
				href: route('hotel.room_type_features.index'),
			},
		]}>
		{page}
	</AuthenticatedLayout>
)

export default Index
