<template>
	<view>
		<!--
		<image class="background-image" src="../../static/bgimg.jpg" mode="aspectFill"></image>-->
		<view class="user-info">
			<view class="avatar">
				<open-data type="userAvatarUrl" default-avatar="../../static/default_avatar.jpg"></open-data>
			</view>
			<view class="nickname">
				<open-data type="userNickName"></open-data>
			</view>
		</view>
		<view class="auth-box" @tap="toAuth">
			<view class="check-box">
				<text class="cuIcon-check auth-check"></text>
			</view>
			<text class="auth-text" :class="authorized ? 'authed' : ''">身份认证</text>
		</view>
		
		<view class="my-tab">
			<view class="my-tab-item" :class="index==tabCur ? 'selected' : ''" 
			v-for="(item, index) in myTabs" :key="index" @tap="tabSelect(index)">
				{{item}}
			</view>
		</view>
		<view></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				authorized: this.global.isAuthorized,
				tabCur: 0,
				myTabs: ['买书', '卖书']
			}
		},
		onShow() {
			this.authorized = this.global.isAuthorized
		},
		onReady() {
			/*uni.navigateTo({
				url: 'login'
			})*/
		},
		methods: {
			toAuth() {
				uni.navigateTo({
					url: 'auth?authorized=' + this.global.isAuthorized
				})
			},
			tabSelect(index) {
				this.tabCur = index
			}
		}
	}
</script>

<style>
	.background-image {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		background-size: 100% 100%;
		z-index: -1;
	}
	
	.user-info {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.avatar {
		width: 170rpx;
		height: 170rpx;
		border-radius: 50%;
		overflow: hidden;
		margin-top: 120rpx;
	}
	
	.nickname {
		margin-top: 12rpx;
		font-size: 36rpx;
		color: #727272;
	}
	
	.auth-box {
		margin-top: 10rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.check-box {
		width: 30rpx;
		height: 30rpx;
		background-color: #D8D8D8;
		border: 1rpx solid #FFFFFF;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: flex-end;
	}
	.auth-check {
		color: #FFFFFF;
		font-size: 24rpx;
	}
	.auth-text {
		color: #B1B1B1;
		font-size: 30rpx;
	}
	.auth-text.authed {
		color: #FF8F97;
	}
	
	.my-tab {
		background-color: #FFFFFF;
		color: #7F7F7F;
		text-align: center;
		display: flex;
		margin-top: 20rpx;
	}
	.my-tab-item {
		height: 100rpx;
		line-height: 100rpx;
		flex: 1;
		margin: 0 120rpx;
		font-size: 36rpx;
	}
	.my-tab .selected {
		border-bottom: 10rpx solid;
		color: #FF8F97;
	}
</style>
