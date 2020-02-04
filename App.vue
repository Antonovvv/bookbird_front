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
						let custom = wx.getMenuButtonBoundingClientRect();
						setTimeout(function() {
							Vue.prototype.StatusBar = e.statusBarHeight;
							Vue.prototype.Custom = custom;
							Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
						}, 200)
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
									var isAuthorized = res.data.isAuthorized
									_this.global.token = token
									_this.global.isAuthorized = isAuthorized
									uni.setStorage({
										key: 'token',
										data: token,
										success() {
											console.log('storaged token:' + token, 'Authorized:' + isAuthorized);
										}
									})
								} else {
									uni.showToast({title: '获取用户失败！请重新进入小程序', duration: 3000, icon: 'none'})
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
	button {
		padding: 0;
	}
	button::after {
		border: 0;
	}
	
	.search-box {
		height: 70rpx;
		width: 100%
	}
</style>
