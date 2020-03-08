<template>
	<view>
		<nav-bar fontColor="#727272">订单详情</nav-bar>
		<view class="steps">
			<view class="step" v-for="(step, index) in orderSteps" :key="index">
				<view class="step-icon" :class="(orderInfo.status > index) || (index == 3 && orderInfo.status == 3) ? 'cuIcon-roundcheck' : 'cuIcon-round icon-undone'"/>
				<view class="step-text" :class="orderInfo.status == index ? 'now' : 'not'">{{step[orderInfo.status > index ? 1 : 0]}}</view>
			</view>
		</view>
		<view class="container-prepay" v-if="orderInfo.status == 0">
			<view class="prepay-box">
				<image :src="postInfo.imageUrl" class="post-image" mode="aspectFill"></image>
				<view class="post-info">
					<text class="post-title">{{postInfo.bookName}}</text>
					<view class="cu-tag round post-new-tag">{{newLevel[postInfo.new]}}</view>
					<view class="book-info">{{postInfo.author}} 著/{{postInfo.publisher}}</view>
					<view class="post-price">￥{{(postInfo.sale / 100).toFixed(2)}}</view>
				</view>
				<view class="prepay-info">
					<text style="font-size: 36rpx;">待支付</text>
					<view class="prepay-time">
						还剩<countdown :time="orderInfo.remainTime" :hours="false" :isColon="false" :colonSize="20" :size="20" :height="28"
						color="#FFF" colonColor="#FFF" bcolor="transparent" bgcolor="transparent" style="margin: 0 2rpx;"/>自动关闭
					</view>
					<image src="../../static/tabbar/shop_icon.png" class="decoration-1" mode="aspectFill" :animation="decorationAnimation[0]"/>
					<image src="../../static/tabbar/sell_icon.png" class="decoration-2" mode="aspectFill" :animation="decorationAnimation[1]"/>
				</view>
			</view>
			<view class="prepay-action">
				<button class="cu-btn round cancel-button" @tap="orderCancel">取消订单</button>
				<button class="cu-btn round confirm-button" @tap="requestPayment">继续支付</button>
			</view>
		</view>
		<view class="container-formal" v-if="orderInfo.status > 0">
			
		</view>
	</view>
</template>

<script>
	import countdown from "@/components/countdown/countdown"
	export default {
		components: {countdown},
		data() {
			return {
				postInfo: {
					bookName: "微积分",
					imageUrl: '../../static/book.png',
					sale: 800,
					new: 2,
					author: '李军',
					publisher: '上海译文出版社'
				},
				orderInfo: {
					id: 'xxx',
					dealTime: '2020.3.8 03:08',
					status: 0,
					remainTime: 900,
					prepayData: {}
				},
				orderSteps: {
					0: ['待支付', '已支付'],
					1: ['待配送', '已送达'],
					2: ['待取书', '已取书'],
					3: ['订单完成', '订单完成']
				},
				newLevel: ['五成', '七成', '九成', '全新'],
				decorationAnimation: [{}, {}],
				animation: null,
				ticktock: null
			}
		},
		onLoad() {
			if (this.orderInfo.status == 0) {
				this.decorationLoop()
			}
		},
		methods: {
			requestPayment() {
				uni.requestPayment({
					timeStamp: orderInfo.prepayData.timeStamp,
					nonceStr: orderInfo.prepayData.nonceStr,
					package: orderInfo.prepayData.package,
					signType: 'MD5',
					paySign: orderInfo.prepayData.paySign,
					success: function (res) {
						console.log(res);
					},
					fail: function (error) {
						console.log(error);
					}
				})
			},
			orderCancel() {
				var _this = this
				var token = uni.getStorageSync('token')
				uni.request({
					url: this.global.serverUrl + "user/orders",
					method: 'DELETE',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: token,
						orderId: this.orderInfo.id
					},
					success: function (res) {
						console.log(res.data);
						if (res.statusCode == 200) {
							uni.showToast({title: '订单已取消'})
						} else {
							uni.showToast({title: '取消失败，请稍后再试', duration: 3000, icon: 'none'})
						}
					}
				})
			},
			decorationLoop() {
				var _this = this
				var flag = true
				this.animation = [
					uni.createAnimation({duration: 1000}), 
					uni.createAnimation({duration: 1000})
				]
				this.ticktock = setInterval(function() {
					if (flag) {
						_this.animation[0].rotate(-36).step()
						_this.animation[1].rotate(36).step()
					} else {
						_this.animation[0].rotate(-12).step()
						_this.animation[1].rotate(12).step()
					}
					for (let i in _this.animation) {
						_this.decorationAnimation[i] = _this.animation[i].export()
					}
					flag = !flag
				}, 1000)
			},
		}
	}
</script>

<style>
	.steps {
		display: flex;
		justify-content: center;
		padding: 48rpx 40rpx 30rpx 40rpx;
	}
	.steps .step {
		text-align: center;
		margin: 0 auto;
		width: 112rpx;
		position: relative;
	}
	.step::before {
		content: "";
		width: 140rpx;
		height: 2rpx;
		border-top: 2rpx solid #888888;
		position: absolute;
		top: 13rpx;
		left: 70rpx;
	}
	.step:last-child::before {
		display: none;
	}
	.icon-undone {
		
	}
	.step .step-text {
		
	}
	.step-text.not {
		color: #C6C6C6;
	}
	.step-text.now {
		color: #FF8F97;
	}
	
	.container-prepay {
		width: 100%;
	}
	.prepay-box {
		width: 686rpx;
		height: 622rpx;
		background-color: #FFFFFF;
		border-radius: 18rpx;
		margin: 0 auto;
		display: flex;
		justify-content: center;
		position: relative;
	}
	.prepay-box .post-image {
		width: 250rpx;
		height: 320rpx;
		position: absolute;
		top: 60rpx;
	}
	.prepay-box .post-info {
		width: 100%;
		height: 120rpx;
		position: absolute;
		bottom: 120rpx;
		padding-top: 20rpx;
		padding-left: 76rpx;
	}
	
	.post-info .post-title {
		color: #727272;
		font-size: 32rpx;
	}
	.post-info .post-new-tag {
		color: #727272;
		margin-left: 14rpx;
		height: 36rpx;
		bottom: 4rpx;
	}
	.post-info .book-info {
		color: #727272;
		font-size: 24rpx;
	}
	.post-info .post-price {
		color: #FF8F97;
		font-size: 40rpx;
		position: absolute;
		top: 20rpx;
		right: 46rpx;
	}
	.prepay-box .prepay-info {
		width: 100%;
		height: 120rpx;
		position: absolute;
		bottom: 0;
		background-color: #FF8F97;
		border-radius: 18rpx;
		padding-top: 20rpx;
		padding-left: 76rpx;
		color: #FFFFFF;
	}
	.prepay-info .prepay-time {
		font-size: 20rpx;
		display: flex;
	}
	.prepay-info .decoration-1 {
		width: 96rpx;
		height: 96rpx;
		position: absolute;
		bottom: 8rpx;
		left: 454rpx;
		transform: rotate(-24deg);
		background-color: #FFFFFF;
	}
	.prepay-info .decoration-2 {
		width: 84rpx;
		height: 84rpx;
		position: absolute;
		bottom: 6rpx;
		left: 558rpx;
		transform: rotate(24deg);
		background-color: #FFFFFF;
	}
	
	.prepay-action {
		width: 100%;
		padding: 0 100rpx;
		display: flex;
		justify-content: space-between;
		position: fixed;
		bottom: 200rpx;
	}
	.prepay-action .cancel-button {
		width: 216rpx;
		height: 72rpx;
		border: 2rpx solid #727272;
		color: #727272;
		font-size: 32rpx;
		background-color: #FFFFFF;
	}
	.prepay-action .confirm-button {
		width: 216rpx;
		height: 72rpx;
		color: #FFFFFF;
		font-size: 32rpx;
		background-color: #FF8F97;
	}
</style>
