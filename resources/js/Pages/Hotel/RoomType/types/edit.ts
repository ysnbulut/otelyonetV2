import {PageProps as BasePageProps} from '@/types'

export interface RoomTypeBedsDataProps {
	id: number
	name: string
	count: number
}

export interface BedsDataProps {
	id: number
	name: string
}

export interface ViewsDataProps {
	id: number
	name: string
	warning_message?: string
}

interface FeaturesDataProps {
	id: number
	name: string
	order_no: number
}

interface ImagesProps {
	orginal: ImageDataProps
	variants: ImageVariantProps
}

interface ImageVariantProps {
	small: ImageDataProps
	medium: ImageDataProps
	large: ImageDataProps
}

interface ImageDataProps {
	id: number
	url: string
}

export interface SelectedFeatures {
	feature_id: number
	order_no: number
}

interface RoomTypeDataProps {
	id: number
	name: string
	description: string
	size: number
	adult_capacity: number
	child_capacity: number
	room_count: number
	beds: RoomTypeBedsDataProps[]
	views: ViewsDataProps[]
	features: FeaturesDataProps[]
	images: ImagesProps[]
}
export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = BasePageProps<T> & {
	roomType: RoomTypeDataProps
	views: ViewsDataProps[]
	features: FeaturesDataProps[]
	beds: BedsDataProps[]
}
