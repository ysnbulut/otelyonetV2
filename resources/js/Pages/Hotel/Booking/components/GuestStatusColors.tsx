import React from 'react'
import Tippy from '@/Components/Tippy'

function GuestStatusColors() {
	return (
		<div className="flex w-full items-center justify-between border-t bg-white px-3 py-2 dark:bg-darkmode-600">
			<h3 className="text-xs font-semibold">Misafir Durum Renkleri</h3>
			<div className="flex gap-2">
				<Tippy
					content="Bekleniyor"
					className="h-6 w-6 rounded-full bg-pending"
				/>
				<Tippy
					content="Check İn"
					className="h-6 w-6 rounded-full bg-success"
				/>
				<Tippy
					content="Check Out"
					className="h-6 w-6 rounded-full bg-slate-700"
				/>
			</div>
		</div>
	)
}

export default GuestStatusColors
