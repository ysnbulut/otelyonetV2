import React, {useEffect, useState} from 'react'
import {Head} from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import {FirstStepProps, PageProps} from '@/Pages/Hotel/Booking/types/create'
import {ResponseProps} from '@/Pages/Hotel/Booking/types/response'
import Litepicker from '@/Components/Litepicker'
import dayjs from 'dayjs'
import {FormInput, FormLabel} from '@/Components/Form'
import Select from 'react-select'
import {range} from 'lodash'
import Button from '@/Components/Button'
import axios from 'axios'
import Lucide from '@/Components/Lucide'
import NormalResults from '@/Pages/Hotel/Booking/components/NormalResults'
import GroupResults from '@/Pages/Hotel/Booking/components/GroupResults'

function Create(props: PageProps) {
	// const ref = useRef(null)
	const [firstStepData, setFirstStepData] = useState<FirstStepProps>({
		check_in: dayjs().format('DD.MM.YYYY'),
		check_out: dayjs().add(1, 'day').format('DD.MM.YYYY'),
		booking_type: 'normal',
	})
	const [childrenCount, setChildrenCount] = useState(0)
	const [openBooking, setOpenBooking] = useState(false)
	const [results, setResults] = useState<ResponseProps>()

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
			}))
		}
	}, [firstStepData.booking_type])

	const bookingTypes = [
		{
			label: 'Normal',
			value: 'normal',
		},
		{
			label: 'Açık Rezervasyon',
			value: 'open',
		},
		{
			label: 'Gurup Rezervasyon',
			value: 'group',
		},
	]

	const numberOfAdult = range(1, 10).map((item) => ({label: item, value: item}))
	const numberOfChildren = range(0, 10).map((item) => ({label: item, value: item}))

	const handleSubmit = (e: any) => {
		e.preventDefault()
		axios
			.post<ResponseProps>(route('hotel.bookings.create.step.one'), firstStepData)
			.then((response) => {
				setResults(response.data)
			})
			.catch((error) => {
				console.log(error)
			})
	}
	return (
		<>
			<Head title="Rezervasyon Oluştur" />
			<h2 className="intro-y mt-10 text-lg font-medium">Rezervasyon Oluştur.</h2>
			<form
				onSubmit={(e) => handleSubmit(e)}
				className="box p-5">
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
									console.log(e.value)
									e && setFirstStepData((data) => ({...data, booking_type: e.value}))
								} else if (action.action === 'clear') {
									setFirstStepData((data) => ({...data, booking_type: 'normal'}))
								} else {
									setFirstStepData((data) => ({...data, booking_type: 'normal'}))
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
							options={bookingTypes}
							placeholder="Rezervasyon Türü Seçiniz."
						/>
					</div>
				</div>
				{openBooking && (
					<div className="flex justify-end">
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
					<div className="flex gap-3">
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
									defaultValue={1}
									className="w-full"
								/>
							</div>
						))}
					</div>
				)}
				<div className="mt-5 flex justify-end">
					<Button
						type="submit"
						variant="success">
						Sonraki Adım
					</Button>
				</div>
			</form>
			{results &&
				(firstStepData.booking_type !== 'group' ? (
					<NormalResults
						currency={results.currency}
						data={results.data}
					/>
				) : (
					<GroupResults
						currency={results.currency}
						data={results.data}
					/>
				))}
		</>
	)
}

Create.layout = (page: React.ReactNode) => (
	<AuthenticatedLayout
		// header={<h2 className='font-semibold text-xl text-gray-800 leading-tight'>asdasdas</h2>}
		breadcrumb={[
			{
				href: route('hotel.dashboard.index'),
				title: 'Dashboard',
			},
			{
				href: route('hotel.bookings.index'),
				title: 'Rezervasyonlar',
			},
			{
				href: route('hotel.bookings.create'),
				title: 'Rezervasyon Oluştur',
			},
		]}
		children={page}
	/>
)

export default Create
