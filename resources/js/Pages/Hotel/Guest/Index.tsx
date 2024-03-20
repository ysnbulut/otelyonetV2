import React, {useState} from 'react'
import {PageProps} from './types'
import AuthenticatedLayout from '@/Layouts/HotelAuthenticatedLayout'
import {Head, Link, router} from '@inertiajs/react'
import Lucide from '@/Components/Lucide'
import {FormInput, FormSelect} from '@/Components/Form'
import Table from '@/Components/Table'
import Pagination from '@/Components/Pagination'

function Index({...props}: PageProps) {
	const [searchValue, setSearchValue] = useState<any>(props.filters.search || '')
	const [perPage, setPerPage] = useState(props.guests.per_page || 10)

	const handleSearch = (e: any): void => {
		e.preventDefault()
		setSearchValue(e.target.value)
	}

	const handleKeyDown = (e: any): void => {
		if (e.key === 'Enter') {
			router.get(
				route('hotel.guests.index'),
				{search: searchValue},
				{
					replace: false,
					preserveState: true,
					only: ['guests'],
				},
			)
		}
	}

	const handlePerPage = (e: any): void => {
		router.get(
			route('hotel.guests.index'),
			{per_page: e.target.value},
			{
				replace: true,
				preserveState: true,
			},
		)
		setPerPage(e.target.value)
	}

	return (
		<>
			<Head title="Misafirler" />
			<div className="my-2 grid grid-cols-12 gap-6">
				<div className="intro-y col-span-12 mt-2 flex flex-col items-stretch gap-2 lg:flex-row lg:items-center lg:justify-between">
					<h2 className="intro-y text-lg font-medium">Misafirler</h2>
					<div className="flex justify-end gap-2">
						<div className="relative text-slate-500">
							<FormInput
								type="text"
								className="!box w-56 pr-10"
								placeholder="Search..."
								onChange={(e) => handleSearch(e)}
								onKeyDown={handleKeyDown}
								name={'search'}
								value={searchValue}
							/>
							<Lucide
								icon="Search"
								className="absolute inset-y-0 right-0 my-auto mr-3 h-4 w-4"
							/>
						</div>
					</div>
				</div>
				{props.guests.data.length > 0 ? (
					<div className="intro-y col-span-12 overflow-auto lg:overflow-visible">
						<Table
							id="responsive-table"
							className="border-separate border-spacing-y-[10px] sm:mt-2">
							<Table.Thead>
								<Table.Tr>
									<Table.Th className="whitespace-nowrap border-b-0">AD SOYAD</Table.Th>
									<Table.Th className="whitespace-nowrap border-b-0">UYRUK</Table.Th>
									<Table.Th className="whitespace-nowrap border-b-0">TELEFON</Table.Th>
									<Table.Th className="whitespace-nowrap border-b-0">E-POSTA</Table.Th>
									<Table.Th className="whitespace-nowrap border-b-0 text-center">AKSİYONLAR</Table.Th>
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody className="divide-y-[0.7rem] divide-transparent">
								{props.guests.data.map((guest) => (
									<Table.Tr
										key={guest.id}
										className="intro-y w-full">
										<Table.Td
											dataLabel="Ad Soyad"
											className="w-full rounded-t-md bg-white lg:w-40 lg:shadow-[20px_3px_20px_#0000000b] lg:first:rounded-l-md lg:last:rounded-r-md dark:bg-darkmode-600">
											<Link
												href={route('hotel.guests.edit', guest.id)}
												className="flex items-center gap-3 whitespace-nowrap font-medium">
												<span className="text-base font-semibold">{guest.full_name}</span>
											</Link>
										</Table.Td>
										<Table.Td
											dataLabel="Uyruk"
											className="bg-white lg:shadow-[20px_3px_20px_#0000000b] lg:first:rounded-l-md lg:last:rounded-r-md dark:bg-darkmode-600">
											{guest.citizen}
										</Table.Td>
										<Table.Td
											dataLabel="Telefon"
											className="bg-white text-center lg:shadow-[20px_3px_20px_#0000000b] lg:first:rounded-l-md lg:last:rounded-r-md dark:bg-darkmode-600">
											{guest.phone}
										</Table.Td>
										<Table.Td
											dataLabel="Email"
											className="bg-white text-center lg:shadow-[20px_3px_20px_#0000000b] lg:first:rounded-l-md lg:last:rounded-r-md dark:bg-darkmode-600">
											{guest.email}
										</Table.Td>
										<Table.Td
											dataLabel="Aksiyon"
											className="w-full rounded-b-md bg-white lg:w-40 lg:shadow-[20px_3px_20px_#0000000b] lg:first:rounded-l-md lg:last:rounded-r-md lg:last:rounded-bl-none dark:bg-darkmode-600">
											<div className="flex items-center justify-center gap-2">
												<Link
													className="border-none p-1 shadow-none focus:ring-0"
													href={route('hotel.guests.edit', guest.id)}>
													<Lucide
														icon="PencilLine"
														className="h-5 w-5 text-primary"
													/>
												</Link>
												<Link
													className="border-none p-1 shadow-none focus:ring-0"
													href={route('hotel.guests.index')}>
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
							<span className="text-3xl font-semibold">Henüz hiç misafir girişi yapılmamış.</span>
						</div>
					</div>
				)}
				<div className="intro-y col-span-12 flex flex-wrap items-center sm:flex-row sm:flex-nowrap">
					<Pagination className="w-full sm:mr-auto sm:w-auto">
						<Pagination.Link href={props.guests.first_page_url}>
							<Lucide
								icon="ChevronsLeft"
								className="h-4 w-4"
							/>
						</Pagination.Link>
						<Pagination.Link
							href={props.guests.prev_page_url !== null ? props.guests.prev_page_url : '#'}
							preserveScroll>
							<Lucide
								icon="ChevronLeft"
								className="h-4 w-4"
							/>
						</Pagination.Link>
						<Pagination.Link href={'#'}>...</Pagination.Link>
						{props.guests.links.map((link, key) => {
							if (key > 0 && key < props.guests.links.length - 1) {
								if (props.guests.current_page - 2 <= key && key <= props.guests.current_page + 2) {
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
						<Pagination.Link href={props.guests.next_page_url !== null ? props.guests.next_page_url : '#'}>
							<Lucide
								icon="ChevronRight"
								className="h-4 w-4"
							/>
						</Pagination.Link>
						<Pagination.Link href={props.guests.last_page_url}>
							<Lucide
								icon="ChevronsRight"
								className="h-4 w-4"
							/>
						</Pagination.Link>
					</Pagination>
					<FormSelect
						onChange={handlePerPage}
						className="!box ml-auto mt-2 w-20 lg:mt-0">
						{[10, 20, 25, 30, 40, 50, 100].map((item, key) => (
							<option
								key={key}
								selected={perPage === item}>
								{item}
							</option>
						))}
					</FormSelect>
				</div>
				<div className="col-span-12 -mt-3 flex items-center justify-center text-slate-300 dark:text-darkmode-300">
					{`${props.guests.total} kayıttan ${props.guests.from} ile ${props.guests.to} arası gösteriliyor`}
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
				title: 'Misafirler',
				href: route('hotel.guests.index'),
			},
		]}>
		{page}
	</AuthenticatedLayout>
)

export default Index
