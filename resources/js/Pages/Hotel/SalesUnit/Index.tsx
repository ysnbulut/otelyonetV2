import React, {useState} from 'react'
import {Head, router} from '@inertiajs/react'
import Tippy from '@/Components/Tippy'
import Button from '@/Components/Button'
import Lucide from '@/Components/Lucide'
import Item from './components/Item'
import AuthenticatedLayout from '@/Layouts/HotelAuthenticatedLayout'
import {PageProps} from '@/Pages/Hotel/SalesUnit/types'

function Index(props: PageProps) {
	const [salesUnits, setSalesUnits] = useState(props.salesUnits)
	return (
		<>
			<Head title="Satış Üniteleri" />
			<div className="my-5 flex w-full items-center justify-between">
				<h2 className="intro-y text-lg font-medium">Satış Üniteleri</h2>
				<Tippy
					as={Button}
					onClick={() => router.visit(route('hotel.sales_units.create'))}
					variant="soft-primary"
					className="intro-x"
					content="Yeni Satış Ünitesi Ekle">
					<Lucide
						icon="Plus"
						className="h-5 w-5"
					/>
				</Tippy>
			</div>
			{salesUnits.length > 0 ? (
				salesUnits.map((salesUnit) => (
					<Item
						key={salesUnit.id}
						salesUnit={salesUnit}
						setSalesUnits={setSalesUnits}
					/>
				))
			) : (
				<div className="box flex min-h-96 flex-col items-center justify-center text-slate-700 text-opacity-30 dark:text-slate-500 dark:text-opacity-30">
					<div className="flex items-center justify-center gap-5">
						<Lucide
							icon="AlertTriangle"
							className="h-12 w-12"
						/>
						<span className="text-3xl font-semibold">Henüz bir Satış Ünitesi oluşturulmamış.</span>
					</div>
				</div>
			)}
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
				title: 'Satış Üniteleri',
				href: route('hotel.sales_units.index'),
			},
		]}>
		{page}
	</AuthenticatedLayout>
)
export default Index
