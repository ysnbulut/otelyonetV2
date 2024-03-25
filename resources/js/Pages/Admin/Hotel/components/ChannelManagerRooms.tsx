import React, {Fragment, useEffect, useState} from 'react'
import {FormInput, FormLabel} from '@/Components/Form'
import {useForm} from '@inertiajs/react'
import Select from 'react-select'
import Button from '@/Components/Button'
import Lucide from '@/Components/Lucide'
import axios from 'axios'

interface RoomPorps {
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

interface TypeHasView {
	value: number
	label: string
	count: number
}

interface Props {
	hotel_id: number
	room: RoomPorps
	type_has_views: TypeHasView[]
}

function ChannelManagerRooms(props: Props) {
	const [typeHasView, setTypeHasView] = useState<TypeHasView | null>(null)
	const {data, setData, post, processing, errors, reset} = useForm({
		cm_room_code: props.room.code.toString(),
		type_has_view_id: '',
		stock: '0',
	})

	useEffect(() => {
		typeHasView !== null && setData((data) => ({...data, type_has_view_id: typeHasView.value.toString()}))
		typeHasView !== null && setData((data) => ({...data, stock: typeHasView.count.toString()}))
	}, [typeHasView])

	const handleSubmit = (e: any) => {
		e.preventDefault()
		axios
			.post(route('admin.hotels.cmroomstore', props.hotel_id), data)
			.then((res) => {
				console.log(res)
			})
			.catch((err) => {
				console.log(err)
			})
	}

	return (
		<div className="box mb-3 flex flex-col p-5">
			<div className="flex w-full flex-col justify-between border-b pb-2 lg:flex-row lg:items-center">
				<div>
					<div className="flex gap-2">
						<span className="font-semibold">Oda Adı :</span>
						<span>{props.room.name}</span>
					</div>
					<div className="flex gap-2">
						<span className="font-semibold">Oda Kodu :</span>
						<span>{props.room.rate_code}</span>
					</div>
					<div className="flex gap-2">
						<span className="font-semibold">Oda Kapasitesi :</span>
						<span>{props.room.room_capacity}</span>
					</div>
					<div className="flex gap-2">
						<span className="font-semibold">Oda Yetişkin Kapasitesi :</span>
						<span>{props.room.adult_capacity}</span>
					</div>
				</div>
				<div>
					<FormLabel htmlFor="room">Otel Yonet Oda Türü</FormLabel>
					<Select
						id="province"
						name="province"
						defaultValue={typeHasView}
						onChange={(e: any, action: any) => {
							if (action.action === 'select-option') {
								e && setTypeHasView(e)
							} else if (action.action === 'clear') {
								setTypeHasView(null)
							} else {
								setTypeHasView(null)
							}
						}}
						className="remove-all my-select-container max-w-96"
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
						options={props.type_has_views}
						placeholder="Otel Yonet Oda Türü"
					/>
				</div>
			</div>
			<div className="mt-2 flex items-center justify-end gap-2">
				<div className="flex flex-col">
					<FormLabel htmlFor="room">Gönderilecek Stok</FormLabel>
					<FormInput
						id="room"
						name="room"
						className="w-32 text-right"
						type="number"
						value={data.stock}
						onChange={(e: any) => {
							setData((data) => ({...data, stock: e.target.value}))
						}}
					/>
				</div>
				<Button
					variant="soft-secondary"
					type="button"
					onClick={handleSubmit}
					className="mt-7 flex w-32 gap-2">
					Kaydet
					<Lucide
						icon="CheckCheck"
						className="h-5 w-5 text-success"
					/>
				</Button>
			</div>
		</div>
	)
}

export default ChannelManagerRooms
