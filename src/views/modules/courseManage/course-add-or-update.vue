<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="VIP" prop="free">
      <el-switch style="display: block" v-model="dataForm.free" active-color="#13ce66" placeholder="false:free true:VIP"></el-switch>
    </el-form-item>
    <el-form-item label="课程标题" prop="courseTitle">
      <el-input v-model="dataForm.courseTitle" placeholder="课程标题"></el-input>
    </el-form-item>
    <el-form-item label="课程描述" prop="courseDesc">
      <el-input v-model="dataForm.courseDesc" placeholder="课程描述"></el-input>
    </el-form-item>
    <el-form-item label="课程标签" prop="courseTag">
      <el-input v-model="dataForm.courseTag" placeholder="课程标签"></el-input>
    </el-form-item>
    <el-form-item label="封面地址" prop="coverUrl">
      <el-input v-model="dataForm.coverUrl" placeholder="封面地址"></el-input>
    </el-form-item>
    <el-form-item label="课程原价" prop="originalPrice">
      <el-input v-model="dataForm.originalPrice" placeholder="课程原价"></el-input>
    </el-form-item>
    <el-form-item label="会员价格" prop="vipPrice">
      <el-input v-model="dataForm.vipPrice" placeholder="会员价格"></el-input>
    </el-form-item>
    <el-form-item label="课程文案" prop="text">
      <el-input v-model="dataForm.text" placeholder="课程文案"></el-input>
    </el-form-item>
    <el-form-item label="课程链接" prop="courseUrl">
      <el-input v-model="dataForm.courseUrl" placeholder="课程链接"></el-input>
    </el-form-item>
    <el-form-item label="课程类型" prop="types">
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
    <el-form-item label="文案类型" prop="courseType">
      <template>
        <el-radio v-model="dataForm.courseType" label="TEXT">文案</el-radio>
        <el-radio v-model="dataForm.courseType" label="URL">链接</el-radio>
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
          typeId: '',
          typeName: '',
          free: '',
          courseTitle: '',
          courseDesc: '',
          courseTag: '',
          coverUrl: '',
          originalPrice: '',
          vipPrice: '',
          text: '',
          courseUrl: '',
          courseType: '',
          types: []
        },
        dataRule: {
          courseTitle: [
            { required: true, message: '课程标题不能为空', trigger: 'blur' }
          ],
          courseTag: [
            { required: true, message: '课程标签不能为空', trigger: 'blur' }
          ],
          coverUrl: [
            { required: true, message: '封面地址不能为空', trigger: 'blur' }
          ],

        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.$http({
          url: this.$http.adornUrl('/course/type/list'),
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
              url: this.$http.adornUrl(`/course/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 200) {
                this.dataForm.typeId = data.data.typeId
                this.dataForm.typeName = data.data.typeName
                this.dataForm.free = data.data.free
                this.dataForm.courseTitle = data.data.courseTitle
                this.dataForm.courseDesc = data.data.courseDesc
                this.dataForm.courseTag = data.data.courseTag
                this.dataForm.coverUrl = data.data.coverUrl
                this.dataForm.originalPrice = data.data.originalPrice
                this.dataForm.vipPrice = data.data.vipPrice
                this.dataForm.text = data.data.text
                this.dataForm.courseUrl = data.data.courseUrl
                this.dataForm.courseType = data.data.courseType
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
              url: this.$http.adornUrl(`/course/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'typeId': this.dataForm.typeId,
                'free': this.dataForm.free,
                'courseTitle': this.dataForm.courseTitle,
                'courseDesc': this.dataForm.courseDesc,
                'courseTag': this.dataForm.courseTag,
                'coverUrl': this.dataForm.coverUrl,
                'originalPrice': this.dataForm.originalPrice,
                'vipPrice': this.dataForm.vipPrice,
                'text': this.dataForm.text,
                'courseUrl': this.dataForm.courseUrl,
                'courseType': this.dataForm.courseType
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
