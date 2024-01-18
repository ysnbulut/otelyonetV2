import {roomTypesAndViews} from './index'

export interface SeasonListProps {
	pricingPolicy: string
	pricingCurrency: string
	roomTypeAndView: roomTypesAndViews
	setWarningBadge: (updateFunction: (prevWarnings: {[key: number]: boolean}) => {[key: number]: boolean}) => void
}
