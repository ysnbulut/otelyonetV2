import React, {forwardRef, memo, useCallback, useEffect, useRef} from 'react'
import FullCalendar from '@fullcalendar/react'
import interactionPlugin from '@fullcalendar/interaction'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import multiMonthPlugin from '@fullcalendar/multimonth'
import googleCalendarPlugin from '@fullcalendar/google-calendar'
import dayjs from 'dayjs'
import moment from 'moment'
import {SeasonCalendarComponentProps} from '../types/season-calendar'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import utc from 'dayjs/plugin/utc'
import tz from 'dayjs/plugin/timezone'
import customFormat from 'dayjs/plugin/customParseFormat'
import isBetween from 'dayjs/plugin/isBetween'
import axios from 'axios'
import 'dayjs/locale/tr'
import sqids from 'sqids'

moment.locale('tr')
dayjs.extend(utc)
dayjs.extend(tz)
dayjs.extend(customFormat)
dayjs.tz.setDefault('Europe/Istanbul')
dayjs.extend(isBetween)
dayjs.locale('tr')

const SeasonsCalendar = forwardRef(function MyCalendar({seasonsCheckForChannels, setCalendarValue, setSlideOver, seasons}: SeasonCalendarComponentProps, ref: React.Ref<FullCalendar>) {
	const forwardCalendarRef = ref || useRef<FullCalendar>(null)
	const MySwal = withReactContent(Swal)
	const hashids = new sqids()
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
		<div className="relative">
			<FullCalendar
				ref={forwardCalendarRef}
				plugins={[interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin, multiMonthPlugin, googleCalendarPlugin]}
				customButtons={{
					SeasonCreateButton: {
						text: 'Sezon Oluştur',
						click(ev: MouseEvent) {
							ev.preventDefault()
							setSlideOver(true)
						},
					},
				}}
				googleCalendarApiKey="AIzaSyAGMso60hDLROBDBs5RSwgMmLTwIRwIOl8"
				initialView="dayGridYear"
				aspectRatio={1}
				weekends
				selectable
				navLinks={false}
				editable
				locale="tr"
				height="720px"
				selectMirror={true}
				dayMaxEvents={5}
				headerToolbar={{
					left: 'prevYear,nextYear today',
					center: 'title',
					right: 'SeasonCreateButton',
				}}
				buttonText={{
					today: 'Bugün',
					dayGridYear: 'Takvim',
					listYear: 'Liste',
				}}
				allDayClassNames={['hidden']}
				allDayText={'Tüm Gün'}
				initialDate={dayjs().format('YYYY-MM-DD')}
				eventSources={[
					{
						googleCalendarId: 'tr.turkish#holiday@group.v.calendar.google.com',
						className: 'holidays',
						display: 'background',
						editable: false,
					},
				]}
				events={seasons.map((season) => {
					return {
						id: season.id,
						title: season.name,
						start: season.start_date,
						end: dayjs(season.end_date, 'YYYY-MM-DD').add(1, 'day').format('YYYY-MM-DD'),
						allDay: true,
						startEditable: true,
						editable: true,
						groupId: season.uid,
						backgroundColor: season.backgroundColor,
						borderColor: season.borderColor,
						textColor: season.textColor,
						description: season.description,
						channels: season.channels,
						web: season.web,
						agency: season.agency,
						reception: season.reception,
					}
				})}
				// dateClick={(e) => console.log(e)}
				// eventDrop={(e) => console.log(e)}
				dayCellDidMount={(info) => {
					// 	if (typeof forwardCalendarRef !== 'function' && forwardCalendarRef.current !== null) {
					// 		const date = info.date
					// 		const hasEvent = forwardCalendarRef.current
					// 			.getApi()
					// 			.getEvents()
					// 			.some((event) => {
					// 				return dayjs(date).isBetween(event.start, event.end, 'day', '[)')
					// 			})
					// 		if (hasEvent) {
					// 			// info.el.append('asdasd')
					// 		}
					// 	}
				}}
				dayCellClassNames={['font-bold']}
				dayCellContent={(e) => {
					return (
						<>
							<div className="w-full bg-yellow-100/10 px-1 py-0.5 text-right text-sm">
								{e.dayNumberText} <span className="text-xs font-semibold">{!e.isMonthStart && dayjs(e.date).format('MMMM')}</span>
							</div>
						</>
					)
				}}
				eventClassNames={['text-[10px] font-normal']}
				eventContent={(e) => {
					let pricesForChannels = ''
					if (e.event.extendedProps.channels) {
						pricesForChannels += 'Kanal, '
					}
					if (e.event.extendedProps.web) {
						pricesForChannels += 'Web, '
					}
					if (e.event.extendedProps.agency) {
						pricesForChannels += 'Acente, '
					}
					if (e.event.extendedProps.reception) {
						pricesForChannels += 'Resepsiyon, '
					}
					pricesForChannels = pricesForChannels.slice(0, -2)
					return (
						<>
							<div className="h-full p-1">
								<div className="text-sm font-bold leading-[16px]">{e.event.title}</div>
								<p className="flex-wrap leading-[12px]">{e.event.extendedProps.description}</p>
								<p className="text-wrap text-right text-xs font-semibold italic leading-none">{pricesForChannels}</p>
							</div>
						</>
					)
				}}
				select={(info) => {
					requestAnimationFrame(() => {
						setCalendarValue(`${dayjs(info.startStr).format('DD.MM.YYYY')} - ${dayjs(info.endStr).subtract(1, 'day').format('DD.MM.YYYY')}`)
					})
					info.jsEvent?.target?.addEventListener(
						'contextmenu',
						(ev) => {
							console.log(ev)
							ev.preventDefault()
							setSlideOver(true)
							return false
						},
						false,
					)
				}}
				eventRemove={(info) => {
					axios
						.delete(route('hotel.seasons.destroy', info.event.id))
						.then(() => {})
						.catch(() => {
							Toast.fire({
								icon: 'error',
								title: 'Oops...',
								text: 'Bir hata oluştu!',
								toast: true,
								position: 'top-end',
								showConfirmButton: false,
								timer: 3000,
								timerProgressBar: true,
							}).then((r) => r.dismiss === Swal.DismissReason.timer && info.revert())
						})
				}}
			/>
		</div>
	)
})

export default memo(SeasonsCalendar)
