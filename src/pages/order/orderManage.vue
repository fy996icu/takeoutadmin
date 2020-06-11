<template>
  <div class="module-views">
    <div class="order-manage">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span>订单管理</span>
        </div>
        <div class="text item">
          <div class="header-screen">
            <el-form ref="form" :model="SearchForm" :inline="true" label-width="80px">
              <el-form-item label="订单号">
                <el-input v-model="SearchForm.orderNum" placeholder="输入订单号"></el-input>
              </el-form-item>
              <el-form-item label="收货人">
                <el-input v-model="SearchForm.orderPep" placeholder="输入收货人"></el-input>
              </el-form-item>
              <el-form-item label="手机号">
                <el-input v-model.number="SearchForm.orderTel" placeholder="输入手机号"></el-input>
              </el-form-item>
              <el-form-item label="订单状态">
                <el-select v-model="SearchForm.orderStatus" placeholder="订单状态">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="已完成" value="已完成"></el-option>
                  <el-option label="已受理" value="已受理"></el-option>
                  <el-option label="派送中" value="派送中"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="选择时间">
                <el-date-picker
                  v-model="SearchForm.searchDate"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="getOrderList">查询</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="body-table">
            <template>
              <el-table :data="allOrderListData" border style="width: 100%">
                <el-table-column fixed prop="orderNo" label="订单号" width="200"></el-table-column>
                <el-table-column prop="orderTime" label="下单时间" width="200">
                  <template slot-scope="scope">
                    <span>{{changeTime(scope.row.orderTime)}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="phone" label="手机号" width="160"></el-table-column>
                <el-table-column prop="consignee" label="收货人" width="120"></el-table-column>
                <el-table-column prop="deliverAddress" label="配送地址" width="360"></el-table-column>
                <el-table-column prop="deliveryTime" label="送达时间" width="200">
                  <template slot-scope="scope">
                    <span>{{changeTime(scope.row.deliveryTime)}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="remarks" label="用户备注" width="200"></el-table-column>
                <el-table-column prop="orderAmount" label="订单金额" width="120"></el-table-column>
                <el-table-column prop="orderState" label="订单状态" width="120"></el-table-column>
                <el-table-column fixed="right" label="操作" width="100">
                  <template slot-scope="scope">
                    <el-button @click="getOrderDetail(scope.row.id)" type="text" size="small">查看</el-button>
                    <el-button @click="editOrderDetail(scope.row.id)" type="text" size="small">编辑</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </div>
          <div class="block table-pagination mt20">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-size="pageSize"
              :page-sizes="pageSizes"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            ></el-pagination>
          </div>
        </div>
      </el-card>
    </div>
    <el-dialog title="订单详情" :visible.sync="lookDialogForm" width="40%">
      <div>
        <span>订单号：{{lookOrderInfo.orderNo}}</span>
        <el-divider></el-divider>
        <span>下单时间：{{lookOrderInfo.orderTime}}</span>
        <el-divider></el-divider>
        <span>手机号：{{lookOrderInfo.phone}}</span>
        <el-divider></el-divider>
        <span>收货人：{{lookOrderInfo.consignee}}</span>
        <el-divider></el-divider>
        <span>配送地址：{{lookOrderInfo.deliverAddress}}</span>
        <el-divider></el-divider>
        <span>送达时间：{{lookOrderInfo.deliveryTime}}</span>
        <el-divider></el-divider>
        <span>用户备注：{{lookOrderInfo.remarks}}</span>
        <el-divider></el-divider>
        <span>订单金额：{{lookOrderInfo.orderAmount}}</span>
        <el-divider></el-divider>
        <span>订单状态：{{lookOrderInfo.orderState}}</span>
        <el-divider></el-divider>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="lookDialogForm = false">取 消</el-button>
        <el-button type="primary" @click="lookDialogForm = false">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑订单 -->
    <el-dialog title="编辑订单" :visible.sync="editDialogForm" width="40%">
      <div>
        <el-form ref="form" :model="editOrderInfo" label-width="80px">
          <el-form-item label="订单号">
            <el-input v-model="editOrderInfo.orderNo" placeholder="请输入订单号"></el-input>
          </el-form-item>
          <el-form-item label="下单时间">
            <el-date-picker
              v-model="editOrderInfo.orderTime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="editOrderInfo.phone" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="收货人">
            <el-input v-model="editOrderInfo.consignee" placeholder="请输入收货人"></el-input>
          </el-form-item>
          <el-form-item label="配送地址">
            <el-input v-model="editOrderInfo.deliverAddress" placeholder="请输入配送地址"></el-input>
          </el-form-item>
          <el-form-item label="送达时间">
            <el-date-picker
              v-model="editOrderInfo.deliveryTime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="用户备注">
            <el-input type="textarea" v-model="editOrderInfo.remarks" placeholder="请输入用户备注"></el-input>
          </el-form-item>
          <el-form-item label="订单金额">
            <el-input v-model="editOrderInfo.orderAmount" placeholder="请输入订单金额"></el-input>
          </el-form-item>
          <el-form-item label="订单状态">
            <el-select v-model="editOrderInfo.orderState" placeholder="请选择订单状态">
              <el-option label="已完成" value="已完成"></el-option>
              <el-option label="已受理" value="已受理"></el-option>
              <el-option label="派送中" value="派送中"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogForm = false">取 消</el-button>
        <el-button type="primary" @click="saveEditOrderDetail">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  API_getOrderList,
  API_getOrderDetail,
  API_editOrderDetail
} from "@/api/apis";
export default {
  data() {
    return {
      SearchForm: {
        orderNum: "",
        orderPep: "",
        orderTel: "",
        orderStatus: "",
        searchDate: []
      },
      allOrderListData: [],
      // 查看订单详情
      lookDialogForm: false,
      lookOrderInfo: {
        orderNo: "",
        orderTime: "",
        phone: "",
        consignee: "",
        deliverAddress: "",
        deliveryTime: "",
        remarks: "",
        orderAmount: "",
        orderState: ""
      },
      // 编辑数据
      editDialogForm: false,
      editOrderInfo: {
        id: '',
        orderNo: "",
        orderTime: "",
        phone: "",
        consignee: "",
        deliverAddress: "",
        deliveryTime: "",
        remarks: "",
        orderAmount: "",
        orderState: ""
      },
      currentPage: 1,
      pageSize: 5,
      pageSizes: [5, 10, 15, 20],
      total: 0
    };
  },
  mounted() {
    this.getOrderList();
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
    // 获取所有订单
    getOrderList() {
      let params = { 
        currentPage: this.currentPage, 
        pageSize: this.pageSize, 
        orderNo: this.SearchForm.orderNum,
        consignee: this.SearchForm.orderPep,
        phone: this.SearchForm.orderTel,
        orderState: this.SearchForm.orderStatus,
        date: this.SearchForm.searchDate,
      };
      API_getOrderList(params).then(res => {
        // console.log(res.data);
        this.allOrderListData = res.data.data;
        this.total = res.data.total;
      });
    },

    // 分页
    handleSizeChange(val) {
      this.pageSize = val;
      this.getOrderList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getOrderList();
    },

    // 查看订单详情
    getOrderDetail(id) {
      this.lookDialogForm = true;
      let params = { id };
      API_getOrderDetail(params).then(res => {
        this.lookOrderInfo = res.data.data;
      });
    },

    // 编辑订单
    editOrderDetail(id) {
      this.editDialogForm = true;
      let params = { id };
      API_getOrderDetail(params).then(res => {
        this.editOrderInfo = res.data.data;
        this.editOrderInfo.orderTime = this.changeTime(res.data.data.orderTime)
        this.editOrderInfo.deliveryTime = this.changeTime(res.data.data.deliveryTime)
      });
    },

    // 保存编辑
    saveEditOrderDetail(){
      let params = { 
        id: this.editOrderInfo.id,
        orderNo: this.editOrderInfo.orderNo,
        orderTime: this.editOrderInfo.orderTime,
        phone: this.editOrderInfo.phone,
        consignee: this.editOrderInfo.consignee,
        deliverAddress: this.editOrderInfo.deliverAddress,
        deliveryTime: this.editOrderInfo.deliveryTime,
        remarks: this.editOrderInfo.remarks,
        orderAmount: this.editOrderInfo.orderAmount,
        orderState: this.editOrderInfo.orderState
      };
      API_editOrderDetail(params).then(res => {
        // console.log(res.data);
        if(res.data.code == 0){
          this.$message({
            message: res.data.msg,
            type: 'success',
            duration: 1500,
            onClose: ()=>{
              this.editDialogForm = false;
              this.getOrderList();
            }
          });
        }else{
          this.$message({
            message: res.data.msg,
            type: 'error',
            duration: 1500
          });
        }
      });
    },

  }
};
</script>

<style lang="scss" scoped>
.body-table {
  margin-top: 30px;
  .table-pagination {
    margin-top: 30px;
  }
}
</style>