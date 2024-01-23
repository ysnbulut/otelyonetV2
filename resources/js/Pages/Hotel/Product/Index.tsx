import React, {useRef, useState} from 'react'
import {PageProps} from './types'
import {Head, router} from '@inertiajs/react'
import {FormCheck, FormInput, FormSelect} from '@/Components/Form'
import Lucide from '@/Components/Lucide'
import {Inertia} from '@inertiajs/inertia'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import ProductCard from '@/Pages/Hotel/Product/components/ProductCard'
import Button from '@/Components/Button'
import Tippy from '@/Components/Tippy'
import Pagination from '@/Components/Pagination'
import {pickBy} from 'lodash'
import Select, {SelectInstance} from 'react-select'
import {Disclosure, Transition} from '@headlessui/react'
import {twMerge} from 'tailwind-merge'

function Index(props: PageProps) {
	const ref = useRef<SelectInstance>(null)
	const [filter, setFilter] = useState({
		search: props.filters.search || '',
		trashed: props.filters.trashed || false,
		with_trashed: props.filters.with_trashed || false,
		categories: props.filters.categories || '',
		sales_units: props.filters.sales_units || '',
		sales_channels: props.filters.sales_channels || '',
		per_page: props.products.per_page || 12,
	})

	const handleSearch = (e: any): void => {
		e.preventDefault()
		setFilter((filter) => ({...filter, search: e.target.value}))
	}

	const handleKeyDown = (e: any): void => {
		if (e.key === 'Enter') {
			const query = Object.keys(pickBy(filter)).length ? pickBy(filter) : {remember: 'forget'}
			Inertia.get(route('hotel.products.index'), query, {
				replace: false,
				preserveState: true,
				only: ['products'],
			})
		}
	}

	const handlePerPage = (e: any): void => {
		Inertia.get(
			route('hotel.products.index'),
			{per_page: e.target.value},
			{
				replace: true,
				preserveState: false,
			},
		)
		setFilter((filter) => ({...filter, per_page: e.target.value}))
	}

	return (
		<>
			<Head title="Ürünler" />
			<div className="my-2 grid grid-cols-12 gap-6">
				<div className="intro-y col-span-12 mt-2 flex flex-col items-stretch gap-2 lg:flex-row lg:items-center lg:justify-between">
					<h2 className="intro-y text-lg font-medium">Ürünler</h2>
					<div className="flex flex-col justify-end gap-2 lg:flex-row">
						<div className="flex justify-end gap-2">
							<div className="relative flex-1 text-slate-500">
								<FormInput
									type="text"
									className="!box w-full pr-10 lg:w-56"
									placeholder="Search..."
									onChange={(e) => handleSearch(e)}
									onKeyDown={handleKeyDown}
									name={'search'}
									value={filter.search}
								/>
								<Lucide
									icon="Search"
									className="absolute inset-y-0 right-0 my-auto mr-3 h-4 w-4"
								/>
							</div>
							<Tippy
								as={Button}
								onClick={() => router.visit(route('hotel.products.create'))}
								variant="soft-primary"
								className="intro-x"
								content="Yeni Ürün Ekle">
								<Lucide
									icon="Plus"
									className="h-5 w-5"
								/>
							</Tippy>
						</div>
					</div>
				</div>
				<Disclosure>
					{({open}) => (
						<>
							<Disclosure.Button className={twMerge('col-span-12 rounded-t border px-5 py-2', open && 'box')}>
								Filtreler
							</Disclosure.Button>
							<Transition
								show={open}
								className="box col-span-12 -mt-3 bg-white p-5"
								enter="transition duration-100 ease-out"
								enterFrom="transform scale-95 opacity-0"
								enterTo="transform scale-100 opacity-100"
								leave="transition duration-75 ease-out"
								leaveFrom="transform scale-100 opacity-100"
								leaveTo="transform scale-95 opacity-0">
								<Disclosure.Panel
									static
									className="col-span-12 grid grid-cols-12 gap-4">
									<div className="col-span-12 grid grid-cols-1 gap-1 py-2 lg:grid-cols-3">
										<div className="col-span-1 mb-3 border-b pb-3 text-center text-lg font-semibold lg:col-span-3">
											Kategoriler
										</div>
										{props.categories.length > 0 &&
											props.categories.map((category: any) => (
												<FormCheck className="col-span-1">
													<FormCheck.Input
														type="checkbox"
														name={`category[${category.id}]`}
														value={category.id}
														// checked={props.selectedFeatures.some((item) => item.feature_id === feature.id)}
														// onChange={(e) => {
														// 	props.setSelectedFeatures((selectedFeatures) => {
														// 		if (e.target.checked) {
														// 			return [...selectedFeatures, {feature_id: feature.id, order_no: key + 1}]
														// 		} else {
														// 			return selectedFeatures.filter((item) => item.feature_id !== feature.id)
														// 		}
														// 	})
														// }}
													/>
													<FormCheck.Label>{category.name}</FormCheck.Label>
												</FormCheck>
											))}
									</div>
									<div className="col-span-12 grid grid-cols-1 gap-1 py-2 lg:grid-cols-3">
										<div className="col-span-1 mb-3 border-b pb-3 text-center text-lg font-semibold lg:col-span-3">
											Satış üniteleri
										</div>
										{props.sales_units.length > 0 &&
											props.sales_units.map((unit: any) => (
												<FormCheck className="col-span-1">
													<FormCheck.Input
														type="checkbox"
														name={`units[${unit.id}]`}
														value={unit.id}
														// checked={props.selectedFeatures.some((item) => item.feature_id === feature.id)}
														// onChange={(e) => {
														// 	props.setSelectedFeatures((selectedFeatures) => {
														// 		if (e.target.checked) {
														// 			return [...selectedFeatures, {feature_id: feature.id, order_no: key + 1}]
														// 		} else {
														// 			return selectedFeatures.filter((item) => item.feature_id !== feature.id)
														// 		}
														// 	})
														// }}
													/>
													<FormCheck.Label>{unit.name}</FormCheck.Label>
												</FormCheck>
											))}
									</div>
									<div className="col-span-12 grid grid-cols-1 gap-1 py-2 lg:grid-cols-3">
										<div className="col-span-1 mb-3 border-b pb-3 text-center text-lg font-semibold lg:col-span-3">
											Satış Kanalları
										</div>
										{props.sales_channels.length > 0 &&
											props.sales_channels.map((channel: any) => (
												<FormCheck className="col-span-1">
													<FormCheck.Input
														type="checkbox"
														name={`channels[${channel.id}]`}
														value={channel.id}
														// checked={props.selectedFeatures.some((item) => item.feature_id === feature.id)}
														// onChange={(e) => {
														// 	props.setSelectedFeatures((selectedFeatures) => {
														// 		if (e.target.checked) {
														// 			return [...selectedFeatures, {feature_id: feature.id, order_no: key + 1}]
														// 		} else {
														// 			return selectedFeatures.filter((item) => item.feature_id !== feature.id)
														// 		}
														// 	})
														// }}
													/>
													<FormCheck.Label>{channel.name}</FormCheck.Label>
												</FormCheck>
											))}
									</div>
								</Disclosure.Panel>
							</Transition>
						</>
					)}
				</Disclosure>
				{props.products.data.map((product: any) => (
					<ProductCard
						key={product.id}
						product={product}
					/>
				))}
				<div className="intro-y col-span-12 flex flex-col lg:flex-row">
					<Pagination className="w-full flex-shrink">
						<Pagination.Link href={props.products.first_page_url}>
							<Lucide
								icon="ChevronsLeft"
								className="h-4 w-4"
							/>
						</Pagination.Link>
						<Pagination.Link
							href={props.products.prev_page_url !== null ? props.products.prev_page_url : '#'}
							preserveScroll>
							<Lucide
								icon="ChevronLeft"
								className="h-4 w-4"
							/>
						</Pagination.Link>
						<Pagination.Link href={'#'}>...</Pagination.Link>
						{props.products.links.map((link, key) => {
							if (key > 0 && key < props.products.links.length - 1) {
								if (props.products.current_page - 2 <= key && key <= props.products.current_page + 2) {
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
						<Pagination.Link href={props.products.next_page_url !== null ? props.products.next_page_url : '#'}>
							<Lucide
								icon="ChevronRight"
								className="h-4 w-4"
							/>
						</Pagination.Link>
						<Pagination.Link href={props.products.last_page_url}>
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
						{[12, 24, 32, 44, 56, 68, 80, 92, 104, 140, 200].map((item, key) => (
							<option key={key}>{item}</option>
						))}
					</FormSelect>
				</div>
				<div className="col-span-12 -mt-3 flex items-center justify-center text-slate-300 dark:text-darkmode-300">
					{`${props.products.total} kayıttan ${props.products.from !== null ? props.products.from : '0'} ile ${
						props.products.to !== null ? props.products.to : '0'
					} arası gösteriliyor`}
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
				title: 'Ürünler',
				href: route('hotel.products.index'),
			},
		]}>
		{page}
	</AuthenticatedLayout>
)

export default Index
