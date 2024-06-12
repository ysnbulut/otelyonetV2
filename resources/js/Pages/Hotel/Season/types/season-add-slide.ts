import FullCalendar from '@fullcalendar/react'
import {EventApi} from '@fullcalendar/common'

export interface SeasonAddSlideComponentProps {
	calendarRef: React.RefObject<FullCalendar>
	seasonsCheckForChannels: (season: EventApi, action: string) => {channels: boolean; web: boolean; reception: boolean}
	slideOver: boolean
	setSlideOver: React.Dispatch<React.SetStateAction<boolean>> | ((value: boolean) => void)
	calendarValue: string | undefined
	setCalendarValue: React.Dispatch<React.SetStateAction<string | undefined>>
}
