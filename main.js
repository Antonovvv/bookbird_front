import Vue from 'vue'
import App from './App'

import cuCustom from './colorui/components/cu-custom.vue'
Vue.component('cu-custom',cuCustom)
import yNavbar from './components/y-navbar/y-navbar.vue'
Vue.component('y-navbar', yNavbar)

Vue.config.productionTip = false
Vue.prototype.global = {
	serverUrl: "https://www.bookbird.cn/api/mp/",
	bucketUrl: "http://q3vy3pdtr.bkt.clouddn.com/",
	nickname: '',
	token: '',
	isAuthorized: false
}
Vue.prototype.test = {
	searchList: [
					{
						name: "微积分",
						bookId: "",
						img: "../../static/book.png",
						sale: 4.00,
						author: "李军",
						publisher: "上海译文出版社",
						new: 2,
						dorm: "韵苑23栋"
					},
					{
						name: "微积分",
						bookId: "",
						img: "../../static/book.png",
						sale: 4.50,
						author: "李军",
						publisher: "上海译文出版社",
						new: 3,
						dorm: "韵苑21栋"
					},
					{
						name: "电路理论",
						bookId: "",
						img: "../../static/bird_logo.jpg",
						sale: 4.00,
						author: "汪健",
						publisher: "清华大学出版社",
						new: 1,
						dorm: "韵苑11栋"
					},
					{
						name: "通信电子线路",
						bookId: "",
						img: "../../static/bird_logo.jpg",
						sale: 6.50,
						author: "严国萍",
						publisher: "科学出版社",
						new: 2,
						dorm: "韵苑23栋"
					},
					{
						name: "数据结构",
						bookId: "",
						img: "../../static/bird_logo.jpg",
						sale: 5.50,
						author: "严蔚敏",
						publisher: "清华大学出版社",
						new: 1,
						dorm: "韵苑7栋"
					},{
						name: "计算机网络",
						bookId: "",
						img: "../../static/bird_logo.jpg",
						sale: 9.50,
						author: "吴功宜",
						publisher: "清华大学出版社",
						new: 2,
						dorm: "韵苑16栋"
					},{
						name: "电磁场与电磁波",
						img: "../../static/bird_logo.jpg",
						bookId: "",
						sale: 3.00,
						author: "沈熙宁",
						publisher: "科学出版社",
						new: 0,
						dorm: "韵苑19栋"
					}
				],
	cartList: [
					{
						name: "微积分",
						bookId: "",
						img: "../../static/book.png",
						sale: 6.00,
						author: "李军",
						publisher: "上海译文出版社",
						addr: '韵苑23栋',
						checked: true,
						valid: true
					},
					{
						name: "飞鸟集",
						bookId: "",
						img: "../../static/bird_logo.jpg",
						sale: 6.00,
						author: "李军",
						publisher: "上海译文出版社",
						addr: '韵苑23栋',
						checked: false,
						valid: false
					},
					{
						name: "微积分",
						bookId: "",
						img: "../../static/bird_logo.jpg",
						sale: 6.00,
						author: "李军",
						publisher: "上海译文出版社",
						addr: '韵苑23栋',
						checked: false,
						valid: true
					},
					{
						name: "微积分",
						bookId: "",
						img: "../../static/bird_logo.jpg",
						sale: 6.00,
						author: "李军",
						publisher: "上海译文出版社",
						addr: '韵苑23栋',
						checked: false,
						valid: true
					}
				]
}
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
