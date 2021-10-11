<template>
    <div class="mod-config">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
            <el-form-item>
                <el-input v-model="dataForm.searchVal" placeholder="参数名" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="getDataList()">查询</el-button>
                <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
                <el-button type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
            <el-table-column type="selection" header-align="center" align="center" width="50">
            </el-table-column>
            <el-table-column prop="id" header-align="center" align="center" label="ID">
            </el-table-column>
            <el-table-column prop="name" header-align="center" align="center" label="软件名">
            </el-table-column>
            <el-table-column prop="downloadDesc" header-align="center" align="center" label="软件描述">
            </el-table-column>
            <el-table-column prop="version" header-align="center" align="center" label="软件版本">
            </el-table-column>
            <el-table-column prop="publishTime" header-align="center" align="center" label="软件发布时间">
            </el-table-column>
            <el-table-column prop="size" header-align="center" align="center" label="软件大小">
            </el-table-column>
            <el-table-column prop="content" header-align="center" align="center" label="软件下载信息">
            </el-table-column>
            <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
                    <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageNum" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="total" layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
    </div>
</template>

<script>
    export default {
        data() {
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
        activated() {
            this.getDataList()
        },
        methods: {
            // 获取数据列表
            getDataList() {
                this.dataListLoading = true
                this.$http({
                    url: this.$http.adornUrl('/download/list'),
                    method: 'get',
                    params: this.$http.adornParams({
                        'pageNum': this.pageNum,
                        'pageSize': this.pageSize,
                        'searchVal': this.dataForm.searchVal
                    })
                }).then(({ data }) => {
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
            sizeChangeHandle(val) {
                this.pageSize = val
                this.pageNum = 1
                this.getDataList()
            },
            // 当前页
            currentChangeHandle(val) {
                this.pageNum = val
                this.getDataList()
            },
            // 多选
            selectionChangeHandle(val) {
                this.dataListSelections = val
            },
            // 新增 / 修改
            addOrUpdateHandle(id) {
                this.$router.push({
					path: "/softwaredownloadAddOrUpdate",
					query: id ? {
						id: id
					} : null
				});
            },
            // 删除
            deleteHandle(id) {
                var ids = id ? [id] : this.dataListSelections.map(item => {
                    return item.id
                })
                this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http({
                        url: this.$http.adornUrl('/download/delete'),
                        method: 'delete',
                        data: this.$http.adornData(ids, false)
                    }).then(({ data }) => {
                        if (data && data.code === 200) {
                            this.$message({
                                message: '操作成功',
                                type: 'success',
                                duration: 1500,
                                onClose: () => {
                                    this.getDataList()
                                }
                            })
                        } else {
                            this.$message.error(data.msg)
                        }
                    })
                })
            }
        }
    }
</script>
