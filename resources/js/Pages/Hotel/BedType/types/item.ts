import {BedTypeProps} from './index'
export interface ItemDataProps {
	bedType: BedTypeProps
	setBedTypes: React.Dispatch<React.SetStateAction<BedTypeProps[]>>
}
