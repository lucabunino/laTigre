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
          options: {
            columns: 2
          },
          fields: [
            {
              name: 'desktop',
              type: 'image',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'mobile',
              type: 'image',
            },
            {
              name: 'projectReference',
              title: 'Reference to Work or Personal',
              type: 'reference',
              to: [{ type: 'work'}, { type: 'personal'}]
            },
          ],
          preview: {
            select: {
              title: 'projectReference.title',
              media: 'projectReference.images.0.asset'
            }
          }
        }
      ],
    },
  ],
}