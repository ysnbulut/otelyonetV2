import React, { useState } from 'react'
import { PageProps } from './types'
import { Head, Link } from '@inertiajs/react'
import { FormInput, FormSelect } from '@/Components/Form'
import Lucide from '@/Components/Lucide'
import Table from '@/Components/Table'
import Button from '@/Components/Button'
import Pagination from '@/Components/Pagination'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Inertia } from '@inertiajs/inertia'
import Alert from '@/Components/Alert'
import { twMerge } from 'tailwind-merge'

function Index(props: PageProps) {
  const [perPage, setPerPage] = useState(props.roles.per_page || 10)

  const handlePerPage = (e: any): void => {
    Inertia.get(route('hotel.roles.index'), { per_page: e.target.value }, {
      replace: true,
      preserveState: true,
    })
    setPerPage(e.target.value)
  }

  const handleDestroy = (id: number) => {
    Inertia.delete(route('hotel.roles.destroy', id), {
      preserveState: false,
      onSuccess: () => {
        console.log('silindi')
      },
    })
  }

  return (
    <AuthenticatedLayout
      user={props.auth.user}
      role={props.auth.role}
      permissions={props.auth.permissions}
      pricingPolicy={props.auth.pricing_policy}
    >
      <Head title='Misafirler' />
      {props.flash.success && (<Alert variant='soft-success' className='flex items-center mb-2 mt-5 font-semibold'>
        {({ dismiss }) => (
          <>
            <Lucide icon='CheckCircle' className='w-6 h-6 mr-4' />{' '}
            {props.flash.success}
            <Alert.DismissButton type='button' className='btn-close text-success' aria-label='Close' onClick={dismiss}>
              <Lucide icon='X' className='w-6 h-6' />
            </Alert.DismissButton>
          </>
        )}
      </Alert>)}
      <h2 className='my-5 text-lg font-medium intro-y'>Misafirler</h2>
      <div className='grid grid-cols-12 gap-6'>
        <div className='flex flex-wrap justify-between px-5 items-center col-span-12 mt-2 intro-y sm:flex-nowrap'>
          <Button as={Link} href={route('hotel.roles.create')} variant='primary' className='mr-2 shadow-md'>
            Yeni Rol Ekle
          </Button>
          {/*<Menu>*/}
          {/*    <Menu.Button as={Button} className="px-2 !box">*/}
          {/*      <span className="flex items-center justify-center w-5 h-5">*/}
          {/*        <Lucide icon="Plus" className="w-4 h-4" />*/}
          {/*      </span>*/}
          {/*    </Menu.Button>*/}
          {/*    <Menu.Items className="w-40">*/}
          {/*        <Menu.Item>*/}
          {/*            <Lucide icon="Users" className="w-4 h-4 mr-2" /> Add Group*/}
          {/*        </Menu.Item>*/}
          {/*        <Menu.Item>*/}
          {/*            <Lucide icon="MessageCircle" className="w-4 h-4 mr-2" /> Send*/}
          {/*            Message*/}
          {/*        </Menu.Item>*/}
          {/*    </Menu.Items>*/}
          {/*</Menu>*/}
          <div className='hidden md:block text-slate-500'>
            {`${props.roles.total} kayıttan ${props.roles.from} ile ${props.roles.to} arası gösteriliyor`}
          </div>
          <div className='w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0'>

          </div>
        </div>
        {props.roles.data.map((role) => (<div key={role.id} className='col-span-12 intro-y md:col-span-6'>
          <div className='box'>
            <div className='flex flex-col items-center p-5 lg:flex-row'>
              <div className='mt-3 text-center lg:ml-2 lg:mr-auto lg:text-left lg:mt-0'>
                <Link href={route('hotel.roles.edit', role.id)} className='font-medium text-xl'>
                  {role.name}
                </Link>
              </div>
              <div className={twMerge(role.name === 'Super Admin' ? 'h-8 w-16' : '', 'flex gap-4 mt-4 lg:mt-0')}>
                {(props.can.edit && role.name !== 'Super Admin') && (
                  <Button as={Link} variant='outline-primary' href={route('hotel.roles.edit', role.id)}
                          className='px-2'>
                    <Lucide icon='Pencil' className='w-4 h-4 text-theme-9' />
                  </Button>)}
                {(props.can.delete && role.name !== 'Super Admin') && (
                  <Button onClick={() => handleDestroy(role.id)} variant='outline-danger' className='px-2'>
                    <Lucide icon='Trash'
                            className='w-4 h-4 text-theme-9 cursor-pointer' />
                  </Button>)}
              </div>
            </div>
          </div>
        </div>))}
        <div className='flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap'>
          <Pagination className='w-full sm:w-auto sm:mr-auto'>
            <Pagination.Link href={props.roles.first_page_url}>
              <Lucide icon='ChevronsLeft' className='w-4 h-4' />
            </Pagination.Link>
            <Pagination.Link href={props.roles.prev_page_url !== null ? props.roles.prev_page_url : '#'}
                             preserveScroll>
              <Lucide icon='ChevronLeft' className='w-4 h-4' />
            </Pagination.Link>
            <Pagination.Link href={'#'}>...</Pagination.Link>
            {props.roles.links.map((link, key) => {
              if (key > 0 && key < props.roles.links.length - 1) {
                if (props.roles.current_page - 2 <= key && key <= props.roles.current_page + 2) {
                  return (<Pagination.Link key={key} href={link.url !== null ? link.url : '#'}
                                           active={link.active}>{link.label}</Pagination.Link>)
                }
              }
            })}
            <Pagination.Link href={'#'}>...</Pagination.Link>
            <Pagination.Link
              href={props.roles.next_page_url !== null ? props.roles.next_page_url : '#'}>
              <Lucide icon='ChevronRight' className='w-4 h-4' />
            </Pagination.Link>
            <Pagination.Link href={props.roles.last_page_url}>
              <Lucide icon='ChevronsRight' className='w-4 h-4' />
            </Pagination.Link>
          </Pagination>
          <FormSelect onChange={handlePerPage} defaultValue={perPage} className='w-20 mt-3 !box sm:mt-0'>
            {
              [10, 20, 25, 30, 40, 50, 100].map((item, key) => (
                <option key={key}>{item}</option>))
            }
          </FormSelect>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}

export default Index
