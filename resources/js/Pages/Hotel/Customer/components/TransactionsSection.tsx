import React, {useEffect, useState} from 'react'
import handleViewport, {type InjectedViewportProps} from 'react-in-viewport'
import axios, {AxiosResponse} from 'axios'
import route from 'ziggy-js'
import {twMerge} from 'tailwind-merge'
import {Customer, Transactions} from '../types/show'
import Button from '@/Components/Button'
import LoadingIcon from '@/Components/LoadingIcon'

function Transactionsx(props: InjectedViewportProps<HTMLDivElement> & {customer: Customer}) {
	const {inViewport, forwardedRef} = props
	const [customerTransactions, setCustomerTransactions] = useState<Transactions | null>(null)
	const [cursor, setCursor] = useState<string | null>(null)
	const [page, setPage] = useState<number>(1)
	const [loader, setLoader] = useState<boolean>(false)
	const [loadMoreText, setLoadMoreText] = useState<string>('Daha Fazla')
	const [loadMoreDisabled, setLoadMoreDisabled] = useState<boolean>(false)

	useEffect(() => {
		if (inViewport) {
			axios
				.get<any, AxiosResponse<Transactions>>(route('hotel.customers.transactions', props.customer.id))
				.then((response) => {
					setCustomerTransactions(response.data)
					setPage(page + 1)
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
			axios
				.get<any, AxiosResponse<Transactions>>(
					route('hotel.customers.transactions', {customer: props.customer.id, page: page}),
				)
				.then((response) => {
					setCustomerTransactions((prevState) => {
						if (prevState) {
							return {
								...prevState,
								data: [...prevState.data, ...response.data.data],
							}
						}
						return null
					})

					if (response.data.current_page === response.data.last_page) {
						setLoadMoreDisabled(true)
						setLoadMoreText('Daha Fazla Yok')
					} else {
						setPage(page + 1)
					}
				})
			setLoader(false)
		}
	}

	return (
		<div
			ref={forwardedRef}
			className="mx-3 rounded-b-lg bg-slate-50 p-5 dark:bg-darkmode-400/70">
			<ul>
				{customerTransactions && customerTransactions.data.length > 0 ? (
					customerTransactions.data.map((transaction, index) => {
						return (
							<li
								key={index}
								className="flex items-center justify-start gap-3 border-b py-2 text-slate-500 last:border-b-0">
								<p className="whitespace-pre-wrap break-words">
									<span className="text-base font-semibold">{transaction.date} </span>
									<span className="text-xs font-light">Tarihinde </span>
									{/*<span className="text-sm font-semibold">{transaction.type} </span>*/}
									<span
										className={twMerge([
											'text-green-700',
											transaction.type === 'document' && 'text-danger',
											'text-lg',
											'whitespace-pre-wrap break-words font-bold',
										])}>
										{transaction.amount}
									</span>
									<span className="itelic ml-2 text-xs font-light">{transaction.info}</span>
								</p>
							</li>
						)
					})
				) : (
					<li className="flex items-center justify-start gap-2 text-slate-500">
						<span className="text-base font-semibold">Henüz ödeme yapılmamış.</span>
					</li>
				)}
			</ul>
			<div className="intro-y mt-3 flex flex-wrap items-center sm:flex-row sm:flex-nowrap">
				<Button
					onClick={() => handleLoadMore()}
					variant="outline-secondary"
					className="intro-x block w-full rounded-md border border-dotted border-slate-400 py-3 text-center font-light text-slate-500 dark:border-darkmode-300"
					disabled={loadMoreDisabled}>
					{loadMoreText}
					{loader && (
						<LoadingIcon
							icon="oval"
							color="gray"
							className="ml-2 h-4 w-4"
						/>
					)}
				</Button>
			</div>
		</div>
	)
}

const TransactionsSection = handleViewport(Transactionsx, undefined, {disconnectOnLeave: true})

export default TransactionsSection
