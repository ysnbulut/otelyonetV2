import React from 'react'
import Lucide from '@/Components/Lucide'
import clsx from 'clsx'
import {twMerge} from 'tailwind-merge'

interface Props {
	bookedRooms: number
	bookedRoomsPercent: string
	availableRooms: number
	availableRoomsPercent: string
	dirtyRooms: number
	dirtyRoomsPercent: string
	outOfOrderRooms: number
	outOfOrderRoomsPercent: string
}
function GeneralReports(props: Props) {
	return (
		<div className="col-span-12 mt-8">
			<div className="intro-y flex h-10 items-center">
				<h2 className="mr-5 truncate text-lg font-medium">Oda Raporu (Günlük)</h2>
				{/*<a*/}
				{/*	href=""*/}
				{/*	className="ml-auto flex items-center text-primary">*/}
				{/*	<Lucide*/}
				{/*		icon="RefreshCcw"*/}
				{/*		className="mr-3 h-4 w-4"*/}
				{/*	/>*/}
				{/*	Reload Data*/}
				{/*</a>*/}
			</div>
			<div className="mt-5 grid grid-cols-12 gap-6">
				<div className="intro-y col-span-12 sm:col-span-6 xl:col-span-3">
					<div
						className={twMerge([
							'zoom-in relative',
							"before:absolute before:inset-x-0 before:mx-auto before:mt-3 before:h-full before:w-[90%] before:rounded-md before:bg-slate-50 before:shadow-[0px_3px_20px_#0000000b] before:content-[''] before:dark:bg-darkmode-400/70",
						])}>
						<div className="box p-5">
							<div className="flex">
								<Lucide
									icon="DoorClosed"
									className="h-[28px] w-[28px] text-success"
								/>
								<div className="ml-auto flex cursor-pointer items-center rounded-full bg-success px-3 py-[3px] text-xs font-medium text-white">
									{props.bookedRoomsPercent}
								</div>
							</div>
							<div className="mt-6 text-3xl font-medium leading-8">{props.bookedRooms}</div>
							<div className="mt-1 text-base text-slate-500">Dolu Oda</div>
						</div>
					</div>
				</div>
				<div className="intro-y col-span-12 sm:col-span-6 xl:col-span-3">
					<div
						className={clsx([
							'zoom-in relative',
							"before:absolute before:inset-x-0 before:mx-auto before:mt-3 before:h-full before:w-[90%] before:rounded-md before:bg-slate-50 before:shadow-[0px_3px_20px_#0000000b] before:content-[''] before:dark:bg-darkmode-400/70",
						])}>
						<div className="box p-5">
							<div className="flex">
								<Lucide
									icon="DoorOpen"
									className="h-[28px] w-[28px] text-slate-400"
								/>
								<div className="ml-auto flex cursor-pointer items-center rounded-full bg-slate-400 px-3 py-[3px] text-xs font-medium text-white">
									{props.availableRoomsPercent}
								</div>
							</div>
							<div className="mt-6 text-3xl font-medium leading-8">{props.availableRooms}</div>
							<div className="mt-1 text-base text-slate-600">Boş Oda</div>
						</div>
					</div>
				</div>
				<div className="intro-y col-span-12 sm:col-span-6 xl:col-span-3">
					<div
						className={clsx([
							'zoom-in relative',
							"before:absolute before:inset-x-0 before:mx-auto before:mt-3 before:h-full before:w-[90%] before:rounded-md before:bg-slate-50 before:shadow-[0px_3px_20px_#0000000b] before:content-[''] before:dark:bg-darkmode-400/70",
						])}>
						<div className="box p-5">
							<div className="flex">
								<Lucide
									icon="PartyPopper"
									className="h-[28px] w-[28px] text-pending"
								/>
								<div className="ml-auto flex cursor-pointer items-center rounded-full bg-pending px-3 py-[3px] text-xs font-medium text-white">
									{props.dirtyRoomsPercent}
								</div>
							</div>
							<div className="mt-6 text-3xl font-medium leading-8">{props.dirtyRooms}</div>
							<div className="mt-1 text-base text-slate-500">Kirli Oda</div>
						</div>
					</div>
				</div>
				<div className="intro-y col-span-12 sm:col-span-6 xl:col-span-3">
					<div
						className={clsx([
							'zoom-in relative',
							"before:absolute before:inset-x-0 before:mx-auto before:mt-3 before:h-full before:w-[90%] before:rounded-md before:bg-slate-50 before:shadow-[0px_3px_20px_#0000000b] before:content-[''] before:dark:bg-darkmode-400/70",
						])}>
						<div className="box p-5">
							<div className="flex">
								<Lucide
									icon="Construction"
									className="h-[28px] w-[28px] text-danger"
								/>
								<div className="ml-auto flex cursor-pointer items-center rounded-full bg-danger px-3 py-[3px] text-xs font-medium text-white">
									{props.outOfOrderRoomsPercent}
								</div>
							</div>
							<div className="mt-6 text-3xl font-medium leading-8">{props.outOfOrderRooms}</div>
							<div className="mt-1 text-base text-slate-500">Satışa Kapalı Oda</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default GeneralReports
