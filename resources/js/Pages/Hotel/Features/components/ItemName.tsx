import React from 'react'
import {FormInput, FormSwitch} from '@/Components/Form'
import {FeatureNameComponentProps} from '../types/feature-name'
function ItemName(props: FeatureNameComponentProps) {
	return props.edit ? (
		props.deleted ? (
			<span className="text-danger">Silmek istediğine emin misin ?</span>
		) : (
			<div className="flex gap-2">
				<FormInput
					id="featureName"
					name="name"
					type="text"
					value={props.featureName}
					onChange={(event) => props.setFeatureName(event.target.value)}
					placeholder="Olanak Adı"
				/>
				<FormSwitch className="flex flex-col items-center justify-center">
					<FormSwitch.Label
						htmlFor="isPaid"
						className="whitespace-nowrap text-xs">
						Ücretli *
					</FormSwitch.Label>
					<FormSwitch.Input
						id="isPaid"
						name="isPaid"
						type="checkbox"
						className="h-5 w-10 border-none bg-slate-400 before:ml-0.5 before:h-4 before:w-4 before:bg-white before:checked:ml-5"
						checked={props.isPaid}
						onChange={(event) => props.setIsPaid(event.target.checked)}
					/>
				</FormSwitch>
			</div>
		)
	) : (
		`${props.featureName}${props.isPaid ? '*' : ''}`
	)
}

export default ItemName
