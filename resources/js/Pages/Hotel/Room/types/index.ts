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

interface TypeHasViews {
	id: number
	name: string
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = BasePageProps<T> & {
	rooms: RoomDataProps[] | []
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
