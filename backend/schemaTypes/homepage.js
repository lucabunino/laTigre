import {HomeIcon} from '@sanity/icons';

export default {
  name: 'homepage',
  type: 'document',
  icon: HomeIcon,
  fields: [
    {
      name: 'title',
      type: 'string',
      hidden: true,
    },
    {
      name: 'projects',
      type: 'array',
      of: [
        {
          name: 'project',
          type: 'object',
          fieldsets: [
            {
              name: "image",
              options: {
                columns: 2,
                collapsible: true,
              },
            }
          ],
          fields: [
            {
              name: 'reference',
              title: 'Reference to Work or Personal',
              type: 'reference',
              to: [{ type: 'work'}, { type: 'personal'}]
            },
            {
              name: 'desktop',
              type: 'image',
              validation: (Rule) => Rule.required(),
              fieldset: 'image',
            },
            {
              name: 'mobile',
              type: 'image',
              fieldset: 'image',
            },
          ],
          preview: {
            select: {
              title: 'reference.title',
              subtitle: 'caption',
              media: 'reference.images.0.asset'
            }
          }
        }
      ],
    },
  ],
}