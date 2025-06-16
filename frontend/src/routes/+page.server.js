import { getProjects } from '$lib/utils/sanity';
import { error } from '@sveltejs/kit';

export async function load() {
	const projects = await getProjects();
	if (projects) {
		return {
			projects
		};
	}
  throw error(404, 'Not found');
}

// src/routes/+layout.server.js
export async function load({ setHeaders }) {
  setHeaders({
    'cache-control': 'public, s-maxage=60, stale-while-revalidate=3600'
  });
}