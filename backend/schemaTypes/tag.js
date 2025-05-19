import {TagIcon} from '@sanity/icons'
import {orderRankField} from '@sanity/orderable-document-list'

export default {
  name: 'tag',
  type: 'document',
  icon: TagIcon,
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
};