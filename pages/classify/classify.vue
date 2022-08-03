<template>
	<view class="classify">
		<u-search v-model="searchContent" :show-action="false" disabled='true' @click='goPath'></u-search>
		<!-- 下拉选择器 -->
		<view>
			<u-dropdown ref="uDropdown">
				<u-dropdown-item v-model="value1" :title="title1">
					<view class="slot-content" style="background-color: #FFFFFF;">
						<scroll-view scroll-y="true" style="height: 500rpx;">
							<view v-for='item in options1'  class="u-text-center u-content-color u-m-t-40 u-m-b-40" @click='optionsChange1(item)'
							 :style="item.title===title1?'color: #007AFF;':''">
								{{ item.title }}
							</view>
						</scroll-view>
					</view>
				</u-dropdown-item>
				<u-dropdown-item v-model="value2" :title="title2">
					<view class="slot-content" style="background-color: #FFFFFF;">
						<scroll-view scroll-y="true" style="height: 500rpx;">
							<view v-for='item in options2'  class="u-text-center u-content-color u-m-t-40 u-m-b-40" @click='optionsChange2(item)'
							 :style="item.title===title2?'color: #007AFF;':''">
								{{ item.title }}
							</view>
						</scroll-view>
					</view>
				</u-dropdown-item>
			</u-dropdown>
		</view>

		<!-- 列表数据 -->
		<u-row gutter="20" class='row' v-if="title1!='一级分类'&&amount">
			<u-col span="6" v-for='item in listData' @click='goContent(item.id)'>
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
				<u-button type="primary" @click='getClassData()' v-if='amount&&(amount>listData.length)'>加载下一页</u-button>
				<u-divider half-width="200" v-else border-color="#6d6d6d">我是有底线的哦~</u-divider>
			</u-col>
		</u-row>
		<u-empty v-else-if="title1!='一级分类'&&amount==0" text="数据为空" mode="list"></u-empty>
		<u-back-top :scroll-top="scrollTop"></u-back-top>
		<foot v-bind:type='1'></foot>
	</view>
</template>

<script>
	import foot from '../../components/footer/footer.vue'
	export default {
		name: "classify",
		data() {
			return {
				searchContent: "",
				value1: 0,
				value2: 0,
				options1: [],
				options2: [],
				title1: '一级分类',
				title2: '二级分类',
				page: 1,
				amount: null,
				listData: [],
				scrollTop: 0,
				searchFrom:{
					page:0,
					pageSize:15,
					tableName:"",
					title:""
				}
			}
		},
		onLoad() {
			this.getList()
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		methods: {
			goContent(id) {
			
				this.$u.route({
					url: '/pageA/content/content',
					params: {
						id:id,lang:this.searchFrom.tableName
					}
				})
			},
			goPath() {
				this.$u.route('../../pageA/search/search');
			},
			// 一级分类
			getList() {
				this.$u.get(`${this.$url}/unapi/articleTopClass`).then(res=>{
					this.options1 = res.data;
				})
			},
			// 二级分类
			getSecondLevel(id) {
				this.$u.get(`${this.$url}/unapi/articleSecondaryClass`,{id}).then(res=>{
					let arr = [{
						title: '全部'
					}]
					this.options2 = arr.concat(res.data);
				})
			},
			// 一级分类点击事件
			optionsChange1(value) {
				this.getSecondLevel(value.id);
				this.title1 = value.title;
				this.searchFrom.tableName = value.name;
				this.searchFrom.page=0;
				this.title2 = '全部';
				this.listData = [];
				this.getClassData()
				this.$refs.uDropdown.close();
				

			},
			// 二级分类点击事件
			optionsChange2(value) {
				this.title2 = value.title;
				this.searchFrom.title = value.title=='全部'?"":value.title;
				this.listData = [];
				this.searchFrom.page=0;
				this.$refs.uDropdown.close();
				this.getClassData();
				
			},
			getClassData() {
				uni.showLoading({
					title: '正在加载'
				})
				this.searchFrom.page++;
				this.$u.get(`${this.$url}/unapi/articleList`,this.searchFrom).then(res=>{
					uni.hideLoading();
					this.listData = this.listData.concat(res.data);
					this.amount = res.total
				})
			}
		},
		components: {
			foot
		}
	}
</script>
<style lang="scss">
	.u-lazy-item {
		height: 40vw !important;
	}
</style>
<style lang="scss" scoped>
	.classify {
		height: 100vh;
	}
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
