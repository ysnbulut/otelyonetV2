import React from 'react'
import {Head, router, useForm} from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/HotelAuthenticatedLayout'
import {PageProps} from './types/edit'
import {FormInput, FormLabel, FormSelect} from '@/Components/Form'
import Button from '@/Components/Button'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Lucide from '@/Components/Lucide'
import Tippy from '@/Components/Tippy'
import LoadingIcon from '@/Components/LoadingIcon'
import Litepicker from '@/Components/Litepicker'
import Select from 'react-select'
import dayjs from 'dayjs'

function Edit(props: PageProps) {
	const MySwal = withReactContent(Swal)
	const {data, setData, put, processing, errors} = useForm({
		name: props.guest.name,
		surname: props.guest.surname,
		birthday: props.guest.birthday,
		citizen_id: props.guest.citizen_id,
		is_foreign_national: props.guest.is_foreign_national,
		gender: props.guest.gender,
		identification_number: props.guest.identification_number,
		phone: props.guest.phone,
		email: props.guest.email,
	})

	const citizens = props.citizens.map((citizen) => ({value: citizen.id, label: citizen.name}))

	const Toast = MySwal.mixin({
		toast: true,
		position: 'top-end',
		showConfirmButton: false,
		timer: 3000,
		timerProgressBar: false,
		didOpen: (toast) => {
			toast.addEventListener('mouseenter', MySwal.stopTimer)
			toast.addEventListener('mouseleave', MySwal.resumeTimer)
		},
	})

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (data.citizen_id === 1001 || data.citizen_id === 0) {
			setData((data) => ({...data, is_foreign_national: false}))
		}
		put(route('hotel.guests.update', props.guest.id), {
			preserveScroll: true,
			onSuccess: (response: any) => {
				console.log(response)
				Toast.fire({
					icon: 'success',
					title: 'Misafir başarıyla güncellendi.',
				}).then((r) => {
					console.log(r)
				})
			},
			onError: (errors: any) => {
				console.log(errors)
			},
		})
	}
	return (
		<>
			<Head title="Misafirler" />
			<div className="flex items-center justify-between">
				<h2 className="intro-y my-5 text-lg font-medium">
					Misafir: {props.guest.gender === 'male' ? 'Bay' : 'Bayan'} {props.guest.full_name}
				</h2>
				<Tippy
					as={Button}
					onClick={() => router.visit(route('hotel.guests.index'))}
					variant="soft-pending"
					className="intro-x"
					content="Geri">
					<Lucide
						icon="Undo2"
						className="h-5 w-5"
					/>
				</Tippy>
			</div>
			<form
				onSubmit={(e) => handleSubmit(e)}
				className="intro-y box col-span-12 p-5">
				<div className="flex w-full flex-col">
					<div className="flex w-full flex-col gap-2 lg:flex-row">
						<div className="input-form my-2 w-full lg:w-1/2">
							<FormLabel
								htmlFor="guest-name"
								className="flex w-full flex-nowrap justify-between gap-2 whitespace-nowrap">
								Misafir Adı
								<span className="me-2 mt-1 whitespace-pre-wrap text-right text-xs text-slate-500 sm:ml-auto sm:mt-0">
									Gerekli, Minimum 2 karakter giriniz
								</span>
							</FormLabel>
							<FormInput
								id="guest-name"
								type="text"
								placeholder="Adı"
								minLength={1}
								required={true}
								name="name"
								value={data.name}
								onChange={(e) => setData((data) => ({...data, name: e.target.value}))}
								className="w-full"
							/>
							{errors.name && <div className="text-theme-6 mt-2 text-danger">{errors.name}</div>}
						</div>
						<div className="input-form my-2 w-full lg:w-1/2">
							<FormLabel
								htmlFor="guest-surname"
								className="flex w-full flex-nowrap justify-between gap-2 whitespace-nowrap">
								Misafir Soyadı
								<span className="me-2 mt-1 whitespace-pre-wrap text-right text-xs text-slate-500 sm:ml-auto sm:mt-0">
									Required, Minimum 2 karakter giriniz
								</span>
							</FormLabel>
							<FormInput
								id="guest-surname"
								type="text"
								placeholder="Soyadı"
								minLength={1}
								required={true}
								name="surname"
								value={data.surname}
								onChange={(e) => setData((data) => ({...data, surname: e.target.value}))}
								className="w-full"
							/>
							{errors.surname && <div className="text-theme-6 mt-2 text-danger">{errors.surname}</div>}
						</div>
					</div>
					<div className="flex w-full flex-col gap-2 lg:flex-row">
						<div className="input-form my-2 w-full lg:w-1/2">
							<FormLabel
								htmlFor="guest-citizen"
								className="flex w-full flex-nowrap justify-between gap-2 whitespace-nowrap">
								Uyruk
								<span className="me-2 mt-1 whitespace-pre-wrap text-right text-xs text-slate-500 sm:ml-auto sm:mt-0">
									Gerekli, Lütfen Seçiniz
								</span>
							</FormLabel>
							<Select
								options={citizens}
								defaultValue={citizens.find((citizen) => citizen.value === data.citizen_id)}
								className="remove-all my-select-container"
								isClearable
								classNamePrefix="my-select"
								value={citizens.find((citizen) => citizen.value === data.citizen_id)}
								styles={{
									input: (base) => ({
										...base,
										'input:focus': {
											boxShadow: 'none',
										},
									}),
								}}
								onChange={(e: any, action: any) => {
									if (action.action === 'select-option') {
										e && setData((data) => ({...data, citizen_id: e.value}))
									} else if (action.action === 'clear') {
										setData((data) => ({...data, citizen_id: 0}))
									} else {
										setData((data) => ({...data, citizen_id: 0}))
									}
								}}
							/>
							{errors.citizen_id && <div className="text-theme-6 mt-2 text-danger">{errors.citizen_id}</div>}
						</div>
						<div className="input-form my-2 w-full lg:w-1/2">
							<FormLabel
								htmlFor="guest-identification-number"
								className="flex w-full flex-nowrap justify-between gap-2 whitespace-nowrap">
								Kimlik Numarası
								<span className="me-2 mt-1 whitespace-pre-wrap text-right text-xs text-slate-500 sm:ml-auto sm:mt-0">
									Gerekli, Minimum 6 karakter giriniz
								</span>
							</FormLabel>
							<FormInput
								id="guest-identification-number"
								type="text"
								placeholder="Kimlik Numarası"
								minLength={1}
								required={true}
								name="identification_number"
								value={data.identification_number}
								onChange={(e) => setData((data) => ({...data, identification_number: e.target.value}))}
								className="w-full"
							/>
							{errors.identification_number && (
								<div className="text-theme-6 mt-2 text-danger">{errors.identification_number}</div>
							)}
						</div>
					</div>
					<div className="flex w-full flex-col gap-2 lg:flex-row">
						<div className="input-form my-2 w-full lg:w-1/2">
							<FormLabel
								htmlFor="birthday"
								className="flex w-full flex-nowrap justify-between gap-2 whitespace-nowrap">
								Doğum Tarihi
								<span className="me-2 mt-1 whitespace-pre-wrap text-right text-xs text-slate-500 sm:ml-auto sm:mt-0">
									Gerekli, Lütfen Giriniz.
								</span>
							</FormLabel>
							<Litepicker
								name="birthday"
								id="birthday"
								value={dayjs(data.birthday, 'YYYY-MM-DD').format('DD.MM.YYYY')}
								options={{
									singleMode: true,
									numberOfColumns: 1,
									numberOfMonths: 1,
									format: 'DD.MM.YYYY',
									mobileFriendly: true,
									showWeekNumbers: false,
								}}
								onChange={(date) => {
									console.log(date, 'asdasdasd')
								}}
							/>
							{errors.gender && <div className="text-theme-6 mt-2 text-danger">{errors.gender}</div>}
						</div>
						<div className="input-form my-2 w-full lg:w-1/2">
							<FormLabel
								htmlFor="guest-gender"
								className="flex w-full flex-nowrap justify-between gap-2 whitespace-nowrap">
								Cinsiyet
								<span className="me-2 mt-1 whitespace-pre-wrap text-right text-xs text-slate-500 sm:ml-auto sm:mt-0">
									Gerekli, Lütfen Seçiniz.
								</span>
							</FormLabel>
							<FormSelect
								className="w-full"
								name="gender"
								id="guest-gender"
								value={data.gender}
								onChange={(e) => setData((data) => ({...data, gender: e.target.value}))}>
								<option value="unspecified">Belirtilmedi</option>
								<option value="male">Erkek</option>
								<option value="female">Kadın</option>
							</FormSelect>
							{errors.gender && <div className="text-theme-6 mt-2 text-danger">{errors.gender}</div>}
						</div>
					</div>
				</div>
				<div className="flex w-full flex-col gap-2 lg:flex-row">
					<div className="input-form my-2 w-full lg:w-1/2">
						<FormLabel
							htmlFor="guest-phone"
							className="flex w-full flex-nowrap justify-between gap-2 whitespace-nowrap">
							Telefon Numarası
							<span className="me-2 mt-1 whitespace-pre-wrap text-right text-xs text-slate-500 sm:ml-auto sm:mt-0">
								Gerekli
							</span>
						</FormLabel>
						<FormInput
							id="guest-phone"
							type="text"
							placeholder="Telefon"
							minLength={1}
							required={true}
							name="phone"
							value={data.phone}
							onChange={(e) => setData((data) => ({...data, phone: e.target.value}))}
							className="w-full"
						/>
						{errors.phone && <div className="text-theme-6 mt-2 text-danger">{errors.phone}</div>}
					</div>
					<div className="input-form my-2 w-full lg:w-1/2">
						<FormLabel
							htmlFor="guest-email"
							className="flex w-full flex-nowrap justify-between gap-2 whitespace-nowrap">
							E-Mail Adresi
							<span className="me-2 mt-1 whitespace-pre-wrap text-right text-xs text-slate-500 sm:ml-auto sm:mt-0">
								Gerekli, Lütfen e-mail giriniz.
							</span>
						</FormLabel>
						<FormInput
							id="guest-email"
							type="text"
							placeholder="Email"
							minLength={1}
							required={true}
							name="email"
							value={data.email}
							onChange={(e) => setData((data) => ({...data, email: e.target.value}))}
							className="w-full"
						/>
						{errors.email && <div className="text-theme-6 mt-2 text-danger">{errors.email}</div>}
					</div>
				</div>
				<div className="flex justify-end">
					<Button
						disabled={processing}
						type="submit"
						variant="soft-secondary"
						className="px-5">
						Kaydet
						{processing ? (
							<LoadingIcon
								icon="tail-spin"
								className="ml-2 h-5 w-5"
							/>
						) : (
							<Lucide
								icon="CheckCheck"
								className="ml-2 h-5 w-5 text-success"
							/>
						)}
					</Button>
				</div>
			</form>
		</>
	)
}

Edit.layout = (page: any) => (
	<AuthenticatedLayout
		breadcrumb={[
			{
				title: 'Dashboard',
				href: route('hotel.dashboard.index'),
			},
			{
				title: 'Misafirler',
				href: route('hotel.guests.index'),
			},
			{
				title: 'Misafir Düzenle',
				href: route('hotel.guests.edit', page.props.guest.id),
			},
		]}>
		{page}
	</AuthenticatedLayout>
)

export default Edit
