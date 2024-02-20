import React from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import route from 'ziggy-js'

function Index() {
	return (
		<div>
			<h1>Dashboard</h1>
		</div>
	)
}

Index.layout = (page: React.ReactNode) => (
	<AuthenticatedLayout
		// header={<h2 className='font-semibold text-xl text-gray-800 leading-tight'>Show</h2>}
		breadcrumb={[
			{
				title: 'Dashboard',
				href: route('hotel.dashboard.index'),
			},
		]}>
		{page}
	</AuthenticatedLayout>
)

export default Index
