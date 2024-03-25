import React, {useState} from 'react'
import {Head, Link, router} from '@inertiajs/react'
import {FormInput, FormSelect} from '@/Components/Form'
import Lucide from '@/Components/Lucide'
import Tippy from '@/Components/Tippy'
import Button from '@/Components/Button'
import Table from '@/Components/Table'
import Pagination from '@/Components/Pagination'
import {pickBy} from 'lodash'
import {PageProps} from '@/Pages/Admin/Hotel/types'
import AuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout'
import Show from '@/Pages/Admin/Hotel/Show'

function Index(props: PageProps) {
	const [filter, setFilter] = useState({
		search: props.filters.search || '',
		per_page: props.hotels.per_page || 10,
	})

	const handleKeyDown = (e: any): void => {
		if (e.key === 'Enter') {
			const query = Object.keys(pickBy(filter)).length ? pickBy(filter) : {remember: 'forget'}
			router.get(route('admin.hotels.index'), query, {
				replace: false,
				preserveState: true,
				only: ['hotels'],
			})
		}
	}

	const handlePerPage = (e: any): void => {
		router.get(
			route('admin.hotels.index'),
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
			<Head title="Oteller" />
			<div className="my-2 grid grid-cols-12 gap-6">
				<div className="intro-y col-span-12 mt-2 flex flex-col items-stretch gap-2 lg:flex-row lg:items-center lg:justify-between">
					<h2 className="intro-y text-lg font-medium">Oteller</h2>
					<div className="flex justify-end gap-2">
						<div className="relative text-slate-500">
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
						<Tippy
							as={Button}
							onClick={() => router.visit(route('admin.hotels.create'))}
							variant="soft-primary"
							className="intro-x"
							content="Yeni Otel Ekle">
							<Lucide
								icon="Plus"
								className="h-5 w-5"
							/>
						</Tippy>
					</div>
				</div>
				{props.hotels.data.length > 0 ? (
					<div className="intro-y col-span-12 overflow-auto lg:overflow-visible">
						<Table
							id="responsive-table"
							className="border-separate border-spacing-y-[10px] sm:mt-2">
							<Table.Thead>
								<Table.Tr>
									<Table.Th className="whitespace-nowrap border-b-0">MÜŞTERİ</Table.Th>
									<Table.Th className="whitespace-nowrap border-b-0">VERGİ NO</Table.Th>
									<Table.Th className="whitespace-nowrap border-b-0">BAKİYE</Table.Th>
									<Table.Th className="whitespace-nowrap border-b-0 text-center">AKSİYONLAR</Table.Th>
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody className="divide-y-[0.7rem] divide-transparent">
								{props.hotels.data.map((hotel) => (
									<Table.Tr
										key={hotel.id}
										className="intro-y">
										<Table.Td
											dataLabel="Müşteri"
											className="w-full rounded-t-md bg-white lg:w-96 lg:shadow-[20px_3px_20px_#0000000b] lg:first:rounded-l-md lg:last:rounded-r-md dark:bg-darkmode-600">
											<Link
												href={route('admin.hotels.show', hotel.id)}
												className="flex items-center gap-3 whitespace-nowrap font-medium">
												<div className="flex flex-col">
													<span className="text-base font-semibold">{hotel.name}</span>
												</div>
											</Link>
										</Table.Td>
										<Table.Td
											dataLabel="Vergi No"
											className="bg-white first:rounded-l-md last:rounded-r-md lg:shadow-[20px_3px_20px_#0000000b] dark:bg-darkmode-600">
											{hotel.tax_number}
										</Table.Td>
										<Table.Td
											dataLabel="Bakiye"
											className="bg-white text-center first:rounded-l-md last:rounded-r-md lg:shadow-[20px_3px_20px_#0000000b] dark:bg-darkmode-600">
											{hotel.title}
										</Table.Td>
										<Table.Td
											dataLabel="Aksiyon"
											className="w-full rounded-b-md bg-white lg:w-40 lg:shadow-[20px_3px_20px_#0000000b] lg:first:rounded-l-md lg:last:rounded-r-md lg:last:rounded-bl-none dark:bg-darkmode-600">
											<div className="flex items-center justify-center gap-2">
												{/*<Link*/}
												{/*	className="border-none p-1 shadow-none focus:ring-0"*/}
												{/*	href={route('admin.hotels.edit', hotel.id)}>*/}
												{/*	<Lucide*/}
												{/*		icon="PencilLine"*/}
												{/*		className="h-5 w-5 text-primary"*/}
												{/*	/>*/}
												{/*</Link>*/}
												<Link
													className="border-none p-1 shadow-none focus:ring-0"
													href={route('admin.hotels.show', hotel.id)}>
													<Lucide
														icon="MousePointerSquareDashed"
														className="h-5 w-5 text-dark dark:text-white"
													/>
												</Link>
											</div>
										</Table.Td>
									</Table.Tr>
								))}
							</Table.Tbody>
						</Table>
					</div>
				) : (
					<div className="box col-span-12 flex min-h-96 flex-col items-center justify-center text-slate-700 text-opacity-30 dark:text-slate-500 dark:text-opacity-30">
						<div className="flex items-center justify-center gap-5">
							<Lucide
								icon="AlertTriangle"
								className="h-12 w-12"
							/>
							<span className="text-3xl font-semibold">Henüz hiç müşteri girişi yapılmamış.</span>
						</div>
					</div>
				)}
				<div className="intro-y col-span-12 flex flex-col lg:flex-row">
					<Pagination className="w-full flex-shrink">
						<Pagination.Link href={props.hotels.first_page_url}>
							<Lucide
								icon="ChevronsLeft"
								className="h-4 w-4"
							/>
						</Pagination.Link>
						<Pagination.Link
							href={props.hotels.prev_page_url !== null ? props.hotels.prev_page_url : '#'}
							preserveScroll>
							<Lucide
								icon="ChevronLeft"
								className="h-4 w-4"
							/>
						</Pagination.Link>
						<Pagination.Link href={'#'}>...</Pagination.Link>
						{props.hotels.links.map((link, key) => {
							if (key > 0 && key < props.hotels.links.length - 1) {
								if (props.hotels.current_page - 2 <= key && key <= props.hotels.current_page + 2) {
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
						<Pagination.Link href={props.hotels.next_page_url !== null ? props.hotels.next_page_url : '#'}>
							<Lucide
								icon="ChevronRight"
								className="h-4 w-4"
							/>
						</Pagination.Link>
						<Pagination.Link href={props.hotels.last_page_url}>
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
				<div className="col-span-12 -mt-3 flex items-center justify-center text-slate-300 dark:text-darkmode-300">
					{`${props.hotels.total} kayıttan ${props.hotels.from !== null ? props.hotels.from : '0'} ile ${
						props.hotels.to !== null ? props.hotels.to : '0'
					} arası gösteriliyor`}
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
				href: route('admin.dashboard.index'),
			},
			{
				title: 'Oteller',
				href: route('admin.hotels.index'),
			},

			{
				title: 'Otel Ekle',
				href: route('admin.hotels.create'),
			},
		]}
		children={page}
	/>
)

export default Index
