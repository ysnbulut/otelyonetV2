import {Tilt} from 'react-tilt'

const Card = ({img, title, desc, id}: {img: string; title: string; desc: string; id: string}) => {
	return (
		<Tilt
			options={{
				reverse: true,
				max: 25,
				perspective: 1000,
				scale: 1.08,
				speed: 1000,
				reset: true,
				transition: true,
			}}
			className="shadow-custom-2 relative mb-[75px] flex w-full flex-col items-start rounded-3xl border-blue-100/5 p-10 transition-all duration-200 ease-linear md:w-[48%]  lg:w-[31%]">
			<div className="absolute left-[40px] top-[-40px] flex w-full justify-start">
				<div className={`border-white-100 shadow-custom-3 flex h-[70px] w-[70px] items-center justify-center rounded-full border-2 bg-blue-100 p-3`}>
					<img
						src={img}
						alt="Özellik"
						className="h-[35px] w-[35px]"
					/>
				</div>
			</div>
			<h4 className="mb-4 mt-2 text-[22px] font-bold text-blue-300/90">{title}</h4>
			<div className={`mb-4 h-[3px] w-1/2 rounded-full bg-blue-100`}></div>
			<p>{desc}</p>
		</Tilt>
	)
}

export default Card
