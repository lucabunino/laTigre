import { getSEO, getMaintenance } from '$lib/utils/sanity';
import { getColours } from '$lib/utils/sanity';
import { error } from '@sveltejs/kit';

export async function load({ url, setHeaders }) {
  setHeaders({
    'cache-control': 'public, s-maxage=60, stale-while-revalidate=3600'
  });

  const [seo, colours, maintenance] = await Promise.all([
    getSEO(),
    getColours(),
    getMaintenance()
  ]);

  if (!seo || !colours || !maintenance) {
    throw error(404, 'Missing required data');
  }

  return {
    seo,
    colours,
    maintenance,
    pathname: url.pathname
  };
}