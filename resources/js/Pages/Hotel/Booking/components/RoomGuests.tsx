import React, {useEffect, useState} from 'react'
import {RoomTypeRoomGuestsProps} from '@/Pages/Hotel/Booking/types/steps'
import {FormInput, FormLabel, FormSwitch} from '@/Components/Form'
import {GuestProps} from '@/Pages/Hotel/Booking/types/response'
import countryList from '@/json/country.json'
import Select from 'react-select'
import Litepicker from '@/Components/Litepicker'
import dayjs from 'dayjs'

interface RoomGuestsProps {
	guestIndex: number
	guest: GuestProps
	roomTypeId: number
	roomId: number | undefined
	setRoomsGuests: React.Dispatch<React.SetStateAction<RoomTypeRoomGuestsProps>>
}

const genderOptions = [
	{label: 'Bay', value: 'male'},
	{label: 'Bayan', value: 'female'},
]

function RoomGuests(props: RoomGuestsProps) {
	const countries = countryList.map((country) => ({label: country.label, value: country.value}))

	const [data, setData] = useState<GuestProps>({
		name: props.guest.name,
		surname: props.guest.surname,
		gender: props.guest.gender,
		date_of_birth: props.guest.date_of_birth,
		nationality: props.guest.nationality,
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

	useEffect(() => {
		if (parseInt(data.nationality as string) > 1001) {
			setData((data) => ({...data, is_foreign_national: true}))
		} else {
			setData((data) => ({...data, is_foreign_national: false}))
		}
	}, [data.nationality])

	return (
		<div className="grid grid-cols-12 items-center gap-2 border-b py-2">
			<div className="col-span-4">
				<FormInput
					id="name"
					name="name"
					placeholder="Adı"
					value={data.name}
					onChange={(e) => setData((data) => ({...data, name: e.target.value}))}
				/>
			</div>
			<div className="col-span-4">
				<FormInput
					id="surname"
					name="surname"
					placeholder="Soyadı"
					value={data.surname}
					onChange={(e) => setData((data) => ({...data, surname: e.target.value}))}
				/>
			</div>
			<div className="col-span-4">
				<Litepicker
					placeholder="Doğum Tarihi"
					name="date_of_birth"
					id="date_of_birth"
					value={data.date_of_birth}
					options={{
						singleMode: true,
						lang: 'tr-TR',
						dropdowns: {
							minYear: 1950,
							maxYear: null,
							months: true,
							years: true,
						},
						format: 'DD.MM.YYYY',
						mobileFriendly: true,
						showWeekNumbers: false,
						plugins: ['mobilefriendly'],
					}}
					onChange={(date) => {
						setData((data) => ({...data, date_of_birth: date}))
					}}
				/>
			</div>
			<div className="col-span-3">
				<Select
					name="gender"
					options={genderOptions}
					placeholder="Cinsiyet"
					value={genderOptions.find((gender) => gender.value === data.gender)}
					onChange={(e: any, action: any) => {
						if (action.action === 'select-option') {
							e && setData((data) => ({...data, gender: e?.value as string}))
						}
					}}
					className="remove-all my-select-container"
					classNamePrefix="my-select"
					styles={{
						input: (base) => ({
							...base,
							'input:focus': {
								boxShadow: 'none',
							},
						}),
					}}
				/>
			</div>
			<div className="col-span-4">
				<Select
					name="nationality"
					options={countries}
					placeholder="Uyruk"
					value={countries.find((country) => country.label === data.nationality)}
					onChange={(e: any, action: any) => {
						if (action.action === 'select-option') {
							e && setData((data) => ({...data, nationality: e?.label as string}))
						}
					}}
					className="remove-all my-select-container"
					classNamePrefix="my-select"
					styles={{
						input: (base) => ({
							...base,
							'input:focus': {
								boxShadow: 'none',
							},
						}),
					}}
				/>
			</div>

			<div className="col-span-5">
				<FormInput
					id="identification_number"
					name="identification_number"
					placeholder="TC / Yabancı Kimlik No"
					value={data.identification_number}
					onChange={(e) => setData((data) => ({...data, identification_number: e.target.value}))}
				/>
			</div>
		</div>
	)
}

export default RoomGuests
