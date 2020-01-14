<template>
	<button open-type="getUserInfo" @getuserinfo="auth">获取授权</button>
</template>

<script>
	export default {
		data() {
			return {}
		},
		methods: {
			auth(event) {
				console.log(event.detail)
				this.global.nickname = event.detail.nickName
				this.global.openid = event.detail.openid
			} 
		}
	}
</script>

<style>
</style>
