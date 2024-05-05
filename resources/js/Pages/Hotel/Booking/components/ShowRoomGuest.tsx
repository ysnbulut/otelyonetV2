import React, {useEffect, useState} from 'react'
import {FormInput, FormLabel} from '@/Components/Form'
import Litepicker from '@/Components/Litepicker'
import Tippy from '@/Components/Tippy'
import Button from '@/Components/Button'
import Lucide from '@/Components/Lucide'
import {CitizenProps} from '@/Pages/Hotel/Booking/types/show'
import dayjs from 'dayjs'
interface GuestsProps {
	name: string
	surname: string
	birthday: string
	gender: string
	citizen_id: string
	identification_number: string
}
interface ShowRoomGuestProps {
	guestIndex: number
	guest: GuestsProps
	citizens: CitizenProps[]
	setRoomGuests: React.Dispatch<React.SetStateAction<GuestsProps[]>>
	updateRoomGuests: (index: number, newGuest: GuestsProps) => void
	deleteRoomGuest: (index: number) => void
	errors: any | undefined
}

function ShowRoomGuest(props: ShowRoomGuestProps) {
	const [guest, setGuest] = useState<GuestsProps>({
		name: props.guest.name || '',
		surname: props.guest.surname || '',
		birthday: props.guest.birthday || '01.01.1990',
		gender: props.guest.gender || 'male',
		citizen_id: props.guest.citizen_id || '0',
		identification_number: props.guest.identification_number || '',
	})

	useEffect(() => {
		props.updateRoomGuests(props.guestIndex, guest)
	}, [guest, props.guestIndex])

	return (
		<div className="grid grid-cols-12 items-center gap-2 py-1 pb-2 last:pb-0">
			<div className="col-span-12 flex items-center justify-between gap-1">
				<span className="flex whitespace-nowrap text-xs font-semibold">{`${props.guestIndex + 1}. Misafir`}</span>
				<hr className="mt-1 w-full border-x-0 border-b border-t-0" />
				<Tippy
					content="Misafiri Sil"
					className="mt-2">
					<Button
						variant="danger"
						className="p-0"
						onClick={(e: any) => {
							e.preventDefault()
							props.deleteRoomGuest(props.guestIndex)
							setGuest({
								name: '',
								surname: '',
								birthday: '01.01.1990',
								gender: '',
								citizen_id: '',
								identification_number: '',
							})
						}}>
						<Lucide
							icon="X"
							className="h-4 w-4"
						/>
					</Button>
				</Tippy>
			</div>
			<div className="col-span-4">
				<FormLabel
					className="mb-[1px] text-[10px] font-semibold"
					htmlFor="name">
					Adı
				</FormLabel>
				<FormInput
					id="name"
					name="name"
					placeholder="Adı"
					value={guest.name}
					className="px-1.5 py-1 text-xs"
					onChange={(e) => setGuest((data) => ({...data, name: e.target.value}))}
				/>
				{props.errors && props.errors[`guests.${props.guestIndex}.name`] && (
					<span className="mt-0 px-1 text-[9px] text-danger">{props.errors[`guests.${props.guestIndex}.name`]}</span>
				)}
			</div>
			<div className="col-span-4">
				<FormLabel
					className="mb-[1px] text-[10px] font-semibold"
					htmlFor="surname">
					Soyadı
				</FormLabel>
				<FormInput
					id="surname"
					name="surname"
					placeholder="Soyadı"
					value={guest.surname}
					className="px-1.5 py-1 text-xs"
					onChange={(e) => setGuest((data) => ({...data, surname: e.target.value}))}
				/>
				{props.errors && props.errors[`guests.${props.guestIndex}.surname`] && (
					<span className="mt-0 px-1 text-[9px] text-danger">{props.errors[`guests.${props.guestIndex}.surname`]}</span>
				)}
			</div>
			<div className="col-span-4">
				<FormLabel
					className="mb-[1px] text-[10px] font-semibold"
					htmlFor="date-of-birth">
					Doğum Tarhi
				</FormLabel>
				<Litepicker
					placeholder="Doğum Tarihi"
					name="birthday"
					id="date-of-birth"
					value={guest.birthday}
					className="px-1.5 py-1 text-xs"
					options={{
						startDate: dayjs().subtract(25, 'year').format('DD.MM.YYYY'),
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
						setGuest((data) => ({...data, birthday: date}))
					}}
				/>
				{props.errors && props.errors[`guests.${props.guestIndex}.birthday`] && (
					<span className="mt-0 px-1 text-[9px] text-danger">
						{props.errors[`guests.${props.guestIndex}.birthday`]}
					</span>
				)}
			</div>
			<div className="col-span-4">
				<FormLabel
					className="mb-[1px] text-[10px] font-semibold"
					htmlFor="gender">
					Cinsiyet
				</FormLabel>
				<select
					name="gender"
					id="gender"
					value={guest.gender === null ? 'male' : guest.gender}
					className="my-simple-select w-full"
					onChange={(e) => setGuest((data) => ({...data, gender: e.target.value as string}))}>
					<option value="male">Bay</option>
					<option value="female">Bayan</option>
				</select>
				{props.errors && props.errors[`guests.${props.guestIndex}.gender`] && (
					<span className="mt-0 px-1 text-[9px] text-danger">{props.errors[`guests.${props.guestIndex}.gender`]}</span>
				)}
			</div>
			<div className="col-span-4">
				<FormLabel
					className="mb-[1px] text-[10px] font-semibold"
					htmlFor="nationlaity">
					Uyruk
				</FormLabel>
				<select
					name="nationlaity"
					id="nationlaity"
					value={guest.citizen_id as string}
					className="my-simple-select w-full"
					onChange={(e) => setGuest((data) => ({...data, citizen_id: e.target.value as string}))}>
					{props.citizens.map((citizen) => (
						<option
							key={citizen.id}
							value={citizen.id}>
							{citizen.name}
						</option>
					))}
				</select>
				{props.errors && props.errors[`guests.${props.guestIndex}.nationlaity`] && (
					<span className="mt-0 px-1 text-[9px] text-danger">
						{props.errors[`guests.${props.guestIndex}.nationlaity`]}
					</span>
				)}
			</div>
			<div className="col-span-4">
				<FormLabel
					className="mb-[1px] text-[10px] font-semibold"
					htmlFor="identification-number">
					T.C. / Yabancı Kimlik No
				</FormLabel>
				<FormInput
					id="identification-number"
					name="identification_number"
					placeholder="TC / Yabancı Kimlik No"
					className="px-1.5 py-1 text-xs"
					value={guest.identification_number}
					onChange={(e) => setGuest((data) => ({...data, identification_number: e.target.value}))}
				/>
				{props.errors && props.errors[`guests.${props.guestIndex}.identification_number`] && (
					<span className="mt-0 px-1 text-[9px] text-danger">
						{props.errors[`guests.${props.guestIndex}.identification_number`]}
					</span>
				)}
			</div>
		</div>
	)
}

export default ShowRoomGuest
