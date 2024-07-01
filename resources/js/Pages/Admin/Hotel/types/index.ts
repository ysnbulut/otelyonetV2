import {PageProps as BasePageProps, User} from '@/types'

interface HotelDataProps {
	id: number
	tenant_id: string
	status: string
	name: string
	register_date: string
	renew_date: string
	price: number
	renew_price: number
	title: string
	address: string
	province_id: number
	district_id: number
	location: null
	tax_office_id: number
	tax_number: string
	phone: string
	email: string
	province: string
	district: string
	tax_office: string
	panel_url: string
	webhook_url: string
}

export interface Links {
	url: null | string
	label: string
	active: boolean
}

export interface Hotels {
	current_page: number
	data: HotelDataProps[] | []
	first_page_url: string
	from: number
	last_page: number
	last_page_url: string
	links: Links[]
	next_page_url: string | null
	path: string | null
	per_page: number
	prev_page_url: string | null
	to: number
	total: number
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = BasePageProps<T> & {
	hotels: Hotels
	filters: {
		search: string
		trashed: boolean
	}
}
