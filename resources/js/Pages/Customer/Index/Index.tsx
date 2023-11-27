import React, { useEffect, useRef, useState } from 'react'
import { PageProps } from './index'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Inertia } from '@inertiajs/inertia'
import { Head, Link} from '@inertiajs/react'
import Lucide from '@/Components/Lucide'
import Button from '@/Components/Button'
import { FormInput, FormSelect } from '@/Components/Form'
import Table from '@/Components/Table'
import Pagination from '@/Components/Pagination'

function Index({ ...props }: PageProps) {
    const [searchValue, setSearchValue] = useState<any>(props.filters.search || '')
    const [perPage, setPerPage] = useState(props.customers.per_page || 10)

    const handleSearch = (e: any): void => {
        e.preventDefault()
        setSearchValue(e.target.value)
    }

    const handleKeyDown = (e: any): void => {
        if (e.key === 'Enter') {
            Inertia.get(route('hotel.customers.index'), { search: searchValue }, {
                replace: false,
                preserveState: true,
                only: ['customers'],
            })
        }
    }

    const handlePerPage = (e: any): void => {
        Inertia.get(route('hotel.customers.index'), { per_page: e.target.value }, {
            replace: true,
            preserveState: true,
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
                <Button variant='primary' className='mr-2 shadow-md'>
                    Yeni Müşteri Ekle
                </Button>
                <div className='hidden mx-auto md:block text-slate-500'>
                    {`${props.customers.total} kayıttan ${props.customers.from} ile ${props.customers.to} arası gösteriliyor`}
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
                                MÜŞTERİ
                            </Table.Th>
                            <Table.Th className='border-b-0 whitespace-nowrap'>
                                VERGİ NO
                            </Table.Th>
                            <Table.Th className='text-center border-b-0 whitespace-nowrap'>
                                BAKİYE
                            </Table.Th>
                            <Table.Th className='whitespace-nowrap border-b-0 text-center'>
                                AKSİYONLAR
                            </Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {props.customers.data.map((customer) => (<Table.Tr key={customer.id} className='intro-y'>
                            <Table.Td
                                className='first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]'>
                                <Link href={route('hotel.customers.show', customer.id)}
                                      className='whitespace-nowrap font-medium flex gap-3 items-center'>
                                    <Lucide icon={customer.type === 'individual' ? 'User' : 'Factory'}
                                            className='h-8 w-8' />
                                    <div className='flex flex-col'>
                                            <span className='text-base font-semibold'>
                                                {customer.title}
                                            </span>
                                        <span className='text-sm font-light'>
                                                {customer.type === 'individual' ? 'Şahıs' : 'Şirket'}
                                            </span>
                                    </div>
                                </Link>
                            </Table.Td>
                            <Table.Td
                                className='first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]'>
                                {customer.tax_number}
                            </Table.Td>
                            <Table.Td
                                className='first:rounded-l-md last:rounded-r-md text-center bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]'>
                                {customer.remaining_balance_formatted}
                            </Table.Td>
                            <Table.Td
                                className='first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]'>
                                asdasd
                            </Table.Td>
                        </Table.Tr>))}
                    </Table.Tbody>
                </Table>
            </div>
            <div className='flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap'>
                <Pagination className='w-full sm:w-auto sm:mr-auto'>
                    <Pagination.Link href={props.customers.first_page_url}>
                        <Lucide icon='ChevronsLeft' className='w-4 h-4' />
                    </Pagination.Link>
                    <Pagination.Link href={props.customers.prev_page_url !== null ? props.customers.prev_page_url : '#'}
                                     preserveScroll>
                        <Lucide icon='ChevronLeft' className='w-4 h-4' />
                    </Pagination.Link>
                    <Pagination.Link href={'#'}>...</Pagination.Link>
                    {props.customers.links.map((link, key) => {
                        if (key > 0 && key < props.customers.links.length - 1) {
                            if (props.customers.current_page - 2 <= key && key <= props.customers.current_page + 2) {
                                return (<Pagination.Link key={key} href={link.url !== null ? link.url : '#'}
                                                         active={link.active}>{link.label}</Pagination.Link>)
                            }
                        }
                    })}
                    <Pagination.Link href={'#'}>...</Pagination.Link>
                    <Pagination.Link
                        href={props.customers.next_page_url !== null ? props.customers.next_page_url : '#'}>
                        <Lucide icon='ChevronRight' className='w-4 h-4' />
                    </Pagination.Link>
                    <Pagination.Link href={props.customers.last_page_url}>
                        <Lucide icon='ChevronsRight' className='w-4 h-4' />
                    </Pagination.Link>
                </Pagination>
                <FormSelect onChange={handlePerPage} defaultValue={perPage} className='w-20 mt-3 !box sm:mt-0'>
                    {
                        [10, 20, 25, 30, 40, 50, 100].map((item, key) => (<option key={key} selected={perPage === item}>{item}</option>))
                    }
                </FormSelect>
            </div>
        </div>
    </AuthenticatedLayout>)
}

export default Index
