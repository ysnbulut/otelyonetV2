import React from 'react'
import DocumentTableItem from '@/Pages/Hotel/Booking/components/DocumentTableItem'
import {DocumentProps} from '@/Pages/Hotel/Booking/types/show'

interface DocumentItemsTableProps {
	document: DocumentProps
}

function DocumentItemsTable(props: DocumentItemsTableProps) {
	return (
		<>
			<table
				id="responsive-table"
				className="w-full border-spacing-y-[10px] border border-x-0 bg-white dark:bg-darkmode-600">
				<thead className="border-b">
					<tr>
						<th
							className="min-w-36 whitespace-nowrap text-xs"
							style={{
								paddingLeft: '0.80rem',
								paddingRight: '0.50rem',
								textAlign: 'left',
							}}>
							Hizmet / Ürün Adı
						</th>
						{/*<th*/}
						{/*	className="text-left text-xs"*/}
						{/*	style={{paddingLeft: '0.50rem', paddingRight: '0.50rem'}}>*/}
						{/*	Açıklama*/}
						{/*</th>*/}
						<th
							className="whitespace-nowrap text-center text-xs"
							style={{paddingLeft: '0.50rem', paddingRight: '0.50rem'}}>
							Miktar
						</th>
						<th
							className="whitespace-nowrap text-left text-xs"
							style={{paddingLeft: '0.50rem', paddingRight: '0.50rem', textAlign: 'center'}}>
							Birim Fiyat
						</th>
						<th
							className="whitespace-nowrap text-left text-xs"
							style={{paddingLeft: '0.50rem', paddingRight: '0.50rem', textAlign: 'right'}}>
							Kdv Oranı
						</th>
						<th
							className="whitespace-nowrap text-left text-xs"
							style={{paddingLeft: '0.50rem', paddingRight: '0.50rem', textAlign: 'right'}}>
							Kdv Tutarı
						</th>
						<th
							className="whitespace-nowrap text-left text-xs"
							style={{paddingLeft: '0.50rem', paddingRight: '0.80rem', textAlign: 'right'}}>
							Toplam
						</th>
					</tr>
				</thead>
				<tbody>
					{props.document.items.map((item, index) => (
						<DocumentTableItem
							item={item}
							key={index}
						/>
					))}
				</tbody>
			</table>
			<div className="flex w-full flex-col items-end justify-center border-b bg-white px-4 dark:bg-darkmode-600">
				{props.document.totals.map((total, index) => (
					<div
						key={index}
						className="flex items-center justify-end border-b py-0.5 last:border-none">
						<div className="flex w-56 items-center justify-between gap-1">
							<div className="flex w-24 items-center justify-between">
								<span className="border-none text-left text-xs font-semibold">
									{total.type === 'subtotal'
										? 'Ara Toplam'
										: total.type === 'tax'
										  ? 'KDV Toplamı'
										  : total.type === 'discount'
										    ? 'İndirim Toplamı'
										    : total.type === 'total'
										      ? 'Genel Toplam'
										      : 'Toplam'}
								</span>
								<span>:</span>
							</div>
							<span className="border-none text-right text-sm font-semibold">{total.amount_formatted}</span>
						</div>
					</div>
				))}
			</div>
		</>
	)
}

export default DocumentItemsTable
