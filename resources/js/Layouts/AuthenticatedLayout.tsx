import {Dispatch, PropsWithChildren, ReactNode, SetStateAction, useEffect, useState} from 'react'
import {Transition} from 'react-transition-group'
import {selectSideMenu} from '@/stores/sideMenuSlice'
import {useAppSelector} from '@/stores/hooks'
import {enter, FormattedMenu, leave, linkTo, nestedMenu} from '@/types/side-menu'
import Lucide from '@/Components/Lucide'
import logoUrl from '../../images/logo.png'
import clsx from 'clsx'
import TopBar from '@/Components/TopBar'
import MobileMenu from '@/Components/MobileMenu'
import SideMenuTooltip from '@/Components/SideMenuTooltip'
import {Link, usePage} from '@inertiajs/react'
import {PageProps, User} from '@/types'
// @ts-ignore
import {motion} from 'framer-motion'
interface BreadcrumbItem {
	title: string
	href: string
}
function Authenticated({
	header,
	breadcrumb,
	children,
}: PropsWithChildren<{
	header?: ReactNode
	breadcrumb: BreadcrumbItem[]
}>) {
	const {props} = usePage<PageProps>()
	const [formattedMenu, setFormattedMenu] = useState<Array<FormattedMenu | 'divider'>>([])
	const sideMenuStore = useAppSelector(selectSideMenu)
	const sideMenu = () => nestedMenu(sideMenuStore, props.auth.role, props.auth.permissions, props.auth.pricing_policy)
	useEffect(() => {
		setFormattedMenu(sideMenu())
	}, [sideMenuStore, route().current()])
	return (
		<div className="py-2">
			<MobileMenu
				role={props.auth.role}
				permissions={props.auth.permissions}
				pricingPolicy={props.auth.pricing_policy}
			/>
			<div className="relative mt-[4.7rem] flex md:mt-0">
				{/* BEGIN: Side Menu */}
				<nav className="hidden w-[85px] overflow-x-hidden pb-16 pr-5 md:block xl:w-[230px]">
					<Link
						href={route('hotel.dashboard.index')}
						className="intro-x flex items-center pl-5 pt-4">
						<img
							alt="Midone Tailwind HTML Admin Template"
							className="w-44"
							src={logoUrl}
						/>
					</Link>
					<Divider
						type="div"
						className="my-6"
					/>
					<ul>
						{/* BEGIN: First Child */}
						{formattedMenu.map((menu, menuKey) =>
							menu == 'divider' ? (
								<Divider
									type="li"
									className="my-6"
									key={menuKey}
								/>
							) : (
								<li key={menuKey}>
									<Menu
										menu={menu}
										formattedMenuState={[formattedMenu, setFormattedMenu]}
										level="first"
									/>
									{/* BEGIN: Second Child */}
									{menu.subMenu && (
										<Transition
											in={menu.activeDropdown}
											onEnter={enter}
											onExit={leave}
											timeout={300}>
											<ul
												className={clsx([
													'rounded-lg bg-black/10 dark:bg-darkmode-900/30',
													{block: menu.activeDropdown},
													{hidden: !menu.activeDropdown},
												])}>
												{menu.subMenu.map((subMenu, subMenuKey) => (
													<li key={subMenuKey}>
														<Menu
															menu={subMenu}
															formattedMenuState={[formattedMenu, setFormattedMenu]}
															level="second"
														/>
														{/* BEGIN: Third Child */}
														{subMenu.subMenu && (
															<Transition
																in={subMenu.activeDropdown}
																onEnter={enter}
																onExit={leave}
																timeout={300}>
																<ul
																	className={clsx([
																		'rounded-lg bg-black/10 dark:bg-darkmode-900/30',
																		{
																			block: subMenu.activeDropdown,
																		},
																		{hidden: !subMenu.activeDropdown},
																	])}>
																	{subMenu.subMenu.map((lastSubMenu, lastSubMenuKey) => (
																		<li key={lastSubMenuKey}>
																			<Menu
																				menu={lastSubMenu}
																				formattedMenuState={[formattedMenu, setFormattedMenu]}
																				level="third"
																			/>
																		</li>
																	))}
																</ul>
															</Transition>
														)}
														{/* END: Third Child */}
													</li>
												))}
											</ul>
										</Transition>
									)}
									{/* END: Second Child */}
								</li>
							),
						)}
						{/* END: First Child */}
					</ul>
				</nav>
				{/* END: Side Menu */}
				{/* BEGIN: Content */}
				<div className="md:max-w-auto min-h-screen min-w-0 max-w-full flex-1 rounded-[30px] bg-slate-100 px-4 pb-10 before:block before:h-px before:w-full before:content-[''] md:px-[22px] dark:bg-darkmode-700">
					<TopBar breadcrumb={breadcrumb} />
					{children}
				</div>
				{/* END: Content */}
				<motion.div
					className="fixed bottom-9 left-[calc(50vw-1.5rem)] z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary"
					whileHover={{scale: [1, 1.3, 1.2, 1, 1.2], rotate: 315}}
					whileTap={{scale: [1, 1.3, 1.2, 1, 1.2], rotate: 315}}>
					<Lucide
						icon="Plus"
						className="h-8 w-8 text-white"
					/>
				</motion.div>
			</div>
		</div>
	)
}

function Menu(props: {
	className?: string
	menu: FormattedMenu
	formattedMenuState: [(FormattedMenu | 'divider')[], Dispatch<SetStateAction<(FormattedMenu | 'divider')[]>>]
	level: 'first' | 'second' | 'third'
}) {
	const [formattedMenu, setFormattedMenu] = props.formattedMenuState
	return (
		<SideMenuTooltip
			as="a"
			content={props.menu.title}
			href={props.menu.subMenu ? '#' : props.menu.pathname}
			className={clsx([
				'relative mb-1 flex h-[50px] items-center rounded-full pl-5 text-white',
				{
					'dark:text-slate-300': props.menu.active && props.level != 'first',
					'text-white/70 dark:text-slate-400': !props.menu.active && props.level != 'first',
					'z-10 bg-slate-100 dark:bg-darkmode-700': props.menu.active && props.level == 'first',
					"before:absolute before:right-0 before:top-0 before:-mr-5 before:-mt-[30px] before:h-[30px] before:w-[30px] before:rotate-90 before:scale-[1.04] before:bg-menu-corner before:bg-[length:100%] before:content-[''] dark:before:bg-menu-corner-dark":
						props.menu.active && props.level == 'first',
					"after:absolute after:right-0 after:top-0 after:-mr-5 after:mt-[50px] after:h-[30px] after:w-[30px] after:scale-[1.04] after:bg-menu-corner after:bg-[length:100%] after:content-[''] dark:after:bg-menu-corner-dark":
						props.menu.active && props.level == 'first',
					'[&>div:nth-child(1)]:hover:before:bg-white/5 [&>div:nth-child(1)]:hover:before:dark:bg-darkmode-500/70':
						!props.menu.active && !props.menu.activeDropdown && props.level == 'first',
				},
				props.className,
			])}
			onClick={(event: React.MouseEvent) => {
				event.preventDefault()
				linkTo(props.menu)
				setFormattedMenu([...formattedMenu])
			}}>
			<div
				className={clsx({
					'text-primary dark:text-slate-300': props.menu.active && props.level == 'first',
					'dark:text-slate-400': !props.menu.active && props.level == 'first',
					"before:absolute before:right-0 before:top-0 before:z-[-1] before:-mr-5 before:h-full before:w-12 before:bg-slate-100 before:content-[''] before:dark:bg-darkmode-700":
						props.menu.active && props.level == 'first',
					"before:absolute before:left-0 before:top-0 before:z-[-1] before:h-full before:w-[230px] before:rounded-l-full before:transition before:duration-100 before:ease-in before:content-['']":
						!props.menu.activeDropdown && !props.menu.active && props.level == 'first',
				})}>
				<Lucide icon={props.menu.icon} />
			</div>
			<div
				className={clsx([
					'ml-3 hidden w-full items-center xl:flex',
					{'font-medium': props.menu.active && props.level != 'first'},
					{
						'font-medium text-slate-800 dark:text-slate-300': props.menu.active && props.level == 'first',
					},
					{
						'dark:text-slate-400': !props.menu.active && props.level == 'first',
					},
				])}>
				{props.menu.title}
				{props.menu.subMenu && (
					<div
						className={clsx([
							'ml-auto mr-5 hidden transition duration-100 ease-in xl:block',
							{'rotate-180 transform': props.menu.activeDropdown},
						])}>
						<Lucide
							className="h-4 w-4"
							icon="ChevronDown"
						/>
					</div>
				)}
			</div>
		</SideMenuTooltip>
	)
}

function Divider<C extends React.ElementType>(props: {as?: C} & React.ComponentPropsWithoutRef<C>) {
	const {className, ...computedProps} = props
	const Component = props.as || 'div'

	return (
		<Component
			{...computedProps}
			className={clsx([props.className, 'relative z-10 h-px w-full bg-white/[0.08] dark:bg-white/[0.07]'])}></Component>
	)
}

export default Authenticated
