import * as lucideIcons from 'lucide-react'
import clsx from 'clsx'
import React from 'react'

export const {...icons} = lucideIcons

type Icon = keyof typeof icons

interface LucideProps extends React.ComponentPropsWithoutRef<'svg'> {
	icon: Icon
	title?: string
}

function Lucide(props: LucideProps) {
	const {icon, className, ...computedProps} = props
	// @ts-ignore
	return React.createElement(lucideIcons[props.icon], {
		...computedProps,
		className: clsx(['stroke-1.5', props.className]),
	})
}
export default Lucide
