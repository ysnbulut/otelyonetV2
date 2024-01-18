export interface FeatureDataProps {
	id: number
	name: string
	order_no: number
}

export interface SelectedFeatures {
	feature_id: number
	order_no: number
}

export interface FeaturesProps {
	features: FeatureDataProps[] | []
	setFeatures: React.Dispatch<React.SetStateAction<FeatureDataProps[]>>
	selectedFeatures: SelectedFeatures[] | []
	setSelectedFeatures: React.Dispatch<React.SetStateAction<SelectedFeatures[]>>
}
