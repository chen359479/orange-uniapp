<template>
	<view class="index">
		<view class="user-info">
			<u-image width="150rpx" height="150rpx" style="display: inline-block;margin-top: 20%;" shape="circle"
				:src="userInfo.avatar"></u-image>
			<view class="name" v-if="userInfo.username">{{userInfo.username}}</view>
			<u-button type="primary" v-else @click="login()">授权个人信息</u-button>
		</view>
		<view class="content">
			<u-cell-group>
				<u-cell-item icon="shopping-cart" title="我的订单" ></u-cell-item>
				<u-cell-item icon="account" title="性别" :arrow="false"></u-cell-item>
				<u-cell-item icon="map" title="城市" :arrow="false"></u-cell-item>
			</u-cell-group>
		</view>
		
		<aModel v-if="show" @closeModel="modelCancel" :type="type" @getuserinfo="getuserinfo()" @confirmModel="getphonenumber()" :content="locationContent"
			:bgColor="bgColor"></aModel>
		<u-top-tips ref="uTips"></u-top-tips>
		<foot v-bind:type="2"></foot>
	</view>
</template>

<script>
	import foot from '../../components/footer/footer.vue';
	import util from '@/static/js/util.js';
	import aModel from '@/components/xghc-accredit/index.vue'
	export default {
		data() {
			return {
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
			this.userInfo = util.userInfo;
		},
	
		mounted(){
			
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
		},
		components: {
			foot
		}
	}
</script>
<style lang="scss" scoped>
	.index {
		.user-info {
			height: 35vh;
			background-color: #2979ff;
			text-align: center;

			.name {
				color: #fff;
				font-size: 34rpx;
			}
		}

		.content {
			padding: 10rpx;
		}
	}
</style>