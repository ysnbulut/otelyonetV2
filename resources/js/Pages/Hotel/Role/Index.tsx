import React, {useRef, useState} from 'react'
import {PageProps} from './types'
import {Head, Link, router} from '@inertiajs/react'
import {FormSelect} from '@/Components/Form'
import Lucide from '@/Components/Lucide'
import Button from '@/Components/Button'
import Pagination from '@/Components/Pagination'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import {Inertia} from '@inertiajs/inertia'
import Alert from '@/Components/Alert'
import {twMerge} from 'tailwind-merge'
import Tippy from '@/Components/Tippy'

function Index(props: PageProps) {
	const aRef = useRef(null)
	const [perPage, setPerPage] = useState(props.roles.per_page || 10)

	const handlePerPage = (e: any): void => {
		Inertia.get(
			route('hotel.roles.index'),
			{per_page: e.target.value},
			{
				replace: true,
				preserveState: true,
			},
		)
		setPerPage(e.target.value)
	}

	const handleDestroy = (id: number) => {
		Inertia.delete(route('hotel.roles.destroy', id), {
			preserveState: false,
			onSuccess: () => {
				console.log('silindi')
			},
		})
	}

	return (
		<AuthenticatedLayout
			user={props.auth.user}
			role={props.auth.role}
			permissions={props.auth.permissions}
			pricingPolicy={props.auth.pricing_policy}
			breadcrumb={[
				{
					title: 'Dashboard',
					href: route('hotel.dashboard.index'),
				},
				{
					title: 'Roller',
					href: route('hotel.roles.index'),
				},
			]}>
			<Head title="Kullanıcı Rolleri" />
			<div className="my-5 flex w-full items-center justify-between">
				<h2 className="intro-y text-lg font-medium">Kullanıcı Rolleri</h2>
				<Tippy
					as={Button}
					onClick={() => router.visit(route('hotel.roles.create'))}
					variant="soft-primary"
					className="intro-x"
					content="Yeni Rol Ekle">
					<Lucide
						icon="Plus"
						className="h-5 w-5"
					/>
				</Tippy>
			</div>
			<div className="my-2 grid grid-cols-12 gap-6">
				{props.roles.data.map((role) => (
					<div
						key={role.id}
						className="intro-y col-span-12 md:col-span-6 lg:mb-0">
						<div className="box">
							<div className="flex items-center justify-between p-5">
								<div className="text-left">
									<Link
										href={route('hotel.roles.edit', role.id)}
										className="text-xl font-medium">
										{role.name}
									</Link>
								</div>
								<div className="flex items-center gap-2 lg:mt-0">
									{props.can.edit && role.name !== 'Super Admin' && (
										<Link
											href={route('hotel.roles.edit', role.id)}
											className="px-2">
											<Lucide
												icon="PencilLine"
												className="h-5 w-5 text-primary"
											/>
										</Link>
									)}
									{props.can.delete && role.name !== 'Super Admin' && (
										<Button
											onClick={() => handleDestroy(role.id)}
											className="border-none p-1 shadow-none focus:ring-0">
											<Lucide
												icon="Trash2"
												className="h-5 w-5 text-danger"
											/>
										</Button>
									)}
								</div>
							</div>
						</div>
					</div>
				))}
				<div className="intro-y col-span-12 flex flex-col lg:flex-row">
					<Pagination className="w-full flex-shrink">
						<Pagination.Link href={props.roles.first_page_url}>
							<Lucide
								icon="ChevronsLeft"
								className="h-4 w-4"
							/>
						</Pagination.Link>
						<Pagination.Link
							href={props.roles.prev_page_url !== null ? props.roles.prev_page_url : '#'}
							preserveScroll>
							<Lucide
								icon="ChevronLeft"
								className="h-4 w-4"
							/>
						</Pagination.Link>
						<Pagination.Link href={'#'}>...</Pagination.Link>
						{props.roles.links.map((link, key) => {
							if (key > 0 && key < props.roles.links.length - 1) {
								if (props.roles.current_page - 2 <= key && key <= props.roles.current_page + 2) {
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
						<Pagination.Link href={props.roles.next_page_url !== null ? props.roles.next_page_url : '#'}>
							<Lucide
								icon="ChevronRight"
								className="h-4 w-4"
							/>
						</Pagination.Link>
						<Pagination.Link href={props.roles.last_page_url}>
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
					{`${props.roles.total} kayıttan ${props.roles.from} ile ${props.roles.to} arası gösteriliyor`}
				</div>
			</div>
		</AuthenticatedLayout>
	)
}

export default Index
