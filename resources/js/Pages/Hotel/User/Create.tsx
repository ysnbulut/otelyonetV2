import React, {useEffect, useState} from 'react'
import {FormInput, FormLabel, FormSwitch} from '@/Components/Form'
import {Head, Link, router, useForm} from '@inertiajs/react'
import {PageProps} from './types/create'
import TomSelect from '@/Components/TomSelect'
import Button from '@/Components/Button'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Lucide from '@/Components/Lucide'
import Tippy from '@/Components/Tippy'
import LoadingIcon from '@/Components/LoadingIcon'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

function Create(props: PageProps) {
	const MySwal = withReactContent(Swal)
	const {data, setData, post, processing, errors} = useForm({
		name: '',
		email: '',
		password: '',
		password_confirmation: '',
		role: '',
	})

	const Toast = MySwal.mixin({
		toast: true,
		position: 'top-end',
		showConfirmButton: false,
		timer: 3000,
		timerProgressBar: false,
		didOpen: (toast) => {
			toast.addEventListener('mouseenter', MySwal.stopTimer)
			toast.addEventListener('mouseleave', MySwal.resumeTimer)
		},
	})

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		post(route('hotel.users.store'), {
			preserveScroll: true,
			onSuccess: (response: any) => {
				console.log(response)
				Toast.fire({
					icon: 'success',
					title: 'Kullanıcı başarıyla oluşturuldu.',
				}).then((r) => {
					console.log(r)
				})
				router.visit(route('hotel.users.index'))
			},
			onError: (errors: any) => {
				Toast.fire({
					icon: 'error',
					title: 'Hata!',
				}).then((r) => {
					console.log(r)
				})
				console.log(errors)
			},
		})
	}

	console.log(props.roles)
	return (
		<>
			<Head title="Misafirler" />
			<div className="my-5 flex items-center justify-between">
				<h2 className="intro-y text-lg font-medium">Kullanıcı Ekle</h2>
				<Tippy
					as={Button}
					onClick={() => router.visit(route('hotel.users.index'))}
					variant="soft-pending"
					className="intro-x"
					content="Geri">
					<Lucide
						icon="Undo2"
						className="h-5 w-5"
					/>
				</Tippy>
			</div>
			<div className="mt-5 grid grid-cols-12 gap-6">
				<form
					onSubmit={(e) => handleSubmit(e)}
					className="intro-y box col-span-12 p-5">
					<div className="flex w-full flex-col gap-2 lg:flex-row">
						<div className="input-form my-2 w-full lg:w-1/2">
							<FormLabel
								htmlFor="user-name"
								className="flex justify-between">
								Ad Soyad
								<span className="me-2 mt-1 whitespace-pre-wrap text-right text-xs text-slate-500 sm:ml-auto sm:mt-0">
									Gerekli, minimum 2 karakter
								</span>
							</FormLabel>
							<FormInput
								className="w-full"
								id="user-name"
								type="text"
								required
								minLength={2}
								maxLength={50}
								name="name"
								value={data.name}
								onChange={(e) => setData((data) => ({...data, name: e.target.value}))}
								placeholder="Ad Soyad"
							/>
							{errors.name && <div className="text-theme-6 mt-2 text-danger">{errors.name}</div>}
						</div>
						<div className="input-form my-2 w-full lg:w-1/2">
							<FormLabel
								htmlFor="user-email"
								className="flex justify-between">
								E-posta adresi
								<span className="me-2 mt-1 whitespace-pre-wrap text-right text-xs text-slate-500 sm:ml-auto sm:mt-0">
									Gerekli, email formatında
								</span>
							</FormLabel>
							<FormInput
								className="w-full"
								id="user-email"
								type="text"
								required
								minLength={5}
								name="email"
								value={data.email}
								onChange={(e) => setData((data) => ({...data, email: e.target.value}))}
								placeholder="E-posta"
							/>
							{errors.email && <div className="text-theme-6 mt-2 text-danger">{errors.email}</div>}
						</div>
					</div>
					<div className="flex w-full flex-col gap-2 lg:flex-row">
						<div className="input-form my-2 w-full lg:w-1/2">
							<FormLabel
								htmlFor="user-password"
								className="flex justify-between">
								Şifre
								<span className="me-2 mt-1 whitespace-pre-wrap text-right text-xs text-slate-500 sm:ml-auto sm:mt-0">
									Gerekli, minimum 6 karakter.
								</span>
							</FormLabel>
							<FormInput
								className="w-full"
								id="user-password"
								type="password"
								required
								minLength={6}
								name="password"
								value={data.password}
								onChange={(e) => setData((data) => ({...data, password: e.target.value}))}
								placeholder="Şifre"
							/>
							{errors.password && <div className="text-theme-6 mt-2 text-danger">{errors.password}</div>}
						</div>
						<div className="input-form my-2 w-full lg:w-1/2">
							<FormLabel
								htmlFor="user-password-confirmation"
								className="flex w-full flex-nowrap justify-between whitespace-nowrap">
								Şifre tekrarı
								<span className="me-2 mt-1 whitespace-pre-wrap text-right text-xs text-slate-500 sm:ml-auto sm:mt-0">
									Gerekli, şifreler birbiri ile uyuşmalı.
								</span>
							</FormLabel>
							<FormInput
								className="w-full"
								id="user-password-confirmation"
								type="password"
								required
								minLength={6}
								name="password_confirmation"
								value={data.password_confirmation}
								onChange={(e) => setData((data) => ({...data, password_confirmation: e.target.value}))}
								placeholder="Şifre Tekrarı"
							/>
							{errors.password_confirmation && (
								<div className="text-theme-6 mt-2 text-danger">{errors.password_confirmation}</div>
							)}
						</div>
					</div>
					<div className="my-2">
						<label
							htmlFor="role-select"
							className="mb-2 inline-block">
							Kullanıcının Rolüni Seçiniz
						</label>
						<TomSelect
							id="role-select"
							name="role"
							data-placeholder="Kullanıcının Rolüni Seçiniz"
							value={data.role}
							onChange={(e) => setData((data) => ({...data, role: e.toString()}))}
							className="w-full">
							<option>Seçiniz</option>
							{props.roles.map((role) => (
								<option
									key={role.id}
									value={role.name}>
									{role.name}
								</option>
							))}
						</TomSelect>
						{errors.role && <div className="text-theme-6 mt-2 text-danger">{errors.role}</div>}
					</div>
					<div className="my-2 flex justify-end">
						<Button
							disabled={processing}
							type="submit"
							variant="soft-secondary"
							className="px-5">
							Kaydet
							{processing ? (
								<LoadingIcon
									icon="tail-spin"
									className="ml-2 h-5 w-5"
								/>
							) : (
								<Lucide
									icon="CheckCheck"
									className="ml-2 h-5 w-5 text-success"
								/>
							)}
						</Button>
					</div>
				</form>
			</div>
		</>
	)
}

Create.layout = (page: any) => (
	<AuthenticatedLayout
		breadcrumb={[
			{
				title: 'Dashboard',
				href: route('hotel.dashboard.index'),
			},
			{
				title: 'Kullanıcılar',
				href: route('hotel.users.index'),
			},
			{
				title: 'Yeni Kullanıcı',
				href: route('hotel.users.create'),
			},
		]}>
		{page}
	</AuthenticatedLayout>
)

export default Create
