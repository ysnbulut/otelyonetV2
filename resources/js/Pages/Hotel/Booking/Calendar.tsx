import React from 'react'
import FullCalendar from '@fullcalendar/react'
import interactionPlugin from '@fullcalendar/interaction'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import multiMonthPlugin from '@fullcalendar/multimonth'
import googleCalendarPlugin from '@fullcalendar/google-calendar'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import dayjs from 'dayjs'

import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import utc from 'dayjs/plugin/utc'
import tz from 'dayjs/plugin/timezone'
import customFormat from 'dayjs/plugin/customParseFormat'
import isBetween from 'dayjs/plugin/isBetween'
import moment from 'moment'
import {PageProps} from '@/Pages/Hotel/Booking/types/calendar'
import {Head} from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/HotelAuthenticatedLayout'
import {ResourceInput} from '@fullcalendar/resource'
import Tippy from '@/Components/Tippy'
import {EventDropArg, EventSourceInput} from '@fullcalendar/core'
import axios from 'axios'

moment.locale('tr')
dayjs.extend(utc)
dayjs.extend(tz)
dayjs.extend(customFormat)
dayjs.tz.setDefault('Europe/Istanbul')
dayjs.extend(isBetween)

function Calendar(props: PageProps) {
	const calendarRef = React.useRef(null)
	const MySwal = withReactContent(Swal)

	const Toast = MySwal.mixin({
		toast: true,
		position: 'top-end',
		showConfirmButton: false,
		timer: 3000,
		timerProgressBar: true,
		didOpen: (toast) => {
			toast.addEventListener('mouseenter', MySwal.stopTimer)
			toast.addEventListener('mouseleave', MySwal.resumeTimer)
		},
	})

	const events = props.bookings.map((booking) => {
		return {
			id: booking.id,
			url: route('hotel.bookings.show', booking.id),
			resourceId: booking.resourceId,
			start: booking.start,
			title: booking.title,
			end: booking.end,
			nights: booking.nights,
			earlyCheckOut: booking.earlyCheckOut,
			backgroundColor: booking.backgroundColor,
			borderColor: booking.borderColor,
			textColor: booking.textColor,
			startEditable: false,
			durationEditable: false,
			resourceEditable: true,
			allDay: false,
			typeHasViewId: booking.typeHasViewId,
		}
	})

	const resources = props.rooms.map((room) => {
		return {
			groupId: room.type_and_view_id,
			id: room.id,
			title: room.title,
			building: room.building,
			floor: room.floor,
			type_and_view: room.type_and_view,
			type_id: room.type_and_view_id,
		}
	})

	console.log(events)

	return (
		<>
			<Head title="Müşteriler" />
			<h2 className="intro-y my-2 text-lg font-medium">Rezervasyon Takvimi</h2>
			<div className="full-calendar w-full">
				<FullCalendar
					ref={calendarRef}
					plugins={[interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin, multiMonthPlugin, googleCalendarPlugin, resourceTimelinePlugin]}
					schedulerLicenseKey="GPL-My-Project-Is-Open-Source"
					googleCalendarApiKey="AIzaSyAGMso60hDLROBDBs5RSwgMmLTwIRwIOl8"
					initialView="resourceTimelineMonth"
					views={{
						resourceTimeline: {
							duration: {
								days: 15,
							},
							slotDuration: {
								hours: 24,
							},
							// dayMaxEventRows: 2,
						},
					}}
					resourcesInitiallyExpanded={true}
					resourceAreaColumns={[
						{
							group: true,
							isMain: true,
							width: 120,
							field: 'type_and_view',
							headerContent: 'Tür',
							headerClassNames: ['text-xl font-extrabold'],
						},
						{
							group: false,
							field: 'title',
							headerContent: 'Oda',
							headerClassNames: ['text-xl font-extrabold'],
						},
					]}
					resourceAreaWidth={'12rem'}
					resourceAreaHeaderContent={'Oda Bilgileri'}
					resourceAreaHeaderClassNames={['text-lg font-semibold']}
					resourceGroupLabelContent={(arg: {groupValue: any; fieldValue: any}) => {
						return (
							<Tippy content={arg.groupValue ? arg.groupValue : arg.fieldValue}>
								{arg.groupValue !== undefined && typeof arg.groupValue === 'string'
									? arg.groupValue
											.split(' ')
											.map((word: any) => word.charAt(0))
											.join('')
									: arg.fieldValue !== undefined && typeof arg.fieldValue === 'string'
										? arg.fieldValue
												.split(' ')
												.map((word: any) => word.charAt(0))
												.join('')
										: ''}
							</Tippy>
						)
					}}
					slotLabelFormat={[{month: 'long', year: 'numeric'}, {weekday: 'short'}, {day: 'numeric'}, {hour: undefined, hour12: false}]}
					slotLabelContent={(arg) => {
						switch (arg.level) {
							case 0:
								return {
									html: '<span class="text-xl"> ' + arg.date.toLocaleDateString('tr-TR', {month: 'long', year: 'numeric'}) + ' </span>',
								}
							case 1:
								return {
									html: '<span> ' + arg.date.toLocaleDateString('tr-TR', {weekday: 'short'}) + ' </span>',
								}
							case 2:
								return {
									html: '<span> ' + arg.date.toLocaleDateString('tr-TR', {day: 'numeric'}) + ' </span>',
								}
							case 3:
								return {
									html: `<div class="flex text-xs"><div class="border-r-2 border-slate-900 px-1">${props.check_out_time}:00</div><div class="px-1">${props.check_in_time}:00</div></div>`,
								}
						}
					}}
					eventClassNames={['border-2', 'rounded-md', 'shadow-md']}
					slotEventOverlap={false}
					resourceOrder="type_id,title"
					weekends
					selectable
					navLinks={false}
					editable={false}
					locale="tr"
					height="auto"
					selectMirror={false}
					dayMaxEvents={true}
					headerToolbar={{
						left: 'prev,next today',
						center: 'title',
						right: '',
					}}
					buttonText={{
						today: 'Bugün',
					}}
					initialDate={dayjs().subtract(4, 'days').format('YYYY-MM-DD')}
					nowIndicator={true}
					nowIndicatorClassNames={['now-indicator']}
					dayCellClassNames={['zamunda']}
					dayCellContent={(e) => e.dayNumberText}
					eventSources={[
						{
							googleCalendarId: 'tr.turkish#holiday@group.v.calendar.google.com',
							className: 'holidays',
							display: 'background',
							editable: false,
						},
					]}
					resources={resources as ResourceInput}
					events={events as EventSourceInput}
					eventDrop={(info) => {
						if (info.oldEvent.extendedProps.typeHasViewId !== info.newResource?._resource.extendedProps.groupId) {
							Toast.fire({
								icon: 'error',
								title: 'Oda tipi değiştirilemez',
							})
							info.revert()
						} else {
							console.log(info)
							// axios.put(route('hotel.bookings.update', info.event.id), {
							// 	resourceId: info.newResource.id,
							// })
						}
					}}
					eventContent={(e) => {
						return (
							<>
								<Tippy content={`${e.event.title}`}>
									<div className="relative px-0.5">
										<p className="overflow-clip whitespace-nowrap text-sm">{e.event.title}</p>
										<p className="overflow-clip whitespace-nowrap text-sm">{e.event.extendedProps.nights}</p>
										{e.event.extendedProps.earlyCheckOut && (
											<Tippy
												className="absolute right-0 top-0 h-4 w-4 rounded-full border-2 border-white bg-warning text-xs text-red-500 shadow-inner"
												content={'Erken Çıkış'}
											/>
										)}
									</div>
								</Tippy>
							</>
						)
					}}
				/>
			</div>
		</>
	)
}

Calendar.layout = (page: any) => (
	<AuthenticatedLayout
		breadcrumb={[
			{
				title: 'Dashboard',
				href: route('hotel.dashboard.index'),
			},
			{
				title: 'Rezervasyonlar',
				href: route('hotel.bookings.index'),
			},
			{
				title: 'Rezervasyon Oluştur',
				href: route('hotel.booking_create'),
			},
		]}
		children={page}
	/>
)

export default Calendar
