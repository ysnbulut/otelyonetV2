import React, {useEffect, useState} from 'react'
import {Slideover} from '@/Components/Headless'
import Button from '@/Components/Button'
import Lucide from '@/Components/Lucide'
import {FormCheck, FormInput, FormLabel} from '@/Components/Form'
import Litepicker from '@/Components/Litepicker'
import dayjs from 'dayjs'
import {SeasonAddSlideComponentProps} from '../types/season-add-slide'
import {SeasonCalendarProps} from '../types'
import moment from 'moment'
import utc from 'dayjs/plugin/utc'
import tz from 'dayjs/plugin/timezone'
import customFormat from 'dayjs/plugin/customParseFormat'
import isBetween from 'dayjs/plugin/isBetween'
import {EventApi} from '@fullcalendar/common'
import {useForm} from '@inertiajs/react'
import axios from 'axios'
import {EventChangeArg, EventClickArg} from '@fullcalendar/core'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import {random} from 'lodash'

moment.locale('tr')
dayjs.extend(utc)
dayjs.extend(tz)
dayjs.extend(customFormat)
dayjs.tz.setDefault('Europe/Istanbul')
dayjs.extend(isBetween)

function SeasonAddSlide({calendarRef, seasonsCheckForChannels, slideOver, setSlideOver, createUid, calendarValue, setCalendarValue}: SeasonAddSlideComponentProps) {
	const MySwal = withReactContent(Swal)
	const [disabledSeasonCheckbox, setDisabledSeasonCheckbox] = useState<{channels: boolean; web: boolean; reception: boolean; agency: boolean}>({
		channels: false,
		web: false,
		reception: false,
		agency: false,
	})
	const {data, setData, reset, post, put, processing, errors} = useForm<SeasonCalendarProps>({
		uid: createUid || '',
		name: '',
		description: '',
		start_date: '',
		end_date: '',
		channels: false,
		web: false,
		agency: false,
		reception: false,
	})
	const [seasonEditable, setSeasonEditable] = useState(false)

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

	const listenerFunctionEventClick = (info: EventClickArg) => {
		const seasonsCheck = seasonsCheckForChannels(info.event as unknown as EventApi, 'click')
		setData({
			uid: info.event.id || createUid,
			name: info.event.title || '',
			description: info.event.extendedProps.description || '',
			start_date: dayjs(info.event.start).format('DD.MM.YYYY'),
			end_date: dayjs(info.event.end).subtract(1, 'day').format('DD.MM.YYYY'),
			channels: info.event.extendedProps.channels,
			web: info.event.extendedProps.web,
			agency: info.event.extendedProps.agency,
			reception: info.event.extendedProps.reception,
		})
		setDisabledSeasonCheckbox({
			channels: info.event.extendedProps.channels ? false : seasonsCheck.channels,
			web: info.event.extendedProps.web ? false : seasonsCheck.web,
			reception: info.event.extendedProps.reception ? false : seasonsCheck.reception,
			agency: info.event.extendedProps.agency ? false : seasonsCheck.agency,
		})
		setSlideOver(true)
		setSeasonEditable(true)
	}

	const listenerFunctionEventChange = (info: EventChangeArg) => {
		const seasonsCheck = seasonsCheckForChannels(info.event as unknown as EventApi, 'change')
		let message = ''
		if (seasonsCheck.channels || seasonsCheck.web || seasonsCheck.reception || seasonsCheck.agency) {
			if (seasonsCheck.channels) {
				message += 'Kanal, '
			}
			if (seasonsCheck.web) {
				message += 'Web, '
			}
			if (seasonsCheck.reception) {
				message += 'Resepsiyon, '
			}
			if (seasonsCheck.agency) {
				message += 'Acente, '
			}
			info.revert()
			Toast.fire({
				icon: 'error',
				text: `${message} çakışmaktadır!`,
				toast: true,
				position: 'top-end',
				showConfirmButton: false,
				timer: 3000,
				timerProgressBar: true,
			})
				.then()
				.catch()
		} else {
			if (info.event.id == info.oldEvent.id) {
				axios
					.put(route('hotel.seasons.drop', info.event.id), {
						uid: info.event.groupId,
						start_date: info.event.startStr,
						end_date: dayjs(info.event.endStr, 'YYYY-MM-DD').subtract(1, 'day').format('YYYY-MM-DD'),
						name: info.event.title,
						description: info.event.extendedProps.description,
						channels: info.event.extendedProps.channels,
						web: info.event.extendedProps.web,
						agency: info.event.extendedProps.agency,
						reception: info.event.extendedProps.reception,
					})
					.then(() => {})
					.catch(() => {
						info.revert()
					})
			}
		}
	}

	const eventDelete = (id: string) => {
		MySwal.fire({
			title: 'Emin misiniz?',
			html: `<strong>${data.name}</strong> Sezon silinecektir. Bu işlemi geri alamazsınız!`,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Evet, sil!',
			cancelButtonText: 'Hayır, iptal et!',
		}).then((result) => {
			if (result.isConfirmed) {
				if (calendarRef.current) {
					calendarRef.current.getApi().getEventById(id)?.remove()
					setSlideOver(false)
				}
			}
		})
	}

	useEffect(() => {
		console.log('data', data)
	}, [data])

	useEffect(() => {
		if (calendarRef.current) {
			let calendarApi = calendarRef.current.getApi()

			// Event listeners
			const handleClick = (info: EventClickArg) => listenerFunctionEventClick(info)
			const handleChange = (info: EventChangeArg) => listenerFunctionEventChange(info)
			// 'eventClick' event listener'ını ekleyin
			calendarApi.on('eventClick', (info) => handleClick(info))

			calendarApi.on('eventChange', (info) => handleChange(info))

			// Component temizlendiğinde 'select' event listener'ını kaldırın
			return () => {
				calendarApi.off('eventClick', (info) => handleClick(info))
				calendarApi.off('eventChange', (info) => handleChange(info))
			}
		}
	}, [])

	useEffect(() => {
		if (calendarValue !== undefined && !seasonEditable) {
			setDisabledSeasonCheckbox({
				channels: false,
				web: false,
				reception: false,
				agency: false,
			})
			const split = calendarValue.split(' - ')
			if (typeof calendarRef !== 'function' && calendarRef.current !== null) {
				calendarRef.current
					.getApi()
					.getEvents()
					.forEach((event) => {
						if (
							dayjs(split[1], 'DD.MM.YYYY').isBetween(dayjs(event.start), dayjs(event.end).subtract(1, 'day'), 'day', '[]') ||
							dayjs(split[0], 'DD.MM.YYYY').isBetween(dayjs(event.start), dayjs(event.end).subtract(1, 'day'), 'day', '[]') ||
							dayjs(event.start).isBetween(dayjs(split[0], 'DD.MM.YYYY'), dayjs(split[1], 'DD.MM.YYYY').subtract(1, 'day'), 'day', '[]') ||
							dayjs(event.end).subtract(1, 'day').isBetween(dayjs(split[0], 'DD.MM.YYYY'), dayjs(split[1], 'DD.MM.YYYY').subtract(1, 'day'), 'day', '[]')
						) {
							setDisabledSeasonCheckbox((prevState) => ({
								channels: prevState.channels ? prevState.channels : event.extendedProps.channels,
								web: prevState.web ? prevState.web : event.extendedProps.web,
								reception: prevState.reception ? prevState.reception : event.extendedProps.reception,
								agency: prevState.agency ? prevState.agency : event.extendedProps.agency,
							}))
						}
					})
			}
		}
	}, [calendarValue, seasonEditable, calendarRef])

	useEffect(() => {
		if (!slideOver) {
			reset()
			setCalendarValue(undefined)
			setDisabledSeasonCheckbox({
				channels: false,
				web: false,
				reception: false,
				agency: false,
			})
			setSeasonEditable(false)
		}
	}, [slideOver])

	useEffect(() => {
		if (calendarValue !== undefined) {
			const split = calendarValue.split(' - ')
			setData((prevState: SeasonCalendarProps) => ({
				...prevState,
				uid: createUid,
				start_date: split[0],
				end_date: split[1],
			}))
		}
	}, [calendarValue, createUid])

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (seasonEditable) {
			put(route('hotel.seasons.update', {season: data.uid}), {
				preserveState: true,
				preserveScroll: true,
				onSuccess: () => {
					reset()
					setSlideOver(false)
					setSeasonEditable(false)
				},
			})
		} else {
			post(route('hotel.seasons.store'), {
				preserveState: true,
				preserveScroll: false,
				onSuccess: () => {
					reset()
					setSlideOver(false)
					setSeasonEditable(false)
				},
			})
		}
	}

	return (
		<Slideover
			size="lg"
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
						<div className="px-5">
							<div className="w-full">
								<FormLabel htmlFor="modal-form-1">From</FormLabel>
								<Litepicker
									options={{
										singleMode: false,
										mobileFriendly: true,
										numberOfColumns: 1,
										numberOfMonths: 2,
										showWeekNumbers: false,
										lang: 'tr-TR',
										format: 'DD.MM.YYYY',
										autoApply: true,
										inlineMode: false,
										splitView: false,
										// lockDaysFormat: 'YYYY-MM-DD',
										// lockDays: seasonsDays,
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
									value={calendarValue || dayjs().format('DD.MM.YYYY') + ' - ' + dayjs().add(1, 'day').format('DD.MM.YYYY')}
									onChange={(date) => setCalendarValue(date)}
								/>
								{errors.start_date && <div className="text-red-500">{errors.start_date}</div>}
								{errors.end_date && <div className="text-red-500">{errors.end_date}</div>}
							</div>
							<div className="mt-3">
								<FormLabel htmlFor="season-title">Sezon Adı</FormLabel>
								<FormInput
									id="season-title"
									type="text"
									value={data.name}
									onChange={(e) => {
										setData((data: SeasonCalendarProps) => ({...data, name: e.target.value}))
									}}
									placeholder="Sezon Adı"
								/>
								{errors.name && <div className="text-red-500">{errors.name}</div>}
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
								{errors.description && <div className="text-red-500">{errors.description}</div>}
							</div>
							<fieldset className="mt-3 rounded border p-2">
								<legend className="ml-3 font-semibold">Kanallar</legend>
								<FormCheck>
									<FormCheck.Input
										id="channels"
										type="checkbox"
										disabled={disabledSeasonCheckbox.channels}
										checked={data.channels}
										onChange={(e) => {
											setData((data: SeasonCalendarProps) => ({...data, channels: e.target.checked}))
										}}
									/>
									<FormCheck.Label htmlFor="channels">Channels</FormCheck.Label>
								</FormCheck>
								<FormCheck>
									<FormCheck.Input
										id="web"
										type="checkbox"
										disabled={disabledSeasonCheckbox.web}
										checked={data.web}
										onChange={(e) => {
											setData((data: SeasonCalendarProps) => ({...data, web: e.target.checked}))
										}}
									/>
									<FormCheck.Label htmlFor="web">Web</FormCheck.Label>
								</FormCheck>
								<FormCheck>
									<FormCheck.Input
										id="agency"
										type="checkbox"
										disabled={disabledSeasonCheckbox.agency}
										checked={data.agency}
										onChange={(e) => {
											setData((data: SeasonCalendarProps) => ({...data, agency: e.target.checked}))
										}}
									/>
									<FormCheck.Label htmlFor="agency">Agency</FormCheck.Label>
								</FormCheck>
								<FormCheck>
									<FormCheck.Input
										id="reception"
										type="checkbox"
										disabled={disabledSeasonCheckbox.reception}
										checked={data.reception}
										onChange={(e) => {
											setData((data: SeasonCalendarProps) => ({...data, reception: e.target.checked}))
										}}
									/>
									<FormCheck.Label htmlFor="reception">Reception</FormCheck.Label>
								</FormCheck>
							</fieldset>
							{errors.channels && <div className="text-red-500">{errors.channels}</div>}
						</div>
					</Slideover.Description>
					{/* END: Slide Over Body */}
					{/* BEGIN: Slide Over Footer */}
					<Slideover.Footer>
						<div className="flex justify-between px-4">
							{seasonEditable && (
								<Button
									variant="danger"
									type="button"
									onClick={() => eventDelete(data.uid)}
									className="mr-1">
									Sil
									<Lucide
										icon="Trash2"
										className="ml-2 h-5 w-5"
									/>
								</Button>
							)}
							<div className="flex w-full justify-end">
								<Button
									variant="outline-secondary"
									type="button"
									onClick={() => {
										setSlideOver(false)
									}}
									className="mr-1">
									Kapat
									<Lucide
										icon="X"
										className="ml-2 h-5 w-5"
									/>
								</Button>
								<Button
									disabled={processing}
									variant="primary"
									type="submit"
									className="">
									{seasonEditable ? 'Düzenle' : 'Oluştur'}
									{processing ? (
										<Lucide
											icon="Loader2"
											className="ml-2 h-5 w-5 animate-spin"
										/>
									) : (
										<Lucide
											icon="CheckCheck"
											className="ml-2 h-5 w-5"
										/>
									)}
								</Button>
							</div>
						</div>
					</Slideover.Footer>
				</form>
			</Slideover.Panel>
			{/* END: Slide Over Footer */}
		</Slideover>
	)
}

export default SeasonAddSlide
