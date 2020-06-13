<template>
  <el-card class="box-card" shadow="never">
    <div slot="header" class="clearfix">
      <span>订单统计</span>
    </div>
    <div class="text item">
      <div class="block">
        <span class="demonstration">时间范围</span>
        <el-date-picker 
        v-model="defaultdateSelect" 
        type="datetimerange" 
        format="yyyy-MM-dd HH:mm:ss"
        value-format="yyyy-MM-dd HH:mm:ss"
        prefix-icon="el-icon-time" 
        range-separator="至" 
        start-placeholder="开始日期" 
        end-placeholder="结束日期">
        </el-date-picker>
        <el-button type="primary" class="ml10" @click="getOrderdata">查询</el-button>
      </div>
      <div id="orderStackingEchartsBox">
        <div id="orderStackingEcharts" class="mt30"></div>
      </div>
    </div>
  </el-card>
</template>

<script>
  import elementResizeDetectorMaker from 'element-resize-detector';
  import {API_ordertotal} from '@/api/apis';
  export default {
    data() {
      return {
        // 时间范围
        defaultdateSelect: ["2020-06-04 00:00:00", "2020-06-27 00:00:00"],
        orderTime: [],
        orderAmount: []
       
      };
    },
    mounted() {
      let erd = elementResizeDetectorMaker()
      erd.listenTo(document.getElementById("orderStackingEchartsBox"), function (element) {
        that.$nextTick(function () {
          //使echarts尺寸重置
          that.$echarts.init(document.getElementById("orderStackingEcharts")).resize()
        })
      })
      this.getOrderdata();
    },
    methods: {
      // 时间转换
      changeTime(date) {
        var date = new Date(date);
        var YY = date.getFullYear() + "-";
        var MM =
          (date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1) + "-";
        var DD = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var hh =
          (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
        var mm =
          (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
          ":";
        var ss =
          date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        return YY + MM + DD + " " + hh + mm + ss;
      },
      // 获取订单统计数据
      getOrderdata(){
        let params = { date: JSON.stringify(this.defaultdateSelect)};
        let arrorderTime = [];
        let arrorderAmount = [];
        API_ordertotal(params).then(res=>{
          // console.log(res.data.data);
          for(let item of res.data.data){
            arrorderTime.push(this.changeTime(item.orderTime))
            arrorderAmount.push(item.orderAmount)
          }
          this.orderTime = arrorderTime;
          this.orderAmount = arrorderAmount;
          // console.log(this.orderTime);
          // console.log(this.orderAmount);
          this.orderStackingEcharts();
        })
      },
      // 订单统计折线图
      orderStackingEcharts() {
        var myChart = this.$echarts.init(document.getElementById("orderStackingEcharts"));
        var app = {};
        var option = null;
        var barWidth = 20;
        var orderTime = this.orderTime;
        var orderAmount = this.orderAmount;
        // console.log(orderTime)
        // console.log(orderAmount)
        option = {
          color: ['#4D5CAE', '#F56C6C', '#E6A23C'],
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
            left: '45',
            right: '45',
            bottom: '24',
            top: '75',
            containLabel: true
          },
          legend: {
            data: ['订单金额', '下单时间'],
            show: true,
            left: 'center',
            top: 10,
          },
          xAxis: [{
             type: 'category',
            boundaryGap: true,
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            data: orderTime
          }],
          yAxis: [{
            type: 'value',
            name: '订单金额',
            min: 0,
            position: 'left',
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
          }],
          series: [{
            name: '订单金额',
            type: 'line',
            label: {
              normal: {
                show: true,
                color: '#666',
                position: 'top',
              }
            },
            lineStyle: {
              normal: {
                width: 2,
                shadowColor: 'rgba(0,0,0,0.4)',
                shadowBlur: 10,
                shadowOffsetY: 10
              }
            },
            data: orderAmount
          }]
        };
       
        if (option && typeof option === "object") {
          myChart.setOption(option, true);
        };
        window.onresize = function() {
          myChart.resize();
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  #orderStackingEcharts {
    width: 100%;
    height: 400px;
  }
</style>