import Slider from 'react-slick'
import {IoIosStar} from '@react-icons/all-files/io/IoIosStar'
import SectionTitle from '../../common/SectionTitle/index.js'
import {motion, useInView} from 'framer-motion'
import {useRef} from 'react'

const Referances = ({
	referancesContent,
	referancesImg,
	referancesSlider,
	hash,
}: {
	referancesContent: {subtitle: string; title: string; greenTitle: string; description: string[]}
	referancesImg: string
	referancesSlider: string[]
	hash: string
}) => {
	const settings = {
		infinite: true,
		speed: 3000,
		autoplay: true,
		autoplaySpeed: 0,
		centerMode: true,
		draggable: false,
		focusOnSelect: false,
		pauseOnFocus: false,
		pauseOnHover: false,
		slidesToShow: 4,
		slidesToScroll: 0,
		touchMove: false,
		cssEase: 'ease-in-out',
		useTransform: true,
		responsive: [
			{
				breakpoint: 1280,
				settings: {
					slidesToShow: 3,
				},
			},
			{
				breakpoint: 800,
				settings: {
					slidesToShow: 2,
				},
			},
			{
				breakpoint: 600,
				settings: {
					slidesToShow: 1.5,
				},
			},
			{
				breakpoint: 400,
				settings: {
					slidesToShow: 1,
				},
			},
		],
	}

	const ref = useRef(null)
	const isInView = useInView(ref, {once: true})

	return (
		<div
			id={hash}
			className="w-full">
			<div className="bg-slate-100/90 pt-[100px]">
				<div className="flex w-full justify-center">
					<div className="custom-container-1">
						<div className="4xl:justify-center flex w-full items-center justify-start gap-20 pb-[100px]">
							<div className="w-full md:w-6/12">
								<div className=" flex w-full flex-col">
									<SectionTitle
										top={referancesContent?.subtitle}
										bottom={referancesContent?.title}
									/>
								</div>

								<div className="text-soft flex flex-col gap-3 text-justify">
									<h5 className="text-[24px] font-bold text-green-100">{referancesContent?.greenTitle}</h5>
									<div className="flex text-yellow-400">
										<IoIosStar />
										<IoIosStar />
										<IoIosStar />
										<IoIosStar />
										<IoIosStar />
									</div>

									{referancesContent?.description?.map((text: string, index: number) => <p key={text + index}>{text}</p>)}
								</div>
							</div>

							<motion.div
								ref={ref}
								initial="initial"
								animate={isInView ? 'show' : 'initial'}
								variants={{
									initial: {
										opacity: 0,
									},
									show: {
										opacity: 1,
										transition: {duration: 1},
									},
								}}
								className="4xl:static absolute right-0 hidden w-5/12 justify-end md:flex 2xl:w-6/12">
								<img
									src={referancesImg}
									alt="Otel"
									className="4xl:rounded-full shadow-custom-4 h-[350px] w-[800px] rounded-l-full object-cover"
								/>
							</motion.div>
						</div>
					</div>
				</div>
			</div>
			<div className="bg-white-100 shadow-custom-6 relative max-w-full rotate-[-0deg] overflow-hidden py-5">
				<Slider
					{...settings}
					className="slick-outline m-auto max-w-[3000px]">
					{referancesSlider?.map((imgSrc: string, index: number) => {
						return (
							<div
								key={index}
								className="">
								<img
									key={index}
									src={imgSrc}
									alt="Referanslar"
									draggable={false}
									className="h-[60px] rounded-lg"
								/>
							</div>
						)
					})}
				</Slider>
			</div>
		</div>
	)
}

export default Referances
