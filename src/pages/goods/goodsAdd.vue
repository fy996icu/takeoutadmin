<template>
  <el-card class="box-card" shadow="never">
    <div slot="header" class="clearfix">
      <span>商品添加</span>
    </div>
    <div class="text item">
      <el-form ref="addGoodsForm" :model="addGoodsForm" style="width: 400px;" label-width="80px">
        <el-form-item label="商品名称">
          <el-input v-model="addGoodsForm.name" placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <el-form-item label="商品分类" style="width: 280px;">
          <el-select v-model="addGoodsForm.selectValue" placeholder="请选择商品分类">
            <el-option v-for="(item, index) in addGoodsForm.category" :key="index" :label="item.cateName" :value="item.cateName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品价格">
          <template>
            <el-input-number v-model="addGoodsForm.price" :precision="2" :step="0.1" @change="priceChange" :min="0.1" label="描述文字"></el-input-number>
          </template>
        </el-form-item>
        <el-form-item label="商品图片">
            <el-upload
            class="avatar-uploader"
            action="http://127.0.0.1:5000/goods/goods_img_upload"
            :show-file-list="false"
            :accept="imgType"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="商品描述">
          <el-input type="textarea" v-model="addGoodsForm.goodsDesc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
import { API_addGoods, API_categories, API_goodsImgUpload} from "@/api/apis";
  export default {
    data() {
      return {
        addGoodsForm: {
          name: "",
          category: [],
          price: 1,
          goodsDesc: "",
          selectValue: ''
        },
        imageUrl:'',
        imgType: 'image/png, image/jpeg, image/gif',
        avatarUploadStatus: true,  // 图片上传状态
        returnImageUrl: ''
      };
    },
    mounted(){
      this.categories();
    },
    methods: {
      // 查询商品分类
      categories(){
        API_categories().then(res=>{
          this.addGoodsForm.category = res.data.categories;
          console.log(res.data.categories)
        })
      },
      // 商品图片上传
      handleAvatarSuccess(res, file) {
        if(this.avatarUploadStatus){
          this.imageUrl = URL.createObjectURL(file.raw);
          console.log(this.imageUrl)
          let params = {file: this.imageUrl}
          API_goodsImgUpload(params).then(res=>{
            this.returnImageUrl = res.data.imgUrl;
            console.log(this.returnImageUrl)
          })
        }else{
          return;
        }
      },
      // 上传图片前的钩子-判断文件类型
      beforeAvatarUpload(file) {
        let type = file.type;
        if( type == 'image/jpeg' || type == 'image/png' || type == 'image/gif'){
          this.avatarUploadStatus = true;
        }else{
          this.$message.error('上传头像图片只能是 JPG、png、gif 格式!');
          this.avatarUploadStatus = false;
        }
      },
    
      // 商品添加
      addGoods() {
        let params = { name: this.addGoodsForm.name, category: this.addGoodsForm.selectValue, price: this.addGoodsForm.price, imgUrl: this.returnImageUrl, goodsDesc: this.addGoodsForm.goodsDesc};
        console.log(params)
        console.log(params.imgUrl)
        API_addGoods(params).then(res=>{
           if(res.data.code == 0){
            this.$message({
              showClose: true,
              message: res.data.msg,
              type: 'success',
              duration: 1500
            });
            this.dialogFormVisible = false;
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

      // 商品价格监控
      priceChange(value) {
        this.$nextTick(function() {
          if (value <= 0.1) {
            this.$message({
              message: '商品价格不能低于0.1',
              type: 'warning'
            });
          }
        })
      },
     
    }
  };
</script>

<style lang="scss">
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }
  .avatar {
    width: 120px;
    height: 120px;
    display: block;
  }
</style>