import {PageProps as BasePageProps} from './index'

export interface FeatureDataProps {
	id: number
	name: string
	order_no: number
}

export interface FormDataProps {
	name: string
	size: number
	room_count: number
	adult_capacity: number
	child_capacity: number
	description: string
	room_type_features: [] | SelectedFeatures[]
}

export interface SelectedFeatures {
	feature_id: number
	order_no: number
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = BasePageProps<T> & {
	features: FeatureDataProps[] | []
}
