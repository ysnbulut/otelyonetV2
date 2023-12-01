import React, { useEffect, useState } from 'react'
import { PageProps } from './types/show'
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout'
import { Head, Link, useForm } from '@inertiajs/react'
import Lucide from '../../Components/Lucide'
import CurrencyInput from 'react-currency-input-field'
import { twMerge } from 'tailwind-merge'
import Button from '../../Components/Button'
import Litepicker from '../../Components/Litepicker'
import TomSelect from '../../Components/TomSelect'
import route from 'ziggy-js'
import { FormLabel, FormInput } from '../../Components/Form'
import axios from 'axios'
import dayjs from 'dayjs'
import TransactionsSection from './components/TransactionsSection'

function Show({ ...props }: PageProps) {

  const [showPaymentForm, setShowPaymentForm] = useState<boolean>(false)
  const { data, setData, post, processing, errors } = useForm(
    {
      customer_id: props.customer.id,
      payment_date: dayjs().format('DD.MM.YYYY'),
      case_and_banks_id: '',
      currency: 'TRY',
      payment_method: '',
      currency_amount: props.customer.remaining_balance < 0 ? Math.abs(props.customer.remaining_balance).toString() : '0',
      description: '',
    })

  useEffect(() => {
    setData(data => ({ ...data, currency_amount: '0,00' }))
    if (data.currency !== 'TRY') {
      axios.post(route('amount.exchange'), {
        amount: props.customer.remaining_balance < 0 ? Math.abs(props.customer.remaining_balance).toString() : '0',
        currency: data.currency,
      }).then((response) => {
        setData(data => ({ ...data, currency_amount: response.data.amount }))
      }).catch((error) => {
        console.log(error)
      })
    } else {
      setData(data => ({
        ...data,
        currency_amount: props.customer.remaining_balance < 0 ? Math.abs(props.customer.remaining_balance).toString() : '0',
      }))
    }
  }, [data.currency])


  const paymentFormSubmit = (e: any) => {
    e.preventDefault()
    post(route('hotel.customer_payments.store'), {
      onSuccess: () => {
        setShowPaymentForm(false)
        setData(data => ({
          ...data,
          payment_date: dayjs().format('DD.MM.YYYY'),
          case_and_banks_id: '',
          currency: 'TRY',
          payment_method: '',
          currency_amount: props.customer.remaining_balance < 0 ? Math.abs(props.customer.remaining_balance).toString() : '0',
          description: '',
        }))
      },
    })
  }
  return (<AuthenticatedLayout
    user={props.auth.user}
    role={props.auth.role}
    permissions={props.auth.permissions}
    pricingPolicy={props.auth.pricing_policy}
  >
    <Head title='Müşteriler' />
    <div className='flex flex-col-reverse xl:flex-row grid-cols-12 gap-3'>
      <div className='w-full xl:w-2/3'>
        <div className='box mt-5 px-5 pt-5 grid grid-cols-12 gap-3'>
          <Button as='a' variant='soft-secondary' size="sm" href={route('hotel.customers.edit', props.customer.id)} className='absolute top-5 right-5'>
            <Lucide icon='PencilLine' className='h-4 w-4 stroke-1.5 lg:hidden' />
            <span className="hidden lg:inline-block">Düzenle</span>
          </Button>
          <div className='col-span-12 flex items-center pb-5 border-b'>
            <Lucide icon={props.customer.type === 'individual' ? 'User' : 'Factory'}
                    className='h-12 w-12 me-4 stroke-1.5' />
            <span className='text-2xl font-extrabold'>{props.customer.title}</span>
          </div>
          <fieldset className='col-span-12 py-2 px-4 mb-5 border rounded-md bg-slate-50 dark:bg-darkmode-400/70'>
            <legend className='bg-primary px-2 py-1 border-primary text-light font-semibold rounded-md'>
              Müşteri
            </legend>
            <Link href={route('hotel.customers.edit', props.customer.id)}
                  className='text-base font-semibold'>
              {props.customer.title}
            </Link>
            <p>{props.customer.address} {props.customer.country} {props.customer.city}</p>
            <p className='font-light text-sm'>Vergi No / TC No : {props.customer.tax_number}</p>
          </fieldset>
        </div>
        <TransactionsSection customer={props.customer} />
      </div>
      <div className='w-full xl:w-1/3'>
        <div className='xl:border-l xl:p-5 xl:h-full'>
          <div className='p-5 box flex justify-between items-center'>
            <h3 className='xl:text-lg 2xl:text-2xl font-semibold'>Bakiye</h3>
            <span
              className={twMerge(['xl:text-xl 2xl:text-3xl font-bold font-sans', props.customer.remaining_balance < 0 ? 'text-red-600' : 'text-green-700'])}>{props.customer.remaining_balance_formatted}</span>
          </div>
          <div className='mt-5 p-5 box flex flex-col gap-2 justify-between items-center'>
            <Button variant={props.customer.remaining_balance < 0 ? 'primary' : 'soft-dark'}
                    onClick={() => props.customer.remaining_balance < 0 && setShowPaymentForm(!showPaymentForm) }
                    className='shadow-md w-full text-xl font-semibold' type="button" disabled={props.customer.remaining_balance == 0}>TAHSİLAT EKLE</Button>
            <form onSubmit={(e) => paymentFormSubmit(e)} id='payment-form'
                  className={twMerge(['intro-y w-full mt-5', !errors || !showPaymentForm && 'hidden'])}>
              <h3 className='font-extrabold text-center text-lg mb-5'> TAHSİLAT EKLE </h3>
              <div className='form-control'>
                <FormLabel htmlFor='payment-date'>Tahsilat Tarihi</FormLabel>
                <Litepicker id='payment-date' name='payment_date' data-single-mode='true'
                            value={data.payment_date}
                            onChange={(e) => setData(data => ({ ...data, payment_date: e }))}
                            className='text-center w-full' />
                {errors.payment_date &&
                  (<div className='text-theme-6 mt-2 text-danger'>{errors.payment_date}</div>)}
              </div>
              <div className='form-control mt-5'>
                <FormLabel htmlFor='currency'
                           className='justify-beetwen flex'>Döviz Cinsi
                </FormLabel>
                <TomSelect id='currency'
                           name='currency'
                           data-placeholder='Döviz Cinsi'
                           value={data.currency}
                           onChange={(e) => setData(data => ({ ...data, currency: e.toString() }))}
                           className='w-full rounded-md'>
                  <option value='TRY'>Türk Lirası</option>
                  <option value='USD'>Amerikan Doları</option>
                  <option value='EUR'>Euro</option>
                  <option value='GBP'>İngiliz Sterlini</option>
                  <option value='SAR'>Suudi Arabistan Riyali</option>
                  <option value='AUD'>Avustralya Doları</option>
                  <option value='CHF'>İsveç Frangı</option>
                  <option value='CAD'>Kanada Doları</option>
                  <option value='KWD'>Kuveyt Dinarı</option>
                  <option value='JPY'>Japon Yeni</option>
                  <option value='DKK'>Danimarka Kronu</option>
                  <option value='SEK'>İsveç Kronu</option>
                  <option value='NOK'>Norveç Kronu</option>
                </TomSelect>
                {errors.currency && (<div className='text-theme-6 mt-2 text-danger'>{errors.currency}</div>)}
              </div>
              <div className='form-control mt-5'>
                <FormLabel htmlFor='currency-amount'>Meblağ</FormLabel>
                <CurrencyInput id='currency-amount'
                               allowNegativeValue={false}
                               allowDecimals={true}
                               decimalSeparator=','
                               decimalScale={2}
                               suffix={` ${data.currency}` || ' TRY'}
                               value={data.currency_amount}
                               decimalsLimit={2}
                               required={true}
                               onValueChange={(value) => setData(data => ({ ...data, currency_amount: value || '0' }))}
                               name='currency_amount'
                               className='w-full text-right font-extrabold text-xl disabled:bg-slate-100 disabled:cursor-not-allowed dark:disabled:bg-darkmode-800/50 dark:disabled:border-transparent [&[readonly]]:bg-slate-100 [&[readonly]]:cursor-not-allowed [&[readonly]]:dark:bg-darkmode-800/50 [&[readonly]]:dark:border-transparent transition duration-200 ease-in-out border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary focus:border-opacity-40 dark:bg-darkmode-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:placeholder:text-slate-500/80' />
                {errors.currency_amount && (
                  <div className='text-theme-6 mt-2 text-danger'>{errors.currency_amount}</div>)}
              </div>
              <div className='form-control mt-5'>
                <FormLabel htmlFor='case'>Kasa / Banka</FormLabel>
                <TomSelect id='case' name='case_and_banks_id' className='w-full'
                           value={data.case_and_banks_id}
                           onChange={(e) => setData(data => ({ ...data, case_and_banks_id: e.toString() }))}
                           placeholder='Kasa / Banka Seçiniz'>
                  <option>Seçiniz</option>
                  {props.case_and_banks.map((case_and_bank) => (<option key={case_and_bank.id} value={case_and_bank.id}>{case_and_bank.name}</option>))}
                </TomSelect>
                {errors.case_and_banks_id && (
                  <div className='text-theme-6 mt-2 text-danger'>{errors.case_and_banks_id}</div>)}
              </div>

              <div className='form-control mt-5'>
                <FormLabel htmlFor='payment-method'
                           className='justify-beetwen flex'>Ödeme Türü
                </FormLabel>
                <TomSelect id='payment-method'
                           name='payment_method'
                           data-placeholder='Ödeme Türü'
                           value={data.payment_method}
                           onChange={(e) => setData(data => ({ ...data, payment_method: e.toString() }))}
                           className='w-full rounded-md'>
                  <option>Seçiniz</option>
                  <option value='cash'>Nakit</option>
                  <option value='credit_card'>Kredi Kartı</option>
                  <option value='bank_transfer'>Banka Havale/EFT</option>
                </TomSelect>
                {errors.payment_method && (
                  <div className='text-theme-6 mt-2 text-danger'>{errors.payment_method}</div>)}
              </div>

              <div className='form-control mt-5'>
                <FormLabel htmlFor='description'>Açıkalama</FormLabel>
                <FormInput id='payment-description'
                           type='text'
                           placeholder='Açıklama'
                           name='description'
                           value={data.description}
                           onChange={(e) => setData(data => ({ ...data, description: e.target.value }))}
                           className='w-full' />
                {errors.description && (<div className='text-theme-6 mt-2 text-danger'>{errors.description}</div>)}
              </div>
              <div className='form-control mt-5 flex justify-end gap-3'>
                <Button id='payment-cancel' className='shadow-md'
                        variant='secondary' type='button'> Vazgeç
                </Button>
                <Button className='shadow-md'
                        variant='primary'
                        type='submit'> Tahsilat Ekle
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </AuthenticatedLayout>)
}

export default Show
