<template>
	<view>
		<nav-bar fontColor="#727272">订单</nav-bar>
		<view class="info-box">
			<view class="info-form">
				<view class="form-title">书名</view>
				<view class="form-content">{{postInfo.bookName}}</view>
			</view>
			<view class="info-form">
				<view class="form-title">价格</view>
				<view class="form-content">￥{{postInfo.sale.toFixed(2)}}</view>
			</view>
			<view class="info-form">
				<view class="form-title">交易地址</view>
				<view class="form-content">{{postInfo.addr}}</view>
			</view>
			<view class="info-form">
				<view class="form-title">最晚送达时间</view>
				<view class="form-content">
					<picker @change="timePicked" :value="timeIndex" :range="arriveTimes">
						<view class="time-picker">
							{{timeIndex > -1 ? arriveTimes[timeIndex] : '请选择最晚送达时间'}}
						</view>
					</picker>
				</view>
			</view>
		</view>
		<view class="action-box">
			<button class="cu-btn round cancle" @tap="cancle">取消订单</button>
			<button class="cu-btn round confirm" @tap="confirm">付款</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				postInfo: {},
				timeIndex: -1,
				arriveTimes: ['今日22:00前', '明日22:00前']
			}
		},
		onLoad(option) {
			const postInfo = JSON.parse(decodeURIComponent(option.postInfo))
			this.postInfo = postInfo
		},
		methods: {
			timePicked(e) {
				this.timeIndex = e.detail.value
			},
			confirm() {
				uni.showToast({
					title: '发起付款'
				})
			},
			cancle() {
				uni.navigateBack({})
			}
		}
	}
</script>

<style>
	.info-box {
	}
	.info-form {
		display: flex;
		align-items: center;
		padding: 0 36rpx;
		min-height: 100rpx;
		background-color: #FFFFFF;
	}
	.form-title {
		text-align: justify;
		padding-right: 30rpx;
		font-size: 32rpx;
		position: relative;
		color: #636363;
		line-height: 100rpx;
	}
	.form-content {
		flex: 1;
		font-size: 32rpx;
		color: #9B9B9B;
		text-align: right;
		line-height: 100rpx;
	}
	.time-picker {
		line-height: 100rpx;
	}
	.time-picker:after {
		font-family: cuIcon;
		content: "\e6a3";
		font-size: 34upx;
		color: #8799a3;
		line-height: 100upx;
		width: 60upx;
		text-align: center;
	}
	.info-form input {
		flex: 1;
		font-size: 32rpx;
		color: #9B9B9B;
		text-align: right;
	}
	.info-form+.info-form {
		border-top: 2rpx solid #EFEFEF;
	}
	
	.action-box {
		width: 100%;
		display: flex;
		justify-content: space-around;
		position: fixed;
		bottom: 80rpx;
	}
	.action-box .cancle {
		width: 300rpx;
		height: 100rpx;
		background-color: #AAAAAA;
		font-size: 40rpx;
		color: #FFFFFF;
	}
	.action-box .confirm {
		width: 300rpx;
		height: 100rpx;
		background-color: #FF6E78;
		font-size: 40rpx;
		color: #FFFFFF;
	}
</style>
