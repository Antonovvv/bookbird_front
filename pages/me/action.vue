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
			@send-confirm="onSendConfirm(index)" @receive-confirm="onReceiveConfirm(index)" @long-touch="onTouchLong(index)"></order-box>
		</view>
		<view class="order-list" v-if="tabCur == 2">
			<order-box v-for="(item, index) in orderList" :key="index" :item="item" mode="post"
			@post-detail="onPostDetail(index)" @post-delete="onPostDelete(index, item.bookName)"></order-box>
			<view class="order-empty" v-if="orderList.length == 0">快去扫码上传第一本书吧~</view>
		</view>
		<action-sheet :show="showActionSheet" :tips="actionSheetTips" :item-list="actionSheetItems"
		@click="actionConfirm" @cancel="closeActionSheet"></action-sheet>
	</view>
</template>

<script>
	import orderBox from './order-box.vue'
	import actionSheet from '../../components/actionsheet/actionsheet.vue'
	export default {
		components: {orderBox, actionSheet},
		data() {
			return {
				tabCur: 0,
				curPositon: 0,
				actionTabs: ['我买到的', '我卖出的', '我发布的'],
				tabsInfo: [],
				orderList: [],
				deletingIndex: 0,
				cancelingIndex: 0,
				deletingName: '',
				showActionSheet: false,
				actionSheetTips: '',
				actionSheetItems: [{
					text: "确认",
					color: "#E64340",
				}]
			}
		},
		computed: {
		},
		onLoad(option) {
			var tab = Number(option.tab)
			this.tabCur = tab
		},
		onShow() {
			this.updateOrders(this.tabCur)
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
				var _this = this
				setTimeout(function() {_this.updateOrders(index)}, 300)
			},
			updateOrders(tab) {
				uni.showLoading({})
				this.orderList = []
				switch (tab) {
					case 0:
						var _this = this
						var token = uni.getStorageSync('token')
						if (token) {
							uni.request({
								url: this.global.serverUrl + "user/orders",
								data: {
									token: token,
									orderType: 'bought'
								},
								success: function (res) {
									if (res.statusCode == 200) {
										console.log(res.data.orderList);
										_this.orderList = res.data.orderList
										for (let item of _this.orderList) {
											item.imageUrl = _this.global.bucketUrl + item.imageName
											item.identity = 'buyer'
										}
									}
									else if (res.statusCode == 204) {
										uni.showToast({title: '没买过', duration: 3000, icon: 'none'})
									}
									else if (res.statusCode == 403) {
										uni.showToast({title: 'token过期，请重新进入小程序', duration: 3000, icon: 'none'})
									}
								}
							})
						} else {
							uni.showToast({title: '未登录', duration: 3000, icon: 'none'})
						}
						uni.hideLoading()
						break;
					case 1:
						var _this = this
						var token = uni.getStorageSync('token')
						if (token) {
							uni.request({
								url: this.global.serverUrl + "user/orders",
								data: {
									token: token,
									orderType: 'sold'
								},
								success: function (res) {
									if (res.statusCode == 200) {
										console.log(res.data.orderList);
										_this.orderList = res.data.orderList
										for (let item of _this.orderList) {
											item.imageUrl = _this.global.bucketUrl + item.imageName
											item.identity = 'seller'
										}
									}
									else if (res.statusCode == 204) {
										uni.showToast({title: '没卖过', duration: 3000, icon: 'none'})
									}
									else if (res.statusCode == 403) {
										uni.showToast({title: 'token过期，请重新进入小程序', duration: 3000, icon: 'none'})
									}
								}
							})
						} else {
							uni.showToast({title: '未登录', duration: 3000, icon: 'none'})
						}
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
								}
							})
						} else {
							uni.showToast({title: '未登录', duration: 3000, icon: 'none'})	
						}
						uni.hideLoading()
						break;
					default:
						uni.hideLoading()
						break;
				}
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
			orderCancel(index) {
				if (this.orderList[index].status == 0) {
					var _this = this
					var token = uni.getStorageSync('token')
					uni.request({
						url: this.global.serverUrl + "user/orders",
						method: 'DELETE',
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						data: {
							token: token,
							orderId: this.orderList[index].orderId
						},
						success: function (res) {
							console.log(res.data);
							if (res.statusCode == 200) {
								_this.updateOrders(_this.tabCur)
							} else {
								uni.showToast({title: '删除失败，请稍后再试', duration: 3000, icon: 'none'})
							}
						}
					})
				} else if (this.orderList[index].status == 1) {
					uni.showToast({title: '书本等着你取啦！不能取消了', duration: 3000, icon: 'none'})
				} else if (this.orderList[index].status == 2) {
					uni.showToast({title: '无法取消已完成订单', duration: 3000, icon: 'none'})
				}
			},
			onPostDetail(index) {
				
			},
			onPostDelete(index, bookName) {
				this.deletingIndex = index
				this.deletingName = bookName
				this.actionSheetTips = '确认下架《' + this.deletingName + '》吗？'
				this.actionSheetItems = [{
					text: "确认",
					color: "#E64340",
				}]
				this.showActionSheet = true
			},
			onSendConfirm(index) {
				uni.navigateTo({
					url: '../order/send?orderId=' + this.orderList[index].orderId
				})
			},
			onReceiveConfirm(index) {
				var _this = this
				uni.showModal({
					title: '提示',
					content: '确认已取到书本',
					success: function (res) {
						if (res.confirm) {
							_this.receiveConfirm(_this.orderList[index].orderId)
						} else if (res.cancel) {
							console.log('取消已取货');
						}
					}
				})
			},
			onTouchLong(index) {
				if (this.tabCur == 0) {
					uni.vibrateShort({})
					this.cancelingIndex = index
					this.actionSheetTips = '确认取消订单吗？'
					this.actionSheetItems = [{
						text: "确认",
						color: "#E64340",
					}]
					this.showActionSheet = true
				}
			},
			receiveConfirm(orderId) {
				var _this = this
				var token = uni.getStorageSync('token')
				this.isUploading = true
				uni.request({
					url: this.global.serverUrl + "order",
					method: 'PUT',
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
					data: {
						token: token,
						orderId: orderId,
						action: 'receive'
					},
					success: function (res) {
						if (res.statusCode == 200) {
							_this.updateOrders(_this.tabCur)
						} else {
							console.log('request faild')
						}
					}
				})
			},
			actionConfirm() {
				switch (this.tabCur) {
					case 0:
						this.orderCancel(this.cancelingIndex)
						this.closeActionSheet()
						break;
					case 1:
						break;
					case 2:
						this.postDelete(this.deletingIndex)
						this.closeActionSheet()
						break;
				}
			},
			closeActionSheet() {
				this.showActionSheet = false
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
		margin-bottom: 20rpx;
	}
	.order-empty {
		color: #CBCBCB;
		font-size: 32rpx;
		margin-top: 100rpx;
	}
</style>
