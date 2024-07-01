import React, {useState} from 'react'
import DocumentItemsTable from '@/Pages/Hotel/Booking/components/DocumentItemsTable'
import Tippy from '@/Components/Tippy'
import Button from '@/Components/Button'
import Lucide from '@/Components/Lucide'
import BookingDocumentAddItemModal from '@/Pages/Hotel/Booking/components/BookingDocumentAddItemModal'
import {DocumentProps, ItemsProps, RoomsProps, TaxesProps} from '@/Pages/Hotel/Booking/types/show'
import Document from '@/Pages/Hotel/Booking/components/Document'

interface BookingRoomDocumentsProps {
	currency: string
	taxes: TaxesProps[]
	items: ItemsProps[]
	room: RoomsProps
	documentsBalance: {[key: string]: {number: number; formatted: string}}
	setShowPaymentForm: React.Dispatch<React.SetStateAction<boolean>>
	paymentTypeOptions: {label: string; value: number}[]
	setPaymentDocumentIndex: React.Dispatch<React.SetStateAction<number>>
}

function BookingRoomDocuments(props: BookingRoomDocumentsProps) {
	return (
		<div className="intro-y mt-4 flex flex-col items-start justify-between justify-items-start text-dark dark:text-light">
			<h3 className="w-full rounded-t-lg border-b bg-white px-5 py-1 text-center text-sm font-semibold lg:flex-row lg:gap-2 dark:bg-darkmode-600">
				{props.room.name}'nolu oda folyoları
			</h3>
			{props.room.documents.map((document, index) => (
				<Document
					key={index}
					document={document}
					currency={props.currency}
					taxes={props.taxes}
					items={props.items}
					room={props.room}
					documentsBalance={props.documentsBalance[document.id]}
					setShowPaymentForm={props.setShowPaymentForm}
					paymentTypeOptions={props.paymentTypeOptions}
					setPaymentDocumentIndex={props.setPaymentDocumentIndex}
				/>
			))}
		</div>
	)
}

export default BookingRoomDocuments
