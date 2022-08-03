<template>
	<view>
		<u-tabbar v-model="type" :list="list" active-color='#2b85e4'></u-tabbar>
	</view>
</template>

<script>
	export default {
		name: "footer",
		props: ['type'],
		data() {
			return {
				list: [{
						iconPath: "home",
						selectedIconPath: "home-fill",
						text: '首页',
						count: 0,
						isDot: true,
						customIcon: false,
						pagePath: '/pages/index/index'
					},
					{
						iconPath: "grid",
						selectedIconPath: "grid-fill",
						text: '分类',
						count: 0,
						isDot: false,
						customIcon: false,
						pagePath: '/pages/classify/classify'
					},
					{
						iconPath: "account",
						selectedIconPath: "account-fill",
						text: '我的',
						count: 0,
						isDot: false,
						customIcon: false,
						pagePath: '/pages/my/my'
					},
				]
			}
		}
	}
</script>
