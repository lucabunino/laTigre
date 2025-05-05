import { getSEO } from '$lib/utils/sanity';
import { getColours } from '$lib/utils/sanity';
import { error } from '@sveltejs/kit';

export const prerender = true;

export async function load({ url }) {
	const seo = await getSEO();
	const colours = await getColours();
	const { pathname } = url
	if (seo, colours, pathname) {
		return {
			seo,
			colours,
			pathname
		};
	}
  throw error(404, 'Not found');
}