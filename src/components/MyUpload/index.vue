<template>
  <el-upload
    class="upload-demo"
    :action="uploadActionUrl"
    :multiple="false"
    :on-success="uploadSuccess"
    :before-remove="beforeRemove"
    :on-remove="uploadRemove"
    :show-file-list="showFile"
    :file-list="fileList">
    <el-button size="mini" type="primary">{{$t('common.table.upload')}}</el-button>
    <div slot="tip" v-show="showFile" class="el-upload__tip">Please Upload file</div>
  </el-upload>
</template>
<script>
import { uploadActionUrl } from '@/api/common'
export default {
  name: 'MyUpload',
  data() {
    return {
      uploadActionUrl
    }
  },
  props: {
    accept: {
      type: Object,
      default: () => {}
    }, // 接收到的自定义的参数
    onSuccess: {
      type: Function,
      default: () => undefined
    },
    onRemove: {
      type: Function,
      default: () => undefined
    },
    fileList: {
      type: Array,
      default: () => []
    },
    showFile: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    uploadRemove() {
      // es5写法
      // var arg = [].slice.call(arguments);
      // arg.push(this.accept); //返回参数添加自定义的参数
      // this.onRemove.apply(this,arg);

      // es6
      this.onRemove(...arguments, this.accept);
    },
    uploadSuccess() {
      // var arg = [].slice.call(arguments);
      // arg.push(this.accept);
      // this.onSuccess.apply(this,arg);

      this.onSuccess(...arguments, this.accept);
    },
    beforeRemove(file) {
      return this.$confirm(`Are you sure you want to remove ${ file.name }？`);
    }
  }
}
</script>
