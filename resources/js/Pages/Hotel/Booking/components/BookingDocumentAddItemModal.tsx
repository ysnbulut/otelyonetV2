import React, {Fragment, useEffect, useState} from 'react'
import {FormInput, FormLabel, FormTextarea} from '@/Components/Form'
import CreatableSelect from 'react-select/creatable'
import {DocumentProps, ItemsProps, PageProps, RoomsProps, TaxesProps} from '@/Pages/Hotel/Booking/types/show'
import {Dialog, Transition} from '@headlessui/react'
import Select, {ActionMeta, OnChangeValue} from 'react-select'
import {useForm} from '@inertiajs/react'
import CurrencyInput from 'react-currency-input-field'
import Button from '@/Components/Button'
import Lucide from '@/Components/Lucide'
import {set} from 'lodash'
import LoadingIcon from '@/Components/LoadingIcon'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

interface BookingDocumentAddItemModalProps {
	currency: string
	taxes: TaxesProps[]
	document: DocumentProps
	setDocument: React.Dispatch<React.SetStateAction<DocumentProps>>
	items: ItemsProps[]
	room: RoomsProps
	open: boolean
	onClose: React.Dispatch<React.SetStateAction<boolean>>
}

function BookingDocumentAddItemModal(props: BookingDocumentAddItemModalProps) {
	const MySwal = withReactContent(Swal)
	const [newItem, setNewItem] = useState<boolean>(false)
	const [quantity, setQuantity] = useState<string>('1')
	const [selectedTax, setSelectedTax] = useState<{label: string; value: number}>()
	const {data, setData, errors, setError, clearErrors, post, reset, processing} = useForm({
		item_id: '',
		name: '',
		description: '',
		price: '0',
		quantity: '1',
		tax_name: '',
		tax_rate: '',
		tax: '0',
		total: '0',
		discount: '0',
		grand_total: '0',
	})

	const Toast = MySwal.mixin({
		toast: true,
		position: 'top',
		showConfirmButton: false,
		timer: 3000,
		timerProgressBar: true,
		didOpen: (toast) => {
			toast.addEventListener('mouseenter', MySwal.stopTimer)
			toast.addEventListener('mouseleave', MySwal.resumeTimer)
		},
	})

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		post(route('hotel.documents.item_add', {document: props.document.id}), {
			preserveState: true,
			preserveScroll: true,
			// @ts-ignore
			onSuccess: (response: {props: PageProps}) => {
				props.onClose(false)
				props.setDocument(
					response.props.booking.rooms
						.find((room) => room.id === props.room.id)
						?.documents.find((document) => document.id === props.document.id) || props.document,
				)
				Toast.fire({
					icon: 'success',
					title: 'Ürün folyoya eklendi',
				})
			},
		})
	}

	return (
		<Transition
			appear
			show={props.open}
			as={Fragment}>
			<Dialog
				as="div"
				className="relative z-50"
				onClose={() => {
					props.onClose(false)
				}}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0">
					<div className="fixed inset-0 bg-slate-800/50" />
				</Transition.Child>
				<div className="fixed inset-0 overflow-y-auto">
					<div className="flex min-h-full items-center justify-center p-4 text-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95">
							<form
								className="flex w-full items-center justify-center"
								onSubmit={handleSubmit}>
								<Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-darkmode-400">
									<Dialog.Title
										as="h3"
										className="flex items-center justify-between text-lg font-medium leading-6 text-gray-900">
										<span className="text-dark dark:text-light">
											{props.room.name}'nolu Oda Folyosuna yeni Ürün / Hizmet Ekle
										</span>
										<Button
											rounded
											variant={'soft-dark'}
											className="p-1"
											type="button"
											onClick={() => props.onClose(false)}>
											<Lucide
												icon={'X'}
												className="h-4 w-4"
											/>
										</Button>
									</Dialog.Title>
									<div className="mt-2">
										<div className="grid grid-cols-1 gap-4">
											<div className="grid grid-cols-1 gap-4">
												<div className="grid grid-cols-1 gap-4">
													<div>
														<FormLabel htmlFor="name">Hizmet / Ürün Adı</FormLabel>
														<CreatableSelect
															id="name"
															name="name"
															className="remove-all my-select-container"
															classNamePrefix="my-select"
															isClearable
															isMulti={false}
															styles={{
																input: (base) => ({
																	...base,
																	'input:focus': {
																		boxShadow: 'none',
																	},
																}),
															}}
															options={props.items.map((item) => ({label: item.name, value: item.id}))}
															onChange={(newValue: OnChangeValue<any, any>, actionMeta: ActionMeta<any>) => {
																setQuantity('1')
																if (actionMeta.action === 'select-option') {
																	newValue && setNewItem(false)
																	if (newValue) {
																		const item = props.items.find((item) => item.id === newValue.value)
																		if (item) {
																			setSelectedTax({label: item.tax_name, value: item.tax_rate})
																			setData((data) => ({
																				...data,
																				item_id: item.id.toString(),
																				name: item.name,
																				description: item.description,
																				quantity: '1',
																				price: item.price.toString(),
																				tax: item.tax.toString(),
																				tax_name: item.tax_name,
																				tax_rate: item.tax_rate.toString(),
																				total: item.total_price.toString(),
																				discount: '0',
																				grand_total: item.total_price.toString(),
																			}))
																		}
																	}
																}
																if (actionMeta.action === 'create-option') {
																	newValue && setNewItem(true)
																	newValue &&
																		setData((data) => ({
																			...data,
																			name: newValue.value,
																			description: '',
																			quantity: '1',
																			price: '0',
																			tax: '0',
																			tax_name: '',
																			tax_rate: '',
																			total: '0',
																			discount: '0',
																			grand_total: '0',
																		}))
																}
																if (actionMeta.action === 'clear') {
																	setNewItem(false)
																	setData((data) => ({
																		...data,
																		name: '',
																		description: '',
																		quantity: '1',
																		price: '0',
																		tax: '0',
																		tax_name: '',
																		tax_rate: '',
																		total: '0',
																		discount: '0',
																		grand_total: '0',
																	}))
																}
															}}
														/>
														{errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
													</div>
													{newItem && (
														<div>
															<FormLabel
																htmlFor="description"
																className="block text-sm font-medium">
																Açıklama
															</FormLabel>
															<FormTextarea
																id="description"
																name="description"
																value={data.description}
																onChange={(e) => setData((data) => ({...data, description: e.target.value}))}
															/>
															{errors.description && <span className="text-xs text-red-500">{errors.description}</span>}
														</div>
													)}
													<div>
														<FormLabel
															htmlFor="price"
															className="block text-sm font-medium">
															Birim Fiyat
														</FormLabel>
														<CurrencyInput
															name="price"
															allowNegativeValue={false}
															allowDecimals={true}
															decimalSeparator=","
															decimalScale={2}
															suffix={` ${props.currency}` || ' TRY'}
															decimalsLimit={2}
															required={true}
															id="price"
															value={data.price}
															onValueChange={(value, name, values) => {
																values &&
																	setData((data) => ({
																		...data,
																		price: values.float !== null ? values.float.toFixed(2) : '0',
																		total: (values.float !== null
																			? selectedTax
																				? (1 + selectedTax.value / 100) * values.float * parseFloat(data.quantity)
																				: values.float * parseInt(data.quantity)
																			: 0
																		).toFixed(2),
																	}))
															}}
															className="w-full rounded-md border-slate-200 text-right shadow-sm transition duration-200 ease-in-out placeholder:text-slate-400/90 focus:border-primary focus:border-opacity-40 focus:ring-4 focus:ring-primary focus:ring-opacity-20 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-transparent dark:bg-darkmode-800 dark:placeholder:text-slate-500/80 dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:disabled:border-transparent dark:disabled:bg-darkmode-800/50 [&[readonly]]:cursor-not-allowed [&[readonly]]:bg-slate-100 [&[readonly]]:dark:border-transparent [&[readonly]]:dark:bg-darkmode-800/50"
														/>
														{errors.price && <span className="text-xs text-red-500">{errors.price}</span>}
													</div>
													<div>
														<FormLabel
															htmlFor="quantity"
															className="block text-sm font-medium">
															Miktar
														</FormLabel>
														<FormInput
															type="number"
															name="quantity"
															id="quantity"
															value={quantity}
															onChange={(e) => {
																setQuantity(e.target.value)
																const value = e.target.value === '' ? '1' : e.target.value
																setData((data) => ({
																	...data,
																	quantity: value,
																	total: selectedTax
																		? (
																				(1 + selectedTax.value / 100) *
																				parseInt(value) *
																				parseFloat(data.price)
																		  ).toFixed(2)
																		: (parseFloat(value) * parseFloat(data.price)).toFixed(2),
																	grand_total: selectedTax
																		? (
																				parseFloat(data.price) * parseInt(value) * (1 + selectedTax.value / 100) -
																				parseFloat(data.discount)
																		  ).toFixed(2)
																		: (parseFloat(value) * parseFloat(data.price)).toFixed(2),
																}))
															}}
														/>
														{errors.quantity && <span className="text-xs text-red-500">{errors.quantity}</span>}
													</div>

													<div>
														<FormLabel
															htmlFor="tax_rate"
															className="block text-sm font-medium">
															KDV Oranı
														</FormLabel>
														<Select
															name="tax_rate"
															id="tax_rate"
															className="remove-all my-select-container"
															classNamePrefix="my-select"
															isMulti={false}
															isDisabled={!newItem}
															isClearable
															value={selectedTax}
															styles={{
																input: (base) => ({
																	...base,
																	'input:focus': {
																		boxShadow: 'none',
																	},
																}),
															}}
															options={props.taxes.map((tax) => ({label: tax.name, value: tax.rate}))}
															onChange={(newValue: OnChangeValue<any, any>, actionMeta: ActionMeta<any>) => {
																if (actionMeta.action === 'select-option') {
																	if (newValue) {
																		setSelectedTax(newValue)
																		setData((data) => ({
																			...data,
																			tax: (
																				((parseFloat(data.price) * newValue.value) / 100) *
																				parseInt(data.quantity)
																			).toFixed(2),
																			tax_name: newValue.label,
																			tax_rate: newValue.value.toString(),
																			total: (
																				parseFloat(data.price) *
																				(1 + newValue.value / 100) *
																				parseInt(data.quantity)
																			).toFixed(2),
																			grand_total: (
																				parseFloat(data.price) * (1 + newValue.value / 100) * parseInt(data.quantity) -
																				parseFloat(data.discount)
																			).toFixed(2),
																		}))
																	}
																}
																if (actionMeta.action === 'clear') {
																	setSelectedTax(undefined)
																	setData((data) => ({
																		...data,
																		tax: '0',
																		tax_name: '',
																		tax_rate: '',
																		total: (parseFloat(data.price) * parseInt(data.quantity)).toFixed(2),
																		grand_total: (parseFloat(data.price) * parseInt(data.quantity)).toFixed(2),
																	}))
																}
															}}
														/>
														{errors.tax_rate && <span className="text-xs text-red-500">{errors.tax_rate}</span>}
													</div>
													<div>
														<FormLabel
															htmlFor="total_price"
															className="block text-sm font-medium">
															Toplam Fiyat
														</FormLabel>
														<CurrencyInput
															name="total_price"
															allowNegativeValue={false}
															allowDecimals={true}
															disabled
															decimalSeparator=","
															decimalScale={2}
															suffix={` ${props.currency}` || ' TRY'}
															decimalsLimit={2}
															required={true}
															id="total_price"
															value={data.total}
															className="w-full rounded-md border-slate-200 text-right shadow-sm transition duration-200 ease-in-out placeholder:text-slate-400/90 focus:border-primary focus:border-opacity-40 focus:ring-4 focus:ring-primary focus:ring-opacity-20 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-transparent dark:bg-darkmode-800 dark:placeholder:text-slate-500/80 dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:disabled:border-transparent dark:disabled:bg-darkmode-800/50 [&[readonly]]:cursor-not-allowed [&[readonly]]:bg-slate-100 [&[readonly]]:dark:border-transparent [&[readonly]]:dark:bg-darkmode-800/50"
														/>
														{errors.total && <span className="text-xs text-red-500">{errors.total}</span>}
													</div>
													<div>
														<FormLabel
															htmlFor="discount"
															className="block text-sm font-medium">
															İndirim
														</FormLabel>
														<CurrencyInput
															name="discount"
															allowNegativeValue={false}
															allowDecimals={true}
															decimalSeparator=","
															decimalScale={2}
															suffix={` ${props.currency}` || ' TRY'}
															decimalsLimit={2}
															required={true}
															id="discount"
															value={data.discount}
															onValueChange={(value, name, values) => {
																values &&
																	setData((data) => ({
																		...data,
																		discount: values.float !== null ? values.float.toFixed(2) : '0',
																		grand_total: (
																			parseFloat(data.total) - (values.float !== null ? values.float : 0)
																		).toFixed(2),
																	}))
															}}
															className="w-full rounded-md border-slate-200 text-right shadow-sm transition duration-200 ease-in-out placeholder:text-slate-400/90 focus:border-primary focus:border-opacity-40 focus:ring-4 focus:ring-primary focus:ring-opacity-20 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-transparent dark:bg-darkmode-800 dark:placeholder:text-slate-500/80 dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:disabled:border-transparent dark:disabled:bg-darkmode-800/50 [&[readonly]]:cursor-not-allowed [&[readonly]]:bg-slate-100 [&[readonly]]:dark:border-transparent [&[readonly]]:dark:bg-darkmode-800/50"
														/>
														{errors.discount && <span className="text-xs text-red-500">{errors.discount}</span>}
													</div>
													<div>
														<FormLabel
															htmlFor="grand_total"
															className="block text-sm font-medium">
															Genel Toplam
														</FormLabel>
														<CurrencyInput
															name="grand_total"
															allowNegativeValue={false}
															allowDecimals={true}
															disabled
															decimalSeparator=","
															decimalScale={2}
															suffix={` ${props.currency}` || ' TRY'}
															decimalsLimit={2}
															required={true}
															id="grand_total"
															value={data.grand_total}
															className="w-full rounded-md border-slate-200 text-right shadow-sm transition duration-200 ease-in-out placeholder:text-slate-400/90 focus:border-primary focus:border-opacity-40 focus:ring-4 focus:ring-primary focus:ring-opacity-20 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-transparent dark:bg-darkmode-800 dark:placeholder:text-slate-500/80 dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:disabled:border-transparent dark:disabled:bg-darkmode-800/50 [&[readonly]]:cursor-not-allowed [&[readonly]]:bg-slate-100 [&[readonly]]:dark:border-transparent [&[readonly]]:dark:bg-darkmode-800/50"
														/>
														{errors.grand_total && <span className="text-xs text-red-500">{errors.grand_total}</span>}
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className="mt-5 flex items-center justify-end gap-4">
										<Button
											type="submit"
											disabled={processing}
											variant="soft-secondary">
											{processing ? (
												<LoadingIcon
													icon="tail-spin"
													className="mr-2 h-4 w-4 text-success"
												/>
											) : (
												<Lucide
													icon={'CheckCheck'}
													className="mr-2 h-4 w-4 text-success"
												/>
											)}
											Ekle
										</Button>
									</div>
								</Dialog.Panel>
							</form>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	)
}

export default BookingDocumentAddItemModal
