<template>
  <el-card class="box-card" shadow="never">
    <div slot="header" class="clearfix">
      <span>商品列表</span>
    </div>
    <div class="text item">
      <el-table :data="allGoodsListData" v-loading="loading" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="商品ID">
                <span>{{ props.row.id }}</span>
              </el-form-item>
              <el-form-item label="商品名称">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="所属分类">
                <span>{{ props.row.category }}</span>
              </el-form-item>
              <el-form-item label="商品价格">
                <span>{{ props.row.price }}</span>
              </el-form-item>
              <el-form-item label="商品图片">
                <el-avatar shape="square" :size="50" :src="props.row.imgUrl"></el-avatar>
              </el-form-item>
              <el-form-item label="创建时间">
                <span>{{ changeTime(props.row.ctime) }}</span>
              </el-form-item>
              <el-form-item label="商品评价">
                <span>{{ props.row.rating }}</span>
              </el-form-item>
              <el-form-item label="商品数量">
                <span>{{ props.row.sellCount }}</span>
              </el-form-item>
              <el-form-item label="商品描述">
                <span>{{ props.row.goodsDesc }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" prop="name" width="200"></el-table-column>
        <el-table-column label="所属分类" prop="category" width="180"></el-table-column>
        <el-table-column label="商品价格" prop="price" width="100"></el-table-column>
        <el-table-column label="商品图片" prop="imgUrl" width="150">
          <template slot-scope="scope">
            <el-avatar
              class="goodsListPic"
              shape="square"
              :size="50"
              :src="scope.row.imgUrl"
              :fit="fit"
            ></el-avatar>
          </template>
        </el-table-column>
        <el-table-column label="商品描述" prop="goodsDesc"></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEditPop(scope.$index, scope.row)">编辑</el-button>
            <el-popconfirm title="这条数据确定删除吗？" @onConfirm="handleDelete(scope.row.id)">
              <el-button slot="reference" size="mini" type="danger">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
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
    <el-dialog title="添加分类" :visible.sync="editDialogForm" width="40%">
      <el-form ref="addGoodsForm" :model="addGoodsForm" style="width: 400px;" label-width="80px">
        <el-form-item label="商品名称">
          <el-input v-model="addGoodsForm.name" placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <el-form-item label="商品分类" style="width: 280px;">
          <el-select v-model="addGoodsForm.selectValue" placeholder="请选择商品分类">
            <el-option
              v-for="(item, index) in addGoodsForm.category"
              :key="index"
              :label="item.cateName"
              :value="item.cateName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品价格">
          <template>
            <el-input-number
              v-model="addGoodsForm.price"
              :precision="2"
              :step="0.1"
              @change="priceChange"
              :min="0.1"
              label="描述文字"
            ></el-input-number>
          </template>
        </el-form-item>
        <el-form-item label="商品图片">
          <el-upload
            class="avatar-uploader"
            :action="this.server + '/goods/goods_img_upload'"
            :show-file-list="false"
            :accept="imgType"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="addGoodsForm.imageUrl" :src="addGoodsForm.imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品描述">
          <el-input type="textarea" v-model="addGoodsForm.goodsDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogForm = false">取 消</el-button>
        <el-button type="primary" @click="saveEditPop">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
import { server } from '@/servers/servers';
import { API_getGoodsList, API_goodsImgUpload, API_editGoods, API_categories, API_delGoods } from "@/api/apis";
export default {
  data() {
    return {
      server,
      fit: "cover",
      allGoodsListData: [],
      currentPage: 1,
      pageSize: 5,
      pageSizes: [5, 10, 15, 20],
      total: 0,
      piclinkheader: server + "/upload/imgs/goods_img/",
      loading: true,
      editDialogForm: false,
      formLabelWidth: "70px",
      // 修改商品的参数
      addGoodsForm: {
        name: "",
        category: [],
        price: 1,
        goodsDesc: "",
        selectValue: "",  // 当前选中的分类
        imageUrl:'',  // 原始图片
        upUrl: '', // 需要上传的图片名
        id: ''
      },
      imgType: "image/png, image/jpeg, image/gif",
      avatarUploadStatus: true, // 图片上传状态
    };
  },
  mounted() {
    this.getGoodsList();
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

    // 获取商品列表
    getGoodsList() {
      let params = { currentPage: this.currentPage, pageSize: this.pageSize };
      API_getGoodsList(params).then(res => {
        // console.log(res.data);
        this.allGoodsListData = res.data.data;
        for (let item of this.allGoodsListData) {
          item.imgUrl = this.piclinkheader + item.imgUrl;
        }
        this.total = res.data.total;
        // console.log(this.total);
        // 模拟数据很多的时候加载效果
        setTimeout(() => {
          this.loading = false;
        }, 1500);
      });
    },

    // 每页条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.getGoodsList();
    },
    // 当前页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getGoodsList();
    },

    // 删除
    handleDelete(id) {
      let params = { id };
      API_delGoods(params).then(res => {
        if (res.data.code == 0) {
          this.getGoodsList();
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
    // 编辑
    handleEditPop(index, row) {
      // 给编辑弹窗初始化值
      this.editDialogForm = true;
      this.addGoodsForm.name = row.name; 
      this.addGoodsForm.selectValue = row.category; 
      this.addGoodsForm.price = row.price; 
      this.addGoodsForm.goodsDesc = row.goodsDesc; 
      this.addGoodsForm.imageUrl = row.imgUrl; 
      this.addGoodsForm.id = row.id; 
      // 查询所有分类
      this.categories();
    },

    // 确认编辑
    saveEditPop() {
      // 如果为修改图片，则默认上传原始图
      if(!this.addGoodsForm.upUrl){
        let oldPicName = this.addGoodsForm.imageUrl.slice(this.addGoodsForm.imageUrl.lastIndexOf('/') + 1);
        this.addGoodsForm.upUrl = oldPicName;
      }
      let params = { 
        name: this.addGoodsForm.name, 
        category: this.addGoodsForm.selectValue,
        price: this.addGoodsForm.price,
        imgUrl: this.addGoodsForm.upUrl,
        goodsDesc: this.addGoodsForm.goodsDesc,
        id: this.addGoodsForm.id,
      };
      API_editGoods(params).then(res=>{
        // console.log(params)
        // console.log(res.data)
        if(res.data.code == 0){
          this.$message({
            message: res.data.msg,
            type: 'success',
            duration: 1500,
            onClose: ()=>{
              this.editDialogForm = false;
              this.getGoodsList();  // 修改成功后更新商品列表
            }
          });
          
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
    // 查询商品分类
    categories() {
      API_categories().then(res => {
        this.addGoodsForm.category = res.data.categories;
        // console.log(res.data.categories);
      });
    },
    // 商品图片上传
    handleAvatarSuccess(res, file) {
      if (this.avatarUploadStatus) {
        this.addGoodsForm.imageUrl = URL.createObjectURL(file.raw);
        // console.log(this.addGoodsForm.imageUrl);
        let params = { file: this.addGoodsForm.imageUrl };
        API_goodsImgUpload(params).then(res => {
          this.addGoodsForm.upUrl = res.data.imgUrl;
          // console.log(this.upUrl)
          this.addGoodsForm.imageUrl = this.piclinkheader + res.data.imgUrl;
          // console.log(this.addGoodsForm.imageUrl);
        });
      } else {
        return;
      }
    },
    // 上传图片前的钩子-判断文件类型
    beforeAvatarUpload(file) {
      let type = file.type;
      if (type == "image/jpeg" || type == "image/png" || type == "image/gif") {
        this.avatarUploadStatus = true;
      } else {
        this.$message.error("上传头像图片只能是 JPG、png、gif 格式!");
        this.avatarUploadStatus = false;
      }
    },
    // 商品价格监控
    priceChange(value) {
      this.$nextTick(function() {
        if (value <= 0.1) {
          this.$message({
            message: "商品价格不能低于0.1",
            type: "warning"
          });
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.goodsListPic img {
  width: 100%;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
/deep/ .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
/deep/ .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
/deep/ .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
/deep/ .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
