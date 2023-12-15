import React, { useEffect, useState } from 'react'
import { FormInput, FormLabel, FormSwitch } from '@/Components/Form'
import { Head, Link, router, useForm } from '@inertiajs/react'
import { PageProps } from './types/edit'
import TomSelect from '@/Components/TomSelect'
import Button from '@/Components/Button'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

function Edit(props: PageProps) {
  const { data, setData, post, processing, errors } = useForm(
    {
      name: props.role.name,
      permissions: props.rolePermissions.map((permission: string ) => permission),
    })

  const handleSubmit = (e: any): void => {
    e.preventDefault()
    router.put(route('hotel.roles.update', props.role.id), data)
  }
  return (
    <AuthenticatedLayout
      user={props.auth.user}
      role={props.auth.role}
      permissions={props.auth.permissions}
      pricingPolicy={props.auth.pricing_policy}
    >
      <Head title={`${props.role.name} Rolünü Düzenle`} />
      <div className='mt-10 mb-5 flex items-center justify-between'>
        <h2 className='pl-5 text-lg font-medium intro-y'>{`${props.role.name} Rolünü Düzenle`}</h2>
          <Button as={Link}
                  href={route('hotel.roles.index')}
                  variant='primary'
                  className='shadow-md'>
            Geri Dön
          </Button>
      </div>

      <form
        onSubmit={e => handleSubmit(e)}
        className='intro-y box col-span-12 p-5'>
        <div className='input-form my-5'>
          <FormLabel htmlFor='role-name'
                     className='flex justify-between'>
            Rol Adı
            <span className='mt-1 text-xs text-slate-500 sm:ml-auto sm:mt-0'>
								Gerekli, min 3 max 30 karakter
						 	</span>
          </FormLabel>
          <FormInput id='role-name'
                     type='text'
                     placeholder='Rol Adı'
                     minLength={3}
                     maxLength={30}
                     required={true}
                     name='name'
                     value={data.name}
                     onChange={(e) => setData(data => ({ ...data, name: e.target.value }))}
                     className='w-full' />
          {errors.name && <div className='text-theme-6 mt-2 text-danger'>{errors.name}</div>}
        </div>
        <div className='my-5'>
          <FormLabel htmlFor='role-select'
                     className='flex justify-between'>Rol İzinlerini Seçiniz
            <span className='mt-1 text-xs text-slate-500 sm:ml-auto sm:mt-0'>
								Gerekli, min 1 seçenek
						 	</span>
          </FormLabel>
          <TomSelect id='role-select'
                     name='permissions[]'
                     data-placeholder='Rol İzinlerini Seçiniz'
                     value={data.permissions}
                     onChange={(e :string[]) => setData(data => ({ ...data, permissions: e.map((permission: string) => permission) }))}
                     multiple
                     className='w-full'>
            {props.permissions.map((permission) => (<option key={permission.id} value={permission.name}>{permission.name}</option>))}
          </TomSelect>
          {errors.permissions && <div className='text-theme-6 mt-2 text-danger'>{errors.permissions}</div>}
        </div>
        <div className='my-5 flex justify-end'>
          <Button type='submit'
                  variant='success'
                  className='px-5'
                  elevated> Kaydet
          </Button>
        </div>
      </form>
    </AuthenticatedLayout>
  )
}

export default Edit
