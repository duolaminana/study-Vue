import request from '@/utils/request'
const baseUrl = require('@/api/config.js');
import axios from "axios";
import { getToken } from '@/utils/auth'
// 新增采购订单
export function addPurchaseOrder(option) {
  return request.post(`/backend-order/purchaseOrder/save`, option);
}

// 更新采购订单
export function updatePurchaseOrder(option) {
  return request.post(`/backend-order/purchaseOrder/update`, option);
}

// 采购订单详情
export function purchaseOrderDetail(option) {
  return request.get(`/backend-order/purchaseOrder/getDetailById`, { params: option });
}

// 采购订单详情(含流程控制塔)
export function getDetailPOFlowById(option) {
  return request.get(`/backend-order/purchaseOrder/getDetailPOFlowById`, { params: option });
}

export function selectSupplierCompanyList(option) {
  return request.get(`/backend-order/purchaseOrder/selectSupplierCompanyList`, { params: option });
}

// 采购订单分页列表
export function getPurchaseOrderList(option) {
  return request.post(`/backend-order/purchaseOrder/pageph`, option);
}

// 删除采购订单
export function deletePurchaseOrder(option) {
  return request.delete(`/backend-order/purchaseOrder/deleteBatchByIds`, { params: option });
}

// 确认作废操作
export function confirmObsoleteById(option) {
  return request.post(`/backend-order/purchaseOrder/confirmObsoleteById`, option);
}

// 付款详情
export function payTermsByBid(option) {
  return request.get(`/backend-supplier/supplierPaymentTerms/detailByBid`, { params: option });
}

// 获取待采购的销售订单
export function getWaitSaleOrder(option) {
  return request.post(`/backend-order/salesOrder/getSalesOrderByOrderNo`, option);
}

// 销售订单通过bid查询商品
export function getSaleOrderSkuByBId(option) {
  return request.get(`/backend-order/salesOrder/getProductBySalesOrderBid`, { params: option });
}

// 采购订单批量新增
export function addBatchPurchase(option) {
  return request.post(`/backend-order/purchaseOrder/saveBatch`, option);
}

// 采购订单流程节点
export function getNodePurchase(option) {
  return request.get(`/backend-order/purchaseOrder/selectWFProcessByBid`, { params: option });
}

// 采购订单新增上传记录
export function addPurchaseRecord(option) {
  return request.post(`/backend-order/purchaseOrderAttachments/save`, option);
}

// 采购订单新增上传记录
export function getPurchaseRecord(option) {
  return request.get(`/backend-order/purchaseOrderAttachments/list`, { params: option });
}

// 采购订单删除上传记录
export function deleteOrderRecord(option) {
  return request.post(`/backend-order/purchaseOrderAttachments/delete`, option);
}

// 采购订单验收
export function purchaseOrderCheck(option) {
  return request.post(`/backend-order/purchaseOrderAttachments/updatePoaByBId`, option);
}

// 采购订单文件上传凭证列表
export function getPurchaseRecordList(option) {
  return request.get(`/backend-order/purchaseOrderAttachments/selectPurchaseData`, { params: option });
}

// 采购订单相关的销售订单
export function getPurchaseRelateOrder(option) {
  return request.get(`/backend-order/purchaseOrderAttachments/selectSaleOrderDataList`, { params: option });
}
/**
 *
 * 导出采购订单列表-导出
 */
export function exportPurchaseOrderExcel(option) {
  return axios({
    method: 'post',
    data: option,
    url: `${baseUrl.baseUrl}/backend-order/purchaseOrder/exportPurchaseOrderExcel`,
    headers: {
      token: getToken()
    },
    responseType: 'blob'
  })
}
