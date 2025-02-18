export default {
  name: 'work',
  type: 'document',
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
    },
  ],
  preview: {
    select: {
      title: 'title',
      tag0: 'tags.0.title',
      tag1: 'tags.1.title',
      tag2: 'tags.2.title',
      tag3: 'tags.3.title',
      media: 'images.0.asset'
    },
    prepare({ title, tag0, tag1, tag2, tag3, media }) {
      const tags = [tag0, tag1, tag2, tag3].filter(Boolean).sort(); // Remove undefined and sort alphabetically
  
      return {
        title,
        subtitle: tags.length ? tags.join(', ') : 'No tags', // Show sorted tags or default text
        media
      };
    }
  }
};