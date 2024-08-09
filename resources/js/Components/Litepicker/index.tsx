import React, {forwardRef, useEffect, useRef, useImperativeHandle} from 'react'
import {setValue, init, reInit} from './litepicker'
import LitepickerJs from 'litepicker'
import {FormInput} from '@/Components/Form'
import {ILPConfiguration} from 'litepicker/dist/types/interfaces'
import 'litepicker/dist/plugins/mobilefriendly'

export interface LitepickerElement {
	litePickerInstance?: LitepickerJs // Make litePickerInstance optional
	show: () => void
}

type LitepickerConfig = Partial<ILPConfiguration>

interface MainProps {
	options: {
		format?: string | undefined
	} & LitepickerConfig
	value: string
	onChange: (date: string) => void
	getRef?: (el: LitepickerElement) => void // Optional if using forwardRef
}

export type LitepickerProps = MainProps & Omit<React.ComponentPropsWithoutRef<'input'>, keyof MainProps>

const Litepicker = forwardRef<LitepickerElement, LitepickerProps>((props, ref) => {
	const initialRender = useRef(true)
	const litepickerRef = useRef<LitepickerElement>(null)
	const tempValue = useRef(props.value)

	useEffect(() => {
		if (litepickerRef.current) {
			props.getRef?.(litepickerRef.current)
		}

		if (initialRender.current) {
			setValue(props)
			if (litepickerRef.current !== null) {
				init(litepickerRef.current, props)
			}
			initialRender.current = false
		} else {
			if (tempValue.current !== props.value && litepickerRef.current !== null) {
				reInit(litepickerRef.current, props)
			}
		}

		tempValue.current = props.value
	}, [props.value])

	useImperativeHandle(ref, () => ({
		show: () => {
			if (litepickerRef.current?.litePickerInstance) {
				litepickerRef.current.litePickerInstance.show()
			}
		},
		get litePickerInstance() {
			return litepickerRef.current?.litePickerInstance
		},
	}))

	const {options, value, getRef, onChange, ...computedProps} = props
	return (
		<FormInput
			ref={litepickerRef as any} // Cast to `any` to bypass the type mismatch error temporarily
			type="text"
			value={props.value}
			onChange={(e) => {
				props.onChange(e.target.value)
			}}
			{...computedProps}
		/>
	)
})

Litepicker.defaultProps = {
	options: {
		showWeekNumbers: true,
		lang: 'tr-TR',
		format: 'DD.MM.YYYY',
		autoApply: false,
		dropdowns: {
			minYear: 1850,
			maxYear: null,
			months: true,
			years: true,
		},
	},
	value: '',
	onChange: () => {},
}

export default Litepicker
