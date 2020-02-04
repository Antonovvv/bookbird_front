<template>
	<view>
		<nav-bar>随便看看</nav-bar>
		<view class="container" :style="{height:`${contentHeight}px`,width:`${sysWidth}px`}">
			<movable-area class="move-area" :style="{height:`${3*sysHeight}px`,width:`${3*sysWidth}px`,top:`${-sysHeight}px`,left:`${-sysWidth}px` }">
				<movable-view class="move-view" v-for="(item, index) in lookList" :key="item.cardId"
				direction="all" :x="item.moveX" :y="item.moveY" :style="{zIndex:`${9999-item.cardId}`}"
				out-of-bounds v-if="index <= number" :disabled="index != 0" :animation="item.animation"
				@tap="detail(item)" @touchstart="touchStart" @touchmove="touchMove" @touchend="touchend">
					<view class="card-box" :animation="animationData[index]"
					:style="{backgroundImage:`url(${item.imageUrl})`, transform:index < number ? `rotate(${rotate*index}deg) scale(${ 1-(1-scale.x)*index },${ 1-(1-scale.y)*index }) skew(${skew.x*index}deg, ${skew.y*index}deg) translate(${translate.x*index}px, ${translate.y*index}px)` 
					: `rotate(${rotate*(number-1)}deg) scale(${ 1-(1-scale.x)*(number-1) },${ 1-(1-scale.y)*(number-1) }) skew(${skew.x*(number-1)}deg, ${skew.y*(number-1)}deg) translate(${translate.x*(number-1)}px, ${translate.y*(number-1)}px)`,
					opacity:index<number?`${ 1-(1-opacity)*index }`:`${ 1-(1-opacity)*(number-1) }`}">
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
				</movable-view>
			</movable-area>
			<view class="action-box">
				<button class="drop-button" @tap="drop"><view class="cuIcon-close"></view></button>
				<button class="like-button" @tap="like"><view class="cuIcon-likefill"></view></button>
			</view>
		</view>
	</view>
</template>

<script>
	import clCardDel from "@/components/cl-cardDel/cl-cardDel";
	export default {
		mixins: [clCardDel],
		data() {
			return {
				lookList: [],
				cardCount: 0,
				newLevel: ['五成', '七成', '九成', '全新'],
				vibrated: false
			}
		},
		onLoad() {
			this.getList()
		},
		methods: {
			init() {
				this.number = 2
				this.scale = {x:0.9, y:0.9}
				this.moveRotate = { //设置位移图片旋转角度距离  card中心点 - 指向坐标
					x:0,
					y:uni.getSystemInfoSync().screenHeight,
				}
			},
			getList() {
				var _this = this
				uni.request({
					url: this.global.serverUrl + "post/look",
					data: {count: 5},
					success: function (res) {
						if (res.statusCode == 200) {
							console.log(res.data.lookList);
							var dataList = res.data.lookList
							for (let item of dataList) {
								item.imageUrl = _this.global.bucketUrl + item.imageName
								item.sale = item.sale.toFixed(2)
								item.cardId = _this.cardCount++
								item.moveX = 0
								item.moveY = 0
								item.animation = false
							}
							_this.lookList = [..._this.lookList, ...dataList]
						} else {
							uni.navigateBack({})
						}
					}
				})
			},
			moveJudge(x, y, ratio) {//触摸移动判断
				//let e = this.$refs.cardBox[0]
				if (Math.abs(x) > 120 && !this.vibrated) {//达到触发条件时短振动
					uni.vibrateShort({})
					this.vibrated = true
				} else if (Math.abs(x) <= 120 && this.vibrated) {
					this.vibrated = false
				}
			},
			endJudge(x, y) {//触摸结束判断
				//let e = this.$refs.cardBox[0]
				if (Math.abs(x) <= 120) {
					this._back()
				} else {
					uni.vibrateShort({})
					this._del()
				}
			},
			delCard(x, y) {//移除card时
				if (x > 0) {
					uni.showToast({title: '加入购物车'})
				}
			},
			drop() {
				uni.vibrateShort({})
				uni.showToast({title: '扔掉'})
			},
			like() {
				uni.vibrateShort({})
				uni.showToast({title: '加入购物车'})
			},
			detail() {
				
			}
		}
	}
</script>

<style>
	.container {
		width: 100%;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		background-color: #FFFFFF;
	}
	.move-area {
		position: absolute;
	}
	.move-view {
		width: 600rpx;
		height: 700rpx;
		position: absolute;
		left: 50%;
		top: 50%;
		margin-left: -300rpx;
		margin-top: -500rpx;
	}

	.card-box {
		width: 600rpx;
		height: 700rpx;
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		border-radius: 20rpx;
		box-shadow: 0 0 10rpx #888888;
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
	
	.action-box {
		position: absolute;
		bottom: 120rpx;
		width: 80%;
		display: flex;
		justify-content: space-around;
	}
	.action-box .drop-button {
		width: 130rpx;
		height: 130rpx;
		line-height: 130rpx;
		border-radius: 50%;
		font-size: 65rpx;
		color: #4CD964;
		background-color: #FFFFFF;
		box-shadow: 0 0 10rpx #D8D8D8; 
	}
	.action-box .like-button {
		width: 130rpx;
		height: 130rpx;
		line-height: 130rpx;
		border-radius: 50%;	
		font-size: 65rpx;
		color: #ED1C24;
		background-color: #FFFFFF;
		box-shadow: 0 0 10rpx #D8D8D8;
	}
</style>
