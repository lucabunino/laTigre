import { EarthGlobeIcon, InfoOutlineIcon, TagsIcon, ProjectsIcon, SparklesIcon, HomeIcon, ColorWheelIcon} from '@sanity/icons'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'


export const myStructure = (S, context) => {
  const entities = [
    S.divider(),
    S.listItem()
      .title('Homepage')
      .icon(HomeIcon)
      .child(S.document().schemaType('homepage').documentId('homepage')),
    orderableDocumentListDeskItem({type: 'work', title: 'Works', icon: ProjectsIcon, S, context}),
    orderableDocumentListDeskItem({type: 'thing', title: 'Things', icon: SparklesIcon, S, context}),
    S.divider(),
    orderableDocumentListDeskItem({type: 'tag', title: 'Tags', icon: TagsIcon, S, context}),
    S.divider(),
    // S.listItem()
    //   .title('Studio (to be replaced)')
    //   .icon(InfoOutlineIcon)
    //   .child(S.document().schemaType('studio').documentId('studio')),
    S.listItem()
      .title('Info')
      .icon(InfoOutlineIcon)
      .child(S.document().schemaType('info').documentId('info')),
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