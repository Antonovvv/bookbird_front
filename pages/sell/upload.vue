<template>
	<view>
		<nav-bar fontColor="#727272">卖书</nav-bar>
		<!--扫码结果-->
		<view class="cu-modal" :class="modalName=='scanResult'?'show':''">
			<view class="cu-dialog confirm-modal">
				<text class="confirm-title">这是你要卖的书吗？</text>
				<image :src="bookResult.imgUrl" class="book-image" mode="aspectFit"/>
				<view class="book-info">
					<text class="book-info-name">{{bookResult.name}}</text>
					<text class="book-info-text" space="emsp">作 者:{{bookResult.author}}</text>
					<text class="book-info-text">出版社:{{bookResult.publisher}}</text>
					<text class="book-info-text" space="emsp">原 价:{{bookResult.price}}</text>
					<text class="book-info-text">出版时间:{{bookResult.pubdate}}</text>
				</view>
				<view class="confirm-button">
					<button class="cu-btn round cancle" @tap="cancle">不是</button>
					<button class="cu-btn round confirm" @tap="confirm">是</button>
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
				<view class="image-box" @tap="viewImage" v-if="postImage">
					<image :src="postImage" mode="aspectFill" class="picture"></image>
					<view class="cu-tag bg-red cancle-tag" @tap.stop="deleteImage">
						<text class='cuIcon-close'></text>
					</view>
				</view>
				<!--相机图标-->
				<view class="camera-box" @tap="chooseImage" v-if="!postImage">
					<text class="cuIcon-cameraadd camera-icon"></text>
				</view>
			</view>
			
			<view class="book-name">{{bookResult.name}}</view>
			<view class="info-box">
				<text class="info-new-text">书籍成色</text>
				<view class="info-new-bar">
					<view class="cu-tag round info-new-tag"  v-for="(tag, index) in newTags" :key="index" 
					:class="(newTagSelected == index) ? 'tag-selected' : ''" @tap="newSelect(index)">{{tag}}</view>
				</view>
				<view class="info-price-bar">
					<text class="info-price-text">价格</text>
					<text class="info-price">￥{{sellPrice.toFixed(2)}}</text>
				</view>
			</view>
			<view class="post-confirm">
				<button class="cu-btn round confirm-btn" :class="confirmAllowed ? 'allowed' : ''"
				@tap="post" :loading="isUploading" :disabled="isUploading">确定</button>
			</view>
		</view>
	</view>
</template>

<script>
	const qiniu = require("../../utils/qiniu.js");
	export default {
		data() {
			return {
				modalName: null,
				space: ' ',
				//doubanUrl: "https://douban.uieee.com/v2/book/",
				bookResult: {
					imgUrl: "",
					name: "",
					ISBN: "",
					author: "",
					publisher: "",
					price: 0,
					pubdate: ""
				},
				postImage: "",
				backImageUrl: "",
				newTags: ["九九新", "九成新", "七成新", "五成新"],
				newTagSelected: -1,
				sellPrice: 5,
				isUploading: false
			}
		},
		computed: {
			confirmAllowed() {
				return (this.postImage && (this.newTagSelected >= 0)) ? true : false
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
				if(!this.postImage) {
					uni.chooseImage({
						count: 1,
						sourceType: ['camera', 'album'],
						success: function (res) {
							_this.postImage = res.tempFilePaths[0]
						}
					})
				}
			},
			viewImage() {
				uni.previewImage({urls: [this.postImage]})
			},
			deleteImage() {
				this.postImage = ""
			},
			newSelect(index) {
				this.newTagSelected = index
			},
			back() {
				uni.navigateBack({})
			},
			post() {
				//uni.navigateBack({})
				if (this.postImage == "") {
					uni.showToast({title: "请添加照片", duration: 3000, icon: 'none'})
				} else if (this.newTagSelected < 0) {
					uni.showToast({title: "请选择书籍成色", duration: 3000, icon: 'none'})
				} else {
					console.log('isbn', this.bookResult.ISBN)
					var _this = this
					var token = uni.getStorageSync('token')
					this.isUploading = true
					uni.request({
						url: _this.global.serverUrl + "post",
						method: 'POST',
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						data: {
							bookName: _this.bookResult.name,
							price: _this.sellPrice,
							new: 3 - _this.newTagSelected,
							description: 'test',
							ISBN: _this.bookResult.ISBN,
							token: token
						},
						success: function (res) {
							if (res.statusCode == 201) {
								var token = res.data.upToken;
								var key = res.data.key
								//console.log(token)
								if (token && token.length > 0) {
									_this.imageUpload(token, key)
								}
							}
							else if (res.statusCode == 404) {
								uni.showToast({title: "找不到这本书", duration: 3000, icon: 'none'})
								_this.isUploading = false
							}
							else {
								console.log('request for token faild')
								_this.isUploading = false
							}
						},
						fail: function (error) {
							console.error('request for token faild')
							_this.isUploading = false
						}
					})
				}
			},
			imageUpload(token, key) {
				var options = {
					region: 'ECN',
					domain: 'img.bookbird.cn',
					uptoken: token,
					key: key
				}
				var _this = this
				qiniu.upload(
					this.postImage,
					(res) => {
						_this.backImageUrl = res.imageURL
						//console.log('file url is: ' + res.fileUrl);
						uni.showToast({title: '上传成功', duration: 3000})
						setTimeout(function() {
							_this.isUploading = false
							uni.navigateBack({})
						}, 1500)
					},
					(error) => {
						console.log('error: ' + error);
					},
					options,
					(progress) => {
						console.log('上传进度', progress.progress)
						//console.log('已经上传的数据长度', progress.totalBytesSent)
						//console.log('预期需要上传的数据总长度', progress.totalBytesExpectedToSend)
					}
				)
			}
		}
	}
</script>

<style>
	/*书本确认modal*/
	.cu-modal .confirm-modal {
		width: 600rpx;
		min-height: 960rpx;
	}
	
	.book-image {
		width: 340rpx;
		height: 440rpx;
		position: relative;
		top: 60rpx;
	}
	
	.book-info {
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		align-items: flex-start;
		padding: 10rpx 130rpx 10rpx 70rpx;
		position: relative;
		top: 50rpx;
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
	
	.confirm-title {
		font-size: 40rpx;
		top: 40rpx;
		position: relative;
	}
	
	.confirm-button {
		margin: 20rpx 0;
		justify-content: space-around;
		display: flex;
		position: relative;
		top: 60rpx;
	}
	
	.confirm-button .confirm {
		width: 208rpx;
		height: 80rpx;
		background-color: #FF6E78;
		font-size: 40rpx;
		color: #FFFFFF;
	}
	
	.confirm-button .cancle {
		width: 208rpx;
		height: 80rpx;
		background-color: #AAAAAA;
		font-size: 40rpx;
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
		padding: 40rpx 0;
		text-align: center;
	}
	
	.camera-text {
		font-size: 42rpx;
		color: #727272;
	}
	
	.image-uploader {
		width: 250rpx;
		height: 250rpx;
		margin: 0 auto;
		position: relative;
	}
	
	.image-box {
		position: absolute;
		width: 250rpx;
		height: 250rpx;
		border: 1rpx solid #FFFFFF;
		border-radius: 18rpx;
		overflow: hidden;
	}
	
	.picture {
		width: 250rpx;
		height: 250rpx;
	}
	
	.image-box .cu-tag {
		position: absolute;
		right: 0;
		top: 0;
		border-radius: 0 18rpx;
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
		height: 350rpx;
		display: flex;
		flex-direction: column;
	}

	.info-new-text {
		margin: 20rpx 45rpx;
		font-size: 32rpx;
		color: #727272;
	}
	
	.info-new-bar {
		padding: 0 40rpx;
		display: flex;
		justify-content: center;
	}
	
	.info-box .info-new-bar .info-new-tag {
		width: 150rpx;
		height: 54rpx;
		border: 2rpx solid #FF6E78;
		background-color: #FFFFFF;
		color: #FF6E78;
		margin: 0 auto;
		font-size: 28rpx;
	}
	
	.info-new-bar .info-new-tag.tag-selected {
		background-color: #FF6E78;
		color: #FFFFFF;
	}
	
	.info-price-bar {
		padding: 50rpx 45rpx;
		display: flex;
		align-items: center;
	}
	.info-price-text {
		color: #727272;
		font-size: 32rpx;
	}
	.info-price {
		color: #FF8F97;
		font-size: 48rpx;
		position: absolute;
		right: 45rpx;
	}
	
	.post-confirm {
		width: 100%;
		position: absolute;
		bottom: 80rpx;
		text-align: center;
	}
	.post-confirm .confirm-btn {
		width: 500rpx;
		height: 100rpx;
		background-color: #AAAAAA;
		color: #FFFFFF;
		font-size: 40rpx;
	}
	.post-confirm .confirm-btn.allowed {
		background-color: #FF6E78;
	}
</style>
