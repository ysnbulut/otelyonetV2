import React from 'react'
import {SalesUnitProps, setDataByMethod, UnitChannelsItemPriceProps} from '@/Pages/Hotel/Item/types/create'
import ItemSalesUnit from '@/Pages/Hotel/Item/components/ItemSalesUnit'
import Lucide from '@/Components/Lucide'

function ItemSalesUnitsList({
	selectedUnits,
	itemPrice,
	unitChannelItemPrices,
	setUnitChannelItemPrices,
}: {
	selectedUnits: SalesUnitProps[]
	itemPrice: string
	unitChannelItemPrices: UnitChannelsItemPriceProps[] | undefined
	setUnitChannelItemPrices: React.Dispatch<React.SetStateAction<UnitChannelsItemPriceProps[] | undefined>>
}) {
	return (
		<fieldset className="col-span-12 flex min-h-10 flex-col gap-3 rounded-lg bg-slate-100 p-3 shadow-inner dark:bg-darkmode-800">
			<legend className="box rounded px-2 py-1 text-center shadow">Ürünün Satılacağı Üniteler</legend>
			{selectedUnits.length > 0 ? (
				selectedUnits.map((unit, key) => (
					<ItemSalesUnit
						unit={unit}
						itemPrice={itemPrice}
						unitChannelItemPrices={unitChannelItemPrices}
						setUnitChannelItemPrices={setUnitChannelItemPrices}
						key={key}
					/>
				))
			) : (
				<div className="flex items-center justify-center">
					<div className="flex flex-col items-center justify-center gap-2">
						<div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 dark:bg-darkmode-700">
							<Lucide
								icon="SearchX"
								className="h-10 w-10 text-slate-500 dark:text-darkmode-300"
							/>
						</div>
						<span className="text-slate-500 dark:text-darkmode-300">Satış Ünitesi Henüz Eklenmemiş</span>
					</div>
				</div>
			)}
		</fieldset>
	)
}

export default ItemSalesUnitsList
