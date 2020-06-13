
<template>
  <el-card class="box-card" shadow="never">
    <div slot="header">
      <span>商品分类</span>
      <el-button class="rg" type="primary" size="small" @click="dialogFormVisible = true" :disabled="isDisabled">添加分类</el-button>
    </div>
    <div class="text item">
    <template>
      <el-table :data="goodsTypeList" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="序号" width="180"></el-table-column>
        <el-table-column prop="cateName" label="分类名称" width="250">
          <template slot-scope="scope">
            <span v-if="scope.row.vVisible">{{scope.row.cateName}}</span>
            <el-input v-else v-model="scope.row.cateName" size="mini"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="是否启用">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.state" :disabled="scope.row.enable" active-color="#4D5CAE" inactive-color="#DCDFE6">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" v-if="scope.row.vVisible" @click="handleEdit(scope.$index, scope.row)" :disabled="isDisabled">编辑</el-button>
            <el-button size="mini" v-else type="success" @click="handleEditSuccess(scope.$index, scope.row)">完成</el-button>
            <el-popconfirm title="这条数据确定删除吗？" @onConfirm="handleDelete(scope.$index, scope.row)">
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
    </template>
  </div>
  <el-dialog title="添加分类" :visible.sync="dialogFormVisible" width="40%">
  <el-form :model="addGoodsTypeForm" ref="addGoodsTypeForm">
    <el-form-item label="分类名称" :label-width="formLabelWidth">
      <el-input v-model="addGoodsTypeForm.goodsTypeName" autocomplete="off" placeholder="请输入分类名称"></el-input>
    </el-form-item>
    <el-form-item label="是否启用" :label-width="formLabelWidth">
      <template>
        <el-switch v-model="addGoodsTypeForm.addenable" active-color="#4D5CAE" inactive-color="#DCDFE6">
        </el-switch>
      </template>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="addcate">确 定</el-button>
  </div>
</el-dialog>
  </el-card>
</template>
<script>
import {API_catelist, API_editcate, API_delcate, API_addcate} from '@/api/apis';
  export default {
    data() {
      return {
        goodsTypeList: [],
        dialogFormVisible: false,
        addenable: true,
        isDisabled: false,
        currentPage: 1,
        pageSize: 5,
        pageSizes: [5, 10, 15, 20],
        total: 0,
        loading: true,
        addGoodsTypeForm: {
          goodsTypeName: '',
          addenable: true
        },
        formLabelWidth: '70px'
      }
    },
    mounted(){
      this.getGoodsTypeList();
    },
    methods: {
      // 获取分类
      getGoodsTypeList(){
        let params = { currentPage: this.currentPage, pageSize: this.pageSize };
        API_catelist(params).then(res=>{
          console.log(res.data);
          this.goodsTypeList = res.data.data
          for(let item of this.goodsTypeList){
            item.vVisible = true;
            item.enable = true;
            item.state == 1 ? item.state = true : item.state = false;
          };
          this.total = res.data.total;
          // 模拟数据很多的时候加载效果
          setTimeout(() => {
            this.loading = false;
          }, 1000);
        })
      },

      // 每页条数
      handleSizeChange(val) {
        this.pageSize = val;
        this.getGoodsTypeList();
      },

      // 当前页
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getGoodsTypeList();
      },

      // 编辑
      handleEdit(index, row) {
        row.vVisible = false;
        this.isDisabled = true;
        row.enable = false;
      },
      // 编辑完成
       handleEditSuccess(index, row){
         let params = { id: row.id, cateName: row.cateName, state: row.state };
         API_editcate(params).then(res=>{
           if(res.data.code == 0){
            this.$message({
              message: res.data.msg,
              type: 'success',
              duration: 1500
            });
            row.vVisible = true;
            this.isDisabled = false;
            row.enable = true;
           }else{
             this.$message({
              showClose: true,
              message: res.data.msg,
              type: 'error',
              duration: 1500
            });
           }
         })
        
      },

      // 删除分类
      handleDelete(index, row) {
        let params = { id: row.id};
        API_delcate(params).then(res=>{
          if (res.data.code == 0) {
          this.getGoodsTypeList();
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
        })
        console.log(index, row);
      },

      // 添加分类
      addcate(){
        let params = { cateName: this.addGoodsTypeForm.goodsTypeName, state: this.addGoodsTypeForm.addenable};
        API_addcate(params).then(res=>{
          if(res.data.code == 0){
            this.$message({
              message: res.data.msg,
              type: 'success',
              duration: 1500
            });
            this.dialogFormVisible = false;
            this.getGoodsTypeList();
           }else{
             this.$message({
              showClose: true,
              message: res.data.msg,
              type: 'error',
              duration: 1500
            });
           }
        })
      },
    }
  };
</script>

<style lang="scss">

</style>