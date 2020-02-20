<template>
		<mescroll-uni ref="mescrollRef" @init="mescrollInit" :down="downOption" :up="upOption" @down="downCallback" height="100%" top="100">
			<view class="order-list">
				<order-box v-for="(item, index) in dataList" :key="index" :item="item" mode="deal" v-if="tab == 0"
				@send-confirm="onSendConfirm(index)" @receive-confirm="onReceiveConfirm(index)" @long-touch="onTouchLong(index)"/>
				
				<order-box v-for="(item, index) in dataList" :key="index" :item="item" mode="deal" v-if="tab == 1"
				@send-confirm="onSendConfirm(index)" @receive-confirm="onReceiveConfirm(index)" @long-touch="onTouchLong(index)"/>
				
				<order-box v-for="(item, index) in dataList" :key="index" :item="item" mode="post" v-if="tab == 2"
				@post-detail="onPostDetail(index)" @post-delete="onPostDelete(index)"/>
			</view>
		</mescroll-uni>
		
</template>

<script>
	import orderBox from './order-box.vue'
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import MescrollMoreItemMixin from "@/components/mescroll-uni/mixins/mescroll-more-item.js";
	
	export default {
		mixins: [MescrollMixin, MescrollMoreItemMixin],
		components: {orderBox},
		props: {
			tab: Number
		},
		data() {
			return {
				downOption: {
					auto: false,
					offset: 80
				},
				upOption: {
					use: false
				},
				dataList: [],
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
			scrollHeight() {
				return 667 * 2 - 88 - uni.getSystemInfoSync()['statusBarHeight'] * 2
			},
			scrollTop() {
				return 88 + uni.getSystemInfoSync()['statusBarHeight'] * 2
			}
		},
		methods: {
			downCallback() {
				uni.vibrateShort({})
				this.updateList()
			},
			getOrderData(subUrl, type) {
				uni.showLoading({})
				var _this = this
				var token = uni.getStorageSync('token')
				if (token) {
					uni.request({
						url: this.global.serverUrl + subUrl,
						data: {
							token: token,
							orderType: type
						},
						success: function (res) {
							if (res.statusCode == 200) {
								console.log(res.data.orderList);
								_this.dataList = res.data.orderList
								for (let item of _this.dataList) {
									item.imageUrl = _this.global.bucketUrl + item.imageName
								}
								setTimeout(function() {_this.mescroll.endSuccess()}, 300)
							} else if (res.statusCode == 204) {
								
							} else if (res.statusCode == 403) {
								uni.showToast({title: 'token过期，请重新进入小程序', duration: 3000, icon: 'none'})
								setTimeout(function() {_this.mescroll.endErr()}, 300)
							}
						}
					})
				} else {
					setTimeout(function() {_this.mescroll.endErr()}, 300)
					uni.showToast({title: '未登录', duration: 3000, icon: 'none'})
				}
				uni.hideLoading()
			},
			getPostData() {
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
								_this.dataList = res.data.postList
								for (let item of _this.dataList) {
									item.imageUrl = _this.global.bucketUrl + item.imageName
								}
								setTimeout(function() {_this.mescroll.endSuccess()}, 300)
							} else if (res.statusCode == 204) {
								
							} else if (res.statusCode == 403) {
								uni.showToast({title: 'token过期，请重新进入小程序', duration: 3000, icon: 'none'})
								setTimeout(function() {_this.mescroll.endErr()}, 300)
							}
						}
					})
				} else {
					setTimeout(function() {_this.mescroll.endErr()}, 300)
					uni.showToast({title: '未登录', duration: 3000, icon: 'none'})	
				}
				uni.hideLoading()
			},
			updateList() {
				switch (this.tab) {
					case 0:
						this.getOrderData("user/orders", 'bought')
						break;
					case 1:
						this.getOrderData("user/orders", 'sold')
						break;
					case 2:
						this.getPostData()
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
						deleteId: this.dataList[index].postId
					},
					success: function (res) {
						console.log(res.data);
						if (res.statusCode == 200) {
							_this.mescroll.triggerDownScroll()
						} else {
							uni.showToast({title: '删除失败，请稍后再试', duration: 3000, icon: 'none'})
						}
					}
				})
			},
			orderCancel(index) {
				if (this.dataList[index].status == 0) {
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
							orderId: this.dataList[index].orderId
						},
						success: function (res) {
							console.log(res.data);
							if (res.statusCode == 200) {
								_this.mescroll.triggerDownScroll()
							} else {
								uni.showToast({title: '删除失败，请稍后再试', duration: 3000, icon: 'none'})
							}
						}
					})
				} else if (this.dataList[index].status == 1) {
					uni.showToast({title: '书本等着你取啦！不能取消了', duration: 3000, icon: 'none'})
				} else if (this.dataList[index].status == 2) {
					uni.showToast({title: '无法取消已完成订单', duration: 3000, icon: 'none'})
				}
			},
			onPostDetail(index) {
				
			},
			onPostDelete(index) {
				this.$emit('onPostDelete', {
					type: 'delete',
					bookName: this.dataList[index].bookName
				})
				this.deletingIndex = index
			},
			onSendConfirm(index) {
				uni.navigateTo({
					url: '../order/send?orderId=' + this.dataList[index].orderId
				})
			},
			onReceiveConfirm(index) {
				var _this = this
				uni.showModal({
					title: '提示',
					content: '确认已取到书本',
					success: function (res) {
						if (res.confirm) {
							_this.receiveConfirm(_this.dataList[index].orderId)
						} else if (res.cancel) {
							console.log('取消已取货');
						}
					}
				})
			},
			onTouchLong(index) {
				if (this.tab == 0) {
					uni.vibrateShort({})
					uni.vibrateShort({})
					uni.vibrateShort({})
					this.$emit('onTouchLong', {
						type: 'cancel'
					})
					this.cancelingIndex = index
				}
			},
			receiveConfirm(orderId) {
				var _this = this
				var token = uni.getStorageSync('token')
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
							_this.mescroll.triggerDownScroll()
						} else {
							uni.showToast({title: '请求失败，请稍后再试', duration: 3000, icon: 'none'})
						}
					}
				})
			}
		}
	}
</script>

<style>
	.order-list {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-bottom: 156rpx;
	}
</style>
