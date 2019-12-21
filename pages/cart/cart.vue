<template>
	<view class="container">
		<cu-custom bgColor="bg-white">
			<block slot="content">购物车</block>
		</cu-custom>
		<checkbox-group @change="checkboxChange">
			<view class="cart-box">
				<view class="cart-item" v-for="(item, index) in cartList" :key="index">
					<label class="item-checkbox">
						<checkbox :value="index" :checked="item.checked"
						color="#FFFFFF" class="round" style="transform: scale(0.85);"></checkbox>
					</label>
					<image :src="item.img" class="item-image" mode="aspectFit" @tap="detail(item)"/>
					<view class="item-content" @tap="detail(item)">
						<view class="item-title">{{item.name}}</view>
						<view class="item-info">{{item.author}} 著/{{item.pulisher}}</view>
						<view class="item-tags">
							<view class="item-price">￥{{item.sale.toFixed(2)}}</view>
							<view class="item-addr">
								<text class="cuIcon-location"></text>{{item.addr}}
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="space-container"></view>
		</checkbox-group>
		<!--tabbar-->
		<view class="cart-tabbar" v-if="!isEmpty">
			<view class="checkAll">
				<checkbox-group @change="checkAll">
					<label class="checkAll-box">
						<checkbox value=""
						color="#FFFFFF" class="round" style="transform: scale(0.96);"></checkbox>
						<text class="checkAll-text">全选</text>
					</label>
				</checkbox-group>
			</view>
			<view class="total-price">
				合计:<text class="total">￥{{totalPrice.toFixed(2)}}</text> 
			</view>
			<view>
				<button class="cu-btn round pay-button" @tap="pay">结算</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				allChecked: false,
				cartList: [
					{
						name: "微积分",
						bookId: "",
						img: "../../static/book.png",
						sale: 6.00,
						author: "李军",
						pulisher: "上海译文出版社",
						addr: '韵苑23栋',
						checked: true
					},
					{
						name: "飞鸟集",
						bookId: "",
						img: "../../static/bird_logo.jpg",
						sale: 6.00,
						author: "李军",
						pulisher: "上海译文出版社",
						addr: '韵苑23栋',
						checked: false
					},
					{
						name: "微积分",
						bookId: "",
						img: "../../static/bird_logo.jpg",
						sale: 6.00,
						author: "李军",
						pulisher: "上海译文出版社",
						addr: '韵苑23栋',
						checked: false
					},
					{
						name: "微积分",
						bookId: "",
						img: "../../static/bird_logo.jpg",
						sale: 6.00,
						author: "李军",
						pulisher: "上海译文出版社",
						addr: '韵苑23栋',
						checked: false
					}
				]
			}
		},
		computed: {
			isEmpty: function() {
				return this.cartList.length==0
			},
			totalPrice: function() {
				var sum = 0;
				for (let item of this.cartList) {
					if (item.checked){
						sum += item.sale
					}
				}
				return sum;
			}
		},
		onLoad() {
			
		},
		methods: {
			detail(item) {
				uni.navigateTo({
					url: "../detail/detail?bookid=" + item.bookId + "&name=" + item.name
				})
			},
			checkboxChange(e) {
				var checkedList = e.detail.value;
				for (let i in this.cartList) {
					if (checkedList.includes(i)) {
						this.$set(this.cartList[i], 'checked', true)
					}else {
						this.$set(this.cartList[i], 'checked', false)
					}
				}
			},
			checkAll(e) {
				this.allChecked = !this.allChecked
				for (let i in this.cartList) {
					this.$set(this.cartList[i], 'checked', this.allChecked)
				}
			},
			pay() {
				uni.showToast({
					title: '订单确认页面'
				})
			}
		}
	}
</script>

<style>
	.container {
		/*margin-bottom: 100rpx;*/
	}
	
	.space-container {
		height: 100rpx;/*tabbar高度为100rpx*/
	}
	
	.cart-box {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 20rpx;
	}
	
	.cart-item {
		width: 700rpx;
		height: 300rpx;
		border-radius: 24rpx;
		background-color: #FFFFFF;
		margin: 13rpx auto;
		display: flex;
	}
	
	.item-checkbox {
		padding: 0 20rpx;
		display: flex;
		align-items: center;
	}
	/*label中的checkbox*/
	
	.item-image {
		width: 200rpx;
		height: 220rpx;
		border-radius: 12rpx;
		display: block;
		margin: auto 0;
	}
	
	.item-content {
		display: flex;
		flex-direction: column;
		padding-left: 20rpx;
	}
	
	.item-title {
		margin-top: 60rpx;
		font-size: 36rpx;
		color: #727272;
	}
	
	.item-info {
		margin-top: 16rpx;
		font-size: 24rpx;
		color: #727272;
	}
	
	.item-tags {
		display: flex;
	}
	
	.item-price {
		font-size: 42rpx;
		color: #FF6E78;
		margin-top: 50rpx;
	}
	
	.item-addr {
		margin-top: 60rpx;
		margin-left: 100rpx;
		font-size: 28rpx;
		color: #727272;
	}
	
	/*tabbar*/
	.cart-tabbar {
		width: 100%;
		height: 120rpx;
		background-color: rgba(255,255,255,0.95);
		position: fixed;
		left: 0;
		bottom: 0;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 0 30rpx;
		box-sizing: border-box;
		font-size: 24rpx;
	}
	
	.cart-tabbar::before {
		content: '';
		width: 100%;
		border-top: 1rpx solid #d9d9d9;
		position: absolute;
		top: 0;
		left: 0;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
	}
	
	.checkAll {
		display: flex;
		align-items: center;
	}
	
	.checkAll-box {
		/* width: 40rpx; */
		padding-right: 30rpx;
		display: flex;
		align-items: center;
	}
	
	.checkAll-text {
		padding-left: 12rpx;
		font-size: 36rpx;
		color: #727272;
	}
	
	.total-price {
		font-size: 36rpx;
		align-items: center;
		margin-left: 100rpx;
	}
	
	.total {
		color: #727272;
	}
	
	.cart-tabbar .pay-button {
		width: 170rpx;
		height: 70rpx;
		background-color: #FF6E78;
		font-size: 42rpx;
		color: #FFFFFF;
	}
</style>
