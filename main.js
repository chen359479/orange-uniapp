import Vue from 'vue'
import App from './App'
import util from './static/js/util.js'
import uView from 'uview-ui';

let mpShare = require('uview-ui/libs/mixin/mpShare.js');


Vue.mixin(mpShare)
Vue.use(uView);

Vue.config.productionTip = false;
 // 替换成你的 IP地址或域名
Vue.prototype.$url='https://www.ktkyio.xyz'
Vue.prototype.util=util

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
