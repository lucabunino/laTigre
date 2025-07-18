import {ColorWheelIcon} from '@sanity/icons'

export default {
  name: 'colour',
  type: 'document',
  icon: ColorWheelIcon,
  fields: [
    {
      name: 'title',
      type: 'string',
      hidden: true,
    },
    {
      name: 'desktop',
      type: 'array',
      of: [{ type: 'color' }],
    },
    {
      name: 'mobile',
      type: 'array',
      of: [{ type: 'color' }]
    },
	{
      name: 'menu',
      type: 'array',
      of: [{ type: 'color' }]
    },
	{
      name: 'info',
      type: 'array',
      of: [{ type: 'color' }]
    },
  ],
};