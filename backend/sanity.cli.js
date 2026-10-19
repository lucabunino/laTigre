import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'y48jewos',
    dataset: 'production'
  },
  studioHost: 'latigre',
  deployment: {
    appId: 'u0ho6ky7j4gw2ckbxg06u77r',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/cli#auto-updates
     */
    autoUpdates: false,
  },
})
