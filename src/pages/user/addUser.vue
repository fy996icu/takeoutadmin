<template>
  <el-card class="box-card" shadow="never">
    <div slot="header" class="clearfix">
      <span>添加账号</span>
    </div>
    <div class="text item">
      <el-form ref="addUserGroupForm" status-icon :rules="rules" :model="addUserGroupForm" style="width: 360px;" label-width="80px">
        <el-form-item label="账号" prop="userName">
          <el-input v-model="addUserGroupForm.userName" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="userPwd">
          <el-input type="password" v-model="addUserGroupForm.userPwd" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="用户组" prop="userGroup">
          <el-select v-model="addUserGroupForm.userGroup" placeholder="请选择用户组" style="width: 280px;">
            <el-option label="普通管理员" value="普通管理员"></el-option>
            <el-option label="超级管理员" value="超级管理员"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addUser('addUserGroupForm')">添加</el-button>
          <el-button @click="resetForm('addUserGroupForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
import {API_addUser, API_checkAccountRepeat} from '@/api/apis';
 export default {
    data() {
      // 检测账号
       var checkAddUserName = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('账号名不能为空'))

        } else {
          if ((/[\W]/g.test(value))) {
            callback(new Error('账号名只能是数字或字母'))

          } else {
            // 检测用户是否重名
            let params = {account: value};
            API_checkAccountRepeat(params).then(res=>{
              // console.log(res.data);
              if(res.data.code == 0){
                callback()
              }else{
                callback(new Error(res.data.msg))
              }
            })
          }
        }
      };
      // 检测密码
       var checkAddUserPass = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('密码不能为空'))

        } else {
          if ((/[\W]/g.test(value))) {
            callback(new Error('密码只能是数字或字母'))
          } else {
            callback()
          }
        }
        callback()
      };
       // 检测用户组
       var checkAddUserGroup = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('请选择用户组'))

        }
        callback()
      };
      return {
        addUserGroupForm: {
          userName: '',
          userPwd: '',
          userGroup: ''
        },
        rules: {
           userName: [
            { required: true, validator: checkAddUserName, trigger: 'blur' }
          ],
          userPwd: [
            { required: true, validator: checkAddUserPass, trigger: 'blur' }
          ],
          userGroup: [
            { required: true, validator: checkAddUserGroup, trigger: 'change' }
          ]
        }
      }
    },
    methods: {
      
      // 添加用户
      addUser(addUserGroupForm) {
        // 参数 
        let params = {account: this.addUserGroupForm.userName, password: this.addUserGroupForm.userPwd, userGroup: this.addUserGroupForm.userGroup};
        this.$refs[addUserGroupForm].validate((valid) => {
          if (valid) {
            API_addUser(params).then((res)=>{
              if(res.data.code == 0){
                this.$message({
                  showClose: true,
                  message: res.data.msg,
                  type: 'success',
                  duration: 1500
                });
              }else{
                this.$message({
                  showClose: true,
                  message: res.data.msg,
                  type: 'error',
                  duration: 1500
                });
              }
            });

          } else {
            return false;
          }
        });
      },
      // 重置
      resetForm(addUserGroupForm) {
        this.$refs[addUserGroupForm].resetFields();
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>