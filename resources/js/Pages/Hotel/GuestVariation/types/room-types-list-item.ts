import {VariationDataProps} from './index'

export interface RoomTypesListItemProps {
	setWarnings: (updateFunction: (prevWarnings: {[key: number]: boolean}) => {[key: number]: boolean}) => void
	setableSubmitClick: boolean
	roomTypeId: number
	variationName: string
	variation: VariationDataProps
}
