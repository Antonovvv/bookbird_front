<script>
	import Vue from 'vue'
	export default {
		onLaunch: function() {
		    this.initNav()
			this.initUser()
		},
		onShow: function() {
			console.log('App Show')
			if ((!this.StatusBar) || (!this.CustomBar)) {
				this.initNav()
			}
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			initNav() {
				uni.getSystemInfo({
					success: function(e) {
						//console.log(e.statusBarHeight);
						/*
						// #ifndef MP
						Vue.prototype.StatusBar = e.statusBarHeight;
						if (e.platform == 'android') {
							Vue.prototype.CustomBar = e.statusBarHeight + 50;
						} else {
							Vue.prototype.CustomBar = e.statusBarHeight + 45;
						};
						// #endif
						*/
						
						// #ifdef MP-WEIXIN
						Vue.prototype.StatusBar = e.statusBarHeight;
						setTimeout(function() {
							let custom = wx.getMenuButtonBoundingClientRect();
							Vue.prototype.Custom = custom;
							Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
						}, 100)
						
						//console.log(this.StatusBar, this.CustomBar);
						// #endif
						
						// #ifdef MP-ALIPAY
						Vue.prototype.StatusBar = e.statusBarHeight;
						Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
						// #endif
						
						//console.log(this.StatusBar, this.CustomBar);
					}
				})
			},
			initUser() {
				var _this = this
				uni.login({
					provider: 'weixin',
					success: function (res) {
						var code = res.code
						//console.log(code);
						uni.request({
							url: _this.global.serverUrl + "user/login",
							data: {
								code: code
							},
							success: function (res) {
								//console.log(res.data);
								if (res.statusCode == 200 || res.statusCode == 201) {
									var token = res.data.token
									_this.global.token = token
									uni.setStorage({
										key: 'token',
										data: token,
										success() {
											console.log('storaged token: ' + token);
										}
									})
								} else {
									uni.showToast({
										title: '获取用户失败！请重新进入小程序',
										duration: 3000,
										icon: 'none'
									})
								}
							},
							fail: function (error) {
								console.log(error);
							}
						})
					},
					fail: function (error) {
						console.log(error);
					}
				});
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
