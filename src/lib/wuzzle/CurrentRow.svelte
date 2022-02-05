<script type="ts">
	export let word;

	const guess = ['', '', '', '', ''];

	function handleKeyInput(event: KeyboardEvent) {
		// Only show the last pressed letter
		const target = event.target as HTMLInputElement;
		const input = event.key;
		if (input.length === 1) {
			target.value = input;
		}
	}

	function checkDictionary() {}
</script>

<div class="row">
	{#each guess as letter, index}
		<!-- svelte-ignore a11y-autofocus -->
		<input
			class="letter"
			type="text"
			value={letter}
			autofocus={index === 0}
			on:keyup={handleKeyInput}
			data-index={index}
		/>
	{/each}
</div>

<style>
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
