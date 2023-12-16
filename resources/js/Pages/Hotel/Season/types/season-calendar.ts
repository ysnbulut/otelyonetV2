import {SeasonDataProps, SeasonCalendarProps} from './index'
export interface SeasonCalendarComponentProps {
	data: SeasonCalendarProps
	setData: React.Dispatch<React.SetStateAction<SeasonCalendarProps>>
	slideOver: boolean
	setSlideOver: React.Dispatch<React.SetStateAction<boolean>>
	setCalendarValue: React.Dispatch<React.SetStateAction<string>>
	seasons: SeasonDataProps[]
	setSeasons: React.Dispatch<React.SetStateAction<SeasonDataProps[]>>
	setSeasonsDays: React.Dispatch<React.SetStateAction<string[]>>
}
