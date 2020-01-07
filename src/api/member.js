import request from '@/utils/request'
// -----------------------------------------------会员管理-会员权益----------------------------------------------------------
// 批量删除
export function dedleteByIds(option) {
  return request.post(`/backend-member/memberRight/deleteByIds`, option)
}

// 判断名称是否存在
export function isSortName(option) {
  return request.get(`/backend-member/memberRight/isSortName`, { params: option })
}

// 查询分页数据
export function pagephMemberRight(option) {
  return request.post(`/backend-member/memberRight/pagephMemberRight`, option)
}

// 新增权益
export function addSaveMemberRight(option) {
  return request.post(`/backend-member/memberRight/saveMemberRight`, option)
}

// 修改权益
export function updateMemberRight(option) {
  return request.post(`/backend-member/memberRight/updateMemberRight`, option)
}

// 查询数据
export function listMemberRight(option) {
  return request.get(`/backend-member/memberRight/listMemberRight`, { params: option })
}
// -----------------------------------------------会员管理-会员活动----------------------------------------------------------
// 查询数据
export function listMemberLevel(option) {
  return request.get(`/backend-member/memberLevel/listMemberLevel`, { params: option })
}

// 查询分页数据
export function pagephMemberActivity(option) {
  return request.post(`/backend-member/memberActivity/pagephMemberActivity`, option)
}

// 查询活动详情
export function detailMemberActivity(option) {
  return request.get(`/backend-member/memberActivity/detailMemberActivity`, { params: option })
}

// 批量删除数据
export function deleteByIds(option) {
  return request.post(`/backend-member/memberActivity/deleteByIds`, option)
}

// 新增数据
export function saveMemberActivity(option) {
  return request.post(`/backend-member/memberActivity/saveMemberActivity`, option)
}

// 修改数据
export function updateMemberActivity(option) {
  return request.post(`/backend-member/memberActivity/updateMemberActivity`, option)
}

// 查看活动成员
export function getMembgerActivityMembers(option) {
  return request.post(`/backend-member/memberActivity/getMembgerActivityMembers`, option)
}

// 批量上下架
export function updateBatchByIds(option) {
  return request.post(`/backend-member/memberActivity/updateBatchByIds`, option)
}
// ---------------------------------------------会员管理-会员等级--------------------------------------------------------------
// 查看详情
export function detailMemberLevel(option) {
  return request.get(`/backend-member/memberLevel/detailMemberLevel`, { params: option })
}

// 获取等级列表
export function pagephMemberLevel(option) {
  return request.post(`/backend-member/memberLevel/pagephMemberLevel`, option)
}

// 删除
export function deleteMemberByIds(option) {
  return request.post(`/backend-member/memberLevel/deleteByIds`, option)
}

// 新增
export function saveMemberLevel(option) {
  return request.post(`/backend-member/memberLevel/saveMemberLevel`, option)
}

// 编辑
export function updateMemberLevel(option) {
  return request.post(`/backend-member/memberLevel/updateMemberLevel`, option)
}

// 查询数据
export function listMemberLevelList(option) {
  return request.get(`/backend-member/memberLevel/listMemberLevel`, { params: option })
}

// 禁用启用
export function updateMemberLevelStatus(option) {
  return request.post(`/backend-member/memberLevel/updateMemberLevelStatus`, option)
}

// 排序
export function updateByType(option) {
  return request.get(`/backend-member/memberLevel/updateSortIndexByType`, { params: option })
}
// ---------------------------------------------会员管理-会员分类--------------------------------------------------------------

// 删除
export function deleteClassByIds(option) {
  return request.post(`/backend-member/memberCategory/deleteByIds`, option)
}

// 获取列表
export function pagephMemberCategory(option) {
  return request.post(`/backend-member/memberCategory/pagephMemberCategory`, option)
}

// 修改
export function updateMemberCategory(option) {
  return request.post(`/backend-member/memberCategory/updateMemberCategory`, option)
}

// 新增
export function saveMemberCategory(option) {
  return request.post(`/backend-member/memberCategory/saveMemberCategory`, option)
}

// 排序
export function updateSortIndexByType(option) {
  return request.get(`/backend-member/memberCategory/updateSortIndexByType`, { params: option })
}
