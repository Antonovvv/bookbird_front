<template>
	<view class="container">
		<cu-custom bgColor="bg-white">
			<block slot="content">搜索</block>
		</cu-custom>
		<!--searchBar-->
		<view class="cu-bar bg-white search-bar">
			<view class="search-form round search-box">
				<text space="emsp">{{space}}</text>
				<input @confirm="searchConfirm" @input="searchInput" :adjust-position="false" type="text" 
				:value="searchText" confirm-type="search"
				class="search"/>
				<text class="cuIcon-search"></text>
			</view>
		</view>
		<!--searchBar-->
		<!--selectBar-->
		<view class="bg-white nav select-bar">
			<view class="select-item cu-item" :class="index==selectCur?'selected':''" v-for="(item, index) in selectItems" :key="index"
			@tap="selectChange" :data-id="index">
				{{item}}
				<text :class="orderPriceAscend?'cuIcon-triangleupfill':'cuIcon-triangledownfill'" v-if="index==1 && selectCur==1"></text>
				<text :class="orderNewAscend?'cuIcon-triangleupfill':'cuIcon-triangledownfill'" v-if="index==3 && selectCur==3"></text>
			</view>
		</view>
		<!--selectBar-->
		<!--bookList-->
		<view class="tui-product-list">
			<view class="tui-product-container">
				<block v-for="(item,index) in bookList" :key="index">
					<view class="tui-pro-item tui-flex-list" hover-class="hover" :hover-start-time="150">
						<image :src="item.imageUrl" class="tui-pro-img tui-proimg-list"
						 mode="widthFix"  @tap="detail(item)"/>
						<view class="tui-pro-content" @tap="detail(item)">
							<view class="tui-pro-tit">{{item.bookName}}</view>
							<view class="book-info">{{item.author}} 著/{{item.publisher}}</view>
							<view class="book-tags">
								<view class="tui-pro-price">
									<text class="book-price">￥{{item.sale.toFixed(2)}}</text>
								</view>
								<view class="cu-tag radius book-tag">{{newLevel[item.new]}}</view>
								<view class="cu-tag radius book-tag">{{item.dorm}}</view>
							</view>
						</view>
						<view class="product-add" @tap="addToCart(item.bookId)">
							<text class="cuIcon-add"></text>
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
				orderPriceAscend: true,
				orderNewAscend: false,
				newLevel: ['五成', '七成', '九成', '全新'],
				bookList: []
			}
		},
		computed: {
			
		},
		onLoad(option) {
			this.searchText = JSON.parse(decodeURIComponent(option.text))
		},
		onShow() {
			this.search(this.searchText)
		},
		methods: {
			searchInput(e) {
				this.searchText = e.detail.value
			},
			searchConfirm() {
				this.search(this.searchText)
			},
			search(text) {
				var _this = this
				if (text == '') {
					uni.showToast({
						title: '搜索内容不能为空哦',
						duration: 3000,
						icon: 'none'
					})
				} else {
					uni.request({
						url: this.global.serverUrl + "post",
						data: {
							bookName: text
						},
						success: function (res) {
							console.log(res.data.searchRes);
							_this.bookList = res.data.searchRes
							for (let item of _this.bookList) {
								item.imageUrl = _this.global.bucketUrl + item.imageName
							}
						}
					})
				}
			},
			sortBy(attr, order) {
				//按参数排序，默认升序
				if(order == undefined) {
					order = 1
				} else {
					order = order ? 1 : -1
				}
				return function(item1, item2) {
					let a = item1[attr];
					let b = item2[attr];
					if(a < b) {
						return -1 * order
					}
					else if(a > b) {
						return order
					}
					return 0
				}
			},
			selectChange(e) {
				if (this.selectCur == e.currentTarget.dataset.id) {//重复点击同类排序
					if (this.selectCur == 1) {//按价格排序
						this.orderPriceAscend = !this.orderPriceAscend
						this.bookList.sort(this.sortBy('sale', this.orderPriceAscend))
					}
					else if (this.selectCur == 3) {//按成色排序
						this.orderNewAscend = !this.orderNewAscend
						this.bookList.sort(this.sortBy('new', this.orderNewAscend))
					}
				} else {//首次点击排序
					this.selectCur = e.currentTarget.dataset.id//改变光标
					switch (this.selectCur){
						case 0:
							//
							break;
						case 1://按价格排序，默认升序
							this.orderPriceAscend = true
							this.bookList.sort(this.sortBy('sale', this.orderPriceAscend))
							break;
						case 2:
							//
							break;
						case 3://按成色排序，默认降序
							this.orderNewAscend = false
							this.bookList.sort(this.sortBy('new', this.orderNewAscend))
							break;
						default:
							break;
					}
				}
			},
			detail(item) {
				uni.navigateTo({
					url: "../detail/detail?bookid=" + item.bookId + "&bookName=" + item.bookName
				})
			},
			addToCart(item) {
				uni.showToast({
					title: '加入购物车'
				});
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
		width: 80rpx;
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
	
	.product-add {
		margin: auto 34rpx auto auto;
		width: 66rpx;
		height: 66rpx;
		border-radius: 50%;
		background-color: #FFABB0;
		color: #FFFFFF;
		font-size: 56rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
