import React, {useEffect, useState} from 'react'
import Button from '@/Components/Button'
import Lucide from '@/Components/Lucide'
import ShowRoomGuest from '@/Pages/Hotel/Booking/components/ShowRoomGuest'
import Tippy from '@/Components/Tippy'
import axios from 'axios'
import {CitizenProps, GuestsProps} from '@/Pages/Hotel/Booking/types/show'

interface ShowRoomGuestProps {
	totalGuests: number
	bookingRoomId: number
	citizens: CitizenProps[]
	setRoomGuests: React.Dispatch<React.SetStateAction<GuestsProps[]>>
}

interface AddGuestsProps {
	name: string
	surname: string
	birthday: string
	gender: string
	citizen_id: string
	identification_number: string
}

function ShowRoomGuestAdd(props: ShowRoomGuestProps) {
	const [roomGuests, setRoomGuests] = useState<AddGuestsProps[]>([])
	const [errors, setErrors] = useState()
	const [addGuest, setAddGuest] = useState<boolean>(false)

	const updateRoomGuests = (index: number, newGuest: AddGuestsProps): void => {
		setRoomGuests((roomGuests) => {
			const newRoomGuests = [...roomGuests]
			newRoomGuests[index] = newGuest
			return newRoomGuests
		})
	}

	const deleteRoomGuest = (index: number): void => {
		setRoomGuests((prevState) => {
			let newState = [...prevState]
			newState[index] && delete newState[index]
			newState = newState.filter((el) => el != null)
			return newState
		})
		setErrors(undefined)
	}

	useEffect(() => {
		if (addGuest) {
			if (roomGuests.length === props.totalGuests) return
			if (roomGuests.length > 0) {
				setRoomGuests(
					(roomGuests) =>
						[
							...roomGuests,
							{
								name: '',
								surname: '',
								birthday: '',
								gender: '',
								citizen_id: '',
								identification_number: '',
							},
						] as AddGuestsProps[],
				)
			} else {
				setRoomGuests([
					{
						name: '',
						surname: '',
						birthday: '',
						gender: '',
						citizen_id: '',
						identification_number: '',
					},
				] as AddGuestsProps[])
			}
			setAddGuest(false)
		}
	}, [addGuest])

	const handleSaveRoomGuests = () => {
		axios
			.post(route('hotel.bookings.booking_room.add_guest'), {booking_room_id: props.bookingRoomId, guests: roomGuests})
			.then((response: any) => {
				props.setRoomGuests(response.data)
			})
			.catch((error: any) => {
				console.log(error)
				setErrors(error.response.data.errors)
			})
	}

	return (
		<div className="flex flex-col items-center justify-between rounded-b-lg border border-x-0 bg-white py-2 dark:bg-darkmode-600">
			{roomGuests.length > 0 ? (
				<div className="flex flex-col gap-2 px-4">
					{roomGuests.map((guest, index) => (
						<ShowRoomGuest
							key={index}
							guestIndex={index}
							guest={roomGuests[index] as AddGuestsProps}
							citizens={props.citizens}
							setRoomGuests={setRoomGuests}
							updateRoomGuests={updateRoomGuests}
							deleteRoomGuest={deleteRoomGuest}
							errors={errors}
						/>
					))}
				</div>
			) : (
				<h3 className="text-center text-xs text-danger">Henüz Misafir Bilgileri Girilmemiş.</h3>
			)}
			<div className="mt-3 flex w-full items-center justify-end gap-2 border-t px-4 pt-2">
				{roomGuests.length > 0 && (
					<Tippy content="Kaydet">
						<Button
							variant="soft-secondary"
							onClick={(e: any) => {
								e.preventDefault()
								handleSaveRoomGuests()
							}}
							className="p-1 text-xs">
							Kaydet
							<Lucide
								icon="CheckCheck"
								className="ml-2 h-4 w-4 text-success"
							/>
						</Button>
					</Tippy>
				)}
				<Tippy content="Misafir Ekle">
					<Button
						variant="soft-secondary"
						disabled={roomGuests.length === props.totalGuests || false}
						onClick={(e: any) => {
							e.preventDefault()
							setAddGuest(true)
						}}
						className="p-1 text-xs">
						<Lucide
							icon="UserPlus2"
							className="h-4 w-4 dark:text-white"
						/>
					</Button>
				</Tippy>
			</div>
		</div>
	)
}

export default ShowRoomGuestAdd
