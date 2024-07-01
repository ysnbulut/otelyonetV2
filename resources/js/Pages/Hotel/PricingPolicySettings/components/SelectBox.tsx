import React, {useEffect, useRef, useState} from 'react'
import Select, {SelectInstance} from 'react-select'
import _ from 'lodash'

type setDataByObject<TForm> = (data: TForm) => void
type setDataByMethod<TForm> = (data: (previousData: TForm) => TForm) => void
type setDataByKeyValuePair<TForm> = <K extends keyof TForm>(key: K, value: TForm[K]) => void

type OptionValues = {
	value: string
	label: string
}

interface SelectBoxProps {
	dynamicOptions?: OptionValues[] | unknown | []
	setting: {
		name: string
		label: string
		options: {
			type: string
			values: OptionValues[] | [] | string
		}
	}
	data: _.Dictionary<string | number | boolean>
	setData: setDataByObject<_.Dictionary<string | number | boolean>> & setDataByMethod<_.Dictionary<string | number | boolean>> & setDataByKeyValuePair<_.Dictionary<string | number | boolean>>
}

function SelectBox(props: SelectBoxProps) {
	const ref = useRef<SelectInstance>(null)
	const [options, setOptions] = useState<OptionValues[]>([])

	useEffect(() => {
		if (props.setting.options.type === 'static') {
			setOptions(props.setting.options.values as OptionValues[])
		}
		if (props.setting.options.type === 'dynamic') {
			setOptions(props.dynamicOptions as OptionValues[])
		}
	}, [props.dynamicOptions, props.setting.options.values, props.setting.options.type])

	return (
		<Select
			ref={ref}
			id={props.setting.name}
			value={options.find((option) => option.value === props.data[props.setting.name])}
			onChange={(e: any, action: any) => {
				if (action.action === 'select-option') {
					console.log(e)
					e && props.setData((data) => ({...data, [props.setting.name]: e.value}))
				} else if (action.action === 'clear') {
					props.setData((data) => ({...data, [props.setting.name]: ''}))
				} else {
					props.setData((data) => ({...data, [props.setting.name]: ''}))
				}
			}}
			options={options}
			className="remove-all my-select-container"
			classNamePrefix="my-select"
			styles={{
				input: (base) => ({
					...base,
					'input:focus': {
						boxShadow: 'none',
					},
				}),
			}}
			isClearable
			placeholder={`${props.setting.label} Seçiniz`}
		/>
	)
}

export default SelectBox
