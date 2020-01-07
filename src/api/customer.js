import request from '@/utils/request'
import axios from 'axios'
import { getToken } from '@/utils/auth'
const baseUrl = require('./config.js')
// -----------------------------------------------分类管理----------------------------------------------------------

export function listSort(option) {
  return request.get('/backend-customer/customerSort/pageph', { params: option });
}

export function saveSort(option) {
  return request.post('/backend-customer/customerSort/save', option);
}

export function updateSort(option) {
  return request.post('/backend-customer/customerSort/updateCustomerSort', option);
}

export function updateByStatus(option) {
  return request.post('/backend-customer/customerSort/updateByStatus', option);
}

export function updateSortList(option) {
  return request.post('/backend-customer/customerSort/save', option);
}

export function deleteSortById(option) {
  return request.post('/backend-customer/customerSort/deleteById', option);
}

export function deleteSortList(option) {
  return request.post('/backend-customer/customerSort/delete', option);
}

export function deleteSortListByIds(option) {
  return request.post('/backend-customer/customerSort/deleteByIds', option);
}
export function moveSortList(option) {
  return request.post('/backend-customer/customerSort/updateSortIndex', option);
}

// 分类列表

// 编辑(修改)分类

// 删除分类

// 等级列表

// -----------------------------------------------等级管理----------------------------------------------------------

export function listGrade(option) {
  return request.get('/backend-customer/customerGrade/pageph', { params: option });
}

export function saveGrade(option) {
  return request.post('/backend-customer/customerGrade/save', option);
}

export function updateGrade(option) {
  return request.post('/backend-customer/customerGrade/updateCustomerGrade', option);
}

export function updateGradeList(option) {
  return request.post('/backend-customer/customerGrade/save', option);
}

export function deleteGradeById(option) {
  return request.post('/backend-customer/customerGrade/deleteById', option);
}

export function deleteGradeByIds(option) {
  return request.post('/backend-customer/customerGrade/deleteByIds', option);
}

export function getCustomerGradeByBId(option) {
  return request.post('/backend-customer/customerGrade/getCustomerGradeByBId', option);
}

// 编辑(修改)等级

// 删除等级

// -----------------------------------------------标签管理----------------------------------------------------------

export function listLabel(option) {
  return request.get('/backend-customer/commonLabel/pageph', { params: option });
}

export function saveLabel(option) {
  return request.post('/backend-customer/commonLabel/save', option);
}

export function updateLabel(option) {
  return request.post('/backend-customer/commonLabel/update', option);
}

export function updateLabelList(option) {
  return request.post('/backend-customer/commonLabel/save', option);
}

export function deleteLabelById(option) {
  return request.post('/backend-customer/commonLabel/deleteById', option);
}

export function deleteLabelList(option) {
  return request.post('/backend-customer/commonLabel/delete', option);
}

// ---------------------------------------------客户(企业)档案管理----------------------------------------------------

// 客户新增
export function saveCustomerInfo(option) {
  return request.post('/backend-customer/customerInfo/save', option);
}

// 客户分页列表
export function listCustomerInfo(option) {
  return request.get('/backend-customer/customerInfo/pageph', { params: option });
}

// 编辑(更新)客户
export function updateCustomerInfo(option) {
  return request.post('/backend-customer/customerInfo/update', option);
}

// 删除客户
export function deleteCustomer(option) {
  return request.post('/backend-customer/customerInfo/deleteById', option);
}

// 通过BId 查找
export function getCustomerInfoByBId(option) {
  return request.post('/backend-customer/customerInfo/getCustomerInfoByBId', option);
}

// 客户修改历史列表

// 客户修改查询
export function listCustomerInfos(option) {
  return request.get('/backend-customer/customerInfo/pageph', { params: option });
}

// 客户列表 -提供对外接口
export function listCustomerInfoContactApi(option) {
  return request.get('/backend-customer/customerInfo/list', { params: option });
}

// -------------------客户合作协议-------------------------

// 客户合作(新增)
export function saveCustomerCooperPact(option) {
  return request.post('/backend-customer/customerCooperPact/save', option);
}

// 客户合作(修改)
export function updateCustomerCooperPact(option) {
  return request.post('/backend-customer/customerCooperPact/update', option);
}

// 客户合作(查询)
export function listCustomerCooperPact(option) {
  return request.get('/backend-customer/customerCooperPact/pageph', { params: option });
}

// 客户合作(删除)
export function deleteCustomerCooperPact(option) {
  return request.post('/backend-customer/customerCooperPact/deleteById', option);
}

// ---------------------客户联系人----------------------------

// 客户联系人(新增)
export function saveCustomerContact(option) {
  return request.post('/backend-customer/customerContact/save', option);
}

// 客户联系人(修改)
export function updateCustomerContact(option) {
  return request.post('/backend-customer/customerContact/update', option);
}

// 客户联系人(查询)
export function listCustomerContact(option) {
  return request.get('/backend-customer/customerContact/pageph', { params: option });
}

// 客户联系人(通过客户信息查询)
export function pagephCustomerContactByCustomerInfo(option) {
  return request.get('/backend-customer/customerContact/pagephCustomerContactByCustomerInfo', { params: option });
}

// 客户联系人(查询)
export function getCustomerInfo(option) {
  return request.post('/backend-customer/customerInfo/getCustomerInfoByBId', option);
}

// 客户联系人(删除)
export function deleteCustomerContact(option) {
  return request.post('/backend-customer/customerContact/deleteById', option);
}

// --------------------服务人员-----------------------------

// 客户服务人员(新增)
export function saveCustomerServing(option) {
  return request.post('/backend-customer/customerServing/save', option);
}

// 客户服务人员(修改)
export function updateCustomerServing(option) {
  return request.post('/backend-customer/customerServing/update', option);
}

// 客户服务人员(查询)
export function listCustomerServing(option) {
  return request.post('/backend-customer/customerServing/pagephcCustomerServing', option);
}

// 客户服务人员(删除)
export function deleteCustomerServing(option) {
  return request.post('/backend-customer/customerServing/deleteById', option);
}

// 批量 客户服务人员(删除)
export function deleteCustomerServingByIds(option) {
  return request.post('/backend-customer/customerServing/deleteByIds', option);
}

// -----------------------银行账号--------------------------

// 企业客户银行账户(删除)
export function deleteCustomerBankById(option) {
  return request.post('/backend-customer/customerBankAccount/deleteById', option);
}

// 批量 企业客户银行账户(删除)
export function deleteCustomerBankByIds(option) {
  return request.post('/backend-customer/customerBankAccount/deleteByIds', option);
}

// 企业客户银行账户(新增)
export function saveCustomerBank(option) {
  return request.post('/backend-customer/customerBankAccount/save', option);
}

// 企业客户银行账户(修改)
export function updateCustomerBank(option) {
  return request.post('/backend-customer/customerBankAccount/update', option);
}

// 企业客户银行账户(查询)
export function listCustomerBank(option) {
  return request.get('/backend-customer/customerBankAccount/pageph', { params: option });
}

// ----------------------------------- 企业客户付款条件-------------------------------------------------

// 企业客户付款条件(删除)
export function deleteCustomerPaymentTerms(option) {
  return request.post('/backend-customer/customerPaymentTerms/deleteById', option);
}

// 企业客户付款条件(新增)
export function saveCustomerPaymentTerms(option) {
  return request.post('/backend-customer/customerPaymentTerms/save', option);
}

// 企业客户付款条件(修改)
export function updateCustomerPaymentTerms(option) {
  return request.post('/backend-customer/customerPaymentTerms/update', option);
}

// 企业客户付款条件(查询)
export function listCustomerPaymentTerms(option) {
  return request.get('/backend-customer/customerPaymentTerms/pageph', { params: option });
}

// 企业客户付款条件(通过BId查找)
export function getPaymentDetailByBId(option) {
  return request.post('/backend-customer/customerPaymentTerms/getCustomerPaymentTermsByCustomerBId', option);
}

// ----------------------------------- 客户沟通记录-------------------------------------------------

// 客户沟通记录(查询列表)
export function listCustomerCommunicationApi(option) {
  return request.post('/backend-customer/customerCommunication/pagephCustomerCommunication', option);
}
// 沟通列表
export function listCustomer(option) {
  return request.get('/backend-customer/customerCommunication/list', { params: option });
}
// 客户沟通记录(新增)
export function saveCustomerCommunicationApi(option) {
  return request.post('/backend-customer/customerCommunication/save', option);
}

// 客户沟通记录(更新)
export function updateCustomerCommunicationApi(option) {
  return request.post('/backend-customer/customerCommunication/update', option);
}

// 客户沟通记录(批量删除)
export function deleteCustomerCommunicationApi(option) {
  return request.get('/backend-customer/customerCommunication/deleteByIds', { params: option });
}

// 客户沟通记录(删除)
export function deleteCustomerCommunication(option) {
  return request.post('/backend-customer/customerCommunication/deletebyId', option);
}

// 客户列表
export function communicaList(option) {
  return request.get('/backend-customer/customerCommunication/list', { params: option });
}

// --------------------商品类目-----------------------------

// 客户商品类目详情
export function getCustomerCategory(option) {
  return request.get('/backend-customer/customerProductSpec/getProductCatalogAllByCustomerBId', { params: option });
}

// 保存客户商品类目
export function saveCustomerCategory(option) {
  return request.post('/backend-customer/customerProductSpec/addMenu', option);
}

// 导出客户excel
export function exportCustomer() {
  return axios({
    method: 'post',
    url: `${baseUrl.baseUrl}/backend-customer/customerInfo/exportExcelByEasypoi`,
    headers: {
      token: getToken()
    },
    responseType: 'blob'
  })
}

