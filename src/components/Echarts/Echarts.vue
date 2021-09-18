<template>
	<div class="v-charts"></div>
</template>
<script>
	export default {
		props: {
			option: {
				type: Object,
				default: {}
			},
			loading: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				eChart: null
			};
		},
		watch: {
			option: {
				handler(newv, oldv) {
					if (this.eChart) {
						if (newv) {
							this.eChart.setOption(this.option);
						} else {
							this.eChart.setOption(this.option);
						}
					} else {
						this.initCharts();
					}
				},
				deep: true
			},
			loading(nval, oval) {
				if (this.eChart) {
					if (nval === false) this.eChart.hideLoading();
				}
			}
		},
		mounted() {
			// 容器改变时重新绘制
			window.addEventListener('resize', () => {
				this.resize();
			}, false);
			this.$nextTick(() => {
				this.initCharts();
				this.setChartOption(this.option);
			});
		},
		methods: {
			initCharts() {
				var self = this;
				var chartDom = self.$el;
				// 基于准备好的dom，初始化echarts实例
				self.eChart = echarts.init(chartDom, 'walden');
				if (self.eChart) {
					self.eChart.on("click", function (params) {
						self.$emit("echarts-click", params);
					});
				}
			},
			setChartOption(option) {
				// 绘制图表
				if (option === null || option === []) return false;
				this.eChart.setOption(option);
				// this.eChart.showLoading({
		        //     text: '拼命加载中...',
				// 	textColor: '#333',
				// 	maskColor: 'rgba(255, 255, 255, 0.8)',
				// 	zlevel: 0,
				// 	// 字体大小。从 `v4.8.0` 开始支持。
				// 	fontSize: "18px",
				// 	// 是否显示旋转动画（spinner）。从 `v4.8.0` 开始支持。
				// 	showSpinner: true,
				// 	// 旋转动画（spinner）的半径。从 `v4.8.0` 开始支持。
				// 	spinnerRadius: 20,
				// 	// 旋转动画（spinner）的线宽。从 `v4.8.0` 开始支持。
				// 	lineWidth: 8
		        // });
			},
			resize() {
				this.eChart.resize();
			}
		}
	};
</script>
<style>
	.v-charts {
		height: 100%;
		width: 100%;
	}
</style>
