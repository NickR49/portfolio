<script context="module" lang="ts">
	import ExampleChart from '$lib/charts/ExampleChart.svelte';
	import DailyCovidChart from '$lib/charts/DailyCovidCases.svelte';
</script>

<svelte:head>
	<title>Charts</title>
</svelte:head>

<h1>Charts</h1>

<h2>Interesting Chart Candidates</h2>

<ul>
	<li>- Vaccinated vs unvaccinated hospitalisation rates</li>
	<li>- Daily covid cases</li>
	<li>- Hospitalisation across age ranges for a time period - vaxxed vs unvaxxed (Aust and NZ)</li>
</ul>

<h2>Data Sources</h2>

<ul>
	<li>
		- <a
			href="https://www.health.govt.nz/our-work/diseases-and-conditions/covid-19-novel-coronavirus/covid-19-data-and-statistics/covid-19-vaccine-data"
			>Vaccine Data</a
		>
	</li>
	<li>- Daily covid cases</li>
</ul>

<!-- <div class="chart">
	<ExampleChart />
</div> -->
<div class="chart">
	<DailyCovidChart />
</div>

<style>
	.chart {
		height: 250px;
	}
</style>
