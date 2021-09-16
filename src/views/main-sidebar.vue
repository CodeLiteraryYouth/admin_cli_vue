<template>
	<aside class="site-sidebar" :class="'site-sidebar--' + sidebarLayoutSkin">
		<div class="site-sidebar__inner">
			<el-menu
				:default-active="menuActiveName || 'home'"
				:collapse="sidebarFold"
				:collapseTransition="false"
				class="site-sidebar__menu"
			>
				<el-menu-item
					index="home"
					@click="$router.push({ name: 'home' })"
				>
					<icon-svg
						name="shouye"
						class="site-sidebar__menu-icon"
					></icon-svg>
					<span slot="title">仪表盘</span>
				</el-menu-item>
				<el-submenu index="listOfWorks">
					<template slot="title">
						<icon-svg
							name="shoucang"
							class="site-sidebar__menu-icon"
						></icon-svg>
						<span>作品管理</span>
					</template>
					<el-menu-item
						index="listOfWorks"
						@click="$router.push({ name: 'listOfWorks' })"
					>
						<icon-svg
							name="tubiao"
							class="site-sidebar__menu-icon"
						></icon-svg>
						<span slot="title">作品列表</span>
					</el-menu-item>
					<el-menu-item
						index="workLabel"
						@click="$router.push({ name: 'workLabel' })"
					>
						<icon-svg
							name="tubiao"
							class="site-sidebar__menu-icon"
						></icon-svg>
						<span slot="title">作品标签</span>
					</el-menu-item>
				</el-submenu>
				<el-submenu index="demo">
					<template slot="title">
						<icon-svg
							name="shoucang"
							class="site-sidebar__menu-icon"
						></icon-svg>
						<span>系统管理</span>
					</template>
					<el-menu-item
						index="userList"
						@click="$router.push({ name: 'userList' })"
					>
						<icon-svg
							name="tubiao"
							class="site-sidebar__menu-icon"
						></icon-svg>
						<span slot="title">系统用户</span>
					</el-menu-item>
					<el-menu-item
						index="menuManage"
						@click="$router.push({ name: 'menuManage' })"
					>
						<icon-svg
							name="tubiao"
							class="site-sidebar__menu-icon"
						></icon-svg>
						<span slot="title">菜单管理</span>
					</el-menu-item>
					<el-menu-item
						index="roleManage"
						@click="$router.push({ name: 'roleManage' })"
					>
						<icon-svg
							name="tubiao"
							class="site-sidebar__menu-icon"
						></icon-svg>
						<span slot="title">角色管理</span>
					</el-menu-item>
					<el-menu-item
						index="clientUser"
						@click="$router.push({ name: 'clientUser' })"
					>
						<icon-svg
							name="tubiao"
							class="site-sidebar__menu-icon"
						></icon-svg>
						<span slot="title">客户端用户</span>
					</el-menu-item>
					<el-menu-item
						index="dictionaryParams"
						@click="$router.push({ name: 'dictionaryParams' })"
					>
						<icon-svg
							name="tubiao"
							class="site-sidebar__menu-icon"
						></icon-svg>
						<span slot="title">字典参数</span>
					</el-menu-item>
				</el-submenu>
				<el-submenu index="materialManage">
					<template slot="title">
						<icon-svg
							name="shoucang"
							class="site-sidebar__menu-icon"
						></icon-svg>
						<span>素材管理</span>
					</template>
					<el-menu-item
						index="materialList"
						@click="$router.push({ name: 'materialList' })"
					>
						<icon-svg
							name="tubiao"
							class="site-sidebar__menu-icon"
						></icon-svg>
						<span slot="title">素材列表</span>
					</el-menu-item>
					<el-menu-item
						index="materialLabel"
						@click="$router.push({ name: 'materialLabel' })"
					>
						<icon-svg
							name="tubiao"
							class="site-sidebar__menu-icon"
						></icon-svg>
						<span slot="title">素材标签</span>
					</el-menu-item>
				</el-submenu>
				<el-submenu index="courseManage">
					<template slot="title">
						<icon-svg
							name="shoucang"
							class="site-sidebar__menu-icon"
						></icon-svg>
						<span>课程管理</span>
					</template>
					<el-menu-item
						index="courseList"
						@click="$router.push({ name: 'courseList' })"
					>
						<icon-svg
							name="tubiao"
							class="site-sidebar__menu-icon"
						></icon-svg>
						<span slot="title">课程列表</span>
					</el-menu-item>
					<el-menu-item
						index="courseLabel"
						@click="$router.push({ name: 'courseLabel' })"
					>
						<icon-svg
							name="tubiao"
							class="site-sidebar__menu-icon"
						></icon-svg>
						<span slot="title">课程标签</span>
					</el-menu-item>
				</el-submenu>
				<el-submenu index="enterpriseCooperation">
					<template slot="title">
						<icon-svg
							name="shoucang"
							class="site-sidebar__menu-icon"
						></icon-svg>
						<span>企业合作</span>
					</template>
					<el-menu-item
						index="enterpriseCooperationList"
						@click="
							$router.push({ name: 'enterpriseCooperationList' })
						"
					>
						<icon-svg
							name="tubiao"
							class="site-sidebar__menu-icon"
						></icon-svg>
						<span slot="title">企业合作列表</span>
					</el-menu-item>
					<el-menu-item
						index="enterpriseCooperationLabel"
						@click="
							$router.push({ name: 'enterpriseCooperationLabel' })
						"
					>
						<icon-svg
							name="tubiao"
							class="site-sidebar__menu-icon"
						></icon-svg>
						<span slot="title">企业合作标签</span>
					</el-menu-item>
				</el-submenu>
				<el-submenu index="weeklyPractice">
					<template slot="title">
						<icon-svg
							name="shoucang"
							class="site-sidebar__menu-icon"
						></icon-svg>
						<span>周练</span>
					</template>
					<el-menu-item
						index="weeklyPracticeList"
						@click="$router.push({ name: 'weeklyPracticeList' })"
					>
						<icon-svg
							name="tubiao"
							class="site-sidebar__menu-icon"
						></icon-svg>
						<span slot="title">周练列表</span>
					</el-menu-item>
					<el-menu-item
						index="jobList"
						@click="$router.push({ name: 'jobList' })"
					>
						<icon-svg
							name="tubiao"
							class="site-sidebar__menu-icon"
						></icon-svg>
						<span slot="title">作业列表</span>
					</el-menu-item>
				</el-submenu>
				<el-submenu index="toolManage">
					<template slot="title">
						<icon-svg
							name="shoucang"
							class="site-sidebar__menu-icon"
						></icon-svg>
						<span>工具管理</span>
					</template>
					<el-menu-item
						index="toolList"
						@click="$router.push({ name: 'toolList' })"
					>
						<icon-svg
							name="tubiao"
							class="site-sidebar__menu-icon"
						></icon-svg>
						<span slot="title">工具列表</span>
					</el-menu-item>
					<el-menu-item
						index="newsStory"
						@click="$router.push({ name: 'newsStory' })"
					>
						<icon-svg
							name="tubiao"
							class="site-sidebar__menu-icon"
						></icon-svg>
						<span slot="title">新闻事迹</span>
					</el-menu-item>
				</el-submenu>
				<sub-menu
					v-for="menu in menuList"
					:key="menu.menuId"
					:menu="menu"
					:dynamicMenuRoutes="dynamicMenuRoutes"
				>
				</sub-menu>
			</el-menu>
		</div>
	</aside>
</template>

<script>
import SubMenu from "./main-sidebar-sub-menu";
import { isURL } from "@/utils/validate";
export default {
	data() {
		return {
			dynamicMenuRoutes: [],
		};
	},
	components: {
		SubMenu,
	},
	computed: {
		sidebarLayoutSkin: {
			get() {
				return this.$store.state.common.sidebarLayoutSkin;
			},
		},
		sidebarFold: {
			get() {
				return this.$store.state.common.sidebarFold;
			},
		},
		menuList: {
			get() {
				return this.$store.state.common.menuList;
			},
			set(val) {
				this.$store.commit("common/updateMenuList", val);
			},
		},
		menuActiveName: {
			get() {
				return this.$store.state.common.menuActiveName;
			},
			set(val) {
				this.$store.commit("common/updateMenuActiveName", val);
			},
		},
		mainTabs: {
			get() {
				return this.$store.state.common.mainTabs;
			},
			set(val) {
				this.$store.commit("common/updateMainTabs", val);
			},
		},
		mainTabsActiveName: {
			get() {
				return this.$store.state.common.mainTabsActiveName;
			},
			set(val) {
				this.$store.commit("common/updateMainTabsActiveName", val);
			},
		},
	},
	watch: {
		$route: "routeHandle",
	},
	created() {
		this.menuList = JSON.parse(sessionStorage.getItem("menuList") || "[]");
		this.dynamicMenuRoutes = JSON.parse(
			sessionStorage.getItem("dynamicMenuRoutes") || "[]"
		);
		this.routeHandle(this.$route);
	},
	methods: {
		// 路由操作
		routeHandle(route) {
			if (route.meta.isTab) {
				// tab选中, 不存在先添加
				var tab = this.mainTabs.filter(
					(item) => item.name === route.name
				)[0];
				if (!tab) {
					if (route.meta.isDynamic) {
						route = this.dynamicMenuRoutes.filter(
							(item) => item.name === route.name
						)[0];
						if (!route) {
							return console.error("未能找到可用标签页!");
						}
					}
					tab = {
						menuId: route.meta.menuId || route.name,
						name: route.name,
						title: route.meta.title,
						type: isURL(route.meta.iframeUrl) ? "iframe" : "module",
						iframeUrl: route.meta.iframeUrl || "",
						params: route.params,
						query: route.query,
					};
					this.mainTabs = this.mainTabs.concat(tab);
				}
				this.menuActiveName = tab.menuId + "";
				this.mainTabsActiveName = tab.name;
			}
		},
	},
};
</script>
