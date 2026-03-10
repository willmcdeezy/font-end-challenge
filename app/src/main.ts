import 'vuetify/styles'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Highcharts from 'highcharts'
import HighchartsVue from 'highcharts-vue'
import vuetify from './plugins/vuetify'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(HighchartsVue, { highcharts: Highcharts })

app.mount('#app')
