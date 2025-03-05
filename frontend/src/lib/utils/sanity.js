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
				tags[]->{title}
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
export async function getPersonals() {
	return await client.fetch(
		`
		*[_type == "personal" && !(_id in path('drafts.**'))]|order(orderRank) {
			...,
			media[] {
				mp4 {
					asset-> {url}
				},
				cover {
					asset {
						_ref, _id, _type
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