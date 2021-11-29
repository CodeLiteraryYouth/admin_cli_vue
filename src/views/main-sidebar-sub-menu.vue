<template>
    <el-submenu v-if="menu.children && menu.children.length >= 1" :index="substrPath(menu.permissionUrl)" :popper-class="'site-sidebar--' + sidebarLayoutSkin + '-popper'">
        <template slot="title">
            <icon-svg :name="menu.icon || ''" class="site-sidebar__menu-icon"></icon-svg>
            <span>{{ menu.permissionName }}</span>
        </template>
        <sub-menu v-for="item in menu.children" :key="item.id" :menu="item" :dynamicMenuRoutes="dynamicMenuRoutes">
        </sub-menu>
    </el-submenu>
    <el-menu-item v-else :index="substrPath(menu.permissionUrl)" @click="gotoRouteHandle(menu)">
        <icon-svg :name="menu.icon || ''" class="site-sidebar__menu-icon"></icon-svg>
        <span>{{ menu.permissionName }}</span>
    </el-menu-item>
</template>

<script>
    import SubMenu from "./main-sidebar-sub-menu";
    export default {
        name: "sub-menu",
        props: {
            menu: {
                type: Object,
                required: true,
            },
            dynamicMenuRoutes: {
                type: Array,
                required: true,
            },
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
			substrPath(p) {
				return p => {
					return p.substring(1);
				}
			}
        },
        methods: {
            // 通过menuId与动态(菜单)路由进行匹配跳转至指定路由
            gotoRouteHandle(menu) {
				    this.$router.push({ path: menu.permissionUrl });
                var route = this.dynamicMenuRoutes.filter(item => item.meta.id === menu.id);
                if (route.length >= 1) {
                    this.$router.push({ path: route[0].permissionUrl });
                }
            }
        },
    };
</script>
