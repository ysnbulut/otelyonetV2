import React from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

function Show(props: any) {
	return <div>asdasdasd</div>
}

Show.layout = (page: React.ReactNode) => (
	<AuthenticatedLayout
		// header={<h2 className='font-semibold text-xl text-gray-800 leading-tight'>asdasdas</h2>}
		breadcrumb={[
			{
				href: route('hotel.dashboard.index'),
				title: 'Dashboard',
			},
			{
				href: route('hotel.bookings.index'),
				title: 'Rezervasyonlar',
			},
			{
				href: route('hotel.booking_create'),
				title: 'Rezervasyon Oluştur',
			},
		]}
		children={page}
	/>
)
export default Show
