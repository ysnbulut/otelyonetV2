import SectionTitle from '../../common/SectionTitle/index.js'
import Button from '../../common/Button/index.js'
import ServiceRow from './ServiceRow'
import {FaArrowRight} from '@react-icons/all-files/fa/FaArrowRight'
import {motion, useInView} from 'framer-motion'
import {useRef} from 'react'

const servicesData = [
	{
		title: 'API Hizmeti',
		desc: 'Otel yönetimi yazılımınızı diğer sistemler ve uygulamalarla sorunsuz bir şekilde entegre etmenizi sağlar.',
	},
	{
		title: 'Fatura Sistemi',
		desc: 'Otel hizmetleri için faturalandırma ve ödeme işlemlerini otomatikleştirir.',
	},
	{
		title: 'Geri Bildirim Sistemi',
		desc: 'Müşterilerinizden geri bildirim toplamanızı ve hizmet kalitenizi sürekli iyileştirmenizi sağlar.',
	},
	{
		title: 'Müşteri Yönetimi',
		desc: 'Otelinizin müşteri veritabanını yönetmek ve müşteri ilişkilerini geliştirmek için idealdir.',
	},
	{
		title: 'Rezervasyon Sistemi',
		desc: 'Otel odaları için online rezervasyon yapılmasını ve yönetilmesini kolaylaştırır.',
	},
]

const Services = ({
	servicesContent,
	servicesData,
	servicesImg,
	servicesButton,
	hash,
}: {
	servicesContent: {subtitle: string; title: string}
	servicesData: {title: string; description: string}[]
	servicesImg: string
	servicesButton: {url: string; title: string}
	hash: string
}) => {
	const ref = useRef(null)
	const isInView = useInView(ref, {once: true})

	return (
		<div
			id={hash}
			className="flex flex-col items-center bg-white py-[100px]">
			<div className="custom-container-1 flex justify-center">
				<div className="w-full text-center xl:text-start">
					<SectionTitle
						top={servicesContent?.subtitle}
						bottom={servicesContent?.title}
					/>
				</div>
			</div>
			<div className="custom-container-1 mt-[50px] flex items-center justify-between gap-10 xl:items-start">
				<div className="w-full xl:w-6/12">
					{servicesData.map(({title, description}: {title: string; description: string}, index: number) => {
						return (
							<ServiceRow
								key={index}
								isLast={servicesData.length - 1 === index}
								title={title}
								description={description}
								id={index + 1}
							/>
						)
					})}
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
					className="mt-[-50px] hidden w-5/12 xl:block">
					<img
						src={servicesImg}
						alt=""
					/>
				</motion.div>
			</div>

			<div className="custom-container-1 mt-[50px] flex w-full justify-center xl:justify-start">
				<Button
					url={servicesButton?.url}
					style="bg-purple-100 w-[290px]">
					{servicesButton?.title} <FaArrowRight />
				</Button>
			</div>
		</div>
	)
}

export default Services
