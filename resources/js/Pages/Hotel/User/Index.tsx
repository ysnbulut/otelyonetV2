import React, {useState} from 'react'
import {PageProps} from './types'
import AuthenticatedLayout from '@/Layouts/HotelAuthenticatedLayout'
import {Head, Link, router} from '@inertiajs/react'
import Lucide from '@/Components/Lucide'
import Button from '@/Components/Button'
import {FormInput, FormSelect} from '@/Components/Form'
import Table from '@/Components/Table'
import Pagination from '@/Components/Pagination'
import Tippy from '@/Components/Tippy'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

function Index(props: PageProps) {
	const MySwal = withReactContent(Swal)
	const [searchValue, setSearchValue] = useState<any>(props.filters.search || '')
	const [perPage, setPerPage] = useState(props.users.per_page || 10)

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

	const handleSearch = (e: any): void => {
		e.preventDefault()
		setSearchValue(e.target.value)
	}

	const handleDeleteUser = (id: number): void => {
		MySwal.fire({
			title: 'Emin misiniz?',
			text: 'Bu işlem geri alınamaz!',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Evet, sil!',
			cancelButtonText: 'Hayır, iptal!',
		}).then((result) => {
			if (result.isConfirmed) {
				router.delete(route('hotel.users.destroy', id), {
					preserveState: true,
					onSuccess: () => {
						Toast.fire({
							icon: 'success',
							title: 'Kullanıcı başarıyla silindi.',
						}).then((r) => {
							console.log(r)
						})
					},
					onError: (errors) => {
						console.log(errors)
					},
				})
			}
		})
	}

	const handleKeyDown = (e: any): void => {
		if (e.key === 'Enter') {
			router.get(
				route('hotel.users.index'),
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
			route('hotel.users.index'),
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
			<Head title="Kullanıcılar" />
			<div className="my-2 grid grid-cols-12 gap-6">
				<div className="intro-y col-span-12 mt-2 flex flex-col items-stretch gap-2 lg:flex-row lg:items-center lg:justify-between">
					<h2 className="intro-y text-lg font-medium">Kullanıcılar</h2>
					<div className="flex justify-end gap-2">
						<div className="relative text-slate-500">
							<FormInput
								type="text"
								className="!box pr-10"
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
							onClick={() => router.visit(route('hotel.users.create'))}
							variant="soft-primary"
							className="intro-x"
							content="Yeni Kullanıcı Ekle">
							<Lucide
								icon="Plus"
								className="h-5 w-5"
							/>
						</Tippy>
					</div>
				</div>
				<div className="intro-y col-span-12">
					<Table
						id="responsive-table"
						className="border-separate border-spacing-y-[10px] sm:mt-2">
						<Table.Thead>
							<Table.Tr>
								<Table.Th className="whitespace-nowrap border-b-0">KULLANICI</Table.Th>
								<Table.Th className="whitespace-nowrap border-b-0">KULLANICI ROLÜ</Table.Th>
								<Table.Th className="whitespace-nowrap border-b-0">E-POSTA</Table.Th>
								<Table.Th className="whitespace-nowrap border-b-0 text-center">AKSİYONLAR</Table.Th>
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody className="divide-y-[0.7rem] divide-transparent">
							{props.users.data.map((user) => (
								<Table.Tr
									key={user.id}
									className="intro-y">
									<Table.Td
										dataLabel="Ad Soyad"
										className="rounded-t-md bg-white lg:shadow-[20px_3px_20px_#0000000b] lg:first:rounded-l-md lg:first:rounded-tr-none lg:last:rounded-r-md dark:bg-darkmode-600">
										{user.name}
									</Table.Td>
									<Table.Td
										dataLabel="Rol"
										className="bg-white text-center first:rounded-l-md last:rounded-r-md lg:shadow-[20px_3px_20px_#0000000b] dark:bg-darkmode-600">
										{user.role}
									</Table.Td>
									<Table.Td
										dataLabel="Email"
										className="bg-white text-center first:rounded-l-md last:rounded-r-md lg:shadow-[20px_3px_20px_#0000000b] dark:bg-darkmode-600">
										{user.email}
									</Table.Td>
									<Table.Td
										dataLabel="Aksiyon"
										className="w-full rounded-b-md bg-white lg:w-40 lg:shadow-[20px_3px_20px_#0000000b] lg:first:rounded-l-md lg:last:rounded-r-md lg:last:rounded-bl-none dark:bg-darkmode-600">
										<div className="flex items-center justify-center gap-2">
											<Button
												as={Link}
												href={route('hotel.users.edit', user.id)}
												className="border-none p-1 shadow-none focus:ring-0">
												<Lucide
													icon="PencilLine"
													className="h-5 w-5 text-primary"
												/>
											</Button>
											{user.role !== 'Super Admin' && (
												<Button
													className="border-none p-1 shadow-none focus:ring-0"
													onClick={(e: any) => {
														e.preventDefault()
														handleDeleteUser(user.id)
													}}>
													<Lucide
														icon="Trash2"
														className="h-5 w-5 text-danger"
													/>
												</Button>
											)}
											<Link
												href="#"
												className="px-2">
												<Lucide
													icon="ArrowUpRight"
													className="h-5 w-5"
												/>
											</Link>
										</div>
									</Table.Td>
								</Table.Tr>
							))}
						</Table.Tbody>
					</Table>
				</div>
				<div className="intro-y col-span-12 flex flex-col lg:flex-row">
					<Pagination className="w-full flex-shrink">
						<Pagination.Link href={props.users.first_page_url}>
							<Lucide
								icon="ChevronsLeft"
								className="h-4 w-4"
							/>
						</Pagination.Link>
						<Pagination.Link
							href={props.users.prev_page_url !== null ? props.users.prev_page_url : '#'}
							preserveScroll>
							<Lucide
								icon="ChevronLeft"
								className="h-4 w-4"
							/>
						</Pagination.Link>
						<Pagination.Link href={'#'}>...</Pagination.Link>
						{props.users.links.map((link, key) => {
							if (key > 0 && key < props.users.links.length - 1) {
								if (props.users.current_page - 2 <= key && key <= props.users.current_page + 2) {
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
						<Pagination.Link href={props.users.next_page_url !== null ? props.users.next_page_url : '#'}>
							<Lucide
								icon="ChevronRight"
								className="h-4 w-4"
							/>
						</Pagination.Link>
						<Pagination.Link href={props.users.last_page_url}>
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
					{`${props.users.total} kayıttan ${props.users.from} ile ${props.users.to} arası gösteriliyor`}
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
				title: 'Kullanıcılar',
				href: route('hotel.users.index'),
			},
		]}>
		{page}
	</AuthenticatedLayout>
)

export default Index
