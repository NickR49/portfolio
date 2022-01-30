<script context="module" lang="ts">
	import * as Pancake from '@sveltejs/pancake';

	const points = [
		{ x: 0, y: 0 },
		{ x: 1, y: 1 },
		{ x: 2, y: 4 },
		{ x: 3, y: 9 },
		{ x: 4, y: 16 },
		{ x: 5, y: 25 },
		{ x: 6, y: 36 },
		{ x: 7, y: 49 },
		{ x: 8, y: 64 },
		{ x: 9, y: 81 },
		{ x: 10, y: 100 }
	];
	// https://api.stats.govt.nz/opendata/v1/Covid-19Indicators/Observations?$filter=ResourceID%20eq%20'CPCOV9'&$select=Period,Label1,Value&$orderby=Period,Label1
	interface Record {
		Period: string;
		Label1: string;
		Value: number;
	}
	const records = [
		{
			Period: '2022-01-20',
			Label1: 'Active',
			Value: 1037
		},
		{
			Period: '2022-01-20',
			Label1: 'Deceased',
			Value: 52
		},
		{
			Period: '2022-01-20',
			Label1: 'Recovered',
			Value: 14245
		},
		{
			Period: '2022-01-24',
			Label1: 'Active',
			Value: 1133
		},
		{
			Period: '2022-01-24',
			Label1: 'Deceased',
			Value: 52
		},
		{
			Period: '2022-01-24',
			Label1: 'Recovered',
			Value: 14440
		},
		{
			Period: '2022-01-26',
			Label1: 'Active',
			Value: 1190
		},
		{
			Period: '2022-01-26',
			Label1: 'Deceased',
			Value: 52
		},
		{
			Period: '2022-01-26',
			Label1: 'Recovered',
			Value: 14503
		},
		{
			Period: '2022-01-27',
			Label1: 'Active',
			Value: 1241
		},
		{
			Period: '2022-01-27',
			Label1: 'Deceased',
			Value: 52
		},
		{
			Period: '2022-01-27',
			Label1: 'Recovered',
			Value: 14549
		},
		{
			Period: '2022-01-28',
			Label1: 'Active',
			Value: 1320
		},
		{
			Period: '2022-01-28',
			Label1: 'Deceased',
			Value: 52
		},
		{
			Period: '2022-01-28',
			Label1: 'Recovered',
			Value: 14619
		},
		{
			Period: '2022-01-30',
			Label1: 'Active',
			Value: 1497
		},
		{
			Period: '2022-01-30',
			Label1: 'Deceased',
			Value: 52
		},
		{
			Period: '2022-01-30',
			Label1: 'Recovered',
			Value: 14737
		}
	];
	const millisInDay = 1000 * 60 * 60 * 24;
	function daysSinceEpoch(date: string) {
		return new Date(date).valueOf() / millisInDay;
	}
	const points2 = records
		.filter((record) => record.Label1 === 'Active')
		.map((record) => ({ x: daysSinceEpoch(record.Period), y: record.Value }));

	let x1 = points2[0].x;
	let x2 = points2[0].x;
	const y1 = 0;
	let y2 = 0;
	points2.forEach((point) => {
		if (point.x < x1) {
			x1 = point.x;
		}
		if (point.x > x2) {
			x2 = point.x;
		}
		if (point.y > y2) {
			y2 = point.y;
		}
	});

	function getDate(daysSinceEpoch: number) {
		const date = new Date(daysSinceEpoch * millisInDay);
		// return date.toLocaleDateString();
		return `${date.getDate()}/${date.getMonth() + 1}`;
	}
</script>

<!-- <p>x1: {x1}</p>
<p>x2: {x2}</p>
<p>y1: {y1}</p>
<p>y2: {y2}</p> -->

<div class="chart">
	<Pancake.Chart {x1} {x2} {y1} {y2}>
		<Pancake.Box {x1} {x2} {y2}>
			<div class="axes" />
		</Pancake.Box>

		<Pancake.Grid vertical count={10} let:value>
			<span class="x label">{getDate(value)}</span>
		</Pancake.Grid>

		<Pancake.Grid horizontal count={5} let:value>
			<span class="y label">{value}</span>
		</Pancake.Grid>

		<Pancake.Svg>
			<Pancake.SvgLine data={points2} let:d>
				<path class="data" {d} />
			</Pancake.SvgLine>
		</Pancake.Svg>
	</Pancake.Chart>
</div>

<style>
	.chart {
		height: 100%;
		padding: 3em 2em 2em 3em;
		box-sizing: border-box;
	}

	.axes {
		width: 100%;
		height: 100%;
		border-left: 1px solid black;
		border-bottom: 1px solid black;
	}

	.y.label {
		position: absolute;
		left: -2.5em;
		width: 2em;
		text-align: right;
		bottom: -0.5em;
	}

	.x.label {
		position: absolute;
		width: 4em;
		left: -2em;
		bottom: -22px;
		font-family: sans-serif;
		text-align: center;
	}

	path.data {
		stroke: red;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-width: 2px;
		fill: none;
	}
</style>
