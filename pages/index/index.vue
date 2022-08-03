<template>
	<view>
		<!-- 轮播图 -->
		<view>
			<u-swiper :list="banner" :title='true' :effect3d="true"></u-swiper>
		</view>
		<!-- 文章列表 -->
		<view class='annunciate'>
			<u-row gutter="16">
				<u-col span="3">
					<view class="demo-layout" @click="goarticle('jzjy')">
						<image src="../../static/img/jzjy.png"></image><br>
						<text>建站经验</text>
					</view>
				</u-col>
				<u-col span="3">
					<view class="demo-layout" @click="goarticle('tgch')">
						<image src="../../static/img/tgch.png"></image><br>
						<text>推广策划</text>
					</view>
				</u-col>
				<u-col span="3">
					<view class="demo-layout" @click="goarticle('ssyq')">
						<image src="../../static/img/ssyq.png"></image><br>
						<text>搜索引擎</text>
					</view>
				</u-col>
				<u-col span="3">
					<view class="demo-layout" @click="goarticle('seoyh')">
						<image src="../../static/img/seoyh.png"></image><br>
						<text>SEO优化</text>
					</view>
				</u-col>
			</u-row>
		</view>
		<!-- 最新源码 -->
		<view class="sound_wrap annunciate" v-for="item in data" :key="item.name">
			<text style='background-color: rgb(250,152,151);'>最新{{item.name}}</text>
			<u-line color="red" />
			<u-row gutter="20" class='row'>
				<u-col span="6" v-for='(it,index) in item.data' :key="it.id" @click='gopath(it.id,item.tableName)'>
					<view class="annunciate list_box" v-if='6>index'>
						<u-image width="100%" height="40vw" :src="it.breviary_img"></u-image>
						<view class="title">{{ it.title }}</view>
						<view class="footer">
							<text>{{ it.lang }}</text>
							<text>{{ it.time }}</text>
						</view>
					</view>
				</u-col>
			</u-row>
		</view>

		<u-divider half-width="200" border-color="#6d6d6d">我是有底线的哦~</u-divider>
		<u-back-top :scroll-top="scrollTop"></u-back-top>
		<foot v-bind:type="0"></foot>
		<aModel v-if="show" @closeModel="modelCancel" :type="type" @getuserinfo="getuserinfo()"
			@confirmModel="getphonenumber()" :content="locationContent" :bgColor="bgColor"></aModel>
	</view>
</template>

<script>
	import foot from '../../components/footer/footer.vue';
	import util from '@/static/js/util.js';
	import aModel from '@/components/xghc-accredit/index.vue';
	export default {
		name: 'index',
		data() {
			return {
				scrollTop: 0,
				data: [],
				banner: [{
						image: 'https://cdn.uviewui.com/uview/swiper/1.jpg',
						title: '昨夜星辰昨夜风，画楼西畔桂堂东'
					},
					{
						image: 'https://cdn.uviewui.com/uview/swiper/2.jpg',
						title: '身无彩凤双飞翼，心有灵犀一点通'
					},
					{
						image: 'https://cdn.uviewui.com/uview/swiper/3.jpg',
						title: '谁念西风独自凉，萧萧黄叶闭疏窗，沉思往事立残阳'
					}
				],
				// 用户信息
				userInfo: {},
				// 授权参数
				show:false,
				type:true,
				locationContent: "授权手机号用于获取完整服务",
				bgColor: "#2b85e4",
				
			}
		},
		onLoad() {
			this.getIndexData();
			this.login()
		},
		methods: {
			login() {
				let that = this;
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						that.$u.post(that.$url + '/unwx/wxlogin',{code:loginRes.code})
							.then(res => {
								uni.setStorageSync('token', res.data.token);
								that.userInfo = {
									...res.data.wxuser,
									sessionKey: res.data.sessionKey
								};
								util.userInfo = that.userInfo;
								
								// 判断用户有没有授权手机号,弹出授权窗口
								if (!that.userInfo.phone) that.show = true;
								// 判断用户没有授权用户信息，如果授权了手机号但是没有授权用户信息，则只弹出授权用户信息
								else if (!that.userInfo.username || !that.userInfo.avatar) {
									that.show = true;
									that.locationContent = "授权个人信息用于获取完整服务";
									that.bgColor = "#f29100";
									that.type = false;
								}else that.show = false;
						});
					}
				});
			},
			// 获取微信用户信息
			getuserinfo() {
				let that = this;
				uni.getUserProfile({
					desc: '请授权个人信息',
					lang: 'zh_CN',
					success: function(infoRes) {
						if (infoRes.errMsg == "getUserProfile:ok") {
							that.updateUser(infoRes.userInfo)
						} else {
							that.$refs.uTips.show({
								title: '获取用户信息失败！',
								type: 'error',
								duration: '2300'
							})
							that.show = false;
						}
					},
					fail: function(err) {
						that.$refs.uTips.show({
							title: '获取用户信息失败！',
							type: 'error',
							duration: '2300'
						})
						that.show = false;
					}
				});
			},
			// 更新用户信息的接口
			updateUser(infoRes) {
				let data = {
					username: infoRes.nickName,
					avatar: infoRes.avatarUrl,
					city: infoRes.city || '武汉',
					sex: infoRes.sex || 0
				}
				this.$u.post(this.$url + '/wxapi/updateWxuserInfo', data).then(res => {
					if (res.code == 200) this.login();
					else {
						this.$refs.uTips.show({
							title: '获取用户信息失败！',
							type: 'error',
							duration: '2300'
						})
						this.show = false;
					}
				})
			},
			// 获取微信用户手机号
			getphonenumber(e) {
				let that = this;
				if (e.detail.errMsg == "getPhoneNumber:ok") {
					let data = {
						encryptedData: e.detail.encryptedData,
						iv: e.detail.iv,
						openid: that.userInfo.openId,
						key: that.userInfo.sessionKey,
					};
					// 调用解密手机号的接口
					that.register( data );
				} else {
					this.$refs.uTips.show({
						title: '获取手机号失败！',
						type: 'error',
						duration: '2300'
					})
					this.show = false;
				}
			},
			// 保存用户手机号到后台
			register(data) {
				this.$u.post(this.$url + '/wxapi/updateWxuserPhone', data)
					.then(res => {
						// 没有授权手机号，则一定没有调用授权用户信息
						// 保存手机号之后，弹出获取用户信息
						if (res.code == 200) {
							this.show = true;
							this.locationContent = "授权个人信息用于获取完整服务";
							this.bgColor = "#f29100";
							this.type = false;
						} else {
							this.$refs.uTips.show({
								title: '获取手机号失败！',
								type: 'error',
								duration: '2300'
							})
							this.show = false;
						}
					});
			},
			// 取消授权的按钮
			modelCancel() {
				this.$refs.uTips.show({
					title: '用户取消授权',
					type: 'warning',
					duration: '2300'
				})
				this.show = false;
			},
			// 获取最新数据
			getIndexData() {
				this.$u.get(`${this.$url}/unapi/articleNews`).then(res => {
					this.data = res.data
				})
			},
			// 去内容详情页
			gopath(id, lang) {
				this.$u.route({
					url: '/pageA/content/content',
					params: {
						id: id,
						lang: lang
					}
				})
			},
			// 去文章列表
			goarticle(type) {
				this.$u.route({
					url: '/pageA/article/article',
					params: {
						type
					}
				})
			}
		},
		components: {
			foot , aModel
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		}
	}
</script>
<style lang="scss">
	.u-lazy-item {
		height: 40vw !important;
	}
</style>
<style lang="scss" scoped>
	.annunciate {
		margin-top: 20rpx;
	}

	.demo-layout {
		padding: 10rpx 0;
		text-align: center;

		>image {
			width: 90rpx;
			height: 90rpx;
			border-radius: 10%;
		}

		>text {
			font-family: 'KAITI';
		}
	}

	.sound_wrap {
		padding: 20rpx;

		>text {
			display: inline-block;
			padding: 0 20rpx;
			color: #fff;
		}

		.row {
			width: 100%;
		}
	}

	.list_box {
		padding: 20rpx;
		background-color: rgb(240, 240, 240);
		border-radius: 8rpx;

		.title {
			margin-top: 4rpx;
			font-size: 26rpx;
			margin-top: 10rpx;
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
