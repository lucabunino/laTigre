import { getGoods } from '$lib/utils/sanity';
import { error } from '@sveltejs/kit';

export async function load() {
	const goods = await getGoods();
	if (goods) {
		return {
			goods
		};
	}
  throw error(404, 'Not found');
}