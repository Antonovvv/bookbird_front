<template>
	<view>
		<nav-bar fontColor="#727272">买买卖卖</nav-bar>
		<view class="action-tab">
			<view class="action-tab-item" :class="index==tabCur ? 'selected' : ''" :id="'tab' + index"
			v-for="(item, index) in actionTabs" :key="index" @tap="tabSelect(index)">{{item}}
			</view>
			<view class="cur-line" :style="'left:' + curPositon + 'px;'"/>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabCur: 0,
				actionTabs: ['我买到的', '我卖出的', '我发布的'],
				tabsInfo: [],
				curPositon: 0
			}
		},
		computed: {
		},
		onLoad(option) {
			this.tabCur = option.tab
		},
		onReady() {
			const query = uni.createSelectorQuery().in(this);
			for (let i in this.actionTabs) {
				query.select('#tab' + i).boundingClientRect()
			}
			query.exec((res) => {
				console.log(res);
				this.tabsInfo = res
				this.curPositon = this.tabsInfo[this.tabCur].left + (this.tabsInfo[this.tabCur].width - uni.upx2px(100)) / 2
			})
		},
		methods: {
			tabSelect(index) {
				this.tabCur = index
				this.curPositon = this.tabsInfo[this.tabCur].left + (this.tabsInfo[this.tabCur].width - uni.upx2px(100)) / 2
			}
		}
	}
</script>

<style>
	.action-tab {
		width: 100%;
		background-color: #FFFFFF;
		color: #7F7F7F;
		text-align: center;
		display: flex;
		justify-content: space-around;
		position: fixed;
	}
	.action-tab-item {
		height: 100rpx;
		line-height: 100rpx;
		flex: 1;
		font-size: 32rpx;
		transition-property: all;
		transition-duration: 300ms;
	}
	.action-tab .selected {
		/*border-bottom: 6rpx solid;*/
		color: #FF8F97;
	}
	.cur-line {
		width: 100rpx;
		height: 6rpx;
		background-color: #FF8F97;
		position: absolute;
		bottom: 20rpx;
		transition-property: all;
		transition-duration: 300ms;
	}
</style>
