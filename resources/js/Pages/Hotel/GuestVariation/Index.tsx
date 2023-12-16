import React, {useState} from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import {PageProps} from './types'
import {Head} from '@inertiajs/react'
import RoomTypesList from './components/RoomTypesList'
import WarningBadge from './components/WarningBadge'

function Index(props: PageProps) {
	const [warningBadge, setWarningBadge] = useState<{[key: number]: boolean}>({})
	return (
		<AuthenticatedLayout
			user={props.auth.user}
			role={props.auth.role}
			permissions={props.auth.permissions}
			pricingPolicy={props.auth.pricing_policy}>
			<Head title="Misafir Varyasyonları" />
			<h2 className="intro-y my-5 text-lg font-medium">Ünite Fiyatları</h2>
			<div className="box w-full p-10">
				{props.roomTypes.map((roomType) => (
					<div
						key={roomType.id}
						className="intro-y">
						<div className="mt-2 grid grid-cols-1 rounded border bg-slate-500/5 px-1 py-2 lg:grid-cols-2">
							<div className="flex items-end">
								<h3 className="pl-3 text-xl font-semibold text-primary dark:text-slate-400">
									{roomType.name} <span className="text-xs font-light">için misafir varyasyon ve çarpanları</span>
								</h3>
							</div>
							<WarningBadge warning={warningBadge[roomType.id]} />
						</div>
						<RoomTypesList
							roomType={roomType}
							setWarningBadge={setWarningBadge}
						/>
					</div>
				))}
			</div>
		</AuthenticatedLayout>
	)
}

export default Index
