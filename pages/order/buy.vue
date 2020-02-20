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
				<view class="form-content">￥{{(postInfo.sale).toFixed(2)}}</view>
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
			<button class="cu-btn round cancel" @tap="cancel">取消订单</button>
			<button class="cu-btn round confirm" @tap="confirm">付款</button>
		</view>
		<action-sheet :show="showActionSheet" :tips="'假装发起微信支付,确认支付提交订单'" :item-list="actionSheetItems"
		@click="payConfirm" @cancel="closeActionSheet"></action-sheet>
	</view>
</template>

<script>
	import actionSheet from '../../components/actionsheet/actionsheet.vue'
	export default {
		components: {actionSheet},
		data() {
			return {
				postInfo: {},
				timeIndex: -1,
				arriveTimes: ['今日22:00前', '明日22:00前'],
				showActionSheet: false,
				actionSheetItems: [{
					text: "确认支付",
					color: "#09BB07",
				}]
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
			orderSubmit() {
				var _this = this
				var token = uni.getStorageSync('token')
				uni.request({
					url: this.global.serverUrl + "order",
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: token,
						postId: this.postInfo.postId,
						deadline: this.arriveTimes[this.timeIndex]
					},
					success: function (res) {
						if (res.statusCode == 201) {
							uni.showToast({
								title: '订单提交成功'
							})
						} else if (res.statusCode == 404) {
							uni.showToast({title: "书本已经被买走啦！", duration: 3000, icon: 'none'})
						} else {
							console.log('request faild')
						}
					}
				})
			},
			confirm() {
				if (this.timeIndex == -1) {
					uni.showToast({title: "请选择时间", duration: 3000, icon: 'none'})
				} else {
					this.showActionSheet = true
				}
			},
			payConfirm() {
				this.orderSubmit()
				this.closeActionSheet()
			},
			closeActionSheet() {
				this.showActionSheet = false
			},
			cancel() {
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
	.action-box .cancel {
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
