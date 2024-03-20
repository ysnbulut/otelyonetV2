import {Menu} from '@/stores/hotelSideMenuSlice'
import {slideDown, slideUp} from '@/utils/helper'
import {router} from '@inertiajs/react'
import _ from 'lodash'

export interface FormattedMenu extends Menu {
	active?: boolean
	activeDropdown?: boolean
	subMenu?: FormattedMenu[]
	permission?: string[]
}

const checkPathname = (menuPathname: string | undefined, currentPathname: string | undefined) => {
	const pathnameSplit = menuPathname?.split('.')
	const currentSplit = currentPathname?.split('.')
	return !!(
		pathnameSplit &&
		currentSplit &&
		pathnameSplit[0] === currentSplit[0] &&
		pathnameSplit[1] === currentSplit[1]
	)
}

// Setup side menu
const findActiveMenu = (subMenu: Menu[] | Menu): boolean => {
	let match: boolean
	if (Array.isArray(subMenu)) {
		let matches: boolean[] = []
		subMenu.forEach((sub) => {
			if (sub.pathname === route().current()) {
				matches.push(true)
			} else {
				matches.push(checkPathname(sub.pathname, route().current()))
			}
		})
		match = matches.includes(true)
	} else {
		if (subMenu.pathname === route().current()) {
			match = true
		} else {
			match = checkPathname(subMenu.pathname, route().current())
		}
	}
	return match
}

const nestedMenu = (
	menu: Array<FormattedMenu | 'divider'>,
	role: string | undefined,
	permissions: string[] | undefined,
	pricingPolicy: string | undefined,
) => {
	const formattedMenu: Array<FormattedMenu | 'divider'> = []
	menu.forEach((item) => {
		if (typeof item !== 'string') {
			const menuItem: FormattedMenu = {
				icon: item.icon,
				title: item.title,
				pathname: item.pathname,
				subMenu: item.subMenu,
				ignore: item.ignore,
				permission: item.permission,
			}

			menuItem.active =
				(menuItem.subMenu !== undefined ? findActiveMenu(menuItem.subMenu) : findActiveMenu(menuItem)) &&
				!menuItem.ignore

			if (menuItem.subMenu) {
				// Nested menu
				const subMenu: Array<FormattedMenu> = []
				if (pricingPolicy === 'person_based' && menuItem.title === 'Fiyatlar') {
					subMenu.push({
						icon: 'Percent',
						title: 'Varyasyon Çarpanları',
						pathname: 'hotel.variations.index',
						permission: ['hotel.variations.index'],
					})
					menuItem.subMenu = [...subMenu, ...menuItem.subMenu]
				}
				menuItem.activeDropdown = findActiveMenu(menuItem.subMenu) && !menuItem.ignore
				nestedMenu(menuItem.subMenu, role, permissions, pricingPolicy).map(
					(menu) => typeof menu !== 'string' && subMenu.push(menu),
				)
				if (pricingPolicy === 'person_based' && menuItem.title === 'Fiyatlar') {
					menuItem.subMenu = subMenu.slice(1, 4).reverse()
				} else {
					menuItem.subMenu = subMenu.reverse()
				}
			} else {
				menuItem.activeDropdown = false
			}

			if (role !== 'Super Admin') {
				if (permissions && permissions.find((permission) => _.includes(menuItem.permission, permission))) {
					formattedMenu.push(menuItem)
				}
			} else {
				formattedMenu.push(menuItem)
			}
		} else {
			formattedMenu.push(item)
		}
	})
	return formattedMenu
}

const linkTo = (menu: FormattedMenu) => {
	if (menu.subMenu) {
		menu.activeDropdown = !menu.activeDropdown
	} else {
		if (menu.pathname !== undefined) {
			router.visit(route(menu.pathname))
		}
	}
}

const enter = (el: HTMLElement) => {
	slideDown(el, 300)
}

const leave = (el: HTMLElement) => {
	slideUp(el, 300)
}

export {nestedMenu, linkTo, enter, leave}
