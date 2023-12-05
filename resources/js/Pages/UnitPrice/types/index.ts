import { PageProps as BasePageProps } from '@/types'


export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = BasePageProps<T> & {

}
