import { HomeIcon } from '@sanity/icons';

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
							to: [{ type: 'work' }, { type: 'thing' }],
							options: {
								filter: 'status == $status',
								filterParams: { status: 'public' }
							},
							validation: (Rule) => Rule.required(),
						},
						{
							name: 'desktop',
							type: 'image',
							fieldset: 'image',
						},
						{
							name: 'mobile',
							type: 'image',
							fieldset: 'image',
						},
						{
							name: 'video',
							type: 'object',
							options: {
								columns: 2,
								collapsible: true,
							},
							fields: [
								{
									name: 'mp4',
									title: 'Video (.mp4)',
									type: 'file',
									options: {
										accept: 'video/mp4',
										storeOriginalFilename: true,
									},
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
					validation: (Rule) =>
						Rule.custom((fields) => {
							if (!fields?.desktop && !fields?.video?.mp4) {
								return 'Either Desktop image or Video must be provided';
							}
							return true;
						}),
					preview: {
						select: {
							title: 'reference.title',
							desktop: 'desktop',
							desktopFilename: 'desktop.asset.originalFilename',
							cover: 'video.cover',
							videoFilename: 'video.mp4.asset.originalFilename',
						},
						prepare({ title, desktop, desktopFilename, cover, videoFilename }) {
							return {
								title: title || 'No title',
								subtitle: desktop ? `${desktopFilename}` : videoFilename ? `${videoFilename}` : 'No media',
								media: desktop || cover || undefined, // Use desktop first, then video cover
							};
						}
					}
				}
			],
		},
	],
};