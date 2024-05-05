import React from 'react'
import Tippy from '@/Components/Tippy'
import {Link} from '@inertiajs/react'
import route from 'ziggy-js'
import Lucide from '@/Components/Lucide'
import {twMerge} from 'tailwind-merge'
import {BookedRoomRackCardProps} from '@/Pages/Hotel/Dashboard/types'

interface BookedRoomCardProps {
	room: BookedRoomRackCardProps
}

function BookedRoomCard(props: BookedRoomCardProps) {
	return (
		<div className="intro-y col-span-12 sm:col-span-6 xl:col-span-3">
			<div className={twMerge('zoom-in box p-2 shadow-lg', props.room.alert_for_check_out && 'bg-danger/5')}>
				<div
					className={twMerge(
						'flex items-center justify-between rounded-md border-b bg-success p-2 shadow-inner dark:bg-success/60',
						props.room.alert_for_check_out && 'shadow-danger',
					)}>
					<Tippy content="Rezervasyonu Görüntüle">
						<Link href={route('hotel.bookings.show', props.room.booking_id)}>
							<Lucide
								icon="MousePointerSquareDashed"
								className={twMerge(props.room.alert_for_check_out && 'text-danger')}
							/>
						</Link>
					</Tippy>
					<h3
						className={twMerge(
							'flex items-center justify-center gap-1 text-right text-xl font-extrabold',
							props.room.alert_for_check_out && 'text-danger',
						)}>
						{props.room.name}
						{props.room.alert_for_check_out && (
							<Tippy content="Check-out Zamanı Geçmiş!">
								<Lucide
									icon="AlertTriangle"
									className="text-danger"
								/>
							</Tippy>
						)}
					</h3>
				</div>
				<div className="mt-2 rounded-md border border-slate-300">
					<div className="flex items-center justify-center rounded-t-md border-b border-slate-300 bg-slate-200 py-0.5 dark:bg-darkmode-700">
						<span className="text-xs font-bold">Konaklayan Misafirler</span>
					</div>
					{props.room.guests && props.room.guests.length > 0 ? (
						<div className="p-1">
							{props.room.guests.map((guest, index) => (
								<div
									className="text-xs"
									key={index}>
									{guest.name} {guest.surname}
								</div>
							))}
						</div>
					) : (
						<div className="p-1 text-center text-xs font-semibold text-danger">Misafir Girişi Yapılmamış.</div>
					)}
				</div>
				<div>
					<div className="flex items-center justify-between px-1">
						<span className="text-[9px]">
							<strong>Giriş : </strong>
							{props.room.check_in}
						</span>
						<span className="text-[9px]">
							<strong>Çıkış : </strong>
							{props.room.check_out}
						</span>
					</div>
				</div>
			</div>
			<div
				className={twMerge(
					'mx-2 flex items-center justify-end rounded-b-md shadow-sm' +
						' border-slate-100' +
						' dark:from-darkmode-600/90' +
						' border-t-0 text-slate-400' +
						' bg-gradient-to-t' +
						' from-white/95' +
						' from-85% p-1',
					props.room.remaining_time_bgcolor,
				)}>
				<span className="text-right text-xs font-semibold">{props.room.remaining_time_text}</span>
			</div>
		</div>
	)
}

export default BookedRoomCard
