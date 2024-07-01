import React, {useEffect, useRef, useState} from 'react'
import Select, {SelectInstance} from 'react-select'
import {FormInput, FormLabel, InputGroup} from '@/Components/Form'
import Button from '@/Components/Button'
import {BedSectionProps} from '@/Pages/Hotel/RoomType/types/bed-section'
import {useForm} from '@inertiajs/react'
import BedAndViewItem from '@/Pages/Hotel/RoomType/components/BedAndViewItem'
import axios from 'axios'
import {twMerge} from 'tailwind-merge'

function BedsSection(props: BedSectionProps) {
	const ref = useRef<SelectInstance>(null)
	const [bedSelect, setBedSelect] = useState<number | null>()
	const [bedTypes, setBedTypes] = useState(
		props.bedTypes
			.filter((bed) => !props.roomTypeBeds.find((roomTypeBed) => roomTypeBed.id === bed.id))
			.map((bed) => ({value: bed.id, label: bed.name})),
	)
	const [roomTypeBeds, setRoomTypeBeds] = useState(props.roomTypeBeds)
	const {data, setData, processing, errors, reset, submit} = useForm({
		count: '1',
	})

	const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const bed = bedTypes.find((bed) => bed.value === bedSelect)
		setBedSelect(null)
		if (bed) {
			axios
				.post(route('hotel.room_types.bed_add', props.roomTypeId), {
					bed_type_id: bed.value,
					count: parseInt(data.count),
				})
				.then((response) => {
					setRoomTypeBeds((beds) => [...beds, {id: bed.value, name: bed.label, count: parseInt(data.count)}])
					setBedTypes((beds) => beds.filter((bed) => !roomTypeBeds.find((roomTypeBed) => roomTypeBed.id === bed.value)))
					const bedSelector = ref.current
					bedSelect && bedSelector && bedSelector.clearValue()
					bedSelect && setBedSelect(null)
				})
				.catch((error) => {
					console.log(error)
				})
		}
	}

	return (
		<div className="flex flex-col gap-4">
			<div className="col-span-1 flex flex-row gap-2">
				<div className="flex-1">
					<FormLabel htmlFor="beds">Yatak Adı</FormLabel>
					<div>
						<Select
							ref={ref}
							id="beds"
							name="beds"
							defaultValue={bedSelect && bedTypes.find((bed) => bed.value === bedSelect)}
							onChange={(e: any, action: any) => {
								if (action.action === 'select-option') {
									e && setBedSelect(e.value)
								} else if (action.action === 'clear') {
									setBedSelect(null)
								} else {
									setBedSelect(null)
								}
							}}
							isDisabled={
								bedTypes.filter((bed) => !roomTypeBeds.find((roomTypeBed) => roomTypeBed.id === bed.value)).length === 0
							}
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
							options={bedTypes.filter((bed) => !roomTypeBeds.find((roomTypeBed) => roomTypeBed.id === bed.value))}
							placeholder="Yatak Seçiniz."
						/>
					</div>
				</div>
				<div className="max-w-32">
					<FormLabel htmlFor="count">Adet</FormLabel>
					<InputGroup className="w-full">
						<FormInput
							id="count"
							type="number"
							step={1}
							min={1}
							disabled={
								bedTypes.filter((bed) => !roomTypeBeds.find((roomTypeBed) => roomTypeBed.id === bed.value)).length === 0
							}
							className="w-full"
							value={data.count.toString()}
							onChange={(e) => {
								setData((data) => ({...data, count: e.target.value.toString()}))
							}}
						/>
						<InputGroup.Text>Adet</InputGroup.Text>
					</InputGroup>
				</div>
				<Button
					variant="soft-dark"
					type="button"
					className="mt-7 px-3"
					disabled={
						bedTypes.filter((bed) => !roomTypeBeds.find((roomTypeBed) => roomTypeBed.id === bed.value)).length === 0
					}
					onClick={(e: any) => handleAdd(e)}>
					Ekle
				</Button>
			</div>
			<fieldset
				className={twMerge(
					'flex flex-col gap-2 rounded-md  p-5 shadow-inner dark:bg-darkmode-700',
					roomTypeBeds.length > 0 ? 'bg-slate-200/80  dark:bg-darkmode-700' : 'bg-red-200/80',
				)}>
				<legend className="box rounded px-2 py-1 text-xs font-medium shadow">Oda tipindeki eklenen yataklar</legend>
				{roomTypeBeds.length > 0 ? (
					roomTypeBeds.map((bed, key) => (
						<BedAndViewItem
							key={key}
							roomTypeId={props.roomTypeId}
							id={bed.id}
							name={bed.name}
							count={bed.count}
							setRoomTypeBeds={setRoomTypeBeds}
							setBedTypes={setBedTypes}
						/>
					))
				) : (
					<div className="text-center text-sm text-red-600/60">Henüz Oda tipine yatak eklenmemiş.</div>
				)}
			</fieldset>
		</div>
	)
}

export default BedsSection
