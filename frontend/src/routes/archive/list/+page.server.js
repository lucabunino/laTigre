import { getWorks } from '$lib/utils/sanity';
import { error } from '@sveltejs/kit';

export async function load() {
	const works = await getWorks();
	if (works) {
		return {
			works
		};
	}
  throw error(404, 'Not found');
}