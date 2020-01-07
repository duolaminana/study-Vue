import request from '@/utils/request'
import axios from "axios";
import { getToken } from '@/utils/auth'
const baseUrl = require('@/api/config.js');
// 收款记录
export function selectSalesCollectionRecord(option) {
  return request.get('/backend-order/salesCollectionRecord/selectSalesCollectionRecord', { params: option });
}

// 销售订单记录
export function pageInfoSalesOrderForSupplier(option) {
  return request.get(`/backend-order/salesOrder/pageInfoSalesOrderForSupplier`, { params: option });
}

// 采购订单记录
export function pageInfoBySupplierBId(option) {
  return request.get(`/backend-order/purchaseOrder/pageInfoBySupplierBId`, { params: option });
}

// 新增销售订单
export function addSaleOrder(option) {
  return request.post(`/backend-order/salesOrder/save`, option);
}

// 更新销售订单
export function updateSaleOrder(option) {
  return request.post(`/backend-order/salesOrder/update`, option);
}

// 销售订单详情
export function saleOrderDetail(option) {
  return request.get(`/backend-order/salesOrder/detail`, { params: option });
}

// 销售订单列表
export function getSaleOrderList(option) {
  return request.post(`/backend-order/salesOrder/pageph`, option);
}

// 删除销售订单
export function deleteSaleOrder(option) {
  return request.get(`/backend-order/salesOrder/deleteByIds`, { params: option });
}
// ------------------------------销售订单相关文件上传管理-------------------------------------
// 查询-相关文件数据列表
export function listOrderRelatFilesApi(option) {
  return request.get(`/backend-order/salesOrderAttachments/listOrderRelatFiles`, { params: option });
}
// 通过ids进行相关文件附件批量删除
export function deleteOrderRelatFilesByIdsApi(option) {
  return request.post(`/backend-order/salesOrderAttachments/deleteOrderRelatFilesByIds`, option);
}
// 新增-相关文件数据
export function saveOrderRelatFilesApi(option) {
  return request.post(`/backend-order/salesOrderAttachments/saveOrderRelatFiles`, option);
}

// ------------------------------采购订单管理-------------------------------------
// 分页查询-获取采购订单列表
export function listpurchaseOrderApi(option) {
  return request.post(`/backend-order/purchaseOrder/pageph`, option);
}

// ------------------------------采购付款管理-------------------------------------
// 分页查询-通过采购订单bid获取相关付款凭证数据列表
export function listPaymentProofByIdApi(option) {
  return request.get(`/backend-order/paymentProof/listPaymentProofById`, { params: option });
}
// 新增-付款凭证数据
export function savePaymentProofApi(option) {
  return request.post(`/backend-order/paymentProof/savePaymentProof`, option);
}
// 通过ids进行付款凭证数据批量删除
export function deletePaymentProofsApi(option) {
  return request.post(`/backend-order/paymentProof/deletePaymentProofs`, option);
}
// 通过采购订单bid，来获取该订单总金额，从而判断 当前待付款金额
export function selectSurplusAmountApi(option) {
  return request.get(`/backend-order/paymentProof/selectSurplusAmount`, { params: option });
}

// 确认销售订单
export function checkSaleOrder(option) {
  return request.get(`/backend-order/salesOrder/confirm`, { params: option });
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
  return request.get(`/backend-order/salesOrderAttachments/listOrderRelatFiles`, { params: option });
}

// 新增销售订单备货记录
export function addRecordFile(option) {
  return request.post(`/backend-order/salesOrderAttachments/saveOrderRelatFiles`, option);
}

// 新增销售订单备货记录
export function updateOrderFlowInfo(option) {
  return request.post(`/backend-order/workflowProcess/updateById`, option);
}

// 新增销售订单备货记录
export function deleteOrderStockRecord(option) {
  return request.get(`/backend-order/salesOrderAttachments/deleteById`, { params: option });
}

// 销售订单验收
export function checkSaleOrderFlow(option) {
  return request.post(`/backend-order/salesOrder/acceptance`, option);
}

// 销售订单收款凭证
export function saleOrderRecRecord(option) {
  return request.get(`/backend-order/salesCollectionRecord/listCollectionRecord`, { params: option });
}

// 采购询价单列表
export function getPurchaseInquiryList(option) {
  return request.get(`/backend-order/purchaseInquirySingle/pagephPurchaseInquirySingle`, { params: option });
}

// 采购询价单删除
export function deletePurchaseInquiry(option) {
  return request.delete(`/backend-order/purchaseInquirySingle/deletePurchaseInquirySingle`, { params: option });
}

// 待采购销售单查询
export function getWaitPurchaseSaleOrder(option) {
  return request.post(`/backend-order/salesOrder/pageForPurchaseInquiry`, option);
}

// 查询销售订单商品
export function getSaleOrderSkuByBId(option) {
  return request.get(`/backend-order/salesOrderProducts/pageph`, { params: option });
}

// 查询合计后的销售订单商品
export function postSaleOrderSkuByBId(option) {
  return request.post(`/backend-order/salesOrderProducts/pageBySumForSalesOrderProducts`, option);
}

// 查询商品所属销售订单
export function getSaleOrderBySkuBId(option) {
  return request.post(`/backend-order/salesOrder/pageForPipBySkuBId`, option);
}

// 新增采购询价单
export function addPurchaseInquiryOrder(option) {
  return request.post(`/backend-order/purchaseInquirySingle/savePurchaseInquirySingle`, option);
}

// 修改采购询价单
export function updatePurchaseInquiryOrder(option) {
  return request.post(`/backend-order/purchaseInquirySingle/updatePurchaseInquirySingle`, option);
}

// 添加待采购销售单
export function addSaleOrderWithInquiry(option) {
  return request.post(`/backend-order/purchaseInquiryProductDetail/savePurchaseInquiryProductDetail`, option);
}

// 删除待采购销售单
export function delInquirySaleOrder(option) {
  return request.post(`/backend-order/purchaseInquiryOrSales/deletePurchaseInquiryOrSales`, option);
}

// 查询采购询价单主表详情
export function getPurchaseInquiryDetail(option) {
  return request.get(`/backend-order/purchaseInquirySingle/detailByBId`, { params: option });
}

// 查询采购询价单详情-待查询销售订单
export function getPurchaseInquiryWithSaleOrder(option) {
  return request.post(`/backend-order/purchaseInquiryOrSales/pagePiosListByForm`, option);
}

// 查询采购询价单详情-待采购商品
export function getPurchaseInquiryWithSku(option) {
  return request.get(`/backend-order/purchaseInquiryProductDetail/listPurchaseInquiryProductDetail`, { params: option });
}

// 查询采购询价单详情-新增待采购商品询价供应商
export function savePurchaseInquirySkuSupplier(option) {
  return request.post(`/backend-order/purchaseInquiryOrSupplier/savePurchaseInquiryOrSupplier`, option);
}

// 查询采购询价单详情-删除待采购商品询价供应商
export function deletePurchaseInquirySkuSupplier(option) {
  return request.post(`/backend-order/purchaseInquiryOrSupplier/deletePurchaseInquiryOrSupplier`, option);
}

// 查询采购询价单详情-删除待采购商品
export function deletePurchaseInquirySku(option) {
  return request.post(`/backend-order/purchaseInquiryProductDetail/deletePurchaseInquiryProductDetail`, option);
}

// 供应商报价页面，获取供应商及其询价商品数据
export function getInquiryOrSupplierDetailsApi(option) {
  return request.get(`/backend-order/purchaseInquiryOrSupplier/getInquiryOrSupplierDetails`, { params: option });
}

// 查询采购询价方案预览-供应商
export function getPreviewSupplier(option) {
  return request.get(`/backend-order/purchaseInquiryOrSupplier/pagephPurchaseInquiryOrSupplier`, { params: option });
}

// 查询采购询价方案预览-供应商商品
export function getPreviewSku(option) {
  return request.get(`/backend-order/purchaseInquiryProductDetail/pageListBySupplierBid`, { params: option });
}

// 生成采购询价单号
export function setPurchaseInquiryNo(option) {
  return request.get(`/backend-order/purchaseInquirySingle/getInquiryCodeData`, { params: option });
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
  return request.post(`/backend-order/purchaseQuotedSingle/updatePurchaseQuotedSingle`, option);
}

// 查看列表--按照供应商报价查看
export function selectSupplierQuotedListApi(option) {
  return request.get(`/backend-order/purchaseQuotedSingle/selectSupplierQuotedList`, { params: option });
}

// 根据采购询价bid和供应商bid来获取采购报价主表的具体数据
export function selectByBIdDetailsApi(option) {
  return request.get(`/backend-order/purchaseQuotedSingle/selectByBIdDetails`, { params: option });
}

// 通过采购报价单bid获取商品详情
export function getPurchaseQuotedByBIdApi(option) {
  return request.get(`/backend-order/purchaseQuotedSingle/getPurchaseQuotedByBId`, { params: option });
}

// 查询已选择的供应商商品
export function getPurchaseQuotedSkuByBId(option) {
  return request.post(`/backend-order/purchaseQuotedProductDetail/pageForQuotedProductDetail`, option);
}

// 采购询价生成订单
export function setPurchaseInquiryOrder(option) {
  return request.post(`/backend-order/purchaseOrder/savePurchaseInquiryOrderBatch`, option);
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
