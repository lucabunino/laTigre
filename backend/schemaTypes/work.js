import {orderRankField} from '@sanity/orderable-document-list'
import { EditIcon } from "@sanity/icons";

export default {
	name: 'work',
	type: 'document',
	fields: [
		orderRankField({ type: "work" }),
		{
			name: 'title',
			type: 'string',
		},
		{
			name: 'slug',
			type: 'slug',
			validation: (Rule) => Rule.required(),
			options: {
				source: 'title',
				maxLength: 96,
			},
		},
		{
			name: 'media',
			type: 'array',
			of: [
				{ type: 'image' },
				{
					name: 'video',
					type: 'object',
					fields: [
						{
							name: 'mp4',
							title: 'Video (.mp4)',
							type: 'file',
							options: {
								accept: 'video/mp4',
								storeOriginalFilename: true,
							},
							validation: (Rule) => Rule.required(),
						},
						{
							name: 'cover',
							type: 'image',
						}
					],
					preview: {
						select: {
							title: 'mp4.asset.originalFilename',
							media: 'cover',
						},
						prepare({ title, media }) {
							return {
								title: title || 'No filename', // Fallback title
								media,
							};
						}
					}
				}
			],
			validation: (Rule) => Rule.required(),
			options: {
				layout: 'grid'
			},
		},		
		{
			name: 'tags',
			type: 'array',
			of: [{ type: 'reference', to: [{ type: 'tag' }] }],
		},
		{
			name: 'description',
			type: 'text',
		},
	],
	preview: {
		select: {
			title: 'title',
			tag0: 'tags.0.title',
			tag1: 'tags.1.title',
			tag2: 'tags.2.title',
			tag3: 'tags.3.title',
			media: 'media',
			_id: '_id'
		},
		prepare({ title, tag0, tag1, tag2, tag3, media, _id }) {
			const isDraft = _id?.startsWith('drafts.');
			let mediaUsed
			if (media[0].asset) {
				mediaUsed = media[0].asset
			} else {
				mediaUsed = media[0].cover.asset
			}
			const tags = [tag0, tag1, tag2, tag3].filter(Boolean).sort();
			return {
				title: isDraft ? `[DRAFT] ${title}` : title,
				subtitle: tags.length ? tags.join(', ') : 'No tags',
				media: !isDraft ? mediaUsed : undefined,
				icon: isDraft ? EditIcon : undefined,
			};
		}
	}
};