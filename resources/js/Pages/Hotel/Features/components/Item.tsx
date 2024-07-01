import React, {useState} from 'react'
import Lucide from '@/Components/Lucide'
import {FeatureComponentProps} from '../types/feature'
import axios from 'axios'
import ItemName from '@/Pages/Hotel/Features/components/ItemName'
import {twMerge} from 'tailwind-merge'

function Item(props: FeatureComponentProps) {
	const [edit, setEdit] = useState<boolean>(false)
	const [featureName, setFeatureName] = useState<string>(props.feature.name)
	const [isPaid, setIsPaid] = useState<boolean>(props.feature.is_paid)
	const [canBeDeleted, setCanBeDeleted] = useState(props.deleted)
	const handleFeatureSubmit = () => {
		if (!canBeDeleted) {
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
					if (!props.deleted && canBeDeleted) {
						props.setFeatures((prevState) => {
							const newState = [...prevState]
							const index = newState.findIndex((feature) => feature.id === props.feature.id)
							newState.splice(index, 1)
							return newState
						})
					} else {
						props.setDeletedFeatures((prevState) => {
							const newState = [...prevState]
							const index = newState.findIndex((feature) => feature.id === props.feature.id)
							newState.splice(index, 1)
							return newState
						})
					}
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
			className="box flex w-full select-none items-center px-2 py-2 text-base font-semibold">
			<div
				id="featureHandle"
				className="me-2 rounded-lg bg-slate-300 p-2 shadow dark:bg-darkmode-900/20">
				<Lucide
					icon="ArrowDownUp"
					className="h-4 w-4"
				/>
			</div>
			<ItemName
				edit={edit}
				featureName={featureName}
				setFeatureName={setFeatureName}
				isPaid={isPaid}
				setIsPaid={setIsPaid}
				deleted={canBeDeleted}
			/>
			{!edit && (
				<>
					{!props.deleted && (
						<Lucide
							icon="PenLine"
							onClick={() => setEdit(true)}
							className="ml-auto mr-2 h-5 w-5 text-primary"
						/>
					)}
					<Lucide
						icon="Trash2"
						onClick={() => {
							!props.deleted && setCanBeDeleted(true)
							setEdit(true)
						}}
						className={twMerge('mr-2 h-5 w-5 text-danger', props.deleted && 'ml-auto')}
					/>
				</>
			)}
			{edit && (
				<>
					<Lucide
						icon="Check"
						onClick={() => handleFeatureSubmit()}
						className="ml-auto mr-2 h-5 w-5 text-success"
					/>
					<Lucide
						icon="X"
						onClick={() => setEdit(false)}
						className="mr-2 h-5 w-5 text-danger"
					/>
				</>
			)}
		</div>
	)
}

export default Item
