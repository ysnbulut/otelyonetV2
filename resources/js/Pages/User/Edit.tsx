import React, { useEffect, useState } from 'react'
import { FormInput, FormLabel, FormSwitch } from '@/Components/Form'
import { Head, Link, router, useForm } from '@inertiajs/react'
import { PageProps, UpdateUserDataProps } from './types/edit'
import TomSelect from '@/Components/TomSelect'
import Button from '@/Components/Button'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

function Edit(props: PageProps) {
	const { data, setData, post, processing, errors } = useForm(
		{
			...props.user,
			password: '',
			password_confirmation: '',
			password_change: '0',
			role: props.roles.find(role => role.name === props.user_role)?.id.toString() || ''
		})
	const [newPassword, setNewPassword] = useState(false)

	useEffect(() => {
		if (data.password_change === '0') {
			setNewPassword(false)
		} else {
			setNewPassword(true)
		}
	}, [data.password_change])

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		router.put(route('hotel.users.update', props.user.id), data);
	}

	return (<AuthenticatedLayout
			user={props.auth.user}
			role={props.auth.role}
			permissions={props.auth.permissions}
			pricingPolicy={props.auth.pricing_policy}
		>
			<Head title='Misafirler' />
      <div className='mt-10 flex items-center justify-between'>
        <h2 className='pl-5 text-lg font-medium intro-y'>{`${props.user.name} Kullanıcısını Düzenle`}</h2>
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
												 required={newPassword}
												 minLength={6}
												 name='password'
												 value={data.password}
												 onChange={(e) => setData(data => ({ ...data, password: e.target.value }))}
												 placeholder='Şifre'
												 disabled={!newPassword} />
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
												 required={newPassword}
												 minLength={6}
												 name='password_confirmation'
												 value={data.password_confirmation}
												 onChange={(e) => setData(data => ({ ...data, password_confirmation: e.target.value }))}
												 placeholder='Şifre Tekrarı'
												 disabled={!newPassword} />
							{errors.password_confirmation && (
								<div className='text-theme-6 mt-2 text-danger'>{errors.password_confirmation}</div>)}
						</div>
					</div>
					<div className='mt-3'>
						<div className='mr-5 mt-2 flex justify-end'>
							<div className='flex items-center'>
								<FormSwitch className='mt-2'>
									<FormSwitch.Label htmlFor='password-change'
																		className='mr-2'> Şifre değiştirilsin mi?
									</FormSwitch.Label>
									<FormSwitch.Input id='password-change'
																		name='password_change'
																		value={data.password_change}
																		onChange={(e) => setData(data => ({ ...data, password_change: e.target.checked ? '1' : '0'}))}
																		type='checkbox' />
								</FormSwitch>
							</div>
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
							{props.roles.map((role) => (
								<option key={role.id} value={role.id}>{role.name}</option>))}
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

export default Edit
