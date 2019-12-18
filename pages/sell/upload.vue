<template>
	<view>
		<cu-custom bgColor="bg-white">
			<block slot="content">卖书</block>
		</cu-custom>
		<!--扫码结果-->
		<view class="cu-modal" :class="modalName=='scanResult'?'show':''">
			<view class="cu-dialog">
				<image :src="bookResult.imgUrl" class="book-image" mode="aspectFit"/>
				<view class="book-info">
					<text class="book-info-name">{{bookResult.name}}</text>
					<text class="book-info-text" space="emsp">作 者:{{bookResult.author}}</text>
					<text class="book-info-text">出版社:{{bookResult.publisher}}</text>
					<text class="book-info-text" space="emsp">原 价:{{bookResult.price}}</text>
					<text class="book-info-text">出版时间:{{bookResult.pubdate}}</text>
				</view>
				<view class="confirm-box">
					<text class="confirm-text">这是你要卖的书吗？</text>
					<view class="confirm-button">
						<button class="cu-btn round cancle" @tap="cancle">不是</button>
						<button class="cu-btn round confirm" @tap="confirm">是</button>
					</view>
				</view>
			</view>
		</view>
		<!--上传内容-->
		<view class="upload-box" v-show="!modalName">
			<view class="camera-text-bar">
				<text class="camera-text">拍照</text>
			</view>
			
			<view class="image-uploader">
			<!--布局-->
				<!--已选图片-->
				<view class="image-box" @tap="viewImage" v-if="bookImage">
					<image :src="bookImage" mode="aspectFill" class="picture"></image>
					<view class="cu-tag bg-red cancle-tag" @tap.stop="deleteImage">
						<text class='cuIcon-close'></text>
					</view>
				</view>
				<!--相机图标-->
				<view class="camera-box" @tap="chooseImage" v-if="!bookImage">
					<text class="cuIcon-cameraadd camera-icon"></text>
				</view>
			</view>
			
			
			<view class="book-name">{{bookResult.name}}</view>
			<view class="info-box">
				
			</view>
			<view class="price-box">
				<text>价格：￥{{bookPrice.toFixed(2)}}</text>
			</view>
			<view>
				<view class="confirm-button">
					<button class="cu-btn round cancle" @tap="back">返回</button>
					<button class="cu-btn round confirm" @tap="post">确定</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				modalName: null,
				space: ' ',
				bookISBN: '',
				doubanUrl: "https://douban.uieee.com/v2/book/",
				bookResult: {
					imgUrl: "",
					name: "",
					ISBN: "",
					author: "",
					publisher: "",
					price: 0,
					pubdate: ""
				},
				bookImage: "",
				bookPrice: 5
			}
		},
		onLoad(option) {
			const book = JSON.parse(decodeURIComponent(option.book))
			this.bookResult = {
				imgUrl: book.image,
				name: book.title,
				ISBN: book.isbn13,
				author: book.author[0],
				publisher: book.publisher,
				price: book.price,
				pubdate: book.pubdate
			}
			this.showModal("scanResult")
		},
		methods: {
			showModal(target) {
				this.modalName = target
			},
			hideModal() {
				this.modalName = null
			},
			cancle() {
				uni.navigateBack({})
			},
			confirm() {
				this.hideModal()
			},
			chooseImage() {
				var _this = this
				if(!this.bookImage) {
					uni.chooseImage({
						count: 1,
						sourceType: ['camera', 'album'],
						success: function (res) {
							_this.bookImage = res.tempFilePaths[0]
						}
					})
				}
			},
			viewImage() {
				uni.previewImage({
					urls: [this.bookImage]
				})
			},
			deleteImage() {
				this.bookImage = ""
			},
			back() {
				uni.navigateBack({})
			},
			post() {
				uni.navigateBack({})
			}
		}
	}
</script>

<style>
	/*书本确认modal*/
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
	
	.book-info-name {
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
	/*主界面*/
	.main-hide {
		opacity: 0;
	}
	.upload-box {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	
	.camera-text-bar {
		width: 100%;
		padding-top: 40rpx;
		padding-bottom: 10rpx;
	}
	
	.camera-text {
		font-size: 42rpx;
		color: #727272;
		margin-left: 70rpx;
	}
	
	.image-uploader {
		width: 250rpx;
		height: 250rpx;
		margin: 0 auto;
		position: relative;
	}
	
	.image-box {
		position: absolute;
	}
	
	.picture {
		width: 250rpx;
		height: 250rpx;
	}
	
	.image-box .cu-tag {
		position: absolute;
		right: 0;
		top: 0;
		border-bottom-left-radius: 6upx;
		padding: 6upx 12upx;
		height: auto;
		background-color: rgba(0, 0, 0, 0.5);
	}
	
	.camera-box {
		width: 250rpx;
		height: 250rpx;
		border: 2rpx solid;
		border-color: #979797;
		border-radius: 18rpx;
		background-color: #D8D8D8;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		color: #FFFFFF;
	}
	
	.camera-box .camera-icon {
		font-size: 100rpx;
		align-self: center;
	}
	
	/*.camera-image {
		width: 144rpx;
		height: 144rpx;
	}
	
	.photo {
		border-radius: 18rpx;
	}*/
	
	.delete-btn {
		margin: 0 auto;
		position: relative;
		left: 140rpx;
	}
	
	.book-name {
		text-align: center;
		padding: 40rpx;
		font-size: 36rpx;
		color: #727272;
	}
	
	.info-box {
		width: 600rpx;
		height: 350rpx;
		border-radius: 18rpx;
		background-color: #F1F1F1;
		margin: 0 auto;
	}
	
	.price-box {
		padding: 40rpx;
		text-align: center;
		font-size: 40rpx;
		color: #727272;
	}
</style>
