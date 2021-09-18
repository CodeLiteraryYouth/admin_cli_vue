<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="封面地址" prop="coverUrl">
      <el-input v-model="dataForm.coverUrl" placeholder="封面地址"></el-input>
    </el-form-item>
    <el-form-item label="文案" prop="content">
      <el-input v-model="dataForm.content" placeholder="文案"></el-input>
    </el-form-item>
    <el-form-item label="链接" prop="linkUrl">
      <el-input v-model="dataForm.linkUrl" placeholder="链接"></el-input>
    </el-form-item>
    <el-form-item label="位置" prop="location">
      <template>
        <el-select v-model="dataForm.location" placeholder="请选择">
          <el-option
            v-for="item in dataForm.locations"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </template>
    </el-form-item>
    <el-form-item label="页面" prop="type">
      <template>
        <el-select v-model="dataForm.type" placeholder="请选择">
          <el-option
            v-for="item in dataForm.types"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </template>
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
          coverUrl: '',
          content: '',
          linkUrl: '',
          location: '',
          type: '',
          locations: [
            {value: 0 ,label: '顶部'},
            {value: 1 ,label: '底部'},
            {value: 2 ,label: '左侧'},
            {value: 3 ,label: '右侧'}
          ],
          types: [{
            value: 0, label: '首页'
          }]
        },
        dataRule: {
          coverUrl: [
            { required: true, message: '封面地址不能为空', trigger: 'blur' }
          ],
          content: [
            { required: true, message: '文案不能为空', trigger: 'blur' }
          ],
          linkUrl: [
            { required: true, message: '链接不能为空', trigger: 'blur' }
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
              url: this.$http.adornUrl(`/banner/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 200) {
                this.dataForm.id = data.data.id
                this.dataForm.coverUrl = data.data.coverUrl
                this.dataForm.content = data.data.content
                this.dataForm.linkUrl = data.data.linkUrl
                this.dataForm.location = data.data.location
                this.dataForm.type = data.data.type
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
              url: this.$http.adornUrl(`/banner/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'coverUrl': this.dataForm.coverUrl,
                'content': this.dataForm.content,
                'linkUrl': this.dataForm.linkUrl,
                'location': this.dataForm.location,
                'type': this.dataForm.type,
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
