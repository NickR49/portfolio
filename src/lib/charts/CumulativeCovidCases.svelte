<script context="module" lang="ts">
	import * as Pancake from '@sveltejs/pancake';
</script>

<script type="ts">
	interface Point {
		x: number;
		y: number;
		label: 'Active' | 'Recovered' | 'Deceased';
	}
	export let points: Point[];

	let x1 = +Infinity;
	let x2 = -Infinity;
	let y1 = 0;
	let y2 = -Infinity;
	points.forEach((point) => {
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
	const activePoints = points.filter((point) => point.label === 'Active');
	const recoveredPoints = points.filter((point) => point.label === 'Recovered');
	const deceasedPoints = points.filter((point) => point.label === 'Deceased');
	const dayRange = x2 - x1;
	const millisInDay = 1000 * 60 * 60 * 24;
	function getDate(daysSinceEpoch: number) {
		const date = new Date(daysSinceEpoch * millisInDay);
		return `${date.getMonth() + 1}/${date.getFullYear() - 2000}`;
	}
</script>

<h2>NZ Covid Cases - cumulative</h2>
<div class="chart">
	<Pancake.Chart {x1} {x2} {y1} {y2}>
		<Pancake.Box {x1} {x2} {y2}>
			<div class="axes" />
		</Pancake.Box>

		<Pancake.Grid vertical count={dayRange / 90} let:value>
			<div class="grid-line vertical" />
			<span class="x label">{getDate(value)}</span>
		</Pancake.Grid>

		<Pancake.Grid horizontal count={6} let:value let:first>
			<div class="grid-line horizontal" class:first>
				<span class="y label">{value}</span>
			</div>
		</Pancake.Grid>

		<Pancake.Svg>
			<Pancake.SvgLine data={activePoints} let:d>
				<path class="data active" {d} />
			</Pancake.SvgLine>
			<Pancake.SvgLine data={recoveredPoints} let:d>
				<path class="data recovered" {d} />
			</Pancake.SvgLine>
			<Pancake.SvgLine data={deceasedPoints} let:d>
				<path class="data deceased" {d} />
			</Pancake.SvgLine>
		</Pancake.Svg>

		<Pancake.Quadtree data={points} x={(d) => d.x} y={(d) => d.y} let:closest>
			{#if closest}
				<Pancake.Point x={closest.x} y={closest.y}>
					<span class="annotation-point" />
					<div
						class="annotation"
						style="transform: translate(-{100 * ((closest.x - x1) / (x2 - x1))}%,0)"
					>
						<strong>{getDate(closest.x)}</strong>
						<span>{closest.y} {closest.label} cases</span>
					</div>
				</Pancake.Point>
			{/if}
		</Pancake.Quadtree>
	</Pancake.Chart>
</div>

<style>
	h2 {
		text-align: center;
	}
	.chart {
		height: 400px;
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
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-width: 2px;
		fill: none;
	}

	path.active {
		stroke: rgb(167, 113, 12);
	}
	path.recovered {
		stroke: rgb(56, 172, 91);
	}
	path.deceased {
		stroke: rgb(179, 11, 11);
	}

	.annotation {
		position: absolute;
		white-space: nowrap;
		bottom: 1em;
		line-height: 1.2;
		background-color: rgba(255, 255, 255, 0.9);
		padding: 0.2em 0.4em;
		border-radius: 2px;
	}

	.annotation-point {
		position: absolute;
		width: 10px;
		height: 10px;
		background-color: #ff3e00;
		border-radius: 50%;
		transform: translate(-50%, -50%);
	}

	.annotation strong {
		display: block;
		font-size: 20px;
		text-align: center;
	}

	.annotation span {
		display: block;
		font-size: 14px;
	}

	.grid-line {
		position: relative;
		display: block;
	}

	.grid-line.horizontal {
		width: calc(100% + 2em);
		left: -2em;
		border-bottom: 1px dashed #ccc;
	}

	.grid-line.vertical {
		height: 100%;
		border-left: 1px dashed #ccc;
	}

	.grid-line.first {
		border-bottom: 1px solid #333;
	}

	.grid-line span {
		position: absolute;
		left: 0;
		bottom: 2px;
		font-family: sans-serif;
		font-size: 14px;
		color: #999;
	}
</style>
