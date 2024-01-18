import React from 'react'
import {FormInput, FormLabel, FormTextarea} from '@/Components/Form'
import Button from '@/Components/Button'
import Lucide from '@/Components/Lucide'
import {EditItemDataProps} from '../types/edit'
import axios from 'axios'
import {useForm} from '@inertiajs/react'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'

function ItemEdit(props: EditItemDataProps) {
	const MySwal = withReactContent(Swal)
	const {data, setData, post, processing, errors, reset, setError} = useForm({
		name: props.roomView.name,
		description: props.roomView.description,
	})

	const Toast = MySwal.mixin({
		toast: true,
		position: 'top-end',
		showConfirmButton: false,
		timer: 3000,
		timerProgressBar: true,
		didOpen: (toast) => {
			toast.addEventListener('mouseenter', MySwal.stopTimer)
			toast.addEventListener('mouseleave', MySwal.resumeTimer)
		},
	})

	const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		axios
			.put(route('hotel.room_views.update', props.roomView.id), data)
			.then((response) => {
				props.setRoomViews((prevState) => {
					const newState = [...prevState]
					const index = newState.findIndex((bedType) => bedType.id === props.roomView.id)
					newState[index] = {
						...newState[index],
						name: data.name,
						description: data.description,
					}
					return newState
				})
				props.setEdit(false)
				Toast.fire({
					icon: 'success',
					title: 'Oda manzarası başarıyla güncellendi',
				})
			})
			.catch((error) => {
				setError(error.response.data.errors)
			})
	}

	return (
		<form
			id="edit-bedtype-form"
			onSubmit={(e) => handleFormSubmit(e)}>
			<div className="flex flex-col items-center gap-2 md:flex-row">
				<div className="w-full md:w-2/4">
					<FormLabel className="mb-0.5 pl-1 text-xs">Yatak Tipi Adı</FormLabel>
					<FormInput
						id="name"
						name="name"
						value={data.name}
						onChange={(event) => setData((data) => ({...data, name: event.target.value}))}
						type="text"
						placeholder="Manzara Adı"
					/>
					{errors.name && <span className="pl-1 text-xs font-thin text-danger">{errors.name}</span>}
				</div>
			</div>
			<div className="flex flex-col items-start justify-center pt-2">
				<FormLabel className="mb-0.5 pl-1 text-xs">Açıklama</FormLabel>
				<FormTextarea
					id="description"
					name="description"
					value={data.description}
					onChange={(event) => setData((data) => ({...data, description: event.target.value}))}
					placeholder="Açıklama"
				/>
				{errors.description && <span className="pl-1 text-xs font-thin text-danger">{errors.name}</span>}
			</div>
			<div className="mt-2 flex w-full items-end justify-end gap-2">
				<Button
					size="sm"
					type="button"
					onClick={() => props.setEdit(false)}
					variant="soft-secondary"
					className="px-2">
					Vazgeç
					<Lucide
						icon="X"
						className="ml-2 h-5 w-5 text-danger"
					/>
				</Button>
				<Button
					size="sm"
					type="submit"
					variant="soft-secondary"
					className="px-2">
					Kaydet
					<Lucide
						icon="CheckCheck"
						className="ml-2 h-5 w-5 text-success"
					/>
				</Button>
			</div>
		</form>
	)
}

export default ItemEdit
