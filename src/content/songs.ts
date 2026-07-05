/**
 * Copyright (c) 2025-2026 kylia
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

export interface Song {
	title: string;
	album: string;
	artist: string;
	tag?: string;
	releaseDate: string;
	url: string;
	coverUrl?: string;
}

function art(path: string, thumbType: string = "jpg", size = "512x512bb"): string {
	return `https://is1-ssl.mzstatic.com/image/thumb/${path}.${thumbType}/${size}.jpg`;
}

export const songs: Song[] = [
	{
		title: "stalker",
		album: "to tell the truth.",
		artist: "bottom surgery",
		tag: "cybergrind, harsh noise",
		url: "https://bottomsurgery.bandcamp.com/track/stalker",
		coverUrl: art("Music211/v4/9d/c6/cd/9dc6cd1a-6c90-6a3e-eafb-966a0072db00/artwork"),
		releaseDate: "Released on April 10, 2026",
	},
	{
		title: "sayonara birthday",
		album: "AN ALIEN'S PORTRAIT",
		artist: "Broken By The Scream",
		tag: "idol metal",
		url: "https://song.link/br/i/1810392006",
		coverUrl: art("Music221/v4/59/6d/6a/596d6ad6-ff0c-5987-06aa-e889e79d2489/4582168530255", "png"),
		releaseDate: "Released on August 22, 2018",
	},
	{
		title: "tile floors",
		album: "lettinggomakestheheartburnhotter",
		artist: "fallingwithscissors",
		tag: "experimental metalcore",
		url: "https://song.link/i/1681979278",
		coverUrl: art("Music116/v4/53/4d/18/534d18da-75d9-5d48-2a14-17256a49c2c9/9b0f51d8-05f2-47a6-ba89-01ad8804828b"),
		releaseDate: "Released on April 17, 2023",
	},
];
