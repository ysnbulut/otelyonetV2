import React, {useEffect, useState} from 'react'
import Button from '@/Components/Button'
import Lucide from '@/Components/Lucide'
import ShowRoomGuest from '@/Pages/Hotel/Booking/components/ShowRoomGuest'
import Tippy from '@/Components/Tippy'
import {CitizenProps, GuestsProps, PageProps} from '@/Pages/Hotel/Booking/types/show'
import {router} from '@inertiajs/react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import {FormDataConvertible} from '@inertiajs/inertia'
import {twMerge} from 'tailwind-merge'

interface ShowRoomGuestProps {
	totalGuests: number
	bookingRoomId: number
	citizens: CitizenProps[]
	pricingPolicy: string
	roomGuests: GuestsProps[]
	setRoomGuests: React.Dispatch<React.SetStateAction<GuestsProps[]>>
	roomId: number
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
	const MySwal = withReactContent(Swal)
	const [roomGuests, setRoomGuests] = useState<AddGuestsProps[]>([])
	const [errors, setErrors] = useState()
	const [addGuest, setAddGuest] = useState<boolean>(false)

	const Toast = MySwal.mixin({
		toast: true,
		position: 'top-right',
		showConfirmButton: false,
		timer: 3000,
		timerProgressBar: true,
		didOpen: (toast) => {
			toast.addEventListener('mouseenter', MySwal.stopTimer)
			toast.addEventListener('mouseleave', MySwal.resumeTimer)
		},
	})
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
			if (props.pricingPolicy === 'person_based' && roomGuests.length === props.totalGuests) return
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
		router.post(
			route('hotel.bookings.booking_room.add_guest'),
			{booking_room_id: props.bookingRoomId, guests: roomGuests as unknown as FormDataConvertible},
			{
				preserveScroll: true,
				preserveState: true,
				// @ts-ignore
				onSuccess: (response: {props: PageProps}) => {
					props.setRoomGuests((prevState) => response.props.booking.rooms.find((room) => room.id === props.roomId)?.guests ?? prevState)
					Toast.fire({
						icon: 'success',
						title: 'Misafirler başarıyla eklendi.',
					})
					setRoomGuests([])
				},
				onError: (error: any) => {
					setErrors(error.response.data.errors)
					Toast.fire({
						icon: 'error',
						title: 'Misafirler eklenirken hata oluştu.',
					})
				},
			},
		)
	}

	return (
		<div className={twMerge('flex flex-col items-center justify-between border-x-0  border-b bg-white py-2 dark:bg-darkmode-600', roomGuests.length <= 0 && 'border-t-0')}>
			{props.roomGuests.length > 0 || roomGuests.length > 0 ? (
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
				<h3 className={twMerge('w-full text-center text-xs text-danger', roomGuests.length <= 0 && 'mb-2 border-b pb-2')}>Henüz Misafir Bilgileri Girilmemiş.</h3>
			)}
			<div className={twMerge('flex w-full items-center justify-end gap-2 px-4', roomGuests.length > 0 && 'mt-2 border-t pt-2')}>
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
						disabled={(props.pricingPolicy === 'person_based' && roomGuests.length === props.totalGuests) || false}
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
