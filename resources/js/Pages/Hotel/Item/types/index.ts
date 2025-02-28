import {PageProps as BasePageProps} from '@/types'

interface IdNameProps {
	id: number
	name: string
}

interface UnitProps {
	id: number
	name: string
	channels: IdNameProps[] | []
}

export interface ItemDataProps {
	id: number
	name: string
	image: string
	category: string
	sku: string
	price: string
	description: string
	units: UnitProps[] | []
}

export interface Links {
	url: null | string
	label: string
	active: boolean
}

export interface Items {
	current_page: number
	data: ItemDataProps[] | []
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
	currency: string
	items: Items
	categories: IdNameProps[] | []
	sales_units: IdNameProps[] | []
	sales_channels: IdNameProps[] | []
	filters: {
		search: string
		trashed: boolean
		with_trashed: boolean
		categories: string[]
		sales_units: string[]
		sales_channels: string[]
	}
}
