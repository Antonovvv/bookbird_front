<template>
	<view>
		<cu-custom bgColor="bg-white">
			<block slot="content">购物车</block>
		</cu-custom>
		<checkbox-group>
			<view class="cart-box">
				<view class="cart-item" v-for="(item, index) in cartList" :key="index">
					<label class="item-checkbox">
						<checkbox color="#FFFFFF" class="round"></checkbox>
					</label>
					<image :src="item.img" class="item-image" mode="aspectFit"/>
					
				</view>
			</view>
		</checkbox-group>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cartList: [
					{
						name: "微积分",
						bookId: "",
						img: "../../static/book.png",
						sale: 6.00,
						author: "李军",
						pulisher: "上海译文出版社"
					},
					{
						name: "微积分",
						bookId: "",
						img: "../../static/微信图片_20191215001850.jpg",
						sale: 6.00,
						author: "李军",
						pulisher: "上海译文出版社"
					},
					{
						name: "微积分",
						bookId: "",
						img: "../../static/微信图片_20191215001850.jpg",
						sale: 6.00,
						author: "李军",
						pulisher: "上海译文出版社"
					},
					{
						name: "微积分",
						bookId: "",
						img: "../../static/微信图片_20191215001850.jpg",
						sale: 6.00,
						author: "李军",
						pulisher: "上海译文出版社"
					}
				]
			}
		},
		onLoad() {
			
		},
		methods: {
			
		}
	}
</script>

<style>
	.cart-box {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.cart-item {
		width: 700rpx;
		height: 320rpx;
		border-radius: 24rpx;
		background-color: #FFFFFF;
		margin: 14rpx auto;
		display: flex;
	}
	
	.item-checkbox {
		padding: 0 20rpx;
		display: flex;
		align-items: center;
	}
	/*label中的checkbox*/
	
	.item-image {
		width: 220rpx;
		height: 220rpx;
		border-radius: 12rpx;
		display: block;
		margin: auto 0;
	}
</style>
