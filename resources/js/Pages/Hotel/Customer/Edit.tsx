import React from 'react'
import {FormInput, FormLabel, FormSelect, FormTextarea} from '@/Components/Form'
import {Head, Link, router, useForm} from '@inertiajs/react'
import Button from '@/Components/Button'
import AuthenticatedLayout from '@/Layouts/HotelAuthenticatedLayout'
import {PageProps} from './types/edit'
import {chain} from 'lodash'
import * as child_process from 'child_process'
import Lucide from '@/Components/Lucide'
import Tippy from '@/Components/Tippy'
import CustomerForm from '@/Pages/Hotel/Customer/components/CustomerForm'

function Edit(props: PageProps) {
	const data = {
		title: props.customer.title,
		type: props.customer.type,
		tax_number: props.customer.tax_number,
		email: props.customer.email,
		phone: props.customer.phone,
		country: props.customer.country,
		city: props.customer.city,
		address: props.customer.address,
	}

	return (
		<>
			<Head title="Müşteri Düzenle" />
			<div className="flex items-center justify-between">
				<h2 className="intro-y my-5 text-lg font-medium">Müşteri Düzenle</h2>
				<Tippy
					as={Button}
					onClick={() => router.visit(route('hotel.customers.index'))}
					variant="soft-pending"
					className="intro-x"
					content="Geri">
					<Lucide
						icon="Undo2"
						className="h-5 w-5"
					/>
				</Tippy>
			</div>
			<CustomerForm
				customer={props.customer}
				type="edit"
				data={data}
			/>
		</>
	)
}

Edit.layout = (page: any) => (
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
			{
				title: 'Müşteri Düzenle',
				href: route('hotel.customers.edit', page.props.customer.id),
			},
		]}
		children={page}
	/>
)

export default Edit
