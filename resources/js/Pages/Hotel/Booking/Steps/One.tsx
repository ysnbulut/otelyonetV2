import React, {useEffect, useState, useRef} from 'react'
import dayjs from 'dayjs'
import {range} from 'lodash'
import axios from 'axios'
import {StepOneResponseProps} from '@/Pages/Hotel/Booking/types/response'
import {FormLabel} from '@/Components/Form'
import Litepicker from '@/Components/Litepicker'
import Select from 'react-select'
import Button from '@/Components/Button'
import Lucide from '@/Components/Lucide'
import {StepOneRequestProps, StepOneProps} from '@/Pages/Hotel/Booking/types/steps'
import {DateTime} from 'litepicker/dist/types/datetime'

function One(props: StepOneProps) {
	const checkOutPicker = useRef(null)
	const [childrenCount, setChildrenCount] = useState(0)
	const [chidrenAges, setChidrenAges] = useState<number[]>([])
	const [firstStepData, setFirstStepData] = useState<StepOneRequestProps>({
		check_in: dayjs().format('DD.MM.YYYY'),
		check_out: dayjs().add(1, 'day').format('DD.MM.YYYY'),
		booking_type: 'normal',
	})

	useEffect(() => {
		if (firstStepData.booking_type === 'group') {
			setFirstStepData((data) => ({check_in: data.check_in, check_out: data.check_out, booking_type: 'group'}))
			setChildrenCount(0)
		} else {
			setFirstStepData((data) => ({
				check_in: data.check_in,
				check_out: data.check_out,
				booking_type: 'normal',
				number_of_adults: data.number_of_adults || 1,
				number_of_children: data.number_of_children || 0,
				children_ages: chidrenAges,
			}))
		}
	}, [firstStepData.booking_type])

	const numberOfAdult = range(1, 10).map((item) => ({label: item, value: item}))
	const numberOfChildren = range(0, 10).map((item) => ({label: item, value: item}))

	useEffect(() => {
		setFirstStepData((data) => ({
			...data,
			children_ages: chidrenAges,
		}))
	}, [chidrenAges])

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		props.setStepOneResults(undefined)
		props.setCheckinRequired(false)
		axios
			.post<StepOneResponseProps>(route('hotel.booking_create.step.one'), firstStepData)
			.then((response) => {
				props.setStepOneResults(response.data)
				props.setStep(2)
				if (dayjs(firstStepData.check_in, 'DD.MM.YYYY').isSame(dayjs(), 'day')) {
					props.setCheckinRequired(true)
				}
				props.setCheckedRooms(undefined)
				props.setDailyPrices(undefined)
			})
			.catch((error) => {
				console.log(error)
			})
	}

	return (
		<form
			onSubmit={(e) => handleSubmit(e)}
			className="box gap-3 p-5">
			<div className="flex flex-col gap-3 lg:flex-row">
				<div className="w-full">
					<FormLabel htmlFor="check_in">Check-İn Tarihi</FormLabel>
					<Litepicker
						id="check_in"
						value={`${firstStepData.check_in} - ${firstStepData.check_out}`}
						options={{
							lang: 'tr-TR',
							singleMode: false,
							elementEnd: checkOutPicker.current,
							allowRepick: true,
							numberOfColumns: 2,
							numberOfMonths: 2,
							tooltipText: {
								one: 'gece',
								other: 'gece',
							},
							tooltipNumber: (totalDays) => {
								return totalDays - 1
							},
							format: 'DD.MM.YYYY',
							plugins: ['mobilefriendly'],
							mobileFriendly: true,
							lockDaysFormat: 'YYYY-MM-DD',
							lockDays: [dayjs().subtract(1, 'day').format('YYYY-MM-DD')],
							lockDaysFilter: (date1: DateTime | null) => {
								if (date1) {
									const date1Dayjs = dayjs(date1.toJSDate())
									return date1Dayjs.isBefore(dayjs().subtract(1, 'day'))
								}
								return false
							},
						}}
						onChange={(date: string) => {
							const dates = date.split(' - ')
							let checkIn = dates[0]
							let checkOut = dates[1]
							if (dayjs(checkIn, 'DD.MM.YYYY').isSame(dayjs(checkOut, 'DD.MM.YYYY'))) {
								checkOut = dayjs().add(1, 'day').format('DD.MM.YYYY')
							}
							setFirstStepData((data) => ({...data, check_in: checkIn, check_out: checkOut}))
							props.setStepOneResults(undefined)
						}}
					/>
				</div>
			</div>
			<div className="mt-3 flex flex-col gap-3 lg:flex-row">
				<div className="w-full lg:w-1/2">
					<FormLabel htmlFor="number_of_adults">Yetişkin Sayısı</FormLabel>
					<Select
						id="number_of_adults"
						name="number_of_adults"
						defaultValue={numberOfAdult[0]}
						onChange={(e: any, action: any) => {
							if (action.action === 'select-option') {
								e && setFirstStepData((data) => ({...data, number_of_adults: e.value}))
							} else if (action.action === 'clear') {
								setFirstStepData((data) => ({...data, number_of_adults: 1}))
							} else {
								setFirstStepData((data) => ({...data, number_of_adults: 1}))
							}
						}}
						className="remove-all my-select-container"
						classNamePrefix="my-select"
						styles={{
							input: (base) => ({
								...base,
								'input:focus': {
									boxShadow: 'none',
								},
							}),
						}}
						isClearable
						hideSelectedOptions
						options={numberOfAdult}
						placeholder="Yetişkin Sayısı Seçiniz."
					/>
				</div>
				<div className="w-full lg:w-1/2">
					<FormLabel htmlFor="number_of_children">Çocuk Sayısı</FormLabel>
					<Select
						id="number_of_children"
						name="number_of_children"
						defaultValue={numberOfChildren[0]}
						onChange={(e: any, action: any) => {
							if (action.action === 'select-option') {
								console.log(e.value)
								e && setFirstStepData((data) => ({...data, number_of_children: e.value}))
								e && setChildrenCount(e.value)
								e && setChidrenAges(new Array(e.value).fill(1))
							} else if (action.action === 'clear') {
								setFirstStepData((data) => ({...data, number_of_children: 0}))
								setChildrenCount(0)
							} else {
								setFirstStepData((data) => ({...data, number_of_children: 0}))
								setChildrenCount(0)
							}
						}}
						className="remove-all my-select-container"
						classNamePrefix="my-select"
						styles={{
							input: (base) => ({
								...base,
								'input:focus': {
									boxShadow: 'none',
								},
							}),
						}}
						isClearable
						hideSelectedOptions
						options={numberOfChildren}
						placeholder="Çocuk Sayısı Seçiniz."
					/>
				</div>
			</div>
			{childrenCount > 0 && firstStepData.booking_type !== 'group' && (
				<div className="mt-2 flex flex-col lg:items-end lg:justify-end">
					{range(1, childrenCount + 1).map((item) => (
						<div
							key={item}
							className="mt-2 w-full pl-1 first:mt-0 lg:w-1/2">
							<FormLabel htmlFor="child_age">{item}. Çocuk Yaşı</FormLabel>
							<Select
								id="child_age"
								name="child_age"
								defaultValue={{label: 1, value: 1}}
								onChange={(e: any, action: any) => {
									if (action.action === 'select-option') {
										e &&
											setChidrenAges((ages) => {
												const newAges = [...ages]
												newAges[item - 1] = e.value
												return newAges
											})
									} else if (action.action === 'clear') {
										setChidrenAges((ages) => {
											const newAges = [...ages]
											newAges[item - 1] = 1
											return newAges
										})
									} else {
										setChidrenAges((ages) => {
											const newAges = [...ages]
											newAges[item - 1] = 1
											return newAges
										})
									}
								}}
								className="remove-all my-select-container"
								classNamePrefix="my-select"
								styles={{
									input: (base) => ({
										...base,
										'input:focus': {
											boxShadow: 'none',
										},
									}),
								}}
								options={range(1, props.child_age_limit + 1).map((age) => ({label: age, value: age}))}
								placeholder="Çocuk Yaşı Seçiniz."
							/>
						</div>
					))}
				</div>
			)}
			<div className="mt-5 flex justify-end">
				<Button
					type="submit"
					variant="soft-secondary">
					Uygun Odaları Getir
					<Lucide
						icon="LayoutList"
						className="ml-2 h-5 w-5 text-success"
					/>
				</Button>
			</div>
		</form>
	)
}

export default One
