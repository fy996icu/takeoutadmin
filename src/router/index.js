import Vue from 'vue'
import Router from 'vue-router'
import login from '../pages/login.vue'
import {
  API_checkToken
} from '@/api/apis';

Vue.use(Router)

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
const router =  new Router({
  routes: [{
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/index',
      name: 'index',
      component: () => import('../pages/index.vue'),
      children: [
        {
          path: 'home',
          name: 'home',
          component: () => import('../pages/home/home.vue')
        },
        {
          path: 'orderManage',  // 订单管理
          name: 'orderManage',
          component: () => import('../pages/order/orderManage.vue')
        },
        {
          path: 'userList',  // 账户列表
          name: 'userList',
          component: () => import('../pages/user/userList.vue')
        },
        {
          path: 'addUser',  // 添加账号
          name: 'addUser',
          component: () => import('../pages/user/addUser.vue')
        },
        {
          path: 'editPwd',  // 修改密码
          name: 'editPwd',
          component: () => import('../pages/user/editPwd.vue')
        },
        {
          path: 'userCenter',  // 个人中心
          name: 'userCenter',
          component: () => import('../pages/user/userCenter.vue')
        },
        {
          path: 'goodsAnalysis',  // 商品统计
          name: 'goodsAnalysis',
          component: () => import('../pages/analysis/goodsAnalysis.vue')
        },
        {
          path: 'orderAnalysis',  // 订单统计
          name: 'orderAnalysis',
          component: () => import('../pages/analysis/orderAnalysis.vue')
        },
        {
          path: 'goodsList',  // 商品列表
          name: 'goodsList',
          component: () => import('../pages/goods/goodsList.vue')
        },
        {
          path: 'goodsAdd',  // 商品添加
          name: 'goodsAdd',
          component: () => import('../pages/goods/goodsAdd.vue')
        },
        {
          path: 'goodsType',  // 商品分类
          name: 'goodsType',
          component: () => import('../pages/goods/goodsType.vue')
        },
        {
          path: 'shopManage',  // 店铺管理
          name: 'shopManage',
          component: () => import('../pages/shop/shopManage.vue')
        }
      ]
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  if (to.path != '/') {
    let params = {
      token: localStorage.admin_token
    };
    API_checkToken(params).then(res => {
      if (res.data.code == 0) {
        next();

      } else {
        next('/');
        localStorage.removeItem('admin_userId')
        localStorage.removeItem('admin_token')
      }
    })
  } else next();
})

export default router;