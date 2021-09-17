<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="作业标题" prop="workTitle">
      <el-input v-model="dataForm.workTitle" placeholder="作业标题"></el-input>
    </el-form-item>
    <el-form-item label="作业描述" prop="workDesc">
      <el-input v-model="dataForm.workDesc" placeholder="作业描述"></el-input>
    </el-form-item>
    <el-form-item label="作业内容" prop="workContent">
      <el-input v-model="dataForm.workContent" placeholder="作业内容"></el-input>
    </el-form-item>
    <el-form-item label="封面地址" prop="coverUrl">
      <el-input v-model="dataForm.coverUrl" placeholder="封面地址"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          userId: '',
          jobId: '',
          workTitle: '',
          workDesc: '',
          workContent: '',
          coverUrl: ''
        },
        dataRule: {
          
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/user/work/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 200) {
                this.dataForm.jobId = data.data.jobId
                this.dataForm.userId = data.data.userId
                this.dataForm.workTitle = data.data.workTitle
                this.dataForm.workDesc = data.data.workDesc
                this.dataForm.workContent = data.data.workContent
                this.dataForm.coverUrl = data.data.coverUrl
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/user/work/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'userId': this.dataForm.userId,
                'jobId': this.dataForm.jobId,
                'workTitle': this.dataForm.workTitle,
                'workDesc': this.dataForm.workDesc,
                'workContent': this.dataForm.workContent,
                'coverUrl': this.dataForm.coverUrl
              })
            }).then(({data}) => {
              if (data && data.code === 200) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
          }
        })
      }
    }
  }
</script>
