<template>
  <div class="module-views">
    <div class="statistics">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :lg="6">
          <el-row class="grid-content total-order">
            <el-card shadow="never">
              <el-row :gutter="20">
                <el-col class="item-icon" :span="8">
                  <i class="el-icon-document"></i>
                </el-col>
                <el-col class="item-num" :span="16">
                  <h4>总订单</h4>
                  <p><strong>{{totalOrder}}</strong></p>
                </el-col>
              </el-row>
            </el-card>
          </el-row>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="6">
          <el-row class="grid-content total-num">
            <el-card shadow="never">
              <el-row :gutter="20">
                <el-col class="item-icon" :span="8">
                  <i class="el-icon-coin"></i>
                </el-col>
                <el-col class="item-num" :span="16">
                  <h4>销售总额</h4>
                  <p><strong>{{totalAmount}}</strong></p>
                </el-col>
              </el-row>
            </el-card>
          </el-row>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="6">
          <el-row class="grid-content day-order">
            <el-card shadow="never">
              <el-row :gutter="20">
                <el-col class="item-icon" :span="8">
                  <i class="el-icon-shopping-bag-1"></i>
                </el-col>
                <el-col class="item-num" :span="16">
                  <h4>今日订单数</h4>
                  <p><strong>{{todayOrder}}</strong></p>
                </el-col>
              </el-row>
            </el-card>
          </el-row>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="6">
          <el-row class="grid-content day-volume">
            <el-card shadow="never">
              <el-row :gutter="20">
                <el-col class="item-icon" :span="8">
                  <i class="el-icon-pie-chart"></i>
                </el-col>
                <el-col class="item-num" :span="16">
                  <h4>今日销售额</h4>
                  <p><strong>{{totayAmount}}</strong></p>
                </el-col>
              </el-row>
            </el-card>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div class="data-stats">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span>数据统计</span>
        </div>
        <div class="text item">
          <div id="Lineechartsbox">
            <div id="dataStatsLine" v-loading="loading"></div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
  import elementResizeDetectorMaker from 'element-resize-detector';
  import {API_totaldata} from '@/api/apis';
  export default {
    data(){
      return {
        loading: true,
        totalOrder: 0,
        totalAmount: 0,
        todayOrder: 0,
        totayAmount: 0,
        xData:[],
        amountData:[],
        orderData:[]
      }
    },
    mounted() {
      let erd = elementResizeDetectorMaker()
      erd.listenTo(document.getElementById("Lineechartsbox"), function (element) {
        that.$nextTick(function () {
          //使echarts尺寸重置
          that.$echarts.init(document.getElementById("dataStatsLine")).resize()
        })
      })
      this.dataTotalShow();
    },
    methods: {
      // 数据统计
      dataTotalShow(){
        API_totaldata().then(res=>{
          // console.log(res.data);
          this.totalOrder = res.data.totalOrder;
          this.totalAmount = res.data.totalAmount;
          this.todayOrder = res.data.todayOrder;
          this.totayAmount = res.data.totayAmount;
          this.xData = res.data.xData;
          this.orderData = res.data.orderData;
          this.amountData = res.data.amountData;
          this.drawLine();
          this.loading = false;
        })
      },

      // 数据统计折线图
      drawLine() {
        var myChart = this.$echarts.init(document.getElementById("dataStatsLine"));
        var app = {};
        var option = null;
        var xLineData = this.xData;
        var orderNum = this.orderData;
        var amountNum = this.amountData;
        // console.log(xLineData,orderNum,amountNum)
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
            data: ['订单数', '销售额'],
            orient: 'horizontal',
            icon: "rect",
            show: true,
            left: 20,
            top: 10,
          },
          xAxis: {
            boundaryGap: false,
            type: 'category',
            data: xLineData,
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
              smooth: false,
              data: orderNum
            },
            {
              name: '销售额',
              type: 'line',
              smooth: false,
              data: amountNum
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
  .statistics {
    .item-icon {
      margin-top: 12px;
      i {
        font-size: 40px;
      }
    }
    .total-order {
      i {
        color: #409EFF;
      }
    }
    .total-num {
      i {
        color: #67C23A;
      }
    }
    .day-order {
      i {
        color: #E6A23C;
      }
    }
    .day-volume {
      i {
        color: #F56C6C;
      }
    }
    .item-num {
      text-align: right;
      h4 {
        color: #999;
        font-size: 18px;
        font-weight: normal;
      }
      p {
        margin-top: 10px;
        strong {
          color: #333;
          font-size: 26px;
        }
      }
    }
  }
  .data-stats {
    margin-top: 20px;
  }
  #dataStatsLine {
    width: 100%;
    height: 400px;
  }
</style>