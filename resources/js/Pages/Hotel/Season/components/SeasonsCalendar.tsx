import React, {useEffect} from 'react'
import FullCalendar from '@fullcalendar/react'
import interactionPlugin from '@fullcalendar/interaction'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import multiMonthPlugin from '@fullcalendar/multimonth'
import googleCalendarPlugin from '@fullcalendar/google-calendar'
import dayjs from 'dayjs'
import {DateSelectArg, EventAddArg} from '@fullcalendar/core'
import moment from 'moment'
import {SeasonCalendarComponentProps} from '../types/season-calendar'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import sqids from 'sqids'
import {SeasonCalendarProps, SeasonDataProps} from '../types'
import utc from 'dayjs/plugin/utc'
import tz from 'dayjs/plugin/timezone'
import customFormat from 'dayjs/plugin/customParseFormat'
import isBetween from 'dayjs/plugin/isBetween'
import axios from 'axios'

moment.locale('tr')
dayjs.extend(utc)
dayjs.extend(tz)
dayjs.extend(customFormat)
dayjs.tz.setDefault('Europe/Istanbul')
dayjs.extend(isBetween)

function SeasonsCalendar({
	data,
	setData,
	slideOver,
	setSlideOver,
	setCalendarValue,
	seasons,
	setSeasons,
}: SeasonCalendarComponentProps) {
	const hashids = new sqids()
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

	const addEvetSeasonsCalendar = (data: SeasonCalendarProps) => {
		let id: string = hashids.encode([dayjs().unix()])
		let groupId: string = hashids.encode([dayjs().unix()])
		// @ts-ignore
		calendarRef.current.getApi().addEvent({
			id: id,
			title: data.title,
			description: data.description,
			start: dayjs(data.start, 'DD.MM.YYYY').format('YYYY-MM-DD'),
			end: dayjs(data.end, 'DD.MM.YYYY').add(1, 'day').format('YYYY-MM-DD'),
			groupId: groupId,
			allDay: true,
			editable: true,
		})
	}

	useEffect(() => {
		if (data.title !== '' && slideOver) {
			addEvetSeasonsCalendar(data)
		}
	}, [data, slideOver])

	const selectRightClick = async (info: DateSelectArg) => {
		setCalendarValue(
			`${dayjs(info.startStr).format('DD.MM.YYYY')} - ${dayjs(info.endStr).subtract(1, 'day').format('DD.MM.YYYY')}`,
		)
		setSlideOver(true)
	}

	const eventAdd = async (info: EventAddArg) => {
		axios
			.post(route('hotel.seasons.store'), {
				uid: info.event.id,
				start_date: info.event.startStr,
				end_date: dayjs(info.event.endStr, 'YYYY-MM-DD').subtract(1, 'day').format('YYYY-MM-DD'),
				name: info.event.title,
				description: info.event.extendedProps.description,
			})
			.then(function (response) {
				setSlideOver(false)
				setSeasons(response.data.filter((season: SeasonDataProps) => season.uid !== info.event.id))
				setData({
					title: '',
					description: '',
					start: '',
					end: '',
				})
			})
			.catch(function (error) {
				info.event.remove()
				// console.log(error);
				MySwal.fire({
					icon: 'error',
					title: 'Oops...',
					text: 'Bir hata oluştu!',
					toast: true,
					position: 'top-end',
					showConfirmButton: false,
					timer: 3000,
					timerProgressBar: true,
				})
			})
	}

	return (
		<FullCalendar
			ref={calendarRef}
			plugins={[
				// myInteractionPlugin,
				interactionPlugin,
				dayGridPlugin,
				timeGridPlugin,
				listPlugin,
				multiMonthPlugin,
				googleCalendarPlugin,
			]}
			googleCalendarApiKey="AIzaSyD5Gd_5uY-E5idAlQVJUPQBCS0Re_hlLHI"
			initialView="dayGridYear"
			weekends
			selectable
			navLinks={false}
			editable
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
			initialDate={dayjs().format('YYYY-MM-DD')}
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
			events={seasons.map((season) => {
				return {
					id: season.id,
					title: season.name,
					start: season.start_date,
					end: dayjs(season.end_date, 'YYYY-MM-DD').add(1, 'day').format('YYYY-MM-DD'),
					allDay: true,
					editable: true,
					groupId: season.uid,
					backgroundColor: season.backgroundColor,
					borderColor: season.borderColor,
					textColor: season.textColor,
					description: season.description,
				}
			})}
			eventContent={(e) => {
				return (
					<>
						<div className="text-center">
							<div className="text-sm">{e.event.title}</div>
							{e.event.extendedProps.description}
						</div>
					</>
				)
			}}
			dateClick={(e) => console.log(e)}
			eventClick={(e) => console.log(e)}
			eventDrop={(e) => console.log(e)}
			eventAdd={(info) => eventAdd(info)}
			// dayCellDidMount={(info) => {
			// 	info.el.addEventListener(
			// 		'contextmenu',
			// 		(ev) => {
			// 			ev.preventDefault()
			// 			return false
			// 		},
			// 		false,
			// 	)
			// }}
			// eventDidMount={(info) => {
			// 	info.el.addEventListener(
			// 		'contextmenu',
			// 		(ev) => {
			// 			ev.preventDefault()
			// 			// console.log('eventDidMount', info)
			// 			return false
			// 		},
			// 		false,
			// 	)
			// }}
			select={async function (info: DateSelectArg) {
				const calendar = info.view.calendar
				const startStr = dayjs(info.start).format('YYYY-MM-DD')
				const endStr = dayjs(info.end).format('YYYY-MM-DD')
				let seasonCheck = true
				if (calendar.getEvents().length > 0) {
					for (const event of calendar.getEvents()) {
						if (event.groupId !== '') {
							if (
								dayjs(startStr).isBetween(event.startStr, dayjs(event.endStr).subtract(1, 'day')) ||
								dayjs(endStr).isBetween(event.startStr, dayjs(event.endStr).subtract(1, 'day'))
							) {
								seasonCheck = false
							}
						}
					}
				} else {
					// console.log('Event Hiç Yok')
				}
				info.jsEvent !== null &&
					info.jsEvent.srcElement !== null &&
					info.jsEvent.srcElement.addEventListener(
						'contextmenu',
						async (e) => {
							e.preventDefault()
							if (seasonCheck) {
								await selectRightClick(info)
							} else {
								Toast.fire({
									icon: 'error',
									title: 'Sezonlar çakışıyor!',
								})
							}
						},
						false,
					)
			}}
		/>
	)
}

export default SeasonsCalendar
