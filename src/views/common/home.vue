<!-- 首页 -->
<template>
	<div class="wrap">
		<div class="wrap-heard">
			<el-row class="wrap-heard-toprow" :gutter="10">
				<div class="wrap-heard-toprow-col" v-for="(item, i) in items" :key="i">
					<div class="wrap-heard-toprow-col-items">
						<div class="top label">{{ item.labelTop }}</div>
						<div class="mid">
							<vue-count-up :start='config.start' :decimal="config.decimal"
							:end="item.countTop" :duration="config.duration"
							:options="config.option" :autoplay="true"></vue-count-up>
						</div>
						<div class="bot">
							<span class="label">{{ item.labelBot }}&nbsp;&nbsp;</span>
							<vue-count-up :start='config.start' :decimal="config.decimal"
							:end="item.countBot" :duration="config.duration"
							:options="config.option" :autoplay="true"></vue-count-up>
						</div>
					</div>
				</div>
			</el-row>
		</div>
		<div class="wrap-content">
			<div class="top">
				<el-tabs v-model="active" tab-position="top">
					<el-tab-pane label="注册数" name="tab1">
						<div class="echarts-wrap" v-if="active === 'tab1'"><v-echarts :option="echartsOption1" :loading="loading1"></v-echarts></div>
					</el-tab-pane>
					<el-tab-pane label="日活数" name="tab2">
						<div class="echarts-wrap" v-if="active === 'tab2'"><v-echarts :option="echartsOption1" :loading="loading2"></v-echarts></div>
					</el-tab-pane>
					<el-tab-pane label="作品总量" name="tab3">
						<div class="echarts-wrap" v-if="active === 'tab3'"><v-echarts :option="echartsOption1" :loading="loading3"></v-echarts></div>
					</el-tab-pane>
					<el-tab-pane label="文章总量" name="tab4">
						<div class="echarts-wrap" v-if="active === 'tab4'"><v-echarts :option="echartsOption1" :loading="loading4"></v-echarts></div>
					</el-tab-pane>
				</el-tabs>
				<div class="postion">
					<div :class="timeActive === 0 ? 'active' : ''" @click="">今日</div>
					<div :class="timeActive === 1 ? 'active' : ''" @click="">本周</div>
					<div :class="timeActive === 2 ? 'active' : ''" @click="">本月</div>
					<div :class="timeActive === 3 ? 'active' : ''" @click="">全年</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import VueCountUp from "@/components/CountUp/countUp";
	import Echarts from "@/components/Echarts/Echarts";
	export default {
		components: {
			"vue-count-up": VueCountUp,
			"v-echarts": Echarts
		},
		data () {
			return {
				config: {
					start: 0,			// 起始值
                    duration: 4,		// 动画持续时间
					decimal: 0,		// 小数位数  默认为0
					monenyDecimal: 2,		// 小数位数  默认为0
                    option: {
                        useEasing: true,
                        useGrouping: true,
                        separator: ",",
                        decimal: ".",
                        prefix: "",
						suffix: ""
                    }
				},
				items: [
					{
						labelTop: "注册数",
						labelBot: "日均注册数",
						countTop: 10000,
						countBot: 2000
					},
					{
						labelTop: "日活数",
						labelBot: "平均日活数",
						countTop: 10000,
						countBot: 2000
					},
					{
						labelTop: "作品总量",
						labelBot: "今日上传数",
						countTop: 10000,
						countBot: 2000
					},
					{
						labelTop: "文章总量",
						labelBot: "今日上传数",
						countTop: 10000,
						countBot: 2000
					}
				],
				active: "tab1",
				timeActive: 1,
				echartsOption1: {
					title: {
						text: '注册数'
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: {            // 坐标轴指示器，坐标轴触发有效
							type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
						}
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '12%',
						containLabel: true
					},
					dataZoom: [
						{
							show: true,
							realtime: true,
							start: 0,
							end: 100
						}
					],
					xAxis: [
						{
							type: 'category',
							data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
							axisTick: {
								alignWithLabel: true
							}
						}
					],
					yAxis: [
						{
							type: 'value'
						}
					],
					series: [
						{
							name: '直接访问',
							type: 'bar',
							barWidth: '60%',
							data: [10, 52, 200, 334, 390, 330, 220]
						}
					]
				},
				echartsOption2: {},
				echartsOption3: {},
				echartsOption4: {},
				loading1: false,
				loading2: false,
				loading3: false,
				loading4: false
			}
		},
		computed: {

		},
		watch: {

		},
		mounted() {

		},
		methods: {

		}
	};
</script>
<style lang="scss" scoped>
	.wrap{
		&-heard{
			&-toprow{
				display: flex;
				height: 136px;
				margin-left: 0 !important;
				margin-right: 0 !important;
				&-col{
					flex: 1;
					&:first-child{
						padding-left: 0 !important;
					}
					&:last-child{
						padding-right: 0 !important;
					}
					&:not(:first-child) {
						margin-left: 20px;
					}
					&-items{
						flex: 1;
						background-color: #f1f4f5;
						height: 136px;
						border-radius: 5px;
						padding: 20px;
						color: #333;
						.top{
							font-size: 14px;
						}
						.mid{
							font-size: 30px;
							padding: 10px 0;
						}
						.bot{
							font-size: 14px;
							border-top: 1px solid #c2c0c0;
							padding-top: 10px;
						}
						.label{
							color: #a5a3a3;
						}
					}
				}
			}
		}
		&-content{
			margin-top: 20px;
			.top{
				position: relative;
				.postion{
					width: 200px;
					position: absolute;
					right: 10px;
					top: 12px;
					display: flex;
					div{
						flex: 1;
						font-size: 13px;
						text-align: center;
						&:hover{
							cursor: pointer;
							color: #3E8EF7;
						}
					}
					.active{
						color: #3E8EF7;
					}
				}
				.echarts-wrap{
					width: 100%;
					height: 400px;
				}
			}
		}
	}
</style>
