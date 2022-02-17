<script context="module" lang="ts">
	import ExampleChart from '$lib/charts/ExampleChart.svelte';
	import CumulativeCovidCasesLineChart from '$lib/charts/pancake/CumulativeCovidCasesLineChart.svelte';
	import CumulativeCovidCasesBarChart from '$lib/charts/pancake/CumulativeCovidCasesBarChart.svelte';
	import Chart from '$lib/charts/layercake/Chart.svelte';

	export interface DateRecord {
		date: string;
		deceased: number;
		recovered: number;
		active: number;
	}

	/** @type {import('@sveltejs/kit').Load} */
	export async function load({ fetch }) {
		const url = `/charts/data.json`;
		const res = await fetch(url);
		if (res.ok) {
			return {
				props: {
					chartData: await res.json()
				}
			};
		}
		return {
			status: res.status,
			error: new Error(`Could not load ${url}`)
		};
	}
</script>

<script type="ts">
	interface Record {
		Period: string;
		Label1: 'Active' | 'Recovered' | 'Deceased';
		Value: number;
	}
	interface Response {
		'@odata.context': string;
		value: Record[];
	}
	export let chartData: Response;

	const millisInDay = 1000 * 60 * 60 * 24;
	function daysSinceEpoch(date: string) {
		return new Date(date).valueOf() / millisInDay;
	}

	// Pancake data
	interface Point {
		x: number;
		y: number;
		label: 'Active' | 'Recovered' | 'Deceased';
	}
	const points: Point[] = chartData.value.map((record) => ({
		x: daysSinceEpoch(record.Period),
		y: record.Value,
		label: record.Label1
	}));

	// Layercake data
	type DateRecords = { [date: string]: DateRecord };
	const dataObject: DateRecords = {};
	chartData.value.forEach((entry) => {
		const currentEntry =
			dataObject[entry.Period] ??
			(dataObject[entry.Period] = { date: entry.Period, deceased: 0, recovered: 0, active: 0 });
		switch (entry.Label1) {
			case 'Active':
				currentEntry.active = entry.Value;
				break;
			case 'Recovered':
				currentEntry.recovered = entry.Value;
				break;
			case 'Deceased':
				currentEntry.deceased = entry.Value;
				break;
		}
	});
	// console.log(`dataObject: `, dataObject);
	const data: DateRecord[] = Object.values(dataObject);
	// console.log(`slice: `, JSON.stringify(data.slice(0, 12)));
</script>

<svelte:head>
	<title>Charts</title>
</svelte:head>

<h1>Charts</h1>

<h2>Interesting Chart Candidates</h2>

<ul>
	<li>- Daily covid cases</li>
	<li>
		- Hospitalisation for age ranges - vaxxed vs unvaxxed (<a
			href="https://www.theguardian.com/news/datablog/ng-interactive/2022/jan/28/the-simple-numbers-every-government-should-use-to-fight-anti-vaccine-misinformation"
			>NSW</a
		> example)
	</li>
</ul>

<br /><br />

<!-- <ExampleChart /> -->
<!-- <CumulativeCovidCasesLineChart {points} /> -->
<!-- <CumulativeCovidCasesBarChart {points} /> -->
<div class="chart">
	<Chart data={data.slice(500, 600)} />
</div>

<br />

<h2>Data Sources</h2>

<!-- ## Data Sources -->

<!-- *Markdown* __markdown__ -->

<ul>
	<li>
		- <a
			href="https://www.health.govt.nz/our-work/diseases-and-conditions/covid-19-novel-coronavirus/covid-19-data-and-statistics/covid-19-vaccine-data"
			>MOH Vaccine Data</a
		>
	</li>
	<li>- <a href="https://api.stats.govt.nz/">Stats NZ</a></li>
	<li>
		- <a href="https://github.com/ESR-NZ/NZ_COVID19_Data/"
			>COVID-19 Data Repository by the Institute of Environmental Science and Research</a
		>
	</li>
</ul>

<style>
	.chart {
		height: 400px;
	}
</style>
