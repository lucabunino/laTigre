import { getWorks } from '$lib/utils/sanity';
import { error } from '@sveltejs/kit';

export async function load() {
	const works = await getWorks();
	const tagMap = new Map();

	works.forEach(work => {
		work.tags?.forEach(tag => {
			const key = tag.slug?.current || tag.title;
			if (!tagMap.has(key)) {
				tagMap.set(key, { ...tag, amount: 1 });
			} else {
				const existing = tagMap.get(key);
				existing.amount += 1;
				tagMap.set(key, existing);
			}
		});
	});

	const tags = Array.from(tagMap.values()).sort((a, b) =>
		a.orderRank.localeCompare(b.orderRank)
	);

	if (works && tags) {
		return {
			works,
			tags
		};
	}

	throw error(404, 'Not found');
}
