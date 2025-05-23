import { getInfo } from '$lib/utils/sanity';
import { error } from '@sveltejs/kit';

export async function load() {
	const info = await getInfo();
	if (info) {
		return {
			info
		};
	}
  throw error(404, 'Not found');
}