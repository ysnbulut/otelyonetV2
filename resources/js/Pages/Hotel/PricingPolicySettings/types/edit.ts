import {PageProps as BasePageProps} from '@/types'
export interface SettingsProps {
	label: string
	description: string
	name: string
	type: 'text' | 'number' | 'select' | 'checkbox'
	options: {label: string; value: string}[] | []
	value: string | number | boolean
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = BasePageProps<T> & {
	settings: SettingsProps[]
}
