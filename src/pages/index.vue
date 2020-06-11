<template>
  <div class="admin-main">
    <div :style="{width: navWidth + 'px'}" class="admin-top-nav sidebar-log">
      <div class="admin-logo">
        <img src="../assets/logo.png" class="logo" />
        <span class="logo-name" v-show="!isCollapse">源码外卖平台</span>
      </div>
    </div>
    <el-container>
      <el-aside :style="{width: navWidth + 'px'}">
        <div class="admin-sidebar-nav">
          <el-row class="tac">
            <el-col :span="24">
              <el-menu
                :collapse="isCollapse"
                :default-active="defaultActive"
                :unique-opened="true"
                router
                class="el-menu-vertical-demo"
              >
                <template v-for="(item,subscript) in newtreeslidelist">
                  <el-menu-item v-if="!item.children" :index="item.path" :key="subscript">
                    <i :class="item.icon"></i>
                    <span slot="title">{{item.title}}</span>
                  </el-menu-item>
                  <el-submenu v-else :index="item.index" :key="subscript">
                    <template slot="title">
                      <i :class="item.icon"></i>
                      <span>{{item.title}}</span>
                    </template>
                    <el-menu-item-group>
                      <el-menu-item
                        v-for="(childItem, childId) in item.children"
                        :key="childId"
                        :index="childItem.path"
                      >{{childItem.title}}</el-menu-item>
                    </el-menu-item-group>
                  </el-submenu>
                </template>
              </el-menu>
            </el-col>
          </el-row>
        </div>
      </el-aside>
      <el-container>
        <el-header>
          <div class="admin-top-nav">
            <div class="collapse-btn">
              <el-radio-group v-model="isCollapse">
                <el-radio-button :label="true" v-show="!isCollapse" @click.native="navWidth=64">
                  <i class="el-icon-s-fold"></i>
                </el-radio-button>
                <el-radio-button :label="false" v-show="isCollapse" @click.native="navWidth=220">
                  <i class="el-icon-s-unfold"></i>
                </el-radio-button>
              </el-radio-group>
            </div>
            <div class="breadcrumb">
              <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/index/home' }">后台首页</el-breadcrumb-item>
                <el-breadcrumb-item v-for="(item, index) in breadcrumbArr" :key="index">{{item}}</el-breadcrumb-item>
              </el-breadcrumb>
            </div>
            <div class="nav-user-panel">
              <el-dropdown class="mr10" trigger="click" @command="loginOut">
                <span class="el-dropdown-link">
                  {{account}}
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="2">个人中心</el-dropdown-item>
                  <el-dropdown-item command="1">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-avatar
                :size="40"
                :src="imgUrl"
              ></el-avatar>
            </div>
          </div>
        </el-header>
        <el-main>
          <div class="views-window">
            <div class="views-content">
              <div class="views-body">
                <router-view></router-view>
              </div>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import {API_accountinfo} from '@/api/apis';
import treeslidelistjson from '@/json/treeslidelist';
export default {
  data() {
    return {
      // 用户角色
      role: '',
      // 左侧树形菜单
      treeslidelist: treeslidelistjson,
      // 用户角色菜单
      // newtreeslidelist: [],
      // 左侧树形菜单宽度
      navWidth: 220,
      // 是否折叠树形菜单
      isCollapse: false,
      // 树形菜单当前选中
      defaultActive: '',
      // 面包屑
      breadcrumbArr: [],
      account: '',
      imgUrl: ''
    };
  },
  watch: {
    $route: {
      handler: (val) =>{
        // 监听路由变化设置面包屑
        window.that.breadcrumSet(val.path);
        
        // 路由变化重新设置树形菜单选中
        window.that.defaultActive = val.path;
      },
      // 深度观察监听
      deep: true
    }
  },
  created(){
    // 获取登录的用户角色
    this.role = localStorage.admin_role;
  },
  computed:{
    // 处理用户角色树形菜单
    newtreeslidelist(){
      return this.treeslidelist.filter(i => i.role.includes(this.role));
    }

  },
  methods: {
    // 获取用户信息
    getAccountinfo(){
      let id = localStorage.getItem('admin_userId');
      API_accountinfo({id}).then(res=>{
        this.account = res.data.accountInfo.account;
        this.imgUrl = res.data.accountInfo.imgUrl;
      })
    },

    //退出登录-个人中心
    loginOut(command) {
      if (command == "1") {
        this.$confirm("您是否要退出登录?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$router.push("/");
            localStorage.removeItem('admin_userId');
            localStorage.removeItem('admin_token');
          })
          .catch(() => {});
      }
      if (command == "2") {
        this.$router.push("/index/userCenter");
      }
    },

    // 面包屑设置封装
    breadcrumSet(hash){
      let arr = [];
      switch(hash){
        case '/index/home': arr=[]; break;
        case '/index/orderManage': arr=['订单管理']; break;
        case '/index/shopManage': arr=['店铺管理']; break;
        case '/index/goodsList': arr=['商品列表']; break;
        case '/index/goodsAdd': arr=['商品添加']; break;
        case '/index/goodsType': arr=['商品分类']; break;
        case '/index/userList': arr=['账号列表']; break;
        case '/index/addUser': arr=['添加账号']; break;
        case '/index/editPwd': arr=['修改密码']; break;
        case '/index/goodsAnalysis': arr=['商品统计']; break;
        case '/index/orderAnalysis': arr=['订单统计']; break;
        case '/index/userCenter': arr=['个人中心']; break;
      };
      this.breadcrumbArr = arr;
    }
  },
  mounted() {
    let hash = this.$route.path   // 获取hash
    this.defaultActive = hash;    // 刷新页面就重新设置树形菜单选中项
    this.breadcrumSet(hash);      // 根据hash值设置面包屑
    window.that = this;           // 保存当前对象

    // 获取用户信息
    this.getAccountinfo();
  }
}
</script>

<style lang="scss" scoped>
$height: 60px;
$width: 220px;
.admin-main {
  width: 100%;
  height: 100%;
  .el-container {
    width: 100%;
    height: 100%;
    .el-menu {
      border-right: none;
    }
    .el-aside {
      margin-top: 60px;
      background: #fff;
      overflow-x: hidden;
      transition: width 0.3s;
    }
    .el-header {
      background: #fff;
      border-bottom: 1px solid #eee;
    }
    .el-main {
      padding: 0;
      background: #f6f6f6;
    }
  }
}
.admin-top-nav {
  height: $height;
  overflow: hidden;
  box-sizing: border-box;
  &.sidebar-log {
    position: absolute;
    border-bottom: 1px solid #eee;
  }
  .admin-logo {
    float: left;
    padding: 0 20px;
    margin-top: 12px;
    box-sizing: border-box;
    white-space: nowrap;
    .logo {
      width: 30px;
      margin-right: 10px;
      vertical-align: middle;
    }
    .logo-name {
      font-size: 18px;
      font-weight: bold;
      line-height: 26px;
      vertical-align: middle;
    }
  }
  .collapse-btn {
    float: left;
    margin-top: 9px;
    margin-right: 20px;
  }
  .breadcrumb {
    float: left;
    margin-top: 22px;
  }
  .nav-user-panel {
    float: right;
    display: flex;
    align-items: center;
    margin-top: 10px;
  }
}

.admin-sidebar-nav {
  width: $width;
  .tac,
  .el-col,
  .el-menu {
    height: 100%;
  }
}

.views-window {
  width: 100%;
  height: 100%;
  .views-content {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
  }
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 12px;
}

.el-menu-item{
  transition: none;
}
.el-menu-item.is-active{
  border-right: 3px solid #409eff;
  background: #ECF5FF;
}
</style>