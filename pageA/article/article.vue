<template>
	<view>
		<u-cell-item v-for='item in data' :value='item.time' :arrow="false" @click='gopath(item.id)' >
			<template slot='title'>
				<text class="title" :style='haveBeenTo.includes(item.id)?"color:#c0c0c0":""'>
					{{item.title}}
				</text>
			</template>
		</u-cell-item>
	</view>
</template>

<script>
	export default {
		name: "article",
		data() {
			return {
				title:"",
				data: [],
				haveBeenTo:[],
				page:1
			}
		},
		onLoad() {

		},
		onLoad: function(option) {
			this.getArticleData(option.type);
			this.title=option.type;
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
				this.$u.get(`${this.$url}/unapi/articleTextList`, {
					tableName:lang,
					page:this.page,
					pageSize:20
				}).then(res => {
					this.data = res.data;
				});
			},
			gopath(id){
				this.haveBeenTo.push(id)
				this.$u.route({
					url: '/pageA/articleContent/articleContent',
					params: {
						lang:this.title,
						id
					}
				})
			}
		},
		components: {

		}
	}
</script>

<style lang="scss" scoped>
	.title {
		display: inline-block;
		width: 60vw;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
