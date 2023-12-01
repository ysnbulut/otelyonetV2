import React from 'react'
import Lucide from '@/Components/Lucide'
import clsx from 'clsx'

interface Props {
    bookedRooms: number,
    bookedRoomsPercent: string,
    availableRooms: number,
    availableRoomsPercent: string,
    dirtyRooms: number,
    dirtyRoomsPercent: string,
    outOfOrderRooms: number,
    outOfOrderRoomsPercent: string,
}
function GeneralReports(props: Props) {
    return (
        <div className='col-span-12 mt-8'>
            <div className='flex items-center h-10 intro-y'>
                <h2 className='mr-5 text-lg font-medium truncate'>
                    Oda Raporu (Günlük)
                </h2>
                <a href='' className='flex items-center ml-auto text-primary'>
                    <Lucide icon='RefreshCcw' className='w-4 h-4 mr-3' /> Reload
                    Data
                </a>
            </div>
            <div className='grid grid-cols-12 gap-6 mt-5'>
                <div className='col-span-12 sm:col-span-6 xl:col-span-3 intro-y'>
                    <div
                        className={clsx(['relative zoom-in', 'before:content-[\'\'] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70'])}
                    >
                        <div className='p-5 box'>
                            <div className='flex'>
                                <Lucide
                                    icon='DoorClosed'
                                    className='w-[28px] h-[28px] text-success'
                                />
                                <div
                                    className='ml-auto cursor-pointer bg-success py-[3px] flex rounded-full text-white text-xs px-3 items-center font-medium'>
                                    {props.bookedRoomsPercent}
                                </div>
                            </div>
                            <div className='mt-6 text-3xl font-medium leading-8'>
                                {props.bookedRooms}
                            </div>
                            <div className='mt-1 text-base text-slate-500'>
                                Dolu Oda
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-span-12 sm:col-span-6 xl:col-span-3 intro-y'>
                    <div
                        className={clsx(['relative zoom-in', 'before:content-[\'\'] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70'])}
                    >
                        <div className='p-5 box'>
                            <div className='flex'>
                                <Lucide
                                    icon='DoorOpen'
                                    className='w-[28px] h-[28px] text-pending'
                                />
                                <div
                                    className='ml-auto cursor-pointer bg-pending py-[3px] flex rounded-full text-white text-xs px-3 items-center font-medium'>
                                    {props.availableRoomsPercent}
                                </div>
                            </div>
                            <div className='mt-6 text-3xl font-medium leading-8'>
                                {props.availableRooms}
                            </div>
                            <div className='mt-1 text-base text-slate-500'>
                                Boş Oda
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-span-12 sm:col-span-6 xl:col-span-3 intro-y'>
                    <div
                        className={clsx(['relative zoom-in', 'before:content-[\'\'] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70'])}
                    >
                        <div className='p-5 box'>
                            <div className='flex'>
                                <Lucide
                                    icon='PartyPopper'
                                    className='w-[28px] h-[28px] text-danger'
                                />
                                <div
                                    className='ml-auto cursor-pointer bg-danger py-[3px] flex rounded-full text-white text-xs px-3 items-center font-medium'>
                                    {props.dirtyRoomsPercent}
                                </div>
                            </div>
                            <div className='mt-6 text-3xl font-medium leading-8'>
                                {props.dirtyRooms}
                            </div>
                            <div className='mt-1 text-base text-slate-500'>
                                Kirli Oda
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-span-12 sm:col-span-6 xl:col-span-3 intro-y'>
                    <div
                        className={clsx(['relative zoom-in', 'before:content-[\'\'] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70'])}
                    >
                        <div className='p-5 box'>
                            <div className='flex'>
                                <Lucide
                                    icon='Construction'
                                    className='w-[28px] h-[28px] text-dark'
                                />
                                <div
                                    className='ml-auto cursor-pointer bg-dark py-[3px] flex rounded-full text-white text-xs px-3 items-center font-medium'>
                                    {props.outOfOrderRoomsPercent}
                                </div>
                            </div>
                            <div className='mt-6 text-3xl font-medium leading-8'>
                                {props.outOfOrderRooms}
                            </div>
                            <div className='mt-1 text-base text-slate-500'>
                                Satışa Kapalı Oda
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GeneralReports
