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
export async function getMaintenance() {
	return await client.fetch(
		`
		*[_type == "maintenance" && !(_id in path('drafts.**'))][0] {
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
						title, description, altText, metadata {dimensions, lqip}
					},
				},
			},
			desktop {
				asset {
					_ref, _id, _type
				},
				"info": asset->{
					title, description, altText, metadata {dimensions, lqip}
				},
			},
			mobile {
				asset {
					_ref, _id, _type
				},
				"info": asset->{
					title, description, altText, metadata {dimensions, lqip}
				},
			},
			reference->{
				_type,
				title,
				slug,
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
						title, description, altText, metadata {dimensions, lqip}
					},
				},
				asset {
					_ref, _id, _type
				},
				"info": asset->{
					title, description, altText, metadata {dimensions, lqip}
				},
			},
			},
		}
		`
	);
}

export async function getInfo() {
	return await client.fetch(
		`
		*[_type == "info" && !(_id in path('drafts.**'))][0] {
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
    					title, description, altText, metadata {dimensions, lqip}
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
		*[_type == "work" && !(_id in path('drafts.**')) && status == "public"]|order(orderRank) {
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
						title, description, altText, metadata {dimensions, lqip}
					},
				},
				asset {
					_ref, _id, _type
				},
				"info": asset->{
					title, description, altText, metadata {dimensions, lqip}
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
						title, description, altText, metadata {dimensions, lqip}
					},
				},
				asset {
					_ref, _id, _type
				},
				"info": asset->{
					title, description, altText, metadata {dimensions, lqip}
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
		*[_type == "work" && !(_id in path('drafts.**')) && status == "public"]|order(orderRank) {
			slug,
			media[] {
				_key,
			},
		}
		`
	);
}
export async function getThings() {
	return await client.fetch(
		`
		*[_type == "thing" && !(_id in path('drafts.**')) && status == "public"]|order(orderRank) {
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
						title, description, altText, metadata {dimensions, lqip}
					},
				},
				asset {
					_ref, _id, _type
				},
				"info": asset->{
					title, description, altText, metadata {dimensions, lqip}
				},
			},
			tags[]->{title}
		}
		`
	);
}
export async function getThing(slug) {
	return await client.fetch(
		`
		*[_type == "thing" && slug.current == $slug] {
			priceInfo,
			linkExternalUrl,
			externalUrl,
			showShipping,
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
						title, description, altText, metadata {dimensions, lqip}
					},
				},
				asset {
					_ref, _id, _type
				},
				"info": asset->{
					title, description, altText, metadata {dimensions, lqip}
				},
				
			},
			tags[]->{title},
			moreInfo,
			orderRank,
			"prev": *[_type == "thing" && orderRank < ^.orderRank] | order(orderRank desc)[0] { title, slug, media[] {type} },
      		"next": *[_type == "thing" && orderRank > ^.orderRank] | order(orderRank asc)[0] { title, slug }
		}
		`, { slug });
}
export async function getThingIndexes() {
	return await client.fetch(
		`
		*[_type == "thing" && !(_id in path('drafts.**')) && status == "public"]|order(orderRank) {
			slug,
			media[] {
				_key,
			},
		}
		`
	);
}