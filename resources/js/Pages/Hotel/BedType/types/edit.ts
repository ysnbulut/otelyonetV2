import {BedTypeProps} from './index'
import Swal from 'sweetalert2'
export interface EditItemDataProps {
	bedType: BedTypeProps
	setBedTypes: React.Dispatch<React.SetStateAction<BedTypeProps[]>>
	setEdit: React.Dispatch<React.SetStateAction<boolean>>
}
