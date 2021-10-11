<template>
	<div>
		<el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
            <el-form-item label="标题" prop="title">
                <el-input v-model="dataForm.title" placeholder="标题"></el-input>
            </el-form-item>
            <el-form-item label="作品说明" prop="desc">
                <el-input v-model="dataForm.desc" placeholder="作品说明"></el-input>
            </el-form-item>
            <el-form-item label="图片地址" prop="imgUrl">
                <el-input v-model="dataForm.imgUrl" placeholder="图片地址"></el-input>
            </el-form-item>
            <el-form-item label="视频地址" prop="videoUrl">
                <el-input v-model="dataForm.videoUrl" placeholder="视频地址"></el-input>
            </el-form-item>
            <el-form-item label="封面地址" prop="coverUrl">
                <el-input v-model="dataForm.coverUrl" placeholder="封面地址"></el-input>
            </el-form-item>
            <el-form-item label="类型" size="mini" prop="types">
                <el-checkbox-group v-model="dataForm.types">
                    <el-checkbox v-for="type in types" :key="type.id" :label="type.typeCode">{{ type.typeName }}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="作品类型" prop="copyright">
                <el-radio-group v-model="dataForm.copyright">
                    <el-radio :label=0>原创</el-radio>
                    <el-radio :label=1>转载</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="背景色" prop="matchColor">
                <el-radio-group v-model="dataForm.matchColor">
                    <el-radio :label=0>优雅白</el-radio>
                    <el-radio :label=1>高级黑</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="作品区别" prop="isArticle">
                <el-radio-group v-model="dataForm.isArticle">
                    <el-radio :label=0>文章</el-radio>
                    <el-radio :label=1>作品</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="通过理由" prop="passReason">
                <el-input v-model="dataForm.passReason" placeholder="通过理由"></el-input>
            </el-form-item>
            <el-form-item label="屏蔽状态" prop="isBlock" class="content-flex">
                <el-switch style="display:block" v-model="dataForm.isBlock" active-color="#13ce66" placeholder="屏蔽状态"></el-switch>
            </el-form-item>
            <el-form-item label="热门状态" prop="isHot" class="content-flex">
                <el-switch style="display:block" v-model="dataForm.isHot" active-color="#13ce66" placeholder="热门状态"></el-switch>
            </el-form-item>
            <el-form-item label="通过状态" prop="isPass" class="content-flex">
                <el-switch style="display:block" v-model="dataForm.isPass" active-color="#13ce66" placeholder="通过状态"></el-switch>
            </el-form-item>
            <el-form-item label="作品排序" prop="sort">
                <el-input v-model="dataForm.sort" placeholder="作品排序"></el-input>
            </el-form-item>
			<el-form-item label="文章内容" prop="content">
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
                    desc: '',
                    imgUrl: '',
                    videoUrl: '',
                    coverUrl: '',
                    content: '',
                    copyright: '',
                    matchColor: '',
                    isArticle: '',
                    passReason: '',
                    isBlock: '',
                    isHot: '',
                    isPass: '',
                    sort: '',
                    types: []
                },
				types: [],
                dataRule: {
                    title: [
                        { required: true, message: '标题不能为空', trigger: 'blur' }
                    ],
                    imgUrl: [
                        { required: true, message: '图片地址不能为空', trigger: 'blur' }
                    ],
                    videoUrl: [
                        { required: true, message: '视频地址不能为空', trigger: 'blur' }
                    ],
                    types: [
                        { required: true, message: '请选择作品类型', trigger: 'blur' }
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
                    url: this.$http.adornUrl('/product/type/list'),
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
                            url: this.$http.adornUrl(`/product/info/${this.dataForm.id}`),
                            method: 'get',
                            params: this.$http.adornParams()
                        }).then(({ data }) => {
                            if (data && data.code === 200) {
                                this.dataForm.typeId = data.data.typeId
                                this.dataForm.title = data.data.title
                                this.dataForm.desc = data.data.productDesc
                                this.dataForm.imgUrl = data.data.imgUrl
                                this.dataForm.videoUrl = data.data.videoUrl
                                this.dataForm.coverUrl = data.data.coverUrl
                                this.dataForm.content = data.data.content
								this.editor.txt.html(data.data.content);
                                this.dataForm.copyright = data.data.copyright
                                this.dataForm.matchColor = data.data.matchColor
                                this.dataForm.isArticle = data.data.isArticle
                                this.dataForm.viewNum = data.data.viewNum
                                this.dataForm.favourNum = data.data.favourNum
                                this.dataForm.passReason = data.data.passReason
                                this.dataForm.isBlock = data.data.isBlock
                                this.dataForm.isHot = data.data.isHot
                                this.dataForm.isPass = data.data.isPass
                                this.dataForm.sort = data.data.sort
                                this.dataForm.creator = data.data.creator
                                this.dataForm.createTime = data.data.createTime
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
                            url: this.$http.adornUrl(`/product/${!this.dataForm.id ? 'save' : 'update'}`),
                            method: 'post',
                            data: this.$http.adornData({
                                'id': this.dataForm.id || undefined,
                                'typeId': this.dataForm.typeId,
                                'title': this.dataForm.title,
                                'productDesc': this.dataForm.desc,
                                'imgUrl': this.dataForm.imgUrl,
                                'videoUrl': this.dataForm.videoUrl,
                                'coverUrl': this.dataForm.coverUrl,
                                'content': this.editor.txt.html(),
                                'copyright': this.dataForm.copyright,
                                'matchColor': this.dataForm.matchColor,
                                'isArticle': this.dataForm.isArticle,
                                'passReason': this.dataForm.passReason,
                                'isBlock': this.dataForm.isBlock,
                                'isHot': this.dataForm.isHot,
                                'isPass': this.dataForm.isPass,
                                'sort': this.dataForm.sort
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
										path: "/listOfWorks"
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
