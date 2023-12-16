import React, {useState} from 'react'
import {Head, useForm} from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import {FeatureProps, PageProps} from './types'
import {FormInput, FormLabel, FormSwitch} from '@/Components/Form'
import Feature from './components/Feature'
import {ReactSortable} from 'react-sortablejs'
import axios from 'axios'
import Lucide from '@/Components/Lucide'
import Fuse from 'fuse.js'
import Button from '@/Components/Button'

function Index(props: PageProps) {
	const {data, setData, post, processing, errors, reset} = useForm({
		name: '',
		is_paid: false,
	})
	const [features, setFeatures] = useState<FeatureProps[]>(props.features)
	const [deletedFeatures, setDeletedFeatures] = useState<FeatureProps[]>(props.deletedFeatures)
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

	const fuseFeatures = new Fuse(features, fuseOptions)
	const fuseDeletedFeatures = new Fuse(deletedFeatures, fuseOptions)

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		axios.post(route('hotel.room_type_features.store'), data).then((response) => {
			setFeatures((prevState) => [...prevState, response.data])
			reset()
		})
	}

	return (
		<AuthenticatedLayout
			user={props.auth.user}
			role={props.auth.role}
			permissions={props.auth.permissions}
			pricingPolicy={props.auth.pricing_policy}>
			<Head title="Oda Olanakları" />
			<h2 className="intro-y mb-5 mt-10 text-lg font-medium">Oda Olanakları</h2>
			<div className="box p-5">
				<form
					onSubmit={(e) => handleSubmit(e)}
					className="flex w-full flex-col items-center justify-between gap-3 md:flex-row">
					<div className="w-full flex-1">
						<FormLabel htmlFor="features">Oda Olanağı Ekle</FormLabel>
						<FormInput
							id="features"
							name="name"
							value={data.name}
							onChange={(event) => setData((data) => ({...data, name: event.target.value}))}
							type="text"
							placeholder="Oda Olanağı Adı"
						/>
					</div>
					<div className="flex w-full justify-between gap-4 md:w-auto">
						<FormSwitch className="mt-7 h-auto gap-2">
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
						</FormSwitch>
						<Button
							type="submit"
							variant="primary"
							className="mt-7 w-full px-10 md:w-44">
							Ekle
						</Button>
					</div>
				</form>
				<div className="mt-10">
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
						<div>
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
												: setFeatures(props.features)
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
								delay={25}
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
								className="flex flex-col gap-2 rounded-lg bg-slate-100 p-4 dark:bg-darkmode-700 lg:grid-cols-2 xl:grid-cols-3">
								{features.map((feature, key) => (
									<Feature
										key={feature.id}
										featureIndex={key}
										feature={feature}
										setFeatures={setFeatures}
										setDeletedFeatures={setDeletedFeatures}
										deleted={false}
									/>
								))}
							</ReactSortable>
						</div>
						<div>
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
												? setDeletedFeatures(
														fuseDeletedFeatures.search(event.target.value).map((feature) => feature.item),
												  )
												: setDeletedFeatures(props.deletedFeatures)
										}
										placeholder="Pasiflerde Ara.."
									/>
								</div>
							</div>
							<ReactSortable
								group="features"
								multiDrag
								list={deletedFeatures}
								setList={setDeletedFeatures}
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
								className="flex min-h-[8rem] flex-col gap-2 rounded-lg bg-red-100 p-4 dark:bg-red-700/10 lg:grid-cols-2 xl:grid-cols-3">
								{deletedFeatures.map((feature, key) => (
									<Feature
										key={feature.id}
										featureIndex={key}
										feature={feature}
										deleted
										setFeatures={setFeatures}
										setDeletedFeatures={setDeletedFeatures}
									/>
								))}
							</ReactSortable>
						</div>
					</div>
				</div>
			</div>
		</AuthenticatedLayout>
	)
}

export default Index
