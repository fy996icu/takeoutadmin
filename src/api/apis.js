import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:5000';

// 用户登录
export const API_login = params => axios.post('/users/checkLogin', params);

// 验证token是否有效
export const API_checkToken = params => axios.get('/users/checktoken', {params});

// 账号名重复检测
export const API_checkAccountRepeat = params => axios.get('/users/checkAccountRepeat', {params});

// 添加账号
export const API_addUser = params => axios.post('/users/add', params);

// 获取账号列表
export const API_getUserList = params => axios.get('/users/list', { params });

// 删除账号
export const API_deleteUser = params => axios.get('/users/del', {params});

// 批量删除账号
export const API_batchdel = params => axios.get('/users/batchdel', { params });

// 修改账号
export const API_editAccount = params => axios.post('/users/edit', params);

// 检查旧密码是否正确
export const API_checkoldpwd = params => axios.get('/users/checkoldpwd', { params });

// 修改密码
export const API_editpwd = params => axios.post('/users/editpwd', params);

// 获取账号信息
export const API_accountinfo = params => axios.get('/users/accountinfo', { params });

// 头像上传
export const API_avatarUpload = params => axios.post('/users/avatar_upload', params);

// 修改用户头像
export const API_avataredit = params => axios.get('/users/avataredit', { params });

// =============================

// 获取分类
export const API_catelist = params => axios.get('/goods/catelist', {params});

// 修改分类
export const API_editcate = params => axios.post('/goods/editcate', params);

// 删除分类
export const API_delcate = params => axios.get('/goods/delcate', {params});

// 添加分类
export const API_addcate = params => axios.post('/goods/addcate', params);

// 获取商品列表
export const API_getGoodsList = params => axios.get('/goods/list', { params });

// 删除商品
export const API_delGoods = params => axios.get('/goods/del', { params });

// 编辑商品
export const API_editGoods = params => axios.post('/goods/edit', params);

// 查询所有分类名称
export const API_categories = () => axios.get('/goods/categories');

// 商品图片上传
export const API_goodsImgUpload = params => axios.post('/goods/goods_img_upload', params);

// 添加商品
export const API_addGoods = params => axios.post('/goods/add', params);


// =============================

// 首页报表
export const API_totaldata = () => axios.get('/order/totaldata');

// 首页报表
export const API_ordertotal = params => axios.get('/order/ordertotal', { params });

// =============================

// 获取店铺详情
export const API_getShopInfo = () => axios.get('/shop/info');

// 店铺图片上传接口
export const API_shopPicUpload = params => axios.post('/shop/upload', params);

// 店铺内容修改
export const API_shopInfoEdit = params => axios.post('/shop/edit', params);


// =============================

// 获取订单列表
export const API_getOrderList = params => axios.get('/order/list', { params });

// 获取订单详情
export const API_getOrderDetail = params => axios.get('/order/detail', { params });

// 修改订单详情
export const API_editOrderDetail = params => axios.post('/order/edit', params);

