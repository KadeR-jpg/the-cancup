import { redirect } from '@sveltejs/kit';
import { getDrinks, getUserRatings, upsertRating, deleteRating } from '$lib/server/db';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ platform, cookies }) => {
	const userId = cookies.get('user_id');
	if (!userId) throw redirect(303, '/');

	const DB = platform?.env?.DB;
	if (!DB) return { drinks: [], ratingMap: {} as Record<number, number>, userId };

	const [drinks, ratings] = await Promise.all([getDrinks(DB), getUserRatings(DB, userId)]);

	const ratingMap: Record<number, number> = {};
	for (const r of ratings) ratingMap[r.drink_id] = r.stars;

	return { drinks, ratingMap, userId };
};

export const actions: Actions = {
	rate: async ({ platform, cookies, request }) => {
		const userId = cookies.get('user_id');
		if (!userId) throw redirect(303, '/');

		const DB = platform?.env?.DB;
		if (!DB) return { success: false };

		const form = await request.formData();
		const drinkId = Number(form.get('drink_id'));
		const stars = Number(form.get('stars'));

		if (!drinkId || isNaN(stars) || stars < 0 || stars > 5) {
			return { success: false };
		}

		if (stars === 0) {
			await deleteRating(DB, userId, drinkId);
		} else {
			await upsertRating(DB, userId, drinkId, stars);
		}

		return { success: true };
	}
};
