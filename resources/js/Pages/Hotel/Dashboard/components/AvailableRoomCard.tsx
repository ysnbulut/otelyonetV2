import React from 'react'
import {twMerge} from 'tailwind-merge'
import {AvailableRoomRackCardProps} from '@/Pages/Hotel/Dashboard/types'

interface AvailableRoomCardProps {
	room: AvailableRoomRackCardProps
}

function AvailableRoomCard(props: AvailableRoomCardProps) {
	return (
		<div className="intro-y col-span-12 sm:col-span-6 xl:col-span-3">
			<div className="zoom-in box p-2 shadow-lg">
				<div className="flex items-center justify-end rounded-md border-b bg-slate-300 bg-gradient-to-r p-2 shadow-inner dark:bg-slate-300/60">
					{/*<Tippy content="Rezervasyonu Görüntüle">*/}
					{/*	<Link href={route('hotel.bookings.show', props.room.booking_id)}>*/}
					{/*		<Lucide icon="MousePointerSquareDashed" />*/}
					{/*	</Link>*/}
					{/*</Tippy>*/}
					<h3 className="text-right text-xl font-extrabold text-slate-700">{props.room.name}</h3>
				</div>
				<div className="z-10 mt-2 h-20 rounded-md border border-slate-300">
					{/*<div className="flex items-center justify-center rounded-t-md border-b border-slate-300 bg-slate-200 py-0.5">*/}
					{/*	<span className="text-xs font-bold">Konaklayan Misafirler</span>*/}
					{/*</div>*/}
					{/*{props.room.guests && props.room.guests.length > 0 ? (*/}
					{/*	<div className="p-1">*/}
					{/*		{props.room.guests.map((guest, index) => (*/}
					{/*			<div className="text-xs">*/}
					{/*				{guest.name} {guest.surname}*/}
					{/*			</div>*/}
					{/*		))}*/}
					{/*	</div>*/}
					{/*) : (*/}
					{/*	<div className="p-1 text-center text-xs font-semibold text-danger">Misafir Girişi Yapılmamış.</div>*/}
					{/*)}*/}
				</div>
				<div>
					{/*<div className="flex items-center justify-between px-1">*/}
					{/*	<span className="text-[9px]">*/}
					{/*		<strong>Giriş : </strong>*/}
					{/*		{props.room.check_in}*/}
					{/*	</span>*/}
					{/*	<span className="text-[9px]">*/}
					{/*		<strong>Çıkış : </strong>*/}
					{/*		{props.room.check_out}*/}
					{/*	</span>*/}
					{/*</div>*/}
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
					props.room.available_text_bgcolor,
				)}>
				<span className="text-right text-xs font-semibold">{props.room.available_text}</span>
			</div>
		</div>
	)
}

export default AvailableRoomCard
