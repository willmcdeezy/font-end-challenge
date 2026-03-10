import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases as mdiSvgAliases, mdi as mdiSvgSet } from 'vuetify/iconsets/mdi-svg'
import { mdiDomain, mdiMapMarker } from '@mdi/js'

export default createVuetify({
  components,
  directives,
  locale: {
    locale: 'en',
    fallback: 'en',
  },
  icons: {
    defaultSet: 'mdi',
    aliases: {
      ...mdiSvgAliases,
      domain: `svg:${mdiDomain}`,
      'map-marker': `svg:${mdiMapMarker}`,
    },
    sets: {
      mdi: mdiSvgSet,
    },
  },
})
