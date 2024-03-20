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

	return (
		<>
			<Head title="Müşteriler" />
			<h2 className="intro-y mt-10 text-lg font-medium">Müşteriler</h2>
			<div className="w-full">
				<FullCalendar
					ref={calendarRef}
					plugins={[
						interactionPlugin,
						dayGridPlugin,
						timeGridPlugin,
						listPlugin,
						multiMonthPlugin,
						googleCalendarPlugin,
						resourceTimelinePlugin,
					]}
					schedulerLicenseKey="GPL-My-Project-Is-Open-Source"
					googleCalendarApiKey="AIzaSyD5Gd_5uY-E5idAlQVJUPQBCS0Re_hlLHI"
					initialView="resourceTimelineMonth"
					views={{
						resourceTimeline: {
							duration: {
								days: 45,
							},
							slotDuration: {
								hours: 24,
							},
							dayMaxEventRows: 2,
						},
					}}
					resourcesInitiallyExpanded={true}
					resourceAreaColumns={[
						{
							group: true,
							field: 'type_and_view',
							headerContent: 'Tip',
							headerClassNames: ['text-xl font-extrabold text-center w-auto'],
						},
						{
							field: 'title',
							headerContent: 'Oda',
							headerClassNames: ['text-xl font-extrabold'],
						},
					]}
					resourceAreaWidth={'150px'}
					slotLabelFormat={[
						{month: 'long', year: 'numeric'},
						{weekday: 'short'},
						{day: 'numeric'},
						{hour: undefined, hour12: false},
					]}
					slotLabelContent={(arg) => {
						switch (arg.level) {
							case 0:
								return {
									html:
										'<span class="text-xl"> ' +
										arg.date.toLocaleDateString('tr-TR', {month: 'long', year: 'numeric'}) +
										' </span>',
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
									html: `<div class="flex text-xs"><div class="border-r-2 border-slate-900 px-1">${props.check_out_time}</div><div class="px-1">${props.check_in_time}</div></div>`,
								}
						}
					}}
					slotLabelClassNames={[
						'bg-slate-300/50',
						'dark:bg-darkmode-900/50',
						'text-slate-600',
						'dark:text-darkmode-50',
					]}
					viewClassNames={['']}
					resourceGroupLabelClassNames={[
						'relative',
						'bg-slate-200',
						'dark:bg-darkmode-800',
						'text-darkmode-50',
						'text-lg',
						'font-semibold',
					]}
					resourceLabelClassNames={[
						'bg-slate-200',
						'dark:bg-darkmode-800',
						'text-darkmode-50',
						'text-lg',
						'font-semibold',
						'text-center',
					]}
					resourceLaneClassNames={['']}
					eventClassNames={['border-2', 'rounded-md', 'shadow-lg', 'my-auto']}
					resourceOrder="type_id,title"
					weekends
					selectable
					navLinks={false}
					editable={false}
					locale="tr"
					height="720px"
					selectMirror={true}
					dayMaxEvents={true}
					headerToolbar={{
						left: 'prevYear,nextYear today',
						center: 'title',
						right: '',
					}}
					buttonText={{
						today: 'Bugün',
					}}
					initialDate={dayjs().subtract(4, 'days').format('YYYY-MM-DD')}
					nowIndicator={true}
					nowIndicatorClassNames={['now-indicator']} //todo bunun classını taşı
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
					resources={props.rooms.map((room) => {
						return {
							id: room.id,
							title: room.title,
							building: room.building,
							floor: room.floor,
							type_and_view: room.type_and_view,
							type_id: room.type_id,
						}
					})}
					events={props.bookings.map((booking) => {
						return {
							id: booking.id,
							url: route('hotel.bookings.show', booking.id),
							resourceId: booking.resourceId,
							start: booking.start,
							title: booking.title,
							end: booking.end,
							backgroundColor: booking.backgroundColor,
							borderColor: booking.borderColor,
							textColor: booking.textColor,
							startEditable: false,
							resourceEditable: false,
							durationEditable: false,
							allDay: false,
						}
					})}
					// eventContent={(e) => {
					// 	return (
					// 		<>
					// 			<div className="text-center">
					// 				<div className="text-sm">{e.event.title}</div>
					// 				{e.event.extendedProps.description}
					// 			</div>
					// 		</>
					// 	)
					// }}
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
