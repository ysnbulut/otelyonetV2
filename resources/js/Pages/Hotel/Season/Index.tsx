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

	return (
		<>
			<Head title="Sezon Yönetimi" />
			<h2 className="intro-y my-2 text-lg font-medium lg:my-5">Sezon Yönetimi</h2>
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
