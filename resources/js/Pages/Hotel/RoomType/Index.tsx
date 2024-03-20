import React, {useState} from 'react'
import {PageProps} from './types'
import {Head, router} from '@inertiajs/react'
import Button from '@/Components/Button'
import AuthenticatedLayout from '@/Layouts/HotelAuthenticatedLayout'
import Item from './components/Item'
import Lucide from '@/Components/Lucide'
import Tippy from '@/Components/Tippy'

function Index(props: PageProps) {
	const [roomTypes, setRoomTypes] = useState(props.roomTypes)
	return (
		<>
			<Head title="Oda Türleri" />
			<div className="my-5 flex w-full items-center justify-between">
				<h2 className="intro-y text-lg font-medium">Oda Türleri</h2>
				<Tippy
					as={Button}
					onClick={() => router.visit(route('hotel.room_types.create'))}
					variant="soft-primary"
					className="intro-x"
					content="Yeni Oda Tipi Ekle">
					<Lucide
						icon="Plus"
						className="h-5 w-5"
					/>
				</Tippy>
			</div>
			{roomTypes.length > 0 ? (
				roomTypes.map((roomType) => (
					<Item
						key={roomType.id}
						roomType={roomType}
						setRoomTypes={setRoomTypes}
					/>
				))
			) : (
				<div className="box flex min-h-96 flex-col items-center justify-center text-slate-700 text-opacity-30 dark:text-slate-500 dark:text-opacity-30">
					<div className="flex items-center justify-center gap-5">
						<Lucide
							icon="AlertTriangle"
							className="h-12 w-12"
						/>
						<span className="text-3xl font-semibold">Henüz bir oda tipi oluşturulmamış.</span>
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
				title: 'Oda Türleri',
				href: route('hotel.room_types.index'),
			},
		]}>
		{page}
	</AuthenticatedLayout>
)
export default Index
