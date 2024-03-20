import React from 'react'
import AuthenticatedLayout from '@/Layouts/HotelAuthenticatedLayout'

function Create(props: any) {
	return <div></div>
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
				href: route('hotel.case_and_banks.index'),
			},

			{
				title: 'Kasa Olustur',
				href: route('hotel.case_and_banks.create'),
			},
		]}>
		{page}
	</AuthenticatedLayout>
)

export default Create
