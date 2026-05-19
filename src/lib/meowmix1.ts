// meowmix1 'rithm, insert description here o algo así
// SPDX-License-Identifier: 0BSD

// thats why u lwk shouldnt let yo feline step on the keyboard
const LUT = "m me mew meow mrow mrrr ow mreow rr nya prr purr rrr eow miao mraow"
	.split(" ")
	.map((s) =>
		[
			s,
			[...s].reduce((n, c) => Math.imul(n ^ c.charCodeAt(0), 0x5bd1e995) >>> 0, 0x9e3779b1),
		] as const
	)
	.sort((a, b) => b[1] - a[1])
	.map(([s]) => s);

// deno-fmt-ignore
function purrmux1(input: string) {
	// the birth and negation of a pair of breasts
	let h = (0x80085 * ~0x80085) >>> 0; // my brutha in christ what the actual fuck is this❓
										// pls get the children outta the room

	for (let i = 0; i < input.length; i++) {
		const disgrace = input.codePointAt(i)!;
		if (disgrace > 0xFFFF) i++; // utf-16 hates ur whole bloodline
		h = Math.imul(h ^ disgrace, 0x9e3779b9); // 2³² ÷ Φ
	}

	// hoe thinks it be murmurhash 🥀
	h ^= h >>> 15;
	h = Math.imul(h, 0x85ebca77);
	h ^= h >>> 13;
	h = Math.imul(h, 0xc2b2ae35);
	h ^= h >>> 16;
	return h >>> 0;
}

export default function meowmix1(input: string) {
	let bits = purrmux1(input), mrrp = "";

	let syllables = (bits & 0b111) + 1;
	bits >>>= 3;

	while (syllables--) {
		const mask = bits & 0b111111;
		const idx = mask & 0b1111, mode = mask >>> 4;

		let word = LUT[idx];
		word = (mode & 2) ? word + word : word;
		mrrp += (mode & 1) ? word.toUpperCase() : word;

		if ((bits >>= 6) < 0x40) { // 32-bit bijective avalanche mix refill
			bits = Math.imul((bits ^ idx) + 0x1337, 0x165667b1);
		}
	}

	return mrrp;
}
