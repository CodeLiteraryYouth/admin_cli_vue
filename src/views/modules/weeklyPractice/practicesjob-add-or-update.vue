<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="标题" prop="jobTitle">
      <el-input v-model="dataForm.jobTitle" placeholder="标题"></el-input>
    </el-form-item>
    <el-form-item label="描述" prop="jobDesc">
      <el-input v-model="dataForm.jobDesc" placeholder="描述"></el-input>
    </el-form-item>
    <el-form-item label="标签" prop="jobTag">
      <el-input v-model="dataForm.jobTag" placeholder="标签"></el-input>
    </el-form-item>
    <el-form-item label="内容" prop="jobContent">
      <el-input v-model="dataForm.jobContent" placeholder="内容"></el-input>
    </el-form-item>
    <el-form-item label="作品数量" prop="jobNum">
      <el-input v-model="dataForm.jobNum" placeholder="作品数量"></el-input>
    </el-form-item>
    <el-form-item label="周练状态" prop="jobStatus">
      <template>
        <el-radio v-model="dataForm.jobStatus" label="1">学习中</el-radio>
        <el-radio v-model="dataForm.jobStatus" label="2">已结束</el-radio>
      </template>
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
          id: 0,
          jobTitle: '',
          jobDesc: '',
          jobTag: '',
          jobContent: '',
          jobNum: '',
          jobStatus: '',
          coverUrl: ''        
        },
        dataRule: {
          jobTitle: [
            { required: true, message: '标题不能为空', trigger: 'blur' }
          ],
          jobDesc: [
            { required: true, message: '描述不能为空', trigger: 'blur' }
          ],
          jobTag: [
            { required: true, message: '标签不能为空', trigger: 'blur' }
          ],
          jobContent: [
            { required: true, message: '内容不能为空', trigger: 'blur' }
          ],
          jobNum: [
            { required: true, message: '作品数量不能为空', trigger: 'blur' }
          ],
          jobStatus: [
            { required: true, message: '周练状态不能为空', trigger: 'blur' }
          ],
          coverUrl: [
            { required: true, message: '封面地址不能为空', trigger: 'blur' }
          ]
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
              url: this.$http.adornUrl(`/practices/job/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 200) {
                this.dataForm.jobTitle = data.data.jobTitle
                this.dataForm.jobDesc = data.data.jobDesc
                this.dataForm.jobTag = data.data.jobTag
                this.dataForm.jobContent = data.data.jobContent
                this.dataForm.jobNum = data.data.jobNum
                this.dataForm.jobStatus = data.data.jobStatus
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
              url: this.$http.adornUrl(`/practices/job/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'jobTitle': this.dataForm.jobTitle,
                'jobDesc': this.dataForm.jobDesc,
                'jobTag': this.dataForm.jobTag,
                'jobContent': this.dataForm.jobContent,
                'jobNum': this.dataForm.jobNum,
                'jobStatus': this.dataForm.jobStatus,
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
