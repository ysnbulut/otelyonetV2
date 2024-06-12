import React, {useEffect, useState} from 'react'
import UnitChannelPrice from './UnitChannelPrice'
import {SeasonListProps} from '../types/season-list'
import dayjs from 'dayjs'
import tz from 'dayjs/plugin/timezone'
import 'dayjs/locale/tr'
import Lucide from '@/Components/Lucide'
import {twMerge} from 'tailwind-merge'
import {channel} from 'node:diagnostics_channel'

dayjs.extend(tz)
dayjs.tz.setDefault('Europe/Istanbul')
dayjs.locale('tr')

function SeasonList(props: SeasonListProps) {
	const [setableSubmitClick, setSetableSubmitClick] = useState<boolean>(false)
	const [warning, setWarning] = useState<boolean>(true)

	useEffect(() => {
		console.log('warning', warning)
		setSetableSubmitClick(warning)
		props.setWarningBadge((warningBadge) => ({
			...warningBadge,
			[props.roomTypeAndView.id]: warning,
		}))
	}, [warning])

	return (
		<div className="mx-2">
			<div className="mx-3 first:mt-0">
				<div className="dark:border- flex items-center justify-between rounded-b-md border-x-4 border-b-4 border-t-0 border-secondary bg-secondary/30 px-2 pb-1 pt-2 dark:bg-secondary/5">
					<h3 className="text-sm font-bold text-slate-600 dark:text-slate-400">Sezon Dışı Baz Fiyatlar</h3>
				</div>
			</div>
			<ul className="mx-5 mb-2 rounded-b-lg border-4 border-t-0">
				<li
					key={`off_season_reception`}
					className="border-b last:rounded-b-lg last:border-b-0">
					<UnitChannelPrice
						pricingPolicy={props.pricingPolicy}
						pricingCurrency={props.pricingCurrency}
						taxRate={props.taxRate}
						roomTypeAndViewId={props.roomTypeAndView.id}
						season={props.roomTypeAndView.unit_reception_base_price}
						bookingChannel={props.activatedChannels.find((channel) => channel.code === 'reception')}
						setWarning={setWarning}
						setableSubmitClick={setableSubmitClick}
					/>
				</li>
				<li
					key={`off_season_web`}
					className="border-b last:rounded-b-lg last:border-b-0">
					<UnitChannelPrice
						pricingPolicy={props.pricingPolicy}
						pricingCurrency={props.pricingCurrency}
						taxRate={props.taxRate}
						roomTypeAndViewId={props.roomTypeAndView.id}
						season={props.roomTypeAndView.unit_web_base_price}
						bookingChannel={props.activatedChannels.find((channel) => channel.code === 'web')}
						setWarning={setWarning}
						setableSubmitClick={setableSubmitClick}
					/>
				</li>
				<li
					key={`off_season_channels`}
					className="border-b last:rounded-b-lg last:border-b-0">
					<UnitChannelPrice
						pricingPolicy={props.pricingPolicy}
						pricingCurrency={props.pricingCurrency}
						taxRate={props.taxRate}
						roomTypeAndViewId={props.roomTypeAndView.id}
						season={props.roomTypeAndView.unit_channels_base_price}
						bookingChannel={null}
						setWarning={setWarning}
						setableSubmitClick={setableSubmitClick}
					/>
				</li>
			</ul>
			{props.roomTypeAndView.seasons.length > 0 &&
				props.roomTypeAndView.seasons.map((season, index) => (
					<div
						key={index}
						className="mx-3 first:mt-0">
						<div className="flex items-center justify-between rounded-md border-x-4 border-b-4 border-t-4 border-secondary bg-secondary/30 px-2 py-1 dark:bg-secondary/5">
							<h3 className="text-sm font-bold text-slate-600 dark:text-slate-400">{season.name}</h3>
							<div className="flex items-center justify-end">
								<Lucide
									icon="CalendarRange"
									className="mr-2 h-5 w-5 text-slate-600 dark:text-white/50"
								/>
								<h4 className="text-base font-semibold text-slate-600 dark:text-white/50">
									{dayjs(season.start_date).format('DD MMMM YYYY')} - {dayjs(season.end_date).format('DD MMMM YYYY')}
								</h4>
							</div>
						</div>
						<ul className="mx-2 mb-2 rounded-b-lg border-4 border-t-0">
							{season.reception && (
								<li
									key={`${season.id}_reception`}
									className="border-b last:rounded-b-lg last:border-b-0">
									<UnitChannelPrice
										pricingPolicy={props.pricingPolicy}
										pricingCurrency={props.pricingCurrency}
										taxRate={props.taxRate}
										roomTypeAndViewId={props.roomTypeAndView.id}
										season={season}
										bookingChannel={props.activatedChannels.find((channel) => channel.code === 'reception')}
										setWarning={setWarning}
										setableSubmitClick={setableSubmitClick}
									/>
								</li>
							)}
							{season.web && (
								<li
									key={`${season.id}_web`}
									className="border-b last:border-b-0">
									<UnitChannelPrice
										pricingPolicy={props.pricingPolicy}
										pricingCurrency={props.pricingCurrency}
										taxRate={props.taxRate}
										roomTypeAndViewId={props.roomTypeAndView.id}
										season={season}
										bookingChannel={props.activatedChannels.find((channel) => channel.code === 'web')}
										setWarning={setWarning}
										setableSubmitClick={setableSubmitClick}
									/>
								</li>
							)}
							{season.channels &&
								props.activatedChannels
									.filter((channel) => channel.code !== 'web' && channel.code !== 'reception' && channel.code !== 'agency' && channel.code !== 'online')
									.map((channel) => (
										<li
											key={`${season.id}_channel_${channel.id}`}
											className="border-b last:border-b-0">
											<UnitChannelPrice
												pricingPolicy={props.pricingPolicy}
												pricingCurrency={props.pricingCurrency}
												taxRate={props.taxRate}
												roomTypeAndViewId={props.roomTypeAndView.id}
												season={season}
												bookingChannel={channel}
												setWarning={setWarning}
												setableSubmitClick={setableSubmitClick}
											/>
										</li>
									))}

							{season.agency && (
								<li
									key={`${season.id}_agency`}
									className="border-b last:border-b-0">
									<UnitChannelPrice
										pricingPolicy={props.pricingPolicy}
										pricingCurrency={props.pricingCurrency}
										taxRate={props.taxRate}
										roomTypeAndViewId={props.roomTypeAndView.id}
										season={season}
										bookingChannel={props.activatedChannels.find((channel) => channel.code === 'agency')}
										setWarning={setWarning}
										setableSubmitClick={setableSubmitClick}
									/>
								</li>
							)}
						</ul>
					</div>
				))}
		</div>
	)
}

export default SeasonList
