import { createClient } from '@sanity/client';
import { PUBLIC_SANITY_DATASET, PUBLIC_SANITY_PROJECT_ID } from '$env/static/public';

if (!PUBLIC_SANITY_PROJECT_ID || !PUBLIC_SANITY_DATASET) {
	throw new Error('Did you forget to run sanity init --env?');
}

export const client = createClient({
	projectId: PUBLIC_SANITY_PROJECT_ID,
	dataset: PUBLIC_SANITY_DATASET,
	useCdn: false, // `false` if you want to ensure fresh data
	apiVersion: '2025-02-26', // date of setup
});

export async function getSEO() {
	return await client.fetch(
		`*[_type == "seo"] {
			SEOTitle,
			SEODescription,
			SEOKeywords,
			SEOImage,
		}|order(year desc)`
	);
}
export async function getColours() {
	return await client.fetch(
		`
		*[_type == "colour" && !(_id in path('drafts.**'))][0] {
			...,
		}
		`
	);
}
export async function getProjects() {
	return await client.fetch(
		`
		*[_type == "homepage" && !(_id in path('drafts.**'))][0].projects[] {
			video {
				mp4 {
					asset-> {url}
				},
				cover {
					asset {
						_ref, _id, _type
					},
					"info": asset->{
						title, description, altText, metadata {dimensions}
					},
				},
			},
			desktop {
				asset {
					_ref, _id, _type
				},
				"info": asset->{
					title, description, altText, metadata {dimensions}
				},
			},
			mobile {
				asset {
					_ref, _id, _type
				},
				"info": asset->{
					title, description, altText, metadata {dimensions}
				},
			},
			reference->{
				_type,
				title,
				slug,
				description
			},
		}
		`
	);
}

export async function getStudio() {
	return await client.fetch(
		`
		*[_type == "studio" && !(_id in path('drafts.**'))][0] {
			...,
			body[] {
				...,
				markDefs[] {
					...,
					image {
            asset {
    					_ref, _id, _type
    				},
            "info": asset->{
    					title, description, altText, metadata {dimensions}
    				},
					}
				}
			}
		}
		`
	);
}
export async function getWorks() {
	return await client.fetch(
		`
		*[_type == "work" && !(_id in path('drafts.**'))]|order(orderRank) {
			...,
			media[] {
				mp4 {
					asset-> {url}
				},
				cover {
					asset {
						_ref, _id, _type
					},
					"info": asset->{
						title, description, altText, metadata {dimensions}
					},
				},
				asset {
					_ref, _id, _type
				},
				"info": asset->{
					title, description, altText, metadata {dimensions}
				},
			},
			tags[]->{title, slug, colour, orderRank}
		}
		`
	);
}
export async function getTags() {
	return await client.fetch(
		`
		*[_type == "work" && !(_id in path('drafts.**'))]|order(orderRank) {
			tags[]->{title, slug, colour, orderRank}
		}
		`
	);
}
export async function getWork(slug) {
	return await client.fetch(
		`
		*[_type == "work" && slug.current == $slug] {
			slug,
			title,
			description,
			media[] {
				mp4 {
					asset-> {url}
				},
				cover {
					asset {
						_ref, _id, _type
					},
					"info": asset->{
						title, description, altText, metadata {dimensions}
					},
				},
				asset {
					_ref, _id, _type
				},
				"info": asset->{
					title, description, altText, metadata {dimensions}
				},
			},
			tags[]->{title},
			orderRank,
			"prev": *[_type == "work" && orderRank < ^.orderRank] | order(orderRank desc)[0] { title, slug, media[] {type} },
      "next": *[_type == "work" && orderRank > ^.orderRank] | order(orderRank asc)[0] { title, slug }
		}
		`, { slug });
}
export async function getWorkIndexes() {
	return await client.fetch(
		`
		*[_type == "work" && !(_id in path('drafts.**'))]|order(orderRank) {
			slug,
			media[] {
				_key,
			},
		}
		`
	);
}
export async function getGoods() {
	return await client.fetch(
		`
		*[_type == "good" && !(_id in path('drafts.**'))]|order(orderRank) {
			...,
			media[] {
				video {
					mp4 {
						asset-> {url}
					},
					cover {
						asset {
							_ref, _id, _type
						},
						"info": asset->{
							title, description, altText, metadata {dimensions}
						},
					},
				},
				asset {
					_ref, _id, _type
				},
				"info": asset->{
					title, description, altText, metadata {dimensions}
				},
			},
			tags[]->{title}
		}
		`
	);
}
export async function getGood(slug) {
	return await client.fetch(
		`
		*[_type == "good" && slug.current == $slug] {
			slug,
			title,
			description,
			media[] {
				mp4 {
					asset-> {url}
				},
				cover {
					asset {
						_ref, _id, _type
					},
					"info": asset->{
						title, description, altText, metadata {dimensions}
					},
				},
				asset {
					_ref, _id, _type
				},
				"info": asset->{
					title, description, altText, metadata {dimensions}
				},
			},
			tags[]->{title},
			moreInfo,
			orderRank,
			"prev": *[_type == "good" && orderRank < ^.orderRank] | order(orderRank desc)[0] { title, slug, media[] {type} },
      "next": *[_type == "good" && orderRank > ^.orderRank] | order(orderRank asc)[0] { title, slug }
		}
		`, { slug });
}
export async function getGoodIndexes() {
	return await client.fetch(
		`
		*[_type == "good" && !(_id in path('drafts.**'))]|order(orderRank) {
			slug,
			media[] {
				_key,
			},
		}
		`
	);
}