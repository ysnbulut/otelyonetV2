import React, {useState} from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import {PageProps} from './types'
import {Head} from '@inertiajs/react'
import SeasonList from './components/SeasonList'
import WarningBadge from './components/WarningBadge'

function Index(props: PageProps) {
	const [warningBadge, setWarningBadge] = useState<{[key: number]: boolean}>({})
	return (
		<AuthenticatedLayout
			user={props.auth.user}
			role={props.auth.role}
			permissions={props.auth.permissions}
			pricingPolicy={props.auth.pricing_policy}>
			<Head title="Misafirler" />
			<h2 className="intro-y my-5 text-lg font-medium">Ünite Fiyatları</h2>
			<div className="box w-full p-10">
				{props.roomTypesAndViews.map((roomTypeAndView) => (
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
				))}
			</div>
		</AuthenticatedLayout>
	)
}

export default Index
