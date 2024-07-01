export interface FeatureNameComponentProps {
	edit: boolean
	featureName: string
	setFeatureName: React.Dispatch<React.SetStateAction<string>>
	isPaid: boolean
	setIsPaid: React.Dispatch<React.SetStateAction<boolean>>
	deleted: boolean
}
