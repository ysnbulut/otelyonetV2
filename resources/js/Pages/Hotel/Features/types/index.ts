import {PageProps as BasePageProps} from '@/types'

export interface FeatureProps {
	id: number
	name: string
	is_paid: boolean
	chosen: boolean
	selected: boolean
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = BasePageProps<T> & {
	features: FeatureProps[]
	deletedFeatures: FeatureProps[]
}
