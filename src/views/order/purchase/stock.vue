<template>
  <div class="app-container stock">
    <div class="edit-title">采购订单备货记录</div>
    <el-form ref="detailForm" :model="detailForm" label-width="140px" size="small" class="edit-form">
      <el-row class="row-item">
        <el-col :span="10">
          <el-form-item label="订单号：">
            {{detailForm.purchaseNo}}
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="订单日期：">
            {{detailForm.createTime | timeFmt}}
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="买方：">
            {{detailForm.buyerName}}
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="卖方：">
            {{detailForm.sellerName}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="row-item">
        <el-col>
          <el-form-item label="订单节点进度：">
            <order-step :list="allNodeList"></order-step>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="row-item">
        <div class="row-label" style="width: 100%">备货情况：</div>
        <el-form ref="stockForm" :model="stockForm" label-width="140px" size="small" :rules="stockFormRules">
          <el-form-item label="备货完成率：" prop="completeDegree">
            <el-input-number v-model="stockForm.completeDegree" controls-position="right" :min="0" :max="100" size="small" style="width: 200px"/> &nbsp;%
          </el-form-item>
          <el-form-item label="备货日期：" prop="attachmentUploadTime">
            <el-date-picker v-model="stockForm.attachmentUploadTime" type="datetime" placeholder="选择日期" style="width: 200px"/>
          </el-form-item>
          <el-form-item label="备货备注：" prop="eventRemark">
            <el-input v-model="stockForm.eventRemark" :autosize="{ minRows: 3, maxRows: 5}" type="textarea" size="small" clearable style="width: 60%"/>
          </el-form-item>
          <el-form-item label="附件：" prop="component" style="width: 500px">
            <el-upload
              ref="upload"
              :action="uploadActionUrl"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              :limit="1"
              :on-exceed="handleExceed"
              :on-success="handleSuccess"
              :file-list="fileList">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">请上传付款附件</div>
            </el-upload>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row class="row-item">
        <el-col>
          <div class="topBtns">
            <div class="row-label">备货记录表：</div>
          </div>
          <el-table
            :data="recordList"
            border
            fit
            size="mini"
            :header-cell-style="{background: '#a7bfee'}">
            <el-table-column
              align="center"
              type="index"
              label="序号"
              width="55">
            </el-table-column>

            <el-table-column align="center" width="170" label="备货日期" prop="attachmentUploadTime">
              <template slot-scope="scope">
                {{scope.row.attachmentUploadTime | timeFmt}}
              </template>
            </el-table-column>

            <el-table-column align="center" width="90" label="比率(%)" prop="completeDegree"/>

            <el-table-column align="center" label="备注" prop="eventRemark"/>

            <el-table-column align="center" label="附件" prop="attachmentName" >
              <template slot-scope="scope">
                <a href="javascript:void (0)" @click="exportFile(item.attachmentPath)"></a>{{scope.row.attachmentName}}
              </template>
            </el-table-column>

            <el-table-column align="center" label="操作" width="90" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="deleteRecord(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>

          </el-table>
        </el-col>
      </el-row>
      <el-form-item style="text-align: center;margin-top: 20px">
        <el-button type="primary" size="small" :loading="confirmLoading" @click="saveRecord('stockForm')">保存</el-button>
        <el-button type="danger" size="small" @click="closePage">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import OrderStep from '@/components/OrderStep'
import { getDetailPOFlowById, getNodePurchase, addPurchaseRecord, getPurchaseRecord, deleteOrderRecord } from '@/api/purchaseOrder'
import { uploadActionUrl } from '@/api/common'
import { parseTime } from '@/utils/index'
import moneyFmt from '@/mixin/moneyFmt'
export default {
  components: {
    OrderStep
  },
  mixins: [moneyFmt],
  data() {
    return {
      uploadActionUrl,
      confirmLoading: false,
      dialogType: '',
      detailForm: {
        sellerBankAddress: '',
        sellerBranchName: '',
        buyerBankAddress: '',
        buyerBranchName: ''
      },
      stockForm: {
        attachmentName: '',
        attachmentPath: '',
        attachmentUuid: '',
        eventRemark: '',
        attachmentUploadTime: '',
        completeDegree: '',
        attachmentType: 2
      },
      stockFormRules: {
        attachmentUploadTime: [{ required: true, message: '请选择日期', trigger: 'change' }],
        completeDegree: [{ required: true, message: '请填写比率', trigger: 'blur' }]
      },
      allNodeList: [],
      recordList: [],
      fileList: [],
      payFileList: []
    }
  },
  computed: {
    activeRoute() {
      let visitedViews = this.$store.state.tagsView.visitedViews;
      let activePath = visitedViews.filter(e => {
        return e.path === this.$route.path
      })[0];
      return activePath
    }
  },
  created() {
    this.getSaleOrderDetail();
    this.getTypeNodePurchaseOrder();
    this.getRecordList();
  },
  methods: {
    closePage() {
      this.$store.dispatch('delView', this.activeRoute).then(() => {
        this.$router.push({
          path: '/order/purchase/purchaseOrder'
        })
      })
    },
    clearForm() {
      this.stockForm.attachmentName = '';
      this.stockForm.attachmentPath = '';
      this.stockForm.attachmentUuid = '';
      this.stockForm.eventRemark = '';
      this.stockForm.attachmentUploadTime = '';
      this.stockForm.completeDegree = '';
      this.stockForm.id = '';
      this.stockForm.bid = '';
    },
    exportFile(url) {
      window.open(url)
    },
    handleRemove(file, fileList) {
      this.stockForm.attachmentName = '';
      this.stockForm.attachmentPath = '';
      this.stockForm.attachmentUuid = '';
    },
    handleExceed(files, fileList) {
      this.$message.warning('最多只能上传1个文件');
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    handleSuccess(res, file, fileList) {
      this.stockForm.attachmentName = file.name;
      this.stockForm.attachmentPath = res.data.filePath;
      this.stockForm.attachmentUuid = res.data.UUID;
    },
    saveRecord(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.confirmLoading = true;
          this.stockForm.purchaseOrderBId = this.$route.query.id;
          this.stockForm.id = this.$route.query.nodeId;
          this.stockForm.workflowProcessBId = this.$route.query.bId;
          addPurchaseRecord(this.stockForm).then(res => {
            this.confirmLoading = false;
            this.getRecordList();
            this.getTypeNodePurchaseOrder();
            this.$message.success('保存成功');
            this.clearForm();
            this.$refs.upload.clearFiles()
          }).catch(err => {
            this.confirmLoading = false;
            this.$message.error(err.message)
          });
        } else {
          this.$message.warning('请填写完整')
        }
      });
    },
    deleteRecord(id) {
      this.$confirm('是否删除该记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        deleteOrderRecord({ id: id }).then(res => {
          this.$message.success('删除成功');
          this.getRecordList()
        }).catch(err => {
          this.$message.error(err.message)
        })
      }).catch(() => {
      });
    },
    // 获取记录
    getRecordList() {
      getPurchaseRecord({ purchaseOrderBId: this.$route.query.id, workflowProcessBId: this.$route.query.bId }).then(res => {
        this.recordList = (res.data || []).map(e => {
          return { ...e }
        })
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 根据节点类型获取流程节点
    getTypeNodePurchaseOrder() {
      getNodePurchase({ purchaseBid: this.$route.query.id }).then(res => {
        this.allNodeList = res.data.map((e, index) => {
          e.currentCompletion = e.currentCompletion.toString();
          return { ...e }
        });
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    getSaleOrderDetail() {
      getDetailPOFlowById({ bid: this.$route.query.id }).then(res => {
        this.detailForm = Object.assign(this.detailForm, res.data);
      }).catch(err => {
        this.$message.error(err.message)
      })
    }
  },
  filters: {
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
    }
  }
}
</script>

<style lang="scss">
  @import '~@/styles/variables.scss';
  .stock {
    width: 80%;
    margin: 0 auto;
    border: 1px solid $border-light-color;
    .edit-title {
      position: relative;
      text-align: center;
      height: 50px;
      line-height: 50px;
      font-size: 20px;
      font-weight: bold;
      border-bottom: 1px solid $border-light-color;
    }
    .edit-form {
      margin-top: 20px;
    }
    .row-item {
      padding: 16px 0;
      border-bottom: 1px solid $border-light-color;
    }
    .topBtns {
      margin-bottom: 10px;
      text-align: right;
      button {
        margin: 0 10px;
      }
    }
    .row-label {
      float: left;
      line-height: 32px;
      font-weight: bold;
    }
  }
</style>
