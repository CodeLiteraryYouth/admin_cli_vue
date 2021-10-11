<template>
    <div>
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
            <el-form-item label="标题" prop="title">
                <el-input v-model="dataForm.title" placeholder="标题"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="businessDesc">
                <el-input v-model="dataForm.businessDesc" placeholder="描述"></el-input>
            </el-form-item>
            <el-form-item label="封面地址" prop="coverUrl">
                <el-input v-model="dataForm.coverUrl" placeholder="封面地址"></el-input>
            </el-form-item>
            <el-form-item label="合作标签" prop="tags">
                <el-input v-model="dataForm.tags" placeholder="合作标签"></el-input>
            </el-form-item>
            <el-form-item label="合作类型" prop="types">
                <template>
                    <el-select v-model="dataForm.typeId" placeholder="请选择">
                        <el-option v-for="item in types" :key="item.id" :label="item.typeName" :value="item.id"></el-option>
                    </el-select>
                </template>
            </el-form-item>
            <el-form-item label="内容" prop="content">
                <div id="Editor"></div>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="small" @click="dataFormSubmit">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                dataForm: {
                    id: 0,
                    typeId: '',
                    title: '',
                    businessDesc: '',
                    content: '',
                    coverUrl: '',
                    tags: '',
                    types: []
                },
                dataRule: {
                    title: [
                        { required: true, message: '标题不能为空', trigger: 'blur' }
                    ],
                    coverUrl: [
                        { required: true, message: '封面地址不能为空', trigger: 'blur' }
                    ],
                    tags: [
                        { required: true, message: '合作标签不能为空', trigger: 'blur' }
                    ]
                },
				editor: null
            }
        },
		mounted () {
			this.init(this.$route.query.id);
			const E = window.wangEditor;
			this.editor = new E('#Editor');
			// 配置菜单栏，设置不需要的菜单
			this.editor.config.excludeMenus = ['image', 'video', 'code', 'table', 'todo'];
			this.editor.config.height = 500;
			// 配置全屏功能按钮是否展示
			this.editor.config.showFullScreen = false;
			this.editor.create();
		},
        methods: {
            init(id) {
                this.dataForm.id = id || 0
                this.$http({
                    url: this.$http.adornUrl('/business/cooperation/type/list'),
                    method: 'get',
                    params: this.$http.adornParams()
                }).then(({ data }) => {
                    this.types = data && data.code === 200 ? data.data.list : []
                }).then(() => {
                    this.visible = true
                    this.$nextTick(() => {
                        this.$refs['dataForm'].resetFields()
                    })
                }).then(() => {
                    if (this.dataForm.id) {
                        this.$http({
                            url: this.$http.adornUrl(`/business/cooperation/info/${this.dataForm.id}`),
                            method: 'get',
                            params: this.$http.adornParams()
                        }).then(({ data }) => {
                            if (data && data.code === 200) {
                                this.dataForm.typeId = data.data.typeId
                                this.dataForm.title = data.data.title
                                this.dataForm.businessDesc = data.data.businessDesc
                                this.dataForm.content = data.data.content
								this.editor.txt.html(data.data.content);
                                this.dataForm.coverUrl = data.data.coverUrl
                                this.dataForm.tags = data.data.tags
                            }
                        })
                    }
                })
            },
            // 表单提交
            dataFormSubmit() {
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        this.$http({
                            url: this.$http.adornUrl(`/business/cooperation/${!this.dataForm.id ? 'save' : 'update'}`),
                            method: 'post',
                            data: this.$http.adornData({
                                'id': this.dataForm.id || undefined,
                                'typeId': this.dataForm.typeId,
                                'title': this.dataForm.title,
                                'businessDesc': this.dataForm.businessDesc,
                                'content': this.editor.txt.html(),
                                'coverUrl': this.dataForm.coverUrl,
                                'tags': this.dataForm.tags
                            })
                        }).then(({ data }) => {
                            if (data && data.code === 200) {
                                this.$message({
                                    message: '操作成功',
                                    type: 'success',
                                    duration: 1500
                                })
								setTimeout(() => {
									this.$router.push({
										path: "/enterpriseCooperationList"
									});
								}, 1600);
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
