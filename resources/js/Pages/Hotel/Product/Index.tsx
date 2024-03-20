import React, {useEffect, useRef, useState} from 'react'
import {PageProps} from './types'
import {Head, router} from '@inertiajs/react'
import {FormCheck, FormInput, FormSelect} from '@/Components/Form'
import Lucide from '@/Components/Lucide'
import AuthenticatedLayout from '@/Layouts/HotelAuthenticatedLayout'
import ProductCard from '@/Pages/Hotel/Product/components/ProductCard'
import Button from '@/Components/Button'
import Tippy from '@/Components/Tippy'
import Pagination from '@/Components/Pagination'
import {pickBy} from 'lodash'
import {Transition} from '@headlessui/react'

function Index(props: PageProps) {
	const [filterShow, setFilterShow] = useState<boolean>(false)
	const [filter, setFilter] = useState({
		search: props.filters.search || '',
		trashed: props.filters.trashed || false,
		categories: props.filters.categories || [],
		sales_units: props.filters.sales_units || [],
		sales_channels: props.filters.sales_channels || [],
		per_page: props.products.per_page || 12,
	})

	const handleSearch = (e: any): void => {
		e.preventDefault()
		setFilter((filter) => ({...filter, search: e.target.value}))
	}

	const handleKeyDown = (e: any): void => {
		if (e.key === 'Enter') {
			router.get(route('hotel.products.index'), pickBy(filter), {
				replace: true,
				preserveState: true,
			})
		}
	}

	const handleFilterSubmit = (e: any): void => {
		e.preventDefault()
		router.get(route('hotel.products.index'), pickBy(filter), {
			replace: true,
			preserveState: true,
		})
		// setFilterShow(false)
	}

	const handlePerPage = (e: any): void => {
		e.preventDefault()
		setFilter((filter) => ({...filter, per_page: e.target.value}))
		router.get(route('hotel.products.index'), pickBy({...filter, per_page: e.target.value}), {
			replace: true,
			preserveState: true,
		})
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
									onKeyDown={(e) => handleKeyDown(e)}
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
								onClick={() => setFilterShow(!filterShow)}
								className="intro-x border-slate-300 bg-slate-200 text-black/60 dark:border-darkmode-600 dark:bg-darkmode-400 dark:text-white/30"
								content="Filtrele">
								<Lucide
									icon="Filter"
									className="h-5 w-5"
								/>
							</Tippy>
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
				<Transition
					show={filterShow}
					className="box col-span-12 -mt-3 bg-white p-5"
					enter="transition duration-[300ms] ease-out"
					enterFrom="transform scale-95 -translate-y-10 opacity-0"
					enterTo="transform scale-100 translate-y-0 opacity-100"
					leave="transition duration-[500ms] ease-out"
					leaveFrom="transform scale-100 translate-y-0 opacity-100"
					leaveTo="transform scale-95 -translate-y-10 opacity-0">
					<form
						onSubmit={(e: any) => handleFilterSubmit(e)}
						className="col-span-12 grid grid-cols-12 gap-2">
						<div className="col-span-12 grid grid-cols-1 gap-1 border-b py-2 last:border-b-0 lg:grid-cols-3">
							<div className="col-span-1 pb-2 text-left text-lg font-semibold lg:col-span-3">Kategoriler</div>
							{props.categories.length > 0 &&
								props.categories.map((category: any) => (
									<FormCheck
										key={category.id}
										className="col-span-1">
										<FormCheck.Input
											type="checkbox"
											name={`category[${category.id}]`}
											value={category.id}
											checked={filter.categories.some((item) => item === category.id.toString())}
											onChange={(e) => {
												setFilter((filter) => {
													if (e.target.checked) {
														return {...filter, categories: [...filter.categories, e.target.value]}
													} else {
														return {...filter, categories: filter.categories.filter((item) => item !== e.target.value)}
													}
												})
											}}
										/>
										<FormCheck.Label>{category.name}</FormCheck.Label>
									</FormCheck>
								))}
						</div>
						<div className="col-span-12 grid grid-cols-1 gap-1 border-b py-2 last:border-b-0 lg:grid-cols-3">
							<div className="col-span-1 pb-2 text-left text-lg font-semibold lg:col-span-3">Satış üniteleri</div>
							{props.sales_units.length > 0 &&
								props.sales_units.map((unit: any) => (
									<FormCheck
										key={unit.id}
										className="col-span-1">
										<FormCheck.Input
											type="checkbox"
											name={`units[${unit.id}]`}
											value={unit.id}
											checked={filter.sales_units.some((item) => item === unit.id.toString())}
											onChange={(e) => {
												setFilter((filter) => {
													if (e.target.checked) {
														return {...filter, sales_units: [...filter.sales_units, e.target.value]}
													} else {
														return {
															...filter,
															sales_units: filter.sales_units.filter((item) => item !== e.target.value),
														}
													}
												})
											}}
										/>
										<FormCheck.Label>{unit.name}</FormCheck.Label>
									</FormCheck>
								))}
						</div>
						<div className="col-span-12 grid grid-cols-1 gap-1 border-b py-2 last:border-b-0 lg:grid-cols-3">
							<div className="col-span-1 pb-2 text-left text-lg font-semibold lg:col-span-3">Satış Kanalları</div>
							{props.sales_channels.length > 0 &&
								props.sales_channels.map((channel: any) => (
									<FormCheck
										key={channel.id}
										className="col-span-1">
										<FormCheck.Input
											type="checkbox"
											name={`channels[${channel.id}]`}
											value={channel.id}
											checked={filter.sales_channels.some((item) => item === channel.id.toString())}
											onChange={(e) => {
												setFilter((filter) => {
													if (e.target.checked) {
														return {...filter, sales_channels: [...filter.sales_channels, e.target.value]}
													} else {
														return {
															...filter,
															sales_channels: filter.sales_channels.filter((item) => item !== e.target.value),
														}
													}
												})
											}}
										/>
										<FormCheck.Label>{channel.name}</FormCheck.Label>
									</FormCheck>
								))}
						</div>
						<div className="col-span-12 flex w-full items-center justify-end gap-2">
							<Button
								variant="soft-secondary"
								className="px-5">
								Filtreleri Uygula
								<Lucide
									icon="CheckCheck"
									className="ml-2 h-5 w-5 text-primary"
								/>
							</Button>
						</div>
					</form>
				</Transition>
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
