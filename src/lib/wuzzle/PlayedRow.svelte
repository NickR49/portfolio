<script type="ts">
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

	// Analysis attempt
	const letters = guess.split('').filter(onlyUnique);
	letters.forEach((letter) => {
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

	function checkLetter(index: number): 'green' | 'yellow' | 'grey' {
		const guessLetter = guess.slice(index, index + 1);
		// If it's a direct match then return green
		if (word.slice(index, index + 1) === guessLetter) {
			return 'green';
		}
		// If the letter is elsewhere in the word then check if it's already a direct match
		if (word.indexOf(guessLetter) > -1) {
			if (letterDetails[index]?.directMatches === letterDetails[index]?.occurrencesInWord) {
				return 'grey';
			}
			return 'yellow';
		} else {
			return 'grey';
		}
	}
</script>

<div class="row">
	{#each guess.split('') as guessLetter, index}
		<div class="box letter {checkLetter(index)}">{guessLetter}</div>
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
	.green {
		background-color: darkgreen;
	}
	.yellow {
		background-color: rgb(196, 163, 16);
	}
	.grey {
		/* background-color: grey; */
	}
</style>
