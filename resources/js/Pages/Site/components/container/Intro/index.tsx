import AnimatedWave from '../../common/AnimatedWave'
import Button from '@/Components/Button'
import {motion} from 'framer-motion'

const Intro = ({
	introSlogan,
	introButton,
	introImg,
	isOpen,
}: {
	introSlogan: {regular: string[]; bold: string[]; description: string[]}
	introButton: {url: string; title: string}
	introImg: string
	isOpen: boolean
}) => {
	return (
		<section className={`flex justify-center bg-white ${isOpen ? 'pt-[4px]' : 'pt-[105px]'}`}>
			<AnimatedWave
				zIndex={10}
				color="rgba(30, 64, 175, 0.5)"
				speed={0.1}
			/>
			<AnimatedWave
				zIndex={9}
				color="rgba(30, 64, 175, 0.7)"
				speed={0.18}
			/>
			<AnimatedWave
				zIndex={8}
				color="rgba(30, 64, 175, 0.9)"
				speed={0.15}
			/>
			<div className="custom-container-1 relative z-10 flex max-h-[690px] justify-center md:justify-start">
				<motion.div
					initial="initial"
					animate="show"
					variants={{
						initial: {
							opacity: 0,
						},
						show: {
							opacity: 1,
							transition: {duration: 1.3},
						},
					}}
					className="flex h-full w-full flex-col items-center justify-center pt-8 text-center sm:pt-[80px] md:w-6/12 md:items-start md:pt-10 md:text-start">
					<h1 className="text-[30px] font-semibold leading-[40px] sm:text-[45px] sm:leading-[55px] lg:text-[55px] lg:leading-[65px]">
						{introSlogan?.regular?.map((text: string, index: number) => {
							return (
								<span
									key={text + index}
									className="text-white/90">
									{text}
									<br />
								</span>
							)
						})}

						{introSlogan?.bold?.map((text: string, index: number) => {
							return (
								<span
									key={text + index}
									className="font-extrabold text-darkmode-50">
									{text}
								</span>
							)
						})}
					</h1>

					{introSlogan?.description?.map((text: string, index: number) => {
						return (
							<p
								key={text + index}
								className="mt-6 !text-[18px] font-light text-white sm:text-[22px]">
								{text}
							</p>
						)
					})}

					<div className="mt-8 flex items-center gap-10">
						<Button
							as="a"
							href={introButton?.url}
							variant="dark"
							className="animation px-10 py-2 text-xl">
							<i className="animation" />
							{introButton?.title}
						</Button>
					</div>
				</motion.div>

				<motion.section
					initial="initial"
					animate="show"
					variants={{
						initial: {
							opacity: 0,
							x: 300,
						},
						show: {
							opacity: 1,
							x: 0,
							transition: {duration: 1.7},
						},
					}}
					className="absolute right-0 hidden w-5/12 justify-end md:flex lg:right-[-60px] lg:w-6/12">
					<img
						className="mt-[40px] h-[75vh] max-h-[690px]"
						src={introImg}
						alt="Product"
					/>
				</motion.section>
			</div>
		</section>
	)
}

export default Intro
