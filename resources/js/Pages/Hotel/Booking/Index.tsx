import React, {useState} from 'react'
import {Head, Link, router} from '@inertiajs/react'
import Button from '@/Components/Button'
import {FormInput, FormSelect} from '@/Components/Form'
import Lucide from '@/Components/Lucide'
import Table from '@/Components/Table'
import Pagination from '@/Components/Pagination'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import {PageProps} from '@/Pages/Hotel/Booking/types'
import {twMerge} from 'tailwind-merge'
import Tippy from '@/Components/Tippy'

function Index(props: PageProps) {
	const [searchValue, setSearchValue] = useState<any>(props.filters.search || '')
	const [perPage, setPerPage] = useState(props.bookings.per_page || 10)

	const handleSearch = (e: any): void => {
		e.preventDefault()
		setSearchValue(e.target.value)
	}

	const handleKeyDown = (e: any): void => {
		if (e.key === 'Enter') {
			router.get(
				route('hotel.bookings.index'),
				{search: searchValue},
				{
					replace: false,
					preserveState: true,
					only: ['customers'],
				},
			)
		}
	}

	const handlePerPage = (e: any): void => {
		router.get(
			route('hotel.bookings.index'),
			{per_page: e.target.value},
			{
				replace: true,
				preserveState: false,
			},
		)
		setPerPage(e.target.value)
	}

	return (
		<>
			<Head title="Müşteriler" />
			<div className="my-2 grid grid-cols-12 gap-6">
				<div className="intro-y col-span-12 mt-2 flex flex-col items-stretch gap-2 lg:flex-row lg:items-center lg:justify-between">
					<h2 className="intro-y text-lg font-medium">Rezervasyonlar</h2>
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
						<Tippy
							as={Button}
							onClick={() => router.visit(route('hotel.booking_create'))}
							variant="soft-primary"
							className="intro-x"
							content="Yeni Rezervasyon Ekle">
							<Lucide
								icon="CalendarPlus"
								className="h-5 w-5"
							/>
						</Tippy>
					</div>
				</div>
				<div className="intro-y col-span-12 overflow-auto lg:overflow-visible">
					<Table
						id="responsive-table"
						className="border-separate border-spacing-y-[10px] sm:mt-2">
						<Table.Thead>
							<Table.Tr>
								<Table.Th className="whitespace-nowrap border-b-0">GİRİŞ/ÇIKIŞ TARİHİ</Table.Th>
								<Table.Th className="whitespace-nowrap border-b-0">ODALAR</Table.Th>
								<Table.Th className="whitespace-nowrap border-b-0">MÜŞTERİ</Table.Th>
								<Table.Th className="whitespace-nowrap border-b-0">TOPLAM TUTAR</Table.Th>
								<Table.Th className="whitespace-nowrap border-b-0">BAKİYE</Table.Th>
								<Table.Th className="whitespace-nowrap border-b-0 text-center">AKSİYONLAR</Table.Th>
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody className="divide-y-[0.7rem] divide-transparent">
							{props.bookings.data.map((booking) => (
								<Table.Tr
									key={booking.id}
									className="intro-y">
									<Table.Td
										dataLabel="Giriş Çıkış Tarihi"
										className="w-full rounded-t-md bg-white lg:w-40 lg:shadow-[20px_3px_20px_#0000000b] lg:first:rounded-l-md lg:last:rounded-r-md dark:bg-darkmode-600">
										<div className="flex items-center gap-3">
											<Lucide
												icon="CalendarRange"
												className="hidden h-8 w-8 lg:block"
											/>
											<Link
												href={route('hotel.bookings.show', booking.id)}
												className="flex flex-col whitespace-nowrap">
												<span className="flex items-center text-sm font-light text-darkmode-500 dark:text-darkmode-50">
													Giriş Tarihi :<span className="ms-2 text-base font-semibold">{booking.check_in}</span>
												</span>
												{booking.open_booking ? (
													<span className="flex items-center text-base font-semibold text-orange-500 dark:text-orange-300">
														Açık Rezervasyon
													</span>
												) : (
													<span className="flex items-center text-sm font-light text-darkmode-500 dark:text-darkmode-50">
														Çıkış Tarihi :<span className="ms-2 text-base font-semibold">{booking.check_out}</span>
													</span>
												)}
											</Link>
										</div>
									</Table.Td>
									<Table.Td
										dataLabel="Odalar"
										className={twMerge(
											booking.rooms_count > 2 ? 'text-lg' : 'text-2xl',
											'bg-white font-semibold text-primary first:rounded-l-md lg:shadow-[20px_3px_20px_#0000000b]' +
												' last:rounded-r-md dark:bg-darkmode-600',
										)}>
										{booking.rooms}
									</Table.Td>
									<Table.Td
										dataLabel="Müşteri"
										className="bg-white first:rounded-l-md last:rounded-r-md lg:shadow-[20px_3px_20px_#0000000b] dark:bg-darkmode-600">
										<Link
											className="text-base font-medium"
											href={route('hotel.customers.show', booking.customer_id)}>
											{booking.customer}
										</Link>
									</Table.Td>
									<Table.Td
										dataLabel="Tutar"
										className="bg-white first:rounded-l-md last:rounded-r-md lg:shadow-[20px_3px_20px_#0000000b] dark:bg-darkmode-600">
										<span className="text-xl font-semibold">{booking.amount_formatted}</span>
									</Table.Td>
									<Table.Td
										dataLabel="Kalan Ödeme"
										className="bg-white text-right first:rounded-l-md last:rounded-r-md lg:shadow-[20px_3px_20px_#0000000b] dark:bg-darkmode-600">
										{booking.remaining_balance === 0 ? (
											<span className="text-xl font-semibold text-green-600">Ödendi</span>
										) : (
											<span className="text-xl font-semibold text-red-400">{booking.remaining_balance_formatted}</span>
										)}
									</Table.Td>
									<Table.Td
										dataLabel="Aksiyon"
										className="w-full rounded-b-md bg-white lg:w-40 lg:shadow-[20px_3px_20px_#0000000b] lg:first:rounded-l-md lg:last:rounded-r-md lg:last:rounded-bl-none dark:bg-darkmode-600">
										asdasd
									</Table.Td>
								</Table.Tr>
							))}
						</Table.Tbody>
					</Table>
				</div>
				<div className="intro-y col-span-12 flex flex-col lg:flex-row">
					<Pagination className="w-full flex-shrink">
						<Pagination.Link href={props.bookings.first_page_url}>
							<Lucide
								icon="ChevronsLeft"
								className="h-4 w-4"
							/>
						</Pagination.Link>
						<Pagination.Link
							href={props.bookings.prev_page_url !== null ? props.bookings.prev_page_url : '#'}
							preserveScroll>
							<Lucide
								icon="ChevronLeft"
								className="h-4 w-4"
							/>
						</Pagination.Link>
						<Pagination.Link href={'#'}>...</Pagination.Link>
						{props.bookings.links.map((link, key) => {
							if (key > 0 && key < props.bookings.links.length - 1) {
								if (props.bookings.current_page - 2 <= key && key <= props.bookings.current_page + 2) {
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
						<Pagination.Link href={props.bookings.next_page_url !== null ? props.bookings.next_page_url : '#'}>
							<Lucide
								icon="ChevronRight"
								className="h-4 w-4"
							/>
						</Pagination.Link>
						<Pagination.Link href={props.bookings.last_page_url}>
							<Lucide
								icon="ChevronsRight"
								className="h-4 w-4"
							/>
						</Pagination.Link>
					</Pagination>
					<FormSelect
						onChange={handlePerPage}
						defaultValue={perPage}
						className="!box ml-auto mt-2 w-20 lg:mt-0">
						{[10, 20, 25, 30, 40, 50, 100].map((item, key) => (
							<option key={key}>{item}</option>
						))}
					</FormSelect>
				</div>
				<div className="col-span-12 -mt-3 flex items-center justify-center text-slate-300 dark:text-darkmode-300">
					{`${props.bookings.total} kayıttan ${props.bookings.from} ile ${props.bookings.to} arası gösteriliyor`}
				</div>
			</div>
		</>
	)
}

Index.layout = (page: any) => (
	<AuthenticatedLayout
		// header={<h2 className='font-semibold text-xl text-gray-800 leading-tight'>asdasdas</h2>}
		breadcrumb={[
			{
				title: 'Dashboard',
				href: route('hotel.dashboard.index'),
			},
			{
				title: 'Müşteriler',
				href: route('hotel.bookings.index'),
			},
		]}
		children={page}
	/>
)

export default Index
