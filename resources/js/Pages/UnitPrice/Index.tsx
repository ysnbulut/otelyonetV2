import React from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { PageProps } from './types'
import { Head } from '@inertiajs/react'
import Alert from '@/Components/Alert'
import Lucide from '@/Components/Lucide'

function Index(props: PageProps) {
  return (
    <AuthenticatedLayout
      user={props.auth.user}
      role={props.auth.role}
      permissions={props.auth.permissions}
      pricingPolicy={props.auth.pricing_policy}>
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
      <h2 className='my-5 text-lg font-medium intro-y'>Ünite Fiyatları</h2>
      <div>
        <ul>
          <li className="h-20 bg-red-500">asdasdasdadasd</li>
          <li>asdasda</li>
          <li>asdasd</li>
        </ul>
      </div>
    </AuthenticatedLayout>
  )
}

export default Index
