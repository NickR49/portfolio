<script type="ts">
	import Keyboard from 'svelte-keyboard';
	import CurrentRow from '$lib/wuzzle/CurrentRow.svelte';
	import PlayedRow from '$lib/wuzzle/PlayedRow.svelte';
	import { nonSolutions } from '$lib/wuzzle/nonSolutions';
	import { solutions } from '$lib/wuzzle/solutions';
	import BlankRow from '$lib/wuzzle/BlankRow.svelte';

	export const dictionary = [...nonSolutions, ...solutions];

	function daysDiff(date1: Date, date2: Date): number {
		const millisInDay = 1000 * 60 * 60 * 24;
		const date1DaysFromEpoch = Math.floor(date1.valueOf() / millisInDay);
		const date2DaysFromEpoch = Math.floor(date2.valueOf() / millisInDay);
		return date2DaysFromEpoch - date1DaysFromEpoch;
	}

	// Look up the word of the day
	const solutionIndex = daysDiff(new Date('2021-06-20'), new Date());
	const word = solutions[solutionIndex];

	// Guesses
	const guesses: string[] = [];
	let guessIndex = 0;
	$: previousGuesses = guesses.slice(0, guessIndex);

	// Current guess
	const currentGuess = ['', '', '', '', ''];
	let guessLetterIndex = 0;

	function handleKeydown(event: any) {
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
						guessLetterIndex = 0;
						for (let i = 0; i < 5; i++) {
							currentGuess[i] = '';
						}
						guessIndex++;
						if (guessIndex === 6) {
							alert('YOU LOSE!!!');
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

<br />

<div class="board">
	{#each previousGuesses as guess}
		<PlayedRow {guess} {word} />
	{/each}

	<!-- <CurrentRow {word} /> -->
	{#if guessIndex < 6}
		<div class="row">
			{#each currentGuess as letter, index}
				<div class="box letter">{letter}</div>
			{/each}
		</div>

		{#each Array(5 - guessIndex) as _}
			<BlankRow />
		{/each}
	{/if}
</div>

<br />

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