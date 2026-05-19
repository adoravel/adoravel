/**
 * Copyright (c) 2025 adoravel
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

function art(path: string, size = "512x512bb"): string {
	return `https://is1-ssl.mzstatic.com/image/thumb/${path}.jpg/${size}.jpg`;
}

export const songs: Song[] = [
	{
		title: "matryoshka",
		album: "heartstrings",
		artist: "lexycat",
		tag: "digicore, plunderphonics",
		url: "https://song.link/i/1722427758",
		coverUrl: art("Music211/v4/b9/7b/66/b97b6672-7c40-8b1c-fd7b-51e8866c0a6a/cover_198662567310"),
		releaseDate: "Released on August 18, 2024",
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
	{
		title: "lose myself in you",
		album: "lose myself in you",
		artist: "coffret de bijoux",
		tag: "atmospheric black metal",
		url: "https://song.link/i/1886039227",
		coverUrl: art("Music221/v4/39/19/03/39190326-8671-70f7-a488-39ae4d6d74bb/5063959778586_cover"),
		releaseDate: "Released on March 9, 2026",
	},
];
