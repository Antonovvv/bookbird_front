<template>
	<view>
		<cu-custom bgColor="bg-white">
			<block slot="content">卖书给BookBird</block>
		</cu-custom>
		<!--卖书引导-->
		<view class="guide-content">
			<view class="guide-block">
				<view class="guide-item">
					<text class="guide-index">1</text>
					<image src="../../static/sell_pic1.png" class="guide-image"/>
					<text class="guide-text">扫码看回收价</text>
				</view>
				<view class="guide-item">
					<text class="guide-index">2</text>
					<image src="../../static/sell_pic1.png" class="guide-image"/>
					<text class="guide-text">上传一张照片</text>
				</view>
				<view class="guide-item">
					<text class="guide-index">3</text>
					<image src="../../static/sell_pic3.png" class="guide-image"/>
					<text class="guide-text">卖书到账</text>
				</view>
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
				serverUrl: "https://www.bookbird.cn/api/mp/book/"
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
						_this.queryBook(res.result)//扫码得到isbn码，提交查询
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
					url: _this.serverUrl + "isbn/" + code,
					//header[content-type]默认为application/json，请求会被拒绝
					header: {
						'content-type': 'json'
					},
					success: function (res) {
						uni.hideLoading()
						console.log(res)
						if(res.statusCode == 200) {
							//console.log("剩余次数:", res.header['X-Ratelimit-Remaining2'])
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
					},
					fail: function() {
						uni.hideLoading()
					}
				})
			},
			
		}
	}
</script>

<style>
	.guide-content {
		margin-top: 20rpx;
		display: flex;
	}
	
	.guide-content .guide-block {
		width: 100%;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
	}
	
	.guide-item {
		padding: 40rpx 96rpx 0 58rpx;
		display: flex;
		align-items: center;
	}
	
	.guide-index {
		color: #5F8C48;
		font-size: 66rpx;
		margin-right: 31rpx;
	}
	
	.guide-image {
		width: 230rpx;
		height: 230rpx;
		background-color: #FFFFFF;
		border: 1rpx solid #979797;
		border-radius: 8rpx;
	}
	
	.guide-text {
		color: #727272;
		font-size: 36rpx;
		margin-left: 76rpx;
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
