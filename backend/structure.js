import { EarthGlobeIcon, InfoOutlineIcon, TagsIcon, ProjectsIcon, SparklesIcon, HomeIcon, ColorWheelIcon} from '@sanity/icons'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'


export const myStructure = (S, context) => {
  const entities = [
    S.divider(),
    S.listItem()
      .title('Homepage')
      .icon(HomeIcon)
      .child(S.document().schemaType('homepage').documentId('homepage')),
    orderableDocumentListDeskItem({type: 'work', title: 'Archive', icon: ProjectsIcon, S, context}),
    orderableDocumentListDeskItem({type: 'personal', title: 'Personal (to be deleted)', icon: SparklesIcon, S, context}),
    orderableDocumentListDeskItem({type: 'good', title: 'Goods', icon: SparklesIcon, S, context}),
    S.divider(),
    orderableDocumentListDeskItem({type: 'tag', title: 'Tags', icon: TagsIcon, S, context}),
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