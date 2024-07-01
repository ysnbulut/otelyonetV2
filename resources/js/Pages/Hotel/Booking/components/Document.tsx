import React, {useState} from 'react'
import DocumentItemsTable from '@/Pages/Hotel/Booking/components/DocumentItemsTable'
import Tippy from '@/Components/Tippy'
import Button from '@/Components/Button'
import Lucide from '@/Components/Lucide'
import BookingDocumentAddItemModal from '@/Pages/Hotel/Booking/components/BookingDocumentAddItemModal'
import {ItemsProps, RoomsProps, TaxesProps, DocumentProps} from '@/Pages/Hotel/Booking/types/show'
import {twMerge} from 'tailwind-merge'

interface DocumentComProps {
	currency: string
	taxes: TaxesProps[]
	items: ItemsProps[]
	room: RoomsProps
	document: DocumentProps
	documentsBalance: {number: number; formatted: string}
	setShowPaymentForm: React.Dispatch<React.SetStateAction<boolean>>
	paymentTypeOptions: {label: string; value: number}[]
	setPaymentDocumentIndex: React.Dispatch<React.SetStateAction<number>>
}

function Document(props: DocumentComProps) {
	const [addDocumentItemModalOpen, setAddDocumentItemModalOpen] = useState<boolean>(false)
	const [document, setDocument] = useState(props.document)
	return (
		<>
			<div className="flex w-full items-center justify-end bg-white px-2 py-0.5 dark:bg-darkmode-600">
				<span className="mr-1 text-xs font-bold">Folyo No : </span>
				<span className="text-xs font-thin">{props.document.number}</span>
			</div>
			<DocumentItemsTable document={document} />
			<div className="flex w-full flex-col text-sm font-semibold">
				<div className="flex items-center justify-end gap-1 rounded-b-lg bg-white px-4 py-2 dark:bg-darkmode-600">
					<div className="flex gap-2">
						{props.document.balance > 0 && (
							<Tippy content="Ürün Ekle">
								<Button
									variant="soft-dark"
									onClick={(e: any) => {
										e.preventDefault()
										props.setShowPaymentForm((prevState) => (prevState ? prevState : true))
										props.setPaymentDocumentIndex(
											props.paymentTypeOptions.findIndex((option) => option.value === props.document.id) || 0,
										)
									}}
									className="p-1 text-xs">
									<Lucide
										icon="Plus"
										className="h-4 w-4 dark:text-white"
									/>
									Ödeme Ekle
								</Button>
							</Tippy>
						)}
						<Tippy content="Ürün Ekle">
							<Button
								variant="soft-dark"
								onClick={(e: any) => {
									e.preventDefault()
									setAddDocumentItemModalOpen(true)
								}}
								className="p-1 text-xs">
								<Lucide
									icon="Plus"
									className="h-4 w-4 dark:text-white"
								/>
							</Button>
						</Tippy>
					</div>
				</div>
				{props.document.payments.length > 0 && (
					<div className="mx-3 rounded-bl-lg bg-white/70 px-3 pb-2 pt-1 dark:bg-darkmode-700/90">
						<h3 className="border-b px-1 pb-2 pt-1 text-xs">Ödemeler</h3>
						<div className="flex flex-col">
							{props.document.payments.map((payment) => (
								<div
									key={payment.id}
									className="flex items-center justify-start border-b py-0.5 last:border-none">
									<span className="mr-2 h-2 w-5 rounded-full bg-slate-200 shadow-inner dark:bg-slate-900/30" />
									<span className="mr-2 text-xs font-thin">{payment.paid_at}</span>
									<span className="text-xs">{payment.amount_formatted}</span>
								</div>
							))}
						</div>
					</div>
				)}
				<div className="flex justify-end">
					<div className="mx-3 min-w-56 max-w-xs rounded-b-lg border-t bg-white/70 px-3 py-1 dark:bg-darkmode-700/90">
						<div className="flex flex-col">
							<div className="flex items-center justify-end border-b last:border-none">
								<span className="mr-2">Bakiye :</span>
								<span
									className={twMerge('text-sm', props.documentsBalance.number > 0 ? 'text-danger' : 'text-success')}>
									{props.documentsBalance.formatted}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<BookingDocumentAddItemModal
				currency={props.currency}
				taxes={props.taxes}
				document={document}
				setDocument={setDocument}
				items={props.items}
				room={props.room}
				open={addDocumentItemModalOpen}
				onClose={setAddDocumentItemModalOpen}
			/>
		</>
	)
}

export default Document
