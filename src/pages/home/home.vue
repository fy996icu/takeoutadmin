<template>
  <div class="module-views">
    <div class="statistics">
      <el-row :gutter="20">
        <el-col :sm="14">
          <el-row :gutter="20" :sm="12" class="state-row">
            <el-col :xs="24" :sm="12" :lg="12" class="state-item">
              <el-row class="grid-content total-order">
                <el-card shadow="never">
                  <el-row :gutter="20">
                    <el-col class="item-icon" :span="8">
                      <i class="el-icon-document"></i>
                    </el-col>
                    <el-col class="item-num" :span="16">
                      <h4>总订单</h4>
                      <p>
                        <strong>{{totalOrder}}</strong>
                      </p>
                    </el-col>
                  </el-row>
                </el-card>
              </el-row>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="12" class="state-item">
              <el-row class="grid-content total-num">
                <el-card shadow="never">
                  <el-row :gutter="20">
                    <el-col class="item-icon" :span="8">
                      <i class="el-icon-coin"></i>
                    </el-col>
                    <el-col class="item-num" :span="16">
                      <h4>销售总额</h4>
                      <p>
                        <strong>{{totalAmount}}</strong>
                      </p>
                    </el-col>
                  </el-row>
                </el-card>
              </el-row>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="12" class="state-item">
              <el-row class="grid-content day-order">
                <el-card shadow="never">
                  <el-row :gutter="20">
                    <el-col class="item-icon" :span="8">
                      <i class="el-icon-shopping-bag-1"></i>
                    </el-col>
                    <el-col class="item-num" :span="16">
                      <h4>今日订单数</h4>
                      <p>
                        <strong>{{todayOrder}}</strong>
                      </p>
                    </el-col>
                  </el-row>
                </el-card>
              </el-row>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="12" class="state-item">
              <el-row class="grid-content day-volume">
                <el-card shadow="never">
                  <el-row :gutter="20">
                    <el-col class="item-icon" :span="8">
                      <i class="el-icon-pie-chart"></i>
                    </el-col>
                    <el-col class="item-num" :span="16">
                      <h4>今日销售额</h4>
                      <p>
                        <strong>{{totayAmount}}</strong>
                      </p>
                    </el-col>
                  </el-row>
                </el-card>
              </el-row>
            </el-col>
          </el-row>
        </el-col>
        <el-col :sm="10">
          <el-card class="box-card" shadow="never">
            <div class="text item">
              <div id="pieEchartsbox">
                <div id="dataStatsPie" v-loading="loading"></div>
              </div>
            </div>
          </el-card>
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
import elementResizeDetectorMaker from "element-resize-detector";
import { API_totaldata } from "@/api/apis";
export default {
  data() {
    return {
      loading: true,
      totalOrder: 0,
      totalAmount: 0,
      todayOrder: 0,
      totayAmount: 0,
      xData: [],
      amountData: [],
      orderData: []
    };
  },
  mounted() {
    let erd = elementResizeDetectorMaker();
    erd.listenTo(document.getElementById("Lineechartsbox"), function(element) {
      that.$nextTick(function() {
        //使echarts尺寸重置
        that.$echarts.init(document.getElementById("dataStatsLine")).resize();
      });
    });
    erd.listenTo(document.getElementById("pieEchartsbox"), function(element) {
      that.$nextTick(function() {
        //使echarts尺寸重置
        that.$echarts.init(document.getElementById("dataStatsPie")).resize();
      });
    });
    this.dataTotalShow();
  },
  methods: {
    // 数字滚动
    numRunFun(num, maxNum, item) {
      var numText = num;
      var golb;
      let that = this;
      function numSlideFun() {
          numText += 101;
          if (numText >= maxNum) {
              numText = maxNum;
              cancelAnimationFrame(golb);
          } else {
              golb = requestAnimationFrame(numSlideFun);
          }
          that[item] = numText;
      }
      numSlideFun();
    },
    // 数据统计
    dataTotalShow() {
      API_totaldata().then(res => {
        // console.log(res.data);
        this.totalOrder = res.data.totalOrder;
        this.totalAmount = res.data.totalAmount;
        this.todayOrder = res.data.todayOrder;
        this.totayAmount = res.data.totayAmount;
        this.xData = res.data.xData;
        this.orderData = res.data.orderData;
        this.amountData = res.data.amountData;
        this.drawLine();
        this.drawPie();
        this.numRunFun(0, this.totalOrder, 'totalOrder');
        this.numRunFun(0, this.totalAmount, 'totalAmount');
        this.numRunFun(0, this.todayOrder, 'todayOrder');
        this.numRunFun(0, this.totayAmount, 'totayAmount');
        this.loading = false;
      });
    },
    // 数据统计饼图
    drawPie() {
      var myChart = this.$echarts.init(document.getElementById("dataStatsPie"));
      var app = {};
      var option = null;
      var totalOrder = this.totalOrder;
      var totalAmount = this.totalAmount;
      var todayOrder = this.todayOrder;
      var totayAmount = this.totayAmount;
      var colorList = ["#6E59B0", "#6777ef", "#069FFF", "#f14283"];
      option = {
        title: {
          text: "数据总览",
          x: "58%",
          y: "center",
          textStyle: {
            color: '#98a6ad',
            fontSize: 14
          }
        },
        tooltip: {
          trigger: "item"
        },
         legend: {
            itemWidth:12,
            itemHeight:12,
            borderRadius: 20,
            type: 'scroll',
            orient: 'vertical',
            left: '5%',
            top: 'center',
            itemGap: 20,
            data: ['总订单', '销售总额', '今日订单数', '今日销售额'],
            textStyle: {
              color: '#98a6ad',
              lineHeight: 1,
            },
        },
        series: [
          {
            type: "pie",
            center: ["66%", "50%"],
            radius: ["60%", "90%"],
            clockwise: true,
            avoidLabelOverlap: true,
            hoverOffset: 8,
            itemStyle: {
              normal: {
                color: function(params) {
                  return colorList[params.dataIndex];
                }
              }
            },
            label: {
              show: false
            },
            data: [
              {
                name: "总订单",
                value: totalOrder
              },
              {
                name: "销售总额",
                value: totalAmount
              },
              {
                name: "今日订单数",
                value: todayOrder
              },
              {
                name: "今日销售额",
                value: totayAmount
              }
            ]
          }
        ]
      };
      if (option && typeof option === "object") {
        myChart.setOption(option, true);
      }
      window.onresize = function() {
        myChart.resize();
      };
    },

    // 数据统计折线图
    drawLine() {
      var myChart = this.$echarts.init(
        document.getElementById("dataStatsLine")
      );
      var app = {};
      var option = null;
      var xLineData = this.xData;
      var orderNum = this.orderData;
      var amountNum = this.amountData;
      // console.log(xLineData,orderNum,amountNum)
      option = {
        backgroundColor: "#fff",
        title: {
          left: "18px",
          top: 0,
          textStyle: {
            color: "#999",
            fontSize: 12,
            fontWeight: "400"
          }
        },
        color: ["#4D5CAE", "#069FFF"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            crossStyle: {
              color: "#999"
            },
            lineStyle: {
              type: "dashed"
            }
          }
        },
        grid: {
          left: "25",
          right: "25",
          bottom: "24",
          top: "75",
          containLabel: true
        },
        legend: {
          data: ["订单数", "销售额"],
          orient: "horizontal",
          icon: "rect",
          show: true,
          left: 20,
          top: 10
        },
        xAxis: {
          boundaryGap: false,
          type: "category",
          data: xLineData,
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          }
        },
        yAxis: {
          type: "value",
          axisLabel: {
            color: "#999",
            textStyle: {
              fontSize: 12
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#F3F4F4"
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          }
        },
        series: [
          {
            name: "订单数",
            type: "line",
            smooth: false,
            data: orderNum
          },
          {
            name: "销售额",
            type: "line",
            smooth: false,
            data: amountNum
          }
        ]
      };
      if (option && typeof option === "object") {
        myChart.setOption(option, true);
      }
      window.onresize = function() {
        myChart.resize();
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.statistics {
  .item-icon {
    margin-top: 6px;
    i {
      width: 54px;
      height: 54px;
      display: block;
      color: #fff;
      font-size: 30px;
      line-height: 54px;
      text-align: center;
      border-radius: 4px;
      overflow: hidden;
      background: #6777ef;
      box-shadow: 0 2px 6px #acb5f6;
      transition: all .3s;
      &:hover{
        border-radius: 50%;
      }
    }
  }
  .total-order {
    i {
      background: #6E59B0;
      box-shadow: 0 2px 6px #b4aec7;
    }
  }
  .total-num {
    i {
     background: #6777ef;
    }
  }
  .day-order {
    i {
      background: #069FFF;
      box-shadow: 0 2px 6px #bad0de;
    }
  }
  .day-volume {
    i {
      background: #f14283;
      box-shadow: 0 2px 6px #fbcadc;
    }
  }
  .item-num {
    text-align: right;
    h4 {
      color: #98a6ad;
      font-size: 15px;
    }
    p {
      margin-top: 20px;
      strong {
        color: $theme;
        font-size: 24px;
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

.statistics {
  .state-row {
    margin-top: -20px;
  }
  /deep/ .state-item {
    margin-top: 20px;
    .el-card__body {
      padding: 26px 20px;
    }
  }
}

#dataStatsPie {
  width: 100%;
  height: 216px;
}
</style>