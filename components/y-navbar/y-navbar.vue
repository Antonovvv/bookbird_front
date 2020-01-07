<template>
	<view>
		<view class="cu-custom" :style="[{height:CustomBar + 'px'}]">
			<view class="cu-bar fixed" :style="style" :class="[bgImage!=''?'none-bg text-white bg-img':'',bgColor]">
				<view v-if="leftMode == 'edit'">
					<view class="action" @tap="edit" v-if="!inEdit">
						<slot name="editText"></slot>
					</view>
					<view class="action" @tap="editConfirm" v-if="inEdit">
						<slot name="confirmText"></slot>
					</view>
				</view>
				<view class="content" :style="[{top:StatusBar + 'px'}]">
					<slot name="content"></slot>
				</view>
				<slot name="right"></slot>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				inEdit: false
			};
		},
		name: 'cu-custom',
		computed: {
			style() {
				var StatusBar= this.StatusBar;
				var CustomBar= this.CustomBar;
				var bgImage = this.bgImage;
				var style = `height:${CustomBar}px;padding-top:${StatusBar}px;`;
				if (this.bgImage) {
					style = `${style}background-image:url(${bgImage});`;
				}
				return style
			}
		},
		props: {
			bgColor: {
				type: String,
				default: ''
			},
			leftMode: {
				type: String,
				default: ''
			},
			bgImage: {
				type: String,
				default: ''
			},
		},
		methods: {
			edit() {
				this.inEdit = true
				//this.$emit('edit')
			},
			editConfirm() {
				this.inEdit = false
			}
		}
	}
</script>

<style>

</style>