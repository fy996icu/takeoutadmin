<template>
  <div class="echarts-main">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span>销售统计</span>
          </div>
          <div class="text item">
            <div id="stackingEchartsBox">
              <div id="stackingEcharts"></div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span>店铺评价</span>
          </div>
          <div class="text item">
            <div id="radarEchartsBox">
              <div id="radarEcharts"></div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="mt20">
      <el-col :col="24">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span>全国店铺分布</span>
          </div>
          <div class="text item">
            <div id="shopSpreadMapBox">
              <div id="shopSpreadMap"></div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import elementResizeDetectorMaker from "element-resize-detector";
import "echarts/map/js/china.js";
import "echarts/extension-src/bmap/bmap.js";
export default {
  mounted() {
    let erd = elementResizeDetectorMaker();
    erd.listenTo(document.getElementById("stackingEchartsBox"), function(
      element
    ) {
      that.$nextTick(function() {
        //使echarts尺寸重置
        that.$echarts.init(document.getElementById("stackingEcharts")).resize();
      });
    });
    erd.listenTo(document.getElementById("radarEchartsBox"), function(
      element
    ) {
      that.$nextTick(function() {
        //使echarts尺寸重置
        that.$echarts.init(document.getElementById("radarEcharts")).resize();
      });
    });
    erd.listenTo(document.getElementById("shopSpreadMapBox"), function(
      element
    ) {
      that.$nextTick(function() {
        //使echarts尺寸重置
        that.$echarts.init(document.getElementById("shopSpreadMap")).resize();
      });
    });
    this.goodsStackingEcharts();
    this.goodsRadarEcharts();
    this.shopSpreadMap();
  },
  methods: {
    // 柱状图
    goodsStackingEcharts() {
      var myChart = this.$echarts.init(
        document.getElementById("stackingEcharts")
      );
      var app = {};
      var option = null;
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
            type: "shadow",
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
          type: "category",
          data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
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
            type: "bar",
            areaStyle: {},
            smooth: false,
            data: [320, 60, 20, 44, 45, 322, 76]
          },
          {
            name: "销售额",
            type: "bar",
            areaStyle: {},
            smooth: false,
            data: [100, 300, 34, 344, 35, 53, 200]
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
    // 雷达图
    goodsRadarEcharts() {
      var myChart = this.$echarts.init(document.getElementById("radarEcharts"));
      var app = {};
      var option = null;
      option = {
        tooltip: {
          show: true,
          trigger: "item",
          padding: [5, 10],
          formatter: function(params) {
            let parm = [
              {
                name: "食品分量",
                max: 10
              },
              {
                name: "菜品多样性",
                max: 10
              },
              {
                name: "配送速度",
                max: 10
              },
              {
                name: "服务态度",
                max: 10
              },
              {
                name: "食品口味",
                max: 10
              },
              {
                name: "食品卫生",
                max: 10
              }
            ];
            let obj = "";
            for (let i = 0; i < parm.length; i++) {
              obj =
                obj +
                '<div style="display: flex;align-items:center;justify-content:space-between;"><span>' +
                parm[i].name +
                '：</span><span style="margin-left:5px">' +
                params.data.value[i] +
                "分</span></div>\n";
            }
            return params.seriesName + obj;
          }
        },
        legend: {
          show: false
        },
        radar: {
          // shape: 'circle',
          splitNumber: 4,
          name: {
            textStyle: {
              color: "#fff",
              backgroundColor: "#999",
              borderRadius: 3,
              padding: [5, 5]
            }
          },
          indicator: [
            {
              name: "食品分量",
              max: 10
            },
            {
              name: "菜品多样性",
              max: 10
            },
            {
              name: "配送速度",
              max: 10
            },
            {
              name: "服务态度",
              max: 10
            },
            {
              name: "食品口味",
              max: 10
            },
            {
              name: "食品卫生",
              max: 10
            }
          ]
        },
        series: [
          {
            name: "综合评价",
            type: "radar",
            areaStyle: {
              normal: {
                width: 1,
                opacity: 0.7
              }
            },
            data: [
              {
                itemStyle: {
                  normal: {
                    color: "#4D5CAE",
                    lineStyle: {
                      color: "#4D5CAE"
                    }
                  }
                },
                value: [5, 5, 8, 9, 9, 8]
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
    // 地图
    shopSpreadMap() {
      var myChart = this.$echarts.init(
        document.getElementById("shopSpreadMap")
      );
      var app = {};
      var option = null;
      var mapName = "china";
      var data = [
        { name: "四川", value: 199 },
        { name: "北京", value: 180 },
        { name: "上海", value: 90 },
        { name: "青海", value: 100 },
        { name: "湖北", value: 150 },
        { name: "陕西", value: 120 },
        { name: "广西", value: 130 },
        { name: "江西", value: 80 },
        { name: "重庆", value: 60 },
        { name: "山东", value: 140 },
        { name: "云南", value: 0 },
        { name: "天津", value: 0 },
        { name: "河北", value: 0 },
        { name: "山西", value: 0 },
        { name: "内蒙古", value: 0 },
        { name: "辽宁", value: 0 },
        { name: "吉林", value: 0 },
        { name: "黑龙江", value: 0 },
        { name: "江苏", value: 0 },
        { name: "浙江", value: 0 },
        { name: "安徽", value: 0 },
        { name: "福建", value: 0 },
        { name: "河南", value: 0 },
        { name: "湖南", value: 0 },
        { name: "贵州", value: 0 },
        { name: "西藏", value: 0 },
        { name: "甘肃", value: 0 },
        { name: "宁夏", value: 0 },
        { name: "广东", value: 0 },
        { name: "海南", value: 0 }
      ];
      var yData = [];
      var barData = [];

      for (var i = 0; i < 10; i++) {
        barData.push(data[i]);
        yData.push(i + data[i].name);
      }
      var geoCoordMap = {};

      /*获取地图数据*/
      myChart.showLoading();
      var mapFeatures = this.$echarts.getMap(mapName).geoJson.features;
      myChart.hideLoading();
      mapFeatures.forEach(function(v) {
        // 地区名称
        var name = v.properties.name;
        // 地区经纬度
        geoCoordMap[name] = v.properties.cp;
      });

      var max = 480,
        min = 9; // todo
      var maxSize4Pin = 100,
        minSize4Pin = 20;
      var convertData = function(data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
          var geoCoord = geoCoordMap[data[i].name];
          if (geoCoord) {
            res.push({
              name: data[i].name,
              value: geoCoord.concat(data[i].value)
            });
          }
        }
        return res;
      };
      option = {
        tooltip: {
          trigger: "item",
          formatter: function(params) {
            return params.name + " : " + params.value;
          }
        },
        geo: {
          show: true,
          map: mapName,
          left: 50,
          zoom: 1.2, //当前视角的缩放比例
          roam: false, //是否开启平游或缩放
          scaleLimit: {
            //滚轮缩放的极限控制
            min: 1,
            max: 2
          },
          label: {
            normal: {
              show: false
            },
            emphasis: {
              show: false
            }
          },
          itemStyle: {
            normal: {
              areaColor: "#4D5CAE",
              borderColor: "#f8f8f8"
            },
            emphasis: {
              areaColor: "#293C55"
            }
          }
        },
        grid: {
          right: 10,
          top: 50,
          bottom: 50,
          width: "25%"
        },
        xAxis: {
          show: false
        },
        yAxis: {
          type: "category",
          inverse: true,
          nameGap: 16,
          axisLine: {
            show: false,
            lineStyle: {
              color: "#ddd"
            }
          },
          axisTick: {
            show: false,
            lineStyle: {
              color: "#ddd"
            }
          },
          axisLabel: {
            interval: 0,
            margin: 85,
            textStyle: {
              color: "#455A74",
              align: "left",
              fontSize: 14
            },
            rich: {
              a: {
                color: "#fff",
                backgroundColor: "#F14283",
                width: 20,
                height: 20,
                align: "center",
                borderRadius: 2
              },
              b: {
                color: "#fff",
                backgroundColor: "#4D5CAE",
                width: 20,
                height: 20,
                align: "center",
                borderRadius: 2
              }
            },
            formatter: function(params) {
              if (parseInt(params.slice(0, 1)) < 3) {
                return [
                  "{a|" +
                    (parseInt(params.slice(0, 1)) + 1) +
                    "}" +
                    "  " +
                    params.slice(1)
                ].join("\n");
              } else {
                return [
                  "{b|" +
                    (parseInt(params.slice(0, 1)) + 1) +
                    "}" +
                    "  " +
                    params.slice(1)
                ].join("\n");
              }
            }
          },
          data: yData
        },
        series: [
          {
            type: "map",
            map: mapName,
            geoIndex: 0,
            label: {
              normal: {
                show: true
              },
              emphasis: {
                show: false,
                textStyle: {
                  color: "#fff"
                }
              }
            },
            itemStyle: {
              normal: {
                areaColor: "#031525",
                borderColor: "#3B5077"
              },
              emphasis: {
                areaColor: "#2B91B7"
              }
            },
            animation: false,
            data: data
          },

          {
            type: "effectScatter",
            coordinateSystem: "geo",
            data: convertData(
              data
                .sort(function(a, b) {
                  return b.value - a.value;
                })
                .slice(0, 10)
            ),
            symbolSize: function(val) {
              return val[2] / 10;
            },
            showEffectOn: "render",
            rippleEffect: {
              brushType: "stroke"
            },
            hoverAnimation: true,
            label: {
                show: false,
              normal: {
                show: false,
                formatter: "{a}",
                position: "left",
              }
            },
            itemStyle: {
              normal: {
                color: "yellow",
                shadowBlur: 10,
                shadowColor: "yellow"
              }
            },
            zlevel: 1
          },
          {
            name: "barSer",
            type: "bar",
            roam: false,
            visualMap: false,
            zlevel: 2,
            barMaxWidth: 10,
            barGap: 0,
            itemStyle: {
              normal: {
                color: function(params) {
                  // build a color map as your need.
                  var colorList = [
                    {
                      colorStops: [
                        {
                          offset: 0,
                          color: "#F14283" // 0% 处的颜色
                        },
                        {
                          offset: 1,
                          color: "#F14283" // 100% 处的颜色
                        }
                      ]
                    },
                    {
                      colorStops: [
                        {
                          offset: 0,
                          color: "#4D5CAE" // 0% 处的颜色
                        },
                        {
                          offset: 1,
                          color: "#4D5CAE" // 100% 处的颜色
                        }
                      ]
                    }
                  ];
                  if (params.dataIndex < 3) {
                    return colorList[0];
                  } else {
                    return colorList[1];
                  }
                },
                barBorderRadius: 2
              }
            },
            data: barData
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
#stackingEcharts,
#radarEcharts {
  width: 100%;
  height: 350px;
}
#shopSpreadMap {
  width: 100%;
  height: 450px;
}
</style>