import {SparkleIcon} from '@sanity/icons'


export default {
  name: 'personal',
  type: 'document',
  icon: SparkleIcon,
  fields: [
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
      name: 'images',
      type: 'array',
      of: [{ type: 'image' }],
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
      rows: 2,
    },
    {
      name: 'moreInfo',
      type: 'text',
    },
    {
      name: 'price',
      title: 'Price (€)',
      type: 'number',
      validation: Rule => Rule.precision(2).positive(),
    },
    {
      name: 'payPalUrl',
      type: 'url',
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'images.0.asset'
    },
  }
};