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
			pathname: 'hotel.dashboard.index',
		},
		{
			icon: 'CalendarSearch',
			title: 'Rezervasyon',
			permission: ['asdadasd'], //burayı düzelttttttt
			subMenu: [
				{
					icon: 'CalendarPlus',
					title: 'Rezervasyon Oluştur',
					pathname: 'hotel.booking_create',
					permission: ['hotel.booking_create'],
				},
				{
					icon: 'CalendarCheck2',
					title: 'Rezervasyon Listesi',
					pathname: 'hotel.bookings.index',
					permission: ['hotel.bookings.index'],
				},
				{
					icon: 'CalendarRange',
					title: 'Rezervasyon Takvimi',
					pathname: 'hotel.booking_calendar',
					permission: ['hotel.bookings.index'],
				},
			],
		},
		// {
		// 	icon: 'Store',
		// 	title: 'POS',
		// 	pathname: 'hotel.pos.index',
		// 	permission: ['hotel.customers.index'],
		// 	subMenu: [
		// 		{
		// 			icon: 'ScanBarcode',
		// 			title: 'Ürünler',
		// 			pathname: 'hotel.products.index',
		// 			permission: ['hotel.booking_create.*'],
		// 		},
		// 		{
		// 			icon: 'Group',
		// 			title: 'Ürün Kategorileri',
		// 			pathname: 'hotel.pos.index',
		// 			permission: ['hotel.bookings.index'],
		// 		},
		// 		{
		// 			icon: 'ShowerHead',
		// 			title: 'Hizmetler',
		// 			pathname: 'hotel.pos.index',
		// 			permission: ['hotel.bookings.index'],
		// 		},
		// 		{
		// 			icon: 'Boxes',
		// 			title: 'Hizmet Kategorileri',
		// 			pathname: 'hotel.pos.index',
		// 			permission: ['hotel.bookings.index'],
		// 		},
		// 		{
		// 			icon: 'Combine',
		// 			title: 'Satış Üniteleri',
		// 			pathname: 'hotel.pos.index',
		// 			permission: ['hotel.bookings.index'],
		// 		},
		// 		{
		// 			icon: 'Split',
		// 			title: 'Satış Kanalları',
		// 			pathname: 'hotel.pos.index',
		// 			permission: ['hotel.bookings.index'],
		// 		},
		// 	],
		// },
		{
			icon: 'Users2',
			title: 'Müşteriler',
			pathname: 'hotel.customers.index',
			permission: ['hotel.customers.index'],
		},
		{
			icon: 'PersonStanding',
			title: 'Misafirler',
			pathname: 'hotel.guests.index',
			permission: ['hotel.guests.index'],
		},
		{
			icon: 'Wallet2',
			title: 'Kasa ve Bankalar',
			pathname: 'hotel.case_and_banks.index',
			permission: ['hotel.case_and_banks.index'],
		},
		{
			icon: 'DoorOpen',
			title: 'Üniteler',
			permission: ['hotel.rooms.index'],
			subMenu: [
				{
					icon: 'DoorClosed',
					title: 'Odalar',
					pathname: 'hotel.rooms.index',
					permission: ['hotel.rooms.index'],
				},
				{
					icon: 'Castle',
					title: 'Oda Türleri',
					pathname: 'hotel.room_types.index',
					permission: ['hotel.room_types.index'],
				},
				{
					icon: 'MountainSnow',
					title: 'Oda Manzaraları',
					pathname: 'hotel.room_views.index',
					permission: ['hotel.room_views.index'],
				},
				{
					icon: 'BedDouble',
					title: 'Yatak Tipleri',
					pathname: 'hotel.bed_types.index',
					permission: ['hotel.bed_types.index'],
				},
				{
					icon: 'Lamp',
					title: 'Oda Olanakları',
					pathname: 'hotel.room_type_features.index',
					permission: ['hotel.room_type_features.index'],
				},
			],
		},
		{
			icon: 'CandlestickChart',
			title: 'Fiyatlar',
			permission: ['hotel.seasons.index', 'hotel.unit_prices.index'],
			subMenu: [
				{
					icon: 'Ungroup',
					title: 'Ünite Fiyatları',
					pathname: 'hotel.unit_prices.index',
					permission: ['hotel.unit_prices.index'],
				},
				{
					icon: 'CalendarRange',
					title: 'Sezon Yönetimi',
					pathname: 'hotel.seasons.create',
					permission: ['hotel.seasons.index'],
				},
			],
		},
		// {
		// 	icon: 'AlignVerticalJustifyEnd',
		// 	title: 'Kat Yönetimi',
		// 	pathname: 'hotel.floors.index',
		// 	permission: ['hotel.floors.index'],
		// },
		{
			icon: 'UserCog2',
			title: 'Kullanıcılar',
			permission: ['hotel.users.index', 'hotel.roles.index'],
			subMenu: [
				{
					icon: 'Users2',
					title: 'Kullanıcılar',
					pathname: 'hotel.users.index',
					permission: ['hotel.users.index'],
				},
				{
					icon: 'UserSquare2',
					title: 'Roller',
					pathname: 'hotel.roles.index',
					permission: ['hotel.roles.index'],
				},
			],
		},
		{
			icon: 'SlidersHorizontal',
			title: 'Ayarlar',
			pathname: 'hotel.pricing_policy_settings.index',
			permission: ['hotel.pricing_policy_settings.index'],
		},
		{
			icon: 'ReplaceAll',
			title: 'Kanal Yönetimi',
			pathname: 'hotel.channel_managers.index',
			permission: ['hotel.pricing_policy_settings.index'],
			subMenu: [
				{
					icon: 'GitGraph',
					title: 'HotelRunner API',
					pathname: 'hotel.channel_managers.hotelrunner',
					permission: ['hotel.users.index'],
				},
			],
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
