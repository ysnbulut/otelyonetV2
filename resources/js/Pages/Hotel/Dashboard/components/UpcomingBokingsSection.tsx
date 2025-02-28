import React, {useEffect, useState} from 'react'
import Table from '@/Components/Table'
import Lucide from '@/Components/Lucide'
import {Bookings} from '../types'
import handleViewport, {type InjectedViewportProps} from 'react-in-viewport'
import Alert from '@/Components/Alert'
import axios, {AxiosResponse} from 'axios'
import Button from '@/Components/Button'
import LoadingIcon from '@/Components/LoadingIcon'

function UpcomingBookings(props: InjectedViewportProps<HTMLDivElement>) {
	const {inViewport, forwardedRef} = props
	const [bookings, setBookings] = useState<Bookings | null>(null)
	const [cursor, setCursor] = useState<string | null>(null)
	const [loader, setLoader] = useState<boolean>(false)
	const [loadMoreText, setLoadMoreText] = useState<string>('Daha Fazla')
	const [loadMoreDisabled, setLoadMoreDisabled] = useState<boolean>(false)
	useEffect(() => {
		if (inViewport) {
			axios.get<any, AxiosResponse<Bookings>>(route('hotel.bookings.upcoming')).then((response) => {
				setBookings(response.data)
				setCursor(response.data.next_cursor)
				if (response.data.next_cursor === null) {
					setLoadMoreDisabled(true)
					setLoadMoreText('Daha Fazla Yok')
				}
			})
		}
	}, [inViewport])

	const handleLoadMore = () => {
		if (cursor !== null) {
			setLoader(true)
			axios.get<any, AxiosResponse<Bookings>>(route('hotel.bookings.upcoming', {cursor: cursor})).then((response) => {
				setBookings((prevState) => {
					if (prevState) {
						return {
							...prevState,
							data: [...prevState.data, ...response.data.data],
						}
					}
					return null
				})
				setCursor(response.data.next_cursor)
				if (response.data.next_cursor === null) {
					setLoadMoreDisabled(true)
					setLoadMoreText('Daha Fazla Yok')
				}
			})
			setLoader(false)
		}
	}

	return (
		<div
			ref={forwardedRef}
			className="col-span-12 mt-6">
			{bookings && bookings.data.length > 0 ? (
				<>
					<div className="intro-y block h-10 items-center sm:flex">
						<h2 className="mr-5 truncate text-lg font-medium">Gelecek Rezervasyonlar</h2>
					</div>
					<div className="intro-y mt-8 overflow-auto sm:mt-0 lg:overflow-visible">
						<Table
							id="responsive-table"
							className="border-separate border-spacing-y-[10px] sm:mt-2">
							<Table.Thead>
								<Table.Tr>
									<Table.Th className="whitespace-nowrap border-b-0">GİRİŞ/ÇIKIŞ TARİHİ</Table.Th>
									<Table.Th className="whitespace-nowrap border-b-0">ODALAR</Table.Th>
									<Table.Th className="whitespace-nowrap border-b-0">MÜŞTERİ</Table.Th>
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody className="divide-y-[0.7rem] divide-transparent">
								{bookings.data.map((booking) => (
									<Table.Tr
										key={booking.id}
										className="intro-y">
										<Table.Td
											dataLabel="Giriş Çıkış Tarihi"
											className="w-full rounded-t-md bg-white lg:w-40 lg:shadow-[20px_3px_20px_#0000000b] lg:first:rounded-l-md lg:last:rounded-r-md dark:bg-darkmode-600">
											<div className="flex whitespace-nowrap">
												{booking.check_in} - {booking.check_out}
											</div>
										</Table.Td>
										<Table.Td
											dataLabel="Oda"
											className="border-b-0 bg-white shadow-[20px_3px_20px_#0000000b] first:rounded-l-md last:rounded-r-md dark:bg-darkmode-600">
											{booking.rooms}
										</Table.Td>
										<Table.Td
											dataLabel="Müşteri"
											className="w-full rounded-b-md bg-white lg:shadow-[20px_3px_20px_#0000000b] lg:first:rounded-l-md lg:last:rounded-r-md lg:last:rounded-bl-none dark:bg-darkmode-600">
											{booking.customer}
										</Table.Td>
									</Table.Tr>
								))}
							</Table.Tbody>
						</Table>
					</div>
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
				</>
			) : (
				<Alert
					variant="outline-dark"
					className="mb-2 flex items-center">
					{({dismiss}) => (
						<>
							<Lucide
								icon="AlertTriangle"
								className="mr-2 h-6 w-6"
							/>{' '}
							Bugün ve bugünden sonrası için rezervasyon bulunamadı.
							<Alert.DismissButton
								type="button"
								className="btn-close"
								onClick={dismiss}
								aria-label="Close">
								<Lucide
									icon="X"
									className="h-4 w-4"
								/>
							</Alert.DismissButton>
						</>
					)}
				</Alert>
			)}
		</div>
	)
}

const UpcomingBokingsSection = handleViewport(UpcomingBookings, undefined, {disconnectOnLeave: true})

export default UpcomingBokingsSection
