import React, {useRef, useState} from 'react'
import Select, {SelectInstance} from 'react-select'
import Button from '@/Components/Button'
import {ViewSectionProps} from '@/Pages/Hotel/RoomType/types/view-section'
import {FormLabel} from '@/Components/Form'
import BedAndViewItem from '@/Pages/Hotel/RoomType/components/BedAndViewItem'
import {twMerge} from 'tailwind-merge'
import axios from 'axios'

function ViewsSection(props: ViewSectionProps) {
	const ref = useRef<SelectInstance>(null)
	const [viewSelect, setViewSelect] = useState<number | null>(null)
	const [views, setViews] = useState(
		props.views
			.filter((view) => !props.roomTypeViews.find((roomTypeView) => roomTypeView.id === view.id))
			.map((view) => ({value: view.id, label: view.name})),
	)
	const [roomTypeViews, setRoomTypeViews] = useState(props.roomTypeViews)
	const handleAdd = () => {
		const view = views.find((view) => view.value === viewSelect)
		setViewSelect(null)
		if (view) {
			axios
				.post(route('hotel.room_types.view_add', props.roomTypeId), {
					view_id: view.value,
				})
				.then((response) => {
					setRoomTypeViews((views) => [...views, {id: view.value, name: view.label}])
					setViews((views) =>
						views.filter((view) => !roomTypeViews.find((roomTypeView) => roomTypeView.id === view.value)),
					)
					const viewSelector = ref.current
					viewSelect && viewSelector && viewSelector.clearValue()
					viewSelect && setViewSelect(null)
				})
				.catch((error) => {
					console.log(error)
				})
		}
	}
	return (
		<div className="flex flex-col gap-4">
			<div className="col-span-1 flex items-center justify-between gap-2">
				<div className="flex-1">
					<FormLabel htmlFor="views">Manzara</FormLabel>
					<div>
						<Select
							ref={ref}
							id="views"
							name="views"
							defaultValue={viewSelect && views.find((view) => view.value === viewSelect)}
							onChange={(e: any, action: any) => {
								if (action.action === 'select-option') {
									e && setViewSelect(e.value)
								} else if (action.action === 'clear') {
									setViewSelect(null)
								} else {
									setViewSelect(null)
								}
							}}
							isDisabled={
								views.filter((view) => !roomTypeViews.find((roomTypeView) => roomTypeView.id === view.value)).length ===
								0
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
							placeholder="Manzarayı Seçiniz."
							options={views.filter((view) => !roomTypeViews.find((roomTypeView) => roomTypeView.id === view.value))}
						/>
					</div>
				</div>
				<Button
					variant="soft-dark"
					className="mt-7 px-3"
					disabled={
						views.filter((view) => !roomTypeViews.find((roomTypeView) => roomTypeView.id === view.value)).length === 0
					}
					onClick={() => handleAdd()}>
					Ekle
				</Button>
			</div>
			<fieldset className="flex flex-col gap-2 rounded-md bg-slate-200/80 p-5 shadow-inner dark:bg-darkmode-700">
				<legend className="box rounded px-2 py-1 text-xs font-medium shadow">Oda Tipi Manzaraları</legend>
				{roomTypeViews.length > 0 &&
					roomTypeViews.map((view, key) => (
						<BedAndViewItem
							key={view.id}
							roomTypeId={props.roomTypeId}
							id={view.id}
							name={view.name}
							setViews={setViews}
							setRoomTypeViews={setRoomTypeViews}
							warning_message={view.warning_message}
						/>
					))}
			</fieldset>
		</div>
	)
}

export default ViewsSection
