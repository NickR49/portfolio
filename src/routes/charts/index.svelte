<script context="module" lang="ts">
	import Chart from '$lib/Chart.svelte';
	import Chart2 from '$lib/Chart2.svx';
</script>

<svelte:head>
	<title>Charts</title>
</svelte:head>

<Chart2 />

<div class="chart">
	<Chart />
</div>

<style>
	.chart {
		height: 250px;
	}
</style>
