<template>
  <el-card class="box-card" shadow="never">
    <div slot="header" class="clearfix">
      <span>修改密码</span>
    </div>
    <div class="text item">
      <el-form :model="ruleEditForm" status-icon :rules="rules" ref="ruleEditForm" style="width: 360px;" label-width="100px" class="demo-ruleForm">
        <el-form-item label="原密码" prop="oldPwd">
          <el-input type="password" @blur="checkOldPwdEvent" v-model="ruleEditForm.oldPwd" placeholder="请输入原密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd">
          <el-input type="password" v-model="ruleEditForm.newPwd" autocomplete="off" placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPwd">
          <el-input type="password" v-model="ruleEditForm.checkPwd" autocomplete="off" placeholder="请再次输入新密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="editPwdFrom('ruleEditForm')">提交</el-button>
          <el-button @click="resetEditPwdFrom('ruleEditForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
import { API_checkoldpwd, API_editpwd } from "@/api/apis";
  export default {
    data() {
      var checkOldPwd = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('原密码不能为空！'));
        }
        setTimeout(() => {
          if (this.ruleEditForm.oldPwdcheckErr) {
            callback(new Error('原密码错误！'));
          }else{
             callback();
          }
        }, 1000);
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleEditForm.newPwd !== '') {
            this.$refs.ruleEditForm.validateField('checkPwd');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleEditForm.newPwd) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        ruleEditForm: {
          oldPwd: '',
          newPwd: '',
          checkPwd: '',
          oldPwdcheckErr: false
        },
        rules: {
          oldPwd: [
            { required: true, validator: checkOldPwd, trigger: 'blur' }
          ],
          newPwd: [
            { required: true, validator: validatePass, trigger: 'blur' }
          ],
          checkPwd: [
            { required: true, validator: validatePass2, trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      // 检测旧密码是否正确
      checkOldPwdEvent(){
        let userId = localStorage.getItem('admin_userId');
        let params = { oldPwd: this.ruleEditForm.oldPwd , id: userId};
        API_checkoldpwd(params).then(res=>{
          if(res.data.code == 11){
            this.ruleEditForm.oldPwdcheckErr = true;
          }else{
            this.ruleEditForm.oldPwdcheckErr = false;
          }
          console.log(res.data)
        })
      },
      // 提交修改
      editPwdFrom(formName) {
        let userId = localStorage.getItem('admin_userId');
        let params = { newPwd: this.ruleEditForm.newPwd , id: userId};
        this.$refs[formName].validate((valid) => {
          if (valid) {
            API_editpwd(params).then(res=>{
              if(res.data.code == 0){
                this.$message({
                  showClose: true,
                  message: res.data.msg,
                  type: 'success',
                  duration: 2000,
                  onClose: ()=>{
                    // 清除本地用户id
                    localStorage.removeItem('admin_userId')
                    this.$router.push({path: '/'})
                  }
                });
              }else{
                this.$message({
                  showClose: true,
                  message: res.data.msg,
                  type: 'error',
                  duration: 2000,
                });
              }
            })
          } else {
            return false;
          }
        });
      },

      // 重置表单
      resetEditPwdFrom(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>