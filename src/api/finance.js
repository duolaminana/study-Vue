import request from '@/utils/request'

/* 公共的接口api */

// 金融产品列表
export function financeProduct(option) {
  return request.get(`/backend-finance/financingProduct/pagephFinancingProduct`, { params: option });
}

// 付款记录
export function pagephPaymentRecord(option) {
  return request.post('/backend-finance/paymentRecord/pagephPaymentRecord', option);
}

// 新增金融产品
export function addFinanceProduct(option) {
  return request.post(`/backend-finance/financingProduct/saveFinancingProduct`, option);
}

// 更新金融产品
export function updateFinanceProduct(option) {
  return request.post(`/backend-finance/financingProduct/updateFinancingProduct`, option);
}
// 更新金融产品状态
export function enableFinanceProduct(option) {
  return request.get(`/backend-finance/financingProduct/enableFinancingProduct`, { params: option });
}

// 删除金融产品
export function delFinanceProduct(option) {
  return request.get(`/backend-finance/financingProduct/deleteFinancingProduct`, { params: option });
}

// 删除金融产品(批量)
export function delBatchFinanceProduct(option) {
  return request.get(`/backend-finance/financingProduct/deleteBatchFinancingProduct`, { params: option });
}

// 根据金融产品查询金融渠道
export function getFinanceChannelByProduct(option) {
  return request.get(`/backend-finance/financingProduct/selectInstituteByProductBid`, { params: option });
}

// 根据金融产品新增金融渠道
export function addFinanceChannelByProduct(option) {
  return request.post(`/backend-finance/financingProduct/addInstitute`, option);
}

// 金融渠道列表
export function financeChannel(option) {
  return request.get(`/backend-finance/financingInstitute/pagephFinancingInstitute`, { params: option });
}

// 新增金融渠道
export function addFinanceChannel(option) {
  return request.post(`/backend-finance/financingInstitute/saveFinancingInstitute`, option);
}

// 更新金融渠道
export function updateFinanceChannel(option) {
  return request.post(`/backend-finance/financingInstitute/updateFinancingInstitute`, option);
}

// 删除金融渠道
export function delFinanceChannel(option) {
  return request.get(`/backend-finance/financingInstitute/deleteFinancingInstitute`, { params: option });
}

// 删除金融渠道(批量)
export function delBatchFinanceChannel(option) {
  return request.get(`/backend-finance/financingInstitute/deleteBatchFinancingInstitute`, { params: option });
}

// 金融服务列表
export function financeService(option) {
  return request.get(`/backend-finance/financingService/pagephFinancingService`, { params: option });
}

// 新增金融服务
export function addFinanceService(option) {
  return request.post(`/backend-finance/financingService/saveFinancingService`, option);
}

// 更新金融服务
export function updateFinanceService(option) {
  return request.post(`/backend-finance/financingService/updateFinancingService`, option);
}

// 删除金融服务
export function delFinanceService(option) {
  return request.get(`/backend-finance/financingService/deleteFinancingService`, { params: option });
}

// 删除金融服务(批量)
export function delBatchFinanceService(option) {
  return request.get(`/backend-finance/financingService/deleteBatchFinancingService`, { params: option });
}

// 金融服务还款记录
export function financeServicePaymentRecord(option) {
  return request.get(`/backend-finance/financingServiceRepaymentRecord/listFinancingServiceRepaymentRecord`, { params: option });
}

// 保存金融服务还款记录
export function saveServiceRecord(option) {
  return request.post(`/backend-finance/financingServiceRepaymentRecord/saveFinancingServiceRepaymentRecord`, option);
}

// 修改金融服务还款记录
export function updateServiceRecord(option) {
  return request.post(`/backend-finance/financingServiceRepaymentRecord/updateFinancingServiceRepaymentRecord`, option);
}

// 支付管理列表
export function getPurchaseOrderList(option) {
  return request.post(`/backend-finance/paymentApply/pagephPaymentApply`, option);
}
// 采购详情
export function detailPaymentDataApi(option) {
  return request.get(`/backend-finance/paymentApply/deatilByBId`, { params: option });
}
// 获取采购进度列表
export function typeNodeSaleOrder(option) {
  return request.get(`/backend-order/workflowProcess/selectWorkFlowTypeByOrderBid`, { params: option });
}

// 查询订单待付款金额
export function getPaymentAmount(option) {
  return request.get(`/backend-finance/paymentApply/getSumPendingSum`, { params: option });
}
// 付款说明提交
export function addPaymentInstruction(option) {
  return request.post(`/backend-finance/paymentApply/savePaymentApply`, option);
}
// 销售订单付款记录新增
export function addPaymentRecord(option) {
  return request.post(`/backend-finance/paymentRecord/savePaymentRecord`, option);
}
// 销售订单付款记录更新
export function updatePaymentsRecord(option) {
  return request.post(`/backend-finance/paymentRecord/updatePaymentRecord`, option);
}
// 销售订单付款记录更新
export function submitApproval(option) {
  return request.get(`/backend-finance/paymentApply/submitApproval`, { params: option });
}

