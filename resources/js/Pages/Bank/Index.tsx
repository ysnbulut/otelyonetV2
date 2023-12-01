import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import React, { useState } from 'react'
import Button from '../../Components/Button'
import { Menu } from "../../Components/Headless";
import Lucide from '../../Components/Lucide'
import { FormInput } from '../../Components/Form'
import { PageProps } from './types/index'
import Pagination from "../../Components/Pagination";
import { FormSelect } from '@/Components/Form'
import _ from "lodash";
import fakerData from "../../utils/faker";
import { Head, Link } from '@inertiajs/react'
import { Inertia } from '@inertiajs/inertia'
function Index(props:PageProps) {
  const [searchValue, setSearchValue] = useState<any>(props.filters.search || '')
  const [perPage, setPerPage] = useState(props.banks.per_page || 10)

  const handleSearch = (e: any): void => {
    e.preventDefault()
    setSearchValue(e.target.value)
  }

  const handleKeyDown = (e: any): void => {
    if (e.key === 'Enter') {
      Inertia.get(route('hotel.case_and_banks.index'), { search: searchValue }, {
        replace: false,
        preserveState: true,
        only: ['customers'],
      })
    }
  }

  const handlePerPage = (e: any): void => {
    Inertia.get(route('hotel.case_and_banks.index'), { per_page: e.target.value }, {
      replace: true,
      preserveState: false,
    });
    setPerPage(e.target.value)
  }
  return (
    <AuthenticatedLayout
      user={props.auth.user}
      role={props.auth.role}
      permissions={props.auth.permissions}
      pricingPolicy={props.auth.pricing_policy}
    >
      <Head title='Kasa ve Bankalar' />
      <h2 className="mt-10 text-lg font-medium intro-y">Kasa ve Banka Hesapları</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
          <Button variant="primary" className="mr-2 shadow-md">
            Yeni Hesap Ekle
          </Button>
          {/*<Menu>*/}
          {/*  <Menu.Button as={Button} className="px-2 !box">*/}
          {/*    <span className="flex items-center justify-center w-5 h-5">*/}
          {/*      <Lucide icon="Plus" className="w-4 h-4" />*/}
          {/*    </span>*/}
          {/*  </Menu.Button>*/}
          {/*  <Menu.Items className="w-40">*/}
          {/*    <Menu.Item>*/}
          {/*      <Lucide icon="Users" className="w-4 h-4 mr-2" /> Add Group*/}
          {/*    </Menu.Item>*/}
          {/*    <Menu.Item>*/}
          {/*      <Lucide icon="MessageCircle" className="w-4 h-4 mr-2" /> Send*/}
          {/*      Message*/}
          {/*    </Menu.Item>*/}
          {/*  </Menu.Items>*/}
          {/*</Menu>*/}
          <div className="hidden mx-auto md:block text-slate-500">
            {`${props.banks.total} kayıttan ${props.banks.from} ile ${props.banks.to} arası gösteriliyor`}
          </div>
          <div className="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
            <div className="relative w-56 text-slate-500">
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
                icon="Search"
                className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
              />
            </div>
          </div>
        </div>
        {/* BEGIN: Users Layout */}
        {props.banks.data.map((bank, index) => (
          <div key={bank.id} className="col-span-12 intro-y md:col-span-6">
            <div className="box">
              <div className="flex flex-col items-center p-5 lg:flex-row">
                <div className="mt-3 text-center lg:ml-2 lg:mr-auto lg:text-left lg:mt-0">
                  <Link href={route('hotel.case_and_banks.edit', bank.id)} className="font-normal text-3xl">
                    {bank.name} ({bank.currency})
                  </Link>
                  <div className="text-slate-500 text-2xl mt-0.5">
                    {bank.balance}
                  </div>
                </div>
                <div className="flex mt-4 lg:mt-0">
                  <Button as='a' href={route('hotel.case_and_banks.edit', bank.id)} className="px-2 py-1 mr-2" variant="primary">
                    Detay
                  </Button>
                  <Button as='a' href={route('hotel.case_and_banks.edit', bank.id)} variant="outline-secondary" className="px-2 py-1">
                    Düzenle
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {/* BEGIN: Users Layout */}
        {/* END: Pagination */}
        <div className='flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap'>
          <Pagination className='w-full sm:w-auto sm:mr-auto'>
            <Pagination.Link href={props.banks.first_page_url}>
              <Lucide icon='ChevronsLeft' className='w-4 h-4' />
            </Pagination.Link>
            <Pagination.Link href={props.banks.prev_page_url !== null ? props.banks.prev_page_url : '#'}
                             preserveScroll>
              <Lucide icon='ChevronLeft' className='w-4 h-4' />
            </Pagination.Link>
            <Pagination.Link href={'#'}>...</Pagination.Link>
            {props.banks.links.map((link, key) => {
              if (key > 0 && key < props.banks.links.length - 1) {
                if (props.banks.current_page - 2 <= key && key <= props.banks.current_page + 2) {
                  return (<Pagination.Link key={key} href={link.url !== null ? link.url : '#'}
                                           active={link.active}>{link.label}</Pagination.Link>)
                }
              }
            })}
            <Pagination.Link href={'#'}>...</Pagination.Link>
            <Pagination.Link
              href={props.banks.next_page_url !== null ? props.banks.next_page_url : '#'}>
              <Lucide icon='ChevronRight' className='w-4 h-4' />
            </Pagination.Link>
            <Pagination.Link href={props.banks.last_page_url}>
              <Lucide icon='ChevronsRight' className='w-4 h-4' />
            </Pagination.Link>
          </Pagination>
          <FormSelect onChange={handlePerPage} defaultValue={perPage} className='w-20 mt-3 !box sm:mt-0'>
            {
              [10, 20, 25, 30, 40, 50, 100].map((item, key) => (<option key={key}>{item}</option>))
            }
          </FormSelect>
        </div>
        {/* END: Pagination */}
      </div>
    </AuthenticatedLayout>
  )
}

export default Index
