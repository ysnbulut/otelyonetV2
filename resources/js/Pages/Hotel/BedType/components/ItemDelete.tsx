import React from 'react'
import {DeleteItemDataProps} from '../types/delete'
import Button from '@/Components/Button'
import Lucide from '@/Components/Lucide'
import axios from 'axios'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
function ItemDelete(props: DeleteItemDataProps) {
	const MySwal = withReactContent(Swal)

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
	const handleDeleteButtonClicked = () => {
		axios
			.delete(route('hotel.bed_types.destroy', props.bedType.id))
			.then((response) => {
				props.setBedTypes((prevState) => {
					const newState = [...prevState]
					const index = newState.findIndex((bedType) => bedType.id === props.bedType.id)
					newState.splice(index, 1)
					return newState
				})
				Toast.fire({
					icon: 'success',
					title: `Yatak tipi ${props.bedType.name} başarıyla silindi`,
				})
			})
			.catch((error) => {
				props.setCanBeDeleted(false)
				console.log(error)
			})
	}

	return (
		<div
			className="flex flex-col items-center justify-between gap-1 md:flex-row"
			style={{minHeight: props.itemHeight}}>
			<div className="rounded-full bg-warning/20 p-2">
				<Lucide
					icon="AlertCircle"
					className="h-8 w-8 text-danger"
				/>
			</div>
			<div className="flex flex-1 flex-col items-start justify-center">
				<h3 className="text-left text-xl font-semibold text-danger">Silmek İstediğine Emin Misin ?</h3>
				{props.bedType.warning_message !== null && (
					<span
						className="text-xs text-danger/60"
						dangerouslySetInnerHTML={{__html: props.bedType.warning_message}}
					/>
				)}
			</div>
			<div className="flex items-center justify-between gap-8 md:gap-2">
				<Button
					className="border-none p-1 shadow-none focus:ring-0"
					onClick={() => handleDeleteButtonClicked()}>
					<Lucide
						icon="Check"
						className="h-5 w-5 text-success"
					/>
				</Button>
				<Button
					className="border-none p-1 shadow-none focus:ring-0"
					onClick={() => props.setCanBeDeleted(false)}>
					<Lucide
						icon="X"
						className="h-5 w-5 text-danger"
					/>
				</Button>
			</div>
		</div>
	)
}

export default ItemDelete
