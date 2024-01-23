import {SalesUnitDataProps} from '@/Pages/Hotel/SalesUnit/types/index'

export interface ItemProps {
	salesUnit: SalesUnitDataProps
	setSalesUnits: React.Dispatch<React.SetStateAction<SalesUnitDataProps[]>>
}
