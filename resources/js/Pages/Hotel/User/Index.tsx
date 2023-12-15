import React, {useEffect, useRef, useState} from 'react'
import {PageProps} from './types'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import {Inertia} from '@inertiajs/inertia'
import {Head, Link} from '@inertiajs/react'
import Lucide from '@/Components/Lucide'
import Button from '@/Components/Button'
import {FormInput, FormSelect} from '@/Components/Form'
import Table from '@/Components/Table'
import Pagination from '@/Components/Pagination'

function Index({...props}: PageProps) {
	const [searchValue, setSearchValue] = useState<any>(props.filters.search || '')
	const [perPage, setPerPage] = useState(props.users.per_page || 10)

	const handleSearch = (e: any): void => {
		e.preventDefault()
		setSearchValue(e.target.value)
	}

	const handleKeyDown = (e: any): void => {
		if (e.key === 'Enter') {
			Inertia.get(
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
		Inertia.get(
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
		<AuthenticatedLayout
			user={props.auth.user}
			role={props.auth.role}
			permissions={props.auth.permissions}
			pricingPolicy={props.auth.pricing_policy}>
			<Head title="Kullanıcılar" />
			<h2 className="intro-y mb-5 mt-10 text-lg font-medium">Kullanıcılar</h2>
			<div className="mt-5 grid grid-cols-12 gap-6">
				<div className="intro-y col-span-12 mt-2 flex flex-wrap items-center justify-between px-5 sm:flex-nowrap">
					<Button
						as={Link}
						href={route('hotel.users.create')}
						variant="primary"
						className="mr-2 shadow-md">
						Yeni Kullanıcı Ekle
					</Button>
					{/*<Menu>*/}
					{/*    <Menu.Button as={Button} className="px-2 !box">*/}
					{/*      <span className="flex items-center justify-center w-5 h-5">*/}
					{/*        <Lucide icon="Plus" className="w-4 h-4" />*/}
					{/*      </span>*/}
					{/*    </Menu.Button>*/}
					{/*    <Menu.Items className="w-40">*/}
					{/*        <Menu.Item>*/}
					{/*            <Lucide icon="Users" className="w-4 h-4 mr-2" /> Add Group*/}
					{/*        </Menu.Item>*/}
					{/*        <Menu.Item>*/}
					{/*            <Lucide icon="MessageCircle" className="w-4 h-4 mr-2" /> Send*/}
					{/*            Message*/}
					{/*        </Menu.Item>*/}
					{/*    </Menu.Items>*/}
					{/*</Menu>*/}
					<div className="hidden text-slate-500 md:block">
						{`${props.users.total} kayıttan ${props.users.from} ile ${props.users.to} arası gösteriliyor`}
					</div>
					<div className="mt-3 w-full sm:ml-auto sm:mt-0 sm:w-auto md:ml-0">
						<div className="relative w-56 text-slate-500">
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
				<div className="intro-y col-span-12 overflow-auto lg:overflow-visible">
					<Table className="border-separate border-spacing-y-[10px] sm:mt-2">
						<Table.Thead>
							<Table.Tr>
								<Table.Th className="whitespace-nowrap border-b-0">KULLANICI</Table.Th>
								<Table.Th className="whitespace-nowrap border-b-0">KULLANICI ROLÜ</Table.Th>
								<Table.Th className="whitespace-nowrap border-b-0 text-center">E-POSTA</Table.Th>
								<Table.Th className="whitespace-nowrap border-b-0 text-center">AKSİYONLAR</Table.Th>
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>
							{props.users.data.map((user) => (
								<Table.Tr
									key={user.id}
									className="intro-y">
									<Table.Td
										dataLabel="KULLANICI"
										className="border-b-0 bg-white shadow-[20px_3px_20px_#0000000b] first:rounded-l-md last:rounded-r-md dark:bg-darkmode-600">
										{user.name}
									</Table.Td>
									<Table.Td
										dataLabel="KULLANICI"
										className="border-b-0 bg-white text-center shadow-[20px_3px_20px_#0000000b] first:rounded-l-md last:rounded-r-md dark:bg-darkmode-600">
										{user.role}
									</Table.Td>
									<Table.Td
										dataLabel="KULLANICI"
										className="border-b-0 bg-white text-center shadow-[20px_3px_20px_#0000000b] first:rounded-l-md last:rounded-r-md dark:bg-darkmode-600">
										{user.email}
									</Table.Td>
									<Table.Td
										dataLabel="KULLANICI"
										className="relative w-56 border-b-0 bg-white py-0 shadow-[20px_3px_20px_#0000000b] before:absolute before:inset-y-0 before:left-0 before:my-auto before:block before:h-8 before:w-px before:bg-slate-200 first:rounded-l-md last:rounded-r-md dark:bg-darkmode-600 before:dark:bg-darkmode-400">
										<div className="flex items-center justify-center gap-2">
											<Button
												as={Link}
												variant="outline-primary"
												href={route('hotel.users.edit', user.id)}
												className="px-2">
												<Lucide
													icon="Pencil"
													className="text-theme-9 h-4 w-4"
												/>
											</Button>
											<Button
												onClick={() => console.log('tık sil')}
												variant="outline-danger"
												className="px-2">
												<Lucide
													icon="Trash"
													className="text-theme-9 h-4 w-4 cursor-pointer"
												/>
											</Button>
											<Button
												variant="outline-dark"
												className="px-2">
												<Lucide
													icon="ArrowUpRight"
													className="text-theme-9 h-4 w-4"
												/>
											</Button>
										</div>
									</Table.Td>
								</Table.Tr>
							))}
						</Table.Tbody>
					</Table>
				</div>
				<div className="intro-y col-span-12 flex flex-wrap items-center sm:flex-row sm:flex-nowrap">
					<Pagination className="w-full sm:mr-auto sm:w-auto">
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
						className="!box mt-3 w-20 sm:mt-0">
						{[10, 20, 25, 30, 40, 50, 100].map((item, key) => (
							<option
								key={key}
								selected={perPage === item}>
								{item}
							</option>
						))}
					</FormSelect>
				</div>
			</div>
		</AuthenticatedLayout>
	)
}

export default Index
