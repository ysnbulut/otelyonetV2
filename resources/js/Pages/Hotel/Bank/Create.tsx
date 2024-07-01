import React from 'react'
import AuthenticatedLayout from '@/Layouts/HotelAuthenticatedLayout'
import {Head, router, useForm} from '@inertiajs/react'
import Tippy from '@/Components/Tippy'
import Button from '@/Components/Button'
import Lucide from '@/Components/Lucide'
import BankForm from '@/Pages/Hotel/Bank/components/BankForm'

function Create(props: any) {
	const {data, setData, errors, setError, clearErrors, post} = useForm({})
	return (
		<>
			<Head title="Kasa Ekle" />
			<div className="flex items-center justify-between">
				<h2 className="intro-y my-5 text-lg font-medium">Kasa Ekle</h2>
				<Tippy
					as={Button}
					onClick={() => router.visit(route('hotel.banks.index'))}
					variant="soft-pending"
					className="intro-x"
					content="Geri">
					<Lucide
						icon="Undo2"
						className="h-5 w-5"
					/>
				</Tippy>
			</div>
			<BankForm
				type="create"
				data={data}
			/>
		</>
	)
}

Create.layout = (page: any) => (
	<AuthenticatedLayout
		breadcrumb={[
			{
				title: 'Dashboard',
				href: route('hotel.dashboard.index'),
			},
			{
				title: 'Kasa ve Bankalar',
				href: route('hotel.banks.index'),
			},

			{
				title: 'Kasa Olustur',
				href: route('hotel.banks.create'),
			},
		]}>
		{page}
	</AuthenticatedLayout>
)

export default Create
