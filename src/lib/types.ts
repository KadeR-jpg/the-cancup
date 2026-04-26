export interface Drink {
	id: number;
	name: string;
	slug: string;
}

export interface Rating {
	drink_id: number;
	stars: number;
}

export interface ScoreboardEntry {
	drink_id: number;
	name: string;
	avg_stars: number;
	rating_count: number;
	score: number;
}
