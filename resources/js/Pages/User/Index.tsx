import React, { useEffect, useRef, useState } from 'react'
import { PageProps } from './types'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Inertia } from '@inertiajs/inertia'
import { Head, Link } from '@inertiajs/react'
import Lucide from '@/Components/Lucide'
import Button from '@/Components/Button'
import { FormInput, FormSelect } from '@/Components/Form'
import Table from '@/Components/Table'
import Pagination from '@/Components/Pagination'
import { throttle } from 'lodash'
import axios from 'axios'

function Index({ ...props }: PageProps) {
	const [searchValue, setSearchValue] = useState<any>(props.filters.search || '')
	const [perPage, setPerPage] = useState(props.users.per_page || 10)


	const handleSearch = (e: any): void => {
		e.preventDefault()
		setSearchValue(e.target.value)
	}

	const handleKeyDown = (e: any): void => {
		if (e.key === 'Enter') {
			Inertia.get(route('hotel.users.index'), { search: searchValue }, {
				replace: false,
				preserveState: true,
				only: ['guests'],
			})
		}
	}

	const handlePerPage = (e: any): void => {
		Inertia.get(route('hotel.users.index'), { per_page: e.target.value }, {
			replace: true,
			preserveState: true,
		})
		setPerPage(e.target.value)
	}

	return (<AuthenticatedLayout
		user={props.auth.user}
		role={props.auth.role}
		permissions={props.auth.permissions}
		pricingPolicy={props.auth.pricing_policy}
	>
		<Head title='Kullanıcılar' />
		<h2 className='mt-10 mb-5 text-lg font-medium intro-y'>Kullanıcılar</h2>
		<div className='grid grid-cols-12 gap-6 mt-5'>
			<div className='flex flex-wrap justify-between px-5 items-center col-span-12 mt-2 intro-y sm:flex-nowrap'>
				<Button as={Link} href={route('hotel.users.create')} variant='primary' className='mr-2 shadow-md'>
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
				<div className='hidden md:block text-slate-500'>
					{`${props.users.total} kayıttan ${props.users.from} ile ${props.users.to} arası gösteriliyor`}
				</div>
				<div className='w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0'>
					<div className='relative w-56 text-slate-500'>
						<FormInput
							type='text'
							className='w-56 pr-10 !box'
							placeholder='Search...'
							onChange={(e) => handleSearch(e)}
							onKeyDown={handleKeyDown}
							name={'search'}
							value={searchValue}
						/>
						<Lucide
							icon='Search'
							className='absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3'
						/>
					</div>
				</div>
			</div>
			<div className='intro-y col-span-12 overflow-auto lg:overflow-visible'>
				<Table className='border-spacing-y-[10px] border-separate sm:mt-2'>
					<Table.Thead>
						<Table.Tr>
							<Table.Th className='border-b-0 whitespace-nowrap'>
								KULLANICI
							</Table.Th>
							<Table.Th className='border-b-0 whitespace-nowrap'>
								KULLANICI ROLÜ
							</Table.Th>
							<Table.Th className='text-center border-b-0 whitespace-nowrap'>
								E-POSTA
							</Table.Th>
							<Table.Th className='text-center border-b-0 whitespace-nowrap'>
								AKSİYONLAR
							</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{props.users.data.map((user) => (<Table.Tr key={user.id} className='intro-y'>
							<Table.Td
								className='first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]'>
								{user.name}
							</Table.Td>
							<Table.Td
								className='first:rounded-l-md last:rounded-r-md text-center bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]'>
								{user.role}
							</Table.Td>
							<Table.Td
								className='first:rounded-l-md last:rounded-r-md text-center bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]'>
								{user.email}
							</Table.Td>
							<Table.Td
								className='relative w-56 border-b-0 bg-white py-0 shadow-[20px_3px_20px_#0000000b] before:absolute before:inset-y-0 before:left-0 before:my-auto before:block before:h-8 before:w-px before:bg-slate-200 first:rounded-l-md last:rounded-r-md dark:bg-darkmode-600 before:dark:bg-darkmode-400'>
								<div className='flex justify-center items-center gap-2'>
									<Button as={Link} variant='outline-primary' href={route('hotel.users.edit', user.id)} className='px-2'>
										<Lucide icon='Pencil' className='w-4 h-4 text-theme-9' />
									</Button>
									<Button onClick={() => console.log('tık sil')} variant='outline-danger' className='px-2'>
										<Lucide icon='Trash'
														className='w-4 h-4 text-theme-9 cursor-pointer' />
									</Button>
									<Button variant='outline-dark' className='px-2'>
										<Lucide icon='ArrowUpRight' className='w-4 h-4 text-theme-9' />
									</Button>
								</div>
							</Table.Td>
						</Table.Tr>))}
					</Table.Tbody>
				</Table>
			</div>
			<div className='flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap'>
				<Pagination className='w-full sm:w-auto sm:mr-auto'>
					<Pagination.Link href={props.users.first_page_url}>
						<Lucide icon='ChevronsLeft' className='w-4 h-4' />
					</Pagination.Link>
					<Pagination.Link href={props.users.prev_page_url !== null ? props.users.prev_page_url : '#'}
													 preserveScroll>
						<Lucide icon='ChevronLeft' className='w-4 h-4' />
					</Pagination.Link>
					<Pagination.Link href={'#'}>...</Pagination.Link>
					{props.users.links.map((link, key) => {
						if (key > 0 && key < props.users.links.length - 1) {
							if (props.users.current_page - 2 <= key && key <= props.users.current_page + 2) {
								return (<Pagination.Link key={key} href={link.url !== null ? link.url : '#'}
																				 active={link.active}>{link.label}</Pagination.Link>)
							}
						}
					})}
					<Pagination.Link href={'#'}>...</Pagination.Link>
					<Pagination.Link
						href={props.users.next_page_url !== null ? props.users.next_page_url : '#'}>
						<Lucide icon='ChevronRight' className='w-4 h-4' />
					</Pagination.Link>
					<Pagination.Link href={props.users.last_page_url}>
						<Lucide icon='ChevronsRight' className='w-4 h-4' />
					</Pagination.Link>
				</Pagination>
				<FormSelect onChange={handlePerPage} className='w-20 mt-3 !box sm:mt-0'>
					{
						[10, 20, 25, 30, 40, 50, 100].map((item, key) => (
							<option key={key} selected={perPage === item}>{item}</option>))
					}
				</FormSelect>
			</div>
		</div>
	</AuthenticatedLayout>)
}

export default Index
