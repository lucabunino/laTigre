import './structure.css';
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {myStructure} from './structure.js'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {colorInput} from '@sanity/color-input'
import {media} from 'sanity-plugin-media'

const singletonActions = new Set(['publish', 'discardChanges', 'restore'])
const singletonTypes = new Set(['homepage', 'network'])

export default defineConfig({
  name: 'default',
  title: 'LaTigre',

  projectId: 'y48jewos',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: myStructure,
    }),
    visionTool(),
    media(),
    colorInput(),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  // schema: {
  //   types: (previousTypes) => {
  //       return [
  //           ...previousTypes,
  //           {
  //               name: "category",
  //               title: "Category",
  //               type: "document",
  //               // Optional: The plugin also exports a set of 'orderings' for use in other Document Lists
  //               // https://www.sanity.io/docs/sort-orders
  //               orderings: [orderRankOrdering],
  //               fields: [
  //                   // Minimum required configuration
  //                   orderRankField({ type: "category" }),

  //                   // OR placing new documents on top
  //                   orderRankField({ type: "category", newItemPosition: "before" }),

  //                   // OR you can override _some_ of the field settings
  //                   orderRankField({ type: "category", hidden: false }),

  //                   // ...all other fields
  //               ],
  //           },
  //       ]
  //   }
  // },
  document: {
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => action && singletonActions.has(action))
        : input,
  },
})