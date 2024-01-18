import React, {useState} from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import {PageProps} from './types'
import {Head} from '@inertiajs/react'
import SeasonList from './components/SeasonList'
import WarningBadge from './components/WarningBadge'
import Lucide from '@/Components/Lucide'

function Index(props: PageProps) {
	const [warningBadge, setWarningBadge] = useState<{[key: number]: boolean}>({})
	return (
		<AuthenticatedLayout
			user={props.auth.user}
			role={props.auth.role}
			permissions={props.auth.permissions}
			pricingPolicy={props.auth.pricing_policy}
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
			<Head title="Ünite Fiyatları" />
			<h2 className="intro-y my-2 text-lg font-medium lg:my-5">Ünite Fiyatları</h2>
			<div className="box w-full p-5">
				{props.roomTypesAndViews.length > 0 ? (
					props.roomTypesAndViews.map((roomTypeAndView) => (
						<div
							key={roomTypeAndView.id}
							className="intro-y">
							<div className="mt-2 grid grid-cols-1 rounded border bg-slate-500/5 px-1 py-2 lg:grid-cols-2">
								<div className="flex items-end">
									<h3 className="pl-3 text-xl font-semibold text-primary dark:text-slate-400">
										{roomTypeAndView.name} <span className="text-xs font-light">için sezonluk ünite fiyatları</span>
									</h3>
								</div>
								<WarningBadge warning={warningBadge[roomTypeAndView.id]} />
							</div>
							<SeasonList
								pricingPolicy={props.pricingPolicy}
								pricingCurrency={props.pricingCurrency}
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
							Ünite fiyatları girebilmek için öncelikle oda tipi oluşturmalısınız. Oda tipi oluşturduğunuzda oda tipinin
							maksimum kişi sayısına göre misafir varyasyonları otomatik olarak oluşturulacaktır...
						</p>
					</div>
				)}
			</div>
		</AuthenticatedLayout>
	)
}

export default Index
