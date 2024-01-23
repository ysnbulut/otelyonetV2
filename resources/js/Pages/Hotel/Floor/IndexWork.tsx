import React from 'react'
import {Head} from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

function IndexWork(props: any) {
	return (
		<>
			<Head title="Kullanıcılar" />
			<h2 className="intro-y mb-5 mt-10 text-lg font-medium">Kullanıcılar</h2>
			<div className="flex flex-col items-center justify-between 2xl:flex-row">
				<div className="relative -ml-[130px] -mt-[75px] flex w-full scale-50 flex-col gap-[4px] xl:ml-0 xl:mt-0 xl:scale-100 2xl:w-1/2">
					<div className="ml-[60px] h-[25px] w-[405px] -skew-x-[78deg] bg-neutral-300"></div>
					<button className="h-[50px] w-[400px] bg-blue-100 before:-right-32 before:-mt-[18px] before:ml-[402px] before:block before:h-[48px] before:w-[125px] before:-rotate-12 before:-skew-x-[12deg] before:bg-blue-200 hover:bg-blue-200 before:hover:bg-blue-300">
						<h5 className="-mt-[32px] flex items-center justify-center text-center text-4xl font-extrabold text-blue-900">
							4. KAT
						</h5>
					</button>
					<button className="h-[50px] w-[400px] bg-blue-100 before:-right-32 before:-mt-[18px] before:ml-[402px] before:block before:h-[48px] before:w-[125px] before:-rotate-12 before:-skew-x-[12deg] before:bg-blue-200 hover:bg-blue-200 before:hover:bg-blue-300">
						<h5 className="-mt-[32px] flex items-center justify-center text-center text-4xl font-extrabold text-blue-900">
							3. KAT
						</h5>
					</button>
					<button className="h-[50px] w-[400px] bg-blue-100 before:-right-32 before:-mt-[18px] before:ml-[402px] before:block before:h-[48px] before:w-[125px] before:-rotate-12 before:-skew-x-[12deg] before:bg-blue-200 hover:bg-blue-200 before:hover:bg-blue-300">
						<h5 className="-mt-[32px] flex items-center justify-center text-center text-4xl font-extrabold text-blue-900">
							2. KAT
						</h5>
					</button>
					<button className="h-[50px] w-[400px] bg-blue-100 before:-right-32 before:-mt-[18px] before:ml-[402px] before:block before:h-[48px] before:w-[125px] before:-rotate-12 before:-skew-x-[12deg] before:bg-blue-200 hover:bg-blue-200 before:hover:bg-blue-300">
						<h5 className="-mt-[32px] flex items-center justify-center text-center text-4xl font-extrabold text-blue-900">
							1. KAT
						</h5>
					</button>
					<button className="h-[50px] w-[400px] bg-blue-100 before:-right-32 before:-mt-[18px] before:ml-[402px] before:block before:h-[48px] before:w-[125px] before:-rotate-12 before:-skew-x-[12deg] before:bg-blue-200 hover:bg-blue-200 before:hover:bg-blue-300">
						<h5 className="-mt-[32px] flex items-center justify-center text-center text-4xl font-extrabold text-blue-900">
							ZEMİN KAT
						</h5>
					</button>
				</div>
				<div className="h-96 w-full bg-emerald-600 2xl:w-1/2"></div>
			</div>
		</>
	)
}

IndexWork.layout = (page: any) => (
	<AuthenticatedLayout
		breadcrumb={[
			{
				title: 'Dashboard',
				href: route('hotel.dashboard'),
			},
			{
				title: 'Kullanıcılar',
				href: route('hotel.users.index'),
			},
		]}
		children={page}
	/>
)

export default IndexWork
