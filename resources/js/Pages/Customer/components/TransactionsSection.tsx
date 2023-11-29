import React, { useEffect, useState } from 'react'
import handleViewport, { type InjectedViewportProps } from 'react-in-viewport'
import axios, { AxiosResponse } from 'axios'
import route from 'ziggy-js'
import { twMerge } from 'tailwind-merge'
import { Customer, Transactions } from '../types/show'
import Button from '@/Components/Button'
import LoadingIcon from '@/Components/LoadingIcon'

function Transactionsx(props: InjectedViewportProps<HTMLDivElement> & { customer: Customer }) {
  const { inViewport, forwardedRef } = props
  const [customerTransactions, setCustomerTransactions] = useState<Transactions | null>(null)
  const [cursor, setCursor] = useState<string | null>(null)
  const [page, setPage] = useState<number>(1)
  const [loader, setLoader] = useState<boolean>(false)
  const [loadMoreText, setLoadMoreText] = useState<string>('Daha Fazla')
  const [loadMoreDisabled, setLoadMoreDisabled] = useState<boolean>(false)

  useEffect(() => {
    if (inViewport) {
      axios.get<any, AxiosResponse<Transactions>>(route('hotel.customers.transactions', props.customer.id)).then((response) => {
        setCustomerTransactions(response.data)
        setPage(page+1)
        if (response.data.current_page === response.data.last_page) {
          setLoadMoreDisabled(true)
          setLoadMoreText('Daha Fazla Yok')
        }
      })
    }
  }, [inViewport])

  const handleLoadMore = () => {
    if (page !== 1) {
      setLoader(true)
      axios.get<any, AxiosResponse<Transactions>>(route('hotel.customers.transactions', { customer:  props.customer.id, page: page })).then((response) => {
        setCustomerTransactions((prevState) => {
          if (prevState) {
            return {
              ...prevState,
              data: [...prevState.data, ...response.data.data]
            }
          }
          return null
        });

        if (response.data.current_page === response.data.last_page) {
          setLoadMoreDisabled(true)
          setLoadMoreText('Daha Fazla Yok')
        } else {
          setPage(page+1)
        }
      })
      setLoader(false)
    }
  }

  return (
    <div ref={forwardedRef} className='bg-slate-50 dark:bg-darkmode-400/70 rounded-b-lg mx-3 p-5'>
      <ul>
        {(customerTransactions && customerTransactions.data.length > 0) ?
          customerTransactions.data.map((transaction, index) => {
            return (
              <li key={index}
                  className='flex justify-start gap-3 items-center text-slate-500 py-2 border-b last:border-b-0'>
                <p className='whitespace-pre-wrap break-words'>
                  <span className='text-base font-semibold'>{transaction.date} </span>
                  <span className='text-xs font-light'>Tarihli </span>
                  <span className='text-sm font-semibold'>{transaction.type} </span>
                  <span
                    className={twMerge(['text-green-700', transaction.type === 'Rezervasyon' && 'text-danger', 'text-lg', 'font-bold whitespace-pre-wrap break-words'])}>{transaction.amount} </span>
                  <span className='text-xs font-light itelic'>{transaction.info}</span>
                </p>
              </li>
            )
          })
          : (<li className='flex justify-start gap-2 items-center text-slate-500'>
            <span className='text-base font-semibold'>Henüz ödeme yapılmamış.</span>
          </li>)}
      </ul>
      <div className='flex flex-wrap items-center mt-3 intro-y sm:flex-row sm:flex-nowrap'>
        <Button onClick={() => handleLoadMore()} variant="outline-secondary" className="block w-full py-3 text-center border border-dotted rounded-md intro-x border-slate-400 dark:border-darkmode-300 text-slate-500 font-light" disabled={loadMoreDisabled}>
          {loadMoreText}
          {loader && (<LoadingIcon icon='oval' color='gray' className='w-4 h-4 ml-2' />)}
        </Button>
      </div>
    </div>
  )
}

const TransactionsSection = handleViewport(Transactionsx, undefined, { disconnectOnLeave: true })

export default TransactionsSection
