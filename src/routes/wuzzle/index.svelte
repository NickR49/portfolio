<script type="ts">
	import Keyboard from 'svelte-keyboard';
	import CurrentRow from '$lib/wuzzle/CurrentRow.svelte';
	import PlayedRow from '$lib/wuzzle/PlayedRow.svelte';
	import { nonSolutions } from '$lib/wuzzle/nonSolutions';
	import { solutions } from '$lib/wuzzle/solutions';

	export const dictionary = [...nonSolutions, ...solutions];

	const word = 'MOIST';
	const guesses: string[] = ['ROAST', 'TAROT'];
	const currentGuess = ['', '', '', '', ''];
	let guessPosition = 0;

	function handleKeydown(event: any) {
		// Only show the last pressed letter
		console.log(event.detail);
		switch (event.detail) {
			case 'Backspace':
				guessPosition--;
				currentGuess[guessPosition] = '';
				break;
			case 'Enter':
				if (guessPosition === 5) {
					const guessWord = currentGuess.join('').toLowerCase();

					if (dictionary.includes(guessWord)) {
						alert('Word is in dictionary');
					} else {
						alert(`'${guessWord}' is not a valid word`);
					}
				}
				break;
			default:
				if (guessPosition < 5) {
					currentGuess[guessPosition] = event.detail;
					guessPosition++;
				}
		}
	}
</script>

<svelte:head>
	<title>Wuzzle</title>
</svelte:head>

<h1>Wuzzle</h1>

<br /><br />

<div class="board">
	{#each guesses as guess}
		<PlayedRow {guess} {word} />
	{/each}

	<!-- <CurrentRow {word} /> -->

	<div class="row">
		{#each currentGuess as letter, index}
			<div class="letter">{letter}</div>
		{/each}
	</div>
</div>

<br /><br />

<Keyboard
	layout="wordle"
	on:keydown={handleKeydown}
	--text-transform="uppercase"
	--background="darkgrey"
	noSwap={['Enter']}
/>

<style>
	.board {
		display: flex;
		align-items: center;
		flex-direction: column;
		inset: 50%;
		row-gap: var(--letter-gap);
	}
	.row {
		display: flex;
		flex-direction: row;
		column-gap: var(--letter-gap);
	}
	.letter {
		font-size: xx-large;
		font-weight: 700;
		text-transform: uppercase;
		color: white;
		border-style: solid;
		border-width: 2px;
		border-color: grey;
		background-color: rgb(209, 209, 209);
		width: 50px;
		height: 50px;
		text-align: center;
	}
</style>
