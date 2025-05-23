import { getThings } from '$lib/utils/sanity';
import { error } from '@sveltejs/kit';

export async function load() {
	const things = await getThings();
	if (things) {
		return {
			things
		};
	}
  throw error(404, 'Not found');
}