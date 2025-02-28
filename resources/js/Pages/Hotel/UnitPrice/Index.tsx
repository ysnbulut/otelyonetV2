import React, {useState} from 'react'
import AuthenticatedLayout from '@/Layouts/HotelAuthenticatedLayout'
import {PageProps} from './types'
import {Head} from '@inertiajs/react'
import SeasonList from './components/SeasonList'
import WarningBadge from './components/WarningBadge'
import Lucide from '@/Components/Lucide'

function Index(props: PageProps) {
	const [warningBadge, setWarningBadge] = useState<{[key: number]: boolean}>({})
	return (
		<>
			<Head title="Ünite Fiyatları" />
			<h2 className="intro-y my-2 text-lg font-medium lg:my-5">Ünite Fiyatları</h2>
			{props.roomTypesAndViews.length > 0 ? (
				props.roomTypesAndViews.map((roomTypeAndView) => (
					<div
						key={roomTypeAndView.id}
						className="intro-y box mb-5 pb-5">
						<div className="grid grid-cols-1 rounded-lg bg-primary px-3 py-5 lg:grid-cols-2 ">
							<div className="flex items-end">
								<h3 className="pl-3 text-base font-semibold text-white">
									{roomTypeAndView.name} <span className="text-xs font-light">için sezonluk ünite fiyatları</span>
								</h3>
							</div>
							<WarningBadge warning={warningBadge[roomTypeAndView.id]} />
						</div>
						<SeasonList
							pricingPolicy={props.pricingPolicy}
							pricingCurrency={props.pricingCurrency}
							taxRate={props.taxRate}
							activatedChannels={props.activatedChannels}
							roomTypeAndView={roomTypeAndView}
							setWarningBadge={setWarningBadge}
						/>
					</div>
				))
			) : (
				<div className="flex flex-col items-center justify-center gap-5 px-10 text-slate-700 text-opacity-30 dark:text-slate-500 dark:text-opacity-30">
					<div className="flex items-center justify-center gap-5">
						<Lucide
							icon="AlertTriangle"
							className="h-12 w-12"
						/>
						<span className="text-3xl font-semibold">Henüz bir oda tipi - manzara oluşturulmamış.</span>
					</div>
					<p>
						Ünite fiyatları girebilmek için öncelikle oda tipi oluşturmalısınız. Oda tipi oluşturduğunuzda oda tipinin maksimum kişi sayısına göre misafir varyasyonları otomatik olarak
						oluşturulacaktır...
					</p>
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
				title: 'Ünite Fiyatları',
				href: route('hotel.unit_prices.index'),
			},
		]}>
		{page}
	</AuthenticatedLayout>
)
export default Index
