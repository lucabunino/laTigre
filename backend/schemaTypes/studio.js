import {InfoOutlineIcon, ImageIcon} from '@sanity/icons'

export default {
  name: 'studio',
  type: 'document',
  icon: InfoOutlineIcon,
  fields: [
    {
      name: 'title',
      type: 'string',
      hidden: true,
    },
    {
      name: 'slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'title',
        maxLength: 96,
      },
      hidden: true,
    },
    {
      name: 'body',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { value: 'normal', title: 'Normal' },
            { value: 'h3', title: 'H3' },
          ],
          lists: [],
          marks: {
            decorators: [],
            annotations: [
              {
                name: 'link',
                type: 'object',
                fields: [
                  {
                    name: 'url',
                    type: 'string', // Change to string to allow custom validation
                    validation: Rule =>
                      Rule.custom(href => {
                        if (!href) return true; // Allow empty field
                        return /^(https?:\/\/|mailto:|tel:)/.test(href)
                          ? true
                          : 'Must be a valid URL, mailto:, or tel: link';
                      }),
                  },
                  {
                    title: 'Open in new tab',
                    name: 'blank',
                    type: 'boolean',
                  },
                ],
              },
              {
                name: 'image',
                type: 'object',
                icon: ImageIcon,
                fields: [
                  {
                    name: 'image',
                    type: 'image',
                  },
                ],
              },
            ],
          },
        },
      ],
    }      
  ],
};