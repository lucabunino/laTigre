import { EarthGlobeIcon, InfoOutlineIcon, TagsIcon, ProjectsIcon, SparklesIcon, HomeIcon, ColorWheelIcon} from '@sanity/icons'

export const myStructure = (S, context) => {
  const entities = [
    S.divider(),
    S.listItem()
      .title('Homepage')
      .icon(HomeIcon)
      .child(S.document().schemaType('homepage').documentId('homepage')),
    S.documentTypeListItem('work')
      .title('Archive')
      .icon(ProjectsIcon),
    S.documentTypeListItem('personal')
      .title('Personal')
      .icon(SparklesIcon),
    S.divider(),
    S.documentTypeListItem('tag')
      .title('Tags')
      .icon(TagsIcon),
    S.divider(),
    S.listItem()
      .title('Studio')
      .icon(InfoOutlineIcon)
      .child(S.document().schemaType('studio').documentId('studio')),
    S.listItem()
      .title('Colours')
      .icon(ColorWheelIcon)
      .child(S.document().schemaType('colour').documentId('colour')),
  ];
  const siteSettings = [
    S.divider(),
    S.listItem()
      .title('SEO')
      .icon(EarthGlobeIcon)
      .child(S.document().schemaType('seo').documentId('seo')),
    S.documentTypeListItem('policy')
      .title('Policies'),
  ];

  return S.list()
    .title('Content')
    .items([
      ...entities,
      ...siteSettings,
    ]);
};