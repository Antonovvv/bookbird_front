<template>
	<view>
		<image class="background-image" src="../../static/bgimg.jpg" mode="aspectFill"></image>
		<view class="user-info">
			<view class="avatar">
				<open-data type="userAvatarUrl" default-avatar="../../static/default_avatar.jpg"></open-data>
			</view>
			<view class="nickname">
				<open-data type="userNickName"></open-data>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		onLoad() {
			
		},
		methods: {
			
		}
	}
</script>

<style>
	.background-image {
		width: 100%;
		height: 110%;
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
</style>
