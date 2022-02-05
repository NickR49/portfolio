<script type="ts">
	import Keyboard from 'svelte-keyboard';
	import CurrentRow from '$lib/wuzzle/CurrentRow.svelte';
	import PlayedRow from '$lib/wuzzle/PlayedRow.svelte';
	import { nonSolutions } from '$lib/wuzzle/nonSolutions';
	import { solutions } from '$lib/wuzzle/solutions';
	import BlankRow from '$lib/wuzzle/BlankRow.svelte';
	import Modal from '$lib/common/Modal.svelte';

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
						// alert(`${guessWord} is in dictionary`);
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
			`Well, perhaps on planet Xenorff . . . `,
			`Hmmmmm, where art thou '${guessWord}'?`,
			`This ain't urban dictionary buddy`,
			`Yeah nah mate!`,
			`Perhaps another game might suit you better?`,
			`Tiddly winks perhaps?`,
			`I believe there's a Klingon version somewhere else . . .`
		];
		remarkIndex = (remarkIndex + 1) % remark.length;
		return remark[remarkIndex];
	}

	function userRating() {
		const scale = [
			'Genius',
			'Amazing',
			'Well done',
			'Not bad',
			'Good effort',
			`Barely adequate I'm afraid`
		];
		return scale[guessIndex - 1];
	}

	let showInvalidWordModal = false;
	let showWonModal = false;
	let showLostModal = false;
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

	<!-- <CurrentRow {word} /> -->
	{#if guessIndex < 6}
		{#if gameState === 'PLAYING'}
			<div class="row">
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
</style>
