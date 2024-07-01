import React from 'react'
import {twMerge} from 'tailwind-merge'
import {WarningBadgeProps} from '../types/warning-badge'

function WarningBadge(props: WarningBadgeProps) {
	return (
		<div className="flex w-full items-center justify-end">
			<span
				className={twMerge('mr-1 rounded px-2 py-1 text-xs text-white', props.warning ? 'bg-danger' : 'bg-success')}>
				{props.warning ? 'Eksik Fiyat!' : 'Ok!'}
			</span>
		</div>
	)
}

export default WarningBadge
