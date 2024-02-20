import {Transition} from 'react-transition-group'
import {useState, useEffect, createRef, Dispatch, SetStateAction} from 'react'
import {toRaw} from '@/utils/helper'
import {selectSideMenu} from '@/stores/sideMenuSlice'
import {useAppSelector} from '@/stores/hooks'
import {FormattedMenu, nestedMenu} from '@/types/side-menu'
import {linkTo, enter, leave} from './mobile-menu'
import Lucide from '@/Components/Lucide'
import logoUrl from '../../../images/logo.png'
import clsx from 'clsx'
import SimpleBar from 'simplebar'

function Main({role, permissions, pricingPolicy}: {role: string; permissions: string[]; pricingPolicy: string}) {
	const [formattedMenu, setFormattedMenu] = useState<Array<FormattedMenu | 'divider'>>([])
	const sideMenuStore = useAppSelector(selectSideMenu)
	const mobileMenu = () => nestedMenu(toRaw(sideMenuStore), role, permissions, pricingPolicy)
	const [activeMobileMenu, setActiveMobileMenu] = useState(false)
	const scrollableRef = createRef<HTMLDivElement>()

	useEffect(() => {
		if (scrollableRef.current) {
			new SimpleBar(scrollableRef.current)
		}
		setFormattedMenu(mobileMenu())
	}, [sideMenuStore, location])

	return (
		<>
			{/* BEGIN: Mobile Menu */}
			<div
				className={clsx([
					'fixed z-[60] -mx-3 -mt-5 mb-6 w-full border-b border-white/[0.08] bg-primary/90 sm:-mx-8 md:hidden dark:bg-darkmode-800/90',
					"before:fixed before:inset-x-0 before:z-10 before:h-screen before:w-full before:bg-black/90 before:transition-opacity before:duration-200 before:ease-in-out before:content-['']",
					!activeMobileMenu && 'before:invisible before:opacity-0',
					activeMobileMenu && 'before:visible before:opacity-100',
				])}>
				<div className="flex h-[70px] items-center px-3 sm:px-8">
					<a
						href=""
						className="mr-auto flex">
						<img
							alt="Midone Tailwind HTML Admin Template"
							className="w-44"
							src={logoUrl}
						/>
					</a>
					<a
						href="#"
						onClick={(e) => e.preventDefault()}>
						<Lucide
							icon="BarChart2"
							className="h-8 w-8 -rotate-90 transform text-white"
							onClick={() => {
								setActiveMobileMenu(!activeMobileMenu)
							}}
						/>
					</a>
				</div>
				<div
					ref={scrollableRef}
					className={clsx([
						'left-0 top-0 z-20 -ml-[100%] h-screen w-[270px] bg-primary transition-all duration-300 ease-in-out dark:bg-darkmode-800',
						'[&[data-simplebar]]:fixed [&_.simplebar-scrollbar]:before:bg-black/50',
						activeMobileMenu && 'ml-0',
					])}>
					<a
						href="#"
						onClick={(e) => e.preventDefault()}
						className={clsx([
							'fixed right-0 top-0 mr-4 mt-4 transition-opacity duration-200 ease-in-out',
							!activeMobileMenu && 'invisible opacity-0',
							activeMobileMenu && 'visible opacity-100',
						])}>
						<Lucide
							icon="XCircle"
							className="h-8 w-8 -rotate-90 transform text-white"
							onClick={() => {
								setActiveMobileMenu(!activeMobileMenu)
							}}
						/>
					</a>
					<ul className="py-2">
						{/* BEGIN: First Child */}
						{formattedMenu.map((menu, menuKey) =>
							menu == 'divider' ? (
								<Divider
									as="li"
									className="my-6"
									key={menuKey}></Divider>
							) : (
								<li key={menuKey}>
									<Menu
										menu={menu}
										formattedMenuState={[formattedMenu, setFormattedMenu]}
										level="first"
										setActiveMobileMenu={setActiveMobileMenu}></Menu>
									{/* BEGIN: Second Child */}
									{menu.subMenu && (
										<Transition
											in={menu.activeDropdown}
											onEnter={enter}
											onExit={leave}
											timeout={300}>
											<ul
												className={clsx([
													'mx-4 my-1 rounded-lg bg-black/10 dark:bg-darkmode-700',
													!menu.activeDropdown && 'hidden',
													menu.activeDropdown && 'block',
												])}>
												{menu.subMenu.map((subMenu, subMenuKey) => (
													<li
														className="mx-auto w-full max-w-[1280px]"
														key={subMenuKey}>
														<Menu
															menu={subMenu}
															formattedMenuState={[formattedMenu, setFormattedMenu]}
															level="second"
															setActiveMobileMenu={setActiveMobileMenu}></Menu>
														{/* BEGIN: Third Child */}
														{subMenu.subMenu && (
															<Transition
																in={subMenu.activeDropdown}
																onEnter={enter}
																onExit={leave}
																timeout={300}>
																<ul
																	className={clsx([
																		'my-1 rounded-lg bg-black/10 dark:bg-darkmode-600',
																		!subMenu.activeDropdown && 'hidden',
																		subMenu.activeDropdown && 'block',
																	])}>
																	{subMenu.subMenu.map((lastSubMenu, lastSubMenuKey) => (
																		<li
																			className="mx-auto w-full max-w-[1280px]"
																			key={lastSubMenuKey}>
																			<Menu
																				menu={lastSubMenu}
																				formattedMenuState={[formattedMenu, setFormattedMenu]}
																				level="third"
																				setActiveMobileMenu={setActiveMobileMenu}></Menu>
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
				</div>
			</div>
			{/* END: Mobile Menu */}
		</>
	)
}

function Menu(props: {
	menu: FormattedMenu
	formattedMenuState: [(FormattedMenu | 'divider')[], Dispatch<SetStateAction<(FormattedMenu | 'divider')[]>>]
	level: 'first' | 'second' | 'third'
	setActiveMobileMenu: Dispatch<SetStateAction<boolean>>
}) {
	const [formattedMenu, setFormattedMenu] = props.formattedMenuState

	return (
		<a
			href={props.menu.subMenu ? '#' : route(props.menu.pathname || '#')}
			className={clsx([
				'flex h-[50px] items-center text-white',
				props.level == 'first' && 'px-6',
				props.level != 'first' && 'px-4',
			])}
			onClick={(event) => {
				event.preventDefault()
				linkTo(props.menu, props.setActiveMobileMenu)
				setFormattedMenu(toRaw(formattedMenu))
			}}>
			<div>
				<Lucide icon={props.menu.icon} />
			</div>
			<div className="ml-3 flex w-full items-center">
				{props.menu.title}
				{props.menu.subMenu && (
					<div
						className={clsx([
							'ml-auto transition duration-100 ease-in',
							props.menu.activeDropdown && 'rotate-180 transform',
						])}>
						<Lucide
							icon="ChevronDown"
							className="h-5 w-5"
						/>
					</div>
				)}
			</div>
		</a>
	)
}

function Divider<C extends React.ElementType>(props: {as?: C} & React.ComponentPropsWithoutRef<C>) {
	const {className, ...computedProps} = props
	const Component = props.as || 'div'

	return (
		<Component
			{...computedProps}
			className={clsx([props.className, 'relative h-px w-full bg-white/[0.08]'])}></Component>
	)
}

export default Main
