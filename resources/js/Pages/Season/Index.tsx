import React, {useEffect, useRef, useState} from 'react'
import {PageProps} from '@/Pages/Season/types'
import {DateSelectArg} from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/react'
import moment from 'moment/moment'
import dayjs from 'dayjs'
import tz from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import isBetween from 'dayjs/plugin/isBetween'
import customFormat from 'dayjs/plugin/customParseFormat'
import interactionPlugin from '@fullcalendar/interaction'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import multiMonthPlugin from '@fullcalendar/multimonth'
import googleCalendarPlugin from '@fullcalendar/google-calendar'
import {Head, useForm} from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import sqids from 'sqids'
import axios from 'axios'
import {Slideover} from '@/Components/Headless'
import Button from '@/Components/Button'
import {FormInput, FormLabel} from '@/Components/Form'
import Lucide from '@/Components/Lucide'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

moment.locale('tr')
dayjs.extend(utc)
dayjs.extend(tz)
dayjs.extend(customFormat)
dayjs.tz.setDefault('Europe/Istanbul')
dayjs.extend(isBetween)

function Index(props: PageProps) {
	const MySwal = withReactContent(Swal)
	const hashids = new sqids()
	const [slideover, setSlideover] = useState(false)
	const [calendarValue, setCalendarValue] = useState<string>(dayjs().format('DD.MM.YYYY'))

	useEffect(() => {
		const expCalendarValue = calendarValue.split(' - ')
		console.log(expCalendarValue)
	}, [calendarValue])

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
	const calendarRef = useRef(null)
	const {data, setData, post, processing, errors, setError} = useForm({
		id: '',
		title: '',
		start: '',
		end: '',
		groupId: '',
		allDay: true,
		editable: true,
	})
	const addSeason = async () => {
		// @ts-ignore .getApi()
		let calendarApi = calendarRef.current && calendarRef.current.getApi()
		setData((data) => ({
			...data,
			id: hashids.encode([dayjs().unix()]),
			groupId: hashids.encode([dayjs().unix()]),
		}))
		setSlideover(true)
		// @ts-ignore
		calendarApi.addEvent(data)
	}

	return (
		<AuthenticatedLayout
			user={props.auth.user}
			role={props.auth.role}
			permissions={props.auth.permissions}
			pricingPolicy={props.auth.pricing_policy}>
			<Head title="Kullanıcılar" />
			<h2 className="intro-y mb-5 mt-10 text-lg font-medium">Kullanıcılar</h2>
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
				events={props.seasons.map((season) => {
					return {
						id: season.id,
						title: season.name,
						start: season.start_date,
						end: season.end_date,
						allDay: true,
						editable: true,
						groupId: season.uid,
						backgroundColor: season.backgroundColor,
						borderColor: season.borderColor,
						textColor: season.textColor,
						description: 'asdasdasd',
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
				eventAdd={(info) => {
					// console.log('eventAdd', info.event)
					axios
						.post(route('hotel.seasons.store'), {
							uid: info.event.id,
							start_date: info.event.startStr,
							end_date: info.event.endStr,
							name: info.event.title,
						})
						.then(function (response) {
							// console.log(response);
							info.event.setProp('id', response.data.id)
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
				}}
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
					console.log(info)
					// console.log(info.jsEvent.srcElement.classList[0]);
					// Başlangıç ve bitiş tarihlerini moment nesnelerine dönüştür
					const start = moment.utc(info.start)
					const end = moment.utc(info.end)
					const calendar = info.view.calendar
					// Tarihleri belirli bir formatta biçimlendir
					const startStr = dayjs(start.toString()).format('YYYY-MM-DD') //start.format('YYYY-MM-DD')
					const endStr = dayjs(end.toString()).format('YYYY-MM-DD') //end.format('YYYY-MM-DD')

					let seasonCheck = true
					if (calendar.getEvents().length > 0) {
						for (const event of calendar.getEvents()) {
							if (event.groupId !== '') {
								if (
									dayjs(startStr).isBetween(event.startStr, dayjs(event.endStr)) ||
									dayjs(endStr).isBetween(event.startStr, dayjs(event.endStr))
								) {
									seasonCheck = false
								}
							}
						}
					} else {
						// console.log('Event Hiç Yok')
					}
					if (seasonCheck) {
						info.jsEvent !== null &&
							info.jsEvent.srcElement !== null &&
							info.jsEvent.srcElement.addEventListener(
								'contextmenu',
								async (e) => {
									e.preventDefault()
									await addSeason()
								},
								false,
							)
					} else {
						Toast.fire({
							icon: 'error',
							title: 'Sezonlar çakışıyor!',
						})
					}
				}}
			/>
			{/* BEGIN: Slide Over Content */}
			<Slideover
				staticBackdrop
				open={slideover}
				onClose={() => {
					setSlideover(false)
				}}>
				{/* BEGIN: Slide Over Header */}
				<Slideover.Panel>
					<a
						onClick={(event: React.MouseEvent) => {
							event.preventDefault()
							setSlideover(false)
						}}
						className="absolute left-0 right-auto top-0 -ml-12 mt-4"
						href="#">
						<Lucide
							icon="X"
							className="h-8 w-8 text-slate-400"
						/>
					</a>
					<Slideover.Title>
						<h2 className="mr-auto text-base font-medium">Yeni Sezon Ekle</h2>
					</Slideover.Title>
					{/* END: Slide Over Header */}
					{/* BEGIN: Slide Over Body */}
					<Slideover.Description>
						<div>
							<FormLabel htmlFor="modal-form-1">From</FormLabel>
							{/*<DatePicker*/}
							{/*	onChange={(date) => console.log(data, date)}*/}
							{/*	startDate={dayjs(data.start).toDate()}*/}
							{/*	endDate={dayjs(data.end).toDate()}*/}
							{/*	// excludeDates={[addDays(new Date(), 1), addDays(new Date(), 5)]}*/}
							{/*	selectsRange*/}
							{/*	inline*/}
							{/*/>*/}
						</div>
						<div className="mt-3">
							<FormLabel htmlFor="modal-form-2">To</FormLabel>
							<FormInput
								id="modal-form-1"
								type="text"
								value={data.id}
								placeholder="example@gmail.com"
							/>
						</div>
						<div className="mt-3">
							<FormLabel htmlFor="modal-form-3">Subject</FormLabel>
							<FormInput
								id="modal-form-3"
								type="text"
								placeholder="Important Meeting"
								value={data.start}
							/>
						</div>
						<div className="mt-3">
							<FormLabel htmlFor="modal-form-4">Has the Words</FormLabel>
							<FormInput
								id="modal-form-4"
								type="text"
								placeholder="Job, Work, Documentation"
								value={data.end}
							/>
						</div>
						<div className="mt-3">
							<FormLabel htmlFor="modal-form-5">Doesn't Have</FormLabel>
							<FormInput
								id="modal-form-5"
								type="text"
								placeholder="Job, Work, Documentation"
							/>
						</div>
					</Slideover.Description>
					{/* END: Slide Over Body */}
					{/* BEGIN: Slide Over Footer */}
					<Slideover.Footer>
						<Button
							variant="outline-secondary"
							type="button"
							onClick={() => {
								setSlideover(false)
							}}
							className="mr-1 w-20">
							Cancel
						</Button>
						<Button
							variant="primary"
							type="button"
							className="w-20">
							Send
						</Button>
					</Slideover.Footer>
				</Slideover.Panel>
				{/* END: Slide Over Footer */}
			</Slideover>
			{/* END: Slide Over Content */}
		</AuthenticatedLayout>
	)
}

export default Index
