import React from 'react'
import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout'
import route from 'ziggy-js'
import {PageProps} from './types'

function Index(props: PageProps) {
	console.log(props)
	return (
		<div>
			<h1>Dashboard</h1>
		</div>
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
