<template>
	<view class="content">
		<image class="logo" src="../../static/微信图片_20191215001840.png"></image>
		<view class="cu-bar">
			<view class="search-form round search-bar">
				<text space="emsp">{{space}}</text>
				<input @focus="inputFocus" @confirm="searchConfirm" :adjust-position="false" type="text" 
				placeholder="搜索你想要的书籍" confirm-type="search"
				class="search"/>
				<text class="cuIcon-search"></text>
			</view>
		</view>
		<view class="text-area">
			<text class="try-text">{{tryTo}}</text>
		</view>
		<view class="try-button">
			<button v-for="(item, index) in tryList" class="cu-btn round try-btn">{{item}}</button>
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
				space: ' ',
				tryTo: '您可以试试搜索',
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
			}
		}
	}
</script>

<style>
	body {
		background-color: #F8F8F8;
	}
	.content {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.logo {
		height: 264rpx;
		width: 264rpx;
		margin-top: 180rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 90rpx;
		border-radius: 132rpx;
	}

	.search {
		background-color: #FFFFFF;
	}
	
	.text-area {
		margin-top: 25rpx;
		margin-left: 40rpx;
		margin-bottom: 18rpx;
	}
	
	.tryto {
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
