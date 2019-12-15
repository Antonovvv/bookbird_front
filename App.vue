<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	@import "colorui/main.css";
	@import "colorui/icon.css";
	/*每个页面公共css */
	.search-bar {
		width: 700rpx;
		border: 5rpx solid;
		border-color: #ff6e78;
		background-color: #FFFFFF;
	}
	
</style>
