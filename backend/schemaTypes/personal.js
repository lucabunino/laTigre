import {orderRankField} from '@sanity/orderable-document-list'
import {SparkleIcon} from '@sanity/icons'

export default {
  name: 'personal',
  type: 'document',
  icon: SparkleIcon,
  fields: [
    orderRankField({ type: "personal" }),
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
                accept: 'mp4',
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
      tag0: 'tags.0.title',
      tag1: 'tags.1.title',
      tag2: 'tags.2.title',
      tag3: 'tags.3.title',
      media: 'media'
    },
    prepare({ title, tag0, tag1, tag2, tag3, media }) {
      let mediaUsed
      console.log(media[0]);
      if (media[0].asset) {
        mediaUsed = media[0].asset
      } else {
        mediaUsed = media[0].cover.asset
      }
      const tags = [tag0, tag1, tag2, tag3].filter(Boolean).sort(); // Remove undefined and sort alphabetically
  
      return {
        title,
        subtitle: tags.length ? tags.join(', ') : 'No tags', // Show sorted tags or default text
        media: mediaUsed,
      };
    }
  }
};