import {FeatureProps} from './index'
export interface FeatureComponentProps {
	featureIndex: number
	feature: FeatureProps
	setFeatures: React.Dispatch<React.SetStateAction<FeatureProps[]>>
	setDeletedFeatures: React.Dispatch<React.SetStateAction<FeatureProps[]>>
	deleted: boolean
}
