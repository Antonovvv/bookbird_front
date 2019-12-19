<template>
	<view>
		<cu-custom bgColor="bg-white">
			<block slot="content">{{title}}</block>
		</cu-custom>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: ""
			}
		},
		onLoad(option) {
			this.title = option.name
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
