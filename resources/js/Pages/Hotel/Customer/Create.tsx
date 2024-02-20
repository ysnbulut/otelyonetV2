import React, {useState} from 'react'
import {Head, Link, router, useForm} from '@inertiajs/react'
import Button from '@/Components/Button'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import {PageProps} from './types/create'
import Tippy from '@/Components/Tippy'
import Lucide from '@/Components/Lucide'
import CustomerForm from '@/Pages/Hotel/Customer/components/CustomerForm'

function Create(props: PageProps) {
	const data = {
		title: '',
		type: 'individual',
		tax_number: '',
		email: '',
		phone: '',
		country: '',
		city: '',
		address: '',
	}

	return (
		<>
			<Head title="Müşteri Ekle" />
			<div className="flex items-center justify-between">
				<h2 className="intro-y my-5 text-lg font-medium">Müşteri Ekle</h2>
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
				type="create"
				data={data}
			/>
		</>
	)
}

Create.layout = (page: React.ReactNode) => (
	<AuthenticatedLayout
		breadcrumb={[
			{
				title: 'Müşteriler',
				href: route('hotel.customers.index'),
			},
			{
				title: 'Müşteri Ekle',
				href: route('hotel.customers.create'),
			},
		]}
		children={page}
	/>
)

export default Create
