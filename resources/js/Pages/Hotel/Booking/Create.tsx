import React, {useEffect, useState} from 'react'
import {Head} from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/HotelAuthenticatedLayout'
import {CustomerProps, DailyPriceProps, StepOneResponseProps} from '@/Pages/Hotel/Booking/types/response'
import One from '@/Pages/Hotel/Booking/Steps/One'
import Two from '@/Pages/Hotel/Booking/Steps/Two'
import Three from '@/Pages/Hotel/Booking/Steps/Three'
import {BookingResultProps, CheckedRoomsDailyPriceProps, CheckedRoomsProps, RoomTypeRoomGuestsProps} from '@/Pages/Hotel/Booking/types/steps'
import Four from '@/Pages/Hotel/Booking/Steps/Four'
import BookingSummary from '@/Pages/Hotel/Booking/components/BookingSummary'
import {CitizenProps} from '@/Pages/Hotel/Booking/types/show'

interface CreateProps {
	baby_age_limit: number
	child_age_limit: number
	accommodation_type: string
	citizens: CitizenProps[]
}

function Create(props: CreateProps) {
	const [step, setStep] = useState<number>(1)
	const [stepOneResults, setStepOneResults] = useState<StepOneResponseProps | undefined>()
	const [bookingType, setBookingType] = useState<string>('normal')
	const [checkinRequired, setCheckinRequired] = useState<boolean>(false)
	const [checkedRooms, setCheckedRooms] = useState<CheckedRoomsProps | undefined>(undefined)
	const [dailyPrices, setDailyPrices] = useState<CheckedRoomsDailyPriceProps | undefined>(undefined)

	const [bookingResult, setBookingResult] = useState<BookingResultProps | undefined>(undefined)
	const [grandTotal, setGrandTotal] = useState<number>(0)
	const [customerId, setCustomerId] = useState<number | undefined>()
	const [bookingCustomer, setBookingCustomer] = useState<CustomerProps | undefined>(customerId && stepOneResults ? stepOneResults.customers.find((customer) => customer.id === customerId) : undefined)
	const [roomsGuests, setRoomsGuests] = useState<RoomTypeRoomGuestsProps>({})
	const [selectedPrice, setSelectedPrice] = useState<{[key: number]: string} | undefined>()

	useEffect(() => {
		if (stepOneResults) {
			let booking_type = bookingType === 'normal' ? 'Normal' : 'Açık'
			let i = 0
			if (checkedRooms) {
				Object.values(checkedRooms).forEach((key) => {
					i = i + key.length
				})
			}
			booking_type += i > 1 ? ' Gurup Rezervasyon' : ' Rezervasyon'
			setBookingResult({
				check_in: stepOneResults.request.check_in,
				check_out: stepOneResults.request.check_out,
				night_count: stepOneResults.night_count,
				booking_type: booking_type,
				number_of_adults_total: stepOneResults.request.number_of_adults,
				number_of_children_total: stepOneResults.request.number_of_children,
			})

			stepOneResults.data.forEach((item) => {
				setSelectedPrice((prevState: any) => {
					return {
						...prevState,
						[item.id]: 'reception', //(prevState && prevState[item.id]) ||
					}
				})
				if (checkedRooms && checkedRooms[item.id] && checkedRooms[item.id].length > 0 && selectedPrice && selectedPrice[item.id]) {
					setBookingResult((prevState: any) => {
						return {
							...prevState,
							number_of_adults_total:
								checkedRooms?.[item.id]?.length <= 1
									? stepOneResults?.request.number_of_adults * checkedRooms?.[item.id]?.length
									: prevState?.number_of_adults_total + stepOneResults?.request.number_of_adults * (checkedRooms?.[item.id]?.length - 1),
							number_of_children_total:
								checkedRooms?.[item.id]?.length <= 1
									? stepOneResults?.request.number_of_children * checkedRooms?.[item.id]?.length
									: (prevState?.number_of_children_total || 0) + stepOneResults?.request.number_of_children * (checkedRooms?.[item.id]?.length - 1),
							typed_rooms:
								prevState && Array.isArray(prevState.typed_rooms)
									? [
											...prevState.typed_rooms,
											{
												id: item.id,
												name: item.name,
												count: checkedRooms[item.id].length,
												price: item.prices[selectedPrice[item.id]].total_price.price,
												total_price: item.prices[selectedPrice[item.id]].total_price.price * checkedRooms[item.id].length,
											},
										]
									: [
											{
												id: item.id,
												name: item.name,
												count: checkedRooms[item.id].length,
												price: item.prices[selectedPrice[item.id]].total_price.price,
												total_price: item.prices[selectedPrice[item.id]].total_price.price * checkedRooms[item.id].length,
											},
										],
						}
					})
				}
			})
		}
	}, [stepOneResults, checkedRooms, bookingType])

	useEffect(() => {
		if (bookingResult) {
			let total = 0
			if (bookingResult.typed_rooms?.length === 0) {
				setGrandTotal(0)
			} else {
				bookingResult.typed_rooms?.forEach((room) => {
					total += room.total_price || 0
				})
				setGrandTotal(total)
			}
		}
	}, [bookingResult])

	return (
		<>
			<Head title="Rezervasyon Oluştur" />
			<h2 className="intro-y my-5 text-lg font-medium">Rezervasyon Oluştur.</h2>
			{step < 3 && (
				<One
					baby_age_limit={props.baby_age_limit}
					child_age_limit={props.child_age_limit}
					accommodation_type={props.accommodation_type}
					setBookingType={setBookingType}
					setStepOneResults={setStepOneResults}
					setStep={setStep}
					setCheckinRequired={setCheckinRequired}
					setCheckedRooms={setCheckedRooms}
					setDailyPrices={setDailyPrices}
				/>
			)}
			{step > 1 && (
				<div className="flex flex-col gap-5 lg:flex-row">
					{step < 5 && (
						<div className="lg:w-2/3">
							{stepOneResults && step === 2 && (
								<Two
									accommodationType={props.accommodation_type}
									selectedPrice={selectedPrice}
									stepOneResults={stepOneResults}
									bookingType={bookingType}
									setStep={setStep}
									checkedRooms={checkedRooms}
									setSelectedPrice={setSelectedPrice}
									setCheckedRooms={setCheckedRooms}
									setDailyPrices={setDailyPrices}
									setRoomsGuests={setRoomsGuests}
								/>
							)}
							{stepOneResults && step === 3 && (
								<Three
									customers={stepOneResults.customers}
									customerId={customerId}
									setCustomerId={setCustomerId}
									setStepOneResults={setStepOneResults}
									setBookingCustomer={setBookingCustomer}
									setStep={setStep}
								/>
							)}
							{stepOneResults && step === 4 && (
								<Four
									citizens={props.citizens}
									guests={stepOneResults.guests}
									setStep={setStep}
									checkedRooms={checkedRooms}
									data={stepOneResults.data}
									setRoomsGuests={setRoomsGuests}
									roomsGuests={roomsGuests}
								/>
							)}
						</div>
					)}
					{stepOneResults && stepOneResults.data.length > 0 && (
						<BookingSummary
							checkinRequired={checkinRequired}
							bookingResult={bookingResult}
							checkedRooms={checkedRooms}
							setCheckedRooms={setCheckedRooms}
							dailyPrices={dailyPrices}
							step={step}
							setStep={setStep}
							grandTotal={grandTotal}
							pricingCurrency={stepOneResults.currency}
							customerId={customerId}
							bookingCustomer={bookingCustomer}
							number_of_adults={stepOneResults.request.number_of_adults}
							number_of_children={stepOneResults.request.number_of_children}
							children_ages={stepOneResults.request.children_ages}
							data={stepOneResults.data}
							roomsGuests={roomsGuests}
							citizens={props.citizens}
						/>
					)}
				</div>
			)}
		</>
	)
}

Create.layout = (page: React.ReactNode) => (
	<AuthenticatedLayout
		// header={<h2 className='font-semibold text-xl text-gray-800 leading-tight'>asdasdas</h2>}
		breadcrumb={[
			{
				href: route('hotel.dashboard.index'),
				title: 'Dashboard',
			},
			{
				href: route('hotel.bookings.index'),
				title: 'Rezervasyonlar',
			},
			{
				href: route('hotel.booking_create'),
				title: 'Rezervasyon Oluştur',
			},
		]}
		children={page}
	/>
)

export default Create
