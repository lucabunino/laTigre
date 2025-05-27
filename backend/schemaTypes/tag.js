import {TagIcon, EditIcon} from '@sanity/icons'
import {orderRankField} from '@sanity/orderable-document-list'

export default {
	name: 'tag',
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
			name: 'colour',
			type: 'color',
			validation: (Rule) => Rule.required(),
		}
	],
	preview: {
		select: {
			title: 'title',
			_id: '_id'
		},
		prepare({ title, _id }) {
			const isDraft = _id?.startsWith('drafts.');
			return {
				title: isDraft ? `[DRAFT] ${title}` : title,
				icon: isDraft ? EditIcon : TagIcon,
			};
		}
	}
};