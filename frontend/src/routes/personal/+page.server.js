import { getPersonals } from '$lib/utils/sanity';
import { error } from '@sveltejs/kit';

export async function load() {
	const personals = await getPersonals();
	if (personals) {
		return {
			personals
		};
	}
  throw error(404, 'Not found');
}