import type { D1Database } from '@cloudflare/workers-types';
import type { Drink, Rating, ScoreboardEntry } from '$lib/types';

export function getDrinks(DB: D1Database): Promise<Drink[]> {
	return DB.prepare('SELECT id, name, slug FROM drinks ORDER BY name')
		.all<Drink>()
		.then((r) => r.results);
}

export function getUserRatings(DB: D1Database, userId: string): Promise<Rating[]> {
	return DB.prepare('SELECT drink_id, stars FROM ratings WHERE user_id = ?')
		.bind(userId)
		.all<Rating>()
		.then((r) => r.results);
}

export async function upsertRating(
	DB: D1Database,
	userId: string,
	drinkId: number,
	stars: number
): Promise<void> {
	await DB.prepare(
		`INSERT INTO ratings (user_id, drink_id, stars, rated_at)
     VALUES (?, ?, ?, datetime('now'))
     ON CONFLICT(user_id, drink_id) DO UPDATE
     SET stars = excluded.stars, rated_at = excluded.rated_at`
	)
		.bind(userId, drinkId, stars)
		.run();
}

export async function deleteRating(
	DB: D1Database,
	userId: string,
	drinkId: number
): Promise<void> {
	await DB.prepare('DELETE FROM ratings WHERE user_id = ? AND drink_id = ?')
		.bind(userId, drinkId)
		.run();
}

export function getScoreboard(DB: D1Database): Promise<ScoreboardEntry[]> {
	return DB.prepare(
		`WITH stats AS (
      SELECT drink_id, AVG(CAST(stars AS REAL)) AS avg_stars, COUNT(*) AS rating_count
      FROM ratings
      GROUP BY drink_id
    ),
    global AS (
      SELECT AVG(CAST(stars AS REAL)) AS global_avg FROM ratings
    )
    SELECT
      d.id AS drink_id,
      d.name,
      ROUND(s.avg_stars, 2) AS avg_stars,
      s.rating_count,
      ROUND(
        (5.0 * g.global_avg + s.rating_count * s.avg_stars) / (5.0 + s.rating_count),
        4
      ) AS score
    FROM drinks d
    JOIN stats s ON s.drink_id = d.id
    CROSS JOIN global g
    ORDER BY score DESC, s.rating_count DESC`
	)
		.all<ScoreboardEntry>()
		.then((r) => r.results);
}
