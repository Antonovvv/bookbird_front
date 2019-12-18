<template>
	<view>
		<cu-custom bgColor="bg-white">
			<block slot="content">卖书</block>
		</cu-custom>
		<!--卖书引导-->
		<view class="guide-content">
			<view class="guide-block">
				<image src="../../static/guide.png" class="sell-guide-image"></image>
			</view>
		</view>
		
		<view class="action-box">
			<button class="cu-btn round scan-button" @tap="scanQR">
				<text class="cuIcon-scan scan-icon"></text><text space="ensp">{{space}}扫码卖书</text></button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				modalName: null,
				space: ' ',
				doubanUrl: "https://douban.uieee.com/v2/book/",
			}
		},
		onLoad() {
			
		},
		methods: {
			
			scanQR() {
				var _this = this
				uni.scanCode({
					success: function (res) {
						//console.log(res.result)
						uni.showLoading({})
						_this.queryBook(res.result)
					},
					fail: function () {
						uni.showToast({
							title: '无法识别条码',
							duration: 3000,
							icon: 'none'
						})
						console.log('scan fail')
					}
				})
			},
			queryBook(code) {
				var _this = this
				uni.request({
					url: _this.doubanUrl + "isbn/" + code,
					//header[content-type]默认为application/json，请求会被拒绝
					header: {
						'content-type': 'json'
					},
					success: function (res) {
						uni.hideLoading()
						if(res.errMsg == "request:ok") {
							console.log("剩余次数:", res.header['X-Ratelimit-Remaining2'])
							uni.navigateTo({
								url: "upload?book=" + encodeURIComponent(JSON.stringify(res.data))
							})
						}
						else {
							uni.showToast({
								title: "豆瓣不理我们啦！",
								duration: 3000,
								icon: 'none'
							})
						}
					}
				})
			},
			
		}
	}
</script>

<style>
	.guide-content {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.guide-content .guide-block {
		margin: 100rpx 0;
	}
	
	.sell-guide-image {
		width: 510rpx;
		height: 756rpx;
	}
	
	.action-box {
		width: 100%;
		height: 140rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: fixed;
		bottom: 50rpx;
	}
	
	.action-box .scan-button {
		width: 472rpx;
		height: 102rpx;
		background-color: #FF6E78;
		font-size: 36rpx;
		color: #FFFFFF;
	}
	
	.cu-btn .scan-icon {
		font-size: 50rpx;
	}
	
	
</style>
