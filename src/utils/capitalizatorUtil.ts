/**
 * Takes an word and capitalizes the first letter
 * @param sentence the word that needs capitalizing
 * @returns the capitalized word
 */
export const capitalizatorUtil = (sentence: string) => sentence[0].toUpperCase() + sentence.substring(1, sentence.length);
