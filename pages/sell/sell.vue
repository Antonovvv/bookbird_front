<template>
	<view>
		<cu-custom bgColor="bg-white">
			<block slot="content">卖书</block>
		</cu-custom>
		<!--卖书引导-->
		<view class="guide-content">
			<view class="guide-block">
			</view>
		</view>
		
		<view class="upload-box">
			<button class="cu-btn round scan-button" @tap="scanQR">
				<text class="cuIcon-scan scan-icon"></text><text space="ensp">{{space}}扫码卖书</text></button>
		</view>
		
		<view class="cu-modal" :class="showResult?'show':''">
			<view class="cu-dialog">
				<image :src="bookResult.imgUrl" class="book-image" mode="aspectFit"/>
				<view class="book-info">
					<text class="book-name">{{bookResult.name}}</text>
					<text class="book-info-text" space="emsp">作 者:{{bookResult.author}}</text>
					<text class="book-info-text">出版社:{{bookResult.publisher}}</text>
					<text class="book-info-text" space="emsp">原 价:{{bookResult.price}}</text>
					<text class="book-info-text">出版时间:{{bookResult.pubdate}}</text>
				</view>
				<view class="confirm-box">
					<text class="confirm-text">这是你要卖的书吗？</text>
					<view class="confirm-button">
						<button class="cu-btn round cancle" @tap="hideModal">不是</button>
						<button class="cu-btn round confirm" @tap="confirm">是</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				space: ' ',
				bookISBN: '',
				showResult: false,
				doubanUrl: "https://douban.uieee.com/v2/book/",
				bookResult: {
					imgUrl: "",
					name: "",
					author: "",
					publisher: "",
					price: 0,
					pubdate: ""
				}
			}
		},
		onLoad() {
			
		},
		methods: {
			showModal() {
				this.showResult = true
			},
			hideModal() {
				this.showResult = false
			},
			scanQR() {
				var _this = this
				uni.scanCode({
					success: function (res) {
						//console.log(res.result)
						_this.bookISBN = res.result
						_this.queryBook(res.result)
						
					}
				})
			},
			queryBook(code) {
				var _this = this
				uni.request({
					url: _this.doubanUrl + "isbn/" + code,
					//header[content-type]默认为application/json，请求会被拒绝
					header: {
						'content-type': 'json'
					},
					success: function (res) {
						_this.bookResult = {
							imgUrl: res.data.image,
							name: res.data.title,
							author: res.data.author[0],
							publisher: res.data.publisher,
							price: res.data.price,
							pubdate: res.data.pubdate
						}
						_this.showModal()
					}
				})
			}
		}
	}
</script>

<style>
	.guide-content {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.guide-content .guide-block {
		margin: 100rpx 0;
	}
	
	.upload-box {
		width: 100%;
		height: 140rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: fixed;
		bottom: 50rpx;
	}
	
	.upload-box .scan-button {
		width: 472rpx;
		height: 102rpx;
		background-color: #FF6E78;
		font-size: 36rpx;
		color: #FFFFFF;
	}
	
	.cu-btn .scan-icon {
		font-size: 50rpx;
	}
	
	.book-image {
		width: 400rpx;
		height: 500rpx;
	}
	
	.book-info {
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		align-items: flex-start;
		padding: 10rpx 130rpx;
	}
	
	.book-name {
		font-size: 36rpx;
		color: #727272;
		margin-bottom: 20rpx;
	}
	
	.book-info-text {
		font-size: 28rpx;
		color: #A1A1A1;
	}
	
	.confirm-text {
		font-size: 32rpx;
		margin-bottom: 16rpx;
	}
	
	.confirm-button {
		margin: 20rpx 0;
		justify-content: space-around;
		display: flex;
	}
	
	.confirm-button .confirm {
		width: 280rpx;
		height: 102rpx;
		background-color: #FF6E78;
		font-size: 42rpx;
		color: #FFFFFF;
	}
	
	.confirm-button .cancle {
		width: 280rpx;
		height: 102rpx;
		background-color: #AAAAAA;
		font-size: 42rpx;
		color: #FFFFFF;
	}
</style>
