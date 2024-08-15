import React, {useEffect, useRef, useState} from 'react'
import Lucide from '@/Components/Lucide'
import {twMerge} from 'tailwind-merge'
import {motion} from 'framer-motion'
import {Link} from '@inertiajs/react'

type IdName = {
	id: number
	name: string
}

type GeneralReportCardProps = {
	icon: string
	color: string
	percent: string
	count: number
	title: string
	content: IdName[]
}

function GeneralReportCard(props: GeneralReportCardProps) {
	const ref = useRef<HTMLDivElement>(null)
	const [contentShow, setContentShow] = useState(false)

	return (
		<div className="intro-y col-span-12 sm:col-span-6 xl:col-span-3">
			<div
				className="zoom-in relative"
				ref={ref}
				onMouseEnter={() => setContentShow(true)}
				onMouseLeave={() => setContentShow(false)}>
				<div className="box p-5">
					<div className="flex">
						<Lucide
							icon={props.icon as any}
							className={`h-[28px] w-[28px] text-${props.color}`}
						/>
						<div className={`bg-${props.color} ml-auto flex cursor-pointer items-center rounded-full px-3 py-[3px] text-xs font-medium text-white`}>{props.percent}</div>
					</div>
					<div className="mt-6 text-3xl font-medium leading-8">{props.count}</div>
					<div className="mt-1 text-base text-slate-500">{props.title}</div>
				</div>
				{/*<motion.div*/}
				{/*	initial={{y: -15}}*/}
				{/*	animate={!contentShow ? {y: -15} : props.content.length > 0 ? {y: -5} : {y: -15}}*/}
				{/*	transition={{ease: 'easeOut', duration: 0.5}}*/}
				{/*	className={twMerge(*/}
				{/*		'mx-2.5 min-h-7 rounded-b-md bg-white/75 px-2 py-1 dark:bg-darkmode-600/75',*/}
				{/*		// !contentShow && '-mt-4',*/}
				{/*	)}>*/}
				{/*	{props.content.map((room, index) => (*/}
				{/*		<motion.a*/}
				{/*			href={'#'}*/}
				{/*			initial={{opacity: 0}}*/}
				{/*			animate={contentShow ? {opacity: 100} : {opacity: 0}}*/}
				{/*			transition={{ease: 'easeIn', duration: 0.5}}*/}
				{/*			className="mr-1 text-xs font-semibold text-slate-300 hover:text-sm hover:text-primary dark:text-slate-600"*/}
				{/*			key={index}>*/}
				{/*			{room.name}*/}
				{/*		</motion.a>*/}
				{/*	))}*/}
				{/*</motion.div>*/}
			</div>
		</div>
	)
}

export default GeneralReportCard
