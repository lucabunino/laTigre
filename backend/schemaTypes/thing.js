import {orderRankField} from '@sanity/orderable-document-list'
import {SparkleIcon, EditIcon} from '@sanity/icons'

export default {
	name: 'thing',
	type: 'document',
	fields: [
		orderRankField({ type: "thing" }),
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
			name: 'status',
			type: 'string',
			options: {
				list: [
					{ title: 'Public', value: 'public' },
					{ title: 'Hidden', value: 'hidden' },
				],
			},
			initialValue: 'hidden',
			validation: (Rule) => Rule.required(),
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
			rows: 4,
		},
		{
			name: 'moreInfo',
			type: 'text',
		},
		{
			name: 'priceInfo',
			type: 'string',
		},
		{
			name: 'showShipping',
			type: 'boolean',
			initialValue: true,
		},
		{
			name: 'externalUrl',
			type: 'url',
		},
		{
			name: 'linkExternalUrl',
			type: 'boolean',
			initialValue: true,
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
	status: 'status'
  },
  prepare({ title, tag0, tag1, tag2, tag3, media, status }) {
    let mediaUsed;
    if (media?.[0]?.asset) {
      mediaUsed = media[0].asset;
    } else {
      mediaUsed = media?.[0]?.cover?.asset;
    }
    const tags = [tag0, tag1, tag2, tag3].filter(Boolean).sort();
    return {
      title: status === "hidden" ? `[HIDDEN] ${title}` : title,
      subtitle: tags.length ? tags.join(', ') : 'No tags',
      media: status !== "hidden" ? mediaUsed : undefined,
      icon: status === "hidden" ? EditIcon : SparkleIcon,
    };
  }
}
};