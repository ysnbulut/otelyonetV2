import React, {useState} from 'react'
import Lucide from '@/Components/Lucide'
import Button from '@/Components/Button'
import {GroupResultProps} from '@/Pages/Hotel/Booking/types/group-results'

function GroupResults(props: GroupResultProps) {
	const [checkedPrice, setCheckedPrice] = useState<boolean | any>(false)
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
					<div>
						{item.price.prices.map((price, priceKey) => (
							<div className="col-span-12">
								{price.text} {price.total_price_formatter}
							</div>
						))}
					</div>
					<div className="flex justify-end">
						<Button
							variant="primary"
							onClick={() => console.log(checkedPrice)}>
							{checkedPrice === false ? 'Oda Seçmeden İlerle' : 'Sonraki Adım'}
						</Button>
					</div>
				</div>
			))}
		</div>
	)
}

export default GroupResults
