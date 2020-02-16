<template>
	<view>
		<nav-bar fontColor="#727272">送单</nav-bar>
		<text class="test">测试</text>
		<view class="send-confirm">
			<button class="cu-btn round confirm-button" @tap="confirm">已送达</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderId: ''
			}
		},
		onLoad(option) {
			this.orderId = option.orderId
			console.log(this.orderId);
		},
		methods: {
			confirm() {
				var _this = this
				var token = uni.getStorageSync('token')
				this.isUploading = true
				uni.request({
					url: this.global.serverUrl + "order",
					method: 'PUT',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: token,
						orderId: this.orderId,
						action: 'send'
					},
					success: function (res) {
						if (res.statusCode == 200) {
							uni.showToast({title: '已送达'})
							setTimeout(function () {
								uni.navigateBack({})
							}, 1500)
						} else {
							console.log('request faild')
						}
					}
				})
			}
		}
	}
</script>

<style>
	.test {
		color: #576B95;
		font-size: 48rpx;
		position: absolute;
		top: 200rpx;
		text-align: center;
	}
	
	.send-confirm {
		width: 100%;
		position: absolute;
		bottom: 80rpx;
		display: flex;
		justify-content: center;
	}
	.send-confirm .confirm-button {
		width: 500rpx;
		height: 100rpx;
		background-color: #FF6E78;
		color: #FFFFFF;
		font-size: 42rpx;
	}
</style>
