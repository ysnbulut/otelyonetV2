import React from 'react'
import Lucide from '@/Components/Lucide'
import {ItemCardDataProps} from '@/Pages/Hotel/Item/types/item-card'
import {useAppSelector} from '@/stores/hooks'
import {selectDarkMode} from '@/stores/darkModeSlice'
import image from '../../../../../images/image.jpg'
import image_dark from '../../../../../images/image_dark.jpg'
import CurrencyInput from 'react-currency-input-field'

function ItemCard(props: ItemCardDataProps) {
	const darkMode = useAppSelector(selectDarkMode)
	return (
		<div className="intro-y col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3">
			<div className="box">
				<div className="p-3">
					<div className="image-fit h-40 overflow-hidden rounded-md before:absolute before:left-0 before:top-0 before:z-10 before:block before:h-full before:w-full before:bg-gradient-to-t before:from-black before:to-black/10 2xl:h-56">
						<img
							alt="Midone - HTML Admin Template"
							className="rounded-md"
							src={props.item.image === '' ? (darkMode ? image : image_dark) : props.item.image}
						/>
						<span className="absolute top-0 z-10 m-3 rounded bg-pending/80 px-2 py-1 text-xs text-white">
							{props.item.category}
						</span>
						<div className="absolute bottom-0 z-10 px-5 pb-6 text-white">
							<a
								href=""
								className="block text-base font-medium">
								{props.item.name}
							</a>
							<span className="mt-3 text-xs text-white/90">{props.item.category}</span>
						</div>
					</div>
					<div className="mt-3 text-slate-600 dark:text-slate-500">
						<div className="flex items-center">
							<Lucide
								icon="DollarSign"
								className="mr-2 h-4 w-4"
							/>
							<div className="flex items-center justify-start gap-1">
								Tutar :
								<CurrencyInput
									id="discount-price"
									allowNegativeValue={false}
									allowDecimals={true}
									decimalSeparator=","
									decimalScale={2}
									suffix={` ${props.currency}` || ' TRY'}
									value={props.item.price}
									decimalsLimit={2}
									required={true}
									disabled={true}
									name="discount_price"
									className="w-24 border-none px-0.5 py-0.5 text-left text-xs font-semibold text-danger focus:border-none focus:ring-0 dark:bg-darkmode-600"
								/>
							</div>
						</div>
						{/*<fieldset className="mt-2 p-1 text-xs">*/}
						{/*	<legend className="-ml-2 px-1 py-0.5 font-semibold">Birimler</legend>*/}
						{/*	<p className="overflow-hidden text-clip">*/}
						{/*		{props.item.units.map((unit: any) => unit.name).join(', ')}*/}
						{/*	</p>*/}
						{/*</fieldset>*/}
						<div className="mt-2 flex items-center">{props.item.description}</div>
					</div>
				</div>
				<div className="flex items-center justify-center border-t border-slate-200/60 p-5 lg:justify-end dark:border-darkmode-400">
					<a
						className="mr-auto flex items-center text-primary"
						href="#">
						<Lucide
							icon="Eye"
							className="mr-1 h-4 w-4"
						/>
						Preview
					</a>
					<a
						className="mr-3 flex items-center"
						href="#">
						<Lucide
							icon="CheckSquare"
							className="mr-1 h-4 w-4"
						/>
						Edit
					</a>
					<a
						className="flex items-center text-danger"
						href="#"
						onClick={(e) => {
							e.preventDefault()
						}}>
						<Lucide
							icon="Trash2"
							className="mr-1 h-4 w-4"
						/>
						Delete
					</a>
				</div>
			</div>
		</div>
	)
}

export default ItemCard
