<template>
	<view class="container">
		<cu-custom bgColor="bg-white">
			<block slot="content">搜索</block>
		</cu-custom>
		<!--searchBar-->
		<view class="cu-bar bg-white search-bar">
			<view class="search-form round search-box">
				<text space="emsp">{{space}}</text>
				<input @confirm="searchConfirm" :adjust-position="false" type="text" 
				:value="searchText" confirm-type="search"
				class="search"/>
				<text class="cuIcon-search"></text>
			</view>
		</view>
		<!--searchBar-->
		<!--selectBar-->
		<view class="bg-white nav select-bar">
			<view class="select-item cu-item" :class="index==selectCur?'selected':''" v-for="(item, index) in selectItems" :key="index"
			@tap="selectChange" :data-id="index">{{item}}</view>
		</view>
		<!--selectBar-->
		<!--bookList-->
		<view class="tui-product-list">
			<view class="tui-product-container">
				<block v-for="(item,index) in bookList" :key="index">
					<view class="tui-pro-item tui-flex-list" hover-class="hover" :hover-start-time="150" @tap="detail(item)">
						<image :src="item.img" class="tui-pro-img tui-proimg-list"
						 mode="widthFix" />
						<view class="tui-pro-content">
							<view class="tui-pro-tit">{{item.name}}</view>
							<view class="book-info">{{item.author}} 著/{{item.publisher}}</view>
							<view class="book-tags">
								<view class="tui-pro-price">
									<text class="book-price">￥{{item.sale.toFixed(2)}}</text>
								</view>
								<view class="cu-tag radius book-tag">五成</view>
								<view class="cu-tag radius book-tag">韵苑23栋</view>
							</view>
						</view>
					</view>
				</block>
			</view>
		</view>
		<!--bookList-->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				space: ' ',
				searchText: '',
				selectCur: 0,
				selectItems: ['综合', '价格', '距离', '成色'],
				bookList:[
					{
						name: "微积分",
						bookId: "",
						img: "../../static/book.png",
						sale: 6.00,
						author: "李军",
						publisher: "上海译文出版社"
					},
					{
						name: "微积分",
						bookId: "",
						img: "../../static/book.png",
						sale: 6.00,
						author: "李军",
						publisher: "上海译文出版社"
					},
					{
						name: "电路理论",
						bookId: "",
						img: "../../static/bird_logo.jpg",
						sale: 6.00,
						author: "李军",
						publisher: "上海译文出版社"
					},
					{
						name: "微积分",
						bookId: "",
						img: "../../static/bird_logo.jpg",
						sale: 6.00,
						author: "李军",
						publisher: "上海译文出版社"
					},
					{
						name: "微积分",
						bookId: "",
						img: "../../static/bird_logo.jpg",
						sale: 6.00,
						author: "李军",
						publisher: "上海译文出版社"
					},{
						name: "微积分",
						bookId: "",
						img: "../../static/bird_logo.jpg",
						sale: 6.00,
						author: "李军",
						publisher: "上海译文出版社"
					},{
						name: "微积分",
						img: "../../static/bird_logo.jpg",
						bookId: "",
						sale: 6.00,
						author: "李军",
						publisher: "上海译文出版社"
					}
				]
			}
		},
		onLoad(option) {
			this.searchText = JSON.parse(decodeURIComponent(option.text))
		},
		methods: {
			selectChange(e) {
				this.selectCur = e.currentTarget.dataset.id
			},
			detail(item) {
				uni.navigateTo({
					url: "../detail/detail?bookid=" + item.bookId + "&name=" + item.name
				})
			}
		}
	}
</script>

<style>
	.container {
		
	}
	
	.search-bar {
		z-index: 999;
		position: fixed;
		box-sizing: border-box;
	}
	
	.select-bar {
		width: 100%;
		position: fixed;
		margin-top: 100rpx;
		z-index: 888;
		box-sizing: border-box;
	}
	.nav .select-item {
		height: 70rpx;
		line-height: 70rpx;
		margin: 0 20rpx;
	}
	.selected {
		color: #FF6E78;
	}
	
	.tui-product-list {
		display: flex;
		justify-content: space-between;
		flex-direction: row;
		flex-wrap: wrap;
		box-sizing: border-box;
		margin-top: 170rpx;
	}
	
	.tui-product-container {
		flex: 1;
		margin-right: 10rpx;
	}
	
	.tui-product-container:last-child {
		margin-right: 0;
	}
	
	.tui-pro-item {
		width: 100%;
		margin-bottom: 10rpx;
		background: #fff;
		box-sizing: border-box;
		border-radius: 12rpx;
		overflow: hidden;
		transition: all 0.15s ease-in-out;
		padding: 20rpx;
	}
	
	.tui-flex-list {
		display: flex;
		margin-bottom: 4rpx !important;
	}
	
	.tui-pro-img {
		width: 100%;
		display: block;
	}
	
	.tui-proimg-list {
		width: 170rpx;
		height: 170rpx !important;
		flex-shrink: 0;
		border-radius: 12rpx;
	}
	
	.tui-pro-content {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		box-sizing: border-box;
		padding: 10rpx 20rpx;
	}
	
	.tui-pro-tit {
		color: #727272;
		font-size: 32rpx;
		word-break: break-all;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}
	
	.book-info {
		color: #727272;
		font-size: 22rpx;
		overflow: hidden;
	}
	
	.book-tags {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	
	.book-tag {
		border-color: #AAAAAA;
		color: #727272;
		margin-top: 18rpx;
	}
	
	.tui-pro-price {
		padding-top: 18rpx;
		margin-right: 18rpx;
	}
	
	.book-price {
		font-size: 30rpx;
		font-weight: 500;
		color: #FF6E78;
	}
	
	.tui-factory-price {
		font-size: 24rpx;
		color: #a0a0a0;
		text-decoration: line-through;
		padding-left: 12rpx;
	}
	
	.tui-pro-pay {
		padding-top: 10rpx;
		font-size: 24rpx;
		color: #656565;
	}
</style>
