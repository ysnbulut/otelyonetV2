import React, {useEffect, useState} from 'react'
import {RoomTypeRoomGuestsProps} from '@/Pages/Hotel/Booking/types/steps'
import {FormInput, FormLabel} from '@/Components/Form'
import {GuestProps} from '@/Pages/Hotel/Booking/types/response'
import countryList from '@/json/country.json'
import Select from 'react-select'
import Litepicker from '@/Components/Litepicker'
import {CitizenProps} from '@/Pages/Hotel/Booking/types/show'
interface RoomGuestsProps {
	citizens: CitizenProps[]
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
	const [data, setData] = useState<GuestProps>({
		name: props.guest.name,
		surname: props.guest.surname,
		gender: props.guest.gender || genderOptions[0].value,
		birthday: props.guest.birthday,
		citizen_id: props.guest.citizen_id,
		citizen: props.guest.citizen,
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
		if (parseInt(data.citizen_id as string) > 1001) {
			setData((data) => ({...data, is_foreign_national: true}))
		} else {
			setData((data) => ({...data, is_foreign_national: false}))
		}
	}, [data.citizen_id])

	return (
		<div className="grid grid-cols-12 items-center gap-2 py-1 pb-2 last:pb-0">
			<div className="col-span-12 flex items-center justify-between gap-1">
				<span className="flex whitespace-nowrap text-xs font-semibold">{`${props.guestIndex + 1}. Misafir`}</span>
				<hr className="mt-1 w-full border-x-0 border-b border-t-0" />
			</div>
			<div className="col-span-4">
				<FormLabel
					className="mb-[1px] text-[10px] font-semibold"
					htmlFor={`name-${props.guestIndex}`}>
					Adı
				</FormLabel>
				<FormInput
					id={`name-${props.guestIndex}`}
					name="name"
					placeholder="Adı"
					value={data.name}
					className="px-1.5 py-1 text-xs"
					onChange={(e) => setData((data) => ({...data, name: e.target.value}))}
				/>
			</div>
			<div className="col-span-4">
				<FormLabel
					className="mb-[1px] text-[10px] font-semibold"
					htmlFor={`surname-${props.guestIndex}`}>
					Soyadı
				</FormLabel>
				<FormInput
					id={`surname-${props.guestIndex}`}
					name="surname"
					placeholder="Soyadı"
					value={data.surname}
					className="px-1.5 py-1 text-xs"
					onChange={(e) => setData((data) => ({...data, surname: e.target.value}))}
				/>
			</div>
			<div className="col-span-4">
				<FormLabel
					className="mb-[1px] text-[10px] font-semibold"
					htmlFor={`birthday-${props.guestIndex}`}>
					Doğum Tarhi
				</FormLabel>
				<Litepicker
					placeholder="Doğum Tarihi"
					name="birthday"
					id={`birthday-${props.guestIndex}`}
					value={data.birthday}
					className="px-1.5 py-1 text-xs"
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
						setData((data) => ({...data, birthday: date}))
					}}
				/>
			</div>
			<div className="col-span-4">
				<FormLabel
					className="mb-[1px] text-[10px] font-semibold"
					htmlFor={`gender-${props.guestIndex}`}>
					Cinsiyet
				</FormLabel>
				<select
					name="gender"
					id={`gender-${props.guestIndex}`}
					value={data.gender as string}
					className="my-simple-select w-full"
					onChange={(e) => setData((data) => ({...data, gender: e.target.value as string}))}>
					<option value="male">Bay</option>
					<option value="female">Bayan</option>
				</select>
			</div>
			<div className="col-span-4">
				<FormLabel
					className="mb-[1px] text-[10px] font-semibold"
					htmlFor={`nationlaity-${props.guestIndex}`}>
					Uyruk
				</FormLabel>
				<select
					name="nationlaity"
					id={`nationlaity-${props.guestIndex}`}
					value={data.citizen_id as string}
					className="my-simple-select w-full"
					onChange={(e) => setData((data) => ({...data, citizen_id: e.target.value as string}))}>
					{props.citizens.map((citizen) => (
						<option
							key={citizen.id}
							value={citizen.id}>
							{citizen.name}
						</option>
					))}
				</select>
			</div>
			<div className="col-span-4">
				<FormLabel
					className="mb-[1px] text-[10px] font-semibold"
					htmlFor={`identification_number-${props.guestIndex}`}>
					T.C. / Yabancı Kimlik No
				</FormLabel>
				<FormInput
					id={`identification_number-${props.guestIndex}`}
					name="identification_number"
					placeholder="TC / Yabancı Kimlik No"
					className="px-1.5 py-1 text-xs"
					value={data.identification_number}
					onChange={(e) => setData((data) => ({...data, identification_number: e.target.value}))}
				/>
			</div>
		</div>
	)
}

export default RoomGuests
