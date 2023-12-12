import {SeasonDataProps, SeasonCalendarProps} from './index'
export interface SeasonAddSlideComponentProps {
	setDatas: React.Dispatch<React.SetStateAction<SeasonCalendarProps>>
	slideOver: boolean
	setSlideOver: React.Dispatch<React.SetStateAction<boolean>>
	calendarValue: string
	setCalendarValue: React.Dispatch<React.SetStateAction<string>>
	seasons: SeasonDataProps[]
	seasonsDays: string[]
	setSeasonsDays: React.Dispatch<React.SetStateAction<string[]>>
}
