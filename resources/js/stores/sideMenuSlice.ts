import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { icons } from "@/Components/Lucide";

export interface Menu {
  icon: keyof typeof icons;
  title: string;
  pathname?: string;
  subMenu?: Menu[];
  ignore?: boolean;
	permission?: string[];
}

export interface SideMenuState {
  menu: Array<Menu | "divider">;
}

const initialState: SideMenuState = {
  menu: [
		{
			icon: 'Home',
			title: 'Dashboard',
			pathname: route('hotel.dashboard.index'),},
		{
			icon: 'CalendarSearch',
			title: 'Rezervasyon Yön.',
			permission: ['bookings.create.*'],
			subMenu: [
				{
					icon: 'CalendarPlus',
					title: 'Rezervasyon Oluştur',
					pathname: route('hotel.bookings.create'),
					permission: ['bookings.create.*'],
				},
				{
					icon: 'CalendarCheck2',
					title: 'Rezervasyon Listesi',
					pathname: route('hotel.bookings.index'),
					permission: ['bookings.index'],
				},
				{
					icon: 'CalendarRange',
					title: 'Rezervasyon Takvimi',
					pathname: route('hotel.bookings.calendar'),
					permission: ['bookings.index'],
				},
			]
		},
		{
			icon: 'Users2',
			title: 'Müşteriler',
			pathname: route('hotel.customers.index'),
			permission: ['customers.index'],
		},
		{
			icon: 'PersonStanding',
			title: 'Misafir Yönetimi',
			pathname: route('hotel.guests.index'),
			permission: ['guests.index'],
		},
		{
			icon: 'Wallet2',
			title: 'Kasa ve Bankalar',
			pathname: route('hotel.case_and_banks.index'),
			permission: ['case_and_banks.index'],
		},
		{
			icon: 'DoorOpen',
			title: 'Oda Yönetimi',
			permission: ['rooms.index'],
			subMenu: [
				{
					icon: 'DoorClosed',
					title: 'Odalar',
					pathname: route('hotel.rooms.index'),
					permission: ['rooms.index'],
				},
				{
					icon: 'Castle',
					title: 'Oda Türleri',
					pathname: route('hotel.room_types.index'),
					permission: ['room_types.index'],
				},
				{
					icon: 'MountainSnow',
					title: 'Oda Manzaraları',
					pathname: route('hotel.room_views.index'),
					permission: ['room_views.index'],
				},
				{
					icon: 'BedDouble',
					title: 'Yatak Tipleri',
					pathname: route('hotel.bed_types.index'),
					permission: ['bed_types.index'],
				},
				{
					icon: 'Lamp',
					title: 'Oda Olanakları',
					pathname: route('hotel.room_type_features.index'),
					permission: ['room_type_features.index'],
				}
			]
		},
		{
			icon: 'SlidersHorizontal',
			title: 'Otel Ayarları',
			pathname: route('hotel.settings.index'),
			permission: ['settings.index'],
		},
		{
			icon: 'CandlestickChart',
			title: 'Fiyatlandırma',
			permission: ['seasons.index'],
			subMenu: [
				{
					icon: 'CalendarRange',
					title: 'Sezon Yönetimi',
					pathname: route('hotel.seasons.create'),
					permission: ['seasons.index'],
				},
				{
					icon: 'Ungroup',
					title: 'Ünite Fiyatları',
					pathname: route('hotel.unit_prices.index'),
					permission: ['seasons.index'],
				},

			]
		},
		{
			icon: 'AlignVerticalJustifyEnd',
			title: 'Kat Yönetimi',
			pathname: route('hotel.floors.index'),
			permission: ['floors.index'],
		},
		{
			icon: 'UserCog2',
			title: 'Kullanıcı Yönetimi',
			permission: ['users.index', 'roles.index'],
			subMenu: [
				{
					icon: 'Users2',
					title: 'Kullanıcılar',
					pathname: route('hotel.users.index'),
					permission: ['users.index'],
				},
				{
					icon: 'UserSquare2',
					title: 'Roller',
					pathname: route('hotel.roles.index'),
					permission: ['roles.index'],
				},
			]
		}
	]
};

export const sideMenuSlice = createSlice({
  name: "sideMenu",
  initialState,
  reducers: {},
});

export const selectSideMenu = (state: RootState) => state.sideMenu.menu;

export default sideMenuSlice.reducer;
