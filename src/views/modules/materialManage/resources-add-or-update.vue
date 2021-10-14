<template>
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
		<el-form-item label="资源地址" prop="resourcesUrl">
			<el-input v-model="dataForm.resourcesUrl" placeholder="资源地址"></el-input>
		</el-form-item>
		<el-form-item label="封面地址" prop="coverUrl">
			<el-input v-model="dataForm.coverUrl" placeholder="封面地址"></el-input>
		</el-form-item>
		<el-form-item label="是否VIP" prop="free" class="content-flex">
			<el-switch style="display:block" v-model="dataForm.free" active-color="#13ce66" placeholder="是否VIP"></el-switch>
		</el-form-item>
		<el-form-item label="资源类型" prop="types">
			<template>
				<el-select v-model="dataForm.typeIds" multiple placeholder="请选择">
					<el-option v-for="item in types" :key="item.id" :label="item.typeName" :value="item.id">
					</el-option>
				</el-select>
			</template>
		</el-form-item>
		<el-form-item label="素材内容">
			<div id="Editor"></div>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" size="small" @click="dataFormSubmit">保存</el-button>
		</el-form-item>
	</el-form>
</template>

<script>
    export default {
        data() {
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
                    free: '',
                    types: [],
                    typeIds: []
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
                },
				types: [],
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
                    url: this.$http.adornUrl('/resources/type/list'),
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
                            url: this.$http.adornUrl(`/resources/info/${this.dataForm.id}`),
                            method: 'get',
                            params: this.$http.adornParams()
                        }).then(({ data }) => {
                            if (data && data.code === 200) {
                                this.dataForm.title = data.data.title
                                this.dataForm.resourcesNo = data.data.resourcesNo
                                this.dataForm.resourcesSize = data.data.resourcesSize
                                this.dataForm.resourcesFormat = data.data.resourcesFormat
                                this.dataForm.resourcesUse = data.data.resourcesUse
                                this.dataForm.text = data.data.text
								this.editor.txt.html(data.data.text);
                                this.dataForm.resourcesUrl = data.data.resourcesUrl
                                this.dataForm.coverUrl = data.data.coverUrl
                                this.dataForm.free = data.data.free
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
                            url: this.$http.adornUrl(`/resources/${!this.dataForm.id ? 'save' : 'update'}`),
                            method: 'post',
                            data: this.$http.adornData({
                                'id': this.dataForm.id || undefined,
                                'title': this.dataForm.title,
                                'resourcesNo': this.dataForm.resourcesNo,
                                'resourcesSize': this.dataForm.resourcesSize,
                                'resourcesFormat': this.dataForm.resourcesFormat,
                                'resourcesUse': this.dataForm.resourcesUse,
                                'text': this.editor.txt.html(),
                                'resourcesUrl': this.dataForm.resourcesUrl,
                                'coverUrl': this.dataForm.coverUrl,
                                'free': this.dataForm.free,
                                'typeIds': this.dataForm.typeIds
                            })
                        }).then(({ data }) => {
                            if (data && data.code === 200) {
                                this.$message({
                                    message: '操作成功',
                                    type: 'success',
                                    duration: 1500
                                });
								setTimeout(() => {
									this.$router.push({
										path: "/materialList"
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
