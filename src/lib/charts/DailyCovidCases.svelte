<script context="module" lang="ts">
	import * as Pancake from '@sveltejs/pancake';
</script>

<script type="ts">
	export let points;

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
	const millisInDay = 1000 * 60 * 60 * 24;
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

<!-- <p>
	closest: {closest ? `${closest.x}, ${closest.y}` : 'N/A'}
</p> -->

<h2>NZ Covid Cases</h2>
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
			<Pancake.SvgLine data={points} let:d>
				<path class="data" {d} />
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
						<span>{closest.y} active cases</span>
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
		stroke: red;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-width: 2px;
		fill: none;
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
</style>
