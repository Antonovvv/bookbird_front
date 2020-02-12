<template>
	<view class="order-box">
		<image :src="item.imageUrl" class="order-image"/>
		<view class="order-info">
			<text class="order-title">{{item.bookName}}</text>
			<view class="order-info-time"><text class="cuIcon-time" style="margin-right: 10rpx;"/>{{item.deadline}}</view>
			<view class="order-info-addr"><text class="cuIcon-location" style="margin-right: 10rpx;"/>{{item.addr}}</view>
		</view>
		<view class="order-step" v-if="mode == 'dynamic'">
			
		</view>
		<view class="order-status" v-if="mode == 'sold'">
			
		</view>
		<view class="order-action" v-if="mode == 'posted'">
			
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
		}
	}
</script>

<style>
	.order-box {
		width: 700rpx;
		height: 188rpx;
		background-color: #FFFFFF;
		border-radius: 18rpx;
		display: flex;
		align-items: center;
		margin-top: 18rpx;
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
	.order-step {
		
	}
	.order-status {
		
	}
	.order-action {
		
	}
</style>
