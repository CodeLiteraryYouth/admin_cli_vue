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
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="code"
        header-align="center"
        align="center"
        label="订单号">
      </el-table-column>
      <el-table-column
        prop="title"
        header-align="center"
        align="center"
        label="商品名称">
      </el-table-column>
      <el-table-column
        prop="skuType"
        header-align="center"
        align="center"
        label="商品类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.skuType === 1" size="small">素材</el-tag>
          <el-tag v-else-if="scope.row.skuType === 2" size="small" type="success">课程</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="num"
        header-align="center"
        align="center"
        label="商品数量">
      </el-table-column>
      <el-table-column
        prop="amount"
        header-align="center"
        align="center"
        label="订单总价格">
      </el-table-column>
      <el-table-column
        prop="paymentType"
        header-align="center"
        align="center"
        label="支付方式">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.paymentType === 1" size="small">现金</el-tag>
          <el-tag v-else-if="scope.row.permissionType === 2" size="small" type="success">微信</el-tag>
          <el-tag v-else-if="scope.row.permissionType === 3" size="small" type="info">支付宝</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="订单状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1" size="small">待付款</el-tag>
          <el-tag v-else-if="scope.row.status === 2" size="small" type="success">已付款</el-tag>
          <el-tag v-else-if="scope.row.status === 3" size="small" type="info">已超时</el-tag>
          <el-tag v-else-if="scope.row.status === 4" size="small" type="info">审核中</el-tag>
          <el-tag v-else-if="scope.row.status === 5" size="small" type="info">已退款</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        label="创建时间">
      </el-table-column>
      <el-table-column
        prop="tradeNo"
        header-align="center"
        align="center"
        label="交易流水号">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">退款通过</el-button>
        </template>
      </el-table-column>
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
        dataListSelections: [],
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
          url: this.$http.adornUrl('/order/list'),
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
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      }
    }
  }
</script>
