import {PageProps as BasePageProps} from '@/types'
import {Products} from '@/Pages/Hotel/Product/types/index'

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = BasePageProps<T> & {}
