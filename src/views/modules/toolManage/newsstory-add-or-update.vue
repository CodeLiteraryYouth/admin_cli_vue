<template>
    <div>
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
            <el-form-item label="标题" prop="title">
                <el-input v-model="dataForm.title" placeholder="标题"></el-input>
            </el-form-item>
            <el-form-item label="描述" prop="desc">
                <el-input v-model="dataForm.desc" placeholder="描述"></el-input>
            </el-form-item>
            <el-form-item label="封面地址" prop="coverUrl">
                <el-input v-model="dataForm.coverUrl" placeholder="封面地址"></el-input>
            </el-form-item>
            <el-form-item label="新闻内容">
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
                visible: false,
                dataForm: {

                    title: '',
                    desc: '',
                    coverUrl: '',
                    content: ''
                },
                dataRule: {
                    title: [
                        { required: true, message: '标题不能为空', trigger: 'blur' }
                    ],
                    desc: [
                        { required: true, message: '描述不能为空', trigger: 'blur' }
                    ],
                    coverUrl: [
                        { required: true, message: '封面地址不能为空', trigger: 'blur' }
                    ]
                }
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
                this.visible = true
                this.$nextTick(() => {
                    this.$refs['dataForm'].resetFields()
                    if (this.dataForm.id) {
                        this.$http({
                            url: this.$http.adornUrl(`/news/story/info/${this.dataForm.id}`),
                            method: 'get',
                            params: this.$http.adornParams()
                        }).then(({ data }) => {
                            if (data && data.code === 200) {
                                this.dataForm.id = data.data.id
                                this.dataForm.title = data.data.title
                                this.dataForm.desc = data.data.storyDesc
                                this.dataForm.coverUrl = data.data.coverUrl
                                this.dataForm.content = data.data.content
								this.editor.txt.html(data.data.content);
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
                            url: this.$http.adornUrl(`/news/story/${!this.dataForm.id ? 'save' : 'update'}`),
                            method: 'post',
                            data: this.$http.adornData({
                                'id': this.dataForm.id || undefined,
                                'title': this.dataForm.title,
                                'storyDesc': this.dataForm.desc,
                                'coverUrl': this.dataForm.coverUrl,
                                'content': this.editor.txt.html(),
                            })
                        }).then(({ data }) => {
                            if (data && data.code === 200) {
                                this.$message({
                                    message: '操作成功',
                                    type: 'success',
                                    duration: 1500,
                                })
								setTimeout(() => {
									this.$router.push({
										path: "/newsStory"
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
