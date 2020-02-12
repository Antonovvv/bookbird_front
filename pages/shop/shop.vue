<template>
	<view class="container">
		<image class="background-image" src="../../static/bgimg.jpg" mode="aspectFill"></image>
		<image class="logo" src="../../static/shop_logo.png"></image>
		<view class="search-box">
			<view class="search-bar">
				<icon type="search" size="18" color="#969696"></icon>
				<input @focus="inputFocus" @confirm="searchConfirm" v-model="searchText" :adjust-position="false" type="text" 
				placeholder="搜索你想要的书籍" placeholder-style="color: #ADADAD;" confirm-type="search" class="search-input"/>
				<view class="look" @tap="toLook">随便看看</view>
			</view>
		</view>
		<view class="text-area">
			<text class="try-text">您可以试试搜索</text>
		</view>
		<view class="try-button">
			<button v-for="(item, index) in tryList" :key="index" class="cu-btn round try-btn" @tap="trySearch(item)">{{item}}</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchText: '',
				tryList: []
			}
		},
		onLoad() {
		},
		onShow() {
			var _this = this
			uni.request({
				url: this.global.serverUrl + "post/try",
				data: {
					count: 8
				},
				success: function(res) {
					if (res.statusCode == 200) {
						_this.tryList = res.data.tryList
					} else {
						console.log('Request for tryList failed');
					}
				}
			})
			this.searchText = ''
		},
		methods: {
			inputFocus() {
			},
			searchConfirm(e) {
				uni.navigateTo({url: 'search?text=' + encodeURIComponent(JSON.stringify(e.detail.value))})
			},
			trySearch(text) {
				uni.navigateTo({url: 'search?text=' + encodeURIComponent(JSON.stringify(text))})
			},
			toLook() {
				uni.navigateTo({url: 'look'})
			}
		}
	}
</script>

<style>
	page {
		height: 100%;
	}
	
	.container {
		height: 100%;
		display: flex;
		flex-direction: column;
		/*justify-content: center;*/
		position: fixed;
	}
	
	.background-image {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		background-size: 100% 100%;
		z-index: -1;
	}
	
	.logo {
		height: 264rpx;
		width: 264rpx;
		margin-top: 116rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 66rpx;
		border-radius: 132rpx;
	}
	
	.search-bar {
		height: 70rpx;
		border: 4rpx solid;
		border-radius: 35rpx;
		border-color: #ff6e78;
		background-color: #FFFFFF;
		margin: 0 30rpx;
		display: flex;
		align-items: center;
		padding: 0 26rpx;
	}
	.search-bar .search-input {
		background-color: #FFFFFF;
		font-size: 32rpx;
		color: #ADADAD;
		margin-left: 18rpx;
		width: 400rpx;
	}
	.look {
		padding-left: 26rpx;
		border-left: 2rpx solid #CECECE;
		line-height: 36rpx;
		position: relative;
		left: 30rpx;
	}
	
	.text-area {
		margin-top: 25rpx;
		margin-left: 40rpx;
		margin-bottom: 18rpx;
	}
	
	.try-text {
		color: #727272;
	}
	
	.try-button {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		flex-wrap: wrap;
	}
	
	.try-btn {
		color: #727272;
		background-color: #EBEBEB;
		margin-left: 25rpx;
		margin-bottom: 15rpx;
	}
</style>
