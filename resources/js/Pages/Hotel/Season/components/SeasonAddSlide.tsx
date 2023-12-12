import React, {useEffect, useRef, useState} from 'react'
import {Slideover} from '@/Components/Headless'
import Button from '@/Components/Button'
import Lucide from '@/Components/Lucide'
import {FormInput, FormLabel} from '@/Components/Form'
import Litepicker from '@/Components/Litepicker'
import dayjs from 'dayjs'
import {useForm} from '@inertiajs/react'
import {SeasonAddSlideComponentProps} from '../types/season-add-slide'
import {SeasonCalendarProps} from '../types'
import moment from 'moment'
import utc from 'dayjs/plugin/utc'
import tz from 'dayjs/plugin/timezone'
import customFormat from 'dayjs/plugin/customParseFormat'
import isBetween from 'dayjs/plugin/isBetween'
moment.locale('tr')
dayjs.extend(utc)
dayjs.extend(tz)
dayjs.extend(customFormat)
dayjs.tz.setDefault('Europe/Istanbul')
dayjs.extend(isBetween)
function SeasonAddSlide({
	setDatas,
	slideOver,
	setSlideOver,
	calendarValue,
	setCalendarValue,
	seasonsDays,
}: SeasonAddSlideComponentProps) {
	const {data, setData, post, processing, errors, reset} = useForm<SeasonCalendarProps>({
		title: '',
		description: '',
		start: '',
		end: '',
	})

	useEffect(() => {
		if (!slideOver) {
			reset()
		}
	}, [slideOver])

	useEffect(() => {
		const split = calendarValue.split(' - ')
		if (
			seasonsDays.includes(dayjs(split[0], 'DD.MM.YYYY').format('YYYY-MM-DD')) ||
			seasonsDays.includes(dayjs(split[1], 'DD.MM.YYYY').format('YYYY-MM-DD'))
		) {
			console.log('bu tarihler arasında sezon var')
		}
		setData((prevState: SeasonCalendarProps) => ({
			...prevState,
			start: split[0],
			end: split[1],
		}))
	}, [calendarValue])

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setDatas(data)
	}

	return (
		<Slideover
			size="md"
			staticBackdrop
			open={slideOver}
			onClose={() => {
				setSlideOver(false)
			}}>
			{/* BEGIN: Slide Over Header */}
			<Slideover.Panel>
				<form
					className="h-screen"
					onSubmit={async (e) => await handleSubmit(e)}>
					<Slideover.Title className="flex items-center justify-between">
						<h2 className="mr-auto text-base font-medium">Yeni Sezon Ekle</h2>
						<Button
							onClick={(event: React.MouseEvent) => {
								event.preventDefault()
								setSlideOver(false)
							}}
							className="ring-none border-none p-0 shadow-none focus:ring-0">
							<Lucide
								icon="X"
								className="h-8 w-8 text-slate-900 dark:text-slate-100"
							/>
						</Button>
					</Slideover.Title>
					{/* END: Slide Over Header */}
					{/* BEGIN: Slide Over Body */}
					<Slideover.Description>
						<div className="w-full overflow-hidden">
							<FormLabel htmlFor="modal-form-1">From</FormLabel>
							<Litepicker
								options={{
									singleMode: false,
									mobileFriendly: true,
									numberOfColumns: 1,
									numberOfMonths: 2,
									showWeekNumbers: true,
									lang: 'tr-TR',
									format: 'DD.MM.YYYY',
									autoApply: true,
									inlineMode: true,
									splitView: false,
									lockDaysFormat: 'YYYY-MM-DD',
									lockDays: seasonsDays,
									dropdowns: {
										minYear: dayjs().year(),
										maxYear: dayjs().add(3, 'year').year(),
										months: true,
										years: true,
									},
									tooltipText: {
										one: 'gece',
										other: 'gece',
									},
									tooltipNumber: (totalDays) => {
										return totalDays - 1
									},
								}}
								value={calendarValue}
								onChange={(date) => setCalendarValue(date)}
							/>
						</div>
						<div className="mt-3">
							<FormLabel htmlFor="season-title">Sezon Adı</FormLabel>
							<FormInput
								id="season-title"
								type="text"
								value={data.title}
								onChange={(e) => {
									setData((data: SeasonCalendarProps) => ({...data, title: e.target.value}))
								}}
								placeholder="Sezon Adı"
							/>
						</div>
						<div className="mt-3">
							<FormLabel htmlFor="season-description">Kısa Açıklama</FormLabel>
							<FormInput
								id="season-description"
								type="text"
								value={data.description}
								onChange={(e) => {
									setData((data: SeasonCalendarProps) => ({...data, description: e.target.value}))
								}}
								placeholder="Sezon Adı"
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
								setSlideOver(false)
							}}
							className="mr-1 w-20">
							Cancel
						</Button>
						<Button
							variant="primary"
							type="submit"
							className="w-20">
							Send
						</Button>
					</Slideover.Footer>
				</form>
			</Slideover.Panel>
			{/* END: Slide Over Footer */}
		</Slideover>
	)
}

export default SeasonAddSlide
