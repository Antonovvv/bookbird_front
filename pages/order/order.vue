<template>
	<view>
		<nav-bar fontColor="#727272">订单详情</nav-bar>
		<view class="steps">
			<view class="step" v-for="(step, index) in orderSteps" :key="index">
				<view class="step-icon" :class="(orderInfo.status > index) || (index == 3 && orderInfo.status == 3) ? 'cuIcon-roundcheckfill' : 'cuIcon-round icon-undone'"/>
				<view class="step-text" :class="orderInfo.status == index ? 'now' : 'not'">{{step[orderInfo.status > index ? 1 : 0]}}</view>
			</view>
		</view>
		<!--待支付状态-->
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
		<!--已支付状态-->
		<view class="container-formal" v-if="orderInfo.status > 0">
			<view class="post-box">
				<image :src="postInfo.imageUrl" class="post-image" mode="aspectFill"/>
				<view class="post-info">
					<text class="post-title">{{postInfo.bookName}}</text>
					<view class="cu-tag round post-new-tag">{{newLevel[postInfo.new]}}</view>
					<view class="book-info">{{postInfo.author}} 著/{{postInfo.publisher}}</view>
					<text class="order-price-text">价格</text>
				</view>
				<view class="order-price">￥{{(postInfo.sale / 100).toFixed(2)}}</view>
			</view>
			<view class="delivery-box">
				<view class="delivery-title">配送信息</view>
				<view class="delivery-info">
					<view class="delivery-time"><text class="cuIcon-time" style="margin-right: 8rpx;"/>{{orderInfo.deadline}}</view>
					<view class="delivery-addr"><text class="cuIcon-location" style="margin-right: 8rpx;"/>{{postInfo.addr}}</view>
				</view>
				<view class="image-box" @tap="viewImage" v-if="orderInfo.deliveryImage">
					<image :src="orderInfo.deliveryImage" mode="aspectFill" class="picture"/>
					<view class="cu-tag" @tap.stop="deleteImage"><text class='cuIcon-close'/></view>
				</view>
				<view class="camera-box" @tap="chooseImage" v-if="!orderInfo.deliveryImage"><text class="cuIcon-camera"/></view>
				<button class="cu-btn round confirm-button" v-if="orderInfo.status == 1 && orderInfo.identity == 'seller'">确认已送达</button>
				<button class="cu-btn round confirm-button" v-if="orderInfo.status == 2 && orderInfo.identity == 'buyer'">确认已取书</button>
			</view>
			<view class="order-box">
				<view class="order-title">订单信息</view>
			</view>
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
					addr: '韵苑23栋',
					author: '李军',
					publisher: '上海译文出版社'
				},
				orderInfo: {
					orderId: 'xxx',
					dealTime: '2020.3.8 03:08',
					deadline: '3月15日22:00前',
					status: 1,
					identity: 'seller',
					remainTime: 900,
					prepayData: {},
					deliveryImage: ""	//配送照片
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
		onLoad(option) {
			this.getOrderData(option.orderId)
		},
		methods: {
			getOrderData(orderId) {
				var _this = this
				var token = uni.getStorageSync('token')
				uni.request({
					url: this.global.serverUrl + "order",
					data: {
						token: token,
						orderId: orderId
					},
					success: function (res) {
						console.log(res.data);
						if (res.statusCode == 200) {
							_this.postInfo = res.data.postInfo
							_this.orderInfo = res.data.orderInfo
							if (_this.orderInfo.status == 0) {
								_this.decorationLoop()
							}
						} else {
							uni.showToast({title: '获取订单失败', duration: 3000, icon: 'none'})
						}
					}
				})
			},
			requestPayment() {
				uni.requestPayment({
					timeStamp: this.orderInfo.prepayData.timeStamp,
					nonceStr: this.orderInfo.prepayData.nonceStr,
					package: this.orderInfo.prepayData.package,
					signType: 'MD5',
					paySign: this.orderInfo.prepayData.paySign,
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
						orderId: this.orderInfo.orderId
					},
					success: function (res) {
						console.log(res.data);
						if (res.statusCode == 200) {
							_this.orderInfo.prepayData = {}	//清空支付数据	TODO:支付前才请求支付数据
							uni.showToast({title: '订单已取消'})
						} else {
							uni.showToast({title: '取消失败，请稍后再试', duration: 3000, icon: 'none'})
						}
					}
				})
			},
			chooseImage() {
				var _this = this
				if (!this.orderInfo.deliveryImage) {
					uni.chooseImage({
						count: 1,
						sourceType: ['camera', 'album'],
						success: function (res) {
							_this.orderInfo.deliveryImage = res.tempFilePaths[0]
						}
					})
				}
			},
			viewImage() {
				uni.previewImage({urls: [this.orderInfo.deliveryImage]})
			},
			deleteImage() {
				this.orderInfo.deliveryImage = ""
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
		top: 14rpx;
		left: 70rpx;
	}
	.step:last-child::before {
		display: none;
	}
	.step .step-icon {
		color: #C6C6C6;
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
	
	.container-formal {
		width: 100%;
	}
	.container-formal .post-box {
		width: 700rpx;
		height: 192rpx;
		background-color: #FFFFFF;
		border-radius: 18rpx;
		margin: 0 auto;
		display: flex;
		align-items: center;
		padding-left: 48rpx;
		position: relative;
	}
	.post-box .post-image {
		width: 106rpx;
		height: 128rpx;
	}
	.post-box .post-info {
		margin-left: 20rpx;
		height: 128rpx;
		position: relative;
	}
	.post-info .order-price-text {
		color: #727272;
		font-size: 24rpx;
		margin-top: 12rpx;
		position: absolute;
		bottom: 0;
	}
	.post-box .order-price {
		color: #FF8F97;
		font-size: 40rpx;
		line-height: 40rpx;
		position: absolute;
		bottom: 16rpx;
		right: 24rpx;
	}
	
	.container-formal .delivery-box {
		width: 700rpx;
		height: 500rpx;
		background-color: #FFFFFF;
		border-radius: 18rpx;
		margin: 28rpx auto;
		padding: 22rpx 26rpx;
	}
	.delivery-box .delivery-title {
		color: #FF6E78;
	}
	.delivery-box .delivery-info {
		margin-top: 20rpx;
		margin-bottom: 32rpx;
		display: flex;
	}
	.delivery-time {
		color: #727272;
	}
	.delivery-addr {
		color: #727272;
		margin-left: 100rpx;
	}
	.delivery-box .image-box {
		width: 254rpx;
		height: 254rpx;
		margin: 0 auto;
		position: relative;
	}
	.image-box .picture {
		width: 254rpx;
		height: 254rpx;
	}
	.image-box .cu-tag {
		position: absolute;
		right: 0;
		top: 0;
		padding: 6upx 12upx;
		height: auto;
		color: #FFFFFF;
		background-color: rgba(160, 160, 160, 0.5) !important;
	}
	.delivery-box .camera-box {
		width: 254rpx;
		height: 254rpx;
		border-radius: 16rpx;
		background-color: #F0F0F0;
		margin: 0 auto;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #FFFFFF;
		font-size: 128rpx;
	}
	
	.container-formal .order-box {
		width: 700rpx;
		height: 150rpx;
		background-color: #FFFFFF;
		border-radius: 18rpx;
		margin: 0 auto;
		padding: 22rpx 26rpx;
	}
	.order-box .order-title {
		color: #FF6E78;
	}
</style>
