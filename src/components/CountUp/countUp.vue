<template>
    <span ref='countup'></span>
</template>
<script>
    import CountUp from 'countup.js';
    export default {
        props: {
            start: {			// 起始值
                type: Number,
                default: 0
            },
            end: {				// 结束值
                type: Number,
                default: 0
            },
            decimal: {			// 小数位数
                type: Number,
                default: 0
            },
            duration: {			// 动画持续时间
                type: Number,
                default: 2.5
            },
            options: {			// 配置项
                type: Object
            },
            autoplay: {			// 是否自动播放
                type: Boolean,
                required: false,
                default: true
            }
        },
        data() {
            return {
                numAnim: null
            }
		},
		watch: {
			end(newv, oldv) {
				if (newv != oldv) {
					this.initCountUp();
				}
			}
		},
        mounted() {
            if (this.autoplay) {
                this.$nextTick(() => {
                    this.initCountUp();
                });
            }
        },
        methods: {
            initCountUp(){
                this.numAnim = new CountUp(this.$refs.countup, this.start, this.end, this.decimal, this.duration, this.options);
                this.numAnim.start();
            }
        }
    }
</script>
<style scoped>

</style>
