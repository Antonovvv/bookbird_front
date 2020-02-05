<template>
	<view class="card-box" :style="{backgroundImage:`url(${item.imageUrl})`, }">
		<view class="tips like" :animation="likeAnimation[0]"><view class="cuIcon-likefill"></view></view>
		<view class="tips drop" :animation="dropAnimation[0]"><view class="cuIcon-close"></view></view>
		<view class="info-box">
			<view class="card-info">
				<text style="font-size: 32rpx;">{{item.bookName}}</text>
				<text style="font-size: 22rpx;">{{item.author}} 著/{{item.publisher}}</text>
				<view class="custom-info">
					<text class="info-price">￥{{item.sale}}</text>
					<text>{{newLevel[item.new]}}</text>
					<text>{{item.addr}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			item: {
				type: Object,
				default: function () {return {}}
			}
		},
		data(){
			return{
				newLevel: ['五成', '七成', '九成', '全新'],
				likeAnimation:{0:{}},
				dropAnimation:{0:{}},
				lileAni:null,
				dropAni:null
			}
		},
		mounted() {
			//touch移动喜欢动画
			this.likeAni = uni.createAnimation({
				duration:0
			});
			//touch移动不喜欢动画
			this.dropAni = uni.createAnimation({
				duration:0
			});
		},
		methods: {
			clearAnimation(){
				this.likeAnimation[0] = this.likeAni.export()
				this.dropAnimation[0] = this.dropAni.export()
			},
			_back(){
				//touch移动喜欢动画
				this.likeAni = uni.createAnimation({
					duration:200
				});
				//touch移动不喜欢动画
				this.dropAni = uni.createAnimation({
					duration:200
				});
				this.likeAni.opacity( 0 ).step()
				this.likeAnimation[0] = this.likeAni.export()
				this.dropAni.opacity( 0 ).step()
				this.dropAnimation[0] = this.dropAni.export()
			},
			moveRight(ratio){
				this.likeAni.opacity(ratio).step()
				this.likeAnimation[0] = this.likeAni.export()
				this.dropAni.opacity( 0 ).step()
				this.dropAnimation[0] = this.dropAni.export()
			},
			moveLeft(ratio){
				this.likeAni.opacity( 0 ).step()
				this.likeAnimation[0] = this.likeAni.export()
				this.dropAni.opacity(ratio).step()
				this.dropAnimation[0] = this.dropAni.export()
			},
			moveCenter(){
				this.likeAni.opacity(0).step()
				this.likeAnimation[0] = this.likeAni.export()
				this.dropAni.opacity(0).step()
				this.dropAnimation[0] = this.dropAni.export()
			}
		}
	}
</script>

<style>
	.card-box {
		width: 600rpx;
		height: 700rpx;
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		border-radius: 20rpx;
		box-shadow: 0 0 10rpx #888888;
	}
	.tips {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		font-size: 65rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 999;
		opacity: 0;
	}
	.tips.like {
		position: absolute;
		top: 40rpx;
		left: 40rpx;
		border: 10rpx solid #FF6E78;
		color: #FF6E78;
	}
	.tips.drop {
		position: absolute;
		top: 40rpx;
		right: 40rpx;
		border: 10rpx solid #4CD964;
		font-weight: 900;
		color: #4CD964;
	}
	.info-box {
		width: 600rpx;
		height: 200rpx;
		position: absolute;
		bottom: 0;
		background-image: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.5));
		color: #FFFFFF;
		padding: 50rpx 0 0 36rpx;
		border-radius: 0 0 20rpx 20rpx;
	}
	.card-info {
		display: flex;
		flex-direction: column;
	}
	.custom-info {
		margin-top: 10rpx;
		display: flex;
		justify-content: space-between;
		width: 300rpx;
		font-size: 26rpx;
		line-height: 50rpx;
	}
	.info-price {
		font-size: 34rpx;
		color: #FF6E78;
	}
</style>
