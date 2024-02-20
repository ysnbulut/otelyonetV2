import {SeasonDataProps} from './index'

export interface SeasonListItemProps {
	setWarnings: (updateFunction: (prevWarnings: {[key: number]: boolean}) => {[key: number]: boolean}) => void
	setableSubmitClick: boolean
	pricingPolicy: string
	pricingCurrency: string
	roomTypeAndViewId: number
	season: SeasonDataProps
}
