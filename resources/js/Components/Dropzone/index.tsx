import React, {createRef, useEffect} from 'react'
import {init} from './dropzone'
import DropzoneJs, {DropzoneOptions} from 'dropzone'
import {twMerge} from 'tailwind-merge'

export interface DropzoneElement extends HTMLDivElement {
	dropzone: DropzoneJs
}

export interface DropzoneProps extends React.PropsWithChildren, React.ComponentPropsWithoutRef<'div'> {
	options: DropzoneOptions
	getRef: (el: DropzoneElement) => void
}

function Dropzone(props: DropzoneProps) {
	const fileUploadRef = createRef<DropzoneElement>()

	useEffect(() => {
		if (fileUploadRef.current) {
			props.getRef(fileUploadRef.current)
			init(fileUploadRef.current, props)
		}
	}, [props.options, props.children])

	const {options, getRef, ...computedProps} = props
	const cls = computedProps.className ? computedProps.className : []
	return (
		<div
			{...computedProps}
			ref={fileUploadRef}
			className={twMerge(
				'dropzone [&.dropzone]:border-2 [&.dropzone]:border-dashed [&.dropzone]:border-darkmode-200/60 [&.dropzone]:dark:border-white/5 [&.dropzone]:dark:bg-darkmode-600',
				cls,
			)}>
			<div className="dz-message">{props.children}</div>
		</div>
	)
}

Dropzone.defaultProps = {
	options: {},
	getRef: () => {},
}

export default Dropzone
