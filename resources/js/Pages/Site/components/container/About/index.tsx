import SectionTitle from '../../common/SectionTitle/index.js'
import Stats from './Stats'

const About = ({
	aboutImg,
	aboutContent,
	aboutStats,
	hash,
}: {
	aboutImg: string
	aboutContent: {subtitle: string; title: string; description: string[]}
	aboutStats: {count: number; title: string}[]
	hash: string
}) => {
	return (
		<section
			id={hash}
			className="flex flex-col items-center justify-center bg-white pt-[400px] sm:pt-[380px] md:pt-[250px] lg:pt-[300px]">
			<div className="custom-container-1 relative mb-[80px] flex w-full items-center justify-around gap-16 lg:mb-0 lg:justify-center">
				<div className="hidden h-full w-6/12 justify-center lg:flex">
					<img
						className="w-full rounded-3xl"
						src={aboutImg}
						alt={hash}
					/>
				</div>

				<div className="relative flex w-full flex-col rounded-l-3xl lg:h-full lg:w-6/12 lg:justify-between">
					<div>
						<SectionTitle
							top={aboutContent?.subtitle}
							topStyle="lg:text-start text-center"
							bottom={aboutContent?.title}
							bottomStyle="lg:text-start text-center"
						/>
					</div>

					<div className="text-soft flex flex-col gap-3 text-justify">{aboutContent?.description?.map((text: string, index: number) => <p key={text + index}>{text}</p>)}</div>
				</div>
			</div>

			<div className="ticket-wave flex w-full items-center justify-center bg-primary lg:mt-[100px]">
				<div className="ticket-wave absolute top-0 w-full rotate-180 bg-primary"></div>
				<div className="custom-container-1 flex w-full flex-wrap justify-center sm:flex-nowrap sm:justify-start">
					{aboutStats?.map(({count, title}: {count: number; title: string}, index: number) => {
						return (
							<Stats
								key={title + index}
								count={count}
								title={title}
							/>
						)
					})}
				</div>
			</div>
		</section>
	)
}

export default About
