<script type="ts">
	import { LetterState, playedLettersStore } from './wuzzleStore';

	export let word: string;
	export let guess: string;

	interface Letter {
		letter: string;
		occurrencesInWord: number;
		directMatches: number;
	}
	const letterDetails: Letter[] = [];

	function onlyUnique(value, index, self) {
		return self.indexOf(value) === index;
	}

	function storeLetterState(letter: string, state: LetterState) {
		// console.log(`storeLetterState - letter: ${letter}, state: ${state}`);
		// Check the existing state of the letter
		const currentState = $playedLettersStore[letter];
		let update = false;
		if (currentState === 'correct') {
			// do nothing
		} else if (currentState === 'present' && state === 'correct') {
			update = true;
		} else if (currentState === 'absent' && ['present', 'correct'].includes(state)) {
			update = true;
		} else if (!currentState) {
			update = true;
		}

		if (update) {
			playedLettersStore.update((playedLetters) => {
				// console.log(`playedLettersStore: `, { ...playedLetters, letter: state });
				return { ...playedLetters, [letter]: state };
			});
		}
	}

	// Analysis attempt
	const uniqueLetters = guess.split('').filter(onlyUnique);
	uniqueLetters.forEach((letter) => {
		const occurrencesInWord = word.split('').filter((l) => l === letter).length;
		const directMatches = word.split('').filter((wordLetter, index) => {
			if (wordLetter === letter && guess.slice(index, index + 1) === letter) {
				return true;
			}
			return false;
		}).length;
		letterDetails.push({
			letter,
			occurrencesInWord,
			directMatches
		});
	});

	function getLetterState(index: number): 'correct' | 'present' | 'absent' {
		const guessLetter = guess.slice(index, index + 1);
		let letterState: LetterState;
		// If it's a direct match then return correct
		if (word.slice(index, index + 1) === guessLetter) {
			letterState = 'correct';
		}
		// If the letter is elsewhere in the word then check if it's already a direct match
		else if (word.indexOf(guessLetter) > -1) {
			if (letterDetails[index]?.directMatches === letterDetails[index]?.occurrencesInWord) {
				letterState = 'absent';
			} else {
				letterState = 'present';
			}
		} else {
			letterState = 'absent';
		}
		storeLetterState(guessLetter, letterState);
		return letterState;
	}
</script>

<div class="row">
	{#each guess.split('') as guessLetter, index}
		<div class="box letter {getLetterState(index)}">{guessLetter}</div>
	{/each}
</div>

<style>
	.row {
		display: flex;
		flex-direction: row;
		column-gap: var(--letter-gap);
	}
	.box {
		border-style: solid;
		border-width: 2px;
		border-color: grey;
		background-color: darkgrey;
		width: 50px;
		height: 50px;
	}
	.letter {
		font-size: xx-large;
		font-weight: 700;
		text-transform: uppercase;
		text-align: center;
		color: whitesmoke;
	}
	.correct {
		background-color: var(--correct-color);
	}
	.present {
		background-color: var(--present-color);
	}
	.absent {
		background-color: var(--absent-color);
	}
</style>
