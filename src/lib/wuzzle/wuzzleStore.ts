import { writable } from 'svelte/store';

export type LetterState = 'correct' | 'present' | 'absent';

// export const playedLetters: Writable<LetterState> = writable({});
export const playedLettersStore = writable({});
