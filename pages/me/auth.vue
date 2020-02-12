<template>
	<view>
		<nav-bar fontColor="#727272">身份认证</nav-bar>
		<form class="info-box">
			<view class="info-form">
				<view class="form-title">姓名</view>
				<input v-model="myName" placeholder="请输入姓名"/>
			</view>
			<view class="info-form">
				<view class="form-title">学号</view>
				<input v-model="studentId" placeholder="请输入学号"/>
			</view>
			<view class="info-form">
				<view class="form-title">专业</view>
				<picker ></picker>
			</view>
			<view class="info-form">
				<view class="form-title">我的地址</view>
				<view class="form-content">
					<picker mode="multiSelector" @columnchange="addrChange" @change="addrPickerConfirm" @cancel="addrPickerCancle"
					:value="addrIndexes" :range="addrArray">
						<view class="addr-picker">
							{{addressIndexes[0] == 0 ? addrText : (addressArray[0][addressIndexes[0]] + ',' + addressArray[1][addressIndexes[1]])}}
						</view>
					</picker>
				</view>
			</view>
		</form>
		
		<view class="card-box">
			<view class="image-title">上传校园卡照片</view>
			<view class="image-box" @tap="choosePicture">
				<image :src="cardImage" class="picture" mode="aspectFit" v-if="cardImage"></image>
				<view class="cu-tag bg-red cancle-tag" @tap.stop="deletePicture" v-if="cardImage">
					<text class='cuIcon-close'></text>
				</view>
			</view>
			<view class="image-tip">请拍照上传校园卡正面</view>
		</view>
		
		<view class="action-box">
			<button class="cu-btn round submit-button" @tap="submit" :loading="isUploading" :disabled="isUploading">提交认证</button>
		</view>
	</view>
</template>

<script>
	const qiniu = require("../../utils/qiniu.js");
	export default {
		data() {
			return {
				addrIndexes: [0, 0],
				addrArray: [
					['无', '东校区', '主校区东', '主校区西', '同济校区'],
					['无']
				],
				addressIndexes: [0, 0],
				addressArray: [
					['无', '东校区', '主校区东', '主校区西', '同济校区'],
					['无']
				],
				myName: "",
				studentId: "",
				addrText: '请选择楼栋',
				cardImage: "",
				isUploading: false
			}
		},
		computed: {
			myAddress() {
				return this.addressArray[1][this.addressIndexes[1]]
			},
			dormList() {
				var listY = []; var listQ = []; var listZ = []; var listT = [];
				for (let i = 1; i <= 27; i ++) {
					listY.push('韵苑' + i + '栋')
				}
				for (let i = 1; i <= 13; i ++) {
					listQ.push('沁苑东' + i + '舍')
				}
				for (let i = 1; i <= 13; i ++) {
					listZ.push('紫菘' + i + '栋')
				}
				for (let i = 1; i <= 8; i ++) {
					listT.push('同济50' + i + '栋')
				}
				return {'yy': listY, 'qy': listQ, 'zs': listZ, 'tj': listT}
			}
		},
		onLoad(option) {
			if (option.authorized == 'true') {
				var _this = this
				var token = uni.getStorageSync('token')
				if (token) {
					uni.request({
						url: this.global.serverUrl + "user",
						data: {
							token: token
						},
						success: function (res) {
							if (res.statusCode == 200) {
								_this.myName = res.data.myName
								_this.studentId = res.data.studentId
								_this.addrText = res.data.address
								//_this.cardImage = "http://" + res.data.cardImageUrl
							} else if (res.statusCode == 403) {
								uni.showToast({title: 'token过期，请重新进入小程序', duration: 3000, icon: 'none'})
							}
						}
					})
				}
			}
		},
		onShow() {
		},
		methods: {
			addrPickerConfirm(e) {
				this.addressIndexes = this.addrIndexes.slice(0)//深拷贝，只拷贝值
				this.addressArray = this.addrArray.slice(0)
			},
			addrPickerCancle() {
				this.addrIndexes = this.addressIndexes.slice(0)
				this.addrArray = this.addressArray.slice(0)
			},
			addrChange(e) {
				var data = {
					index: this.addrIndexes,//地址拷贝，直接修改值
					array: this.addrArray
				}
				data.index.splice(e.detail.column, 1, e.detail.value)//直接赋值时，第二列的变化将不是响应式的！
				if (e.detail.column == 0) {
					switch (e.detail.value) {
						case 0:
							data.array.splice(1, 1, ['无'])//直接赋值将不是响应式的！！！
							break;
						case 1:
							data.array.splice(1, 1, this.dormList.yy)
							break;
						case 2:
							data.array.splice(1, 1, this.dormList.qy)
							break;
						case 3:
							data.array.splice(1, 1, this.dormList.zs)
							break;
						case 4:
							data.array.splice(1, 1, this.dormList.tj)
							break;
					}
					data.index[1] = 0
				}
			},
			choosePicture() {
				var _this = this
				if(!this.cardImage) {
					uni.chooseImage({
						count: 1,
						sourceType: ['camera', 'album'],
						success: function (res) {
							_this.cardImage = res.tempFilePaths[0]
						}
					})
				} else {
					uni.previewImage({
						urls: [this.cardImage]
					})
				}
			},
			deletePicture() {
				this.cardImage = ""
			},
			submit() {
				if (this.myName == "") {
					uni.showToast({title: "请输入姓名", duration: 3000, icon: 'none'})
				} else if (this.studentId == "") {
					uni.showToast({title: "请输入学号", duration: 3000, icon: 'none'})
				} else if (this.myAddress == "无") {
					uni.showToast({title: "请选择楼栋", duration: 3000, icon: 'none'})
				} else if (this.cardImage == "") {
					uni.showToast({title: "请添加校园卡照片", duration: 3000, icon: 'none'})
				} else {
					var _this = this
					var token = uni.getStorageSync('token')
					this.isUploading = true
					uni.request({
						url: _this.global.serverUrl + "user",
						method: 'PUT',
						header: {
							'content-type': 'application/x-www-form-urlencoded'
						},
						data: {
							token: token,
							myName: this.myName,
							studentId: this.studentId,
							address: this.myAddress,
						},
						success: function (res) {
							if (res.statusCode == 200) {
								var token = res.data.upToken;
								var key = res.data.key
								//console.log(token)
								if (token && token.length > 0) {
									_this.imageUpload(token, key)
								}
							}
							else if (res.statusCode == 400) {
								uni.showToast({title: "提交失败", duration: 3000, icon: 'none'})
								_this.isUploading = false
							}
							else {
								console.log('request for token faild')
								_this.isUploading = false
							}
						},
						fail: function (error) {
							console.error(error)
							_this.isUploading = false
						}
					})
				}
			},
			imageUpload(token, key) {
				var options = {
					region: 'ECN',
					domain: 'imgs.bookbird.cn',
					uptoken: token,
					key: key
				}
				var _this = this
				qiniu.upload(
					this.cardImage,
					(res) => {
						console.log(res);
						uni.showToast({title: '提交成功', duration: 3000})
						_this.cardImage = ""
						_this.isUploading = false
						_this.global.isAuthorized = true
					},
					(error) => {
						console.log('error: ' + error);
					},
					options,
					(progress) => {
						console.log('上传进度', progress.progress)
					}
				)
			}
		}
	}
</script>

<style>
	.info-box {
	}
	.info-form {
		display: flex;
		align-items: center;
		padding: 0 36rpx;
		min-height: 100rpx;
		background-color: #FFFFFF;
	}
	.form-title {
		text-align: justify;
		padding-right: 30rpx;
		font-size: 32rpx;
		position: relative;
		color: #636363;
		line-height: 100rpx;
	}
	.form-content {
		flex: 1;
		font-size: 32rpx;
		color: #9B9B9B;
		text-align: right;
		line-height: 100rpx;
	}
	.addr-picker {
		line-height: 100rpx;
	}
	.addr-picker:after {
		font-family: cuIcon;
		content: "\e6a3";
		font-size: 34upx;
		color: #8799a3;
		line-height: 100upx;
		width: 60upx;
		text-align: center;
	}
	.info-form input {
		flex: 1;
		font-size: 32rpx;
		color: #9B9B9B;
		text-align: right;
	}
	.info-form+.info-form {
		border-top: 2rpx solid #EFEFEF;
	}
	
	.card-box {
		margin-top: 16rpx;
		background-color: #FFFFFF;
		padding: 20rpx;
		display: flex;
		flex-direction: column;
	}
	.image-title {
		margin-left: 18rpx;
		margin-bottom: 28rpx;
		color: #636363;
		font-size: 32rpx;
	}
	.image-box {
		width: 660rpx;
		height: 320rpx;
		background-color: #EFEFEF;
		border-radius: 10rpx;
		margin: 0 auto;
		position: relative;
	}
	.picture {
		width: 660rpx;
		height: 320rpx;
		background-color: #EFEFEF;
		border-radius: 10rpx;
	}
	.image-box .cu-tag {
		position: absolute;
		right: 0;
		top: 0;
		border-radius: 0 10rpx;
		padding: 6upx 12upx;
		height: auto;
		background-color: rgba(0, 0, 0, 0.5);
	}
	.image-tip {
		margin: 0 auto;
		margin-top: 12rpx;
		color: #B6B6B6;
		font-size: 28rpx;
	}
	
	.action-box {
		width: 100%;
		position: fixed;
		bottom: 80rpx;
		text-align: center;
	}
	.action-box .submit-button {
		width: 400rpx;
		height: 80rpx;
		background-color: #FF6E78;
		font-size: 40rpx;
		color: #FFFFFF;
	}
</style>
