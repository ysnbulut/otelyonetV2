import React, {Fragment} from 'react'
import {Dialog, Transition} from '@headlessui/react'
import Button from '@/Components/Button'
import Lucide from '@/Components/Lucide'
import LoadingIcon from '@/Components/LoadingIcon'

interface ExpendedBookingPeriodProps {
	open: boolean
	onClose: React.Dispatch<React.SetStateAction<boolean>>
}

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
	e.preventDefault()
}

function ExpendBookingPeriod(props: ExpendedBookingPeriodProps) {
	const processing = false
	return (
		<Transition
			appear
			show={props.open}
			as={Fragment}>
			<Dialog
				as="div"
				className="relative z-50"
				onClose={() => {
					props.onClose(false)
				}}>
				<Transition.Child
					as={Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0">
					<div className="fixed inset-0 bg-slate-800/50" />
				</Transition.Child>
				<div className="fixed inset-0 overflow-y-auto">
					<div className="flex min-h-full items-center justify-center p-4 text-center">
						<Transition.Child
							as={Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95">
							<form
								className="flex w-full items-center justify-center"
								onSubmit={handleSubmit}>
								<Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-darkmode-400">
									<Dialog.Title
										as="h3"
										className="flex items-center justify-between text-lg font-medium leading-6 text-gray-900">
										<span className="text-dark dark:text-light">nolu Oda Folyosuna yeni Ürün / Hizmet Ekle</span>
										<Button
											rounded
											variant={'soft-dark'}
											className="p-1"
											type="button"
											onClick={() => props.onClose(false)}>
											<Lucide
												icon={'X'}
												className="h-4 w-4"
											/>
										</Button>
									</Dialog.Title>
									<div className="mt-2"></div>
									<div className="mt-5 flex items-center justify-end gap-4">
										<Button
											type="submit"
											disabled={processing}
											variant="soft-secondary">
											{processing ? (
												<LoadingIcon
													icon="tail-spin"
													className="mr-2 h-4 w-4 text-success"
												/>
											) : (
												<Lucide
													icon={'CheckCheck'}
													className="mr-2 h-4 w-4 text-success"
												/>
											)}
											Ekle
										</Button>
									</div>
								</Dialog.Panel>
							</form>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	)
}

export default ExpendBookingPeriod
