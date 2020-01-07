<template>
  <div class="app-container check">
    <div class="edit-title">采购订单验收</div>
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
      <el-row>
        <el-col>
          <el-table
            :data="orderSkuList"
            border
            fit
            show-summary
            size="small"
            max-height="520"
            style="font-size: 12px"
            :header-cell-style="{background: '#a7bfee'}">
            <el-table-column align="center" type="selection" width="50"/>

            <el-table-column align="center" type="index" label="序号" width="55"/>

            <el-table-column align="center" min-width="285px" label="商品信息" prop="inquiryNo" >
              <template slot-scope="scope">
                <div class="table-goods">
                  <div class="goods-img"><img :src="scope.row.productImge" alt=""></div>
                  <div class="goods-text">
                    <div>{{scope.row.productCode}}/{{scope.row.productName}}</div>
                    <div>海关编码：{{scope.row.customsCode}}</div>
                  </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column align="center" min-width="180px" label="SKU描述" >
              <template slot-scope="scope">
                <div class="table-goods">
                  <div class="goods-text" style="text-align: center">
                    <div>{{scope.row.productDescription}}</div>
                    <div>sku编码：{{scope.row.skuCode}}</div>
                  </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column align="center" width="180px" label="备注">
              <template slot-scope="scope">
                {{scope.row.productRemark}}
              </template>
            </el-table-column>

            <el-table-column align="center" label="订货量" prop="productQuantity"/>

            <el-table-column align="center" label="单价" prop="productPrice"/>

            <el-table-column align="center" label="金额" prop="productAmount"/>

            <el-table-column align="center" width="150px" label="确收量" prop="receivedQuantity">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.receivedQuantity" controls-position="right" size="small" :min="0" @change="changeNumber(scope.row)"/>
              </template>
            </el-table-column>

            <el-table-column align="center" width="100" label="确收价" prop="receivedAmount"/>

          </el-table>
        </el-col>
      </el-row>
      <el-row class="row-item">
        <el-form ref="checkForm" :model="checkForm" label-width="140px" size="small" :rules="checkFormRules">
          <el-col :span="12">
            <el-form-item label="币种：">
              {{detailForm.orderCurrency}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="调整金额（+/-）：" prop="adjustAmount">
              <el-input-number v-model="checkForm.adjustAmount" size="small" style="width: 160px"/>
            </el-form-item>
          </el-col>
          <el-form-item label="附件上传：" style="width: 500px">
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
          <el-form-item label="备注说明：" prop="orderRemarks">
            <el-input v-model="checkForm.orderRemarks" :autosize="{ minRows: 3, maxRows: 5}" type="textarea" size="small" clearable style="width: 60%"/>
          </el-form-item>
          <el-form-item label="上传的文件：">
            <div class="record-file">
              <div class="file-item" v-for="(item,index) in recordList" :key="item.id">
                <a href="javascript: void (0)" @click="exportFile(item.attachmentPath)">{{index + 1}}、{{item.attachmentName}}</a>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="客户上传的文件：">
            <div class="record-file" v-if="cusRecordList.length">
              <div class="file-item" v-for="(item,index) in cusRecordList" :key="item.id">
                <a href="javascript: void (0)">{{index + 1}}、{{item.attachmentName}}</a>
              </div>
            </div>
            <div v-else>无上传文件</div>
          </el-form-item>
          <el-form-item label="客户备注说明：">
            <el-input v-model="checkForm.eventRemark" :autosize="{ minRows: 3, maxRows: 5}" type="textarea" size="small" readonly style="width: 60%"/>
          </el-form-item>
        </el-form>
      </el-row>
      <el-form-item style="text-align: center;margin-top: 20px">
        <el-button type="primary" size="small" :loading="confirmLoading" @click="saveClick('checkForm')">保存</el-button>
        <el-button type="danger" size="small" @click="closePage">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import OrderStep from '@/components/OrderStep'
import { getDetailPOFlowById, getNodePurchase, getPurchaseRecord, purchaseOrderCheck } from '@/api/purchaseOrder'
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
      checkForm: {
        attachmentName: '',
        attachmentPath: '',
        attachmentUuid: '',
        eventRemark: '',
        attachmentUploadTime: '',
        completeDegree: '',
        adjustAmount: '',
        orderRemarks: '',
        attachmentType: 4
      },
      checkFormRules: {
        adjustAmount: [{ required: true, message: '请填写调整金额', trigger: 'blur' }],
        orderRemarks: [{ required: true, message: '请填写备注', trigger: 'blur' }]
      },
      orderSkuList: [],
      allNodeList: [],
      recordList: [],
      cusRecordList: [],
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
    this.getTypeNodeSaleOrder();
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
    exportFile(url) {
      window.open(url)
    },
    handleRemove(file, fileList) {
      this.checkForm.attachmentName = '';
      this.checkForm.attachmentPath = '';
      this.checkForm.attachmentUuid = '';
    },
    handleExceed(files, fileList) {
      this.$message.warning('最多只能上传1个文件');
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    handleSuccess(res, file, fileList) {
      this.checkForm.attachmentName = file.name;
      this.checkForm.attachmentPath = res.data.filePath;
      this.checkForm.attachmentUuid = res.data.UUID;
    },
    changeNumber(item) {
      item.receivedAmount = (Number(item.receivedQuantity) * Number(item.productPrice)).toFixed(4)
    },
    saveClick(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.confirmLoading = true;
          // if (this.checkForm.attachmentName) {
          //   this.checkForm.purchaseOrderBId = this.$route.query.id;
          //   this.checkForm.id = this.$route.query.nodeId;
          //   this.checkForm.workflowProcessBId = this.$route.query.bId;
          //   this.checkForm.completeDegree = 100;
          //   addPurchaseRecord(this.checkForm).then(res => {
          //     this.confirmLoading = false;
          //     this.$message.success('保存成功');
          //   }).catch(err => {
          //     this.confirmLoading = false;
          //     this.$message.error(err.message)
          //   });
          // }

          this.checkForm.workFlowid = this.$route.query.nodeId;
          this.checkForm.priceDifference = this.checkForm.adjustAmount;
          this.checkForm.purchaseOrderBId = this.detailForm.bid;
          this.checkForm.productsList = this.orderSkuList;
          this.checkForm.workflowProcessBId = this.$route.query.bId;
          this.checkForm.completeDegree = 100;
          purchaseOrderCheck(this.checkForm).then(res => {
            this.confirmLoading = false;
            this.closePage();
          }).catch(err => {
            this.confirmLoading = false;
            this.$message.error(err.message)
          });
        } else {
          this.$message.warning('请填写完整')
        }
      });
    },
    // 获取记录
    getRecordList() {
      getPurchaseRecord({ purchaseOrderBId: this.$route.query.id }).then(res => {
        this.recordList = (res.data || []).filter(e => {
          return e.attachmentPath
        })
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 根据节点类型获取流程节点
    getTypeNodeSaleOrder() {
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
        this.checkForm.adjustAmount = Number(this.detailForm.priceDifference);
        this.checkForm.orderRemarks = this.detailForm.orderRemarks;
        this.orderSkuList = this.detailForm.productList.map(e => {
          e.receivedQuantity = e.receivedQuantity || e.productQuantity;
          e.receivedAmount = (Number(e.receivedQuantity) * Number(e.productPrice)).toFixed(4);
          return { ...e }
        })
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
  .check {
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
    .table-goods {
      display: flex;
      display: -webkit-flex;
      .goods-img {
        width: 90px;
        height: 90px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .goods-text {
        margin-left: 10px;
        flex: 1;
        display: flex;
        display: -webkit-flex;
        flex-direction: column;
        justify-content: space-around;
        text-align: left;
        >div {
          font-size: 12px;
        }
      }
    }
    .record-file {
      display: flex;
      display: -webkit-flex;
      flex-wrap: wrap;
      .file-item {
        min-width: 180px;
        max-width: 230px;
        margin: 0 10px;
        white-space:nowrap;
        overflow: hidden;
        text-overflow:ellipsis;
        flex: 1;
        a {
          text-decoration: underline;
        }
      }
    }
  }
</style>
