import React from 'react'
import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout'
import route from 'ziggy-js'
import {PageProps} from './types'
import {Head} from '@inertiajs/react'

function Index(props: PageProps) {
	return (
		<>
			<Head title="Dashboard" />
			<h1>Dashboard</h1>
		</>
	)
}

Index.layout = (page: React.ReactNode) => (
	<AdminAuthenticatedLayout
		// header={<h2 className='font-semibold text-xl text-gray-800 leading-tight'>Show</h2>}
		breadcrumb={[
			{
				title: 'Dashboard',
				href: route('hotel.dashboard.index'),
			},
		]}>
		{page}
	</AdminAuthenticatedLayout>
)

export default Index
