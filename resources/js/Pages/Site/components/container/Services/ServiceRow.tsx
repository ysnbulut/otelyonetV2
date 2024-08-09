const ServiceRow = ({isLast, title, description, id}: {isLast: boolean; title: string; description: string; id: number}) => {
	return (
		<div className="w-full">
			<div className="bg-line h-[1px] w-full rounded-full"></div>
			<div className="flex w-full flex-wrap sm:flex-nowrap">
				<div className="number-style text-black-100/90 hidden w-1/12 items-center justify-center border-r text-[16px] font-semibold sm:flex">{id}</div>
				<div className="flex w-full items-center justify-start text-start sm:w-4/12 sm:border-r">
					<p className="text-black-100/90 pt-3 text-[18px] font-bold opacity-80 sm:px-3 sm:py-5">{title}</p>
				</div>

				<div className="flex w-full items-start justify-start text-justify sm:w-7/12 sm:pl-5">
					<p className="text-soft py-3">{description}</p>
				</div>
			</div>

			{isLast && <div className="bg-line h-[1px] w-full rounded-full"></div>}
		</div>
	)
}

export default ServiceRow
