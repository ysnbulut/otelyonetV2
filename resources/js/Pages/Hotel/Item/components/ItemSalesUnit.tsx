import React, {useState} from 'react'
import Button from '@/Components/Button'
import Lucide from '@/Components/Lucide'
import {Transition} from '@headlessui/react'
import Table from '@/Components/Table'
import ItemSalesChannelTableItem from '@/Pages/Hotel/Item/components/ItemSalesChannelTableItem'
import {SalesUnitProps, UnitChannelsItemPriceProps} from '@/Pages/Hotel/Item/types/create'

function ItemSalesUnit({
	unit,
	itemPrice,
	unitChannelItemPrices,
	setUnitChannelItemPrices,
}: {
	unit: SalesUnitProps
	itemPrice: string
	unitChannelItemPrices: UnitChannelsItemPriceProps[] | undefined
	setUnitChannelItemPrices: React.Dispatch<React.SetStateAction<UnitChannelsItemPriceProps[] | undefined>>
}) {
	const [channelsShow, setChannelsShow] = useState(true)
	return (
		<>
			<div className="box flex items-end justify-between">
				<h2 className="px-3 py-2 text-lg font-semibold">{unit.name}</h2>
				<Button
					type="button"
					onClick={() => setChannelsShow(!channelsShow)}
					className="flex items-center justify-end border-none p-0 px-3 py-2 text-xs font-thin shadow-none focus:ring-0">
					Satış Kanalları Fiyatları
					<Lucide
						icon={channelsShow ? 'ChevronUp' : 'ChevronDown'}
						className="h3 w-3"
					/>
				</Button>
			</div>
			<Transition
				className="mx-2 -mt-3 rounded-b-md bg-white/80 dark:bg-darkmode-700/50"
				show={channelsShow}
				enter="transition-opacity ease-linear duration-200"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="transition-opacity ease-linear duration-150"
				leaveFrom="opacity-100"
				leaveTo="opacity-0">
				<Table
					className="table-auto border-collapse"
					id="responsive-table">
					<Table.Thead>
						<Table.Tr>
							<Table.Th>Satış Kanalları</Table.Th>
							<Table.Th>Fiyat Farkı %</Table.Th>
							<Table.Th>Satış Fiyatı (vergi dahil)</Table.Th>
							<Table.Th>Satışa Açık/Kapalı</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody className="divide-y-[0.7rem] divide-slate-200/50 lg:divide-y-0">
						{unit.channels.length > 0 ? (
							unit.channels.map((channel, key) => (
								<ItemSalesChannelTableItem
									unit={unit}
									channel={channel}
									itemPrice={itemPrice}
									unitChannelItemPrices={unitChannelItemPrices}
									setUnitChannelItemPrices={setUnitChannelItemPrices}
									key={key}
									pKey={key}
								/>
							))
						) : (
							<div>asdasd</div>
						)}
					</Table.Tbody>
				</Table>
			</Transition>
		</>
	)
}

export default ItemSalesUnit
