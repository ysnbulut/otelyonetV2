import {PageProps as BasePageProps} from './index'

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = BasePageProps<T> & {
	products: []
}
