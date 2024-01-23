import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import {Head, Link, router} from '@inertiajs/react'
import {PageProps} from './types'
import Lucide from '@/Components/Lucide'
import OccupancyWeeklyChart from './components/weeklyLineChart'
import RoomStatusTodayDonutChartCard from './components/RoomStatusDonutChartCard'
import GeneralReports from './components/GeneralReports'
import Button from '@/Components/Button'
import route from 'ziggy-js'
import {useRef} from 'react'
import TinySlider, {TinySliderElement} from '@/Components/TinySlider'
import {twMerge} from 'tailwind-merge'
import UpcomingBokingsSection from './components/UpcomingBokingsSection'

export default function Index({
	auth,
	room_count,
	booked_rooms,
	booked_rooms_percent,
	available_rooms,
	available_rooms_percent,
	dirty_rooms,
	dirty_rooms_percent,
	out_of_order_rooms,
	out_of_order_rooms_percent, // guest_count,
	// today_check_in_guest_count,
	// today_check_out_guest_count,
	// tomorrow_check_in_guest_count,
	// tomorrow_check_out_guest_count,
	// booked_rooms_yearly,
	booked_rooms_weekly,
	transactions,
}: PageProps) {
	const importantNotesRef = useRef<TinySliderElement>()
	const prevImportantNotes = () => {
		importantNotesRef.current?.tns.goTo('prev')
	}
	const nextImportantNotes = () => {
		importantNotesRef.current?.tns.goTo('next')
	}
	return (
		<>
			<Head title="Dashboard" />
			<div className="py-12">
				<div className="grid grid-cols-12 gap-6">
					<div className="col-span-12 2xl:col-span-9">
						<div className="grid grid-cols-12 gap-6">
							{/* BEGIN: General Report */}
							<GeneralReports
								bookedRooms={booked_rooms}
								bookedRoomsPercent={booked_rooms_percent}
								availableRooms={available_rooms}
								availableRoomsPercent={available_rooms_percent}
								dirtyRooms={dirty_rooms}
								dirtyRoomsPercent={dirty_rooms_percent}
								outOfOrderRooms={out_of_order_rooms}
								outOfOrderRoomsPercent={out_of_order_rooms_percent}
							/>
							{/* END: General Report */}
							{/* BEGIN: Sales Report */}
							<div className="col-span-12 mt-8 sm:col-span-6 lg:col-span-6">
								<div className="intro-y flex h-10 items-center">
									<h2 className="mr-5 truncate text-lg font-medium">Haftalık Doluluk Grafiği (Bu Hafta)</h2>
								</div>
								<div className="intro-y box mt-6 p-5 sm:mt-5">
									<div className="mt-3">
										<OccupancyWeeklyChart
											dataSet={booked_rooms_weekly}
											max_room={room_count}
											height={213}
										/>
									</div>
								</div>
								<div className="intro-y mt-4 block h-10 items-center sm:flex">
									<h2 className="mr-5 truncate text-lg font-medium">Yıllık Doluluk Grafiği</h2>
								</div>
								<div className="intro-y box mt-6 p-5 sm:mt-5">
									<OccupancyWeeklyChart
										dataSet={booked_rooms_weekly}
										max_room={room_count}
										height={213}
									/>
								</div>
							</div>
							{/* END: Sales Report */}
							{/* BEGIN: Sales Report */}
							<RoomStatusTodayDonutChartCard
								bookedRoomsPercent={booked_rooms_percent}
								availableRoomsPercent={available_rooms_percent}
								dirtyRoomsPercent={dirty_rooms_percent}
								outOfOrderRoomsPercent={out_of_order_rooms_percent}
							/>
							{/* END: Sales Report */}
							{/* BEGIN: Weekly Top Products */}
							<UpcomingBokingsSection
								onEnterViewport={() => console.log('inner')}
								onLeaveViewport={() => console.log('leave')}
							/>
							{/* END: Weekly Top Products */}
						</div>
					</div>
					<div className="col-span-12 2xl:col-span-3">
						<div className="-mb-10 pb-10 2xl:border-l">
							<div className="grid grid-cols-12 gap-x-6 gap-y-6 2xl:gap-x-0 2xl:pl-6">
								{/* BEGIN: Transactions */}
								<div className="col-span-12 mt-3 md:col-span-6 xl:col-span-4 2xl:col-span-12 2xl:mt-8">
									<div className="intro-x flex h-10 items-center">
										<h2 className="mr-5 truncate text-lg font-medium">Son 10 İşlem</h2>
									</div>
									<div className="mt-5">
										{transactions.map((transaction, key) => (
											<div
												key={key}
												className="intro-x">
												<Link
													href={
														transaction.type === 'Ödeme'
															? route('hotel.customers.show', transaction.customer_id)
															: route('hotel.bookings.show', transaction.id)
													}
													className="box zoom-in mb-3 flex items-center px-5 py-3">
													<div className="image-fit flex h-10 w-10 items-center overflow-hidden rounded-full">
														{transaction.type === 'Ödeme' ? (
															<Lucide
																icon={'Banknote'}
																className="h-6 w-6 text-slate-900"
															/>
														) : (
															<Lucide
																icon={'CalendarPlus'}
																className="h-6 w-6 text-slate-900"
															/>
														)}
													</div>
													<div className="ml-4 mr-auto">
														<div className="font-medium">{transaction.type}</div>
														<div className="mt-0.5 text-xs text-slate-500">{transaction.date}</div>
													</div>
													<div className={twMerge(['text-success', transaction.type === 'Ödeme' && 'text-danger'])}>
														{transaction.amount}
													</div>
												</Link>
											</div>
										))}
									</div>
								</div>
								{/* END: Transactions */}
								{/* BEGIN: Important Notes */}
								<div className="col-span-12 mt-3 md:col-span-6 xl:col-span-12 xl:col-start-1 xl:row-start-1 2xl:col-start-auto 2xl:row-start-auto">
									<div className="intro-x flex h-10 items-center">
										<h2 className="mr-auto truncate text-lg font-medium">Important Notes</h2>
										<Button
											data-carousel="important-notes"
											data-target="prev"
											className="mr-2 border-slate-300 px-2 text-slate-600 dark:text-slate-300"
											onClick={prevImportantNotes}>
											<Lucide
												icon="ChevronLeft"
												className="h-4 w-4"
											/>
										</Button>
										<Button
											data-carousel="important-notes"
											data-target="next"
											className="mr-2 border-slate-300 px-2 text-slate-600 dark:text-slate-300"
											onClick={nextImportantNotes}>
											<Lucide
												icon="ChevronRight"
												className="h-4 w-4"
											/>
										</Button>
									</div>
									<div className="intro-x mt-5">
										<div className="box zoom-in">
											<TinySlider
												getRef={(el) => {
													importantNotesRef.current = el
												}}>
												<div className="p-5">
													<div className="truncate text-base font-medium">Lorem Ipsum is simply dummy text</div>
													<div className="mt-1 text-slate-400">20 Hours ago</div>
													<div className="mt-1 text-justify text-slate-500">
														Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
														been the industry's standard dummy text ever since the 1500s.
													</div>
													<div className="mt-5 flex font-medium">
														<Button
															variant="secondary"
															type="button"
															className="px-2 py-1">
															View Notes
														</Button>
														<Button
															variant="outline-secondary"
															type="button"
															className="ml-auto px-2 py-1">
															Dismiss
														</Button>
													</div>
												</div>
												<div className="p-5">
													<div className="truncate text-base font-medium">Lorem Ipsum is simply dummy text</div>
													<div className="mt-1 text-slate-400">20 Hours ago</div>
													<div className="mt-1 text-justify text-slate-500">
														Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
														been the industry's standard dummy text ever since the 1500s.
													</div>
													<div className="mt-5 flex font-medium">
														<Button
															variant="secondary"
															type="button"
															className="px-2 py-1">
															View Notes
														</Button>
														<Button
															variant="outline-secondary"
															type="button"
															className="ml-auto px-2 py-1">
															Dismiss
														</Button>
													</div>
												</div>
												<div className="p-5">
													<div className="truncate text-base font-medium">Lorem Ipsum is simply dummy text</div>
													<div className="mt-1 text-slate-400">20 Hours ago</div>
													<div className="mt-1 text-justify text-slate-500">
														Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
														been the industry's standard dummy text ever since the 1500s.
													</div>
													<div className="mt-5 flex font-medium">
														<Button
															variant="secondary"
															type="button"
															className="px-2 py-1">
															View Notes
														</Button>
														<Button
															variant="outline-secondary"
															type="button"
															className="ml-auto px-2 py-1">
															Dismiss
														</Button>
													</div>
												</div>
											</TinySlider>
										</div>
									</div>
								</div>
								{/* END: Important Notes */}
								{/* BEGIN: Schedules */}
								<div className="col-span-12 mt-3 md:col-span-6 xl:col-span-4 xl:col-start-1 xl:row-start-2 2xl:col-span-12 2xl:col-start-auto 2xl:row-start-auto">
									<div className="intro-x flex h-10 items-center">
										<h2 className="mr-5 truncate text-lg font-medium">Schedules</h2>
										<a
											href=""
											className="ml-auto flex items-center truncate text-primary">
											<Lucide
												icon="Plus"
												className="mr-1 h-4 w-4"
											/>{' '}
											Add New Schedules
										</a>
									</div>
									<div className="mt-5">
										<div className="intro-x box">
											<div className="p-5">
												<div className="flex">
													<Lucide
														icon="ChevronLeft"
														className="h-5 w-5 text-slate-500"
													/>
													<div className="mx-auto text-base font-medium">April</div>
													<Lucide
														icon="ChevronRight"
														className="h-5 w-5 text-slate-500"
													/>
												</div>
												<div className="mt-5 grid grid-cols-7 gap-4 text-center">
													<div className="font-medium">Su</div>
													<div className="font-medium">Mo</div>
													<div className="font-medium">Tu</div>
													<div className="font-medium">We</div>
													<div className="font-medium">Th</div>
													<div className="font-medium">Fr</div>
													<div className="font-medium">Sa</div>
													<div className="relative rounded py-0.5 text-slate-500">29</div>
													<div className="relative rounded py-0.5 text-slate-500">30</div>
													<div className="relative rounded py-0.5 text-slate-500">31</div>
													<div className="relative rounded py-0.5">1</div>
													<div className="relative rounded py-0.5">2</div>
													<div className="relative rounded py-0.5">3</div>
													<div className="relative rounded py-0.5">4</div>
													<div className="relative rounded py-0.5">5</div>
													<div className="relative rounded bg-success/20 py-0.5 dark:bg-success/30">6</div>
													<div className="relative rounded py-0.5">7</div>
													<div className="relative rounded bg-primary py-0.5 text-white">8</div>
													<div className="relative rounded py-0.5">9</div>
													<div className="relative rounded py-0.5">10</div>
													<div className="relative rounded py-0.5">11</div>
													<div className="relative rounded py-0.5">12</div>
													<div className="relative rounded py-0.5">13</div>
													<div className="relative rounded py-0.5">14</div>
													<div className="relative rounded py-0.5">15</div>
													<div className="relative rounded py-0.5">16</div>
													<div className="relative rounded py-0.5">17</div>
													<div className="relative rounded py-0.5">18</div>
													<div className="relative rounded py-0.5">19</div>
													<div className="relative rounded py-0.5">20</div>
													<div className="relative rounded py-0.5">21</div>
													<div className="relative rounded py-0.5">22</div>
													<div className="relative rounded bg-pending/20 py-0.5 dark:bg-pending/30">23</div>
													<div className="relative rounded py-0.5">24</div>
													<div className="relative rounded py-0.5">25</div>
													<div className="relative rounded py-0.5">26</div>
													<div className="relative rounded bg-primary/10 py-0.5 dark:bg-primary/50">27</div>
													<div className="relative rounded py-0.5">28</div>
													<div className="relative rounded py-0.5">29</div>
													<div className="relative rounded py-0.5">30</div>
													<div className="relative rounded py-0.5 text-slate-500">1</div>
													<div className="relative rounded py-0.5 text-slate-500">2</div>
													<div className="relative rounded py-0.5 text-slate-500">3</div>
													<div className="relative rounded py-0.5 text-slate-500">4</div>
													<div className="relative rounded py-0.5 text-slate-500">5</div>
													<div className="relative rounded py-0.5 text-slate-500">6</div>
													<div className="relative rounded py-0.5 text-slate-500">7</div>
													<div className="relative rounded py-0.5 text-slate-500">8</div>
													<div className="relative rounded py-0.5 text-slate-500">9</div>
												</div>
											</div>
											<div className="border-t border-slate-200/60 p-5">
												<div className="flex items-center">
													<div className="mr-3 h-2 w-2 rounded-full bg-pending"></div>
													<span className="truncate">UI/UX Workshop</span>
													<span className="font-medium xl:ml-auto">23th</span>
												</div>
												<div className="mt-4 flex items-center">
													<div className="mr-3 h-2 w-2 rounded-full bg-primary"></div>
													<span className="truncate">VueJs Frontend Development</span>
													<span className="font-medium xl:ml-auto">10th</span>
												</div>
												<div className="mt-4 flex items-center">
													<div className="mr-3 h-2 w-2 rounded-full bg-warning"></div>
													<span className="truncate">Laravel Rest API</span>
													<span className="font-medium xl:ml-auto">31th</span>
												</div>
											</div>
										</div>
									</div>
								</div>
								{/* END: Schedules */}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

Index.layout = (page: React.ReactNode) => (
	<AuthenticatedLayout
		//todo burda bir header var ama kullanılmıyor. Ayrıca buraya breadcumb için bir dizi obje gönder topbarın içinde düzenle
		// header={<h2 className='font-semibold text-xl text-gray-800 leading-tight'>Show</h2>}
		breadcrumb={[
			{
				title: 'Dashboard',
				href: route('hotel.dashboard.index'),
			},
		]}>
		{page}
	</AuthenticatedLayout>
)
