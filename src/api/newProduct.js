import request from '@/utils/request'

// 问卷调查列表
export function getQuestionnaireList(option) {
  return request.post(`/backend-product/questionnaire/pagephQuestionnaireBasic`, option)
}

// 新增问卷调查
export function addQuestionnaire(option) {
  return request.post(`/backend-product/questionnaire/saveQuestionnaireBasic`, option);
}

// 更新问卷调查
export function updateQuestionnaire(option) {
  return request.post(`/backend-product/questionnaire/updateQuestionnaireBasic`, option);
}

// 问卷调查详情，统计信息传type=2
export function getQuestionnaireDetail(option) {
  return request.get(`/backend-product/questionnaire/detailQuestionnaireBasic`, { params: option })
}

// 问卷调查删除
export function deleteQuestionnaire(option) {
  return request.get(`/backend-product/questionnaire/deleteQuestionnaireBasic`, { params: option })
}

// 问卷调查批量删除
export function deleteBatchQuestionnaire(option) {
  return request.get(`/backend-product/questionnaire/deleteByIds`, { params: option })
}

// 获取新商品全部列表
export function getNewProductList(option) {
  return request.get(`/backend-product/productNew/listProductNew`, { params: option })
}

// 获取新商品全部列表
export function changeQuestionnaireStatus(option) {
  return request.get(`/backend-product/questionnaire/updateQuestionStatus`, { params: option })
}

// 申请资料、小样列表

export function getNewProductRecord(option) {
  return request.get(`/backend-product/productNewApplyRecord/pagephProductNewApplyRecord`, { params: option })
}
