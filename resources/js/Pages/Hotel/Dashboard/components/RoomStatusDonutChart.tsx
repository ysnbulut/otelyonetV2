import Chart from '@/Components/Chart'
import {ChartData, ChartOptions} from 'chart.js/auto'
import {getColor} from '@/utils/colors'
import {selectColorScheme} from '@/stores/colorSchemeSlice'
import {selectDarkMode} from '@/stores/darkModeSlice'
import {useAppSelector} from '@/stores/hooks'
import {useMemo} from 'react'

interface MainProps extends React.ComponentPropsWithoutRef<'canvas'> {
	width?: number
	height: number
	dataSet: Array<string>
}

function Main(props: MainProps) {
	const colorScheme = useAppSelector(selectColorScheme)
	const darkMode = useAppSelector(selectDarkMode)

	const dataSet = props.dataSet.map((item) => parseFloat(item.replace('%', '')))
	const chartColors = () => [
		getColor('pending', 0.9),
		getColor('secondary', 0.9),
		getColor('pending', 0.9),
		getColor('danger', 0.9),
	]
	const data: ChartData = useMemo(() => {
		return {
			labels: ['Dolu', 'Boş', 'Kirli', 'Kapalı'],
			datasets: [
				{
					data: dataSet,
					backgroundColor: colorScheme ? chartColors() : '',
					hoverBackgroundColor: colorScheme ? chartColors() : '',
					borderWidth: 5,
					borderColor: darkMode ? getColor('darkmode.700') : getColor('white'),
				},
			],
		}
	}, [colorScheme, darkMode, dataSet])

	const options: ChartOptions = useMemo(() => {
		return {
			maintainAspectRatio: false,
			plugins: {
				legend: {
					display: false,
				},
			},
			cutout: '80%',
		}
	}, [])

	return (
		<Chart
			type="doughnut"
			width={props.width}
			height={props.height}
			data={data}
			options={options}
			className={props.className}
		/>
	)
}

Main.defaultProps = {
	width: 'auto',
	height: 'auto',
	className: '',
}

export default Main
