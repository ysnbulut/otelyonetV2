import React, {useState} from 'react'
import {PageProps, BedTypeProps} from './types'
import {Head, useForm} from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import {FormInput, FormLabel, FormTextarea} from '@/Components/Form'
import Button from '@/Components/Button'
import Item from '@/Pages/Hotel/BedType/components/Item'
import axios from 'axios'
import Lucide from '@/Components/Lucide'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Tippy from '@/Components/Tippy'
function Index(props: PageProps) {
	const MySwal = withReactContent(Swal)
	const {data, setData, errors, reset, setError, clearErrors} = useForm({
		name: '',
		person_num: '1',
		description: '',
	})
	const [formVisible, setFormVisible] = useState<boolean>(false)
	const [bedTypes, setBedTypes] = useState<BedTypeProps[]>(props.bedTypes)
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		axios
			.post(route('hotel.bed_types.store'), data)
			.then((response) => {
				setBedTypes((prevState) => [...prevState, response.data])
				reset()
				setFormVisible(false)
				Toast.fire({
					icon: 'success',
					title: 'Yatak Tipi başarıyla eklendi',
				})
				clearErrors()
			})
			.catch((error) => {
				setError(error.response.data.errors)
			})
	}

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

	return (
		<>
			<Head title="Yatak Tipleri" />
			<div className="my-5 flex w-full items-center justify-between">
				<h2 className="intro-y text-lg font-medium">Yatak Tipleri</h2>
				<Tippy
					as={Button}
					onClick={() => setFormVisible(!formVisible)}
					variant={formVisible ? 'soft-danger' : 'soft-primary'}
					content={formVisible ? 'Yeni Ekle' : 'Vazgeç'}>
					{formVisible ? (
						<Lucide
							icon="Minus"
							className="h-5 w-5"
						/>
					) : (
						<Lucide
							icon="Plus"
							className="h-5 w-5"
						/>
					)}
				</Tippy>
			</div>
			{formVisible && (
				<fieldset className="-intro-y box mb-10 flex w-full flex-col items-center justify-between gap-3 rounded-lg p-5">
					<legend className="text-xl font-bold">Yatak Tipi Ekle</legend>
					<form
						id="add-bed-type-form"
						onSubmit={(e) => handleSubmit(e)}
						className="w-full">
						<div className="flex w-full flex-col gap-3 md:flex-row">
							<div className="w-full flex-grow">
								<FormLabel
									htmlFor="features"
									className="pl-2 text-base font-semibold">
									Yatak Tipi Adı
								</FormLabel>
								<FormInput
									id="features"
									name="name"
									value={data.name}
									onChange={(event) => setData((data) => ({...data, name: event.target.value}))}
									type="text"
									placeholder="Yatak Tipi Adı"
								/>
								{errors.name && <span className="pl-1 text-xs font-thin text-danger">{errors.name}</span>}
							</div>
							<div className="flex-shrink">
								<FormLabel
									htmlFor="features"
									className="pl-2 text-base font-semibold">
									Kaç Kişilik ?
								</FormLabel>
								<FormInput
									id="features"
									name="name"
									value={data.person_num}
									onChange={(event) => setData((data) => ({...data, person_num: event.target.value}))}
									type="number"
									placeholder="Kaç kişilik?"
								/>
								{errors.person_num && <span className="pl-1 text-xs font-thin text-danger">{errors.person_num}</span>}
							</div>
						</div>
						<div className="w-full">
							<FormLabel
								htmlFor="features"
								className="pl-2 text-base font-semibold">
								Açıklama
							</FormLabel>
							<FormTextarea
								id="description"
								name="description"
								value={data.description}
								onChange={(event) => setData((data) => ({...data, description: event.target.value}))}
								placeholder="Açıklama"
							/>
							{errors.description && <span className="pl-1 text-xs font-thin text-danger">{errors.description}</span>}
						</div>
						<div className="mt-3 flex items-center justify-end gap-2">
							<Button
								size="sm"
								type="button"
								variant="soft-secondary"
								onClick={() => setFormVisible(!formVisible)}
								className="px-2">
								Vazgeç
								<Lucide
									icon="X"
									className="ml-2 h-5 w-5 text-danger"
								/>
							</Button>
							<Button
								size="sm"
								type="submit"
								variant="soft-secondary"
								className="px-2">
								Ekle
								<Lucide
									icon="CheckCheck"
									className="ml-2 h-5 w-5 text-success"
								/>
							</Button>
						</div>
					</form>
				</fieldset>
			)}
			{bedTypes.length > 0 ? (
				bedTypes.map((bedType) => (
					<Item
						key={bedType.id}
						bedType={bedType}
						setBedTypes={setBedTypes}
					/>
				))
			) : (
				<div className="box flex min-h-96 flex-col items-center justify-center text-slate-700 text-opacity-30 dark:text-slate-500 dark:text-opacity-30">
					<div className="flex items-center justify-center gap-5">
						<Lucide
							icon="AlertTriangle"
							className="h-12 w-12"
						/>
						<span className="text-3xl font-semibold">Henüz bir yatak tipi oluşturulmamış.</span>
					</div>
				</div>
			)}
		</>
	)
}

Index.layout = (page: React.ReactNode) => (
	<AuthenticatedLayout
		breadcrumb={[
			{
				title: 'Dashboard',
				href: route('hotel.dashboard.index'),
			},
			{
				title: 'Yatak Tipleri',
				href: route('hotel.bed_types.index'),
			},
		]}>
		{page}
	</AuthenticatedLayout>
)

export default Index
