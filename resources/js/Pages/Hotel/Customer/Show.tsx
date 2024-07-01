import React, {useEffect, useState} from 'react'
import {PageProps} from './types/show'
import AuthenticatedLayout from '@/Layouts/HotelAuthenticatedLayout'
import {Head, Link, useForm} from '@inertiajs/react'
import Lucide from '@/Components/Lucide'
import CurrencyInput from 'react-currency-input-field'
import {twMerge} from 'tailwind-merge'
import Button from '@/Components/Button'
import Litepicker from '@/Components/Litepicker'
import TomSelect from '@/Components/TomSelect'
import route from 'ziggy-js'
import {FormLabel, FormInput} from '@/Components/Form'
import axios from 'axios'
import dayjs from 'dayjs'
import TransactionsSection from './components/TransactionsSection'

function Show({...props}: PageProps) {
	const [showPaymentForm, setShowPaymentForm] = useState<boolean>(false)
	const {data, setData, post, processing, errors} = useForm({
		customer_id: props.customer.id,
		type: 'income',
		payment_date: dayjs().format('DD.MM.YYYY'),
		bank_id: '',
		currency: 'TRY',
		currency_rate: 1,
		payment_method: '',
		amount: props.customer.remaining_balance < 0 ? Math.abs(props.customer.remaining_balance).toString() : '0',
		description: '',
	})

	useEffect(() => {
		setData((data) => ({...data, amount: '0,00'}))
		if (data.currency !== 'TRY') {
			axios
				.post(route('amount.exchange'), {
					amount: props.customer.remaining_balance < 0 ? Math.abs(props.customer.remaining_balance).toString() : '0',
					currency: data.currency,
				})
				.then((response) => {
					setData((data) => ({
						...data,
						amount: response.data.total,
						currency_rate: response.data.exchange_rate,
					}))
				})
				.catch((error) => {
					console.log(error)
				})
		} else {
			setData((data) => ({
				...data,
				amount: props.customer.remaining_balance < 0 ? Math.abs(props.customer.remaining_balance).toString() : '0',
				currency_rate: 1,
			}))
		}
	}, [data.currency])

	const paymentFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		post(route('hotel.customers.transaction.store', props.customer.id), {
			preserveState: true,
			preserveScroll: true,
			onSuccess: () => {
				setShowPaymentForm(false)
				// setData((data) => ({
				// 	...data,
				// 	payment_date: dayjs().format('DD.MM.YYYY'),
				// 	bank_id: '',
				// 	currency: 'TRY',
				// 	payment_method: '',
				// 	amount: props.customer.remaining_balance < 0 ? Math.abs(props.customer.remaining_balance).toString() : '0',
				// 	description: '',
				// }))
			},
		})
	}
	return (
		<>
			<Head title="Müşterileri" />
			<div className="flex grid-cols-12 flex-col-reverse gap-3 xl:flex-row">
				<div className="w-full xl:w-2/3">
					<div className="box mt-5 grid grid-cols-12 gap-3 px-5 pt-5">
						<Button
							as="a"
							variant="soft-secondary"
							size="sm"
							href={route('hotel.customers.edit', props.customer.id)}
							className="absolute right-5 top-5">
							<Lucide
								icon="PencilLine"
								className="h-4 w-4 stroke-1.5 lg:hidden"
							/>
							<span className="hidden lg:inline-block">Düzenle</span>
						</Button>
						<div className="col-span-12 flex items-center border-b pb-5">
							<Lucide
								icon={props.customer.type === 'individual' ? 'User' : 'Factory'}
								className="me-4 h-12 w-12 stroke-1.5"
							/>
							<span className="text-2xl font-extrabold">{props.customer.title}</span>
						</div>
						<fieldset className="col-span-12 mb-5 rounded-md border bg-slate-50 px-4 py-2 dark:bg-darkmode-400/70">
							<legend className="rounded-md border-primary bg-primary px-2 py-1 font-semibold text-light">Müşteri</legend>
							<Link
								href={route('hotel.customers.edit', props.customer.id)}
								className="text-base font-semibold">
								{props.customer.title}
							</Link>
							<p>
								{props.customer.address} {props.customer.country} {props.customer.city}
							</p>
							<p className="text-sm font-light">Vergi No / TC No : {props.customer.tax_number}</p>
						</fieldset>
					</div>
					<TransactionsSection customer={props.customer} />
				</div>
				<div className="w-full xl:w-1/3">
					<div className="xl:h-full xl:border-l xl:p-5">
						<div className="box flex items-center justify-between p-5">
							<h3 className="font-semibold xl:text-lg 2xl:text-2xl">Bakiye</h3>
							<span className={twMerge(['font-sans font-bold xl:text-xl 2xl:text-3xl', props.customer.remaining_balance < 0 ? 'text-red-600' : 'text-green-700'])}>
								{props.customer.remaining_balance_formatted}
							</span>
						</div>
						<div className="box mt-5 flex flex-col items-center justify-between gap-2 p-5">
							<Button
								variant="primary"
								onClick={() => setShowPaymentForm(!showPaymentForm)}
								className="w-full text-xl font-semibold shadow-md"
								type="button">
								TAHSİLAT EKLE
							</Button>
							<form
								onSubmit={(e) => paymentFormSubmit(e)}
								id="payment-form"
								className={twMerge(['intro-y mt-5 w-full', !errors || (!showPaymentForm && 'hidden')])}>
								<h3 className="mb-5 text-center text-lg font-extrabold"> TAHSİLAT EKLE </h3>
								<div className="form-control">
									<FormLabel htmlFor="payment-date">Tahsilat Tarihi</FormLabel>
									<Litepicker
										id="payment-date"
										name="payment_date"
										data-single-mode="true"
										value={data.payment_date}
										onChange={(e) => setData((data) => ({...data, payment_date: e}))}
										className="w-full text-center"
									/>
									{errors.payment_date && <div className="text-theme-6 mt-2 text-danger">{errors.payment_date}</div>}
								</div>
								<div className="form-control mt-5">
									<FormLabel
										htmlFor="currency"
										className="justify-beetwen flex">
										Döviz Cinsi
									</FormLabel>
									<TomSelect
										id="currency"
										name="currency"
										data-placeholder="Döviz Cinsi"
										value={data.currency}
										onChange={(e) => setData((data) => ({...data, currency: e.toString()}))}
										className="w-full rounded-md">
										<option value="TRY">Türk Lirası</option>
										<option value="USD">Amerikan Doları</option>
										<option value="EUR">Euro</option>
										<option value="GBP">İngiliz Sterlini</option>
										<option value="SAR">Suudi Arabistan Riyali</option>
										<option value="AUD">Avustralya Doları</option>
										<option value="CHF">İsveç Frangı</option>
										<option value="CAD">Kanada Doları</option>
										<option value="KWD">Kuveyt Dinarı</option>
										<option value="JPY">Japon Yeni</option>
										<option value="DKK">Danimarka Kronu</option>
										<option value="SEK">İsveç Kronu</option>
										<option value="NOK">Norveç Kronu</option>
									</TomSelect>
									{errors.currency && <div className="text-theme-6 mt-2 text-danger">{errors.currency}</div>}
								</div>
								<div className="form-control mt-5">
									<FormLabel htmlFor="currency-amount">Meblağ</FormLabel>
									<CurrencyInput
										id="currency-amount"
										allowNegativeValue={false}
										allowDecimals={true}
										decimalSeparator=","
										decimalScale={2}
										suffix={` ${data.currency}` || ' TRY'}
										value={data.amount}
										decimalsLimit={2}
										required={true}
										onValueChange={(value, name, values) => setData((data) => ({...data, amount: values?.float?.toFixed(2) || '0'}))}
										name="amount"
										className="w-full rounded-md border-slate-200 text-right text-xl font-extrabold shadow-sm transition duration-200 ease-in-out placeholder:text-slate-400/90 focus:border-primary focus:border-opacity-40 focus:ring-4 focus:ring-primary focus:ring-opacity-20 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-transparent dark:bg-darkmode-800 dark:placeholder:text-slate-500/80 dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:disabled:border-transparent dark:disabled:bg-darkmode-800/50 [&[readonly]]:cursor-not-allowed [&[readonly]]:bg-slate-100 [&[readonly]]:dark:border-transparent [&[readonly]]:dark:bg-darkmode-800/50"
									/>
									{errors.amount && <div className="text-theme-6 mt-2 text-danger">{errors.amount}</div>}
								</div>
								<div className="form-control mt-5">
									<FormLabel htmlFor="case">Kasa / Banka</FormLabel>
									<TomSelect
										id="case"
										name="bank_id"
										className="w-full"
										options={{
											placeholder: 'Kasa / Banka Seçiniz',
										}}
										value={data.bank_id}
										onChange={(e) => setData((data) => ({...data, bank_id: e.toString()}))}>
										<option>Seçiniz</option>
										{props.banks.map((bank) => (
											<option
												key={bank.id}
												value={bank.id}>
												{bank.name}
											</option>
										))}
									</TomSelect>
									{errors.bank_id && <div className="text-theme-6 mt-2 text-danger">{errors.bank_id}</div>}
								</div>

								<div className="form-control mt-5">
									<FormLabel
										htmlFor="payment-method"
										className="justify-beetwen flex">
										Ödeme Türü
									</FormLabel>
									<TomSelect
										id="payment-method"
										name="payment_method"
										data-placeholder="Ödeme Türü"
										value={data.payment_method}
										onChange={(e) => setData((data) => ({...data, payment_method: e.toString()}))}
										className="w-full rounded-md">
										<option>Seçiniz</option>
										<option value="cash">Nakit</option>
										<option value="credit_card">Kredi Kartı</option>
										<option value="bank_transfer">Banka Havale/EFT</option>
										<option value="virtual_pos">Sanal Pos</option>
									</TomSelect>
									{errors.payment_method && <div className="text-theme-6 mt-2 text-danger">{errors.payment_method}</div>}
								</div>

								<div className="form-control mt-5">
									<FormLabel htmlFor="description">Açıklama</FormLabel>
									<FormInput
										id="payment-description"
										type="text"
										placeholder="Açıklama"
										name="description"
										value={data.description}
										onChange={(e) => setData((data) => ({...data, description: e.target.value}))}
										className="w-full"
									/>
									{errors.description && <div className="text-theme-6 mt-2 text-danger">{errors.description}</div>}
								</div>
								<div className="form-control mt-5 flex justify-end gap-3">
									<Button
										id="payment-cancel"
										className="shadow-md"
										variant="secondary"
										type="button">
										Vazgeç
									</Button>
									<Button
										className="shadow-md"
										variant="primary"
										type="submit">
										Tahsilat Ekle
									</Button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

Show.layout = (page: any) => (
	<AuthenticatedLayout
		breadcrumb={[
			{
				title: 'Dashboard',
				href: route('hotel.dashboard.index'),
			},
			{
				title: 'Müşteriler',
				href: route('hotel.customers.index'),
			},
			{
				title: page.props.customer.title,
				href: route('hotel.customers.show', page.props.customer.id),
			},
		]}
		children={page}
	/>
)

export default Show
