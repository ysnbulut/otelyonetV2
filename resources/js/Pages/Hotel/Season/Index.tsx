import React, {useEffect, useState} from 'react'
import {PageProps, SeasonCalendarProps, SeasonDataProps} from './types'
import moment from 'moment/moment'
import dayjs from 'dayjs'
import tz from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import isBetween from 'dayjs/plugin/isBetween'
import customFormat from 'dayjs/plugin/customParseFormat'
import {Head} from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/HotelAuthenticatedLayout'
import 'react-datepicker/dist/react-datepicker.css'
import SeasonsCalendar from './components/SeasonsCalendar'
import SeasonAddSlide from '@/Pages/Hotel/Season/components/SeasonAddSlide'
import {Calendar} from 'react-yearly-calendar'
moment.locale('tr')
dayjs.extend(utc)
dayjs.extend(tz)
dayjs.extend(customFormat)
dayjs.tz.setDefault('Europe/Istanbul')
dayjs.extend(isBetween)

function Index(props: PageProps) {
	const [seasons, setSeasons] = useState<SeasonDataProps[]>(props.seasons)
	const [slideOver, setSlideOver] = useState(false)
	const [seasonsDays, setSeasonsDays] = useState<string[]>([])
	const [calendarValue, setCalendarValue] = useState<string>(
		`${dayjs().format('DD.MM.YYYY')} - ${dayjs().add(2, 'day').format('DD.MM.YYYY')}`,
	)
	const [data, setData] = useState<SeasonCalendarProps>({
		title: '',
		description: '',
		start: '',
		end: '',
	})

	useEffect(() => {
		let days: string[] = []
		seasons.forEach((season) => {
			let currentDate = dayjs(season.start_date)
			let endDate = dayjs(season.end_date)

			while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
				days.push(currentDate.format('YYYY-MM-DD'))
				currentDate = currentDate.add(1, 'day')
			}
			setSeasonsDays(days)
		})
	}, [seasons])

	const onDatePicked = (date: string) => {
		console.log(date)
	}

	return (
		<>
			<Head title="Sezon Yönetimi" />
			<h2 className="intro-y my-2 text-lg font-medium lg:my-5">Sezon Yönetimi</h2>
			{/*<Calendar*/}
			{/*	year={2024}*/}
			{/*	showDaysOfWeek*/}
			{/*	showWeekSeparators*/}
			{/*	firstDayOfWeek={1}*/}
			{/*	customClasses={{*/}
			{/*		holidays: ['2024-04-25', '2024-05-01', '2024-06-02', '2024-08-15', '2024-11-01'],*/}
			{/*		spring: {*/}
			{/*			start: '2024-03-21',*/}
			{/*			end: '2024-6-20',*/}
			{/*		},*/}
			{/*		summer: {*/}
			{/*			start: '2024-06-21',*/}
			{/*			end: '2024-09-22',*/}
			{/*		},*/}
			{/*		autumn: {*/}
			{/*			start: '2024-09-23',*/}
			{/*			end: '2024-12-21',*/}
			{/*		},*/}
			{/*		weekend: 'Sat,Sun',*/}
			{/*		winter: function (day: any) {*/}
			{/*			return day.isBefore(moment([2024, 2, 21])) || day.isAfter(moment([2024, 11, 21]))*/}
			{/*		},*/}
			{/*	}}*/}
			{/*	showTodayButton*/}
			{/*	onPickDate={onDatePicked}*/}
			{/*/>*/}
			<SeasonsCalendar
				data={data}
				setData={setData}
				slideOver={slideOver}
				setSlideOver={setSlideOver}
				setCalendarValue={setCalendarValue}
				seasons={seasons}
				setSeasons={setSeasons}
				setSeasonsDays={setSeasonsDays}
			/>

			{/* BEGIN: Slide Over Content */}
			<SeasonAddSlide
				setDatas={setData}
				slideOver={slideOver}
				setSlideOver={setSlideOver}
				calendarValue={calendarValue}
				setCalendarValue={setCalendarValue}
				seasons={seasons}
				seasonsDays={seasonsDays}
				setSeasonsDays={setSeasonsDays}
			/>
			{/* END: Slide Over Content */}
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
