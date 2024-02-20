import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import React, {useState} from 'react'
import Button from '@/Components/Button'
import Lucide from '@/Components/Lucide'
import {FormInput} from '@/Components/Form'
import {PageProps} from './types/index'
import Pagination from '@/Components/Pagination'
import {FormSelect} from '@/Components/Form'
import {Head, Link, router} from '@inertiajs/react'
import Tippy from '@/Components/Tippy'
import {pickBy} from 'lodash'

function Index(props: PageProps) {
	const [filter, setFilter] = useState({
		search: props.filters.search || '',
		per_page: props.banks.per_page || 10,
	})

	const handleKeyDown = (e: any): void => {
		if (e.key === 'Enter') {
			const query = Object.keys(pickBy(filter)).length ? pickBy(filter) : {remember: 'forget'}
			router.get(route('hotel.case_and_banks.index'), query, {
				replace: false,
				preserveState: true,
				only: ['customers'],
			})
		}
	}

	const handlePerPage = (e: any): void => {
		router.get(
			route('hotel.case_and_banks.index'),
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
			<Head title="Kasa ve Bankalar" />
			<div className="my-2 grid grid-cols-12 gap-6">
				<div className="intro-y col-span-12 mt-2 flex flex-col items-stretch gap-2 lg:flex-row lg:items-center lg:justify-between">
					<h2 className="intro-y text-lg font-medium">Kasa ve Banka Hesapları</h2>
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
							onClick={() => router.visit(route('hotel.case_and_banks.create'))}
							variant="soft-primary"
							className="intro-x"
							content="Yeni Kasa Ekle">
							<Lucide
								icon="Plus"
								className="h-5 w-5"
							/>
						</Tippy>
					</div>
				</div>
				{/* BEGIN: Users Layout */}
				{props.banks.data.length > 0 ? (
					props.banks.data.map((bank, index) => (
						<div
							key={bank.id}
							className="intro-y col-span-12 md:col-span-6">
							<div className="box">
								<div className="flex flex-col items-center p-5 lg:flex-row">
									<div className="mt-3 text-center lg:ml-2 lg:mr-auto lg:mt-0 lg:text-left">
										<Link
											href={route('hotel.case_and_banks.edit', bank.id)}
											className="text-3xl font-normal">
											{bank.name} ({bank.currency})
										</Link>
										<div className="mt-0.5 text-2xl text-slate-500">{bank.balance}</div>
									</div>
									<div className="mt-4 flex lg:mt-0">
										<Button
											as="a"
											href={route('hotel.case_and_banks.edit', bank.id)}
											className="mr-2 px-2 py-1"
											variant="primary">
											Detay
										</Button>
										<Button
											as="a"
											href={route('hotel.case_and_banks.edit', bank.id)}
											variant="outline-secondary"
											className="px-2 py-1">
											Düzenle
										</Button>
									</div>
								</div>
							</div>
						</div>
					))
				) : (
					<div className="box col-span-12 flex min-h-96 flex-col items-center justify-center text-slate-700 text-opacity-30 dark:text-slate-500 dark:text-opacity-30">
						<div className="flex items-center justify-center gap-5">
							<Lucide
								icon="AlertTriangle"
								className="h-12 w-12"
							/>
							<span className="text-3xl font-semibold">Henüz bir kasa veya banka hesabı oluşturulmamış.</span>
						</div>
					</div>
				)}
				{/* BEGIN: Users Layout */}
				{/* END: Pagination */}
				<div className="intro-y col-span-12 flex flex-wrap items-center sm:flex-row sm:flex-nowrap">
					<Pagination className="w-full sm:mr-auto sm:w-auto">
						<Pagination.Link href={props.banks.first_page_url}>
							<Lucide
								icon="ChevronsLeft"
								className="h-4 w-4"
							/>
						</Pagination.Link>
						<Pagination.Link
							href={props.banks.prev_page_url !== null ? props.banks.prev_page_url : '#'}
							preserveScroll>
							<Lucide
								icon="ChevronLeft"
								className="h-4 w-4"
							/>
						</Pagination.Link>
						<Pagination.Link href={'#'}>...</Pagination.Link>
						{props.banks.links.map((link, key) => {
							if (key > 0 && key < props.banks.links.length - 1) {
								if (props.banks.current_page - 2 <= key && key <= props.banks.current_page + 2) {
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
						<Pagination.Link href={props.banks.next_page_url !== null ? props.banks.next_page_url : '#'}>
							<Lucide
								icon="ChevronRight"
								className="h-4 w-4"
							/>
						</Pagination.Link>
						<Pagination.Link href={props.banks.last_page_url}>
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
					{`${props.banks.total} kayıttan ${props.banks.from !== null ? props.banks.from : '0'} ile ${
						props.banks.to !== null ? props.banks.to : '0'
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
				href: route('hotel.dashboard.index'),
			},
			{
				title: 'Kasa ve Bankalar',
				href: route('hotel.case_and_banks.index'),
			},
		]}>
		{page}
	</AuthenticatedLayout>
)

export default Index
