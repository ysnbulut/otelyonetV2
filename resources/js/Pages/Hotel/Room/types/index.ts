import {PageProps as BasePageProps} from '@/types'

interface Links {
	url: null | string
	label: string
	active: boolean
}
export interface RoomDataProps {
	id: number
	name: string
	type: string
	view: string
	is_clean: boolean
	status: string
}

interface Rooms {
	current_page: number
	data: RoomDataProps[] | []
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

interface TypeHasViews {
	id: number
	name: string
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = BasePageProps<T> & {
	rooms: Rooms
	typeHasViews: TypeHasViews[]
	filters: {
		search: string
		trashed: boolean
	}
	can: {
		create: boolean
		update: boolean
		edit: boolean
		delete: boolean
		restore: boolean
		forceDelete: boolean
	}
}
