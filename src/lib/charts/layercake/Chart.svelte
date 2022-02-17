<script type="ts">
	import { LayerCake, ScaledSvg, Html, flatten, uniques } from 'layercake';
	import { stack } from 'd3-shape';
	import { scaleBand, scaleOrdinal } from 'd3-scale';
	import { format, precisionFixed } from 'd3-format';
	import { csvParse } from 'd3-dsv';

	import ColumnStacked from './ColumnStacked.svelte';
	import AxisX from './AxisX.svelte';
	import AxisY from './AxisY.svelte';
	import { fruitOrdinalData } from './fruitOrdinal';
	import type { DateRecord } from 'src/routes/charts/index.svelte';

	// const data = csvParse(fruitOrdinalData);

	export let data: DateRecord[];
	console.log(`data: `, data);

	const xKey = 'date';
	const yKey = [0, 1];
	const zKey = 'key';

	// ['deceased', 'recovered', 'active']
	const seriesNames = Object.keys(data[0]).filter((d) => d !== xKey);
	console.log(`seriesNames: `, seriesNames);
	const seriesColors = ['black', 'green', 'orange'];

	data.forEach((d) => {
		seriesNames.forEach((name) => {
			d[name] = +d[name];
		});
	});

	console.log(`uniques: `, uniques(data, xKey));

	const stackData = stack().keys(seriesNames);

	const series = stackData(data);

	const formatTickX = (d: string) => (d.endsWith('-01') ? d : '');
	const formatTickY = (d) => format(`.${precisionFixed(d)}s`)(d);
</script>

<div class="chart-container">
	<LayerCake
		ssr={true}
		percentRange={true}
		padding={{ top: 0, right: 0, bottom: 20, left: 20 }}
		x={(d) => d.data[xKey]}
		y={yKey}
		z={zKey}
		xScale={scaleBand().paddingInner([0.02]).round(true)}
		xDomain={uniques(data, xKey)}
		zScale={scaleOrdinal()}
		zDomain={seriesNames}
		zRange={seriesColors}
		flatData={flatten(series)}
		data={series}
	>
		<Html>
			<AxisX gridlines={false} formatTick={formatTickX} />
			<AxisY ticks={4} gridlines={false} formatTick={formatTickY} />
		</Html>
		<ScaledSvg>
			<ColumnStacked />
		</ScaledSvg>
	</LayerCake>
</div>

<style>
	/*
    The wrapper div needs to have an explicit width and height in CSS.
    It can also be a flexbox child or CSS grid element.
    The point being it needs dimensions since the <LayerCake> element will
    expand to fill it.
  */
	.chart-container {
		width: 100%;
		height: 100%;
	}
</style>
