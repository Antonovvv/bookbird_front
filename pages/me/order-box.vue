<template>
	<view class="order">
		<view class="order-box">
			<image :src="item.imageUrl" class="order-image" mode="aspectFill"/>
			<view class="order-info" v-if="mode != 'post'">
				<text class="order-title">{{item.bookName}}</text>
				<view class="order-info-time"><text class="cuIcon-time" style="margin-right: 10rpx;"/>{{item.deadline}}</view>
				<view class="order-info-addr"><text class="cuIcon-location" style="margin-right: 10rpx;"/>{{item.addr}}</view>
			</view>
			<view class="post-info" v-if="mode == 'post'">
				<text class="post-title">{{item.bookName}}</text>
				<view class="cu-tag round post-info-new">{{newLevel[item.new]}}</view>
				<view class="post-info-price">￥{{(item.sale).toFixed(2)}}</view>
			</view>
			<view class="order-steps" v-if="mode == 'dynamic'">
				<view class="step" v-for="(step, index) in dynamicSteps" :key="index">
					<text class="step-icon" :class="item.status >= index ? 'cuIcon-roundcheck' : 'icon-undone'" style="margin-right: 12rpx;"/>
					<text class="step-done" :class="item.status == index ? 'step-now' : ''" v-if="item.status >= index">{{step}}</text>
					<button class="cu-btn round undone-button" v-if="index == 1 && item.status == 0 && item.identity == 'seller'" @tap="sendConfirm">确认已送达</button>
					<button class="cu-btn round undone-button" v-if="index == 2 && item.status == 1 && item.identity == 'buyer'" @tap="receiveConfirm">确认已收货</button>
				</view>
			</view>
			<view class="order-status" v-if="mode == 'deal'">
				<view class="status">{{orderStatus[item.status]}}</view>
				<button class="cu-btn round confirm-button" v-if="item.status == 0 && item.identity == 'seller'" @tap="sendConfirm">确认已送达</button>
				<button class="cu-btn round confirm-button" v-if="item.status == 1 && item.identity == 'buyer'" @tap="receiveConfirm">确认已收货</button>
				<view class="price">￥{{(item.sale / 100).toFixed(2)}}</view>
			</view>
			<view class="order-action" v-if="mode == 'post'">
				<button class="cu-btn round detail-button" @tap="postDetail">详情</button>
				<button class="cu-btn round delete-button" @tap="postDelete">下架</button>
			</view>
		</view>
		<view class="order-detail" v-if="mode == 'deal'" :style="detailOn ? 'height:90rpx;' : ''">
			<view class="detail-title">订单详情<view class="detail-switch" :animation="switchAnimation" @tap="detailSwitch">
				<text class="cuIcon-unfold"></text></view>
			</view>
			<view class="detail-box" v-if="detailOn">
				<view class="detail-info">
					<text>订单编号:{{item.orderId}}</text>
					<text>交易时间:{{item.orderTime}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			item: {
				type: Object,
				default: function () {return {}}
			},
			mode: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				newLevel: ['五成', '七成', '九成', '全新'],
				dynamicSteps: ['已下单/待配送', '已送达/待收货', '订单已完成'],
				orderStatus: ['待配送', '待取货', '交易完成'],
				switchAnimation: {},
				detailOn: false
			}
		},
		methods: {
			sendConfirm() {
				this.$emit('send-confirm')
				console.log('确认送达');
			},
			receiveConfirm() {
				this.$emit('receive-confirm')
				console.log('确认收货');
			},
			postDetail() {
				this.$emit('post-detail')
			},
			postDelete() {
				this.$emit('post-delete')
			},
			detailSwitch() {
				var animation = uni.createAnimation({
					duration: 300,
					transformOrigin: "center center"
				})
				if (!this.detailOn) {
					animation.rotate(-180).translateY(2).step()
					this.switchAnimation = animation.export()
					this.detailOn = true
					console.log('on');
				} else {
					animation.rotate(0).translateY(0).step()
					this.switchAnimation = animation.export()
					this.detailOn = false
					console.log('off');
				}
			}
		}
	}
</script>

<style>
	.order {
		width: 700rpx;
		background-color: #FFFFFF;
		border-radius: 18rpx;
		margin-top: 18rpx;
	}
	
	.order-box {
		width: 700rpx;
		height: 188rpx;
		display: flex;
		align-items: center;
		position: relative;
	}
	.order-image {
		width: 108rpx;
		height: 128rpx;
		margin-left: 48rpx;
	}
	.order-info {
		margin-left: 18rpx;
		height: 132rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.order-title {
		color: #727272;
		font-size: 32rpx;
	}
	.order-info-time {
		color: #727272;
	}
	.order-info-addr {
		color: #727272;
	}
	
	.post-info {
		margin-left: 18rpx;
		height: 132rpx;
		position: relative;
	}
	.post-title {
		color: #727272;
		font-size: 32rpx;
		position: relative;
		top: 4rpx;/*对齐右边标签*/
	}
	.post-info-new {
		border-color: #AAAAAA;
		color: #727272;
		margin-left: 12rpx;
	}
	.post-info-price {
		color: #FF6E78;
		font-size: 40rpx;
		position: absolute;
		bottom: 0;
	}
	
	.order-steps {
		height: 156rpx;
		position: absolute;
		right: 20rpx;
		top: 14rpx;
		display: flex;
		flex-direction: column;
	}
	.order-steps .step {
		flex: 1;
		position: relative;
		min-height: 62rpx;
	}
	.step-icon[class*="-roundcheck"] {
		font-size: 30rpx;
	}
	.step-icon.icon-undone {
		width: 26rpx;
		height: 26rpx;
		border-radius: 50%;
		background-color: #D3D3D3;
		position: absolute;
		left: 2rpx;
		top: 6rpx;
	}
	.step-done {
		color: #C6C6C6;
	}
	.step-now {
		color: #FF8F97;
	}
	.step .undone-button {
		width: 180rpx;
		height: 44rpx;
		background-color: #FF8F97;
		color: #FFFFFF;
		font-size: 28rpx;
		margin: 0;/*覆盖默认样式*/
		margin-left: auto;/*左边距由其他元素决定*/
		bottom: 4rpx;/*上移，对齐icon*/
		left: 40rpx;
		padding: 0;
	}
	.order-steps .step::before {
		content: "";
		width: 2rpx;
		height: 32rpx;
		border-right: 2rpx solid #888888;
		position: absolute;
		left: 12rpx;
		bottom: 58rpx;
	}
	.step:first-child::before {
		display: none;
	}
	
	.order-status {
		height: 156rpx;
		position: absolute;
		right: 20rpx;
		text-align: right;
	}
	.order-status .status {
		color: #FF6E78;
	}
	.order-status .confirm-button {
		width: 180rpx;
		height: 44rpx;
		background-color: #FF8F97;
		color: #FFFFFF;
		font-size: 28rpx;
		margin-top: 20rpx;
		padding: 0;
	}
	.order-status .price {
		color: #FF6E78;
		font-size: 40rpx;
		position: absolute;
		bottom: -33rpx;
		right: 0;
	}
	
	.order-detail {
		width: 700rpx;
		height: 24rpx;
		position: relative;
		bottom: 20rpx;
		transition: all;
		transition-duration: 300ms;
	}
	.detail-title {
		margin-left: 46rpx;
		color: #CBCBCB;
		font-size: 24rpx;
		display: flex;
	}
	.detail-switch {
		font-size: 28rpx;
		margin-left: 10rpx;
		position: relative;
		top: 2rpx;
	}
	.detail-box {
		border-top: 2rpx solid #E3E3E3;
	}
	.detail-info {
		margin-left: 46rpx;
		margin-top: 2rpx;
		display: flex;
		flex-direction: column;
		color: #CBCBCB;
		font-size: 24rpx;
	}
	
	.order-action {
		width: 220rpx;
		position: absolute;
		right: 20rpx;
		bottom: 20rpx;
		display: flex;
		justify-content: space-between;
	}
	.order-action .detail-button {
		width: 100rpx;
		height: 50rpx;
		border: 2rpx solid #FF8F97;
		background-color: #FFFFFF;
		color: #FF8F97;
		font-size: 28rpx;
		padding: 0;
	}
	.order-action .delete-button {
		width: 100rpx;
		height: 50rpx;
		border: 2rpx solid #FF8F97;
		background-color: #FF8F97;
		color: #FFFFFF;
		font-size: 28rpx;
		padding: 0;
	}
</style>
