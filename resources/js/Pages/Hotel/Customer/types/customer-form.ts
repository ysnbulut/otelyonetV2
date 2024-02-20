interface DataProps {
	title: string
	type: string
	tax_number: string
	email: string
	phone: string
	country: string
	city: string
	address: string
}

interface ErrorsProps {
	title?: string
	type?: string
	tax_number?: string
	email?: string
	phone?: string
	country?: string
	city?: string
	address?: string
}

type setDataByObject<TForm> = (data: TForm) => void
type setDataByMethod<TForm> = (data: (previousData: TForm) => TForm) => void
type setDataByKeyValuePair<TForm> = <K extends keyof TForm>(key: K, value: TForm[K]) => void
export interface CustomerFormProps {
	customer?: DataProps & {id: string}
	type: string
	data: DataProps
}
