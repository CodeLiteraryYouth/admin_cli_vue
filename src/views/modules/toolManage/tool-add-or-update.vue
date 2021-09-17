<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="名称" prop="toolTitle">
      <el-input v-model="dataForm.toolTitle" placeholder="名称"></el-input>
    </el-form-item>
    <el-form-item label="描述" prop="toolDesc">
      <el-input v-model="dataForm.toolDesc" placeholder="描述"></el-input>
    </el-form-item>
    <el-form-item label="图标" prop="toolIcon">
      <el-input v-model="dataForm.toolIcon" placeholder="图标"></el-input>
    </el-form-item>
    <el-form-item label="地址" prop="toolUrl">
      <el-input v-model="dataForm.toolUrl" placeholder="地址"></el-input>
    </el-form-item>
    <el-form-item label="类型" prop="types">
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
          toolTitle: '',
          toolDesc: '',
          toolIcon: '',
          toolUrl: '',
          types: []
        },
        dataRule: {
          toolTitle: [
            { required: true, message: '名称不能为空', trigger: 'blur' }
          ],
          toolDesc: [
            { required: true, message: '描述不能为空', trigger: 'blur' }
          ],
          toolIcon: [
            { required: true, message: '图标不能为空', trigger: 'blur' }
          ],
          toolUrl: [
            { required: true, message: '地址不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.$http({
          url: this.$http.adornUrl('/tool/type/list'),
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
              url: this.$http.adornUrl(`/tool/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 200) {
                this.dataForm.typeId = data.data.typeId
                this.dataForm.toolTitle = data.data.toolTitle
                this.dataForm.toolDesc = data.data.toolDesc
                this.dataForm.toolIcon = data.data.toolIcon
                this.dataForm.toolUrl = data.data.toolUrl
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
              url: this.$http.adornUrl(`/tool/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'typeId': this.dataForm.typeId,
                'toolTitle': this.dataForm.toolTitle,
                'toolDesc': this.dataForm.toolDesc,
                'toolIcon': this.dataForm.toolIcon,
                'toolUrl': this.dataForm.toolUrl
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
