import React, {useEffect, useRef, useState} from 'react'
import Lucide from '@/Components/Lucide'
import Button from '@/Components/Button'
import {ItemDataProps} from '../types/item'
import ItemEdit from '@/Pages/Hotel/BedType/components/ItemEdit'
import ItemDelete from '@/Pages/Hotel/BedType/components/ItemDelete'

function Item(props: ItemDataProps) {
	const refItem = useRef(null)
	const [edit, setEdit] = useState<boolean>(false)
	const [canBeDeleted, setCanBeDeleted] = useState(false)
	const [itemHeight, setItemHeight] = useState(0)

	useEffect(() => {
		if (refItem.current) {
			// @ts-ignore
			setItemHeight(refItem.current.clientHeight)
		}
	}, [])

	return (
		<div className="intro-y box mb-3 p-5 last:mb-0">
			{edit ? (
				<ItemEdit
					bedType={props.bedType}
					setBedTypes={props.setBedTypes}
					setEdit={setEdit}
				/>
			) : canBeDeleted ? (
				<ItemDelete
					itemHeight={itemHeight}
					bedType={props.bedType}
					setBedTypes={props.setBedTypes}
					setCanBeDeleted={setCanBeDeleted}
				/>
			) : (
				<div
					ref={refItem}
					className="flex items-center justify-between">
					<div>
						<h3 className="truncate text-xl font-semibold">
							{props.bedType.name}
							<span className="pl-2 text-xs font-thin">{props.bedType.person_num} Kişilik</span>
						</h3>
						<div className="mt-0.5 text-xs text-slate-500">{props.bedType.description}</div>
					</div>
					<div className="flex items-center justify-between gap-2">
						<Button
							className="border-none p-1 shadow-none focus:ring-0"
							onClick={() => setEdit(true)}>
							<Lucide
								icon="PencilLine"
								className="h-5 w-5 text-primary"
							/>
						</Button>
						<Button
							className="border-none p-1 shadow-none focus:ring-0"
							onClick={() => setCanBeDeleted(true)}>
							<Lucide
								icon="Trash2"
								className="h-5 w-5 text-danger"
							/>
						</Button>
					</div>
				</div>
			)}
		</div>
	)
}

export default Item
