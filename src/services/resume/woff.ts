// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

const WOFF_SIGNATURE = 0x774f4646;
const WOFF_HEADER_SIZE = 44;
const WOFF_ENTRY_SIZE = 20;
const SFNT_HEADER_SIZE = 12;
const SFNT_ENTRY_SIZE = 16;

interface WoffTable {
	tag: number;
	offset: number;
	compressedLength: number;
	originalLength: number;
	checksum: number;
}

async function inflate(bytes: Uint8Array): Promise<Uint8Array> {
	const stream = new Blob([bytes as BlobPart]).stream().pipeThrough(
		new DecompressionStream("deflate"),
	);
	return new Uint8Array(await new Response(stream).arrayBuffer());
}

function pad(length: number): number {
	return (length + 3) & ~3;
}

export function isWoff(bytes: Uint8Array): boolean {
	return bytes.length >= WOFF_HEADER_SIZE &&
		new DataView(bytes.buffer, bytes.byteOffset).getUint32(0) === WOFF_SIGNATURE;
}

export async function woffToSfnt(woff: Uint8Array): Promise<Uint8Array> {
	if (!isWoff(woff)) return woff;

	const view = new DataView(woff.buffer, woff.byteOffset, woff.byteLength);
	const flavor = view.getUint32(4);
	const numTables = view.getUint16(12);

	const tables: WoffTable[] = [];
	for (let i = 0; i < numTables; i++) {
		const at = WOFF_HEADER_SIZE + i * WOFF_ENTRY_SIZE;
		tables.push({
			tag: view.getUint32(at),
			offset: view.getUint32(at + 4),
			compressedLength: view.getUint32(at + 8),
			originalLength: view.getUint32(at + 12),
			checksum: view.getUint32(at + 16),
		});
	}

	const decoded = await Promise.all(tables.map(async (table) => {
		const raw = woff.subarray(table.offset, table.offset + table.compressedLength);
		return table.compressedLength < table.originalLength ? await inflate(raw) : raw;
	}));

	const directorySize = SFNT_HEADER_SIZE + numTables * SFNT_ENTRY_SIZE;
	const total = decoded.reduce((sum, data) => sum + pad(data.length), directorySize);
	const out = new Uint8Array(total);
	const outView = new DataView(out.buffer);

	const entrySelector = Math.floor(Math.log2(numTables));
	const searchRange = 2 ** entrySelector * 16;
	outView.setUint32(0, flavor);
	outView.setUint16(4, numTables);
	outView.setUint16(6, searchRange);
	outView.setUint16(8, entrySelector);
	outView.setUint16(10, numTables * 16 - searchRange);

	let offset = directorySize;
	tables.forEach((table, i) => {
		const at = SFNT_HEADER_SIZE + i * SFNT_ENTRY_SIZE;
		outView.setUint32(at, table.tag);
		outView.setUint32(at + 4, table.checksum);
		outView.setUint32(at + 8, offset);
		outView.setUint32(at + 12, decoded[i].length);
		out.set(decoded[i], offset);
		offset += pad(decoded[i].length);
	});

	return out;
}
