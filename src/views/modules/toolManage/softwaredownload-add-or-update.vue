<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="软件名" prop="name">
      <el-input v-model="dataForm.name" placeholder="软件名"></el-input>
    </el-form-item>
    <el-form-item label="软件描述" prop="desc">
      <el-input v-model="dataForm.desc" placeholder="软件描述"></el-input>
    </el-form-item>
    <el-form-item label="软件版本" prop="version">
      <el-input v-model="dataForm.version" placeholder="软件版本"></el-input>
    </el-form-item>
    <el-form-item label="软件发布时间" prop="publishTime">
      <el-date-picker
        v-model="dataForm.publishTime"
        type="date"
        placeholder="选择日期">
      </el-date-picker>
    </el-form-item>
    <el-form-item label="软件大小" prop="size">
      <el-input-number v-model="dataForm.size" :precision="2" :step="0.1"></el-input-number>
    </el-form-item>
    <el-form-item label="软件下载信息" prop="content">
      <el-input v-model="dataForm.content" placeholder="软件下载信息"></el-input>
    </el-form-item>
    <el-form-item label="下载类型" prop="types">
      <template>
        <el-select v-model="dataForm.typeId" placeholder="请选择">
          <el-option
            v-for="item in types"
            :key="item.id"
            :label="item.typeName"
            :value="item.id">
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
          name: '',
          desc: '',
          version: '',
          publishTime: '',
          size: '',
          content: '',
          types: []
        },
        dataRule: {
          name: [
            { required: true, message: '软件名不能为空', trigger: 'blur' }
          ],
          version: [
            { required: true, message: '软件版本不能为空', trigger: 'blur' }
          ],
          publishTime: [
            { required: true, message: '软件发布时间不能为空', trigger: 'blur' }
          ],
          size: [
            { required: true, message: '软件大小不能为空', trigger: 'blur' }
          ],
          content: [
            { required: true, message: '软件下载信息不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.$http({
          url: this.$http.adornUrl('/download/type/list'),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          this.types = data && data.code === 200 ? data.data.list : []
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
        }).then(() => {
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/download/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 200) {
                this.dataForm.name = data.data.name
                this.dataForm.desc = data.data.downloadDesc
                this.dataForm.version = data.data.version
                this.dataForm.publishTime = data.data.publishTime
                this.dataForm.size = data.data.size
                this.dataForm.content = data.data.content
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
              url: this.$http.adornUrl(`download/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'typeId': this.dataForm.typeId,
                'name': this.dataForm.name,
                'downloadDesc': this.dataForm.desc,
                'version': this.dataForm.version,
                'publishTime': this.dataForm.publishTime,
                'size': this.dataForm.size,
                'content': this.dataForm.content
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
