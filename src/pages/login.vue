<template>
  <div class="login-wrap">
    <div class="login-content">
      <div class="left-bg">
        <img src="../assets/images/login/login-bg-01.png">
      </div>
      <div class="right-bg">
        <img src="../assets/images/login/login-bg-02.png">
      </div>
      <div class="login-form">
        <h1 class="login-title">欢迎使用源码外卖平台</h1>
        <el-card class="box-card">
          <div class="text item">
            <h2 class="small-title">登录</h2>
            <div class="from-wrap">
              <el-form :model="loginForm" status-icon ref="loginForm" :rules="rules">
              <el-form-item prop="userName">
                <el-input type="text" v-model="loginForm.userName" autocomplete="off" prefix-icon="el-icon-user" placeholder="请输入用户名"></el-input>
              </el-form-item>
              <el-form-item prop="checkPass">
                <el-input type="password" @keyup.enter.native="userLogin('loginForm')" v-model="loginForm.checkPass" autocomplete="off" prefix-icon="el-icon-lock" suffix-icon="el-icon-date" placeholder="请输入密码"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="userLogin('loginForm')" class="submit-btn">登录</el-button>
              </el-form-item>
            </el-form>
            </div>
          </div>
        </el-card>
      </div>
      <div class="login-footer">
        <p>©2020 Baidu 使用百度前必读    增值电信业务经营许可证：B1.B2-20100266</p>
        <p>京ICP证030173号    隐私政策</p>
      </div>
    </div>
  </div>
</template>

<script>
  import {API_login, API_checkToken} from '@/api/apis';
  export default {
    data() {
      // 检测用户名
       var checkUserName = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('用户名不能为空'))

        } else {
          if ((/[\W]/g.test(value))) {
            callback(new Error('用户名只能是数字或字母'))
          } else {
            callback()
          }
        }
        callback()
      };

      // 检测密码
      var checkUserPass = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('密码不能为空'))

        } else {
          if ((/[\W]/g.test(value))) {
            callback(new Error('用户名只能是数字或字母'))
          } else {
            callback()
          }
        }
        callback()
      };
      return {
        loginForm: {
          userName: '',
          checkPass: '',
        },
        isloginStatus: true,
        rules: {
          userName: [
            { required: true, validator: checkUserName, trigger: 'blur' }
          ],
          checkPass: [
            { required: true, validator: checkUserPass, trigger: 'blur' }
          ]
        }
      };
     
    },
    methods: {
      
      // 登录
      userLogin(formName) {
        let params = {account: this.loginForm.userName, password: this.loginForm.checkPass}

        this.$refs[formName].validate((valid) => {
          if (valid) {

            if(this.isloginStatus){
              API_login(params).then((res=>{
                // console.log(res.data)
                // 登录成功
                if(res.data.code == 0){
                  // 保存用户ID和token
                  localStorage.setItem('admin_userId', res.data.id);
                  localStorage.setItem('admin_token', res.data.token);
                  localStorage.setItem('admin_role', res.data.role);
                  this.$message({
                    showClose: true,
                    message: res.data.msg,
                    type: 'success',
                    duration: 1500,
                    onClose: ()=>{
                      this.$router.push({path: '/index/home'})
                    }
                  });
                  // 防抖节流
                  this.isloginStatus = false;
                  setTimeout(()=>{
                    this.isloginStatus = true;
                  }, 3000)
                }else{
                  // 登录失败
                  this.$message({
                    showClose: true,
                    message: res.data.msg,
                    type: 'error',
                    duration: 1500,
                  });
                }
              }))
            }

          } else {
            return false;
          }
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  .login-wrap {
    .login-form {
      position: fixed;
      top: 50%;
      left: 50%;
      width: 430px;
      margin-left: -215px;
      margin-top: -185px;
      // transform: translate(-50%,-50%);
      .login-title{
        color: #409EFF;
        text-align: center;
        margin-bottom: 40px;
        margin-top: 0;
      }
      .small-title{
        color: #409EFF;
        font-size: 20px;
        text-align: center;
      }
      .from-wrap{
        margin-top: 20px;
      }
      .submit-btn{
        width: 100%;
      }
      .el-form-item{
        margin-bottom: 30px;
      }
      .el-card__body{
        padding: 30px 20px;
      }
    }
    .left-bg{
      position: fixed;
      top: 0;
      left: 0;
      img{
        width: 400px;
      }
    }
    .right-bg{
      position: fixed;
      bottom: 0;
      right: 0;
      img{
        width: 300px;
      }
    }
    .login-footer{
      position: fixed;
      bottom: 20px;
      width: 100%;
      color: #999;
      font-size: 13px;
      text-align: center;
      p{
        margin-top: 12px;
      }
    }
  }
</style>