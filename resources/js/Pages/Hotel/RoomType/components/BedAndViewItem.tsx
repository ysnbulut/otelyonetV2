import React, {useState} from 'react'
import ItemName from '@/Pages/Hotel/RoomType/components/ItemName'
import Lucide from '@/Components/Lucide'
import {ItemProps} from '@/Pages/Hotel/RoomType/types/bed-and-view-item'
import {FormInput} from '@/Components/Form'
import axios from 'axios'

function BedAndViewItem(props: ItemProps) {
	const [deleted, setDeleted] = useState(false)
	const [countEditable, setCountEditable] = useState(false)
	const [count, setCount] = useState(props.count)
	const handleDelete = () => {
		if (props.count) {
			axios
				.delete(route('hotel.room_types.bed_delete', {room_type: props.roomTypeId, bed_id: props.id}))
				.then((response) => {
					props.setRoomTypeBeds && props.setRoomTypeBeds((beds) => beds.filter((bed) => bed.id !== props.id))
					props.setBedTypes && props.setBedTypes((beds) => [...beds, {value: props.id, label: props.name}])
					setDeleted(false)
				})
				.catch((error) => {
					console.log(error)
				})
		} else {
			axios
				.delete(route('hotel.room_types.view_delete', {room_type: props.roomTypeId, view_id: props.id}))
				.then((response) => {
					props.setRoomTypeViews && props.setRoomTypeViews((views) => views.filter((view) => view.id !== props.id))
					props.setViews && props.setViews((views) => [...views, {value: props.id, label: props.name}])
					setDeleted(false)
				})
				.catch((error) => {
					console.log(error)
				})
		}
	}

	const handleEditCount = () => {
		axios
			.put(route('hotel.room_types.bed_edit', {room_type: props.roomTypeId, bed_id: props.id}), {
				count: count,
			})
			.then((response) => {
				props.setRoomTypeBeds &&
					props.setRoomTypeBeds((beds) =>
						beds.map((bed) => {
							if (bed.id === props.id) {
								if (count != null) {
									bed.count = count
								}
							}
							return bed
						}),
					)
				setCountEditable(false)
			})
			.catch((error) => {
				console.log(error)
			})
	}

	return (
		<div className="box flex items-center justify-between gap-2 rounded px-5 py-2 text-xs">
			<ItemName
				deleted={deleted}
				warning_message={props.warning_message ? props.warning_message : ''}>
				{props.count && (
					<>
						{countEditable ? (
							<div>
								<FormInput
									type="number"
									step={1}
									min={1}
									className="w-12 px-0 py-0 text-center font-extrabold"
									value={count}
									onChange={(e) => {
										setCount(parseInt(e.target.value))
									}}
								/>
							</div>
						) : (
							<span className="text-base font-extrabold">{props.count}</span>
						)}
						<span className="text-xs font-thin">adet</span>
					</>
				)}
				<span className="text-base font-semibold italic">{props.name}</span>
			</ItemName>
			{deleted || countEditable ? (
				<div className="flex items-center justify-end gap-2">
					<Lucide
						icon="Check"
						className="h-4 w-4 text-success"
						onClick={() => (countEditable ? handleEditCount() : handleDelete())}
					/>
					<Lucide
						icon="X"
						className="h-4 w-4 text-danger"
						onClick={() => (countEditable ? setCountEditable(false) : setDeleted(false))}
					/>
				</div>
			) : (
				<div className="flex items-center justify-end gap-2">
					{props.count && (
						<Lucide
							icon="PencilLine"
							className="h-4 w-4 text-primary"
							onClick={() => setCountEditable(true)}
						/>
					)}
					<Lucide
						icon="Trash2"
						className="h-4 w-4 text-danger"
						onClick={() => setDeleted(true)}
					/>
				</div>
			)}
		</div>
	)
}

export default BedAndViewItem
