import React, {useEffect, useState, useRef} from 'react'
import {Link} from '@inertiajs/react'
import Lucide from '@/Components/Lucide'
import Button from '@/Components/Button'
import {ItemProps} from '../types/item'
import axios from 'axios'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'

function Item(props: ItemProps) {
	const MySwal = withReactContent(Swal)
	const [canBeDeleted, setCanBeDeleted] = useState(false)
	const refItem = useRef(null)
	const [itemHeight, setItemHeight] = useState(0)
	useEffect(() => {
		if (refItem.current) {
			// @ts-ignore
			setItemHeight(refItem.current.clientHeight)
		}
	}, [])

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
			.delete(route('hotel.room_types.destroy', props.salesUnit.id))
			.then((response) => {
				props.setSalesUnits((prevState) => {
					const newState = [...prevState]
					const index = newState.findIndex((roomType) => roomType.id === props.salesUnit.id)
					newState.splice(index, 1)
					return newState
				})
				Toast.fire({
					icon: 'success',
					title: `Oda türü ${props.salesUnit.name} başarıyla silindi`,
				})
			})
			.catch((error) => {
				setCanBeDeleted(false)
				console.log(error)
			})
	}
	return (
		<div className="intro-y box mb-3 p-5 last:mb-0">
			<div
				ref={refItem}
				className="flex flex-col items-center justify-between gap-1 md:flex-row">
				{canBeDeleted ? (
					<>
						<div className="rounded-full bg-warning/20 p-2">
							<Lucide
								icon="AlertCircle"
								className="h-8 w-8 text-danger"
							/>
						</div>
						<div className="flex flex-1 flex-col items-start justify-center">
							<h3 className="text-left text-xl font-semibold text-danger">Silmek İstediğine Emin Misin ?</h3>
							{props.salesUnit?.warning_message !== null && props.salesUnit.warning_message !== undefined && (
								<span
									className="text-xs text-danger/60"
									dangerouslySetInnerHTML={{__html: props.salesUnit.warning_message}}
								/>
							)}
						</div>
					</>
				) : (
					<div>
						<h3 className="truncate text-xl font-semibold">{props.salesUnit.name}</h3>
						<div className="mt-0.5 text-xs text-slate-500">{props.salesUnit.description}</div>
					</div>
				)}
				{canBeDeleted ? (
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
							onClick={() => setCanBeDeleted(false)}>
							<Lucide
								icon="X"
								className="h-5 w-5 text-danger"
							/>
						</Button>
					</div>
				) : (
					<div className="flex items-center justify-between gap-8 md:gap-2">
						<Link
							href={route('hotel.room_types.edit', props.salesUnit.id)}
							className="p-1">
							<Lucide
								icon="PencilLine"
								className="h-5 w-5 text-primary"
							/>
						</Link>
						<Button
							onClick={() => setCanBeDeleted(true)}
							className="border-none p-1 shadow-none focus:ring-0">
							<Lucide
								icon="Trash2"
								className="h-5 w-5 text-danger"
							/>
						</Button>
					</div>
				)}
			</div>
		</div>
	)
}

export default Item
