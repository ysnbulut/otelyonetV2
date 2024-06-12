import {PropsWithChildren, useState} from 'react'
import DarkModeSwitcher from '@/Components/DarkModeSwitcher'
import MainColorSwitcher from '@/Components/MainColorSwitcher'
import clsx from 'clsx'
import OneSignal from 'react-onesignal'

export default function Guest({children}: PropsWithChildren) {
	return (
		<div
			className={clsx([
				'relative -m-3 h-screen bg-primary p-3 sm:-mx-8 sm:px-8 lg:overflow-hidden xl:bg-white dark:bg-darkmode-800 xl:dark:bg-darkmode-600',
				"before:absolute before:inset-y-0 before:left-0 before:-mb-[16%] before:-ml-[13%] before:-mt-[28%] before:hidden before:w-[57%] before:rotate-[-4.5deg] before:transform before:rounded-[100%] before:bg-primary/20 before:content-[''] before:xl:block before:dark:bg-darkmode-400",
				"after:absolute after:inset-y-0 after:left-0 after:-mb-[13%] after:-ml-[13%] after:-mt-[20%] after:hidden after:w-[57%] after:rotate-[-4.5deg] after:transform after:rounded-[100%] after:bg-primary after:content-[''] after:xl:block after:dark:bg-darkmode-700",
			])}>
			<DarkModeSwitcher />
			<MainColorSwitcher />
			<div className="container relative z-10 sm:px-10">{children}</div>
		</div>
	)
}
