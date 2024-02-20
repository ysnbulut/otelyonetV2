import React, {useState} from 'react'
import {PageProps} from './types'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import {Head, Link, router} from '@inertiajs/react'
import Lucide from '@/Components/Lucide'
import Button from '@/Components/Button'
import {FormInput, FormSelect} from '@/Components/Form'
import Table from '@/Components/Table'
import Pagination from '@/Components/Pagination'
import {pickBy} from 'lodash'
import Tippy from '@/Components/Tippy'

function Index({...props}: PageProps) {
	const [filter, setFilter] = useState({
		search: props.filters.search || '',
		per_page: props.customers.per_page || 10,
	})

	const handleKeyDown = (e: any): void => {
		if (e.key === 'Enter') {
			const query = Object.keys(pickBy(filter)).length ? pickBy(filter) : {remember: 'forget'}
			router.get(route('hotel.customers.index'), query, {
				replace: false,
				preserveState: true,
				only: ['customers'],
			})
		}
	}

	const handlePerPage = (e: any): void => {
		router.get(
			route('hotel.customers.index'),
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
			<Head title="Müşteriler" />
			<div className="my-2 grid grid-cols-12 gap-6">
				<div className="intro-y col-span-12 mt-2 flex flex-col items-stretch gap-2 lg:flex-row lg:items-center lg:justify-between">
					<h2 className="intro-y text-lg font-medium">Müşteriler</h2>
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
							onClick={() => router.visit(route('hotel.customers.create'))}
							variant="soft-primary"
							className="intro-x"
							content="Yeni Müşteri Ekle">
							<Lucide
								icon="Plus"
								className="h-5 w-5"
							/>
						</Tippy>
					</div>
				</div>
				{props.customers.data.length > 0 ? (
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
								{props.customers.data.map((customer) => (
									<Table.Tr
										key={customer.id}
										className="intro-y">
										<Table.Td
											dataLabel="Müşteri"
											className="w-full rounded-t-md bg-white lg:w-96 lg:shadow-[20px_3px_20px_#0000000b] lg:first:rounded-l-md lg:last:rounded-r-md dark:bg-darkmode-600">
											<Link
												href={route('hotel.customers.show', customer.id)}
												className="flex items-center gap-3 whitespace-nowrap font-medium">
												<Lucide
													icon={customer.type === 'individual' ? 'User' : 'Factory'}
													className="hidden h-8 w-8 lg:block"
												/>
												<div className="flex flex-col">
													<span className="text-base font-semibold">{customer.title}</span>
													<span className="text-xs font-light leading-none">
														{customer.type === 'individual' ? 'Şahıs' : 'Şirket'}
													</span>
												</div>
											</Link>
										</Table.Td>
										<Table.Td
											dataLabel="Vergi No"
											className="bg-white first:rounded-l-md last:rounded-r-md lg:shadow-[20px_3px_20px_#0000000b] dark:bg-darkmode-600">
											{customer.tax_number}
										</Table.Td>
										<Table.Td
											dataLabel="Bakiye"
											className="bg-white text-center first:rounded-l-md last:rounded-r-md lg:shadow-[20px_3px_20px_#0000000b] dark:bg-darkmode-600">
											{customer.remaining_balance_formatted}
										</Table.Td>
										<Table.Td
											dataLabel="Aksiyon"
											className="w-full rounded-b-md bg-white lg:w-40 lg:shadow-[20px_3px_20px_#0000000b] lg:first:rounded-l-md lg:last:rounded-r-md lg:last:rounded-bl-none dark:bg-darkmode-600">
											<div className="flex items-center justify-center gap-2">
												<Link
													className="border-none p-1 shadow-none focus:ring-0"
													href={route('hotel.customers.edit', customer.id)}>
													<Lucide
														icon="PencilLine"
														className="h-5 w-5 text-primary"
													/>
												</Link>
												<Link
													className="border-none p-1 shadow-none focus:ring-0"
													href={route('hotel.customers.show', customer.id)}>
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
						<Pagination.Link href={props.customers.first_page_url}>
							<Lucide
								icon="ChevronsLeft"
								className="h-4 w-4"
							/>
						</Pagination.Link>
						<Pagination.Link
							href={props.customers.prev_page_url !== null ? props.customers.prev_page_url : '#'}
							preserveScroll>
							<Lucide
								icon="ChevronLeft"
								className="h-4 w-4"
							/>
						</Pagination.Link>
						<Pagination.Link href={'#'}>...</Pagination.Link>
						{props.customers.links.map((link, key) => {
							if (key > 0 && key < props.customers.links.length - 1) {
								if (props.customers.current_page - 2 <= key && key <= props.customers.current_page + 2) {
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
						<Pagination.Link href={props.customers.next_page_url !== null ? props.customers.next_page_url : '#'}>
							<Lucide
								icon="ChevronRight"
								className="h-4 w-4"
							/>
						</Pagination.Link>
						<Pagination.Link href={props.customers.last_page_url}>
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
					{`${props.customers.total} kayıttan ${props.customers.from !== null ? props.customers.from : '0'} ile ${
						props.customers.to !== null ? props.customers.to : '0'
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
				title: 'Müşteriler',
				href: route('hotel.customers.index'),
			},
		]}
		// header={<h2 className='font-semibold text-xl text-gray-800 leading-tight'>asdasdas</h2>}
	>
		{page}
	</AuthenticatedLayout>
)

export default Index
