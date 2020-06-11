<template>
  <el-card class="box-card" shadow="never">
    <div slot="header" class="clearfix">
      <span>商品统计</span>
    </div>
    <div class="text item">
      <div class="block">
        <span class="demonstration">时间范围</span>
        <el-date-picker
          v-model="value1"
          type="daterange"
          prefix-icon="el-icon-time"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-button type="primary" class="ml10">查询</el-button>
      </div>
      <div id="stackingEchartsBox">
        <div id="stackingEcharts" class="mt30"></div>
      </div>
    </div>
  </el-card>
</template>

<script>
  import elementResizeDetectorMaker from 'element-resize-detector';
 export default {
    data() {
      return {
        // 时间范围
        value1: ''
      };
    },
    mounted() {
      let erd = elementResizeDetectorMaker()
      erd.listenTo(document.getElementById("stackingEchartsBox"), function (element) {
        that.$nextTick(function () {
          //使echarts尺寸重置
          that.$echarts.init(document.getElementById("stackingEcharts")).resize()
        })
      })
      this.goodsStackingEcharts();
    },
    methods: {
      goodsStackingEcharts() {
        var myChart = this.$echarts.init(document.getElementById("stackingEcharts"));
        var app = {};
        var option = null;
        option = {
          backgroundColor: '#fff',
          title: {
            left: "18px",
            top: 0,
            textStyle: {
              color: "#999",
              fontSize: 12,
              fontWeight: '400'
            }
          },
          color: ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              },
              lineStyle: {
                type: 'dashed'
              }
            }
          },
          grid: {
            left: '25',
            right: '25',
            bottom: '24',
            top: '75',
            containLabel: true
          },
          legend: {
            data: ['订单数', '销售额', '注册人数', '管理员人数'],
            orient: 'horizontal',
            icon: "rect",
            show: true,
            left: 20,
            top: 10,
          },
          xAxis: {
            type: 'category',
             boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              color: '#999',
              textStyle: {
                fontSize: 12
              },
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#F3F4F4'
              }
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
          },
          series: [{
              name: '订单数',
              type: 'line',
              stack: '总量',
              areaStyle: {},
              smooth: false,
              data: [320, 60, 20, 44, 45, 322, 76]
            },
            {
              name: '销售额',
              type: 'line',
              stack: '总量',
              areaStyle: {},
              smooth: false,
              data: [100, 300, 34, 344, 35, 53, 200]
            },
            {
              name: '注册人数',
              type: 'line',
              stack: '总量',
              areaStyle: {},
              smooth: false,
              data: [170, 40, 70, 32, 123, 23, 136]
            },
            {
              name: '管理员人数',
              type: 'line',
              stack: '总量',
              areaStyle: {},
              smooth: false,
              label: {
                normal: {
                    show: true,
                    position: 'top'
                }
            },
              data: [160, 90, 20, 50, 90, 10, 136]
            }
          ]
        };
        if (option && typeof option === "object") {
          myChart.setOption(option, true);
        };
        window.onresize = function(){
            myChart.resize();
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  #stackingEcharts{
    width: 100%;
      height: 400px;
  }
</style>