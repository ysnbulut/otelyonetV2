import {motion, useInView} from 'framer-motion'
import {useRef} from 'react'

const SectionTitle = ({top, bottom, topStyle = '', bottomStyle = '', duration = 1}: {top: string; bottom: string; topStyle?: string; bottomStyle?: string; duration?: number}) => {
	const ref = useRef(null)
	const isInView = useInView(ref, {once: true})

	return (
		<motion.section
			ref={ref}
			initial="initial"
			animate={isInView ? 'show' : 'initial'}
			variants={{
				initial: {
					opacity: 0,
					y: -50,
				},
				show: {
					opacity: 1,
					y: 0,
					transition: {duration: duration},
				},
			}}
			className="w-full">
			<h3 className={`mb-4 text-[22px] font-semibold leading-[22px] text-blue-100 ${topStyle}`}>{top}</h3>
			<h2 className={`text-primary-100 mb-3 text-[45px] font-bold leading-[50px] ${bottomStyle}`}>{bottom}</h2>
		</motion.section>
	)
}

export default SectionTitle
