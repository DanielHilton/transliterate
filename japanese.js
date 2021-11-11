import builtInReplacements from './replacements.js'
import escapeStringRegexp from "escape-string-regexp";

const isJapaneseText = str => str.match(/[\u3040-\u30FF]/)
const isSokuon = kana => kana === 'っ'　|| kana === 'ッ'
const isYoon = kana => kana === 'ゃ'　|| kana === 'ょ' || kana === 'ゅ'
const handleSokuon = nextKana => builtInReplacements[nextKana][0]

const deconstructKana = str => {
	const individualCharacters = [...str]
	let finalKana = []
	for(const [index, character] of individualCharacters.entries()) {
		if(isYoon(character)) continue;

		const nextKana = individualCharacters[index + 1]
		if(isYoon(nextKana))
			// Groups kana with yoon character together
			finalKana.push(`${character}${nextKana}`)
		else
			finalKana.push(character)
	}

	return finalKana
}

const doCustomReplacements = (string, replacements) => {
	const deconstructedString = deconstructKana(string)
	for(const [index, character] of deconstructedString.entries()) {
		if(isSokuon(character)) {
			string += handleSokuon(deconstructedString[index + 1])
		} else {
			string = string.replace(new RegExp(escapeStringRegexp(kana), 'g'), romaji);
		}
	}

	return string;
};

export default { isJapaneseText, isSokuon, handleSokuon, doCustomReplacements }
