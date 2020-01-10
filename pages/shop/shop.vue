<template>
	<view class="container">
		<image class="background-image" src="../../static/bgimg.jpg" mode="aspectFill"></image>
		<image class="logo" src="../../static/shop_logo.png"></image>
		<view class="cu-bar">
			<view class="search-form round search-box">
				<text space="emsp">{{space}}</text>
				<input @focus="inputFocus" @confirm="searchConfirm" :adjust-position="false" type="text" 
				placeholder="搜索你想要的书籍" confirm-type="search"
				class="search"/>
				<text class="cuIcon-search"></text>
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
	import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue'
	export default {
		components: {
			uniSearchBar
		},
		data() {
			return {
				space: '  ',
				tryList: ['微积分', '电路理论', '微机原理', '毛概', '数理方程与特殊函数']
			}
		},
		onLoad() {
			uni.setNavigationBarTitle({
				title: '首页'
			})
		},
		methods: {
			inputFocus() {
				
			},
			searchConfirm(e) {
				uni.navigateTo({
					url: 'search?text=' + encodeURIComponent(JSON.stringify(e.detail.value))
				})
			},
			trySearch(text) {
				uni.navigateTo({
					url: 'search?text=' + encodeURIComponent(JSON.stringify(text))
				})
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
	
	.container .cu-bar {
		min-height: auto;
	}

	.cu-bar .search-form .search {
		background-color: #FFFFFF;
		font-size: 32rpx;
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
