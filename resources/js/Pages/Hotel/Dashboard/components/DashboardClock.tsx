import React, {useEffect, useState} from 'react'
import Clock from 'react-clock'

function DashboardClock(props: any) {
	const [clock, setClock] = useState(new Date())

	useEffect(() => {
		const interval = setInterval(() => setClock(new Date()), 1000)

		return () => {
			clearInterval(interval)
		}
	}, [])

	return (
		<div className="box flex items-center justify-between gap-4 p-6">
			<Clock
				className="rounded-full bg-slate-100 dark:bg-darkmode-700"
				value={clock}
				size={100}
				minuteMarksWidth={1}
				hourHandWidth={5}
				hourMarksLength={14}
				hourMarksWidth={4}
			/>
			<span className="min-w-[90px] rounded-md bg-slate-100 px-2 py-1 text-center text-lg font-semibold dark:bg-darkmode-700">
				{clock.toLocaleTimeString()}
			</span>
		</div>
	)
}

export default DashboardClock
