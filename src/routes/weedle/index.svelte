<script type="ts">
	import Keyboard from 'svelte-keyboard';
	import CurrentRow from '$lib/weedle/CurrentRow.svelte';
	import PlayedRow from '$lib/weedle/PlayedRow.svelte';

	const word = 'MOIST';
	const guesses: string[] = ['ROAST', 'TAROT'];
</script>

<svelte:head>
	<title>Weedle</title>
</svelte:head>

<h1>Weedle</h1>

<br /><br />

<div class="board">
	{#each guesses as guess}
		<PlayedRow {guess} {word} />
	{/each}

	<CurrentRow {word} />
</div>

<br /><br />

<Keyboard layout="wordle" />

<style>
	.board {
		display: flex;
		align-items: center;
		flex-direction: column;
		inset: 50%;
		row-gap: 10px;
	}
</style>
