import React, {Fragment, useState} from 'react'
import Lucide from '@/Components/Lucide'
import Breadcrumb from '@/Components/Breadcrumb'
import {FormInput} from '@/Components/Form'
import {Menu, Popover} from '@/Components/Headless'
import _ from 'lodash'
import {Transition} from '@headlessui/react'
import Button from '@/Components/Button'
import {useAppDispatch, useAppSelector} from '@/stores/hooks'
import {selectDarkMode, setDarkMode} from '@/stores/darkModeSlice'
import {router} from '@inertiajs/react'

interface BreadcrumbItem {
	href: string
	title: string
}
function Main({breadcrumb}: {breadcrumb: BreadcrumbItem[]}) {
	const [searchDropdown, setSearchDropdown] = useState(false)
	const showSearchDropdown = () => {
		setSearchDropdown(true)
	}
	const hideSearchDropdown = () => {
		setSearchDropdown(false)
	}

	const dispatch = useAppDispatch()
	const darkMode = useAppSelector(selectDarkMode)

	const setDarkModeClass = () => {
		const el = document.querySelectorAll('html')[0]
		darkMode ? el.classList.add('dark') : el.classList.remove('dark')
		document.documentElement.setAttribute('data-color-scheme', darkMode ? 'dark' : '')
	}

	const switchMode = () => {
		dispatch(setDarkMode(!darkMode))
		localStorage.setItem('darkMode', (!darkMode).toString())
		setDarkModeClass()
	}

	setDarkModeClass()

	const logout = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		router.post(
			route('logout'),
			{},
			{
				onSuccess: () => {
					router.replace(route('login'))
				},
			},
		)
	}

	return (
		<>
			{/* BEGIN: Top Bar */}
			<div className="relative z-50 flex h-[67px] items-center border-b border-slate-200">
				{/* BEGIN: Breadcrumb */}
				<Breadcrumb className="-intro-x mr-auto hidden sm:flex">
					{breadcrumb &&
						breadcrumb.map((item, itemKey) => (
							<Breadcrumb.Link
								key={itemKey}
								to={item.href}
								active={breadcrumb.length === itemKey + 1}>
								{item.title}
							</Breadcrumb.Link>
						))}
				</Breadcrumb>
				{/* END: Breadcrumb */}
				{/* BEGIN: Search */}
				<div className="intro-x relative mr-3 sm:mr-6">
					<div className="relative hidden sm:block">
						<FormInput
							type="text"
							className="w-56 rounded-full border-transparent bg-slate-300/50 pr-8 shadow-none transition-[width] duration-300 ease-in-out focus:w-72 focus:border-transparent dark:bg-darkmode-400/70"
							placeholder="Search..."
							onFocus={showSearchDropdown}
							onBlur={hideSearchDropdown}
						/>
						<Lucide
							icon="Search"
							className="absolute inset-y-0 right-0 my-auto mr-3 h-5 w-5 text-slate-600 dark:text-slate-500"
						/>
					</div>
					<a
						className="relative text-slate-600 sm:hidden"
						href="">
						<Lucide
							icon="Search"
							className="h-5 w-5 dark:text-slate-500"
						/>
					</a>
					{/*<Transition*/}
					{/*	as={Fragment}*/}
					{/*	show={searchDropdown}*/}
					{/*	enter="transition-all ease-linear duration-150"*/}
					{/*	enterFrom="mt-5 invisible opacity-0 translate-y-1"*/}
					{/*	enterTo="mt-[3px] visible opacity-100 translate-y-0"*/}
					{/*	leave="transition-all ease-linear duration-150"*/}
					{/*	leaveFrom="mt-[3px] visible opacity-100 translate-y-0"*/}
					{/*	leaveTo="mt-5 invisible opacity-0 translate-y-1">*/}
					{/*	<div className="absolute right-0 z-10 mt-[3px]">*/}
					{/*		<div className="box w-[450px] p-5">Search Results</div>*/}
					{/*	</div>*/}
					{/*</Transition>*/}
				</div>
				{/* END: Search  */}
				<Button
					onClick={switchMode}
					className="intro-x dark-mode-switcher mr-5 flex h-10 w-10 cursor-pointer items-center justify-center border-none p-0 shadow-none ring-0 focus:ring-0">
					{darkMode ? (
						<Lucide
							icon="Sun"
							className="h-5 w-5  text-slate-600  dark:text-slate-500"
						/>
					) : (
						<Lucide
							icon="Moon"
							className="h-5 w-5  text-slate-600  dark:text-slate-500"
						/>
					)}
				</Button>
				{/* BEGIN: Notifications */}
				{/*<Popover className="intro-x mr-auto sm:mr-6">*/}
				{/*	<Popover.Button*/}
				{/*		className="*/}
				{/*      relative block text-slate-600 outline-none*/}
				{/*      before:absolute before:right-0 before:top-[-2px] before:h-[8px] before:w-[8px] before:rounded-full before:bg-danger before:content-['']*/}
				{/*    ">*/}
				{/*		<Lucide*/}
				{/*			icon="Bell"*/}
				{/*			className="h-5 w-5 dark:text-slate-500"*/}
				{/*		/>*/}
				{/*	</Popover.Button>*/}
				{/*	<Popover.Panel className="mt-2 w-[280px] p-5 sm:w-[350px]">*/}
				{/*		<div className="mb-5 font-medium">Notifications</div>*/}
				{/*		{_.take(fakerData, 5).map((faker, fakerKey) => (*/}
				{/*			<div*/}
				{/*				key={fakerKey}*/}
				{/*				className={clsx(['relative flex cursor-pointer items-center', {'mt-5': fakerKey}])}>*/}
				{/*				<div className="image-fit relative mr-1 h-12 w-12 flex-none">*/}
				{/*					<img*/}
				{/*						alt="Midone Tailwind HTML Admin Template"*/}
				{/*						className="rounded-full"*/}
				{/*						src={faker.photos[0]}*/}
				{/*					/>*/}
				{/*					<div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-success dark:border-darkmode-600"></div>*/}
				{/*				</div>*/}
				{/*				<div className="ml-2 overflow-hidden">*/}
				{/*					<div className="flex items-center">*/}
				{/*						<a*/}
				{/*							href=""*/}
				{/*							className="mr-5 truncate font-medium">*/}
				{/*							{faker.users[0].name}*/}
				{/*						</a>*/}
				{/*						<div className="ml-auto whitespace-nowrap text-xs text-slate-400">{faker.times[0]}</div>*/}
				{/*					</div>*/}
				{/*					<div className="mt-0.5 w-full truncate text-slate-500">{faker.news[0].shortContent}</div>*/}
				{/*				</div>*/}
				{/*			</div>*/}
				{/*		))}*/}
				{/*	</Popover.Panel>*/}
				{/*</Popover>*/}
				{/* END: Notifications  */}
				{/* BEGIN: Account Menu */}
				<Menu>
					<Menu.Button className="intro-x block h-8 w-8 overflow-hidden rounded-full">
						<Lucide
							icon={'User'}
							className=" h-6 w-6 text-slate-600  dark:text-slate-500"
						/>
					</Menu.Button>
					<Menu.Items className="mt-px w-56 bg-primary text-white">
						{/*<Menu.Header className="font-normal">*/}
						{/*	<div className="font-medium">{fakerData[0].users[0].name}</div>*/}
						{/*	<div className="mt-0.5 text-xs text-white/70 dark:text-slate-500">{fakerData[0].jobs[0]}</div>*/}
						{/*</Menu.Header>*/}
						{/*<Menu.Divider className="bg-white/[0.08]" />*/}
						{/*<Menu.Item className="hover:bg-white/5">*/}
						{/*	<Lucide*/}
						{/*		icon="User"*/}
						{/*		className="mr-2 h-4 w-4"*/}
						{/*	/>*/}
						{/*	Profile*/}
						{/*</Menu.Item>*/}
						{/*<Menu.Item className="hover:bg-white/5">*/}
						{/*	<Lucide*/}
						{/*		icon="Lock"*/}
						{/*		className="mr-2 h-4 w-4"*/}
						{/*	/>*/}
						{/*	Reset Password*/}
						{/*</Menu.Item>*/}
						{/*<Menu.Divider className="bg-white/[0.08]" />*/}
						<Menu.Item
							onClick={(e: any) => logout(e)}
							className="hover:bg-white/5">
							<Lucide
								icon="ToggleRight"
								className="mr-2 h-4 w-4"
							/>
							Logout
						</Menu.Item>
					</Menu.Items>
				</Menu>
			</div>
			{/* END: Top Bar */}
		</>
	)
}

export default Main
