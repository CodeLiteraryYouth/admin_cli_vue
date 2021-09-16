<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.searchVal" placeholder="参数名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="email"
        header-align="center"
        align="center"
        label="邮箱地址">
      </el-table-column>
      <el-table-column
        prop="password"
        header-align="center"
        align="center"
        label="注册密码">
      </el-table-column>
      <el-table-column
        prop="nickName"
        header-align="center"
        align="center"
        label="用户姓名">
      </el-table-column>
      <el-table-column
        prop="avatarUrl"
        header-align="center"
        align="center"
        label="用户头像">
      </el-table-column>
      <el-table-column
        prop="country"
        header-align="center"
        align="center"
        label="国家">
      </el-table-column>
      <el-table-column
        prop="province"
        header-align="center"
        align="center"
        label="省份">
      </el-table-column>
      <el-table-column
        prop="city"
        header-align="center"
        align="center"
        label="城市">
      </el-table-column>
      <el-table-column
        prop="gender"
        header-align="center"
        align="center"
        label="性别">
      </el-table-column>
      <el-table-column
        prop="isMembers"
        header-align="center"
        align="center"
        label="会员">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isMembers === false" size="small">否</el-tag>
          <el-tag v-else-if="scope.row.isMembers === true" size="small" type="success">是</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="membersType"
        header-align="center"
        align="center"
        label="会员类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.membersType === 'VIDEO'" size="small">视频会员</el-tag>
          <el-tag v-else-if="scope.row.membersType === 'MATERIAL'" size="small" type="success">素材会员</el-tag>
          <el-tag v-else-if="scope.row.membersType === 'ALL'" size="small" type="success">全会员</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="event"
        header-align="center"
        align="center"
        label="订阅状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.event === 'subscribe'" size="small">未订阅</el-tag>
          <el-tag v-else-if="scope.row.event === 'unsubscribe'" size="small">取消订阅</el-tag>
          <el-tag v-else-if="scope.row.event === 'SCAN'" size="small" type="success">已关注</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="loginStatus"
        header-align="center"
        align="center"
        label="登录状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.loginStatus === false" size="small">未登录</el-tag>
          <el-tag v-else-if="scope.row.loginStatus === true" size="small">已登录</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="创建时间">
      </el-table-column>
      <!-- <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageNum"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        dataForm: {
          searchVal: ''
        },
        dataList: [],
        pageNum: 1,
        pageSize: 10,
        total: 0,
        dataListLoading: false,
        addOrUpdateVisible: false
      }
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/userinfo/list'),
          method: 'get',
          params: this.$http.adornParams({
            'pageNum': this.pageNum,
            'pageSize': this.pageSize,
            'searchVal': this.dataForm.searchVal
          })
        }).then(({data}) => {
          if (data && data.code === 200) {
            this.dataList = data.data.list
            this.total = data.data.total
          } else {
            this.dataList = []
            this.total = 0
          }
          this.dataListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageNum = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageNum = val
        this.getDataList()
      }
    }
  }
</script>
