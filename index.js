import deburr from 'lodash.deburr';
import escapeStringRegexp from 'escape-string-regexp';
import builtinReplacements from './replacements.js';
import japanese from './japanese.js'

const doCustomReplacements = (string, replacements) => {
	for (const [key, value] of replacements) {
		// TODO: Use `String#replaceAll()` when targeting Node.js 16.
		string = string.replace(new RegExp(escapeStringRegexp(key), 'g'), value);
	}

	return string;
};

export default function transliterate(string, options) {
	if (typeof string !== 'string') {
		throw new TypeError(`Expected a string, got \`${typeof string}\``);
	}

	options = {
		customReplacements: [],
		...options
	};

	const customReplacements = new Map([
		...builtinReplacements,
		...options.customReplacements
	]);

	string = string.normalize();
	if(japanese.isJapaneseText(string)) {
		string = japanese.doCustomReplacements(string, customReplacements);
	} else {
		string = doCustomReplacements(string, customReplacements);
	}
	string = deburr(string);

	return string;
}
