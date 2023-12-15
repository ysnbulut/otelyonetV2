import React, { useState } from 'react'
import { Head, Link } from '@inertiajs/react'
import Button from '@/Components/Button'
import { FormInput, FormSelect } from '@/Components/Form'
import Lucide from '@/Components/Lucide'
import Table from '@/Components/Table'
import Pagination from '@/Components/Pagination'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { PageProps } from '@/Pages/Booking/types'
import { Inertia } from '@inertiajs/inertia'
import { twMerge } from 'tailwind-merge'

function Index(props: PageProps) {
  const [searchValue, setSearchValue] = useState<any>(props.filters.search || '')
  const [perPage, setPerPage] = useState(props.bookings.per_page || 10)

  const handleSearch = (e: any): void => {
    e.preventDefault()
    setSearchValue(e.target.value)
  }

  const handleKeyDown = (e: any): void => {
    if (e.key === 'Enter') {
      Inertia.get(route('hotel.bookings.index'), { search: searchValue }, {
        replace: false,
        preserveState: true,
        only: ['customers'],
      })
    }
  }

  const handlePerPage = (e: any): void => {
    Inertia.get(route('hotel.bookings.index'), { per_page: e.target.value }, {
      replace: true,
      preserveState: false,
    });
    setPerPage(e.target.value)
  }

  return (<AuthenticatedLayout
    user={props.auth.user}
    role={props.auth.role}
    permissions={props.auth.permissions}
    pricingPolicy={props.auth.pricing_policy}
    // header={<h2 className='font-semibold text-xl text-gray-800 leading-tight'>asdasdas</h2>}
  >
    <Head title='Müşteriler' />
    <h2 className='mt-10 text-lg font-medium intro-y'>Müşteriler</h2>
    <div className='grid grid-cols-12 gap-6 mt-5'>
      <div className='flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap'>
        <Button as='a' variant='primary' href={route('hotel.customers.create')} className='mr-2 shadow-md'>
          Yeni Müşteri Ekle
        </Button>
        <div className='hidden mx-auto md:block text-slate-500'>
          {`${props.bookings.total} kayıttan ${props.bookings.from} ile ${props.bookings.to} arası gösteriliyor`}
        </div>
        <div className='w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0'>
          <div className='relative w-56 text-slate-500'>
            <FormInput
              type='text'
              className='w-56 pr-10 !box'
              placeholder='Search...'
              onChange={(e) => handleSearch(e)}
              onKeyDown={handleKeyDown}
              name={'search'}
              value={searchValue}
            />
            <Lucide
              icon='Search'
              className='absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3'
            />
          </div>
        </div>
      </div>
      <div className='intro-y col-span-12 overflow-auto lg:overflow-visible'>
        <Table className='border-spacing-y-[10px] border-separate sm:mt-2'>
          <Table.Thead>
            <Table.Tr>
              <Table.Th className='border-b-0 whitespace-nowrap'>
                GİRİŞ/ÇIKIŞ TARİHİ
              </Table.Th>
              <Table.Th className='border-b-0 whitespace-nowrap'>
                ODALAR
              </Table.Th>
              <Table.Th className='border-b-0 whitespace-nowrap'>
                MÜŞTERİ
              </Table.Th>
              <Table.Th className='text-right whitespace-nowrap border-b-0'>
                TOPLAM TUTAR
              </Table.Th>
              <Table.Th className='text-right whitespace-nowrap border-b-0'>
                BAKİYE
              </Table.Th>
              <Table.Th className='whitespace-nowrap border-b-0'>
                AKSİYONLAR
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {props.bookings.data.map((booking) => (<Table.Tr key={booking.id} className='intro-y'>
              <Table.Td
                className='first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]'>
                <div className="flex gap-3 items-center">
									<Lucide icon='CalendarRange' className='h-8 w-8' />
									<Link href={route('hotel.bookings.show', booking.id)}
												className='whitespace-nowrap flex flex-col'>
                                        <span
																					className='text-sm font-light text-darkmode-500 dark:text-darkmode-50 flex items-center'>
                                          Giriş Tarihi :
                                          <span className='ms-2 font-semibold text-base'>
                                            {booking.check_in}
                                          </span>
                                        </span>
										{booking.open_booking ? (
											<span className='text-base font-semibold text-orange-500 dark:text-orange-300 flex items-center'>Açık Rezervasyon</span>) : (
											<span className='text-sm font-light text-darkmode-500 dark:text-darkmode-50 flex items-center'>
                      Çıkış Tarihi :
                      <span className='ms-2 font-semibold text-base'>
                        {booking.check_out}
                      </span>
                    </span>)}
									</Link>
                </div>
              </Table.Td>
              <Table.Td
                className={twMerge(booking.rooms_count > 2 ? 'text-lg' : 'text-2xl' ,'text-primary font-semibold first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]')}>
                {booking.rooms}
              </Table.Td>
              <Table.Td
                className='first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]'>
                <Link className="text-base font-medium" href={ route('hotel.customers.show', booking.customer_id) }>{ booking.customer }</Link>
              </Table.Td>
              <Table.Td
                className='first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]'>
                <span className="text-xl font-semibold">{ booking.amount_formatted }</span>
              </Table.Td>
              <Table.Td
                className='text-right first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]'>
								{booking.remaining_balance === 0 ? (
                  <span className="text-xl text-green-600 font-semibold">Ödendi</span>
                ) : (
                  <span className="text-red-400 text-xl font-semibold">{ booking.remaining_balance_formatted }</span>
                )}
              </Table.Td>
							<Table.Td
								className='relative w-56 border-b-0 bg-white py-0 shadow-[20px_3px_20px_#0000000b] before:absolute before:inset-y-0 before:left-0 before:my-auto before:block before:h-8 before:w-px before:bg-slate-200 first:rounded-l-md last:rounded-r-md dark:bg-darkmode-600 before:dark:bg-darkmode-400'>
								asdasd
							</Table.Td>
            </Table.Tr>))}
          </Table.Tbody>
        </Table>
      </div>
      <div className='flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap'>
        <Pagination className='w-full sm:w-auto sm:mr-auto'>
          <Pagination.Link href={props.bookings.first_page_url}>
            <Lucide icon='ChevronsLeft' className='w-4 h-4' />
          </Pagination.Link>
          <Pagination.Link href={props.bookings.prev_page_url !== null ? props.bookings.prev_page_url : '#'}
                           preserveScroll>
            <Lucide icon='ChevronLeft' className='w-4 h-4' />
          </Pagination.Link>
          <Pagination.Link href={'#'}>...</Pagination.Link>
          {props.bookings.links.map((link, key) => {
            if (key > 0 && key < props.bookings.links.length - 1) {
              if (props.bookings.current_page - 2 <= key && key <= props.bookings.current_page + 2) {
                return (<Pagination.Link key={key} href={link.url !== null ? link.url : '#'}
                                         active={link.active}>{link.label}</Pagination.Link>)
              }
            }
          })}
          <Pagination.Link href={'#'}>...</Pagination.Link>
          <Pagination.Link
            href={props.bookings.next_page_url !== null ? props.bookings.next_page_url : '#'}>
            <Lucide icon='ChevronRight' className='w-4 h-4' />
          </Pagination.Link>
          <Pagination.Link href={props.bookings.last_page_url}>
            <Lucide icon='ChevronsRight' className='w-4 h-4' />
          </Pagination.Link>
        </Pagination>
        <FormSelect onChange={handlePerPage} defaultValue={perPage} className='w-20 mt-3 !box sm:mt-0'>
          {
            [10, 20, 25, 30, 40, 50, 100].map((item, key) => (<option key={key}>{item}</option>))
          }
        </FormSelect>
      </div>
    </div>
  </AuthenticatedLayout>)
}

export default Index
