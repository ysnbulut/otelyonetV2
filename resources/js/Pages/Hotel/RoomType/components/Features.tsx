import React from 'react'
import {FormCheck} from '@/Components/Form'
import {FeaturesProps} from '@/Pages/Hotel/RoomType/types/features'
import axios from 'axios'
import {ReactSortable} from 'react-sortablejs'
import Lucide from '@/Components/Lucide'

function Features(props: FeaturesProps) {
	return (
		<ReactSortable
			group="features"
			multiDrag
			list={props.features}
			setList={props.setFeatures}
			animation={500}
			delay={5}
			ghostClass="sortable-ghost-deleted"
			chosenClass="sortable-chosen-deleted"
			dragClass="sortable-drag-deleted"
			handle="#featureHandle"
			draggable="#featureItem"
			onEnd={(evt) => {
				// axios
				// 	.post(route('hotel.room_type_features.update', evt.item.dataset.id), {
				// 		old_order_no: evt.oldIndex ? evt.oldIndex + 1 : 1,
				// 		new_order_no: evt.newIndex ? evt.newIndex + 1 : 1,
				// 	})
				// 	.then(() => console.log('success'))
				// 	.catch(() => {})
			}}
			className="flex flex-wrap items-center justify-start gap-3 bg-slate-200/80 p-5 dark:bg-darkmode-700">
			{props.features.length > 0 &&
				props.features.map((feature, key) => (
					<div
						key={feature.id}
						id="featureItem"
						className="box flex gap-2 px-2 py-2">
						<FormCheck>
							<FormCheck.Input
								type="checkbox"
								name={`features[${feature.id}]`}
								value={feature.id}
								checked={props.selectedFeatures.some((item) => item.feature_id === feature.id)}
								onChange={(e) => {
									props.setSelectedFeatures((selectedFeatures) => {
										if (e.target.checked) {
											return [...selectedFeatures, {feature_id: feature.id, order_no: key + 1}]
										} else {
											return selectedFeatures.filter((item) => item.feature_id !== feature.id)
										}
									})
								}}
							/>
						</FormCheck>
						<span className="text-base font-semibold italic">{feature.name}</span>
						<div
							id="featureHandle"
							className="ms-2 rounded bg-slate-300 p-1 shadow dark:bg-darkmode-900/20">
							<Lucide
								icon="ArrowLeftRight"
								className="h-4 w-4"
							/>
						</div>
					</div>
				))}
		</ReactSortable>
	)
}

export default Features
