import React, {useEffect, useState} from 'react'
import {FormCheck} from '@/Components/Form'
import {twMerge} from 'tailwind-merge'
import Lucide from '@/Components/Lucide'
import Tippy from '@/Components/Tippy'
import Button from '@/Components/Button'
import ShowRoomGuest from '@/Pages/Hotel/Booking/components/ShowRoomGuest'
import {CitizenProps, GuestsProps, PageProps} from '@/Pages/Hotel/Booking/types/show'
import {useAppSelector} from '@/stores/hooks'
import {selectDarkMode} from '@/stores/darkModeSlice'
import {router} from '@inertiajs/react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import dayjs from 'dayjs'

interface TableItemProps {
	index: number
	checked: boolean
	citizens: CitizenProps[]
	roomId: number
	setRoomGuests: React.Dispatch<React.SetStateAction<GuestsProps[]>>
	guest: GuestsProps
	setSelectedBookingGuests: React.Dispatch<React.SetStateAction<number[]>>
}

function TableItem(props: TableItemProps) {
	const MySwal = withReactContent(Swal)
	const darkMode = useAppSelector(selectDarkMode)
	const [edit, setEdit] = useState(false)
	const [checked, setChecked] = useState<boolean>(props.checked)
	const [errors, setErrors] = useState<Record<string, string[]> | undefined>(undefined)
	const [guest, setGuest] = useState<GuestsProps>({...props.guest, birthday: dayjs(props.guest.birthday, 'YYYY-MM-DD').format('DD.MM.YYYY')})

	const statusColor: {[key: string]: string} = {
		pending: 'bg-pending',
		check_in: 'bg-success',
		check_out: 'bg-slate-600',
	}

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

	useEffect(() => {
		setChecked(props.checked)
	}, [props.checked])

	useEffect(() => {
		console.log('guest', guest)
	}, [edit])

	const updateRoomGuests = (index: number, newGuest: GuestsProps): void => {
		props.setRoomGuests((roomGuests) => {
			const newRoomGuests = [...roomGuests]
			newRoomGuests[index] = newGuest
			return newRoomGuests
		})
		setGuest({...newGuest, birthday: dayjs(newGuest.birthday, 'DD.MM.YYYY').format('YYYY-MM-DD')})
	}

	const deleteRoomGuest = (index: number): void => {
		props.setRoomGuests((prevState) => {
			let newState = [...prevState]
			newState[index] && delete newState[index]
			newState = newState.filter((el) => el != null)
			return newState
		})
		setErrors(undefined)
	}

	const handleSaveRoomGuests = () => {
		router.put(
			route('hotel.guests.update', guest.id),
			{
				...guest,
				is_foreign_national: guest.citizen_id !== '1001',
			},
			{
				preserveScroll: true,
				preserveState: false,
				//@ts-ignore
				onSuccess: (response: {props: PageProps}) => {
					Toast.fire({
						icon: 'success',
						title: 'Misafir başarıyla güncellendi.',
					})
				},
				onError: (error: any) => {
					setErrors(error.response.data.errors)
					Toast.fire({
						icon: 'error',
						title: 'Misafir güncelenirken hata oluştu.',
					})
				},
			},
		)
	}

	const handleDeleteRoomGuest = () => {
		MySwal.fire({
			text: 'Misafiri silmek istediğinize emin misiniz?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Evet, Sil',
			confirmButtonColor: '#dc2626',
			cancelButtonText: 'Vazgeç',
		}).then((result) => {
			if (result.isConfirmed) {
				router.delete(route('hotel.booking_guests.destroy', guest.booking_guests_id), {
					preserveScroll: true,
					preserveState: false,
					//@ts-ignore
					onSuccess: (response: {props: PageProps}) => {
						Toast.fire({
							icon: 'success',
							title: 'Misafir başarıyla silindi.',
						})
					},
					onError: (error: any) => {
						Toast.fire({
							icon: 'error',
							title: 'Misafir silinirken hata oluştu.',
						})
					},
				})
			}
		})
	}

	return edit ? (
		<>
			<tr className="border-b">
				<td colSpan={8}>
					<ShowRoomGuest
						deleted={false}
						key={guest.booking_guests_id}
						guestIndex={props.index}
						guest={guest}
						citizens={props.citizens}
						updateRoomGuests={updateRoomGuests}
						deleteRoomGuest={deleteRoomGuest}
						errors={errors}
					/>
				</td>
			</tr>
			<tr className="border-b">
				<td colSpan={8}>
					<div className="flex justify-between">
						<Tippy content="Vazgeç">
							<Button
								variant="soft-secondary"
								onClick={(e: any) => {
									e.preventDefault()
									setEdit(false)
								}}
								className="p-1 text-xs">
								Vazgeç
								<Lucide
									icon="X"
									className="ml-2 h-4 w-4 text-danger"
								/>
							</Button>
						</Tippy>
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
					</div>
				</td>
			</tr>
		</>
	) : (
		<tr className="border-b">
			<td
				data-label="Seç"
				style={{paddingLeft: '0.75rem', paddingRight: '0.50rem'}}
				className="flex justify-center border-none text-xs font-bold">
				<FormCheck>
					<FormCheck.Input
						type="checkbox"
						id={`guest-${guest.id}`}
						value={guest.booking_guests_id}
						name={`guest-${guest.id}`}
						checked={checked}
						onChange={(e) => {
							setChecked(e.target.checked)
							props.setSelectedBookingGuests((prev) => {
								if (e.target.checked) {
									return [...prev, guest.booking_guests_id].filter((id): id is number => id !== undefined)
								}
								return prev.filter((id) => id !== guest.booking_guests_id)
							})
						}}
					/>
				</FormCheck>
			</td>
			<td
				data-label="Durum"
				style={{paddingLeft: '0.50rem', paddingRight: '0.50rem', textAlign: 'center'}}
				className="border-none text-xs font-bold lg:w-2">
				<span className={twMerge('rounded-full px-[7px] py-[2px] text-center text-white/60', (guest.status && statusColor[guest.status]) || 'bg-primary')}>{props.index + 1}</span>
			</td>
			<td
				data-label="Ad"
				style={{paddingLeft: '0.50rem', paddingRight: '0.50rem', textAlign: 'left'}}
				className="border-none text-xs">
				{guest.name}
			</td>
			<td
				data-label="Soyad"
				style={{paddingLeft: '0.50rem', paddingRight: '0.50rem', textAlign: 'left'}}
				className="border-none text-xs">
				{guest.surname}
			</td>
			<td
				data-label="Uyruk"
				style={{paddingLeft: '0.50rem', paddingRight: '0.50rem', textAlign: 'center'}}
				className="border-none text-xs">
				{guest.citizen}
			</td>
			<td
				data-label="Kimlik No"
				style={{paddingLeft: '0.50rem', paddingRight: '0.50rem', textAlign: 'right'}}
				className="border-none text-xs">
				{guest.identification_number}
			</td>
			<td
				data-label="KBS"
				style={{paddingLeft: '0.50rem', paddingRight: '0.50rem', textAlign: 'right'}}
				className="border-none text-xs">
				{guest.check_in_kbs ? (
					guest.check_out_kbs ? (
						<Tippy content="KBS Çıkış Bildirimi Yapıldı">
							<Lucide
								icon="CheckCheck"
								className="float-right mr-1 h-4 w-4 text-success"
							/>
						</Tippy>
					) : (
						<Tippy content="KBS Giriş Bildirimi Yapıldı">
							<Lucide
								icon="Check"
								className="float-right mr-1 h-4 w-4 text-success"
							/>
						</Tippy>
					)
				) : (
					<Tippy content="KBS Bildirimi Yapılmadı">
						<Lucide
							icon="X"
							className="float-right mr-1 h-4 w-4 text-danger"
						/>
					</Tippy>
				)}
			</td>
			<td
				data-label="Düzenle / Sil"
				style={{paddingLeft: '0.50rem', paddingRight: '0.50rem', textAlign: 'right'}}
				className="border-none text-xs">
				<div className="flex justify-end gap-2 whitespace-nowrap">
					<Button
						variant={!darkMode ? 'soft-primary' : 'soft-secondary'}
						onClick={() => setEdit(true)}
						className="p-1">
						<Lucide
							icon="PencilLine"
							className="h-3 w-3 cursor-pointer text-primary dark:text-white"
						/>
					</Button>
					<Button
						variant={!darkMode ? 'soft-danger' : 'soft-secondary'}
						onClick={() => handleDeleteRoomGuest()}
						className="p-1">
						<Lucide
							icon="Trash"
							className="h-3 w-3 cursor-pointer text-danger"
						/>
					</Button>
				</div>
			</td>
		</tr>
	)
}

export default TableItem
