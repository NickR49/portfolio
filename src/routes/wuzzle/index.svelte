<script type="ts">
	import Keyboard from 'svelte-keyboard';
	import CurrentRow from '$lib/wuzzle/CurrentRow.svelte';
	import PlayedRow from '$lib/wuzzle/PlayedRow.svelte';
	import { nonSolutions } from '$lib/wuzzle/nonSolutions';
	import { solutions } from '$lib/wuzzle/solutions';
	import BlankRow from '$lib/wuzzle/BlankRow.svelte';

	export const dictionary = [...nonSolutions, ...solutions];

	const word = 'moist';

	// Guesses
	const guesses: string[] = [];
	let guessIndex = 0;

	// Current guess
	const currentGuess = ['', '', '', '', ''];
	let guessLetterIndex = 0;

	$: previousGuesses = guesses.slice(0, guessIndex);

	function handleKeydown(event: any) {
		// Only show the last pressed letter
		console.log(event.detail);
		switch (event.detail) {
			case 'Backspace':
				if (guessLetterIndex > 0) {
					guessLetterIndex--;
					currentGuess[guessLetterIndex] = '';
				}
				break;
			case 'Enter':
				if (guessLetterIndex === 5) {
					const guessWord = currentGuess.join('').toLowerCase();
					if (dictionary.includes(guessWord)) {
						// alert(`${guessWord} is in dictionary`);
						guesses[guessIndex] = guessWord;
						guessIndex++;
						guessLetterIndex = 0;
						for (let i = 0; i < 5; i++) {
							currentGuess[i] = '';
						}
					} else {
						alert(`'${guessWord}' is not a valid word`);
					}
				}
				break;
			default:
				if (guessLetterIndex < 5) {
					currentGuess[guessLetterIndex] = event.detail;
					guessLetterIndex++;
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
	{#each previousGuesses as guess}
		<PlayedRow {guess} {word} />
	{/each}

	<!-- <CurrentRow {word} /> -->

	<div class="row">
		{#each currentGuess as letter, index}
			<div class="box letter">{letter}</div>
		{/each}
	</div>

	{#each Array(5 - guessIndex) as _}
		<BlankRow />
	{/each}
</div>

<br /><br />

<!-- <p>Guess index: {guessIndex}</p>
<p>Guess letter index: {guessLetterIndex}</p>
<p>Current guess: {currentGuess.join()}</p>
<p>Previous guesses: {JSON.stringify(previousGuesses)}</p> -->

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
	.box {
		border-style: solid;
		border-width: 2px;
		border-color: grey;
		background-color: #d7d7d7;
		width: 50px;
		height: 50px;
	}
	.letter {
		font-size: xx-large;
		font-weight: 700;
		text-transform: uppercase;
		color: white;
		text-align: center;
	}
</style>
