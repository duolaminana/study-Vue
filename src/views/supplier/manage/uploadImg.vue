<template>
  <div class="upload-container">
    <div class="search-box">
      <el-upload
        :action="uploadActionUrl"
        accept="image/jpeg,image/gif,image/png"
        :before-upload="onBeforeUpload"
        on-success="uploadSuccess"
        multiple
        :limit="5">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">请上传图片格式文件</div>
      </el-upload>
    </div>
  </div>
</template>

<script>
import { uploadActionUrl } from '@/api/common';
export default {
  data() {
    return {
      list: null,
      listLoading: true,
      dialogVisible: false,
      dialogType: '',
      uploadActionUrl,
      imgFilePath: ''
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    onBeforeUpload(file) {
      const isIMAGE = file.type === 'image/jpeg' || 'image/gif' || 'image/png';
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isIMAGE) {
        this.$message.error('上传文件只能是图片格式!');
      }
      if (!isLt1M) {
        this.$message.error('上传文件大小不能超过 1MB!');
      }
      return isIMAGE && isLt1M;
    },
    uploadSuccess(response, file, fileList) {
      this.imgFilePath = response.data;
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      };
      return statusMap[status]
    }
  }
}
</script>

<style lang="scss">
  @import '~@/styles/variables.scss';
  .upload-container {
    .search-box {
      margin-bottom: 15px;
      border-bottom: 1px solid $border-light-color;
    }
    .topBtns {
      margin-bottom: 10px;
      text-align: right;
      .export {
        background: green;
        border: green;
      }
      button {
        margin: 0 10px;
      }
    }
    .menuDialog {
      .el-dialog {
        width: 500px;
      }
    }
  }
</style>
