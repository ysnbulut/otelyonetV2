import Chart from "@/Components/Chart";
import { ChartData, ChartOptions } from "chart.js/auto";
import { getColor } from "@/utils/colors";
import { selectColorScheme } from "@/stores/colorSchemeSlice";
import { selectDarkMode } from "@/stores/darkModeSlice";
import { useAppSelector } from "@/stores/hooks";
import { useMemo } from "react";

interface MainProps extends React.ComponentPropsWithoutRef<"canvas"> {
	width?: number;
	height: number;
	dataSet: Array<number>;
	max_room: number;
}

function Main(props: MainProps) {
	const colorScheme = useAppSelector(selectColorScheme);
	const darkMode = useAppSelector(selectDarkMode);
	const dataSet = props.dataSet;

	const data: ChartData = useMemo(() => {
		return {
			labels: [
				"Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"
			],
			datasets: [
				{
					label: "Dolu Oda",
					data: props.dataSet,
					borderWidth: 0,
					borderColor: 'transparent',
					backgroundColor: [
						'#293462',
						'#0CECDD',
						'#FF5403',
						'#5D3891',
						'#F7C04A',
						'#083AA9',
						'#00FFAB',
					],
					pointBorderColor: "transparent",
					tension: 0.5,
				},
			],
		};
	}, [props.dataSet]);

	const options: ChartOptions = useMemo(() => {
		return {
			maintainAspectRatio: false,
			plugins: {
				legend: {
					display: false,
				},
			},
			scales: {
				x: {
					ticks: {
						font: {
							size: 12,
						},
						color: getColor("slate.500", 0.8),
					},
					grid: {
						display: true,
						drawBorder: true,
					},
				},
				y: {
					ticks: {
						font: {
							size: 12,
						},
						color: getColor("slate.500", 0.8),
						callback: function (value) {
							return value;
						},
					},
					grid: {
						color: darkMode
							? getColor("slate.500", 0.3)
							: getColor("slate.300"),
						borderDash: [2, 2],
						drawBorder: false,
					},
					max_room: props.max_room,
				},
			},
		};
	}, [darkMode, props.max_room]);

	return (
		<Chart
			type="bar"
			width={props.width}
			height={props.height}
			data={data}
			options={options}
			className={props.className}
		/>
	);
}

Main.defaultProps = {
	width: "auto",
	height: "auto",
	lineColor: "",
	className: "",
};

export default Main;
