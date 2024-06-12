import React, {useState, useRef, useCallback} from 'react'
import {PageProps, SeasonCalendarProps, SeasonDataProps} from './types'
import moment from 'moment/moment'
import dayjs from 'dayjs'
import tz from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import isBetween from 'dayjs/plugin/isBetween'
import customFormat from 'dayjs/plugin/customParseFormat'
import {Head, useForm} from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/HotelAuthenticatedLayout'
import 'react-datepicker/dist/react-datepicker.css'
import SeasonsCalendar from '@/Pages/Hotel/Season/components/SeasonsCalendar'
import SeasonAddSlide from '@/Pages/Hotel/Season/components/SeasonAddSlide'
import FullCalendar from '@fullcalendar/react'
import {EventApi} from '@fullcalendar/common'

moment.locale('tr')
dayjs.extend(utc)
dayjs.extend(tz)
dayjs.extend(customFormat)
dayjs.tz.setDefault('Europe/Istanbul')
dayjs.extend(isBetween)

function Index(props: PageProps) {
	const calendarRef = React.useRef<FullCalendar>(null)
	const [slideOver, setSlideOver] = useState(false)
	const [calendarValue, setCalendarValue] = useState<string | undefined>()

	const seasonsCheckForChannels = useCallback(
		(season: EventApi, action: string) => {
			let channels = false
			let web = false
			let reception = false
			if (typeof calendarRef !== 'function' && calendarRef.current !== null) {
				calendarRef.current
					.getApi()
					.getEvents()
					.forEach((event) => {
						if (
							dayjs(season.start).isBetween(dayjs(event.start), dayjs(event.end), 'day', '[)') ||
							dayjs(season.end).isBetween(dayjs(event.start), dayjs(event.end), 'day', '(]') ||
							dayjs(event.start).isBetween(dayjs(season.start), dayjs(season.end), 'day', '[)') ||
							dayjs(event.end).isBetween(dayjs(season.start), dayjs(season.end), 'day', '(]')
						) {
							if (action === 'change' && season.id !== event.id) {
								channels = season.extendedProps.channels && (event.extendedProps.channels || channels)
								web = season.extendedProps.web && (event.extendedProps.web || web)
								reception = season.extendedProps.reception && (event.extendedProps.reception || reception)
							}
							if (action === 'click') {
								channels = channels || event.extendedProps.channels
								web = web || event.extendedProps.web
								reception = reception || event.extendedProps.reception
							}
						}
					})
			}
			return {channels, web, reception}
		},
		[calendarRef],
	)

	return (
		<>
			<Head title="Sezon Yönetimi" />
			<h2 className="intro-y my-2 text-lg font-medium lg:my-5">Sezon Yönetimi</h2>
			<SeasonsCalendar
				ref={calendarRef}
				seasonsCheckForChannels={seasonsCheckForChannels}
				setSlideOver={setSlideOver}
				setCalendarValue={setCalendarValue}
				seasons={props.seasons}
			/>
			{/* BEGIN: Slide Over Content */}
			<SeasonAddSlide
				calendarRef={calendarRef}
				seasonsCheckForChannels={seasonsCheckForChannels}
				slideOver={slideOver}
				setSlideOver={setSlideOver}
				calendarValue={calendarValue}
				setCalendarValue={setCalendarValue}
			/>
		</>
	)
}

Index.layout = (page: any) => (
	<AuthenticatedLayout
		breadcrumb={[
			{
				title: 'Dashboard',
				href: route('hotel.dashboard.index'),
			},
			{
				title: 'Sezonlar',
				href: route('hotel.seasons.index'),
			},
		]}>
		{page}
	</AuthenticatedLayout>
)

export default Index
