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

interface CMRoomProps {
	id: number
	type_has_view_id: number
	room_code: string
	stock: number
}

interface TypeHasView {
	id: number
	name: string
	stock: number
	adult_capacity: number
	child_capacity: number
	cm_connected: boolean
}

interface Props {
	hotel_id: number
	type_room: TypeHasView
	cm_rooms: CMRoomProps[] | [] | undefined
	channel_rooms: RoomPorps[] | [] | undefined
}

function ChannelManagerRooms(props: Props) {
	const [cmRoom, setCmRoom] = useState<{
		value: string
		label: string
		stock: number
	} | null>(null)
	const {data, setData, post, processing, errors, reset} = useForm({
		cm_room_code: props.cm_rooms && props.cm_rooms.length > 0 ? props.cm_rooms.find((room) => room.type_has_view_id === props.type_room.id)?.room_code : null,
		type_has_view_id: props.type_room.id,
		stock: cmRoom !== null ? cmRoom.stock : props.cm_rooms ? props.cm_rooms.find((room) => room.type_has_view_id === props.type_room.id)?.stock : props.type_room.stock,
	})

	useEffect(() => {
		if (props.cm_rooms && props.cm_rooms.length > 0) {
			props.cm_rooms.map((room) => {
				if (room.type_has_view_id === props.type_room.id) {
					const channelRoom = props.channel_rooms && props.channel_rooms.find((r) => r.inv_code.split(':').at(-1) === room.room_code)
					if (channelRoom) {
						setCmRoom({
							value: room.room_code,
							label: channelRoom.name + ' - ' + channelRoom.inv_code,
							stock: room.stock,
						})
						setData((data) => ({...data, cm_room_code: room.room_code}))
					}
				}
			})
		}
	}, [props.cm_rooms, props.channel_rooms])

	useEffect(() => {
		cmRoom !== null && setData((data) => ({...data, cm_room_code: cmRoom.value}))
		cmRoom !== null && setData((data) => ({...data, stock: cmRoom.stock}))
	}, [cmRoom])

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
						<span className="font-semibold">Otel Yönet Oda Adı :</span>
						<span>{props.type_room.name}</span>
					</div>
					<div className="flex gap-2">
						<span className="font-semibold">Otel Yönet Oda Kapasitesi :</span>
						<span>{props.type_room.stock}</span>
					</div>
					<div className="flex gap-2">
						<span className="font-semibold">Yetişkin Kapasitesi :</span>
						<span>{props.type_room.adult_capacity}</span>
					</div>
					<div className="flex gap-2">
						<span className="font-semibold">Çocuk Kapasitesi :</span>
						<span>{props.type_room.child_capacity}</span>
					</div>
				</div>
				<div className="flex flex-col items-center justify-end gap-3">
					<div>
						<FormLabel htmlFor="room">HotelRunner Oda Türü</FormLabel>
						<Select
							id="type_has_view"
							name="type_has_view"
							value={cmRoom}
							onChange={(e: any, action: any) => {
								if (action.action === 'select-option') {
									e && setCmRoom(e)
								} else if (action.action === 'clear') {
									setCmRoom(null)
								} else {
									setCmRoom(null)
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
							options={
								props.channel_rooms &&
								props.channel_rooms.map((room) => ({
									value: room.inv_code,
									label: room.name + ' - ' + room.inv_code,
									stock: room.room_capacity,
								}))
							}
							placeholder="Otel Yonet Oda Türü"
						/>
					</div>
					<div className="flex flex-col">
						<FormLabel htmlFor="room">Gönderilecek Stok</FormLabel>
						<FormInput
							id="stock"
							name="room"
							className="w-32 text-right"
							type="stock"
							value={data.stock}
							onChange={(e: any) => {
								setData((data) => ({...data, stock: e.target.value}))
							}}
						/>
					</div>
				</div>
			</div>
			<div className="mt-2 flex items-center justify-end gap-2">
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
