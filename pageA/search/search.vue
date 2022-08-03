<template>
	<view>
		<u-search placeholder="请输入查询内容" v-model="searchFrom.title" focus @search='search' @focus='iptFoucs=true' @custom='search'
		 style='position: fixed;width: 100%;z-index: 3;background-color: #fff;'></u-search>
		<u-gap height="60" bg-color="#fff"></u-gap>
		<u-cell-item v-for='(item,index) in comeList' :title="item" :arrow="false" v-show='iptFoucs' @click='search(item)'>
			<template slot='right-icon'>
				<u-icon name="close" size='24rpx' :index='index' @click='remove'></u-icon>
			</template>
		</u-cell-item>
		<!-- 列表数据 -->
		<view v-show="!iptFoucs">
			<u-row gutter="20" class='row' v-if='searchFrom.total'>
				<u-col span="6" v-for='item in listData' @click='goContent(item.id,item.lang)'>
					<view class="list_box">
						<u-lazy-load width="100%" height="40vw" :image="item.breviary_img" :loading-img="loadingImg" :error-img="errorImg"></u-lazy-load>
						<view class="title">{{ item.title }}</view>
						<view class="footer">
							<text>{{ item.lang }}</text>
							<text>{{ item.time }}</text>
						</view>
					</view>
				</u-col>
				<u-col span="12">
					<u-button type="primary" @click='getSearchData()' v-if='searchFrom.total&&(searchFrom.total>listData.length)'>加载下一页</u-button>
					<u-divider half-width="200" v-else border-color="#6d6d6d">我是有底线的哦~</u-divider>
				</u-col>
			</u-row>
			<u-empty v-else-if="searchFrom.total==0" text="数据为空" mode="list"></u-empty>
			<u-back-top :scroll-top="scrollTop"></u-back-top>
		</view>
	</view>
</template>

<script>
	export default {
		name: "search",
		data() {
			return {
				comeList: [],
				iptFoucs: true,
				listData: [],
				scrollTop: 0,
				searchFrom:{
					title:"",
					page:0,
					pageSize:15,
					total:0
				}
			}
		},
		onLoad() {
			this.comeList = JSON.parse(uni.getStorageSync('comeList'));
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		methods: {
			search(value) {
				if (!this.comeList.includes(value)) {
					this.comeList.push(value);
				}
				this.searchFrom.page=0;
				this.listData=[];
				this.iptFoucs = false;
				this.getSearchData()
			},
			remove(index) {
				this.comeList.splice(index, 1)
			},
			getSearchData() {
				uni.showLoading({
					title: '正在加载'
				})
				this.searchFrom.page++;
				this.$u.get(`${this.$url}/unapi/articleSearch`,this.searchFrom).then(res=>{
					uni.hideLoading();
					this.listData = this.listData.concat(res.data);
					this.searchFrom.total = res.total;
				})
			},
			goContent(id, lang) {
				this.$u.route({
					url: '/pageA/content/content',
					params: {
						id,lang,type:true
					}
				})
			}
		},
		components: {

		},
		destroyed() {
			uni.setStorageSync('comeList', JSON.stringify(this.comeList));
		}
	}
</script>
<style lang="scss">
	.u-lazy-item {
		height: 40vw !important;
	}
</style>
<style lang="scss" scoped>
	.list_box {
		padding: 20rpx;
		background-color: rgb(240, 240, 240);
		border-radius: 8rpx;
		margin-bottom: 20rpx;

		.title {
			margin-top: 4rpx;
			font-size: 26rpx;
			height: 60rpx;
			line-height: 30rpx;
			color: #000;
			word-break: break-all;
			text-overflow: ellipsis;
			overflow: hidden;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
		}

		.footer {
			display: flex;
			justify-content: space-between;
			margin-top: 10rpx;

			>text {
				font-size: 22rpx;
				color: #666;
			}
		}
	}
</style>
