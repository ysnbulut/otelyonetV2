import React from 'react'
import {FormInput, FormLabel} from '@/Components/Form'
import {Head, router, useForm} from '@inertiajs/react'
import {PageProps} from './types/edit'
import TomSelect from '@/Components/TomSelect'
import Button from '@/Components/Button'
import AuthenticatedLayout from '@/Layouts/HotelAuthenticatedLayout'
import Lucide from '@/Components/Lucide'
import Tippy from '@/Components/Tippy'
import LoadingIcon from '@/Components/LoadingIcon'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

function Edit(props: PageProps) {
	const MySwal = withReactContent(Swal)
	const {data, setData, put, processing, errors} = useForm({
		name: props.role.name,
		permissions: props.rolePermissions.map((permission: string) => permission),
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

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
		e.preventDefault()
		put(route('hotel.roles.update', props.role.id), {
			preserveScroll: true,
			onSuccess: (response: any) => {
				Toast.fire({
					icon: 'success',
					title: 'Rol başarıyla güncellendi.',
				}).then((r) => {
					console.log(r)
				})
			},
			onError: (errors: any) => {
				Toast.fire({
					icon: 'error',
					title: 'Hata!',
				}).then((r) => {
					console.log(r)
				})
			},
		})
	}
	return (
		<>
			<Head title={`${props.role.name} Rolünü Düzenle`} />
			<div className="my-5 flex items-center justify-between">
				<h2 className="intro-y truncate text-lg font-medium">Düzenle {props.role.name}</h2>
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
						value={data.permissions}
						onChange={(e: string[]) =>
							setData((data) => ({...data, permissions: e.map((permission: string) => permission)}))
						}
						multiple
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
				title: 'Roller',
				href: route('hotel.roles.index'),
			},
			{
				title: 'Rol Düzenle',
				href: route('hotel.roles.edit', page.props.role.id),
			},
		]}>
		{page}
	</AuthenticatedLayout>
)

export default Edit
