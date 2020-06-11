<template>
  <el-card class="box-card" shadow="never">
    <div slot="header" class="clearfix">
      <span>账号列表</span>
    </div>
    <div class="text item">
      <template>
        <el-table
          v-loading="loading"
          ref="multipleTable"
          :data="userListData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="account" label="账号" width="250">
            <template slot-scope="scope">
              <span v-if="scope.row.vVisible">{{scope.row.account}}</span>
              <el-input v-else v-model="scope.row.account" size="mini" @blur="checkAccount(scope.row.account)"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="userGroup" label="用户组" width="200">
            <template slot-scope="scope">
              <span v-if="scope.row.vVisible">{{scope.row.userGroup}}</span>
              <el-select v-else v-model="scope.row.userGroup" size="mini">
                <el-option label="普通管理员" value="普通管理员"></el-option>
                <el-option label="超级管理员" value="超级管理员"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="ctime" label="创建时间" width="250">
            <template slot-scope="scope">
              <span>{{changeTime(scope.row.ctime)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" v-if="scope.row.vVisible" :disabled="isDisabled" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="mini" v-else type="success" @click="handleEditSave(scope.$index, scope.row)">完成</el-button>
              <el-popconfirm title="这条数据确定删除吗？" @onConfirm="userDelete(scope.row.id)">
                <el-button slot="reference" size="mini" type="danger" :disabled="isDisabled">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <div class="block table-pagination mt20">
          <el-pagination
            :disabled="isDisabled"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            :page-sizes="pageSizes"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
        <div style="margin-top: 20px">
          <el-button type="danger" :disabled="isDisabled" @click="batchDelete()">批量删除</el-button>
          <el-button :disabled="isDisabled" @click="cancelSelection()">取消选择</el-button>
        </div>
      </template>
    </div>
  </el-card>
</template>

<script>
import { API_getUserList, API_deleteUser, API_batchdel, API_editAccount, API_checkAccountRepeat } from "@/api/apis";
export default {
  data() {
    return {
      userListData: [],
      multipleSelection: '[]', // 多选-批量删除
      ctime: "",
      currentPage: 1,
      pageSize: 5,
      pageSizes: [5, 10, 15, 20],
      total: 0,
      loading: true,
      isDisabled: false, // 禁用元素
      checkAccountStatus: true
    };
  },

  mounted() {
    this.getUserList();
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
    // 获取用户列表
    getUserList() {
      let params = { currentPage: this.currentPage, pageSize: this.pageSize };
      API_getUserList(params).then(res => {
        this.userListData = res.data.data;
        for(let item of this.userListData){
          item.vVisible = true;
        };
        this.total = res.data.total;
        // 模拟数据很多的时候加载效果
        setTimeout(() => {
          this.loading = false;
        }, 1500);
      });
    },

    // 每页条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.getUserList();
    },

    // 当前页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getUserList();
    },

    // 删除
    userDelete(id) {
      let params = { id };
      API_deleteUser(params).then(res => {
        console.log(res.data);
        if (res.data.code == 0) {
          this.getUserList();
          this.$message({
            showClose: true,
            message: res.data.msg,
            type: "success",
            duration: 1500
          });
        } else {
          this.$message({
            showClose: true,
            message: res.data.msg,
            type: "error",
            duration: 1500
          });
        }
      });
    },

    // 批量删除
    batchDelete() {
      let params = { ids: this.multipleSelection };
      console.log(this.multipleSelection);
      if(JSON.parse(this.multipleSelection).length < 1){
        this.$message({
          showClose: true,
          message: '请至少选择一个删除对象',
          type: "warning",
          duration: 1500
        });
        return;
      };
      this.$confirm("删除后不可恢复，确认删除？")
        .then(_ => {
          API_batchdel(params).then(res => {
            if (res.data.code == 0) {
              this.$message({
                showClose: true,
                message: res.data.msg,
                type: "success",
                duration: 1500
              });
              this.getUserList();
            } else {
              this.$message({
                showClose: true,
                message: res.data.msg,
                type: "error",
                duration: 1500
              });
            }
          });
        })
        .catch(_ => {
          return
        });
    },

    // 选择监听
    handleSelectionChange(val) {
      let arr = [];
      for (let item of val) {
        arr.push(item.id);
      }
      this.multipleSelection = JSON.stringify(arr);
    },

    // 取消选择
    cancelSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.multipleSelection = [];
        this.$refs.multipleTable.clearSelection();
      }
    },

    // 编辑
    handleEdit(index, row) {
      row.vVisible = false;
      this.isDisabled = true;
    },

    // 验证用户是否重名
    checkAccount(account){
      if(account === ''){
        this.$message.error('账号名不能为空!');
        this.checkAccountStatus = false;
      }else{
        if ((/[\W]/g.test(account))) {
          this.$message.error('账号名只能是数字或字母!');
          this.checkAccountStatus = false;
        } else {
          // 检测用户是否重名
          let params = {account: account};
          API_checkAccountRepeat(params).then(res=>{
            if(res.data.code == 0){
              this.checkAccountStatus = true;
            }else{
              this.$message.error(res.data.msg);
              this.checkAccountStatus = false;
            }
          })
        }
      }
    },

    // 编辑完成
    handleEditSave(index, row){
      if(this.checkAccountStatus){
        let params = { id: row.id, account: row.account, userGroup: row.userGroup };
        API_editAccount(params).then((res)=>{
          if(res.data.code == 0){
            this.$message({
              message: res.data.msg,
              type: 'success',
              duration: 1500
            });
            row.vVisible = true;
            this.isDisabled = false;
  
          }else{
            this.$message({
              showClose: true,
              message: res.data.msg,
              type: 'error',
              duration: 1500
            });
          }
        })
      }else{
        this.$message.error('请重新设置账号名！');
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>