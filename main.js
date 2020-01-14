import Vue from 'vue'
import App from './App'

import cuCustom from './colorui/components/cu-custom.vue'
Vue.component('cu-custom',cuCustom)
import yNavbar from './components/y-navbar/y-navbar.vue'
Vue.component('y-navbar', yNavbar)

Vue.config.productionTip = false
Vue.prototype.global = {
	serverUrl: "https://www.bookbird.cn/api/mp/",
	nickname: '',
	openid: 'test'
}
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
