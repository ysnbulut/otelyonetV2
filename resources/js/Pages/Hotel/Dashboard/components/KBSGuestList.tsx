import React from 'react'
import {KBSGuestsList} from '@/Pages/Hotel/Dashboard/types'
import Table from '@/Components/Table'
import Button from '@/Components/Button'
import LoadingIcon from '@/Components/LoadingIcon'
import Alert from '@/Components/Alert'
import Lucide from '@/Components/Lucide'
import Tippy from '@/Components/Tippy'
import {Link} from '@inertiajs/react'

interface KBSGuestsListProps {
	kbsGuestsList: KBSGuestsList[]
}

function KbsGuestList(props: KBSGuestsListProps) {
	return (
		<div className="col-span-12 mt-6">
			{props.kbsGuestsList && props.kbsGuestsList.length > 0 ? (
				<>
					<div className="intro-y block h-10 items-center sm:flex">
						<h2 className="mr-5 truncate text-lg font-medium">Kimlik Bildirim Listesi</h2>
					</div>
					<div className="intro-y mt-8 overflow-auto sm:mt-0 lg:overflow-visible">
						<Table
							id="responsive-table"
							className="border-separate border-spacing-y-[10px] sm:mt-2">
							<Table.Thead>
								<Table.Tr>
									<Table.Th className="whitespace-nowrap border-b-0">ODA</Table.Th>
									<Table.Th className="whitespace-nowrap border-b-0">MİSAFİR</Table.Th>
									<Table.Th className="whitespace-nowrap border-b-0 text-center">GİRİŞ - ÇIKIŞ TARİH</Table.Th>
									<Table.Th className="whitespace-nowrap border-b-0 text-center">CHECK İN</Table.Th>
									<Table.Th className="whitespace-nowrap border-b-0 text-center">CHECK OUT</Table.Th>
									<Table.Th className="whitespace-nowrap border-b-0">KBS GİRİŞ</Table.Th>
									<Table.Th className="whitespace-nowrap border-b-0">KBS ÇIKIŞ</Table.Th>
									<Table.Th className="whitespace-nowrap border-b-0">DETAY</Table.Th>
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody className="divide-y-[0.7rem] divide-transparent">
								{props.kbsGuestsList.map((guest) => (
									<Table.Tr
										key={guest.booking_id}
										className="intro-y">
										<Table.Td
											dataLabel="Oda"
											className="w-full rounded-t-md bg-white lg:w-40 lg:rounded-l-md lg:rounded-tr-none lg:shadow-[20px_3px_20px_#0000000b] lg:first:rounded-l-md lg:last:rounded-r-md dark:bg-darkmode-600">
											<span className="flex whitespace-nowrap rounded bg-primary/10 px-2 py-1 font-bold text-primary shadow-inner">{guest.room_name}</span>
										</Table.Td>
										<Table.Td
											dataLabel="Misafir"
											className="w-full bg-white lg:shadow-[20px_3px_20px_#0000000b] lg:first:rounded-l-md lg:last:rounded-r-md dark:bg-darkmode-600">
											<div className="flex whitespace-nowrap">
												{guest.guest_name} {guest.guest_surname}
											</div>
										</Table.Td>
										<Table.Td
											dataLabel="Misafir"
											className="w-full bg-white lg:shadow-[20px_3px_20px_#0000000b] lg:first:rounded-l-md lg:last:rounded-r-md dark:bg-darkmode-600">
											<div className="flex whitespace-nowrap text-xs font-semibold">
												{guest.room_check_in_date} - {guest.room_check_out_date}
											</div>
										</Table.Td>
										<Table.Td
											dataLabel="Check In"
											className="w-full border-b-0 bg-white shadow-[20px_3px_20px_#0000000b] first:rounded-l-md last:rounded-r-md dark:bg-darkmode-600">
											{guest.check_in ? (
												<Tippy content="Check In Yapıldı">
													<Lucide
														icon="CheckCheck"
														className="mx-auto h-6 w-6 text-success"
													/>
												</Tippy>
											) : (
												<Tippy content="Check In Yapılmadı">
													<Lucide
														icon="X"
														className="mx-auto h-6 w-6 text-danger"
													/>
												</Tippy>
											)}
										</Table.Td>
										<Table.Td
											dataLabel="Check Out"
											className="w-full bg-white lg:shadow-[20px_3px_20px_#0000000b] lg:first:rounded-l-md lg:last:rounded-r-md lg:last:rounded-bl-none dark:bg-darkmode-600">
											{guest.check_out ? (
												<Tippy content="Check Out Yapıldı">
													<Lucide
														icon="CheckCheck"
														className="mx-auto h-6 w-6 text-success"
													/>
												</Tippy>
											) : guest.check_in ? (
												<Tippy content="Check Out Yapılmadı">
													<Lucide
														icon="X"
														className="mx-auto h-6 w-6 text-danger"
													/>
												</Tippy>
											) : (
												<Tippy content="Check In Yapılmadı">
													<Lucide
														icon="Minus"
														className="mx-auto h-6 w-6 text-danger"
													/>
												</Tippy>
											)}
										</Table.Td>
										<Table.Td
											dataLabel="KBS Giriş"
											className="w-full bg-white lg:shadow-[20px_3px_20px_#0000000b] lg:first:rounded-l-md lg:last:rounded-r-md lg:last:rounded-bl-none dark:bg-darkmode-600">
											{guest.kbs_check_in ? (
												<Tippy content="KBS Giriş Yapıldı">
													<Lucide
														icon="CheckCheck"
														className="mx-auto h-6 w-6 text-success"
													/>
												</Tippy>
											) : guest.check_in ? (
												<Tippy content="KBS Giriş Yapılmadı">
													<Lucide
														icon="X"
														className="mx-auto h-6 w-6 text-danger"
													/>
												</Tippy>
											) : (
												<Tippy content="Check In Yapılmadı">
													<Lucide
														icon="Minus"
														className="mx-auto h-6 w-6 text-danger"
													/>
												</Tippy>
											)}
										</Table.Td>
										<Table.Td
											dataLabel="KBS Çıkış"
											className="w-full bg-white lg:shadow-[20px_3px_20px_#0000000b] lg:first:rounded-l-md lg:last:rounded-r-md lg:last:rounded-bl-none dark:bg-darkmode-600">
											{guest.kbs_check_out ? (
												<Tippy content="KBS Çıkış Yapıldı">
													<Lucide
														icon="CheckCheck"
														className="mx-auto h-6 w-6 text-success"
													/>
												</Tippy>
											) : guest.check_out ? (
												<Tippy content="KBS Çıkış Yapılmadı">
													<Lucide
														icon="X"
														className="mx-auto h-6 w-6 text-danger"
													/>
												</Tippy>
											) : (
												<Tippy content="Check Out Yapılmadı">
													<Lucide
														icon="Minus"
														className="mx-auto h-6 w-6 text-danger"
													/>
												</Tippy>
											)}
										</Table.Td>
										<Table.Td
											dataLabel="Detay"
											className="w-full rounded-b-md bg-white lg:rounded-r-md lg:shadow-[20px_3px_20px_#0000000b] lg:first:rounded-l-md lg:last:rounded-r-md lg:last:rounded-bl-none dark:bg-darkmode-600">
											<Link href={route('hotel.bookings.show', guest.booking_id)}>
												<Lucide
													icon="MousePointerSquareDashed"
													className="mx-auto h-6 w-6 text-primary"
												/>
											</Link>
										</Table.Td>
									</Table.Tr>
								))}
							</Table.Tbody>
						</Table>
					</div>
				</>
			) : (
				<Alert
					variant="outline-dark"
					className="mb-2 flex items-center">
					{({dismiss}) => (
						<>
							<Lucide
								icon="AlertTriangle"
								className="mr-2 h-6 w-6"
							/>{' '}
							Bugün ve bugünden sonrası için rezervasyon bulunamadı.
							<Alert.DismissButton
								type="button"
								className="btn-close"
								onClick={dismiss}
								aria-label="Close">
								<Lucide
									icon="X"
									className="h-4 w-4"
								/>
							</Alert.DismissButton>
						</>
					)}
				</Alert>
			)}
		</div>
	)
}

export default KbsGuestList
