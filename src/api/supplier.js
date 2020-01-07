import request from '@/utils/request'
const baseUrl = require('@/api/config.js');
import axios from "axios";
import { getToken } from '@/utils/auth'
// ------------------------------------供应商---------------------------------------------
// 供应商分类分页显示
export function listSort(option) {
  return request.get('/backend-supplier/supplierSort/pageph', { params: option });
}

export function sortList() {
  return request.get('/backend-supplier/supplierSort/list');
}
// 供应商分类保存
export function saveSort(option) {
  return request.post('/backend-supplier/supplierSort/save', option);
}
// 供应商分类修改
export function updateSort(option) {
  return request.post('/backend-supplier/supplierSort/update', option);
}

// 供应商分类禁用，启用状态修改
export function updateSupplierSortStatus(option) {
  return request.post('/backend-supplier/supplierSort/updateByStatus', option);
}

// 供应商分类删除
export function deleteSort(option) {
  return request.delete('/backend-supplier/supplierSort/delete', { params: option });
}

// 供应商等级分页显示
export function gradesPageList(option) {
  return request.get('/backend-supplier/supplierGrade/pageph', { params: option });
}

// 供应商等级保存
export function gradesSave(option) {
  return request.post('/backend-supplier/supplierGrade/saveUpdate', option);
}

// 供应商等级删除
export function gradesDelete(option) {
  return request.delete('/backend-supplier/supplierGrade/delete', { params: option });
}
// 供应商等级状态更新
export function gradesStatusById(option) {
  return request.post('/backend-supplier/supplierGrade/updateGradeStatus', option);
}

// 供应商列表
export function supplierPageList(option) {
  return request.get('/backend-supplier/supplierInfo/pageph', { params: option });
}

// 按类型查询不同供应商列表
export function supplierTypeList(option) {
  return request.get('/backend-supplier/supplierInfo/getSupplierInfoByType', { params: option });
}

// 供应商列表删除
export function deleteSupplier(option) {
  return request.post('/backend-supplier/supplierInfo/delete', option);
}
// 供应商保存接口
export function supplierSave(option) {
  return request.post('/backend-supplier/supplierInfo/save', option);
}
// 供应商状态更新
export function supplierStatusById(option) {
  return request.post('/backend-supplier/supplierInfo/update', option);
}
// 供应商详情
export function supplierDetailById(option) {
  return request.get('/backend-supplier/supplierInfo/detail', { params: option });
}

// 等级列表无分页
export function gradeList(option) {
  return request.get('/backend-member/memberLevel/listMemberLevel', { params: option });
}

// 分类列表无分页
export function getAllSortList(option) {
  return request.get('/backend-supplier/supplierSort/list', { params: option });
}

export const uploadActionUrl = process.env.VUE_APP_UPLOAD_API + '/backend-product/upload/uploadFile';

// ----------------------------------------------供应商------------------------------------------------------------

// 等级列表无分页
export function supplierBankList(option) {
  return request.get('/backend-supplier/supplierBankAccount/list', { params: option });
}

// 银行账户新增接口
export function supplierBankSave(option) {
  return request.post('/backend-supplier/supplierBankAccount/save', option);
}

// 银行账户编辑接口
export function supplierBankUpdate(option) {
  return request.post('/backend-supplier/supplierBankAccount/update', option);
}

// 供应商删除接口
export function supplierBankDelete(option) {
  return request.delete('/backend-supplier/supplierBankAccount/deleteBatch', { params: option });
}

// 付款详情
export function getPaymentDetail(option) {
  return request.get('/backend-supplier/supplierPaymentTerms/detailByBid', { params: option });
}

// 新增付款详情
export function addPayment(option) {
  return request.post('/backend-supplier/supplierPaymentTerms/save', option);
}

// 修改付款详情
export function updatePayment(option) {
  return request.post('/backend-supplier/supplierPaymentTerms/update', option);
}

// 获取合作协议
export function getCooperFileList(option) {
  return request.get('/backend-supplier/supplierCooperPact/list', { params: option });
}

// 新增合作协议
export function addCooperFile(option) {
  return request.post('/backend-supplier/supplierCooperPact/save', option);
}

// 删除合作协议
export function deleteCooperFile(option) {
  return request.post('/backend-supplier/supplierCooperPact/delete', option);
}

// 获取联系人列表
export function getLinkList(option) {
  return request.get('/backend-supplier/supplierContact/list', { params: option });
}

// 新增联系人
export function addLinkPeople(option) {
  return request.post('/backend-supplier/supplierContact/save', option);
}

// 通过供应商信息查找服务人员列表
export function pagephSupplierContactBySupplierInfo(option) {
  return request.get('/backend-supplier/supplierContact/pagephSupplierContactBySupplierInfo', { params: option });
}

// 更新联系人
export function updateLinkPeople(option) {
  return request.post('/backend-supplier/supplierContact/update', option);
}

// 删除联系人
export function deleteLinkPeople(option) {
  return request.post('/backend-supplier/supplierContact/delete', option);
}

// 获取服务人员列表无分页
export function getServiceList(option) {
  return request.get('/backend-supplier/supplierServing/list', { params: option });
}

// 获取服务人员列表分页
export function getServiceListPage(option) {
  return request.get('/backend-supplier/supplierServing/pageph', { params: option });
}

// 新增服务人员
export function addService(option) {
  return request.post('/backend-supplier/supplierServing/save', option);
}

// 新增服务人员
export function addManyService(option) {
  return request.post('/backend-supplier/supplierServing/saveBatch', option);
}

// 删除服务人员
export function deleteService(option) {
  return request.delete('/backend-supplier/supplierServing/delete', { params: option });
}

export function deleteBatchService(option) {
  return request.delete('/backend-supplier/supplierServing/deleteBatch', { params: option });
}

// 获取供应商列表未分页
export function getSupplierList(option) {
  return request.get('/backend-supplier/supplierInfo/list', { params: option });
}

// 获取供应商列表未分页
export function setServicePeople(option) {
  return request.post('/backend-supplier/supplierServing/saveBatch', option);
}

// ----------------------------------- 客户沟通记录-------------------------------------------------
// 客户沟通记录(查询列表)
export function listSupplierCommunicationApi(option) {
  return request.get('/backend-supplier/supplierCommunication/pageph', { params: option });
}

// 客户沟通记录(新增)
export function saveSupplierCommunicationApi(option) {
  return request.post('/backend-supplier/supplierCommunication/save', option);
}

// 客户沟通记录(更新)
export function updateSupplierCommunicationApi(option) {
  return request.post('/backend-supplier/supplierCommunication/update', option);
}

// 客户沟通记录(删除)
export function deleteSupplierCommunicationApi(option) {
  return request.post('/backend-supplier/supplierCommunication/delete', option);
}

// 客户沟通记录(批量删除)
export function deleteBatchByIds(option) {
  return request.delete('/backend-supplier/supplierCommunication/deleteBatchByIds', { params: option });
}

// --------------------------------------------------------------------------------------------------

// ----------------------------------- 供应商关联商品记录 --------------------------------------------
// 获取供应商的供货商品列表
export function getSupplierProductList(option) {
  return request.get('/backend-supplier/supplierProductSku/pageph', { params: option });
}

// 获取供应商id的供货商品列表
export function getSupplierProductSkuList(option) {
  return request.get('/backend-supplier/supplierProductSku/pageByPageHelper2', { params: option });
}

// 供应商的供货商品新增
export function addSupplierProduct(option) {
  return request.post('/backend-supplier/supplierProductSku/save', option);
}

// 供应商的供货商品更新采购
export function updateSupplierProduct(option) {
  return request.post('/backend-supplier/supplierProductSku/update', option);
}

// 供应商的供货商品删除
export function delSupplierProduct(option) {
  return request.delete('/backend-supplier/supplierProductSku/delete', { params: option });
}

// 供应商分类排序上下移动
export function supplierSortMove(option) {
  return request.get('/backend-supplier/supplierSort/move', { params: option });
}

// 供应商分类排序上下移动最后
export function supplierSortMoveMost(option) {
  return request.get('/backend-supplier/supplierSort/moveBest', { params: option });
}

// 根据sku查找供应商
export function searchSupplierList(option) {
  return request.get('/backend-supplier/supplierProductSku/list', { params: option });
}

/**
 * 供应商详情列表-导出
 */
export function exportExcelSupplierList(option) {
  return axios({
    method: 'post',
    data: option,
    url: `${baseUrl.baseUrl}/backend-supplier/supplierInfo/exportSupplierInfoExcel`,
    headers: {
      token: getToken()
    },
    responseType: 'blob'
  })
}

