import React from 'react'
import {Head, router} from '@inertiajs/react'
import Tippy from '@/Components/Tippy'
import Button from '@/Components/Button'
import Lucide from '@/Components/Lucide'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

function Create(props: any) {
	const handleSubmit = (e: any) => {
		e.preventDefault()
	}

	return (
		<>
			<Head title="Oda Türleri" />
			<div className="mb-5 mt-10 flex w-full items-center justify-between">
				<h2 className="intro-y text-lg font-medium">
					Satış Ünitesi <strong>Oluştur</strong>
				</h2>
				<Tippy
					as={Button}
					onClick={() => router.visit(route('hotel.sales_units.index'))}
					variant="soft-pending"
					className="intro-x"
					content="Geri">
					<Lucide
						icon="Undo2"
						className="h-5 w-5"
					/>
				</Tippy>
			</div>
			<form
				onSubmit={(e) => handleSubmit(e)}
				className="box flex flex-col gap-4 p-5">
				asdadasd
			</form>
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
				title: 'Satış Üniteleri',
				href: route('hotel.sales_units.index'),
			},
			{
				title: 'Satış Ünitesi Oluştur',
				href: route('hotel.sales_units.create'),
			},
		]}>
		{page}
	</AuthenticatedLayout>
)

export default Create
