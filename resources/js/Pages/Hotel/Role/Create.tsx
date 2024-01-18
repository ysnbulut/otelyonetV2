import React from 'react'
import {FormInput, FormLabel, FormSwitch} from '@/Components/Form'
import {Head, Link, router, useForm} from '@inertiajs/react'
import {PageProps} from './types/create'
import TomSelect from '@/Components/TomSelect'
import Button from '@/Components/Button'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Lucide from '@/Components/Lucide'
import Tippy from '@/Components/Tippy'

function Create(props: PageProps) {
	const {data, setData, post, processing, errors} = useForm({
		name: '',
		permissions: [],
	})

	const handleSubmit = (e: any): void => {
		e.preventDefault()
		router.post(route('hotel.roles.store'), data, {
			preserveState: true,
		})
	}
	return (
		<AuthenticatedLayout
			user={props.auth.user}
			role={props.auth.role}
			permissions={props.auth.permissions}
			pricingPolicy={props.auth.pricing_policy}
			breadcrumb={[
				{
					title: 'Dashboard',
					href: route('hotel.dashboard.index'),
				},
				{
					title: 'Roller',
					href: route('hotel.roles.index'),
				},
				{
					title: 'Yeni Rol Ekle',
					href: route('hotel.roles.create'),
				},
			]}>
			<Head title="Yeni Rol Ekle" />
			<div className="my-5 flex items-center justify-between">
				<h2 className="intro-y text-lg font-medium">Yeni Rol Ekle</h2>
				<Tippy
					as={Button}
					onClick={() => router.visit(route('hotel.roles.index'))}
					variant="soft-pending"
					className="intro-x"
					content="Geri">
					<Lucide
						icon="Undo2"
						className="h-5 w-5"
					/>
				</Tippy>
			</div>
			<form
				onSubmit={(e) => handleSubmit(e)}
				className="intro-y box col-span-12 p-5">
				<div className="input-form my-5">
					<FormLabel
						htmlFor="role-name"
						className="flex justify-between">
						Rol Adı
						<span className="mt-1 text-xs text-slate-500 sm:ml-auto sm:mt-0">Gerekli, min 3 max 30 karakter</span>
					</FormLabel>
					<FormInput
						id="role-name"
						type="text"
						placeholder="Rol Adı"
						minLength={3}
						maxLength={30}
						required={true}
						name="name"
						value={data.name}
						onChange={(e) => setData((data) => ({...data, name: e.target.value}))}
						className="w-full"
					/>
					{errors.name && <div className="text-theme-6 mt-2 text-danger">{errors.name}</div>}
				</div>
				<div className="my-5">
					<FormLabel
						htmlFor="role-select"
						className="flex justify-between">
						Rol İzinlerini Seçiniz
						<span className="mt-1 text-xs text-slate-500 sm:ml-auto sm:mt-0">Gerekli, min 1 seçenek</span>
					</FormLabel>
					<TomSelect
						id="role-select"
						name="permissions[]"
						data-placeholder="Rol İzinlerini Seçiniz"
						multiple
						value={data.permissions}
						onChange={(e: any) =>
							setData((data) => ({...data, permissions: e.map((permission: string) => permission)}))
						}
						className="w-full">
						{props.permissions.map((permission) => (
							<option
								key={permission.id}
								value={permission.name}>
								{permission.name}
							</option>
						))}
					</TomSelect>
					{errors.permissions && <div className="text-theme-6 mt-2 text-danger">{errors.permissions}</div>}
				</div>
				<div className="my-5 flex justify-end">
					<Button
						type="submit"
						variant="success"
						className="px-5"
						elevated>
						{' '}
						Kaydet
					</Button>
				</div>
			</form>
		</AuthenticatedLayout>
	)
}

export default Create
