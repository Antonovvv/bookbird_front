<template>
	<view class="content">
		<view class="cu-bar">
			<view class="search-form round search-bar">
				<text space="emsp">{{space}}</text>
				<input @confirm="searchConfirm" :adjust-position="false" type="text" 
				:value="searchText" confirm-type="search"
				class="search"/>
				<text class="cuIcon-search"></text>
			</view>
		</view>
		<view class="bg-white nav">
			<view class="cu-item" :class="index==selectCur?'selected':''" v-for="(item, index) in selectItems"
			@tap="selectChange" :data-id="index">{{item}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				space: ' ',
				searchText: '',
				selectCur: 0,
				selectItems: ['综合', '价格', '距离', '成色']
			}
		},
		onLoad(option) {
			this.searchText = JSON.parse(decodeURIComponent(option.text))
		},
		methods: {
			selectChange(e) {
				this.selectCur = e.currentTarget.dataset.id
			}
		}
	}
</script>

<style>
	.content {
		margin-top: 160rpx;
	}
	
	.selected {
		color: #FF6E78;
	}
</style>
