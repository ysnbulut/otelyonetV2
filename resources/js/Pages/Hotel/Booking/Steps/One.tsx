import React, {useEffect, useState} from 'react'
import dayjs from 'dayjs'
import {range} from 'lodash'
import axios from 'axios'
import {StepOneResponseProps} from '@/Pages/Hotel/Booking/types/response'
import {FormInput, FormLabel} from '@/Components/Form'
import Litepicker from '@/Components/Litepicker'
import Select from 'react-select'
import Button from '@/Components/Button'
import Lucide from '@/Components/Lucide'
import {StepOneRequestProps, StepOneProps} from '@/Pages/Hotel/Booking/types/steps'

function One(props: StepOneProps) {
	const [openBooking, setOpenBooking] = useState(false)
	const [childrenCount, setChildrenCount] = useState(0)
	const [chidrenAges, setChidrenAges] = useState<number[]>([])
	const [firstStepData, setFirstStepData] = useState<StepOneRequestProps>({
		check_in: dayjs().format('DD.MM.YYYY'),
		check_out: dayjs().add(1, 'day').format('DD.MM.YYYY'),
		booking_type: 'normal',
	})

	const bookingTypes = [
		{
			label: 'Normal',
			value: 'normal',
		},
		{
			label: 'Açık Rezervasyon',
			value: 'open',
		},
	]

	useEffect(() => {
		if (firstStepData.booking_type === 'open') {
			setOpenBooking(true)
			setFirstStepData((data) => ({
				check_in: data.check_in,
				check_out: data.check_out,
				booking_type: 'open',
				days_open: 3,
				number_of_adults: data.number_of_adults || 1,
				number_of_children: data.number_of_children || 0,
				children_ages: chidrenAges,
			}))
		} else if (firstStepData.booking_type === 'group') {
			setOpenBooking(false)
			setFirstStepData((data) => ({check_in: data.check_in, check_out: data.check_out, booking_type: 'group'}))
			setChildrenCount(0)
		} else {
			setOpenBooking(false)
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
			})
			.catch((error) => {
				console.log(error)
			})
	}

	return (
		<form
			onSubmit={(e) => handleSubmit(e)}
			className="box gap-3 p-5">
			<div className="flex gap-3">
				<div className="w-full">
					<FormLabel htmlFor="booking_date">Rezervasyon Tarihi</FormLabel>
					<Litepicker
						id="booking_date"
						value={`${firstStepData.check_in} - ${firstStepData.check_out}`}
						options={{
							singleMode: false,
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
							mobileFriendly: true,
							highlightedDaysFormat: 'YYYY-MM-DD',
							highlightedDays: [dayjs().format('YYYY-MM-DD')],
						}}
						onChange={(date: string) => {
							const dates = date.split(' - ')
							setFirstStepData((data) => ({...data, check_in: dates[0], check_out: dates[1]}))
						}}
					/>
				</div>
				<div className="w-full">
					<FormLabel htmlFor="booking_date">Rezervasyon Türü</FormLabel>
					<Select
						id="beds"
						name="beds"
						defaultValue={bookingTypes[0]}
						onChange={(e: any, action: any) => {
							if (action.action === 'select-option') {
								e && setFirstStepData((data) => ({...data, booking_type: e.value}))
							} else if (action.action === 'clear') {
								setFirstStepData((data) => ({...data, booking_type: 'normal'}))
							} else {
								setFirstStepData((data) => ({...data, booking_type: 'normal'}))
							}
							props.setStepOneResults(undefined)
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
						options={bookingTypes}
						placeholder="Rezervasyon Türü Seçiniz."
					/>
				</div>
			</div>
			{openBooking && (
				<div className="mt-3 flex justify-end">
					<div className="w-1/2">
						<FormLabel htmlFor="max_open_day">Maximum kaç gün</FormLabel>
						<FormInput
							id="max_open_day"
							type="number"
							step={1}
							min={1}
							value={firstStepData.days_open}
							onChange={(e) => {
								setFirstStepData((data) => ({
									...data,
									days_open: parseInt(e.target.value),
								}))
							}}
							className="w-full"
						/>
					</div>
				</div>
			)}
			{firstStepData.booking_type !== 'group' && (
				<div className="mt-3 flex gap-3">
					<div className="w-full">
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
					<div className="w-full">
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
			)}
			{childrenCount > 0 && firstStepData.booking_type !== 'group' && (
				<div className="flex flex-col items-end justify-end">
					{range(1, childrenCount + 1).map((item) => (
						<div
							key={item}
							className="w-1/2 pl-1">
							<FormLabel htmlFor="child_age">Çocuk {item} Yaşı</FormLabel>
							<FormInput
								id="child_age"
								type="number"
								step={1}
								min={0}
								max={props.child_age_limit}
								defaultValue={1}
								onChange={(e) => {
									setChidrenAges((ages) => {
										const newAges = [...ages]
										newAges[item - 1] = parseInt(e.target.value)
										return newAges
									})
								}}
								className="w-full"
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
