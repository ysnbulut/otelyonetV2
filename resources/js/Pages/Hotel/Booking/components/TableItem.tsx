import React, {useEffect, useState} from 'react'
import {FormCheck} from '@/Components/Form'
import {twMerge} from 'tailwind-merge'
import Lucide from '@/Components/Lucide'

interface TableItemProps {
	index: number
	checked: boolean
	guest: {
		booking_guests_id: number
		id: number
		name: string
		surname: string
		birthday: string
		citizen: string
		citizen_id: string
		identification_number: string
		status: string
		check_in_date: string
		check_out_date: string
		check_in_kbs: boolean
		check_out_kbs: boolean
	}
	setSelectedBookingGuests: React.Dispatch<React.SetStateAction<number[]>>
}

function TableItem(props: TableItemProps) {
	const [checked, setChecked] = useState<boolean>(props.checked)
	const statusColor: {[key: string]: string} = {
		pending: 'bg-pending',
		check_in: 'bg-success',
		check_out: 'bg-slate-600',
	}

	useEffect(() => {
		setChecked(props.checked)
	}, [props.checked])

	return (
		<tr className="border-b">
			<td
				data-label="Seç"
				style={{paddingLeft: '0.75rem', paddingRight: '0.50rem'}}
				className="flex justify-center border-none text-xs font-bold">
				<FormCheck>
					<FormCheck.Input
						type="checkbox"
						id={`guest-${props.guest.id}`}
						value={props.guest.booking_guests_id}
						name={`guest-${props.guest.id}`}
						checked={checked}
						onChange={(e) => {
							setChecked(e.target.checked)
							props.setSelectedBookingGuests((prev) => {
								if (e.target.checked) {
									return [...prev, props.guest.booking_guests_id]
								}
								return prev.filter((id) => id !== props.guest.booking_guests_id)
							})
						}}
					/>
				</FormCheck>
			</td>
			<td
				data-label="Durum"
				style={{paddingLeft: '0.50rem', paddingRight: '0.50rem', textAlign: 'center'}}
				className="border-none text-xs font-bold lg:w-2">
				<span className={twMerge('rounded-full px-[7px] py-[2px] text-center text-white/60', statusColor[props.guest.status] || 'bg-primary')}>{props.index + 1}</span>
			</td>
			<td
				data-label="Ad"
				style={{paddingLeft: '0.50rem', paddingRight: '0.50rem', textAlign: 'left'}}
				className="border-none text-xs">
				{props.guest.name}
			</td>
			<td
				data-label="Soyad"
				style={{paddingLeft: '0.50rem', paddingRight: '0.50rem', textAlign: 'left'}}
				className="border-none text-xs">
				{props.guest.surname}
			</td>
			<td
				data-label="Uyruk"
				style={{paddingLeft: '0.50rem', paddingRight: '0.50rem', textAlign: 'center'}}
				className="border-none text-xs">
				{props.guest.citizen}
			</td>
			<td
				data-label="Kimlik No"
				style={{paddingLeft: '0.50rem', paddingRight: '0.50rem', textAlign: 'right'}}
				className="border-none text-xs">
				{props.guest.identification_number}
			</td>
			<td
				data-label="Kimlik No"
				style={{paddingLeft: '0.50rem', paddingRight: '0.50rem', textAlign: 'right'}}
				className="border-none text-xs">
				{props.guest.check_in_kbs ? (
					<Lucide
						icon="Check"
						className="float-right mr-1 h-4 w-4 text-success"
					/>
				) : (
					<Lucide
						icon="X"
						className="float-right mr-1 h-4 w-4 text-danger"
					/>
				)}
			</td>
		</tr>
	)
}

export default TableItem
