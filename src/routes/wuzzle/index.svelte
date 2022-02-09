<script type="ts">
	import Keyboard from 'svelte-keyboard';
	import PlayedRow from '$lib/wuzzle/PlayedRow.svelte';
	import { nonSolutions } from '$lib/wuzzle/nonSolutions';
	import { solutions } from '$lib/wuzzle/solutions';
	import BlankRow from '$lib/wuzzle/BlankRow.svelte';
	import Modal from '$lib/common/Modal.svelte';
	import { daysBetween } from '$lib/utils/dateUtils';
	import { playedLettersStore } from '$lib/wuzzle/wuzzleStore';
	import { onMount } from 'svelte';

	export const dictionary = [...nonSolutions, ...solutions];

	// Look up the word of the day
	const solutionIndex = daysBetween(new Date('2021-06-19'), new Date());
	const word = solutions[solutionIndex];

	// console.log(`solutionIndex: `, solutionIndex);
	// console.log(`word: `, word);

	let gameState: 'PLAYING' | 'WON' | 'LOST' = 'PLAYING';

	// Guesses
	const guesses: string[] = [];
	let guessIndex = 0;
	$: previousGuesses = guesses.slice(0, guessIndex);

	// Current guess
	const currentGuess = ['', '', '', '', ''];
	let guessLetterIndex = 0;

	function handleKeydown(key: string) {
		switch (key) {
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
						guesses[guessIndex] = guessWord;
						guessLetterIndex = 0;
						for (let i = 0; i < 5; i++) {
							currentGuess[i] = '';
						}
						guessIndex++;
						if (guessWord === word) {
							gameState = 'WON';
							showWonModal = true;
						} else {
							if (guessIndex === 6) {
								gameState = 'LOST';
								showLostModal = true;
							}
						}
					} else {
						showInvalidWordModal = true;
					}
				}
				break;
			default:
				if (/^[a-zA-Z]$/.test(key) && guessLetterIndex < 5) {
					currentGuess[guessLetterIndex] = key.toLowerCase();
					guessLetterIndex++;
				}
		}
	}

	function handleWindowKeydown(event: KeyboardEvent) {
		event.preventDefault();
		handleKeydown(event.key);
	}

	function handleKeyboardKeydown(event: any) {
		handleKeydown(event.detail);
	}

	let remarkIndex = -1;
	function wittism() {
		const guessWord = currentGuess.join('').toLowerCase();
		const remark = [
			`That word doesn't appear to be in the dictionary`,
			`No, not that one either`,
			`Nice try, perhaps next time . . .`,
			`Nope, not even close`,
			`Hmmmmm, where art thou '${guessWord}'?`,
			`This ain't urban dictionary buddy`,
			`Yeah nah . . .`,
			`Perhaps another game might suit you better?`,
			`Tiddly winks perhaps?`,
			`This is not the Klingon version!`
		];
		remarkIndex = (remarkIndex + 1) % remark.length;
		return remark[remarkIndex];
	}

	function userRating() {
		const scale = ['Genius', 'Amazing', 'Well done', 'Not bad', 'Good effort', `Points for trying`];
		return scale[guessIndex - 1];
	}

	let showInvalidWordModal = false;
	let showWonModal = false;
	let showLostModal = false;

	onMount(() => {
		playedLettersStore.set({});
	});
</script>

<svelte:head>
	<title>Wuzzle</title>
</svelte:head>

<svelte:window on:keydown={handleWindowKeydown} />

<h1>Wuzzle</h1>

<br />

<div class="board">
	{#each previousGuesses as guess}
		<PlayedRow {guess} {word} />
	{/each}

	{#if guessIndex < 6}
		{#if gameState === 'PLAYING'}
			<div class="row">
				<!-- <CurrentRow {word} /> -->
				{#each currentGuess as letter, index}
					<div class="box letter">{letter}</div>
				{/each}
			</div>
		{/if}

		{#if gameState === 'WON' && guessIndex < 6}
			<BlankRow />
		{/if}

		{#each Array(5 - guessIndex) as _}
			<BlankRow />
		{/each}
	{/if}
</div>

<br /><br />

<!-- <p>Guess index: {guessIndex}</p>
<p>Guess letter index: {guessLetterIndex}</p>
<p>Current guess: {currentGuess.join()}</p>
<p>Previous guesses: {JSON.stringify(previousGuesses)}</p>
<p>Show won modal: {showWonModal}</p>
<p>Show lost modal: {showLostModal}</p> -->

<Keyboard
	layout="wordle"
	on:keydown={handleKeyboardKeydown}
	--text-transform="uppercase"
	--background="darkgrey"
	noSwap={['Enter']}
	custom=""
	keyClass={$playedLettersStore}
/>

{#if showInvalidWordModal}
	<Modal on:close={() => (showInvalidWordModal = false)}>
		<h2 slot="header">{wittism()}</h2>
	</Modal>
{/if}
{#if showWonModal}
	<Modal on:close={() => (showWonModal = false)}>
		<h1>
			{userRating()}
		</h1>
		<h2 slot="header">
			You won in {guessIndex} move{guessIndex === 1 ? '' : 's'}
			{#each Array(6 - guessIndex) as _}
				!
			{/each}
		</h2>
	</Modal>
{/if}
{#if showLostModal}
	<Modal on:close={() => (showLostModal = false)}>
		<h2 slot="header">I'm dreadfully sorry but it appears that you have lost!!!</h2>
	</Modal>
{/if}

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

	:global(.key.correct) {
		background-color: var(--correct-color);
		/* color: pink; */
	}
	:global(.key.present) {
		background-color: var(--present-color);
		/* color: pink; */
	}
	:global(.key.absent) {
		background-color: var(--absent-color);
		/* color: pink; */
	}
</style>
