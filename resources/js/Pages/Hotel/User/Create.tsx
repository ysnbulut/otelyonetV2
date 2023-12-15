import React, { useEffect, useState } from 'react'
import { FormInput, FormLabel, FormSwitch } from '@/Components/Form'
import { Head, Link, router, useForm } from '@inertiajs/react'
import { PageProps } from './types/create'
import TomSelect from '@/Components/TomSelect'
import Button from '@/Components/Button'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

function Create(props: PageProps) {
  const { data, setData, post, processing, errors } = useForm(
    {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      role: '',
    })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    post(route('hotel.users.store'))
  }

  console.log(props.roles)
  return (<AuthenticatedLayout
      user={props.auth.user}
      role={props.auth.role}
      permissions={props.auth.permissions}
      pricingPolicy={props.auth.pricing_policy}
    >
      <Head title='Misafirler' />
      <div className='mt-10 flex items-center justify-between'>
        <h2 className='pl-5 text-lg font-medium intro-y'>{`${props.name} Kullanıcısını Düzenle`}</h2>
        <Button as={Link}
                href={route('hotel.users.index')}
                variant='primary'
                className='shadow-md'>
          Geri Dön
        </Button>
      </div>
      <div className='grid grid-cols-12 gap-6 mt-5'>
        <form onSubmit={e => handleSubmit(e)}
              className='intro-y box col-span-12 p-5'>
          <div className='flex w-full flex-col gap-6 lg:flex-row'>
            <div className='input-form my-5 w-full lg:w-1/2'>
              <FormLabel htmlFor='user-name'
                         className='flex justify-between'>
                Ad Soyad
                <span className='me-2 mt-1 text-xs text-slate-500 sm:ml-auto sm:mt-0'>
								 Gerekli, minimum 2 karakter
								</span>
              </FormLabel>
              <FormInput className='w-full'
                         id='user-name'
                         type='text'
                         required
                         minLength={2}
                         maxLength={50}
                         name='name'
                         value={data.name}
                         onChange={(e) => setData(data => ({ ...data, name: e.target.value }))}
                         placeholder='Ad Soyad' />
              {errors.name && (<div className='text-theme-6 mt-2 text-danger'>{errors.name}</div>)}
            </div>
            <div className='input-form my-5 w-full lg:w-1/2'>
              <FormLabel htmlFor='user-email'
                         className='flex justify-between'>
                E-posta adresi
                <span className='me-2 mt-1 text-xs text-slate-500 sm:ml-auto sm:mt-0'>
								 Gerekli, email formatında
								</span>
              </FormLabel>
              <FormInput className='w-full'
                         id='user-email'
                         type='text'
                         required
                         minLength={5}
                         name='email'
                         value={data.email}
                         onChange={(e) => setData(data => ({ ...data, email: e.target.value }))}
                         placeholder='E-posta' />
              {errors.email && (<div className='text-theme-6 mt-2 text-danger'>{errors.email}</div>)}
            </div>
          </div>
          <div className='flex w-full flex-col gap-6 lg:flex-row'>
            <div className='input-form my-5 w-full lg:w-1/2'>
              <FormLabel htmlFor='user-password'
                         className='flex justify-between'>
                Şifre
                <span className='me-2 mt-1 text-xs text-slate-500 sm:ml-auto sm:mt-0'>
								 Gerekli, minimum 6 karakter.
								</span>
              </FormLabel>
              <FormInput className='w-full'
                         id='user-password'
                         type='password'
                         required
                         minLength={6}
                         name='password'
                         value={data.password}
                         onChange={(e) => setData(data => ({ ...data, password: e.target.value }))}
                         placeholder='Şifre' />
              {errors.password && (<div className='text-theme-6 mt-2 text-danger'>{errors.password}</div>)}
            </div>
            <div className='input-form my-5 w-full lg:w-1/2'>
              <FormLabel htmlFor='user-password-confirmation'
                         className='flex justify-between'>
                Şifre tekrarı
                <span className='me-2 mt-1 text-xs text-slate-500 sm:ml-auto sm:mt-0'>
								 Gerekli, bir önceki şifrenin aynısı yazılmalı.
								</span>
              </FormLabel>
              <FormInput className='w-full'
                         id='user-password-confirmation'
                         type='password'
                         required
                         minLength={6}
                         name='password_confirmation'
                         value={data.password_confirmation}
                         onChange={(e) => setData(data => ({ ...data, password_confirmation: e.target.value }))}
                         placeholder='Şifre Tekrarı' />
              {errors.password_confirmation && (
                <div className='text-theme-6 mt-2 text-danger'>{errors.password_confirmation}</div>)}
            </div>
          </div>
          <div className='my-5'>
            <label htmlFor='role-select'
                   className='mb-2 inline-block'>Kullanıcının Rolüni Seçiniz</label>
            <TomSelect id='role-select'
                       name='role'
                       data-placeholder='Kullanıcının Rolüni Seçiniz'
                       value={data.role}
                       onChange={(e) => setData(data => ({ ...data, role: e.toString() }))}
                       className='w-full'>
              <option>Seçiniz</option>
              {props.roles.map((role) => (
                <option key={role.id} value={role.name}>{role.name}</option>))}
            </TomSelect>
            {errors.role && (<div className='text-theme-6 mt-2 text-danger'>{errors.role}</div>)}
          </div>
          <div className='my-5 flex justify-end'>
            <Button type='submit'
                    variant='success'
                    className='px-5'
                    elevated> Güncelle
            </Button>
          </div>
        </form>
      </div>
    </AuthenticatedLayout>
  )
}

export default Create
