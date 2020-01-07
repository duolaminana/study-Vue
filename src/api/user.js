import request from '@/utils/request'

export function login(option) {
  return request.post(`/backend-auth/admin/login`, option);
}

// 根据用户token获取用户信息
export function getInfo() {
  return request.get(`/backend-auth/admin/getUserInfo`)
}

// 修改用户资料
export function updateUserInfo(option) {
  return request.post(`/backend-auth/admin/updateUserInfo`, option)
}

// 根据用户token获取动态路由
export function getRoleMenu() {
  return request.get(`/backend-admin/sysAuthorityMenu/getMemuList`)
}

// 登出
export function logout() {
  return request.get(`/backend-auth/admin/logout`)
}

// 修改登录密码
export function changePassword(option) {
  return request.post(`/backend-auth/admin/updatePassword`, option)
}

// 解锁密码登陆
export function unlockPassword(option) {
  return request.get(`/backend-auth/admin/unlockAccount`, { params: option })
}

// 获取前端用户
export function getClientUserList(option) {
  return request.post(`/backend-user/user/searchList`, option)
}

// 获取后台用户
export function getAdminUserList(option) {
  return request.get(`/backend-user/sysUser/selectList`, { params: option })
}

// 查询用户--有搜索条件
export function selectUserListAllApi(option) {
  return request.get(`/backend-user/sysUser/selectUserListAll`, { params: { key: option }})
}

// 新增前台用户
// 新增供应商联系人并创建前台用户
export function addLinkUser(option) {
  return request.post('/backend-user/user/registerUserFrontend', option);
}
