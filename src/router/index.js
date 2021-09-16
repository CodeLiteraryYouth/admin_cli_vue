/* eslint-disable no-unreachable */
/* eslint-disable no-tabs */
/**
 * 全站路由配置
 *
 * 建议:
 * 1. 代码中路由统一使用name属性跳转(不使用path属性)
 */
import Vue from 'vue'
import Router from 'vue-router'
import http from '@/utils/httpRequest'
import { isURL } from '@/utils/validate'
// import { clearLoginInfo } from '@/utils'

Vue.use(Router)

// 开发环境不使用懒加载, 因为懒加载页面太多的话会造成webpack热更新太慢, 所以只有生产环境使用懒加载
const _import = require('./import-' + process.env.NODE_ENV)

// 全局路由(无需嵌套上左右整体布局)
const globalRoutes = [
	// eslint-disable-next-line no-tabs
	{ path: '/404', component: _import('common/404'), name: '404', meta: { title: '404未找到' } },
	{ path: '/login', component: _import('common/login'), name: 'login', meta: { title: '登录' } }
]

// 主入口路由(需嵌套上左右整体布局)
const mainRoutes = {
  path: '/',
  component: _import('main'),
  name: 'main',
  redirect: { name: 'home' },
  meta: { title: '主入口整体布局' },
  children: [
		// 通过meta对象设置路由展示方式
		// 1. isTab: 是否通过tab展示内容, true: 是, false: 否
		// 2. iframeUrl: 是否通过iframe嵌套展示内容, '以http[s]://开头': 是, '': 否
		// 提示: 如需要通过iframe嵌套展示内容, 但不通过tab打开, 请自行创建组件使用iframe处理!
		{ path: '/home', component: _import('common/home'), name: 'home', meta: { title: '仪表盘' } },
		{ path: '/listOfWorks', component: _import('modules/workManagement/list-of-works'), name: 'listOfWorks', meta: { title: '作品列表', isTab: true } },
		{ path: '/workLabel', component: _import('modules/workManagement/work-label'), name: 'workLabel', meta: { title: '作品标签', isTab: true } },
		{ path: '/userList', component: _import('modules/systemManage/user-list'), name: 'userList', meta: { title: '系统用户', isTab: true } },
		{ path: '/menuManage', component: _import('modules/systemManage/menu-manage'), name: 'menuManage', meta: { title: '菜单管理', isTab: true } },
		{ path: '/roleManage', component: _import('modules/systemManage/role-manage'), name: 'roleManage', meta: { title: '角色管理', isTab: true } },
		{ path: '/clientUser', component: _import('modules/systemManage/client-user'), name: 'clientUser', meta: { title: '客户端用户', isTab: true } },
		{ path: '/dictionaryParams', component: _import('modules/systemManage/dictionary-params'), name: 'dictionaryParams', meta: { title: '字典参数', isTab: true } },
		{ path: '/materialList', component: _import('modules/materialManage/material-list'), name: 'materialList', meta: { title: '素材列表', isTab: true } },
		{ path: '/materialLabel', component: _import('modules/materialManage/material-label'), name: 'materialLabel', meta: { title: '素材标签', isTab: true } },
		{ path: '/courseList', component: _import('modules/courseManage/course-list'), name: 'courseList', meta: { title: '课程列表', isTab: true } },
		{ path: '/courseLabel', component: _import('modules/courseManage/course-label'), name: 'courseLabel', meta: { title: '课程标签', isTab: true } },
		{ path: '/enterpriseCooperationList', component: _import('modules/enterpriseCooperation/enterprise-cooperation-list'), name: 'enterpriseCooperationList', meta: { title: '企业合作列表', isTab: true } },
		{ path: '/enterpriseCooperationLabel', component: _import('modules/enterpriseCooperation/enterprise-cooperation-label'), name: 'enterpriseCooperationLabel', meta: { title: '企业合作标签', isTab: true } },
		{ path: '/weeklyPracticeList', component: _import('modules/weeklyPractice/weekly-practice-list'), name: 'weeklyPracticeList', meta: { title: '周练列表', isTab: true } },
		{ path: '/jobList', component: _import('modules/weeklyPractice/job-list'), name: 'jobList', meta: { title: '作业列表', isTab: true } },
		{ path: '/toolList', component: _import('modules/toolManage/tool-list'), name: 'toolList', meta: { title: '工具列表', isTab: true } },
		{ path: '/newsStory', component: _import('modules/toolManage/news-story'), name: 'newsStory', meta: { title: '新闻事迹', isTab: true } }
  ]
//   beforeEnter (to, from, next) {
//     let token = Vue.cookie.get('Authorization')
//     if (!token || !/\S/.test(token)) {
//       clearLoginInfo()
//       next({ name: 'login' })
//     }
//     next()
//   }
}

const router = new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  isAddDynamicMenuRoutes: true, // 是否已经添加动态(菜单)路由
  routes: globalRoutes.concat(mainRoutes)
})

router.beforeEach((to, from, next) => {
  next()
  return
	// 添加动态(菜单)路由
	// 1. 已经添加 or 全局路由, 直接访问
	// 2. 获取菜单列表, 添加并保存本地存储
  if (router.options.isAddDynamicMenuRoutes || fnCurrentRouteType(to, globalRoutes) === 'global') {
    next()
  } else {
    http({
      url: http.adornUrl('/sys/menu/nav'),
      method: 'get',
      params: http.adornParams()
    }).then(({ data }) => {
      if (data && data.code === 200) {
        fnAddDynamicMenuRoutes(data.data.menuList)
        router.options.isAddDynamicMenuRoutes = true
        sessionStorage.setItem('menuList', JSON.stringify(data.data.menuList || '[]'))
        sessionStorage.setItem('permissions', JSON.stringify(data.data.permissions || '[]'))
        next({ ...to, replace: true })
      } else {
        sessionStorage.setItem('menuList', '[]')
        sessionStorage.setItem('permissions', '[]')
        next()
      }
    }).catch((e) => {
      console.log(`%c${e} 请求菜单列表和权限失败，跳转至登录页！！`, 'color:blue')
      router.push({ name: 'login' })
    })
  }
})

/**
 * 判断当前路由类型, global: 全局路由, main: 主入口路由
 * @param {*} route 当前路由
 */
function fnCurrentRouteType (route, globalRoutes = []) {
  var temp = []
  for (var i = 0; i < globalRoutes.length; i++) {
    if (route.path === globalRoutes[i].path) {
      return 'global'
    } else if (globalRoutes[i].children && globalRoutes[i].children.length >= 1) {
      temp = temp.concat(globalRoutes[i].children)
    }
  }
  return temp.length >= 1 ? fnCurrentRouteType(route, temp) : 'main'
}

/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function fnAddDynamicMenuRoutes (menuList = [], routes = []) {
  var temp = []
  for (var i = 0; i < menuList.length; i++) {
    if (menuList[i].list && menuList[i].list.length >= 1) {
      temp = temp.concat(menuList[i].list)
    } else if (menuList[i].permissionUrl && /\S/.test(menuList[i].permissionUrl)) {
      menuList[i].permissionUrl = menuList[i].permissionUrl.replace(/^\//, '')
      var route = {
        path: menuList[i].permissionUrl.replace('/', '-'),
        component: null,
        name: menuList[i].permissionUrl.replace('/', '-'),
        meta: {
          menuId: menuList[i].id,
          title: menuList[i].permissionName,
          isDynamic: true,
          isTab: true,
          iframeUrl: ''
        }
      }
			// url以http[s]://开头, 通过iframe展示
      if (isURL(menuList[i].permissionUrl)) {
        route['path'] = `i-${menuList[i].id}`
        route['name'] = `i-${menuList[i].id}`
        route['meta']['iframeUrl'] = menuList[i].permissionUrl
      } else {
        try {
          route['component'] = _import(`modules/${menuList[i].permissionUrl}`) || null
        } catch (e) {
          console.log(e)
        }
      }
      routes.push(route)
    }
  }
  if (temp.length >= 1) {
    fnAddDynamicMenuRoutes(temp, routes)
  } else {
    mainRoutes.name = 'main-dynamic'
    mainRoutes.children = routes
    router.addRoutes([
      mainRoutes,
			{ path: '*', redirect: { name: '404' } }
    ])
    sessionStorage.setItem('dynamicMenuRoutes', JSON.stringify(mainRoutes.children || '[]'))
    console.log('\n')
    console.log('%c!<-------------------- 动态(菜单)路由 s -------------------->', 'color:blue')
    console.log(mainRoutes.children)
    console.log('%c!<-------------------- 动态(菜单)路由 e -------------------->', 'color:blue')
  }
}

export default router
