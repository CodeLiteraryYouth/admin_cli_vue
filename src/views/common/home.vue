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
					<el-tab-pane label="注册数" name="tab3">
						<div class="echarts-wrap" v-if="active === 'tab3'"><v-echarts :option="echartsOption" :loading="loading1"></v-echarts></div>
					</el-tab-pane>
					<el-tab-pane label="日活数" name="tab2">
						<div class="echarts-wrap" v-if="active === 'tab2'"><v-echarts :option="echartsOption" :loading="loading2"></v-echarts></div>
					</el-tab-pane>
					<el-tab-pane label="作品总量" name="tab1">
						<div class="echarts-wrap" v-if="active === 'tab1'"><v-echarts :option="echartsOption" :loading="loading3"></v-echarts></div>
					</el-tab-pane>
					<el-tab-pane label="文章总量" name="tab0">
						<div class="echarts-wrap" v-if="active === 'tab0'"><v-echarts :option="echartsOption" :loading="loading4"></v-echarts></div>
					</el-tab-pane>
				</el-tabs>
				<div class="postion">
					<div :class="timeActive === 0 ? 'active' : ''" @click="timeActive = 0">今日</div>
					<div :class="timeActive === 1 ? 'active' : ''" @click="timeActive = 1">本周</div>
					<div :class="timeActive === 2 ? 'active' : ''" @click="timeActive = 2">本月</div>
					<div :class="timeActive === 3 ? 'active' : ''" @click="timeActive = 3">全年</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import VueCountUp from "@/components/CountUp/countUp";
	import Echarts from "@/components/Echarts/Echarts";
	import { getAllDateFromTwoDateBetween } from "@/utils";
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
				active: "tab3",
				timeActive: 1,
				echartsOption: {
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
							data: [],
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
							data: []
						}
					]
				},
				loading1: false,
				loading2: false,
				loading3: false,
				loading4: false
			}
		},
		watch: {
			active(n, o) {
				this.get();
			},
			timeActive(n, o) {
				this.get();
			}
		},
		mounted() {
			this.get();
		},
		methods: {
			get() {
				this.$http({
					url: this.$http.adornUrl('/index/count'),
					method: 'get',
					params: this.$http.adornParams({
						dateType: this.timeActive,
						type: parseInt(this.active.replace("tab", ""))
					})
				}).then(({ data }) => {
					if (data && data.code === 200) {
						var { registerNum, uvNum, productNum, articleNum, itemVOS } = data.data;
						this.items[0].countTop = registerNum;
						this.items[1].countTop = uvNum;
						this.items[2].countTop = productNum;
						this.items[3].countTop = articleNum;
						switch (this.active) {
							case "tab0":
								this.echartsOption.title.text = "注册数";
								this.echartsOption.series[0].name = "注册数";
								break;
							case "tab1":
								this.echartsOption.title.text = "日活数";
								this.echartsOption.series[0].name = "日活数";
								break;
							case "tab2":
								this.echartsOption.title.text = "作品总量";
								this.echartsOption.series[0].name = "作品总量";
								break;
							case "tab3":
								this.echartsOption.title.text = "文章总量";
								this.echartsOption.series[0].name = "文章总量";
								break;
							default:
								break;
						}
						switch (this.timeActive) {
							case 0:
								this.echartsOption.xAxis.data = [moment().format("YYYY-MM-DD")];
								break;
							case 1:
								this.echartsOption.xAxis.data = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
								break;
							case 2:
								this.echartsOption.xAxis.data = getAllDateFromTwoDateBetween(moment().startOf('month').format("YYYY-MM-DD"), moment().endOf('month').format("YYYY-MM-DD"));
								break;
							case 3:
								this.echartsOption.xAxis.data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
								break;
							default:
								break;
						}
					}
				});
			}
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
							font-weight: 800;
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
