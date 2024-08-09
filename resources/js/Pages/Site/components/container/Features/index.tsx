import Card from './Card.js'
import SectionTitle from '../../common/SectionTitle/index.js'

const Features = ({featuresContent, featuresCards, hash}: {featuresContent: {subtitle: string; title: string}; featuresCards: {img: string; title: string; desc: string}[]; hash: string}) => {
	return (
		<section
			id={hash}
			className="flex justify-center bg-white pb-[50px] pt-[100px]">
			<div className="custom-container-1">
				<SectionTitle
					top={featuresContent?.subtitle}
					topStyle="lg:text-start text-center"
					bottom={featuresContent?.title}
					bottomStyle="lg:text-start text-center"
				/>

				<div className="mt-[100px] flex flex-wrap justify-between">
					{featuresCards?.map(({img, title, desc}: {img: string; title: string; desc: string}, index: number) => {
						return (
							<Card
								key={index}
								img={img}
								title={title}
								desc={desc}
								id={(index + 1).toString()}
							/>
						)
					})}
				</div>
			</div>
		</section>
	)
}

export default Features
