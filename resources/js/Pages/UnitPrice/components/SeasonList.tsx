import React, {useEffect, useState} from 'react'
import SeasonListItem from '@/Pages/UnitPrice/components/SeasonListItem'
import {SeasonListProps} from '@/Pages/UnitPrice/types/season-list'

function SeasonList(props: SeasonListProps) {
	const [setableSubmitClick, setSetableSubmitClick] = useState<boolean>(false)
	const [warnings, setWarnings] = useState<{[key: number]: boolean}>({})

	useEffect(() => {
		const warning = Object.values(warnings).includes(true)
		setSetableSubmitClick(warning)
		props.setWarningBadge((warningBadge) => ({
			...warningBadge,
			[props.roomTypeAndView.id]: warning,
		}))
	}, [warnings])
	return (
		<ul className="-mt-1 rounded-b border-x border-b">
			<li
				key={0}
				className="border-b last:border-b-0">
				<SeasonListItem
					pricingPolicy={props.pricingPolicy}
					pricingCurrency={props.pricingCurrency}
					roomTypeAndViewId={props.roomTypeAndView.id}
					season={props.roomTypeAndView.off_season}
					setWarnings={setWarnings}
					setableSubmitClick={setableSubmitClick}
				/>
			</li>
			{props.roomTypeAndView.seasons.length > 0 &&
				props.roomTypeAndView.seasons.map((season) => (
					<li
						key={season.id}
						className="border-b last:border-b-0">
						<SeasonListItem
							pricingPolicy={props.pricingPolicy}
							pricingCurrency={props.pricingCurrency}
							roomTypeAndViewId={props.roomTypeAndView.id}
							season={season}
							setWarnings={setWarnings}
							setableSubmitClick={setableSubmitClick}
						/>
					</li>
				))}
		</ul>
	)
}

export default SeasonList
