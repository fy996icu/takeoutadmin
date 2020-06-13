<template>
  <el-card class="box-card" shadow="never">
    <div slot="header" class="clearfix">
      <span>店铺管理</span>
    </div>
    <div class="text item">
      <el-form ref="form" :model="shopForm" style="width: 500px;" label-width="80px">
        <el-form-item label="店铺名称">
          <el-input v-model="shopForm.name" placeholder="请输入店铺名称"></el-input>
        </el-form-item>
        <el-form-item label="店铺公告">
          <el-input type="textarea" autosize v-model="shopForm.notice"></el-input>
        </el-form-item>
        <el-form-item label="店铺头像">
          <el-upload
            class="avatar-uploader"
            :action="this.uploadAPI"
            :accept="imgType"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforePicUpload">
            <img v-if="shopForm.shopHeaderUrl" :src="shopForm.shopHeaderUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="店铺图片">
          <el-upload
            :action="this.uploadAPI"
            :accept="imgType"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="pics"
            :on-success="uploadPicsSuccessList"
            :before-upload="beforePicUpload"
            list-type="picture-card">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="curpics" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="配送费">
          <el-input v-model="shopForm.delivery" placeholder="请输入配送费"></el-input>
        </el-form-item>
        <el-form-item label="配送时间">
          <el-input v-model="shopForm.time" placeholder="请输入配送时间"></el-input>
        </el-form-item>
        <el-form-item label="配送描述">
          <el-input v-model="shopForm.desc" placeholder="请输入配送描述"></el-input>
        </el-form-item>
        <el-form-item label="店铺评分">
          <el-input v-model="shopForm.score" placeholder="请输入店铺评分"></el-input>
        </el-form-item>
        <el-form-item label="销量">
          <el-input v-model="shopForm.volume" placeholder="请输入销量"></el-input>
        </el-form-item>
        <el-form-item label="起送价">
          <el-input v-model="shopForm.minPrice" placeholder="请输入起送价"></el-input>
        </el-form-item>
        <el-form-item label="活动">
          <el-checkbox-group v-model="shopForm.active">
            <el-checkbox label="在线支付满28减5" name="type"></el-checkbox>
            <el-checkbox label="VC无限橙果汁全场8折" name="type"></el-checkbox>
            <el-checkbox label="单人精彩套餐" name="type"></el-checkbox>
            <el-checkbox label="特价饮品8折抢购" name="type"></el-checkbox>
            <el-checkbox label="单人特色套餐" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="营业时间">
          <el-time-picker
            is-range
            v-model="shopForm.businessTime"
            format="HH:mm:ss"
            value-format="HH:mm:ss"
            range-separator="至"
            start-placeholder="营业时间"
            end-placeholder="打烊时间"
            placeholder="选择营业时间段">
          </el-time-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="shopInfoEdit">保存设置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
import { server } from '@/servers/servers';
import {API_getShopInfo, API_shopInfoEdit} from '@/api/apis';
  export default {
    data() {
      return {
        server,
        uploadAPI: server + '/shop/upload',
        piclinkheader: server + '/upload/shop/',
        pics: [],
        curpics:'',
        imgparams: [], // 上传的图片列表
        imgparamsHaeder: '', // 上传的图片头像
        shopForm: {
          id: '',
          name: '',
          notice: '',
          shopHeaderUrl: '',
          delivery: '',
          time: '',
          desc: '',
          score: 0,
          volume: 0,
          minPrice: 0,
          active: [],
          businessTime: [],
        },
        goodsPrice: 1,
        dialogVisible: false,
        imgType: 'image/png, image/jpeg, image/gif', // 上传图片类型
        avatarUploadStatus: true,  // 头像图片上传状态
        picsUploadStatus: true  // 图片列表上传状态
      };
    },
    mounted(){
      this.getShopInfo();
    },
    methods: {

      // 获取店铺详情
      getShopInfo(){
        API_getShopInfo().then(res=>{
          let newArrPics = [];
          // console.log(res.data.data);
          this.shopForm.id = res.data.data.id;
          this.shopForm.name = res.data.data.name;
          this.shopForm.notice = res.data.data.bulletin;
          this.shopForm.shopHeaderUrl = this.piclinkheader + res.data.data.avatar;
          this.pics = newArrPics;
          this.shopForm.delivery = res.data.data.deliveryPrice;
          this.shopForm.time = res.data.data.deliveryTime;
          this.shopForm.desc = res.data.data.description;
          this.shopForm.score = res.data.data.score;
          this.shopForm.volume = res.data.data.sellCount;
          this.shopForm.active = res.data.data.supports;
          this.shopForm.businessTime = res.data.data.date;
          this.shopForm.minPrice = res.data.data.minPrice;
          for(let item of res.data.data.pics){
            newArrPics.push({url: this.piclinkheader + item})
          }

          this.imgparamsHaeder = res.data.data.avatar;
          this.imgparams = res.data.data.pics;
          // console.log('xin',newArrPics)
        })
      },

      // 编辑店铺内容
      shopInfoEdit(){
        let params = {
          id: this.shopForm.id,
          name: this.shopForm.name,
          bulletin: this.shopForm.notice,
          avatar: this.imgparamsHaeder,
          pics: JSON.stringify(this.imgparams),
          deliveryPrice: this.shopForm.delivery,
          deliveryTime: this.shopForm.time,
          description: this.shopForm.desc,
          score: this.shopForm.score,
          sellCount: this.shopForm.volume,
          supports: JSON.stringify(this.shopForm.active),
          date: JSON.stringify(this.shopForm.businessTime),
        }
        // console.log(params)
        API_shopInfoEdit(params).then(res=>{
          // console.log(res.data);
           if(res.data.code == 0){
            this.$message({
              showClose: true,
              message: res.data.msg,
              type: 'success',
              duration: 1500,
              onClose: ()=>{
                this.getShopInfo();
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

      // 上传图片之前检测头像是否合法
      beforePicUpload(file) {
        let type = file.type;
        if( type == 'image/jpeg' || type == 'image/png' || type == 'image/gif'){
          return true;
        }else{
          this.$message.error('上传头像图片只能是 JPG、png、gif 格式!');
          return false;
        }
      },

      // 上传店铺头像
      handleAvatarSuccess(res, file) {
        // console.log(res, file);
        if(res.code == 0){
          this.imgparamsHaeder = res.imgUrl;
          this.shopForm.shopHeaderUrl = this.piclinkheader + res.imgUrl;
        }
      },

      // 上传店铺图片
      uploadPicsSuccessList(res, file, fileList){
        // console.log(res, file, fileList)
        if(res.code == 0){
          this.imgparams.push(res.imgUrl)
        }
      },

      // 删除图片
      handleRemove(file, pics) {
        let delePicName =file.url.slice(file.url.lastIndexOf('/') + 1)
        this.imgparams.splice(this.imgparams.indexOf(delePicName), 1);
      },
      // 放大图片
      handlePreview(file) {
        this.curpics = file.url;
        this.dialogVisible = true;
      }
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
    width: 148px;
    height: 148px;
    line-height: 148px;
    text-align: center;
  }
  .avatar {
    width: 148px;
    height: 148px;
    display: block;
  }
</style>