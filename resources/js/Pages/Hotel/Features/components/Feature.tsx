import React, {useState} from 'react'
import Lucide from '@/Components/Lucide'
import {FeatureComponentProps} from '../types/feature'
import axios from 'axios'
import FeatureName from '@/Pages/Hotel/Features/components/FeatureName'

function Feature(props: FeatureComponentProps) {
	const [edit, setEdit] = useState<boolean>(false)
	const [featureName, setFeatureName] = useState<string>(props.feature.name)
	const [isPaid, setIsPaid] = useState<boolean>(props.feature.is_paid)

	const handleFeatureSubmit = () => {
		if (!props.deleted) {
			axios
				.post(route('hotel.room_type_features.update', props.feature.id), {
					name: featureName,
					is_paid: isPaid,
				})
				.then(() => {
					props.setFeatures((prevState) => {
						const newState = [...prevState]
						const index = newState.findIndex((feature) => feature.id === props.feature.id)
						newState[index] = {
							...newState[index],
							name: featureName,
							is_paid: isPaid,
						}
						return newState
					})
				})
				.catch((error) => {
					console.log(error)
				})
		} else {
			axios
				.delete(route('hotel.room_type_features.delete', props.feature.id))
				.then(() => {
					props.setDeletedFeatures((prevState) => {
						const newState = [...prevState]
						const index = newState.findIndex((feature) => feature.id === props.feature.id)
						newState.splice(index, 1)
						return newState
					})
				})
				.catch((error) => {
					console.log(error)
				})
		}
		setEdit(false)
	}

	return (
		<div
			data-id={props.feature.id}
			id="featureItem"
			className="intro-y box flex w-full select-none items-center px-2 py-2 text-base font-semibold">
			<div
				id="featureHandle"
				className="me-2 rounded-lg bg-slate-300 p-2 shadow dark:bg-darkmode-900/20">
				<Lucide
					icon="ArrowDownUp"
					className="h-4 w-4"
				/>
			</div>
			<FeatureName
				edit={edit}
				featureName={featureName}
				setFeatureName={setFeatureName}
				isPaid={isPaid}
				setIsPaid={setIsPaid}
				deleted={props.deleted}
			/>
			<Lucide
				icon={edit ? 'Check' : props.deleted ? 'Trash2' : 'Pen'}
				onClick={() => (edit ? handleFeatureSubmit() : setEdit(!edit))}
				className="ml-auto mr-2 h-5 w-5"
			/>
		</div>
	)
}

export default Feature
