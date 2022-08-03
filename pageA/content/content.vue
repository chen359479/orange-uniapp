<template>
	<view class="content">
		<u-gap height="1"></u-gap>
		<view class='info'>
			<u-row gutter="20" >
				<u-col span="12">
					<text class="title">{{ data.title }}</text>
				</u-col>
				<u-col span="6">
					<u-image width="100%" height="280rpx" :src="data.breviary_img"></u-image>
				</u-col>
				<u-col span="6">
					<view style="color: #82848a;" class="info_list">
						<text>更新日期:{{data.time}}</text><br>
						<text>语言编码:{{data.lang}}</text><br>
						<text>软件大小:{{data.size}}</text><br>
						<text>应用分类:{{data.classify}}</text><br>
						<text>下载用户:{{data.download=='免费下载'?'免费下载':'付费下载'}}</text><br>
					</view>
				</u-col>
			</u-row>
		</view>
		<u-parse :html="data.content"></u-parse>
	</view>
</template>

<script>
	export default {
		name: "content",
		data() {
			return {
				data: {}
			}
		},
		onLoad: function(option) {
			this.getContentData(option.id, option.lang,option.type)
		},
		methods: {
			getContentData(id, lang,type) {
				this.$u.get(`${this.$url}/api/articleInfo`, {
					id,
					lang,
					type
				}).then(res => {
					this.data = res.data;
				});
			}
		},
		components: {

		}

	}
</script>

<style lang="scss" scoped>
	.content {
		padding: 0 20rpx;
		background-color: rgba(200, 200, 200, 0.1);
		color: #000;
		.info{
			padding:10rpx;
			width: 100%;
			border: 2rpx solid #fffae8;
			margin-bottom: 20rpx;
			.title {
				display: inline-block;
				font-size: $uni-font-size-lg;
				text-align: center;
				font-family: 'YouYuan';
				margin-bottom: 20rpx;
			}
			.info_list{
				line-height:48rpx;;
				>text{
					font-size: 32rpx;
					font-family: 'KAITI';
					color: #000;
				}
			}
		}
	}
</style>
