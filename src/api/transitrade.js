import request from '@/utils/request'
import axios from "axios";
import { getToken } from '@/utils/auth'
const baseUrl = require('@/api/config.js');
// 新增销售订单
export function addSaleOrder(option) {
  return request.post(`/backend-order/transitradeOrder/save`, option);
}

// 更新销售订单
export function updateSaleOrder(option) {
  return request.post(`/backend-order/transitradeOrder/update`, option);
}

// 销售订单详情
export function saleOrderDetail(option) {
  return request.get(`/backend-order/transitradeOrder/detail`, { params: option });
}

// 销售订单列表
export function getSaleOrderList(option) {
  return request.post(`/backend-order/transitradeOrder/pageph`, option);
}

// 删除销售订单
export function deleteSaleOrder(option) {
  return request.get(`/backend-order/transitradeOrder/deleteByIds`, { params: option });
}
// ------------------------------销售订单相关文件上传管理-------------------------------------
// 查询-相关文件数据列表
export function listOrderRelatFilesApi(option) {
  return request.get(`/backend-order/transitradeOrderAttachments/listOrderRelatFiles`, { params: option });
}
// 通过ids进行相关文件附件批量删除
export function deleteOrderRelatFilesByIdsApi(option) {
  return request.post(`/backend-order/transitradeOrderAttachments/deleteOrderRelatFilesByIds`, option);
}
// 新增-相关文件数据
export function saveOrderRelatFilesApi(option) {
  return request.post(`/backend-order/transitradeOrderAttachments/saveOrderRelatFiles`, option);
}

// 确认销售订单
export function checkSaleOrder(option) {
  return request.get(`/backend-order/transitradeOrder/confirm`, { params: option });
}

// 查询销售订单所有流程节点
export function allNodeSaleOrder(option) {
  return request.get(`/backend-order/workflowProcess/selectWorkFlowProcessByOrderBid`, { params: option });
}

// 查询销售订单流程节点-根据类型
export function typeNodeSaleOrder(option) {
  return request.get(`/backend-order/workflowProcess/selectWorkFlowTypeByOrderBid`, { params: option });
}

// 根据销售订单bid和订单节点bid获取某个节点详情
export function selectOrderWorkflowNodeBIdApi(option) {
  return request.get(`/backend-order/workflowProcess/selectOrderWorkflowNodeBId`, { params: option });
}

// 查询销售订单流程节点-根据类型
export function getPaymentsList(option) {
  return request.get(`/backend-order/salesCollectionRecord/listCollectionRecord`, { params: option });
}

// 销售订单付款记录新增
export function addPaymentRecord(option) {
  return request.post(`/backend-order/salesCollectionRecord/saveCollectionRecord`, option);
}

// 销售订单付款记录更新
export function updatePaymentsRecord(option) {
  return request.post(`/backend-order/salesCollectionRecord/updateCollectionRecord`, option);
}

// 销售订单备货记录列表
export function stockRecord(option) {
  return request.get(`/backend-order/transitradeOrderAttachments/listOrderRelatFiles`, { params: option });
}

// 新增销售订单备货记录
export function addRecordFile(option) {
  return request.post(`/backend-order/transitradeOrderAttachments/saveOrderRelatFiles`, option);
}

// 新增销售订单备货记录
export function updateOrderFlowInfo(option) {
  return request.post(`/backend-order/workflowProcess/updateById`, option);
}

// 新增销售订单备货记录
export function deleteOrderStockRecord(option) {
  return request.get(`/backend-order/transitradeOrderAttachments/deleteById`, { params: option });
}

// 销售订单验收
export function checkSaleOrderFlow(option) {
  return request.post(`/backend-order/transitradeOrder/acceptance`, option);
}

// 销售订单收款凭证
export function saleOrderRecRecord(option) {
  return request.get(`/backend-order/salesCollectionRecord/listCollectionRecord`, { params: option });
}

// 查询销售订单商品
export function getSaleOrderSkuByBId(option) {
  return request.get(`/backend-order/transitradeOrderProducts/pageph`, { params: option });
}

// 查询合计后的销售订单商品
export function postSaleOrderSkuByBId(option) {
  return request.post(`/backend-order/transitradeOrderProducts/pageBySumForSalesOrderProducts`, option);
}

// 查询商品所属销售订单
export function getSaleOrderBySkuBId(option) {
  return request.post(`/backend-order/transitradeOrder/pageForPipBySkuBId`, option);
}

// 供应商报价页面，获取供应商及其询价商品数据
export function getInquiryOrSupplierDetailsApi(option) {
  return request.get(`/backend-order/purchaseInquiryOrSupplier/getInquiryOrSupplierDetails`, { params: option });
}

// 停止询价
export function stopPurchaseInquiry(option) {
  return request.get(`/backend-order/purchaseInquirySingle/updatePurchaseInquiryStatus`, { params: option });
}

// 询价优选商品列表
export function preferencePurchaseInquirySku(option) {
  return request.get(`/backend-order/purchaseInquiryProductDetail/pagephPurchaseInquiryProductDetail`, { params: option });
}

// 询价优选商品统计
export function preferencePurchaseInquiryTotal(option) {
  return request.get(`/backend-order/purchaseQuotedProductDetail/selectByPurchaseQuotedBid`, { params: option });
}

// 点击优选商品列表查看报价供应商列表
export function preferencePurchaseInquirySupplier(option) {
  return request.post(`/backend-order/purchaseQuotedProductDetail/pageForPqpdData`, option);
}

// 确定商品优选供应商
export function confirmPreferenceSupplier(option) {
  return request.post(`/backend-order/purchaseInquiryOrSupplier/updatePurchaseInquiryOrSupplier`, option);
}

// 保存--供应商进行报价保存操作
export function savePurchaseQuotedSingleApi(option) {
  return request.post(`/backend-order/purchaseQuotedSingle/savePurchaseQuotedSingle`, option);
}

// 提交--供应商进行报价保存操作
export function updatePurchaseQuotedSingleApi(option) {
  return request.post(`/order/purchaseQuotedSingle/updatePurchaseQuotedSingle`, option);
}

// 查看列表--按照供应商报价查看
export function selectSupplierQuotedListApi(option) {
  return request.get(`/backend-order/purchaseQuotedSingle/selectSupplierQuotedList`, { params: option });
}

// 查询已选择的供应商商品
export function getPurchaseQuotedSkuByBId(option) {
  return request.post(`/backend-order/purchaseQuotedProductDetail/pageForQuotedProductDetail`, option);
}

/**
 * 采购询价详情管理-导出
 */
export function exportPisExcelList(option) {
  return axios({
    method: 'post',
    data: option,
    url: `${baseUrl.baseUrl}/backend-order/purchaseInquirySingle/exportPisExcel`,
    headers: {
      token: getToken()
    },
    responseType: 'blob'
  })
}
