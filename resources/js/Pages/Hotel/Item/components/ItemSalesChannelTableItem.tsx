import React, {useEffect, useState} from 'react'
import Table from '@/Components/Table'
import {twMerge} from 'tailwind-merge'
import CurrencyInput from 'react-currency-input-field'
import Button from '@/Components/Button'
import Lucide from '@/Components/Lucide'
import {SalesUnitProps, ChannelProps, UnitChannelsItemPriceProps} from '@/Pages/Hotel/Item/types/create'
import {FormSwitch} from '@/Components/Form'

function ItemSalesChannelTableItem({
	unit,
	channel,
	itemPrice,
	pKey,
	unitChannelItemPrices,
	setUnitChannelItemPrices,
}: {
	unit: SalesUnitProps
	channel: ChannelProps
	itemPrice: string
	pKey: number
	unitChannelItemPrices: UnitChannelsItemPriceProps[] | undefined
	setUnitChannelItemPrices: React.Dispatch<React.SetStateAction<UnitChannelsItemPriceProps[] | undefined>>
}) {
	const [openSale, setOpenSale] = useState(false)
	const [price, setPrice] = useState<string>(itemPrice)
	const [errorPrice, setErrorPrice] = useState<string | null>(null)
	const [increasePercent, setIncreasePercent] = useState<string>('0')

	console.log(channel)
	useEffect(() => {
		if (itemPrice !== '0' && openSale) {
			const newPrice = (
				parseFloat(itemPrice) +
				(parseFloat(itemPrice) * parseFloat(increasePercent.replace(',', '.'))) / 100
			).toFixed(2)
			setPrice(newPrice)
			if (parseFloat(newPrice) < parseFloat(itemPrice)) {
				setErrorPrice('Fiyat ürün fiyatından düşük olamaz!')
			} else {
				setErrorPrice(null)
			}
		} else {
			setPrice('0')
			setErrorPrice(null)
		}
	}, [increasePercent, itemPrice, openSale])

	useEffect(() => {
		if (openSale) {
			setUnitChannelItemPrices((prevState) => {
				if (prevState !== undefined) {
					const check = prevState?.findIndex((item) => item.sales_unit_channel_id === channel.sales_unit_channel_id)
					if (check !== undefined && check > -1) {
						return prevState?.map((item) => {
							if (item.sales_unit_channel_id === channel.sales_unit_channel_id) {
								return {
									...item,
									price_rate: increasePercent,
								}
							} else {
								return item
							}
						})
					} else {
						return [
							...prevState,
							{
								sales_unit_channel_id: channel.sales_unit_channel_id,
								price_rate: increasePercent,
							},
						]
					}
				} else {
					return [
						{
							sales_unit_channel_id: channel.sales_unit_channel_id,
							price_rate: increasePercent,
						},
					]
				}
			})
		} else {
			setUnitChannelItemPrices((prevState) => {
				return prevState?.filter((item) => item.sales_unit_channel_id !== channel.sales_unit_channel_id)
			})
		}
	}, [openSale, price])

	const handlePriceChange = (value: string) => {
		if (openSale) {
			setPrice(value)
			setIncreasePercent((((parseFloat(value) - parseFloat(itemPrice)) / parseFloat(itemPrice)) * 100).toFixed(2))
			if (unitChannelItemPrices !== undefined) {
				setUnitChannelItemPrices((prevState) => {
					const index =
						prevState && prevState.findIndex((item) => item.sales_unit_channel_id === channel.sales_unit_channel_id)
					if (index !== undefined && index > -1) {
						return prevState?.map((item) => {
							if (item.sales_unit_channel_id === channel.sales_unit_channel_id) {
								return {
									...item,
									price_rate: value,
								}
							} else {
								return item
							}
						})
					} else {
						return [
							...(prevState || []),
							{
								sales_unit_channel_id: channel.sales_unit_channel_id,
								price_rate: value,
							},
						]
					}
				})
			}
			if (parseFloat(value) < parseFloat(itemPrice)) {
				setErrorPrice('Fiyat ürün fiyatından düşük olamaz!')
			} else {
				setErrorPrice(null)
			}
		}
	}

	return (
		<Table.Tr>
			<Table.Td
				dataLabel="Satış Kanalı"
				className={twMerge(
					'border-t px-2',
					pKey !== 0 ? 'border-t ' : 'border-t-0',
					unit.channels.length !== pKey + 1 ? 'border-b' : 'border-b lg:border-none',
					openSale
						? 'text-slate-700 dark:text-darkmode-100'
						: 'text-slate-400 line-through before:no-underline dark:text-darkmode-400',
				)}>
				{channel.name}
			</Table.Td>
			<Table.Td
				dataLabel="Fiyat Farkı %"
				className={twMerge(
					'px-2',
					unit.channels.length !== pKey + 1 ? 'border-b' : 'border-b lg:border-none',
					openSale
						? 'text-slate-700 dark:text-darkmode-100'
						: 'text-slate-400 line-through before:no-underline dark:text-darkmode-400',
				)}>
				<div className="flex">
					<Button
						type="button"
						className="rounded-r-none py-1 focus:ring-0"
						variant="soft-secondary"
						disabled={!openSale}
						onClick={() => setIncreasePercent((parseFloat(increasePercent.replace(',', '.')) - 0.01).toFixed(2))}>
						<Lucide
							icon="Minus"
							className="h-5 w-5 text-danger"
						/>
					</Button>
					<CurrencyInput
						id={`price-${channel.name}-increment`}
						allowNegativeValue={false}
						allowDecimals={true}
						decimalSeparator=","
						decimalScale={2}
						suffix=" %"
						value={increasePercent}
						decimalsLimit={2}
						required
						disabled={!openSale}
						name={`item_channel_price_${channel.name}`}
						className="w-20 border-slate-200 py-1.5 text-right text-xs shadow-sm ring-0 transition duration-200 ease-in-out placeholder:text-slate-400/90 focus:ring-0 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-transparent dark:bg-darkmode-800 dark:placeholder:text-slate-500/80 dark:disabled:border-transparent dark:disabled:bg-darkmode-800/50 [&[readonly]]:cursor-not-allowed [&[readonly]]:bg-slate-100 [&[readonly]]:dark:border-transparent [&[readonly]]:dark:bg-darkmode-800/50"
						onValueChange={(value) => value && setIncreasePercent(value)}
					/>
					<Button
						type="button"
						className="rounded-l-none py-1 focus:ring-0"
						variant="soft-secondary"
						disabled={!openSale}
						onClick={() => setIncreasePercent((parseFloat(increasePercent.replace(',', '.')) + 0.01).toFixed(2))}>
						<Lucide
							icon="Plus"
							className="h-5 w-5 text-success"
						/>
					</Button>
				</div>
			</Table.Td>
			<Table.Td
				dataLabel="Fiyatı"
				className={twMerge(
					'px-2',
					unit.channels.length !== pKey + 1 ? 'border-b' : 'border-b lg:border-none',
					openSale
						? 'text-slate-700 dark:text-darkmode-100'
						: 'text-slate-400 line-through before:no-underline dark:text-darkmode-400',
				)}>
				<div className="flex flex-col gap-1">
					<CurrencyInput
						id={`item-channel-price-${channel.name}`}
						allowNegativeValue={false}
						allowDecimals={true}
						decimalSeparator=","
						decimalScale={2}
						suffix=" TRY"
						value={price}
						decimalsLimit={2}
						required
						disabled={!openSale || itemPrice === '0'}
						onValueChange={(value) => value && handlePriceChange(value)}
						name={`item_channel_price_${channel.name}`}
						className="rounded-md border-slate-200 py-1.5 text-right text-xs shadow-sm transition duration-200 ease-in-out placeholder:text-slate-400/90 focus:border-primary focus:border-opacity-40 focus:ring-4 focus:ring-primary focus:ring-opacity-20 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-transparent dark:bg-darkmode-800 dark:placeholder:text-slate-500/80 dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:disabled:border-transparent dark:disabled:bg-darkmode-800/50 [&[readonly]]:cursor-not-allowed [&[readonly]]:bg-slate-100 [&[readonly]]:dark:border-transparent [&[readonly]]:dark:bg-darkmode-800/50"
					/>
					{errorPrice !== null && <span className="mx-2 text-right text-xs text-danger">{errorPrice}</span>}
				</div>
			</Table.Td>
			<Table.Td
				dataLabel="Satışa Açık/Kapalı"
				className={twMerge(
					'px-2',
					unit.channels.length !== pKey + 1 ? 'border-b' : 'border-b lg:border-none',
					openSale
						? 'text-slate-700 dark:text-darkmode-100'
						: 'text-slate-400 line-through before:no-underline dark:text-darkmode-400',
				)}>
				<FormSwitch className="flex items-center justify-center gap-2">
					<FormSwitch.Input
						className="mx-0"
						id={`item-channel-${channel.name}`}
						name={`item_channel_${channel.name}`}
						type="checkbox"
						checked={openSale}
						value={openSale ? '1' : '0'}
						onChange={(e) => setOpenSale(e.target.checked)}
					/>
				</FormSwitch>
			</Table.Td>
		</Table.Tr>
	)
}

export default ItemSalesChannelTableItem
