<template>
	<view>
		<nav-bar fontColor="#727272">买买卖卖</nav-bar>
		<view class="action-tab">
			<view class="action-tab-item" :class="index==tabCur ? 'selected' : ''" :id="'tab' + index"
			v-for="(item, index) in actionTabs" :key="index" @tap="tabSelect(index)">{{item}}
			</view>
			<view class="cur-line" :style="'left:' + curPositon + 'px;'"/>
		</view>
		<view class="order-list" v-if="tabCur <= 1">
			<order-box v-for="(item, index) in orderList" :key="index" :item="item" mode="deal"
			@send-confirm="sendConfirm(index)" @receive-confirm="receiveConfirm(index)"></order-box>
		</view>
		<view class="order-list" v-if="tabCur == 2">
			<order-box v-for="(item, index) in orderList" :key="index" :item="item" mode="post"
			@post-detail="postDetail(index)" @post-delete="postDelete(index)"></order-box>
			<view class="order-empty" v-if="orderList.length == 0">快去扫码上传第一本书吧~</view>
		</view>
	</view>
</template>

<script>
	import orderBox from './order-box.vue'
	export default {
		components: {orderBox},
		data() {
			return {
				tabCur: 0,
				curPositon: 0,
				actionTabs: ['我买到的', '我卖出的', '我发布的'],
				tabsInfo: [],
				orderList: []
			}
		},
		computed: {
		},
		onLoad(option) {
			var tab = Number(option.tab)
			this.tabCur = tab
			this.updateOrders(tab)
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
				this.orderList = []
				var _this = this
				setTimeout(function() {_this.updateOrders(index)}, 300)
			},
			updateOrders(tab) {
				uni.showLoading({})
				switch (tab) {
					case 0:
						this.orderList = [{
							orderId: '20200214135800001',
							orderTime: '2020年2月14日13:58',
							bookName: '微积分',
							imageUrl: '../../static/book.png',
							deadline: '2月30日25:00前',
							addr: '韵苑23栋',
							sale: 500,
							identity: 'buyer',
							status: 0
						}, {
							orderId: '20200214142500002',
							orderTime: '2020年2月14日14:25',
							bookName: '练习本儿',
							imageUrl: '../../static/sell_pic1.png',
							deadline: '2月30日25:00前',
							addr: '韵苑23栋',
							sale: 500,
							identity: 'buyer',
							status: 1
						}]
						uni.hideLoading()
						break;
					case 1:
						this.orderList = [{
							orderId: '20200214135800001',
							orderTime: '2020年2月14日13:58',
							bookName: '微积分',
							imageUrl: '../../static/book.png',
							deadline: '2月30日25:00前',
							addr: '韵苑23栋',
							sale: 700,
							identity: 'seller',
							status: 0
						}, {
							orderId: '20200214142500002',
							orderTime: '2020年2月14日14:25',
							bookName: '练习本儿',
							imageUrl: '../../static/sell_pic1.png',
							deadline: '2月30日25:00前',
							addr: '韵苑23栋',
							sale: 800,
							identity: 'seller',
							status: 1
						}]
						uni.hideLoading()
						break;
					case 2:
						uni.showLoading({})
						var _this = this
						var token = uni.getStorageSync('token')
						if (token) {
							uni.request({
								url: this.global.serverUrl + "user/posts",
								data: {
									token: token,
									count: 100
								},
								success: function (res) {
									if (res.statusCode == 200) {
										console.log(res.data.postList);
										_this.orderList = res.data.postList
										for (let item of _this.orderList) {
											item.imageUrl = _this.global.bucketUrl + item.imageName
										}
									}
									else if (res.statusCode == 204) {
										console.log('empty');
									}
									else if (res.statusCode == 403) {
										uni.showToast({title: 'token过期，请重新进入小程序', duration: 3000, icon: 'none'})
									}
									uni.hideLoading()
								}
							})
						} else {
							uni.showToast({title: '未登录', duration: 3000, icon: 'none'})
							uni.hideLoading()
						}
				}
			},
			postDetail(index) {
				
			},
			postDelete(index) {
				var _this = this
				var token = uni.getStorageSync('token')
				uni.request({
					url: this.global.serverUrl + "user/posts",
					method: 'DELETE',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: token,
						deleteId: this.orderList[index].postId
					},
					success: function (res) {
						console.log(res.data);
						if (res.statusCode == 200) {
							_this.updateOrders(2)
						} else {
							uni.showToast({title: '删除失败，请稍后再试', duration: 3000, icon: 'none'})
						}
					}
				})
			},
			sendConfirm(index) {
				this.orderList[index].status = 1
			},
			receiveConfirm(index) {
				this.orderList[index].status = 2
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
	
	.order-list {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 100rpx;
	}
	.order-empty {
		color: #CBCBCB;
		font-size: 32rpx;
		margin-top: 100rpx;
	}
</style>
