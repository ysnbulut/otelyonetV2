import React, {useEffect, useState} from 'react'
import RoomTypesListItem from './RoomTypesListItem'
import {RoomTypesListProps} from '../types/room-types-list'

function RoomTypesList(props: RoomTypesListProps) {
	const [setableSubmitClick, setSetableSubmitClick] = useState<boolean>(false)
	const [warnings, setWarnings] = useState<{[key: number]: boolean}>({})
	useEffect(() => {
		const warning = Object.values(warnings).includes(true)
		setSetableSubmitClick(warning)
		props.setWarningBadge((warningBadge) => ({
			...warningBadge,
			[props.roomType.id]: warning,
		}))
	}, [warnings])
	return (
		<ul className="-mt-1 rounded-b border-x border-b">
			{props.roomType.variations.length > 0 &&
				props.roomType.variations.map((variation) => (
					<li
						key={variation.id}
						className="border-b last:border-b-0">
						<RoomTypesListItem
							roomTypeId={props.roomType.id}
							variationName={`${variation.number_of_adults} Yetişkin ${variation.number_of_children} Çocuk`}
							variation={variation}
							setWarnings={setWarnings}
							setableSubmitClick={setableSubmitClick}
						/>
					</li>
				))}
		</ul>
	)
}

export default RoomTypesList
