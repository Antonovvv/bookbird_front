<script>
	import Vue from 'vue'
	export default {
		onLaunch: function() {
		    this.initNav()
			this.initUser()
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			initNav() {
				uni.getSystemInfo({
					success: function(e) {
						// #ifndef MP
						Vue.prototype.StatusBar = e.statusBarHeight;
						if (e.platform == 'android') {
							Vue.prototype.CustomBar = e.statusBarHeight + 50;
						} else {
							Vue.prototype.CustomBar = e.statusBarHeight + 45;
						};
						// #endif
						// #ifdef MP-WEIXIN
						Vue.prototype.StatusBar = e.statusBarHeight;
						let custom = wx.getMenuButtonBoundingClientRect();
						Vue.prototype.Custom = custom;
						Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
						// #endif       
						// #ifdef MP-ALIPAY
						Vue.prototype.StatusBar = e.statusBarHeight;
						Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
						// #endif
					}
				})
			},
			initUser() {
				var _this = this
				uni.login({
					provider: 'weixin',
					success: function (res) {
						var code = res.code
						console.log(res);
					},
					fail: function (error) {
						console.log(error);
					}
				});
				uni.request({
					url: this.global.serverUrl + "user/",
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						openid: 'test',
						name: 'test',
						studentId: 'test',
						dorm: 'test'
					},
					success: function (res) {
						console.log(res);
					},
					fail: function (error) {
						console.log(error);
					}
				})
			}
		}
	}
</script>

<style>
	@import "colorui/main.css";
	@import "colorui/icon.css";
	/*每个页面公共css */
	body {
		background-color: #F8F8F8;
	}
	
	.cu-bar .search-box {
		height: 70rpx;
		width: 700rpx;
		border: 2rpx solid;
		border-color: #ff6e78;
		background-color: #FFFFFF;
	}
	
</style>
