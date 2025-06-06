import { WrenchIcon } from '@sanity/icons'

export default {
	name: 'maintenance',
	type: 'document',
	icon: WrenchIcon,
	fields: [
		{
			name: 'title',
			type: 'string',
			hidden: true,
  			initialValue: 'Maintenance'
		},
		{
			name: 'active',
			type: 'boolean',
		},		
		{
			name: 'message',
			type: 'text',
			rows: 4,
		}			
	],
};