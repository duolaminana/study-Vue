import request from '@/utils/request';
const baseUrl = require('@/api/config.js');
import axios from "axios";
import { getToken } from '@/utils/auth'
// 公共类目列表
export function getPublicCategory(option) {
  return request.get(`/backend-product/productCatalog/pageph`, { params: option });
}
// 公共类目列表全部未禁用
export function getAllPublicCategory(option) {
  return request.get(`/backend-product/productCatalog/list`, { params: option });
}

// 公共类目列表竞价列表
export function getBiddingPublicCategory(option) {
  return request.get(`/backend-product/productCatalog/listBidding`, { params: option });
}

// 新增公共类目
export function addPublicCategory(option) {
  return request.post(`/backend-product/productCatalog/saveUpdate`, option);
}

// 删除公共类目
export function deletePublicCategory(option) {
  return request.delete(`/backend-product/productCatalog/delete`, { params: option });
}

// 禁用启用公共类目
export function changePublicCategory(option) {
  return request.delete(`/backend-product/productCatalog/updateStatus`, { params: option });
}

// 类目模板列表分页
export function getCategoryModalList(option) {
  return request.get(`/backend-product/productCatalogTemplate/pageph`, { params: option });
}

// 类目模板列表全部
export function getAllCategoryModalList(option) {
  return request.get(`/backend-product/productCatalogTemplate/list`, { params: option });
}

// 未禁用类目模板列表搜索
export function noEnbledCategoryModalList(option) {
  return request.get(`/backend-product/specMold/selectSpecMoldList`, { params: option });
}

// 新增类目模板
export function addCategoryModal(option) {
  return request.post(`/backend-product/productCatalogTemplate/save`, option);
}

// 编辑类目模板
export function editCategoryModal(option) {
  return request.post(`/backend-product/productCatalogTemplate/update`, option);
}

// 启用禁用类目模板
export function enbledCategoryModal(option) {
  return request.delete(`/backend-product/productCatalogTemplate/ableSpecMold`, { params: option });
}

// 类目模板详情
export function detailCategoryModal(option) {
  return request.get(`/backend-product/productCatalogTemplate/selectDetail`, { params: option });
}

// 删除类目模板
export function deleteCategoryModal(option) {
  return request.delete(`/backend-product/productCatalogTemplate/deleteBatch`, { params: option });
}

// 删除模板属性
export function deleteAttrName(option) {
  return request.delete(`/backend-product/productCatalogTemplateDetail/delete`, { params: option });
}

// 删除模板属性值
export function deleteAttrValue(option) {
  return request.delete(`/backend-product/productCatalogAttributeValue/delete`, { params: option });
}

// 商品列表分页
export function getProductList(option) {
  return request.get(`/backend-product/productInfo/pageph`, { params: option });
}

// 商品查看
export function getProductDetail(option) {
  return request.get(`/backend-product/productInfo/detailByBid`, { params: option });
}

// 删除商品
export function deleteProduct(option) {
  return request.delete(`/backend-product/productInfo/delete`, { params: option });
}

// 新增商品
export function addProduct(option) {
  return request.post(`/backend-product/productInfo/save`, option);
}

// 编辑商品
export function editProduct(option) {
  return request.post(`/backend-product/productInfo/update`, option);
}

// 更新商品模板
export function updateProductTemplate(option) {
  return request.post(`/backend-product/productInfo/updateCatalogAndTemplate`, option);
}

// 优选商品上下架
export function preferredShelf(option) {
  return request.post('/backend-product/productPreferred/shelfPreferred', option);
}

// 优选商品列表
export function preferredPagedList(option) {
  return request.get('/backend-product/productPreferred/pageph', { params: option });
}

// 优选商品新增
export function addPreferredProduct(option) {
  return request.post('/backend-product/productPreferred/save', option);
}

// 优选商品删除
export function delPreferredProduct(option) {
  return request.post('/backend-product/productPreferredSku/delete', option);
}

// 促销商品列表
export function promotionPagedList(option) {
  return request.get('/backend-product/productPromotions/pageph', { params: option });
}

// 促销商品新增
export function addPromotionProduct(option) {
  return request.post('/backend-product/productPromotions/save', option);
}

// 促销商品删除
export function delPromotionProduct(option) {
  return request.post('/backend-product/productPromotionsSku/delete', option);
}

// 竞价类目列表
export function getBiddingPriceList(option) {
  return request.get('/backend-product/productCatalogBidding/pageph', { params: option });
}

// 移除竞价类目
export function deleteBiddingPrice(option) {
  return request.delete(`/backend-product/productCatalogBidding/delete`, { params: option });
}

// 新增竞价类目
export function addBiddingPrice(option) {
  return request.post(`/backend-product/productCatalogBidding/save`, option);
}

// 根据商品id获取商品类目信息
export function getCategoryAttr(option) {
  return request.get(`/backend-product/productAttribute/list`, { params: option });
}

// 新增商品类目信息
export function addCategoryAttr(option) {
  return request.post(`/backend-product/productAttribute/save`, option);
}

// 更新商品类目信息
export function editCategoryAttr(option) {
  return request.post(`/backend-product/productAttribute/update`, option);
}

// 根据商品id获取商品图文信息
export function getTextImgInfo(option) {
  return request.get(`/backend-product/productDetPage/detailByBid`, { params: option });
}

// 新增商品类目信息
export function addTextImgInfo(option) {
  return request.post(`/backend-product/productDetPage/save`, option);
}

// 更新商品类目信息
export function editTextImgInfo(option) {
  return request.post(`/backend-product/productDetPage/update`, option);
}

// 根据商品id获取商品图片列表
export function getProductImgList(option) {
  return request.get(`/backend-product/productImge/list`, { params: option });
}

// 删除商品图片
export function deleteTextImg(option) {
  return request.post(`/backend-product/productImge/delete`, option);
}

// 删除商品图片
export function saveTextImg(option) {
  return request.post(`/backend-product/productImge/save`, option);
}

// 根据商品id获取商品销售属性信息
export function getSaleAttr(option) {
  return request.get(`/backend-product/productSellAttribute/detailByBid`, { params: option });
}

// 新增商品销售属性信息
export function addSaleAttr(option) {
  return request.post(`/backend-product/productSellAttribute/save`, option);
}

// 更新商品销售属性信息
export function editSaleAttr(option) {
  return request.post(`/backend-product/productSellAttribute/update`, option);
}

// 商品sku查询
export function getProductSkuList(option) {
  return request.get(`/backend-product/productSku/listProductSku`, { params: option });
}

// 根据商品id查询下面的sku  标准
export function searchStandardSkuList(option) {
  return request.get(`/backend-product/productSkuShelf/listSkuShelf`, { params: option });
}

// 上下架商品sku  标准
export function updateStandardShelfSku(option) {
  return request.post(`/backend-product/productSkuShelf/saveUpdate`, option);
}

// 根据商品id查询下面的sku  优选
export function searchPreferredSkuList(option) {
  return request.get(`/backend-product/productPreferredSku/listSkuShelf`, { params: option });
}

// 上下架商品sku 优选
export function updatePreferredShelfSku(option) {
  return request.post(`/backend-product/productPreferredSku/saveUpdate`, option);
}

// 根据商品id查询下面的sku  促销
export function searchPromotionSkuList(option) {
  return request.get(`/backend-product/productPromotionsSku/listSkuShelf`, { params: option });
}

// 上下架商品sku 促销
export function updatePromotionShelfSku(option) {
  return request.post(`/backend-product/productPromotionsSku/saveUpdate`, option);
}

// 商品sku 促销调整价格
export function updatePromotionPriceSku(option) {
  return request.post(`/backend-product/productPromotionsSku/updatePriceAndStock`, option);
}

// 获取报价单所需商品
export function getQuotedProductSku(option) {
  return request.get(`/backend-product/productInfo/getPspPageInfo`, { params: option });
}

// 获取商品不在优选商品列表中的数据
export function getProductStandardList(option) {
  return request.get(`/backend-product/productInfo/getProductStandardPage`, { params: option });
}

// 获取商品不在新商品列表中的数据
export function getNewProductList(option) {
  return request.get(`/backend-product/productInfo/getNewProductPage`, { params: option });
}

// 获取商品不在促销商品列表中的数据
export function getPromotionsProductList(option) {
  return request.get(`/backend-product/productInfo/getProductPromotionsPage`, { params: option });
}

//  批量删除商品SKU
export function deleteBatchBySkuIds(option) {
  return request.delete(`/backend-product/productSku/batchDetele`, { params: option });
}

// 供应商分类排序上下移动
export function catalogSortMove(option) {
  return request.get('/backend-product/productCatalog/move', { params: option });
}

// 供应商分类排序上下移动最后
export function catalogSortMoveMost(option) {
  return request.get('/backend-product/productCatalog/moveBest', { params: option });
}

/**
 * 产品详情列表-导出
 */
export function exportExcelProductList(option) {
  return axios({
    method: 'post',
    data: option,
    url: `${baseUrl.baseUrl}/backend-product/productInfo/exportProductInfoExcel`,
    headers: {
      token: getToken()
    },
    responseType: 'blob'
  })
}

/**
 * 保存单个属性值
 * @param option
 * @returns {*}
 */
export function saveAttrValue(option) {
  return request.post(`/backend-product/productSellAttribute/saveSingle`, option);
}
// 标准产品列表
export function getStandardProductList(option) {
  return request.post(`/backend-product/productStandard/pageInfoForProductStandard`, option);
}
// 新增标准产品
export function saveProductStandard(option) {
  return request.post(`/backend-product/productStandard/saveProductStandard`, option);
}

// 删除标准产品
export function deleteProductStandard(option) {
  return request.post(`/backend-product/productSkuShelf/deleteProductSkuStandard`, option);
}

// 查询商品档案销售属性值
export function getProductSaleAttrValue(option) {
  return request.get(`/backend-product/productSellAttribute/list`, { params: option });
}

// 删除产品销售属性值
export function deleteProductSaleAttrValue(option) {
  return request.delete(`/backend-product/productSellAttributeValue/deleteProductSellAttributeValue`, { params: option });
}

// 排序产品销售属性值
export function sortProductSaleAttrValue(option) {
  return request.get(`/backend-product/productSellAttributeValue/sort`, { params: option });
}

// 新产品列表
export function getForProductNew(option) {
  return request.post(`/backend-product/productNew/pageInfoForProductNew`, option);
}

// 新增新产品
export function saveBatchProductNew(option) {
  return request.post(`/backend-product/productNew/saveProductNew`, option);
}
// 更新新产品
export function updateProductNew(option) {
  return request.post(`/backend-product/productNew/updateProductNew`, option);
}
// 获取新产品详情
export function getNewProductById(option) {
  return request.get(`/backend-product/productNew/detailById`, { params: option });
}

// 上下架产品sku  新产品
export function updateProductNewSku(option) {
  return request.post(`/backend-product/productNewSku/saveProductNewSku`, option);
}

// 上下架新产品
export function getProductNewSkuList(option) {
  return request.get(`/backend-product/productNewSku/getProductNewSkuList`, { params: option });
}

// 删除新产品
export function deleteProductNewSku(option) {
  return request.post(`/backend-product/productNewSku/deleteProductNewSku`, option);
}
// 获取产品不在新材料中的产品
export function getMaterialProductList(option) {
  return request.get(`/backend-product/productInfo/getMaterialProductPage`, { params: option });
}

// 新材料列表
export function getForProductMaterial(option) {
  return request.post(`/backend-product/productRawMaterial/pageProductRawMaterial`, option);
}

// 新材料SKU列表
export function getProductRawMaterialSkuList(option) {
  return request.get(`/backend-product/productRawMaterialSku/getProductRawMaterialSkuList`, { params: option });
}

// 新产品上下架操作
export function updateProductRawMaterialSku(option) {
  return request.post(`/backend-product/productRawMaterialSku/saveProductRawMaterialSku`, option);
}

// 新增新材料
export function saveBatchProductRawMaterial(option) {
  return request.post(`/backend-product/productRawMaterial/saveProductRawMaterial`, option);
}

// 删除新材料
export function deleteProductRawMaterialSku(option) {
  return request.post(`/backend-product/productRawMaterialSku/deleteProductRawMaterialSku`, option);
}
