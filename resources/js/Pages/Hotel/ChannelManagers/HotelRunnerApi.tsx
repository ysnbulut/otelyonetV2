import React from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import {Head, router} from '@inertiajs/react'
import Tippy from '@/Components/Tippy'
import Button from '@/Components/Button'
import Lucide from '@/Components/Lucide'
import {FormInput, FormLabel} from '@/Components/Form'

function HotelRunnerApi(props: any) {
	return (
		<>
			<Head title="Misafirler" />
			<div className="my-5 flex items-center justify-between">
				<h2 className="intro-y text-lg font-medium">HotelRunner Api Ayarları</h2>
			</div>
			<div className="box mt-5 grid grid-cols-12 gap-6 p-5">
				<div className="col-span-6">
					<FormLabel htmlFor="api_key">Api Key</FormLabel>
					<FormInput
						id="api_key"
						type="text"
						className="w-full"
						value="VxtXY_Hoq5vx-_nRnS31tOjjLjIEXAeCYxJYuQFd"
						disabled={true}
					/>
				</div>
				<div className="col-span-6">
					<FormLabel htmlFor="api_key">HotelRunner Id</FormLabel>
					<FormInput
						id="api_key"
						type="text"
						className="w-full"
						value="621563410"
						disabled={true}
					/>
				</div>
			</div>
		</>
	)
}

HotelRunnerApi.layout = (page: React.ReactNode) => (
	<AuthenticatedLayout
		// header={<h2 className='font-semibold text-xl text-gray-800 leading-tight'>asdasdas</h2>}
		breadcrumb={[
			{
				href: route('hotel.dashboard.index'),
				title: 'Dashboard',
			},
			{
				href: route('hotel.booking_create'),
				title: 'Kanal Yönetimi',
			},
			{
				href: route('hotel.booking_create.step.one'),
				title: 'HotelRunner API',
			},
		]}
		children={page}
	/>
)

export default HotelRunnerApi
