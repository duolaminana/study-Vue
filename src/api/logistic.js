import request from '@/utils/request'

// --------------------------------物流订单管理------------------------
// 分页查询-物流订单列表数据
export function selectLogisticsOrderDetailListAPI(option) {
  return request.get(`/backend-logistics/logisticsOrderDetail/selectLogisticsOrderDetailList`, { params: option });
}
// 新增-保存操作-后台人员进行物流单新增操作
export function saveLogisticsOrderDetailAPI(option) {
  return request.post(`/backend-logistics/logisticsOrderDetail/saveLogisticsOrderDetail`, option);
}
// 新增-提交操作-后台人员进行物流单新增操作
export function submitLogisticsOrderDetailAPI(option) {
  return request.post(`/backend-logistics/logisticsOrderDetail/submitLogisticsOrderDetail`, option);
}
// 申请支付指令
export function saveApplyAPI(option) {
  return request.post(`/backend-logistics/logisticsOrderDetail/saveApply`, option);
}
// 随机生成物流订单编号
export function getLogisticsOrderNoAPI(option) {
  return request.get(`/backend-logistics/logisticsOrderDetail/getLogisticsOrderNo`, { params: option });
}
// 通过bid获取物流单详情
export function selectLogisticsOrderByIdAPI(option) {
  return request.get(`/backend-logistics/logisticsOrderDetail/selectLogisticsOrderById`, { params: option });
}
// 更新待商家确认
export function updateAffirmResultAPI(option) {
  return request.get(`/backend-logistics/logisticsOrderDetail/updateAffirmResult`, { params: option });
}

// 获取将要生成物流订单的销售订单
export function getSaleOrderListByType(option) {
  return request.post(`/backend-order/salesOrder/searchSalesOrderByOrderNo`, option);
}
// 获取将要生成物流订单的转单订单
export function getTransitradeOrderListByType(option) {
  return request.post(`/backend-order/transitradeOrder/searchTransitradeOrderByOrderNo`, option);
}
// 获取将要生成物流订单的采购订单
export function getPurchaseOrderListByType(option) {
  return request.post(`/backend-order/purchaseOrder/pageph`, option);
}

// 根据订单bid获取商品-销售
export function addSaleOrderProductToLogistic(option) {
  return request.get(`/backend-order/salesOrder/getProductBySalesOrderBidList`, { params: option });
}

// 根据订单bid获取商品-转单
export function addTransitradeOrderProductToLogistic(option) {
  return request.get(`/backend-order/transitradeOrder/getProductByTransitradeOrderBidList`, { params: option });
}

// 根据订单bid获取商品-采购
export function addPurchaseOrderProductToLogistic(option) {
  return request.get(`/backend-order/purchaseOrderProducts/selectPurchaseProductData`, { params: option });
}

// --------------------------------物流信息追踪表------------------------

// 根据订单bid获取物流订单详情列表数据
export function selectLogisticsOrderDetailList(option) {
  return request.get(`/backend-logistics/logisticsTrace/selectLogisticsTraceList`, { params: option });
}
// 保存&更新--物流信息数据
export function saveLogisticsOrderDetail(option) {
  return request.post(`/backend-logistics/logisticsTrace/saveLogisticsTrace`, option);
}
