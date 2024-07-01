import {BedTypeProps} from './index'
export interface DeleteItemDataProps {
	itemHeight: number
	bedType: BedTypeProps
	setBedTypes: React.Dispatch<React.SetStateAction<BedTypeProps[]>>
	setCanBeDeleted: React.Dispatch<React.SetStateAction<boolean>>
}
