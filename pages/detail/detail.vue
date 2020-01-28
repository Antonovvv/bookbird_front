<template>
	<view class="content">
		<cu-custom bgColor="bg-white" :isBack="true">
			<block slot="content">详情</block>
		</cu-custom>
		
		<view class="image-box">
			<image :src="postInfo.imageUrl" class="post-image" mode="aspectFit"/>
		</view>
		
		<view class="info-box">
			<text class="info-title">{{postInfo.bookName}}</text>
			<text class="info-sale">价格：￥{{postInfo.sale.toFixed(2)}}</text>
			<view class="info-post">
				<text>成色：{{newLevel[postInfo.new]}}</text>
				<text>楼栋：{{postInfo.addr}}</text>
			</view>
			<view class="info-book">
				<text>作者：{{postInfo.author}}</text>
				<text>出版社：{{postInfo.publisher}}</text>
				<text>原价：{{postInfo.originalPrice}}</text>
				<text>出版时间：{{postInfo.pubdate}}</text>
			</view>
		</view>
		
		<view class="detail-tabbar">
			<view class="action-left">
				<view class="cuIcon-home" @tap="backHome"></view>
				<view class="action-line"/>
				<view class="cuIcon-goods" @tap="goCart"></view>
			</view>
			<view class="action-right">
				<button class="cart-button" :class="inCart ? 'added' : ''"
				@tap="addToCart">{{inCart ? '已加入购物车' : '加入购物车'}}</button>
				<button class="buy-button" @tap="buy">立即购买</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				postInfo: {},
				newLevel: ['五成', '七成', '九成', '全新'],
				inCart: false
			}
		},
		onLoad(option) {
			const postInfo = JSON.parse(decodeURIComponent(option.postInfo))
			if (!postInfo.postId) {
				this.inCart = true
			}
			this.postInfo = postInfo
			this.postInfo.imageUrl = this.global.bucketUrl + post.imageName
		},
		methods: {
			addToCart() {
				if (!this.inCart) {
					var _this = this
					var token = uni.getStorageSync('token')
					uni.request({
						url: this.global.serverUrl + "user/cart",
						method: 'POST',
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						data: {
							token: token,
							postId: this.postInfo.postId
						},
						success: function (res) {
							if (res.statusCode == 201) {
								uni.showToast({
									title: '加入购物车'
								});
								_this.inCart = true
							}
							else if (res.statusCode == 403) {
								uni.showToast({
									title: '已经在购物车中了！',
									duration: 1500,
									icon: 'none'
								});
								_this.inCart = true
							}
							else {
								console.log('add fail');
							}
						},
						fail: function (error) {
							console.error(error)
						}
					})
				}
			},
			buy() {
				if (this.global.isAuthorized) {
					uni.navigateTo({
						url: "../order/buy?postInfo=" + encodeURIComponent(JSON.stringify(this.postInfo))
					})
				} else {
					var _this = this
					uni.showModal({
						title: '提示',
						content: '你还没有进行校园身份认证',
						confirmText: '去认证',
						success: function (res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '../me/auth?authorized=' + _this.global.isAuthorized
								})
							}
						}
					})
				}
				
			},
			backHome() {
				uni.switchTab({
					url: '../shop/shop'
				})
			},
			goCart() {
				uni.switchTab({
					url: '../cart/cart'
				})
			}
		}
	}
</script>

<style>
	button {
		padding: 0;
	}
	button::after {
		border: 0;
	}
	
	.content {
		
	}
	
	.image-box {
		width: 100%;
		height: 426rpx;
		display: flex;
		justify-content: center;
		background-color: #FFFFFF;
	}
	.post-image {
		width: 314rpx;
		height: 380rpx;
		margin-top: 12rpx;
	}
	
	.info-box {
		width: 100%;
		padding: 40rpx 60rpx;
		margin-top: 20rpx;
		display: flex;
		flex-direction: column;
		background-color: #FFFFFF;
		font-size: 32rpx;
		line-height: 60rpx;
	}
	.info-title {
		color: #727272;
		font-size: 40rpx;
	}
	.info-sale {
		color: #FF8F97;
		
	}
	.info-post {
		display: flex;
		flex-direction: column;
		color: #727272;
	}
	.info-book {
		display: flex;
		flex-direction: column;
		color: #A1A1A1;
	}
	
	.detail-tabbar {
		width: 100%;
		height: 120rpx;
		background-color: rgba(255,255,255,1);
		position: fixed;
		left: 0;
		bottom: 0;
		display: flex;
		align-items: center;
	}
	
	.action-left {
		width: 274rpx;
		display: flex;
		justify-content: space-between;
		padding: 0 40rpx;
		font-size: 54rpx;
		color: #727272;
		line-height: 68rpx;
	}
	.action-line {
		width: 2rpx;
		height: 68rpx;
		background-color: #E8E8E8;
	}
	
	.action-right {
		width: 476rpx;
		display: flex;
	}
	.action-right .cart-button {
		width: 246rpx;
		height: 74rpx;
		margin: 0;
		background-color: #FFD803;
		border-radius: 48rpx 0 0 48rpx;
		font-size: 36rpx;
		color: #FFFFFF;
		line-height: 74rpx;
	}
	.cart-button.added {
		background-color: #B3B3B3;
	}
	.action-right .buy-button {
		width: 214rpx;
		height: 74rpx;
		margin-left: 0;
		background-color: #FF6E78;
		border-radius: 0 48rpx 48rpx 0;
		font-size: 36rpx;
		color: #FFFFFF;
		line-height: 74rpx;
	}
</style>
