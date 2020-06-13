<template>
  <el-card class="box-card user-center" shadow="never">
    <div slot="header" class="clearfix">
      <span>管理员信息</span>
    </div>
    <div class="text item">
      <div v-loading="loading">
        <span>管理员ID：{{adminId}}</span>
        <el-divider></el-divider>
        <span>账号：{{adminAccount}}</span>
        <el-divider></el-divider>
        <span>用户组：{{adminGroup}}</span>
        <el-divider></el-divider>
        <span>创建时间：{{changeTime(adminTime)}}</span>
        <el-divider></el-divider>
        <span>管理员头像：<el-avatar shape="square" :size="50" :src="squareUrl" style="vertical-align: middle;"></el-avatar> <el-link class="ml20" type="primary" icon="el-icon-edit" @click="dialogFormVisible = true">修改头像</el-link></span>
      </div>
    </div>
    <el-dialog title="修改头像" :visible.sync="dialogFormVisible" center width="360px">
      <el-upload
        class="avatar-uploader"
        :action="this.server + '/users/avatar_upload'"
        :show-file-list="false"
        :accept="imgType"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserPic">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import { server } from '@/servers/servers';
import {API_accountinfo, API_avatarUpload, API_avataredit} from '@/api/apis';
  export default {
    data(){
      return {
        server,
        adminId: '',
        adminAccount: '',
        adminGroup: '',
        adminTime: '',
        squareUrl: '',
        loading: true,
        dialogFormVisible: false,
        imgType: 'image/png, image/jpeg, image/gif',
        imageUrl: '',
        avatarUploadStatus: true,  // 图片上传状态
        returnImageUrl: ''
      }
    },
    mounted(){
      this.getAccountinfo();
    },
    methods:{
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
      // 获取用户信息
      getAccountinfo(){
        let id = localStorage.getItem('admin_userId');
        API_accountinfo({id}).then(res=>{
          this.adminId = res.data.accountInfo.id;
          this.adminAccount = res.data.accountInfo.account;
          this.adminGroup = res.data.accountInfo.userGroup;
          this.adminTime = res.data.accountInfo.ctime;
          this.squareUrl = res.data.accountInfo.imgUrl;
          this.loading = false;
          console.log(this.squareUrl)
        })
      },

      // 头像上传
      handleAvatarSuccess(res, file) {
        if(this.avatarUploadStatus){
          this.imageUrl = URL.createObjectURL(file.raw);
          console.log(this.imageUrl)
          let params = {file: this.imageUrl}
          API_avatarUpload(params).then(res=>{
            this.returnImageUrl = res.data.imgUrl;
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

      // 确定修改图片
      editUserPic(){
        let id = localStorage.getItem('admin_userId');
        let params = {imgUrl: this.returnImageUrl, id}
        API_avataredit(params).then(res=>{
          if(res.data.code == 0){
            this.$message({
              showClose: true,
              message: res.data.msg,
              type: 'success',
              duration: 1500
            });
            this.dialogFormVisible = false;
            this.imageUrl = this.returnImageUrl;
            this.$router.go(0);
          }else{
            this.$message({
              showClose: true,
              message: res.data.msg,
              type: 'error',
              duration: 1500
            });
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .avatar-uploader{
    display: flex;
    justify-content: center;
  }
  /deep/ .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  /deep/ .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
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