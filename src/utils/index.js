import Vue from 'vue'
import router from '@/router'
import store from '@/store'

/**
 * 获取uuid
 */
export function getUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
    })
}

/**
 * 是否有权限
 * @param {*} key
 */
export function isAuth(key) {
    return JSON.parse(sessionStorage.getItem('permissions') || '[]').indexOf(key) !== -1 || false
}

/**
 * 树形数据转换
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
export function treeDataTranslate(data, id = 'id', pid = 'parentId') {
    var res = []
    var temp = {}
    for (var i = 0; i < data.length; i++) {
        temp[data[i][id]] = data[i]
    }
    for (var k = 0; k < data.length; k++) {
        if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
            if (!temp[data[k][pid]]['children']) {
                temp[data[k][pid]]['children'] = []
            }
            if (!temp[data[k][pid]]['_level']) {
                temp[data[k][pid]]['_level'] = 1
            }
            data[k]['_level'] = temp[data[k][pid]]._level + 1
            temp[data[k][pid]]['children'].push(data[k])
        } else {
            res.push(data[k])
        }
    }
    return res
}

/**
 * 清除登录信息
 */
export function clearLoginInfo() {
    Vue.cookie.delete('Authorization')
    store.commit('resetStore')
    router.options.isAddDynamicMenuRoutes = false
}

/**
 * 获取已选中的树的id
 * @param {*} menuTreeList 
 * @returns 
 */
export function getCheckedIds(menuTreeList=[]) {
    var result = []
    for (var i= 0;i<menuTreeList.length;i++) {
      result =result.concat(menuTreeList[i].id)
      if (menuTreeList[i].children && menuTreeList[i].children.length >= 1) {
         for (var j= 0 ;j<menuTreeList[i].children.length;j++) {
            result =result.concat(menuTreeList[i].children[j].id)
         }
      }
    }
    return result;
}

/**
 * @description 获取两个时间之间的日期
 * @author CaoZM20132014
 * @date 2019-08-14
 * @export
 * @param { stime } 起始时间
 * @param { etime } 结束时间
 * @returns { array }
 */
 export function getAllDateFromTwoDateBetween(stime, etime) {
    // 初始化日期列表，数组
    var diffdate = new Array();
    var i = 0;
    // 开始日期小于等于结束日期，并循环
    while (stime <= etime) {
        diffdate[i] = stime;
        // 获取开始日期时间戳
        var stime_ts = new Date(stime).getTime();
        // 增加一天时间戳后的日期
        var next_date = stime_ts + (24 * 60 * 60 * 1000);
        // 拼接年月日，这里的月份会返回（0-11），所以要+1
        var next_dates_y = new Date(next_date).getFullYear() + '-';
        var next_dates_m = (new Date(next_date).getMonth() + 1 < 10) ? '0' + (new Date(next_date).getMonth() + 1) + '-' : (new Date(next_date).getMonth() + 1) + '-';
        var next_dates_d = (new Date(next_date).getDate() < 10) ? '0' + new Date(next_date).getDate() : new Date(next_date).getDate();
        stime = next_dates_y + next_dates_m + next_dates_d;
        // 增加数组key
        i++;
	}
	return diffdate;
}
