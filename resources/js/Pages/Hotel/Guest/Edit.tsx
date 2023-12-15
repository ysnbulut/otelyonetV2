import React from 'react'
import { Head, useForm } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { PageProps } from './types/edit'
import { FormInput, FormLabel, FormSelect } from '@/Components/Form'
import dayjs from 'dayjs'
import Button from '@/Components/Button'

function Edit(props: PageProps) {
  const { data, setData, post, processing, errors } = useForm(props.guest)
  return (
    <AuthenticatedLayout
      user={props.auth.user}
      role={props.auth.role}
      permissions={props.auth.permissions}
      pricingPolicy={props.auth.pricing_policy}
    >
      <Head title='Müşteriler' />
      <h2
        className='my-5 text-lg font-medium intro-y'>Misafir: {props.guest.gender === 'male' ? 'Bay' : 'Bayan'} {props.guest.full_name}</h2>
        <form method='POST'
              action={route('hotel.guests.update', props.guest.id)}
              className='intro-y box col-span-12 p-5'>
          <div className='flex w-full flex-col'>
            <div className='flex w-full flex-col gap-6 lg:flex-row'>
              <div className='input-form my-5 w-full lg:w-1/2'>
                <FormLabel htmlFor='guest-name'
                           className='flex justify-between'>
                  Misafir Adı
                  <span className='mt-1 text-xs text-slate-500 sm:ml-auto sm:mt-0'>
                  Required, Minimum 1 karakter giriniz
                 </span>
                </FormLabel>
                <FormInput id='guest-name'
                           type='text'
                           placeholder='Adı'
                           minLength={1}
                           required={true}
                           name='name'
                           value={data.name}
                           className='w-full' />
                {errors.name && <div className='text-theme-6 mt-2 text-danger'>{errors.name}</div>}
              </div>
              <div className='input-form my-5 w-full lg:w-1/2'>
                <FormLabel htmlFor='guest-surname'
                           className='flex justify-between'>
                  Misafir Soyadı
                  <span className='mt-1 text-xs text-slate-500 sm:ml-auto sm:mt-0'>
        Required, Minimum 1 karakter giriniz
       </span>
                </FormLabel>
                <FormInput id='guest-surname'
                           type='text'
                           placeholder='Soyadı'
                           minLength={1}
                           required={true}
                           name='surname'
                           value={data.surname}
                           className='w-full' />
                {errors.surname && <div className='text-theme-6 mt-2 text-danger'>{errors.surname}</div>}
              </div>
            </div>
            <div className='flex w-full flex-col gap-6 lg:flex-row'>
              <div className='input-form my-5 w-full lg:w-1/3'>
                <FormLabel htmlFor='guest-nationality'
                           className='flex justify-between'>
                  Uyruk
                  <span className='mt-1 text-xs text-slate-500 sm:ml-auto sm:mt-0'>
        Required, Minimum 1 karakter giriniz
       </span>
                </FormLabel>
                <FormInput id='guest-nationality'
                           type='text'
                           placeholder='Uyruk'
                           minLength={1}
                           required={true}
                           name='nationality'
                           value={data.nationality}
                           className='w-full' />
                {errors.nationality && <div className='text-theme-6 mt-2 text-danger'>{errors.nationality}</div>}
              </div>
              <div className='input-form my-5 w-full lg:w-1/3'>
                <FormLabel htmlFor='guest-gender'
                           className='flex justify-between'>
                  Cinsiyet
                  <span className='mt-1 text-xs text-slate-500 sm:ml-auto sm:mt-0'>
        Required, Minimum 1 karakter giriniz
       </span>
                </FormLabel>
                <FormSelect className='w-full'
                            name='gender'
                            id='guest-gender'>
                  <option value='unspecified'
                          selected={data.gender === 'unspecified'}>Belirtilmedi
                  </option>
                  <option value='male' selected={data.gender === 'male'}>Erkek</option>
                  <option value='female' selected={data.gender === 'female'}>Kadın</option>
                </FormSelect>
                {errors.gender && <div className='text-theme-6 mt-2 text-danger'>{errors.gender}</div>}
              </div>
              <div className='input-form my-5 w-full lg:w-1/3'>
                <FormLabel htmlFor='guest-identification-number'
                           className='flex justify-between'>
                  Kimlik Numarası
                  <span className='mt-1 text-xs text-slate-500 sm:ml-auto sm:mt-0'>
        Required, Minimum 1 karakter giriniz
       </span>
                </FormLabel>
                <FormInput id='guest-identification-number'
                           type='text'
                           placeholder='Kimlik Numarası'
                           minLength={1}
                           required={true}
                           name='identification_number'
                           value={data.identification_number}
                           className='w-full' />
                {errors.identification_number &&
                  <div className='text-theme-6 mt-2 text-danger'>{errors.identification_number}</div>}
              </div>
            </div>
          </div>
          <div className='flex w-full flex-col gap-6 lg:flex-row'>
            <div className='input-form my-5 w-full lg:w-1/2'>
              <FormLabel htmlFor='guest-phone'
                         className='flex justify-between'>
                Telefon Numarası
                <span className='mt-1 text-xs text-slate-500 sm:ml-auto sm:mt-0'>
       Required, Minimum 1 karakter giriniz
      </span>
              </FormLabel>
              <FormInput id='guest-phone'
                         type='text'
                         placeholder='Telefon'
                         minLength={1}
                         required={true}
                         name='phone'
                         value={data.phone}
                         className='w-full' />
              {errors.phone && <div className='text-theme-6 mt-2 text-danger'>{errors.phone}</div>}
            </div>
            <div className='input-form my-5 w-full lg:w-1/2'>
              <FormLabel htmlFor='guest-email'
                         className='flex justify-between'>
                E-Mail Adresi
                <span className='mt-1 text-xs text-slate-500 sm:ml-auto sm:mt-0'>
       Required, Minimum 1 karakter giriniz
      </span>
              </FormLabel>
              <FormInput id='guest-email'
                         type='text'
                         placeholder='Email'
                         minLength={1}
                         required={true}
                         name='email'
                         value={data.email}
                         className='w-full' />
              {errors.email && <div className='text-theme-6 mt-2 text-danger'>{errors.email}</div>}
            </div>
          </div>
          <div className='my-5 flex justify-end'>
            <Button type='submit'
                    variant='success'
                    className='px-5'
                    elevated> Güncelle </Button>
          </div>
        </form>
    </AuthenticatedLayout>
  )
}

export default Edit
