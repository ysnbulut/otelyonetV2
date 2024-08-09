import CountUp from 'react-countup'

const Stats = ({count, title}: {count: number; title: string}) => {
	return (
		<div className="text-white-100 flex w-full items-center justify-center gap-5 py-[15px] sm:w-1/2 sm:w-[33.33%] sm:py-[30px]">
			<div className="flex flex-wrap items-center gap-2 sm:block">
				<p className="text-[25px] font-medium leading-[25px] sm:font-bold md:text-[30px] md:leading-[30px] lg:text-[50px] lg:leading-[50px]">
					<CountUp
						start={1}
						end={count}
						enableScrollSpy={true}
						useEasing={true}
						scrollSpyOnce={true}
						suffix="+"
					/>
				</p>
				<p className="text-[25px] font-normal">{title}</p>
			</div>
		</div>
	)
}

export default Stats
