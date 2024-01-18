import {Menu} from '@/stores/sideMenuSlice'
import {slideDown, slideUp} from '@/utils/helper'
import {router} from '@inertiajs/react'
import _ from 'lodash'

export interface FormattedMenu extends Menu {
	active?: boolean
	activeDropdown?: boolean
	subMenu?: FormattedMenu[]
	permission?: string[]
}

// Setup side menu
const findActiveMenu = (subMenu: Menu[] | Menu, location: string | undefined): boolean => {
	let match = false
	if (Array.isArray(subMenu)) {
		let matches: boolean[] = []
		subMenu.forEach((sub) => {
			if (sub.pathname && location !== undefined) {
				matches.push(sub.pathname.search(location.split('/')[1]) !== -1)
			} else {
				matches.push(false)
			}
		})
		match = matches.includes(true)
	} else {
		if (subMenu.pathname && location !== undefined) {
			match = subMenu.pathname.search(location.split('/')[1]) !== -1
		}
	}
	return match
}

const nestedMenu = (
	menu: Array<FormattedMenu | 'divider'>,
	location: string | undefined,
	role: string,
	permissions: string[],
	pricingPolicy: string,
) => {
	const formattedMenu: Array<FormattedMenu | 'divider'> = []
	menu.forEach((item, key) => {
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
				location !== undefined &&
				(menuItem.subMenu !== undefined
					? (menuItem.pathname !== undefined && menuItem.pathname.endsWith(location)) ||
					  findActiveMenu(menuItem.subMenu, location)
					: findActiveMenu(menuItem, location)) &&
				!menuItem.ignore

			if (menuItem.subMenu) {
				menuItem.activeDropdown =
					location !== undefined && findActiveMenu(menuItem.subMenu, location) && !menuItem.ignore
				// Nested menu
				const subMenu: Array<FormattedMenu> = []
				if (pricingPolicy === 'person_based' && menuItem.title === 'Fiyatlandırma') {
					subMenu.push({
						icon: 'Percent',
						title: 'Varyasyon Çarpanları',
						pathname: route('hotel.variations.index'),
						permission: ['hotel.variations.index'],
					})
				}
				nestedMenu(menuItem.subMenu, location, role, permissions, pricingPolicy).map(
					(menu) => typeof menu !== 'string' && subMenu.push(menu),
				)
				menuItem.subMenu = subMenu.reverse()
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
			router.visit(menu.pathname)
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
