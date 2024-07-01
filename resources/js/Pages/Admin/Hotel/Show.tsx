import React, {useRef, useState} from 'react'
import AuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout'
import {Head, Link, router, useForm} from '@inertiajs/react'
import Tippy from '@/Components/Tippy'
import Button from '@/Components/Button'
import Lucide from '@/Components/Lucide'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import {FormInput, FormLabel} from '@/Components/Form'
import Select from 'react-select'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import axios from 'axios'
import ChannelManagerRooms from '@/Pages/Admin/Hotel/components/ChannelManagerRooms'

dayjs.extend(customParseFormat)

interface HotelProps {
	id: number
	tenant_id: string
	status: string
	name: string
	register_date: string
	renew_date: string
	price: number
	renew_price: number
	title: string | null
	address: string | null
	province_id: number | null
	province: string | null
	district_id: number | null
	district: string | null
	location: string | null
	tax_office_id: number | null
	tax_office: string | null
	tax_number: string | null
	phone: string | null
	email: string | null
	panel_url: string
	webhook_url: string
}

interface OptionProps {
	label: string
	value: string
}

interface ChannelManagerProps {
	name: string
	type: string
	label: string
	value: string
	options: OptionProps[]
	description: string
}

interface ApiSettingsProps {
	token: string
	hr_id: string
}

interface TypeHasViewProps {
	value: number
	label: string
	count: number
}

interface SettingProps {
	channel_manager: ChannelManagerProps
	api_settings: ApiSettingsProps | ''
}

interface PageProps {
	hotel: HotelProps
	tenant: {
		id: string
		data: string | null
		tenancy_db_name: string
		domains: string[]
		settings: SettingProps
		type_has_views: TypeHasViewProps[]
	}
}

interface ChannelRoomProps {
	adult_capacity: number
	availability_group: string
	availability_update: boolean
	channel_codes: string[]
	code: string
	corporate_code: string | null
	description: string
	group_code: string | null
	id: number
	inv_code: string
	is_master: boolean
	name: string
	non_refundable: boolean
	policy: string | null
	price_update: boolean
	pricing_type: string
	rate_code: string
	rate_plan_code: string
	rate_plan_id: number
	rate_plan_name: string
	restrictions_update: boolean
	room_capacity: number
	sell_online: boolean
	shared: boolean
	show_refundable_rate: boolean
}

function Show(props: PageProps) {
	const MySwal = withReactContent(Swal)
	const [rooms, setRooms] = useState<ChannelRoomProps[]>([])
	const {data, setData, errors, setError, clearErrors} = useForm({
		channel_manager: props.tenant.settings.channel_manager.value,
		api_token: props.tenant.settings.api_settings !== '' ? props.tenant.settings.api_settings.token : '' || '',
		api_hr_id: props.tenant.settings.api_settings !== '' ? props.tenant.settings.api_settings.hr_id : '' || '',
	})
	const ref = useRef(null)

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

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		axios
			.put(route('admin.hotels.channe_manager', props.hotel.id), data)
			.then((response) => {
				Toast.fire({
					icon: response.data.status === 'success' ? 'success' : 'error',
					title: response.data.message,
				})
				setRooms(response.data.rooms)
			})
			.catch((error) => {
				if (error.response.status === 422) {
					setError('channel_manager', error.response.data.errors.channel_manager[0])
				}
			})
	}

	const setActiveChannels = (e: any) => {
		e.preventDefault()
		axios
			.get(route('admin.hotels.active_channels', props.hotel.id))
			.then((response) => {
				console.log(response.data)
				Toast.fire({
					icon: response.data.status === 'success' ? 'success' : 'error',
					title: response.data.message,
				})
			})
			.catch((error) => {
				console.log(error)
				if (error.response.status === 422) {
					setError('channel_manager', error.response.data.errors.channel_manager[0])
				}
			})
	}
	return (
		<>
			<Head title="Otel Detay" />
			<div className="flex items-center justify-between">
				<h2 className="intro-y my-5 text-lg font-medium">Otel {props.hotel.name}</h2>
				<Tippy
					as={Button}
					onClick={() => router.visit(route('admin.hotels.index'))}
					variant="soft-pending"
					className="intro-x"
					content="Geri">
					<Lucide
						icon="Undo2"
						className="h-5 w-5"
					/>
				</Tippy>
			</div>
			<div className="box flex flex-col gap-1 p-5 lg:flex-row lg:gap-10">
				<div className="flex flex-col gap-1">
					<div className="flex flex-wrap gap-2">
						<span className="w-36 font-semibold">Otel Adı :</span>
						<span>{props.hotel.name}</span>
					</div>
					<div className="flex flex-wrap gap-2">
						<span className="w-36 font-semibold">Kayıt Tarihi :</span>
						<span>{dayjs(props.hotel.register_date, 'YYYY-MM-DD').format('DD.MM.YYYY')}</span>
					</div>
					<div className="flex flex-wrap gap-2">
						<span className="w-36 font-semibold">Yenileme Tarihi :</span>
						<span>{dayjs(props.hotel.renew_date, 'YYYY-MM-DD').format('DD.MM.YYYY')}</span>
					</div>
					<div className="flex flex-wrap gap-2">
						<span className="w-36 font-semibold">Fiyat :</span>
						<span>{props.hotel.price} USD</span>
					</div>
					<div className="flex flex-wrap gap-2">
						<span className="w-36 font-semibold">Yenileme Fiyatı :</span>
						<span>{props.hotel.renew_price} USD</span>
					</div>

					<div className="flex flex-wrap gap-2">
						<span className="w-36 font-semibold">Panel Link :</span>
						<a
							target="_blank"
							href={props.hotel.panel_url}>
							{props.hotel.panel_url}
						</a>
					</div>
					<div className="flex flex-wrap gap-2">
						<span className="w-36 font-semibold">E-posta :</span>
						<span>{props.hotel.email}</span>
					</div>
				</div>
				<div className="flex flex-col gap-1">
					<div className="flex flex-wrap gap-2">
						<span className="w-36 font-semibold">Ünvan :</span>
						<span>{props.hotel.title}</span>
					</div>
					<div className="flex flex-wrap gap-2">
						<span className="w-36 font-semibold">Adres :</span>
						<span>{props.hotel.address}</span>
					</div>
					<div className="flex flex-wrap gap-2">
						<span className="w-36 font-semibold">İl :</span>
						<span>{props.hotel.province}</span>
					</div>
					<div className="flex flex-wrap gap-2">
						<span className="w-36 font-semibold">İlçe :</span>
						<span>{props.hotel.district}</span>
					</div>
					<div className="flex flex-wrap gap-2">
						<span className="w-36 font-semibold">Vergi Dairesi :</span>
						<span>{props.hotel.tax_office}</span>
					</div>
					<div className="flex flex-wrap gap-2">
						<span className="w-36 font-semibold">Vergi Numarası :</span>
						<span>{props.hotel.tax_number}</span>
					</div>
					<div className="flex flex-wrap gap-2">
						<span className="w-36 font-semibold">Telefon :</span>
						<span>{props.hotel.phone}</span>
					</div>
				</div>
			</div>
			<div className="box mt-5 flex flex-col gap-1 p-5 lg:flex-row lg:gap-10">
				<FormInput
					id="webhook_url"
					name="webhook_url"
					type="text"
					value={props.hotel.webhook_url}
					disabled
				/>
			</div>
			<form
				onSubmit={(e) => handleSubmit(e)}
				className="box mb-5 mt-4 flex flex-col p-5">
				<div className="grid grid-cols-2 items-start gap-5 border-b py-5 last:border-b-0">
					<FormLabel
						htmlFor={props.tenant.settings.channel_manager.name}
						className="col-span-2 flex flex-col gap-1 lg:col-span-1">
						<h3 className="text-lg font-semibold">{props.tenant.settings.channel_manager.label}</h3>
						<span className="text-xs text-slate-500">{props.tenant.settings.channel_manager.description}</span>
					</FormLabel>
					<div className="col-span-2 flex flex-col lg:col-span-1">
						{props.tenant.settings.channel_manager.type === 'select' && (
							<Select
								ref={ref}
								id={props.tenant.settings.channel_manager.name}
								defaultValue={props.tenant.settings.channel_manager.options.find((option) => option.value === data.channel_manager)}
								onChange={(e: any, action: any) => {
									if (action.action === 'select-option') {
										e && setData((data) => ({...data, channel_manager: e.value}))
									} else if (action.action === 'clear') {
										setData((data) => ({...data, channel_manager: 'closed'}))
									} else {
										setData((data) => ({...data, channel_manager: 'closed'}))
									}
								}}
								options={props.tenant.settings.channel_manager.options}
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
								isClearable
								hideSelectedOptions
								placeholder={props.tenant.settings.channel_manager.label}
							/>
						)}
						{props.tenant.settings.channel_manager.type === 'text' && (
							<FormInput
								id={props.tenant.settings.channel_manager.name}
								name={props.tenant.settings.channel_manager.name}
								type="text"
								value={data.channel_manager}
								onChange={(e) => setData((data) => ({...data, [props.tenant.settings.channel_manager.name]: e.target.value}))}
							/>
						)}
						{props.tenant.settings.channel_manager.type === 'number' && (
							<FormInput
								id={props.tenant.settings.channel_manager.name}
								name={props.tenant.settings.channel_manager.name}
								type="number"
								value={data.channel_manager}
								onChange={(e) => setData((data) => ({...data, [props.tenant.settings.channel_manager.name]: e.target.value}))}
							/>
						)}
						{errors.channel_manager && <div className="text-theme-6 mt-2 text-danger">{errors.channel_manager}</div>}
					</div>
				</div>
				<div className="mt-3">
					{data.channel_manager === 'hotelrunner' && (
						<>
							<h3 className="text-lg font-semibold">HotelRunner API Ayarları</h3>
							<div className="mt-2 flex gap-2">
								<div className="w-full">
									<FormLabel htmlFor="token">TOKEN</FormLabel>
									<FormInput
										id="token"
										name="token"
										type="text"
										value={data.api_token}
										onChange={(e) => setData((data) => ({...data, api_token: e.target.value}))}
									/>
								</div>
								<div className="w-full">
									<FormLabel htmlFor="token">Hotel ID</FormLabel>
									<FormInput
										id="token"
										name="token"
										type="text"
										value={data.api_hr_id}
										onChange={(e) => setData((data) => ({...data, api_hr_id: e.target.value}))}
									/>
								</div>
							</div>
						</>
					)}
					<div className="mt-3 flex items-center justify-between">
						{data.channel_manager !== 'closed' && data.api_hr_id && data.api_token && (
							<Button
								variant="soft-pending"
								type="button"
								onClick={(e: any) => {
									setActiveChannels(e)
								}}
								className="flex gap-2">
								Aktif Kanalları İşle
								<Lucide
									icon="ReplaceAll"
									className="h-5 w-5 text-danger"
								/>
							</Button>
						)}
						<Button
							variant="soft-secondary"
							type="submit"
							className="flex gap-2">
							{data.channel_manager === 'closed' ? 'Kaydet' : 'Odaları Getir'}
							<Lucide
								icon="CheckCheck"
								className="h-5 w-5 text-success"
							/>
						</Button>
					</div>
				</div>
			</form>

			{rooms.length > 0 && (
				<div>
					{rooms.map((room, index) => (
						<ChannelManagerRooms
							hotel_id={props.hotel.id}
							room={room}
							key={index}
							type_has_views={props.tenant.type_has_views}
						/>
					))}
				</div>
			)}
		</>
	)
}

Show.layout = (page: any) => (
	<AuthenticatedLayout
		breadcrumb={[
			{
				title: 'Dashboard',
				href: route('admin.dashboard.index'),
			},
			{
				title: 'Oteller',
				href: route('admin.hotels.index'),
			},

			{
				title: 'Otel Ekle',
				href: route('admin.hotels.create'),
			},
		]}
		children={page}
	/>
)
export default Show
