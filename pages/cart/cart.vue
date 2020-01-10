<template>
	<view class="container">
		<y-navbar bgColor="bg-white" leftMode="edit">
			<block slot="editText" @tap="edit">编辑</block>
			<block slot="confirmText" @tap="editConfirm">完成</block>
			<block slot="content">购物车</block>
		</y-navbar>
		<checkbox-group @change="checkboxChange">
			<view class="cart-box">
				<view class="cart-item" v-for="(item, index) in cartList" :key="index">
					<label class="item-checkbox">
						<checkbox :value="index" :checked="item.checked" :disabled="!item.valid"
						class="round book-red" :class="item.valid?'':'invalid'" style="transform: scale(0.85);" />
					</label>
					<image :src="item.img" class="item-image" mode="aspectFit" @tap="detail(item)"/>
					<view class="item-content" @tap="detail(item)">
						<view class="item-title" :class="item.valid?'':'invalid'">{{item.name}}</view>
						<view class="item-info" :class="item.valid?'':'invalid'">{{item.author}} 著/{{item.publisher}}</view>
						<view class="item-tags">
							<view class="item-price" v-if="item.valid">￥{{item.sale.toFixed(2)}}</view>
							<view class="item-addr" v-if="item.valid">
								<text class="cuIcon-location"></text>{{item.addr}}
							</view>
							<view class="item-invalid" v-if="!item.valid">已失效</view>
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
						<checkbox value="" class="round book-red" style="transform: scale(0.96);" />
						<text class="checkAll-text">全选</text>
					</label>
				</checkbox-group>
			</view>
			<view class="total-price" v-if="!inEdit">
				合计:<text class="total">￥{{totalPrice.toFixed(2)}}</text> 
			</view>
			<view v-if="!inEdit">
				<button class="cu-btn round pay-button" @tap="pay">结算</button>
			</view>
			<view v-if="inEdit">
				<button class="cu-btn round del-button" @tap="editDelete">删除</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				allChecked: false,
				inEdit: false,
				cartList: [
					{
						name: "微积分",
						bookId: "",
						img: "../../static/book.png",
						sale: 6.00,
						author: "李军",
						publisher: "上海译文出版社",
						addr: '韵苑23栋',
						checked: true,
						valid: true
					},
					{
						name: "飞鸟集",
						bookId: "",
						img: "../../static/bird_logo.jpg",
						sale: 6.00,
						author: "李军",
						publisher: "上海译文出版社",
						addr: '韵苑23栋',
						checked: false,
						valid: false
					},
					{
						name: "微积分",
						bookId: "",
						img: "../../static/bird_logo.jpg",
						sale: 6.00,
						author: "李军",
						publisher: "上海译文出版社",
						addr: '韵苑23栋',
						checked: false,
						valid: true
					},
					{
						name: "微积分",
						bookId: "",
						img: "../../static/bird_logo.jpg",
						sale: 6.00,
						author: "李军",
						publisher: "上海译文出版社",
						addr: '韵苑23栋',
						checked: false,
						valid: true
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
			edit() {
				this.inEdit = true
			},
			editConfirm() {
				this.inEdit = false
			},
			editDelete() {
				for (let i = this.cartList.length - 1; i >= 0; i--) {
					if (this.cartList[i].checked) {
						this.cartList.splice(i, 1)
					}
				}
			},
			detail(item) {
				if (item.valid) {
					uni.navigateTo({
						url: "../detail/detail?bookid=" + item.bookId + "&name=" + item.name
					})
				}
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
				for (let item of this.cartList) {
					if (item.valid) {
						this.$set(item, 'checked', this.allChecked)
					}
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
	
	.item-checkbox {/*label中的checkbox*/
		padding: 0 20rpx;
		display: flex;
		align-items: center;
	}
	
	checkbox.book-red[checked] .wx-checkbox-input,
	checkbox.book-red.checked .uni-checkbox-input {
		background-color: #FF6E78 !important;
		border-color: #FF6E78 !important;
	}
	
	checkbox.invalid::before {
		content: "";
	}
	
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
	
	.item-invalid {
		color: #7C7C7C;
		font-size: 28rpx;
		margin-top: 55rpx;
	}
	
	.item-title.invalid, .item-info.invalid {
		color: #B1B1B1;
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
	
	.cart-tabbar .del-button {
		width: 170rpx;
		height: 70rpx;
		border: 2rpx solid #FF6174;
		background-color: #FFFFFF;
		font-size: 42rpx;
		color: #FF6174;
	}
</style>
