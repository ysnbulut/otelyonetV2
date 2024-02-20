import React, {useEffect, useState} from 'react'
import {RoomTypeRoomGuestsProps} from '@/Pages/Hotel/Booking/types/steps'
import {FormInput, FormLabel, FormSwitch} from '@/Components/Form'
import {GuestProps} from '@/Pages/Hotel/Booking/types/response'

interface RoomGuestsProps {
	guestIndex: number
	guest: GuestProps
	roomTypeId: number
	roomId: number | undefined
	setRoomsGuests: React.Dispatch<React.SetStateAction<RoomTypeRoomGuestsProps>>
}

function RoomGuests(props: RoomGuestsProps) {
	const [data, setData] = useState<GuestProps>({
		name: props.guest.name,
		surname: props.guest.surname,
		identification_number: props.guest.identification_number,
		is_foreign_national: props.guest.is_foreign_national,
	})

	useEffect(() => {
		props.setRoomsGuests((prevState) => {
			// prevState'in bir kopyasını oluştur
			let newState = {...prevState}

			// Kopyada gerekli değişiklikleri yap
			if (newState[props.roomTypeId] && newState[props.roomTypeId][props.roomId as number]) {
				newState[props.roomTypeId][props.roomId as number][props.guestIndex] = data
			}

			// Kopyayı yeni state olarak ayarla
			return newState
		})
	}, [data])

	return (
		<div className="grid grid-cols-12 items-center gap-2 border-b py-2">
			<div className="col-span-3">
				<FormInput
					id="name"
					name="name"
					placeholder="Adı"
					value={data.name}
					onChange={(e) => setData((data) => ({...data, name: e.target.value}))}
				/>
			</div>
			<div className="col-span-3">
				<FormInput
					id="surname"
					name="surname"
					placeholder="Soyadı"
					value={data.surname}
					onChange={(e) => setData((data) => ({...data, surname: e.target.value}))}
				/>
			</div>
			<div className="col-span-4">
				<FormInput
					id="identification_number"
					name="identification_number"
					placeholder="TC / Yabancı Kimlik No"
					value={data.identification_number}
					onChange={(e) => setData((data) => ({...data, identification_number: e.target.value}))}
				/>
			</div>
			<div className="col-span-2">
				<FormSwitch className="h-auto">
					<FormSwitch.Input
						id="is-paid"
						type="checkbox"
						className="dark: h-6 w-10 bg-slate-300 before:bg-white before:checked:ml-4"
						name="is_paid"
						value={data.is_foreign_national ? 'true' : 'false'}
						checked={data.is_foreign_national}
						onChange={(event) => setData((data) => ({...data, is_foreign_national: event.target.checked}))}
					/>
					<FormSwitch.Label
						htmlFor="is-paid"
						className="text-[8px] font-thin">
						Yabancı Uyruk
					</FormSwitch.Label>
				</FormSwitch>
			</div>
		</div>
	)
}

export default RoomGuests
