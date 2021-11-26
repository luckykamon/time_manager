import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router/router'
import store from './store/'
import DatetimePicker from 'vuetify-datetime-picker'
//import { Ionic } from '@ionic/vue';


Vue.config.productionTip = false
Vue.use(DatetimePicker)
//Vue.use(Ionic);


new Vue({
  vuetify,
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
