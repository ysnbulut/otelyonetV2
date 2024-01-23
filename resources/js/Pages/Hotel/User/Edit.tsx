import React, {useEffect, useState} from 'react'
import {FormInput, FormLabel, FormSwitch} from '@/Components/Form'
import {Head, Link, router, useForm} from '@inertiajs/react'
import {PageProps, UpdateUserDataProps} from './types/edit'
import TomSelect from '@/Components/TomSelect'
import Button from '@/Components/Button'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Lucide from '@/Components/Lucide'
import Tippy from '@/Components/Tippy'
import LoadingIcon from '@/Components/LoadingIcon'

function Edit(props: PageProps) {
	const {data, setData, put, processing, errors} = useForm({
		...props.user,
		password: '',
		password_confirmation: '',
		password_change: '0',
		role: props.roles.find((role) => role.name === props.user_role)?.id.toString() || '',
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
		put(route('hotel.users.update', props.user.id), {
			preserveScroll: true,
			onSuccess: (response: any) => {
				console.log(response)
				router.visit(route('hotel.users.index'))
			},
			onError: (errors: any) => {
				console.log(errors)
			},
		})
	}

	return (
		<>
			<Head title="Misafirler" />
			<div className="mt-10 flex items-center justify-between">
				<h2 className="intro-y truncate text-lg font-medium">Düzenle {props.user.name}</h2>
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
			<div className="mt-5 grid grid-cols-12 gap-2">
				<form
					onSubmit={(e) => handleSubmit(e)}
					className="intro-y box col-span-12 p-5">
					<div className="flex w-full flex-col gap-2 lg:flex-row">
						<div className="input-form my-2 w-full lg:w-1/2">
							<FormLabel
								htmlFor="user-name"
								className="flex w-full flex-nowrap justify-between gap-2 whitespace-nowrap">
								Ad Soyad
								<span className="me-2 mt-1 whitespace-pre-wrap text-right text-xs text-slate-500 sm:ml-auto sm:mt-0">
									Gerekli, minimum 3 karakter
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
								className="flex w-full flex-nowrap justify-between gap-2 whitespace-nowrap">
								E-posta adresi
								<span className="me-2 mt-1 whitespace-pre-wrap text-right text-xs text-slate-500 sm:ml-auto sm:mt-0">
									Gerekli, Lütfen e-mail giriniz.
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
								className="flex w-full flex-nowrap justify-between gap-2 whitespace-nowrap">
								Şifre
								<span className="me-2 mt-1 whitespace-pre-wrap text-right text-xs text-slate-500 sm:ml-auto sm:mt-0">
									Gerekli, Minimum 6 karakter.
								</span>
							</FormLabel>
							<FormInput
								className="w-full"
								id="user-password"
								type="password"
								required={newPassword}
								minLength={6}
								name="password"
								value={data.password}
								onChange={(e) => setData((data) => ({...data, password: e.target.value}))}
								placeholder="Şifre"
								disabled={!newPassword}
							/>
							{errors.password && <div className="text-theme-6 mt-2 text-danger">{errors.password}</div>}
						</div>
						<div className="input-form my-2 w-full lg:w-1/2">
							<FormLabel
								htmlFor="user-password-confirmation"
								className="flex w-full flex-nowrap justify-between gap-2 whitespace-nowrap">
								Şifre tekrarı
								<span className="me-2 mt-1 whitespace-pre-wrap text-right text-xs text-slate-500 sm:ml-auto sm:mt-0">
									Gerekli, Bir önceki şifrenin aynısı yazılmalı.
								</span>
							</FormLabel>
							<FormInput
								className="w-full"
								id="user-password-confirmation"
								type="password"
								required={newPassword}
								minLength={6}
								name="password_confirmation"
								value={data.password_confirmation}
								onChange={(e) => setData((data) => ({...data, password_confirmation: e.target.value}))}
								placeholder="Şifre Tekrarı"
								disabled={!newPassword}
							/>
							{errors.password_confirmation && (
								<div className="text-theme-6 mt-2 text-danger">{errors.password_confirmation}</div>
							)}
						</div>
					</div>
					<div className="my-3">
						<div className="mt-2 flex justify-end lg:mr-5">
							<div className="flex items-center">
								<FormSwitch className="mt-2">
									<FormSwitch.Label
										htmlFor="password-change"
										className="mr-2">
										Şifre değiştirilsin mi?
									</FormSwitch.Label>
									<FormSwitch.Input
										id="password-change"
										name="password_change"
										value={data.password_change}
										onChange={(e) => setData((data) => ({...data, password_change: e.target.checked ? '1' : '0'}))}
										type="checkbox"
									/>
								</FormSwitch>
							</div>
						</div>
					</div>
					<div className="my-2">
						<FormLabel
							htmlFor="role-select"
							className="flex w-full flex-nowrap justify-between gap-2 whitespace-nowrap">
							Kullanıcının Rolüni Seçiniz
						</FormLabel>
						<TomSelect
							id="role-select"
							name="role"
							data-placeholder="Kullanıcının Rolüni Seçiniz"
							value={data.role}
							onChange={(e) => setData((data) => ({...data, role: e.toString()}))}
							className="w-full">
							{props.roles.map((role) => (
								<option
									key={role.id}
									value={role.id}>
									{role.name}
								</option>
							))}
						</TomSelect>
						{errors.role && <div className="text-theme-6 mt-2 text-danger">{errors.role}</div>}
					</div>
					<div className="flex justify-end">
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

Edit.layout = (page: any) => (
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
				title: `${page.props.user.name} Kullanıcısını Düzenle`,
				href: route('hotel.users.edit', page.props.user.id),
			},
		]}>
		{page}
	</AuthenticatedLayout>
)
export default Edit
