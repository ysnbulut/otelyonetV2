import {ActivatedChannelProps, SeasonDataProps} from './index'

export interface SeasonListItemProps {
	//: (updateFunction: (prevWarnings: {[key: number]: boolean}) => {[key: number]: boolean}) => void böyle birşey key sezon id olduğunda bir dizi true false içeren
	setWarning: React.Dispatch<React.SetStateAction<boolean>>
	setableSubmitClick: boolean
	pricingPolicy: string
	pricingCurrency: string
	taxRate: number
	roomTypeAndViewId: number
	season: SeasonDataProps
	bookingChannel: ActivatedChannelProps | undefined | null
}
