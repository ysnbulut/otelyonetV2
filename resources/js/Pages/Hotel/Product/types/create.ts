import {PageProps as BasePageProps} from '@/types'
import {Products} from '@/Pages/Hotel/Product/types/index'

interface IdNameProps {
	id: number
	name: string
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = BasePageProps<T> & {
	categories: IdNameProps[]
	sales_units: IdNameProps[]
	sales_channels: IdNameProps[]
}
