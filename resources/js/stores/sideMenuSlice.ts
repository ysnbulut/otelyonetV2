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
			pathname: route('hotel.dashboard.index'),
		},
		{
			icon: 'CalendarSearch',
			title: 'Rezervasyon Yön.',
			permission: ['hotel.bookings.create.*'],
			subMenu: [
				{
					icon: 'CalendarPlus',
					title: 'Rezervasyon Oluştur',
					pathname: route('hotel.bookings.create'),
					permission: ['hotel.bookings.create.*'],
				},
				{
					icon: 'CalendarCheck2',
					title: 'Rezervasyon Listesi',
					pathname: route('hotel.bookings.index'),
					permission: ['hotel.bookings.index'],
				},
				{
					icon: 'CalendarRange',
					title: 'Rezervasyon Takvimi',
					pathname: route('hotel.bookings.calendar'),
					permission: ['hotel.bookings.index'],
				},
			],
		},

		{
			icon: 'Store',
			title: 'POS',
			pathname: route('hotel.pos.index'),
			permission: ['hotel.customers.index'],
			subMenu: [
				{
					icon: 'ScanBarcode',
					title: 'Ürünler',
					pathname: route('hotel.pos.index'),
					permission: ['hotel.bookings.create.*'],
				},
				{
					icon: 'Group',
					title: 'Ürün Kategorileri',
					pathname: route('hotel.pos.index'),
					permission: ['hotel.bookings.index'],
				},
				{
					icon: 'ShowerHead',
					title: 'Hizmetler',
					pathname: route('hotel.pos.index'),
					permission: ['hotel.bookings.index'],
				},
				{
					icon: 'Boxes',
					title: 'Hizmet Kategorileri',
					pathname: route('hotel.pos.index'),
					permission: ['hotel.bookings.index'],
				},
				{
					icon: 'Split',
					title: 'Satış Kanalları',
					pathname: route('hotel.pos.index'),
					permission: ['hotel.bookings.index'],
				},
				{
					icon: 'Combine',
					title: 'Satış Üniteleri',
					pathname: route('hotel.pos.index'),
					permission: ['hotel.bookings.index'],
				},
			],
		},
		{
			icon: 'Users2',
			title: 'Müşteriler',
			pathname: route('hotel.customers.index'),
			permission: ['hotel.customers.index'],
		},
		{
			icon: 'PersonStanding',
			title: 'Misafir Yönetimi',
			pathname: route('hotel.guests.index'),
			permission: ['hotel.guests.index'],
		},
		{
			icon: 'Wallet2',
			title: 'Kasa ve Bankalar',
			pathname: route('hotel.case_and_banks.index'),
			permission: ['hotel.case_and_banks.index'],
		},
		{
			icon: 'DoorOpen',
			title: 'Oda Yönetimi',
			permission: ['hotel.rooms.index'],
			subMenu: [
				{
					icon: 'DoorClosed',
					title: 'Odalar',
					pathname: route('hotel.rooms.index'),
					permission: ['hotel.rooms.index'],
				},
				{
					icon: 'Castle',
					title: 'Oda Türleri',
					pathname: route('hotel.room_types.index'),
					permission: ['hotel.room_types.index'],
				},
				{
					icon: 'MountainSnow',
					title: 'Oda Manzaraları',
					pathname: route('hotel.room_views.index'),
					permission: ['hotel.room_views.index'],
				},
				{
					icon: 'BedDouble',
					title: 'Yatak Tipleri',
					pathname: route('hotel.bed_types.index'),
					permission: ['hotel.bed_types.index'],
				},
				{
					icon: 'Lamp',
					title: 'Oda Olanakları',
					pathname: route('hotel.room_type_features.index'),
					permission: ['hotel.room_type_features.index'],
				},
			],
		},
		{
			icon: 'CandlestickChart',
			title: 'Fiyatlandırma',
			permission: ['hotel.seasons.index', 'hotel.unit_prices.index'],
			subMenu: [
				{
					icon: 'Ungroup',
					title: 'Ünite Fiyatları',
					pathname: route('hotel.unit_prices.index'),
					permission: ['hotel.unit_prices.index'],
				},
				{
					icon: 'CalendarRange',
					title: 'Sezon Yönetimi',
					pathname: route('hotel.seasons.create'),
					permission: ['hotel.seasons.index'],
				},
			],
		},
		// {
		// 	icon: 'AlignVerticalJustifyEnd',
		// 	title: 'Kat Yönetimi',
		// 	pathname: route('hotel.floors.index'),
		// 	permission: ['hotel.floors.index'],
		// },
		{
			icon: 'UserCog2',
			title: 'Kullanıcı Yönetimi',
			permission: ['hotel.users.index', 'hotel.roles.index'],
			subMenu: [
				{
					icon: 'Users2',
					title: 'Kullanıcılar',
					pathname: route('hotel.users.index'),
					permission: ['hotel.users.index'],
				},
				{
					icon: 'UserSquare2',
					title: 'Roller',
					pathname: route('hotel.roles.index'),
					permission: ['hotel.roles.index'],
				},
			],
		},
		{
			icon: 'SlidersHorizontal',
			title: 'Otel Ayarları',
			pathname: route('hotel.settings.index'),
			permission: ['hotel.settings.index'],
		},
	],
}

export const sideMenuSlice = createSlice({
	name: 'sideMenu',
	initialState,
	reducers: {},
})

export const selectSideMenu = (state: RootState) => state.sideMenu.menu

export default sideMenuSlice.reducer
