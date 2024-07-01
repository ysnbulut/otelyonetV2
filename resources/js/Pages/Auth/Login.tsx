import {useEffect, FormEventHandler} from 'react'
import GuestLayout from '@/Layouts/GuestLayout'
import {Head, useForm} from '@inertiajs/react'
import logoUrl from '../../../images/logo.png'
import illustrationUrl from '../../../images/illustration.svg'
import {FormInput, FormCheck} from '@/Components/Form'
import Button from '@/Components/Button'

export default function Login({status, canResetPassword}: {status?: string; canResetPassword: boolean}) {
	const {data, setData, post, processing, errors, reset} = useForm({
		email: '',
		password: '',
		remember: false,
	})

	useEffect(() => {
		return () => {
			reset('password')
		}
	}, [])

	const submit: FormEventHandler = (e) => {
		e.preventDefault()
		post(route('login.store'))
	}

	return (
		<GuestLayout>
			<Head title="Giriş Yap - Otel Yönetimi - Otelinizi Kolayca Yönetin" />

			<div className="block grid-cols-2 gap-4 xl:grid">
				{/* BEGIN: Login Info */}
				<div className="hidden min-h-screen flex-col xl:flex">
					<a
						href=""
						className="-intro-x flex items-center pt-5">
						<img
							alt="Midone Tailwind HTML Admin Template"
							className="w-44"
							src={logoUrl}
						/>
					</a>
					<div className="my-auto">
						<img
							alt="Midone Tailwind HTML Admin Template"
							className="-intro-x -mt-16 w-1/2"
							src={illustrationUrl}
						/>
						<div className="-intro-x mt-10 text-4xl font-medium leading-tight text-white">
							Otelinizi Kolayca Yönetin
						</div>
						<div className="-intro-x mt-5 text-lg text-white text-opacity-70 dark:text-slate-400">
							Hesabınıza giriş yapmak için birkaç tıklama <br /> daha yapmanız gerekiyor.
						</div>
					</div>
				</div>
				{/* END: Login Info */}
				{/* BEGIN: Login Form */}
				<div className="my-10 flex h-screen py-5 xl:my-0 xl:h-auto xl:py-0">
					<div className="mx-auto my-auto w-full rounded-md bg-white px-5 py-8 shadow-md sm:w-3/4 sm:px-8 lg:w-2/4 xl:ml-20 xl:w-auto xl:bg-transparent xl:p-0 xl:shadow-none dark:bg-darkmode-600">
						<form onSubmit={submit}>
							<h2 className="intro-x text-center text-2xl font-bold xl:text-left xl:text-3xl">Giriş Yap</h2>
							<div className="intro-x mt-2 text-center text-slate-400 xl:hidden">
								Hesabınıza giriş yapmak için birkaç tıklama daha yapmanız gerekiyor.
							</div>
							<div className="intro-x mt-8">
								<FormInput
									type="text"
									className="intro-x block min-w-full px-4 py-3 xl:min-w-[350px]"
									placeholder="E-posta"
									value={data.email}
									onChange={(e) => setData('email', e.target.value)}
									required
								/>
								{errors.email && <div className="text-theme-6 mt-2 text-danger">{errors.email}</div>}
								<FormInput
									type="password"
									className="intro-x mt-4 block min-w-full px-4 py-3 xl:min-w-[350px]"
									placeholder="Şifre"
									value={data.password}
									onChange={(e) => setData('password', e.target.value)}
									required
								/>
								{errors.password && <div className="text-theme-6 mt-2 text-danger">{errors.password}</div>}
							</div>
							<div className="intro-x mt-4 flex text-xs text-slate-600 sm:text-sm dark:text-slate-500">
								<div className="mr-auto flex items-center">
									<FormCheck.Input
										id="remember-me"
										type="checkbox"
										className="mr-2 border"
										name="remember"
									/>
									<label
										className="cursor-pointer select-none"
										htmlFor="remember-me">
										Beni hatırla
									</label>
								</div>
								<a href="">Şifremi Unutum?</a>
							</div>
							<div className="intro-x mt-5 text-center xl:mt-8 xl:text-left">
								<Button
									variant="primary"
									className="w-full px-4 py-3 align-top xl:mr-3 xl:w-32">
									Giriş Yap
								</Button>
								{/*<Button*/}
								{/*    variant="outline-secondary"*/}
								{/*    className="w-full px-4 py-3 mt-3 align-top xl:w-32 xl:mt-0"*/}
								{/*>*/}
								{/*    Register*/}
								{/*</Button>*/}
							</div>
							<div className="intro-x mt-10 text-center text-slate-600 xl:mt-24 xl:text-left dark:text-slate-500">
								By signin up, you agree to our{' '}
								<a
									className="text-primary dark:text-slate-200"
									href="">
									Terms and Conditions
								</a>{' '}
								&{' '}
								<a
									className="text-primary dark:text-slate-200"
									href="">
									Privacy Policy
								</a>
							</div>
						</form>
					</div>
				</div>
				{/* END: Login Form */}
			</div>
		</GuestLayout>
	)
}
