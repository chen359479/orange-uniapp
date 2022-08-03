<template>
	<view>
		<view class='title'>{{ data.title }}</view>
		<view style='padding: 0 20px;'>
			<u-parse :html="data.content"></u-parse>
		</view>
	</view>
</template>

<script>
	export default {
		name: "articleContent",
		data() {
			return {
				data:{}
			}
		},
		
		onLoad: function(option) {
			this.getArticleData(option.lang,option.id);
			let title='';
			if (option.type == 'tgch') {
				title = '推广策划'
			} else if (option.type == 'ssyq') {
				title = '搜索引擎'
			} else if (option.type == 'jzjy') {
				title = '建站经验'
			} else {
				title = 'SEO优化'
			}
			uni.setNavigationBarTitle({
				title: title
			});

		},
		methods: {
			getArticleData(lang, id) {
				this.$u.get(`${this.$url}/api/articleInfo`, {
					lang,
					id
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
	.title {
		text-align: center;
		font-size:  $uni-font-size-lg;
		font-family: 'YouYuan';
		margin-bottom: 20rpx;
	}
</style>
