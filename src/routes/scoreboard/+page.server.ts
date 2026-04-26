import { getScoreboard } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform }) => {
	const DB = platform?.env?.DB;
	if (!DB) return { entries: [] };
	const entries = await getScoreboard(DB);
	return { entries };
};
