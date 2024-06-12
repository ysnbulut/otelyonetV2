import {roomTypesAndViews, ActivatedChannelProps} from './index'

export interface SeasonListProps {
	pricingPolicy: string
	pricingCurrency: string
	taxRate: number
	activatedChannels: ActivatedChannelProps[]
	roomTypeAndView: roomTypesAndViews
	setWarningBadge: (updateFunction: (prevWarnings: {[key: number]: boolean}) => {[key: number]: boolean}) => void
}
