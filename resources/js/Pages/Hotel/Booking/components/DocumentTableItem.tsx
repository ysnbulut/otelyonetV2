import React from 'react'
import {DocumentItemsProps} from '@/Pages/Hotel/Booking/types/show'

interface DocumentTableItemProps {
	item: DocumentItemsProps
}

function DocumentTableItem(props: DocumentTableItemProps) {
	return (
		<tr className="border-b">
			<td
				data-label="Hizmet / Ürün Adı"
				style={{paddingLeft: '0.80rem', paddingRight: '0.50rem', textAlign: 'left'}}
				className="border-none text-xs">
				{props.item.name}
			</td>
			<td
				data-label="Miktar"
				style={{paddingLeft: '0.50rem', paddingRight: '0.50rem', textAlign: 'center'}}
				className="border-none text-xs">
				{props.item.quantity}
			</td>
			<td
				data-label="Birim Fiyat"
				style={{paddingLeft: '0.50rem', paddingRight: '0.50rem', textAlign: 'right', textWrap: 'nowrap'}}
				className="border-none text-xs">
				{props.item.price_formatted}
			</td>
			<td
				data-label="Kdv Oranı"
				style={{paddingLeft: '0.50rem', paddingRight: '0.50rem', textAlign: 'right', textWrap: 'nowrap'}}
				className="border-none text-xs">
				%{props.item.tax_rate}
			</td>
			<td
				data-label="Kdv Tutarı"
				style={{paddingLeft: '0.50rem', paddingRight: '0.50rem', textAlign: 'right', textWrap: 'nowrap'}}
				className="border-none text-xs">
				{props.item.tax_formatted}
			</td>
			<td
				data-label="Kimlik No"
				style={{paddingLeft: '0.50rem', paddingRight: '0.80rem', textAlign: 'right', textWrap: 'nowrap'}}
				className="border-none text-xs">
				{props.item.total_formatted}
			</td>
		</tr>
	)
}

export default DocumentTableItem
