import Wave from 'react-wavify'

const AnimatedWave = ({zIndex, color, speed}: {zIndex: number; color: string; speed: number}) => {
	return (
		<Wave
			className="wave"
			fill={color}
			paused={false}
			style={{display: 'flex', zIndex: zIndex}}
			options={{
				amplitude: 40,
				speed: speed,
				points: 5,
			}}
		/>
	)
}

export default AnimatedWave
