import {createSlice} from '@reduxjs/toolkit'
import {RootState} from './store'
import {icons} from '@/Components/Lucide'

export interface Menu {
	icon: keyof typeof icons
	title: string
	pathname?: string
	subMenu?: Menu[]
	ignore?: boolean
	permission?: string[]
}

export interface SideMenuState {
	menu: Array<Menu | 'divider'>
}

const initialState: SideMenuState = {
	menu: [
		{
			icon: 'Home',
			title: 'Dashboard',
			pathname: 'admin.dashboard.index',
		},
		{
			icon: 'Building2',
			title: 'Oteller',
			pathname: 'admin.hotels.index',
			permission: ['admin.hotels.index'],
			subMenu: [
				{
					icon: 'GitPullRequestCreateArrow',
					title: 'Otel Ekle',
					pathname: 'admin.hotels.create',
					permission: ['admin.hotels.create'],
				},
			],
		},
	],
}

export const adminSideMenuSlice = createSlice({
	name: 'sideMenu',
	initialState,
	reducers: {},
})

export const adminSelectSideMenu = (state: RootState) => state.adminSideMenu.menu

export default adminSideMenuSlice.reducer
