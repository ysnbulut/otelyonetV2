import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import DeleteUserForm from './Partials/DeleteUserForm'
import UpdatePasswordForm from './Partials/UpdatePasswordForm'
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm'
import {Head} from '@inertiajs/react'
import {PageProps} from '@/types'

export default function Edit({auth, mustVerifyEmail, status}: PageProps<{mustVerifyEmail: boolean; status?: string}>) {
	return (
		<>
			<Head title="Profile" />

			<div className="py-12">
				<div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
					<div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
						<UpdateProfileInformationForm
							mustVerifyEmail={mustVerifyEmail}
							status={status}
							className="max-w-xl"
						/>
					</div>

					<div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
						<UpdatePasswordForm className="max-w-xl" />
					</div>

					<div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
						<DeleteUserForm className="max-w-xl" />
					</div>
				</div>
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
				title: 'Profile',
				href: route('hotel.profile.edit'),
			},
		]}
		header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Profile</h2>}>
		{page}
	</AuthenticatedLayout>
)
