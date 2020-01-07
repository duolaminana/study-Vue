import request from '@/utils/request'
import axios from 'axios'
import { getToken } from '@/utils/auth'
const baseUrl = require('./config.js');

// -----------------------------------------------询报价管理-定制管理----------------------------------------------------------
// 通过ID查看详情
export function selectByIdApi(option) {
  return request.get(`inquiry/customOrder/selectById`, { params: option })
}
// 通过bid查看详情
export function selectCustomByIdApi(option) {
  return request.get(`inquiry/customOrder/selectCustomById`, { params: option })
}
// 后台服务--分页搜索条件查询定制列表
export function selectCustomOrderListAllApi(option) {
  return request.post(`inquiry/customOrder/selectCustomOrderListAll`, option)
}
// 后台服务--暂存操作-后台人员进行定制新增操作
export function saveAdminCustomApi(option) {
  return request.post(`inquiry/customOrder/saveAdminCustom`, option)
}
// 后台服务--提交操作-后台人员进行定制新增操作
export function submitAdminCustomApi(option) {
  return request.post(`inquiry/customOrder/submitAdminCustom`, option)
}
// 后台服务--后台人员进行删除操作-单删除
export function deleteCustomByIdApi(option) {
  return request.get(`inquiry/customOrder/deleteCustomById`, { params: option })
}
// 后台服务--后台人员进行删除操作-批量删除
export function deleteCustomOrderIdsApi(option) {
  return request.post(`inquiry/customOrder/deleteCustomOrderIds`, option)
}
// 前台服务--前台用户进行定制保存操作
export function saveUserCustomApi(option) {
  return request.post(`inquiry/customOrder/saveUserCustom`, option)
}
// 前台服务--根据用户ID分页搜索条件查询定制列表
export function selectUserCustomOrderListApi(option) {
  return request.post(`inquiry/customOrder/selectUserCustomOrderList`, option)
}

// 定制单附件-全部下载
// export function downloadApi(option) {
//   return request.get(`inquiry/customOrderFile/downloadCustomOrderFile`, { params: option })
// }
export function downloadApi(option) {
  return axios({
    method: 'get',
    data: {
      params: option
    },
    url: `${baseUrl.baseUrl}/inquiry/customOrderFile/downloadCustomOrderFile`,
    headers: {
      token: getToken()
    },
    responseType: 'blob'
  })
}

// 导出定制单列表Excel数据(easypoi版)
export function exportCustomOrderExcelApi(option) {
  return axios({
    method: 'post',
    data: option,
    url: `${baseUrl.baseUrl}/inquiry/customOrder/exportCustomOrderExcel`,
    headers: {
      token: getToken()
    },
    responseType: 'blob'
  })
}

