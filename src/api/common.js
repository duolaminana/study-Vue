import request from '@/utils/request'

/* 公共的接口api */

// 下载文件
export function exportFile(option) {
  return request.get(`/backend-product/upload/downloadFile`, { params: option });
}

// 上传图片路径
export const uploadActionUrl = process.env.VUE_APP_UPLOAD_API + '/supplier/upload/uploadFile';

// // 多附件打包下载
// export function downloadFilesList(option) {
//   return request.get(`/supplier/upload/downloadFilesList`, { params: option });
// }
