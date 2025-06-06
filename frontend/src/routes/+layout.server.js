import { getSEO, getMaintenance } from '$lib/utils/sanity';
import { getColours } from '$lib/utils/sanity';
import { error } from '@sveltejs/kit';

export async function load({ url }) {
	const seo = await getSEO();
	const colours = await getColours();
	const maintenance = await getMaintenance();
	const { pathname } = url
	if (seo, colours, pathname, maintenance) {
		return {
			seo,
			colours,
			pathname,
			maintenance
		};
	}
  throw error(404, 'Not found');
}