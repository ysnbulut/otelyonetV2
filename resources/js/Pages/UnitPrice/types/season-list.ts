import {roomTypesAndViews} from './index'
import {boolean} from 'yup'

export interface SeasonListProps {
	pricingPolicy: string
	pricingCurrency: string
	roomTypeAndView: roomTypesAndViews
	setWarningBadge: (updateFunction: (prevWarnings: {[key: number]: boolean}) => {[key: number]: boolean}) => void
}
