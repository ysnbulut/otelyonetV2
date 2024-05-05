import {PageProps as BasePageProps} from '@/types'

type OptionValues = {
	value: string
	label: string
}
export interface SettingsProps {
	label: string
	description: string
	name: string
	type: 'text' | 'number' | 'select' | 'checkbox'
	options: {
		type: string
		values: OptionValues[] | [] | string
	}
	value: string | number | boolean
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = BasePageProps<T> & {
	settings: SettingsProps[]
	taxes: OptionValues[]
}
