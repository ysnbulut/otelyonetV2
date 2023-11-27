import React, { useEffect, useRef, useState } from 'react'
import Table from '@/Components/Table'
import Pagination from '@/Components/Pagination'
import Lucide from '@/Components/Lucide'
import { FormSelect } from '@/Components/Form'
import { Bookings } from './index'
import handleViewport, { type InjectedViewportProps } from 'react-in-viewport'
import Alert from '@/Components/Alert'
import axios, { AxiosResponse } from 'axios'
import Button from '../../Components/Button'
import LoadingIcon from '../../Components/LoadingIcon'
import { Simulate } from 'react-dom/test-utils'
import load = Simulate.load

function UpcomingBookings(props: InjectedViewportProps<HTMLDivElement>) {
    const { inViewport, forwardedRef } = props
    const [bookings, setBookings] = useState<Bookings | null>(null);
    const [cursor, setCursor] = useState<string | null>(null)
    const [loader, setLoader] = useState<boolean>(false)
    const [loadMoreText, setLoadMoreText] = useState<string>('Daha Fazla')
    const [loadMoreDisabled, setLoadMoreDisabled] = useState<boolean>(false)
    useEffect(() => {
        if (inViewport) {
            axios.get<any, AxiosResponse<Bookings>>(route('hotel.bookings.upcoming')).then((response) => {
                setBookings(response.data);
                setCursor(response.data.next_cursor)
            })
        }
    }, [inViewport]);

    const handleLoadMore = () => {
        if (cursor !== null) {
            setLoader(true)
            axios.get<any, AxiosResponse<Bookings>>(route('hotel.bookings.upcoming', { cursor: cursor })).then((response) => {
                setBookings((prevState) => {
                    if (prevState) {
                        return {
                            ...prevState,
                            data: [...prevState.data, ...response.data.data]
                        }
                    }
                    return null
                });
                setCursor(response.data.next_cursor)
                if (response.data.next_cursor === null) {
                    setLoadMoreDisabled(true)
                    setLoadMoreText('Daha Fazla Yok')
                }
            })
            setLoader(false)
        }
    }
    console.log('zaa')
    return (<div ref={forwardedRef} className='col-span-12 mt-6'>
        {(bookings && bookings.data.length > 0) ? (<>
            <div className='items-center block h-10 intro-y sm:flex'>
                <h2 className='mr-5 text-lg font-medium truncate'>
                    Gelecek Rezervasyonlar
                </h2>
            </div>
            <div className='mt-8 overflow-auto intro-y lg:overflow-visible sm:mt-0'>
                <Table className='border-spacing-y-[10px] border-separate sm:mt-2'>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th className='border-b-0 whitespace-nowrap'>
                                GİRİŞ/ÇIKIŞ TARİHİ
                            </Table.Th>
                            <Table.Th className='border-b-0 whitespace-nowrap'>
                                ODALAR
                            </Table.Th>
                            <Table.Th className='text-center border-b-0 whitespace-nowrap'>
                                MÜŞTERİ
                            </Table.Th>
                            <Table.Th className='text-center border-b-0 whitespace-nowrap'>
                                TOPLAM TUTAR
                            </Table.Th>
                            <Table.Th className='text-center border-b-0 whitespace-nowrap'>
                                BAKİYE
                            </Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {bookings.data.map((booking) => (<Table.Tr key={booking.id} className='intro-y'>
                            <Table.Td
                                className='first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]'>
                                <div className='flex whitespace-nowrap'>
                                    {booking.check_in} - {booking.check_out}
                                </div>
                            </Table.Td>
                            <Table.Td
                                className='first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]'>
                                <div className='flex'>
                                    {booking.rooms}
                                </div>
                            </Table.Td>
                            <Table.Td
                                className='first:rounded-l-md last:rounded-r-md text-center bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]'>
                                {booking.customer}
                            </Table.Td>
                            <Table.Td
                                className='first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]'>
                                {booking.amount}
                            </Table.Td>
                            <Table.Td
                                className='first:rounded-l-md last:rounded-r-md w-56 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400'>
                                <div className='flex items-center justify-center'>
                                    <div className='w-2 h-2 bg-primary rounded-full mr-2' />
                                    {booking.remaining_balance_formatted}
                                </div>
                            </Table.Td>
                        </Table.Tr>))}
                    </Table.Tbody>
                </Table>
            </div>
            <div className='flex flex-wrap items-center mt-3 intro-y sm:flex-row sm:flex-nowrap'>
                <Button onClick={() => handleLoadMore()} variant="outline-secondary" className="block w-full py-3 text-center border border-dotted rounded-md intro-x border-slate-400 dark:border-darkmode-300 text-slate-500 font-light" disabled={loadMoreDisabled}>
                    {loadMoreText}
                    {loader && (<LoadingIcon icon='oval' color='gray' className='w-4 h-4 ml-2' />)}
                </Button>
            </div>
        </>) : (<Alert variant='outline-dark' className='flex items-center mb-2'>
            {({ dismiss }) => (<>
                    <Lucide icon='AlertTriangle' className='w-6 h-6 mr-2' />{' '}
                    Bugün ve bugünden sonrası için rezervasyon bulunamadı.
                    <Alert.DismissButton type='button' className='btn-close' onClick={dismiss} aria-label='Close'>
                        <Lucide icon='X' className='w-4 h-4' />
                    </Alert.DismissButton>
                </>)}
        </Alert>)}
    </div>)
}

const UpcomingBokingsSection = handleViewport(UpcomingBookings, undefined, { disconnectOnLeave: true })

export default UpcomingBokingsSection
