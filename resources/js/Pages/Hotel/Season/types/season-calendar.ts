import {SeasonDataProps} from './index'
import {EventApi} from '@fullcalendar/common'

export interface SeasonCalendarComponentProps {
	seasonsCheckForChannels: (season: EventApi, action: string) => {channels: boolean; web: boolean; reception: boolean}
	setSlideOver: React.Dispatch<React.SetStateAction<boolean>>
	setCalendarValue: React.Dispatch<React.SetStateAction<string | undefined>>
	seasons: SeasonDataProps[]
}
