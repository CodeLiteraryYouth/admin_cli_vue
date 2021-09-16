<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="资源编号" prop="resourcesNo">
      <el-input v-model="dataForm.resourcesNo" placeholder="编号"></el-input>
    </el-form-item>
    <el-form-item label="资源标题" prop="title">
      <el-input v-model="dataForm.title" placeholder="标题"></el-input>
    </el-form-item>
    <el-form-item label="资源大小" prop="resourcesSize">
      <el-input v-model="dataForm.resourcesSize" placeholder="资源大小"></el-input>
    </el-form-item>
    <el-form-item label="资源格式" prop="resourcesFormat">
      <el-input v-model="dataForm.resourcesFormat" placeholder="资源格式"></el-input>
    </el-form-item>
    <el-form-item label="资源用途" prop="resourcesUse">
      <el-input v-model="dataForm.resourcesUse" placeholder="资源用途"></el-input>
    </el-form-item>
    <!-- <el-form-item label="文本内容" prop="text">
      <el-input v-model="dataForm.text" placeholder="文本内容"></el-input>
    </el-form-item> -->
    <el-form-item label="资源地址" prop="resourcesUrl">
      <el-input v-model="dataForm.resourcesUrl" placeholder="资源地址"></el-input>
    </el-form-item>
    <el-form-item label="封面地址" prop="coverUrl">
      <el-input v-model="dataForm.coverUrl" placeholder="封面地址"></el-input>
    </el-form-item>
    <el-form-item label="是否VIP" prop="free">
      <el-switch style="display:block" v-model="dataForm.free" active-color="#13ce66" placeholder="是否VIP"></el-switch>
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
          title: '',
          resourcesNo: '',
          resourcesSize: '',
          resourcesFormat: '',
          resourcesUse: '',
          text: '',
          resourcesUrl: '',
          coverUrl: '',
          free: ''
        },
        dataRule: {
          title: [
            { required: true, message: '资源标题不能为空', trigger: 'blur' }
          ],
          resourcesNo: [
            { required: true, message: '资源编号不能为空', trigger: 'blur' }
          ],
          resourcesSize: [
            { required: true, message: '资源大小不能为空', trigger: 'blur' }
          ],
          resourcesFormat: [
            { required: true, message: '资源格式不能为空', trigger: 'blur' }
          ],
          resourcesUse: [
            { required: true, message: '资源用途不能为空', trigger: 'blur' }
          ],
          // text: [
          //   { required: true, message: '文本内容不能为空', trigger: 'blur' }
          // ],
          resourcesUrl: [
            { required: true, message: '资源地址不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/resources/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 200) {
                this.dataForm.title = data.data.title
                this.dataForm.resourcesNo = data.data.resourcesNo
                this.dataForm.resourcesSize = data.data.resourcesSize
                this.dataForm.resourcesFormat = data.data.resourcesFormat
                this.dataForm.resourcesUse = data.data.resourcesUse
                this.dataForm.text = data.data.text
                this.dataForm.resourcesUrl = data.data.resourcesUrl
                this.dataForm.coverUrl = data.data.coverUrl
                this.dataForm.free = data.data.free
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
              url: this.$http.adornUrl(`/resources/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'title': this.dataForm.title,
                'resourcesNo': this.dataForm.resourcesNo,
                'resourcesSize': this.dataForm.resourcesSize,
                'resourcesFormat': this.dataForm.resourcesFormat,
                'resourcesUse': this.dataForm.resourcesUse,
                'text': this.dataForm.text,
                'resourcesUrl': this.dataForm.resourcesUrl,
                'coverUrl': this.dataForm.coverUrl,
                'free': this.dataForm.free
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
