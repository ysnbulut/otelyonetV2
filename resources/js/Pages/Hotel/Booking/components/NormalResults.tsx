import React, {useState} from 'react'
import Lucide from '@/Components/Lucide'
import {NormalResultProps} from '@/Pages/Hotel/Booking/types/normal-results'
import {Disclosure} from '@/Components/Headless'
import Button from '@/Components/Button'
import RoomCheckButton from '@/Pages/Hotel/Booking/components/RoomCheckButton'

function NormalResults(props: NormalResultProps) {
	const [checkedRoom, setCheckedRoom] = useState<boolean | number>(false)
	return (
		<div className="mt-5 flex w-full flex-col items-center justify-center gap-5">
			{props.data.map((item, key) => (
				<div
					className="box w-full p-5"
					key={key}>
					<h3 className="text-center text-lg font-medium">{item.name}</h3>
					<div className="flex justify-between">
						<div className="flex justify-start">
							<div className="flex items-center justify-center border-r px-2 py-1">
								<Lucide
									icon="Ungroup"
									className="h-5 w-5"
								/>
								<span className="ml-2 text-sm">{item.room_count} odalı</span>
							</div>
							<div className="flex items-center justify-center border-r px-2 py-1">
								<Lucide
									icon="Scaling"
									className="h-5 w-5"
								/>
								<span className="ml-2 text-sm">
									{item.size} m<sup>2</sup>
								</span>
							</div>
							{item.beds.map((bed, bedKey) => (
								<div
									key={bedKey}
									className="flex items-center justify-center px-2 py-1">
									<Lucide
										icon={bed.person_num > 1 ? 'BedDouble' : 'BedSingle'}
										className="h-5 w-5"
									/>
									<span className="ml-2 text-sm">
										{bed.count} adet {bed.name}
									</span>
								</div>
							))}
						</div>
					</div>
					<Disclosure.Group>
						<Disclosure defaultOpen={false}>
							<Disclosure.Button className="my-2 flex justify-between rounded-md border px-5 text-xl font-semibold text-primary">
								<span>Oda Seç</span>
								<h3>
									Toplam Tutar :
									<span className="text-base font-semibold text-success"> {item.price.total_price_formatter} </span>
								</h3>
							</Disclosure.Button>
							<Disclosure.Panel className="grid grid-cols-12 gap-2 leading-relaxed text-slate-600 dark:text-slate-500">
								{item.rooms.map((room, roomKey) => (
									<RoomCheckButton
										key={roomKey}
										room={room}
										checkedRoom={checkedRoom}
										setCheckedRoom={setCheckedRoom}
									/>
								))}
							</Disclosure.Panel>
						</Disclosure>
					</Disclosure.Group>
					<div className="flex justify-end">
						<Button
							variant="primary"
							onClick={() => console.log(checkedRoom)}>
							{checkedRoom === false ? 'Oda Seçmeden İlerle' : 'Sonraki Adım'}
						</Button>
					</div>
				</div>
			))}
		</div>
	)
}

export default NormalResults
