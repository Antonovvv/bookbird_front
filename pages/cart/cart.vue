<template>
	<view>
		<cu-custom bgColor="bg-white">
			<block slot="content">购物车</block>
		</cu-custom>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		onLoad() {
			uni.setNavigationBarTitle({
				title: '购物车'
			})
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
