import React from 'react'
import { Head } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

function IndexWork(props: any) {
  return (<AuthenticatedLayout
      user={props.auth.user}
      role={props.auth.role}
      permissions={props.auth.permissions}
      pricingPolicy={props.auth.pricing_policy}
    >
      <Head title='Kullanıcılar' />
      <h2 className='mt-10 mb-5 text-lg font-medium intro-y'>Kullanıcılar</h2>
      <div className="flex 2xl:flex-row flex-col justify-between items-center">
        <div className='flex flex-col gap-[4px] 2xl:w-1/2 w-full relative xl:scale-100 xl:ml-0 xl:mt-0 scale-50 -ml-[130px] -mt-[75px]'>
          <div className='bg-neutral-300 -skew-x-[78deg] ml-[60px] w-[405px] h-[25px]'></div>
          <button className='bg-blue-100 h-[50px] w-[400px] hover:bg-blue-200 before:hover:bg-blue-300 before:w-[125px] before:block before:ml-[402px] before:-mt-[18px] before:h-[48px] before:-right-32 before:-rotate-12 before:-skew-x-[12deg] before:bg-blue-200'>
            <h5 className='flex text-center justify-center -mt-[32px] font-extrabold text-blue-900 text-4xl items-center'>4. KAT</h5>
          </button>
          <button className='bg-blue-100 h-[50px] w-[400px] hover:bg-blue-200 before:hover:bg-blue-300 before:w-[125px] before:block before:ml-[402px] before:-mt-[18px] before:h-[48px] before:-right-32 before:-rotate-12 before:-skew-x-[12deg] before:bg-blue-200'>
            <h5 className='flex text-center justify-center -mt-[32px] font-extrabold text-blue-900 text-4xl items-center'>3. KAT</h5>
          </button>
          <button className='bg-blue-100 h-[50px] w-[400px] hover:bg-blue-200 before:hover:bg-blue-300 before:w-[125px] before:block before:ml-[402px] before:-mt-[18px] before:h-[48px] before:-right-32 before:-rotate-12 before:-skew-x-[12deg] before:bg-blue-200'>
            <h5 className='flex text-center justify-center -mt-[32px] font-extrabold text-blue-900 text-4xl items-center'>2. KAT</h5>
          </button>
          <button className='bg-blue-100 h-[50px] w-[400px] hover:bg-blue-200 before:hover:bg-blue-300 before:w-[125px] before:block before:ml-[402px] before:-mt-[18px] before:h-[48px] before:-right-32 before:-rotate-12 before:-skew-x-[12deg] before:bg-blue-200'>
            <h5 className='flex text-center justify-center -mt-[32px] font-extrabold text-blue-900 text-4xl items-center'>1. KAT</h5>
          </button>
          <button className='bg-blue-100 h-[50px] w-[400px] hover:bg-blue-200 before:hover:bg-blue-300 before:w-[125px] before:block before:ml-[402px] before:-mt-[18px] before:h-[48px] before:-right-32 before:-rotate-12 before:-skew-x-[12deg] before:bg-blue-200'>
            <h5 className='flex text-center justify-center -mt-[32px] font-extrabold text-blue-900 text-4xl items-center'>ZEMİN KAT</h5>
          </button>
        </div>
        <div className="2xl:w-1/2 w-full bg-emerald-600 h-96"></div>
      </div>

  </AuthenticatedLayout>
  )
}

export default IndexWork
