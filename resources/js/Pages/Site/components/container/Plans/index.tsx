import {FiPlus} from '@react-icons/all-files/fi/FiPlus'
import {IoMdCheckmark} from '@react-icons/all-files/io/IoMdCheckmark'
import SectionTitle from '../../common/SectionTitle/index.js'
import Button from '../../common/Button/index.js'
import {motion, useInView} from 'framer-motion'
import {useRef} from 'react'

const Plans = ({
	hash,
	planContent,
	planImg,
	planData,
}: {
	hash: string
	planContent: {subtitle: string; title: string}
	planImg: string
	planData: {
		title: string
		subtitle: string
		tag: string
		price: string
		curr: string
		period: string
		basicFeatures: string[]
		extraFeatures: string[]
		button: {url: string; title: string}
	}
}) => {
	const ref = useRef(null)
	const isInView = useInView(ref, {once: true})

	const {title, subtitle, tag, price, curr, period, basicFeatures, extraFeatures, button} = planData

	return (
		<section
			id={hash}
			className="relative flex w-full justify-center bg-slate-100/90 py-[100px]">
			<div className="custom-container-1 relative">
				<div className="text-center lg:text-start">
					<SectionTitle
						top={planContent?.subtitle}
						bottom={planContent?.title}
					/>
				</div>

				<div className="mt-24 flex w-full items-center justify-center lg:mt-0">
					<div className="flex w-full justify-center lg:justify-between">
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
							className="hidden w-7/12 items-center lg:flex">
							<img
								src={planImg}
								alt={planContent?.subtitle}
								className="w-full"
							/>
						</motion.div>

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
							className="shadow-custom-2 bg-white-100 mt-[0px] w-full rounded-md text-purple-100 sm:w-8/12 lg:w-4/12 lg:max-w-[400px]">
							<div className="border-b-black-100/05 relative flex flex-col items-center border-b py-6 lg:items-end">
								<div className="bg-white-100 shadow-custom-2 absolute top-[-60px] z-[-999] flex w-full items-center justify-center rounded-md px-6 pb-8 pt-3 sm:mr-6 sm:w-fit">
									<p className="flex items-center gap-1">
										<span className="text-[40px] font-bold leading-[40px] text-blue-100/80">{price}</span>
										<span className="text-black-100/80 text-[30px] font-light leading-[30px]">{curr}</span>
									</p>
									<span className="text-grey-300/50 text-[20px]">/{period}</span>
								</div>

								<div className="flex w-full flex-col gap-2 px-6">
									<div className="flex w-full items-center justify-between gap-5">
										<h5 className=" text-black-100 text-[24px] font-bold">{title}</h5>
										<span className="rounded-full bg-blue-100/10 px-4 py-1 text-[14px] font-medium text-blue-100">{tag}</span>
									</div>
									<p className="text-grey-300/70">{subtitle}</p>
								</div>
							</div>

							<div>
								<ul className="flex flex-col gap-2 px-6 py-6 text-blue-100">
									{basicFeatures?.map((title: string, index: number) => {
										return (
											<li
												key={index}
												className="flex items-center gap-2">
												<span className="text-[20px]">
													<IoMdCheckmark />
												</span>
												<span className="text-primary-100/90">{title}</span>
											</li>
										)
									})}
								</ul>

								<div className="h-[1px] w-full bg-purple-100/10"></div>

								<ul className="flex flex-col gap-2 px-6 py-6 text-green-100">
									{extraFeatures?.map((title: string, index: number) => {
										return (
											<li
												key={index}
												className="flex items-center gap-2">
												<span className="text-[20px]">
													<FiPlus />
												</span>
												<span className="text-primary-100/90">{title}</span>
											</li>
										)
									})}
								</ul>

								<div className="h-[1px] w-full bg-purple-100/10"></div>

								<div className="px-6 py-6">
									<Button
										url={button?.url}
										style="bg-purple-100 !w-full">
										{button?.title}
									</Button>
								</div>
							</div>
						</motion.div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default Plans
