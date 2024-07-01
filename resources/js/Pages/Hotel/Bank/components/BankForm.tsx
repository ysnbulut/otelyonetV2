import React from 'react'
import {FormInput, FormLabel} from '@/Components/Form'

function BankForm(props: any) {
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
		e.preventDefault()
	}

	return (
		<form
			onSubmit={(e) => {
				handleSubmit(e)
			}}
			className="intro-y box p-5">
			<div className="flex flex-col">
				<FormLabel
					htmlFor="name"
					className="form-label flex justify-between">
					Banka Adı
				</FormLabel>
				<FormInput
					id="name"
					name="name"
					type="text"
					className="form-control"
				/>
			</div>
		</form>
	)
}

export default BankForm
