// Copyright (c) 2025-2026 lívia
// SPDX-License-Identifier: AGPL-3.0-or-later

export const ATTACHMENT_MAX_DIMENSION = 1024;
export const ATTACHMENT_MAX_BYTES = 2 * 1024 * 1024;

export interface Attachment {
	kind: "image";
	dataUrl: string;
}

function loadImage(url: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const image = new Image();
		image.onload = () => resolve(image);
		image.onerror = () => reject(new Error("could not read that image"));
		image.src = url;
	});
}

function encode(canvas: HTMLCanvasElement): string {
	const webp = canvas.toDataURL("image/webp", 0.85);
	return webp.startsWith("data:image/webp") ? webp : canvas.toDataURL("image/jpeg", 0.85);
}

export async function readImageFile(file: File): Promise<string> {
	if (!file.type.startsWith("image/")) throw new Error("that isn't an image");

	const objectUrl = URL.createObjectURL(file);
	try {
		const image = await loadImage(objectUrl);
		const scale = Math.min(
			1,
			ATTACHMENT_MAX_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight),
		);
		const canvas = document.createElement("canvas");
		canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
		canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
		canvas.getContext("2d")!.drawImage(image, 0, 0, canvas.width, canvas.height);

		const dataUrl = encode(canvas);
		if (dataUrl.length > ATTACHMENT_MAX_BYTES * 1.4) {
			throw new Error("that image is too large");
		}
		return dataUrl;
	} finally {
		URL.revokeObjectURL(objectUrl);
	}
}

export function pickImageFile(): Promise<File | null> {
	return new Promise((resolve) => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = "image/*";
		input.addEventListener("change", () => resolve(input.files?.[0] ?? null), {
			once: true,
		});
		input.addEventListener("cancel", () => resolve(null), { once: true });
		input.click();
	});
}
