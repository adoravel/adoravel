import { withInterval } from "../utils/temp.ts";

const FM_API_KEY = Deno.env.get("LASTFM_API_KEY");

export interface Parameters {
	api_key: string;
	method: string;
	[key: string]: string | number;
}

export interface Image {
	"#text": string;
	size: "small" | "medium" | "large" | "extralarge";
}

export interface Track {
	"@attr"?: {
		nowplaying?: "true";
	};
	url: string;
	artist: {
		name: string;
	};
	album: {
		"#text": string;
	};
	image?: Image[];
	name: string;
	date?: {
		"#text": string;
		uts: string;
	};
	loved?: "0" | "1";
}

export interface RecentTracksResponse {
	recenttracks: {
		track: Track[];
		"@attr": {
			user: string;
			totalPages: number;
			page: number;
		};
	};
	error?: number;
	message?: string;
}

export async function fm(params: Parameters, secret?: string) {
	const url = new URL("https://ws.audioscrobbler.com/2.0/");
	const parameters: Record<string, string> = { ...params, format: "json" };

	Object.entries(parameters)
		.forEach(([key, value]) => url.searchParams.append(key, String(value)));

	const response = await fetch(url, {
		method: secret ? "POST" : "GET",
		headers: {
			"User-Agent": "something/1.0",
			"Content-Type": "application/x-www-form-urlencoded",
		},
	});

	if (!response.ok) {
		throw new Error(`dies ${response.status}`);
	}

	const data = await response.json();

	if (data.error) {
		const error = new Error(data.message || "unknown last.fm api error");
		throw (error as unknown as Record<string, string>).code = data.error, error;
	}
	return data;
}

export async function getRecentTracks(
	username: string,
	page: number,
	limit = 200,
	extended: number = 1,
): Promise<RecentTracksResponse> {
	return await fm({
		method: "user.getRecentTracks",
		user: username,
		api_key: FM_API_KEY,
		limit,
		page,
		extended,
	});
}

export const FM_USER = "satisfeita";

export const tracks = await withInterval(async () => {
	const { recenttracks } = await getRecentTracks(FM_USER, 1, 5);

	return recenttracks.track?.map((track) => ({
		artist: track.artist.name,
		name: track.name,
		loved: track.loved === "1" ? true : false,
		playing: track["@attr"]?.nowplaying || false,
		cover: track.image?.at(-1)?.["#text"],
		url: track.url || "#",
	}));
}, 60);
