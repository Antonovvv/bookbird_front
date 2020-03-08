<template>
	<view>
		<nav-bar fontColor="#727272">买买卖卖</nav-bar>
		<view class="action-tab">
			<view class="action-tab-item" :class="index==tabCur ? 'selected' : ''" :id="'tab' + index"
			v-for="(item, index) in actionTabs" :key="index" @tap="line.tabSelect" :data-index="index" :data-info="tabsInfo[index]">{{item}}
			</view>
			<view class="cur-line" :style="'left:' + curInitPositon + 'px;'" :data-width="lineWidth"/>
		</view>
		
		<swiper :current="tabCur" @change="line.swiperChange" :style="{height: scrollHeight + `rpx`}" class="swiper" duration="300">
			<swiper-item>
				<!--<mescroll-item ref="item0" :tab="0" :i="0" :index="tabCur" @onTouchLong="showActionSheet"></mescroll-item>-->
				<mescroll-item ref="item0" :tab="0" :i="0" :index="tabCur"></mescroll-item>
			</swiper-item>
			<swiper-item>
				<mescroll-item ref="item1" :tab="1" :i="1" :index="tabCur"></mescroll-item>
			</swiper-item>
			<swiper-item>
				<mescroll-item ref="item2" :tab="2" :i="2" :index="tabCur" @onPostDelete="showActionSheet"></mescroll-item>
			</swiper-item>
		</swiper>
		
		<action-sheet :show="actionSheetShow" :tips="actionSheetTips" :item-list="actionSheetItems"
		@click="actionConfirm" @cancel="closeActionSheet"></action-sheet>
	</view>
</template>

<script>
	import actionSheet from '../../components/actionsheet/actionsheet.vue'
	import mescrollItem from "./mescroll-item.vue"
	export default {
		components: {actionSheet, mescrollItem},
		data() {
			return {
				tabCur: -1,
				curInitPositon: 0,
				actionTabs: ['我买到的', '我卖出的', '我发布的'],
				tabsInfo: [],
				deletingIndex: 0,
				cancelingIndex: 0,
				deletingName: '',
				actionSheetShow: false,
				actionSheetType: '',
				actionSheetTips: '',
				actionSheetItems: [{
					text: "确认",
					color: "#E64340",
				}]
			}
		},
		computed: {
			lineWidth() {
				return uni.upx2px(100)
			},
			scrollHeight() {
				return 667 * 2 - 88 - uni.getSystemInfoSync()['statusBarHeight'] * 2
			},
			scrollTop() {
				return 88 + uni.getSystemInfoSync()['statusBarHeight'] * 2
			}
		},
		onLoad(option) {
			var tab = Number(option.tab)
			this.tabCur = tab
			const query = uni.createSelectorQuery().in(this);
			for (let i in this.actionTabs) {
				query.select('#tab' + i).boundingClientRect()
			}
			query.exec((res) => {
				this.tabsInfo = res
				this.curInitPositon = this.tabsInfo[tab].left + (this.tabsInfo[tab].width - this.lineWidth) / 2
			})
		},
		onShow() {
		},
		onReady() {
		},
		methods: {
			tabSelect(e) {
				this.tabCur = e.index
			},
			swiperChange(e) {
				this.tabCur = e.index
			},
			showActionSheet(e) {
				this.actionSheetType = e.type
				switch (e.type) {
					case 'cancel':
						this.actionSheetTips = '确认取消订单吗？'
						this.actionSheetItems = [{
							text: "确认",
							color: "#E64340",
						}]
						this.actionSheetShow = true
						break;
					case 'delete':
						this.actionSheetTips = '确认下架《' + e.bookName + '》吗？'
						this.actionSheetItems = [{
							text: "确认",
							color: "#E64340",
						}]
						this.actionSheetShow = true
						break;
				}
			},
			actionConfirm() {
				switch (this.actionSheetType) {
					case 'cancel':
						var target = this.$refs.item0
						target.orderCancel(target.cancelingIndex)
						this.closeActionSheet()
						break;
					case 'delete':
						var target = this.$refs.item2
						target.postDelete(target.deletingIndex)
						this.closeActionSheet()
						break;
				}
			},
			closeActionSheet() {
				this.actionSheetShow = false
			}
		}
	}
</script>

<script module="line" lang="wxs">
	var curPosition = 0
	var tabCur = 0
	function tabCurWatcher(newVal, oldVal, ins) {
		console.log('tabCur:', newVal, oldVal)
	}
	function tabSelect(event, ins) {
		var tab = ins.selectComponent('#' + event.target.id)	//当前点击的tab的ComponentDescriptor实例
		var line = ins.selectComponent('.cur-line')		//line实例
		var tabInfo = tab.getDataset().info
		
		curPosition = computedCur(tabInfo, line.getDataset().width)
		line.setStyle({
			"left": curPosition + "px"
		})
		
		tabCur = tab.getDataset().index
		tab.callMethod('tabSelect', {index: tabCur})	//改变页面中tabCur
	}
	function swiperChange(event, ins) {
		if (event.detail.source == 'touch') {
			var tab = ins.selectComponent('#tab' + event.detail.current)
			var line = ins.selectComponent('.cur-line')
			var tabInfo = tab.getDataset().info
			
			curPosition = computedCur(tabInfo, line.getDataset().width)
			line.setStyle({
				"left": curPosition + "px"
			})
			
			tabCur = event.detail.current
			ins.callMethod('swiperChange', {index: tabCur})
		}
	}
	function computedCur(info, lineWidth) {
		return info.left + (info.width - lineWidth) / 2
	}
	module.exports = {
		curPosition: curPosition,
		tabSelect: tabSelect,
		swiperChange: swiperChange,
		tabCurWatcher: tabCurWatcher
	}
</script>

<style>
	.swiper {
		position: relative;
	}
	
	.action-tab {
		width: 100%;
		background-color: #FFFFFF;
		color: #7F7F7F;
		text-align: center;
		display: flex;
		justify-content: space-around;
		position: fixed;
		z-index: 999;
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
	
	.order-empty {
		color: #CBCBCB;
		font-size: 32rpx;
		margin-top: 100rpx;
	}
</style>
