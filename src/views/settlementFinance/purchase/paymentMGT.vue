<template>
  <div class="app-container editPayRecord">
    <div class="edit-title">付款记录管理</div>
    <el-form ref="detailForm" :model="detailForm" label-width="140px" size="small" class="edit-form">
      <el-row class="row-item">
        <el-col :span="12">
          <el-form-item label="采购订单编号：">
            {{detailForm.purchaseOrder.purchaseNo}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="订单日期：" label-width="80">
            {{detailForm.purchaseOrder.createTime | timeFmt}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="row-item">
        <el-col>
          <el-form-item label="付款流程：">
            <order-step :list="allNodeList" :active="nodeActive"></order-step>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-item" justify="space-around">
        <el-col :span="11">
          <div class="row-label">供应商信息：</div>
          <table class="form-table" border="0" cellspacing="0" cellpadding="0" width="100%">
            <tr>
              <td width="40%">供应商名称</td>
              <td width="60%">
                {{detailForm.purchaseOrder.sellerName}}
              </td>
            </tr>
            <tr>
              <td>简称</td><td>{{detailForm.purchaseOrder.sellerShort}}</td>
            </tr>
            <tr>
              <td>联系人</td><td>{{detailForm.purchaseOrder.sellerContact}}</td>
            </tr>
            <tr>
              <td>联系方式</td><td>{{detailForm.purchaseOrder.sellerTelephone}}</td>
            </tr>
            <tr>
              <td>地址</td><td>{{detailForm.purchaseOrder.sellerAddress}}</td>
            </tr>
            <tr>
              <td>国家</td><td>{{detailForm.purchaseOrder.sellerCountryCode}}</td>
            </tr>
            <!-- <tr>
              <td>银行账号</td><td>{{detailForm.buyerBankAccount}}</td>
            </tr> -->
            <!-- <tr>
              <td>SWIF编码</td><td>{{detailForm.buyerSwiftcode}}</td>
            </tr>
            <tr>
              <td>目的港口</td><td>{{detailForm.arrivePort}}</td>
            </tr> -->
          </table>
        </el-col>
        <el-col :span="11">
          <div class="row-label">账户信息：</div>
          <table class="form-table" border="0" cellspacing="0" cellpadding="0" width="100%">
            <!-- <tr>
              <td width="40%">账号名称</td>
              <td width="60%">
                {{detailForm.purchaseOrder.sellerName}}
              </td>
            </tr> -->
            <tr>
              <td width="40%">银行名称</td>
              <td width="60%">
                {{detailForm.purchaseOrder.sellerBank}}
              </td>
            </tr>
            <!-- <tr>
              <td>国家</td><td>{{detailForm.sellerCountryCode}}</td>
            </tr> -->
            <!-- <tr>
              <td>银行名称</td><td>{{detailForm.purchaseOrder.sellerBank}}</td>
            </tr> -->
            <!-- <tr>
              <td>支行名称</td><td>{{detailForm.purchaseOrder.sellerBranchName}}</td>
            </tr> -->
            <!-- <tr>
              <td>支行地址</td><td>{{detailForm.purchaseOrder.sellerBankAddress}}</td>
            </tr> -->
            <tr>
              <td>银行账号</td><td>{{detailForm.purchaseOrder.sellerBankAccount}}</td>
            </tr>
            <tr>
              <td>SWIF编码</td><td>{{detailForm.purchaseOrder.sellerSwifcode}}</td>
            </tr>
            <!-- <tr>
              <td>出发港口</td><td>{{detailForm.departurePort}}</td>
            </tr> -->
          </table>
        </el-col>
      </el-row>
      <el-row class="row-item">
        <div class="row-label" style="width: 100%">付款信息：</div>
        <el-col :span="12">
          <el-form-item label="订单总金额">
            {{detailForm.purchaseOrder.totalAmount | moneyFmt}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="订单货币">
            {{detailForm.paymentCurrency}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="待付金额">
            {{detailForm.pendingPayment | moneyFmt}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="申请金额">
            {{detailForm.applyPaymentAmount | moneyFmt}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="申请时间">
            {{detailForm.applyPaymentDate | timeFmt}}
          </el-form-item>
        </el-col>
        <!-- <el-col :span="24">
          <el-form-item label="备注">
            <el-input type="textarea" v-model="detailForm.remark"></el-input>
          </el-form-item>
        </el-col> -->
      </el-row>
      <el-row class="row-item">
        <el-col>
          <div class="topBtns">
            <div class="row-label">付款记录表：</div>
            <el-button type="primary" size="small" @click="openDialog('add')" v-if="$route.query.isApply==2">新增</el-button>
          </div>
          <el-table
            :data="recRecordList"
            border
            fit
            size="mini"
            :header-cell-style="{background: '#a7bfee'}">
           <el-table-column
             label="序号"
             align="center"
             type="index"
             width="55">
           </el-table-column>

            <el-table-column align="center" label="付款日期" prop="paymentTime" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.paymentTime | timeFmt}}
              </template>
            </el-table-column>

            <el-table-column align="center" label="货币" prop="paymentCurrency" show-overflow-tooltip/>

            <el-table-column align="center" label="金额" prop="paymentAmount" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.paymentAmount | moneyFmt}}
              </template>
            </el-table-column>

            <el-table-column align="center" label="相关附件" prop="fileName" show-overflow-tooltip/>

            <!-- <el-table-column align="center" label="备注" prop="collectionRemark" show-overflow-tooltip/> -->

            <el-table-column align="center" label="操作" width="150" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <!-- <el-button type="primary" size="mini" class="export" @click="openDetail(scope.row)">详情</el-button> -->
                <el-button type="primary" size="mini" @click="openDialog('edit', scope.row)" v-if="$route.query.isApply==2">编辑</el-button>
                <!-- <a :href="scope.row.paymentDocList[0].attachmentPath" :download="scope.row.paymentDocList[0].attachmentName">下载</a> -->
                <el-button type="primary" v-if="scope.row.paymentDocList.length == 1" size="mini" @click="exportfile(scope.row.paymentDocList[0])">查看附件</el-button>
                <el-dropdown @command="exportfile" v-else-if="scope.row.paymentDocList.length > 1">
                  <el-button type="primary" size="mini">
                    查看附件<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="(item,index) in scope.row.paymentDocList" :command="item" :key="index">{{item.attachmentName}}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>

          </el-table>
        </el-col>
      </el-row>
      <ApprovalFlow @close="closePage" v-if="$route.query.isApply === undefined"></ApprovalFlow>
      <el-form-item style="text-align: center;margin-top: 20px" v-else>
        <el-button type="primary" size="small" @click="applyLogistics" v-if="$route.query.isApply==1">申请</el-button>
        <el-button type="danger" size="small" @click="closePage">返回</el-button>
      </el-form-item>
    </el-form>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType=== 'add' ? '新增付款记录' : '编辑付款记录'" width="450px" center close-on-click-modal @close="clearData">
      <el-form ref="addForm" :model="addForm" label-width="90px" label-position="right" size="small" :rules="addFormRules">
        <el-form-item label="付款日期" prop="paymentTime">
          <el-date-picker type="datetime" placeholder="选择日期" v-model="addForm.paymentTime" style="width: 100%"/>
        </el-form-item>
        <el-form-item label="币种" prop="paymentCurrency">
          <el-select
            style="width: 100%"
            filterable
            remote
            :remote-method="getCurrencyCodeList"
            :loading="loading1"
            v-model="addForm.paymentCurrency"
            disabled
            placeholder="请输入币种中文名或者币种代码">
            <el-option v-for="(item, index) in currencyCodeList" :label="item.searchCurrencyCodeStr" :value="item.searchCurrencyCodeStr" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="付款金额" prop="paymentAmount">
          <el-input v-model.number="addForm.paymentAmount" type="number" clearable placeholder="付款金额"/>
        </el-form-item>
        <!-- <el-form-item label="备注" prop="collectionRemark">
          <el-input v-model="addForm.collectionRemark" :autosize="{ minRows: 3, maxRows: 5}" type="textarea" size="small" clearable style="width: 100%"/>
        </el-form-item> -->
        <el-form-item label="附件" prop="component">
          <el-upload
            ref="upload"
            :action="uploadActionUrl"
            :on-remove="handleRemove"
            :on-preview="detailComponent"
            :before-remove="beforeRemove"
            :limit="5"
            :on-exceed="handleExceed"
            :on-success="handleSuccess"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">请上传付款附件</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" :loading="confirmLoading" @click="savePayRecord('addForm')">保存</el-button>
        <el-button type="danger" size="small" @click="dialogVisible=false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisible1" title="付款记录详情" width="450px" center close-on-click-modal>
      <el-form :model="addFormDetail" label-width="90px" label-position="right" size="small">
        <el-form-item label="付款日期" prop="paymentTime">
          <el-date-picker type="datetime" placeholder="选择日期" v-model="addFormDetail.paymentTime" disabled style="width: 100%"/>
        </el-form-item>
        <el-form-item label="币种" prop="paymentCurrency">
          <el-select
            style="width: 100%"
            filterable
            remote
            :remote-method="getCurrencyCodeList"
            :loading="loading1"
            v-model="addFormDetail.paymentCurrency"
            disabled
            placeholder="请输入币种中文名或者币种代码">
            <el-option v-for="(item, index) in currencyCodeList" :label="item.searchCurrencyCodeStr" :value="item.searchCurrencyCodeStr" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="付款金额" prop="paymentAmount">
          <el-input v-model.number="addFormDetail.paymentAmount" type="number" disabled clearable placeholder="菜单图标"/>
        </el-form-item>
        <el-form-item label="备注" prop="collectionRemark">
          <el-input v-model="addFormDetail.collectionRemark" :autosize="{ minRows: 3, maxRows: 5}" type="textarea" size="small" readonly style="width: 100%"/>
        </el-form-item>
        <el-form-item label="附件" prop="component">
          <el-table
            :data="fileList"
            border
            fit
            style="margin: 10px 0"
            size="small"
            :header-cell-style="{background: '#a7bfee'}">

            <el-table-column align="center" label="附件名称" prop="attachmentName" >
              <template slot-scope="scope">
                <a href="javascript: void (0)" @click="exportFile(item.attachmentPath)">{{scope.row.attachmentName}}</a>
              </template>
            </el-table-column>

            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" class="export" @click="exportPactFile(scope.row)">查看</el-button>
              </template>
            </el-table-column>

          </el-table>
<!--          <p v-for="item in fileList" :key="item.id">{{item.attachmentName}}</p>-->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="dialogVisible1=false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ApprovalFlow from '@/components/ApprovalFlow'
import OrderStep from '@/components/OrderStep'
import { selectCurrencyCodeListApi, getSupplyCompanyList, selectCompanyBankAccountListApi } from '@/api/system'
import { listCustomerInfoContactApi, listCustomerBank } from '@/api/customer'
import { detailPaymentDataApi, addPaymentRecord, updatePaymentsRecord, submitApproval } from '@/api/finance'
import { uploadActionUrl } from '@/api/common'
import { parseTime } from '@/utils/index'
import moneyFmt from '@/mixin/moneyFmt'
export default {
  components: {
    OrderStep,
    ApprovalFlow
  },
  mixins: [moneyFmt],
  data() {
    return {
      uploadActionUrl,
      dialogVisible: false,
      dialogVisible1: false,
      loading1: false,
      confirmLoading: false,
      dialogType: '',
      nodeActive: 0,
      detailForm: {
        sellerBankAddress: '',
        sellerBranchName: '',
        buyerBankAddress: '',
        buyerBranchName: '',
        coolectionAmount: '',
        paidAmount: '',
        lastPaymentTime: '',
        purchaseOrder: {}
      },
      customerInfoList: [],
      sysCustomerInfoList: [],
      modalList: [],
      allNodeList: [],
      customerBankList: [],
      sysBankList: [],
      recRecordList: [],
      currencyCodeList: [],
      fileList: [],
      payFileList: [],
      addForm: {
        paymentTime: '',
        paymentCurrency: '',
        paymentAmount: '',
        collectionRemark: ''
      },
      addFormDetail: {
        paymentTime: '',
        paymentCurrency: '',
        paymentAmount: '',
        collectionRemark: ''
      },
      addFormRules: {
        paymentTime: [{ required: true, message: '请选择日期', trigger: 'change' }],
        paymentAmount: [{ type: 'number', required: true, message: '请填写金额', trigger: 'blur' }]
      }
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
    this.getCustomerInfoListFun();
    this.getSysCustomerInfoListFun();
    this.getSaleOrderDetail();
  },
  methods: {
    applyLogistics() {
      submitApproval({ bid: this.detailForm.bid }).then(res => {
        this.$message.success('操作成功，等待审核');
        this.closePage()
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 查看附件
    exportfile(row) {
      window.open(row.attachmentPath)
    },
    exportPactFile(row) {
      window.open(row.attachmentPath)
    },
    closePage() {
      this.$store.dispatch('delView', this.activeRoute).then(() => {
        this.$router.push({
          path: '/settlementFinance/payment/purchaseOrder'
        })
      })
    },
    clearData() {
      this.addForm.id = '';
      this.addForm.paymentTime = '';
      this.addForm.paymentAmount = '';
      this.addForm.collectionRemark = '';
      this.addForm.salesCollectionProofList = [];
      this.fileList = [];
    },
    exportFile(url) {
      window.open(url)
    },
    // 获取客户银行列表
    getCustomerBankList(id, bankId) {
      listCustomerBank({ customerBId: id, pageNum: 1, pageSize: 999 }).then(res => {
        this.customerBankList = res.data.list || [];
        // let obj = this.customerBankList.filter(e => {
        //   return e.id === bankId
        // })[0];
        // this.detailForm.buyerBankAddress = obj.bankAddress;
        // this.detailForm.buyerBranchName = obj.branchName;
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 获取主体企业银行卡列表
    getCompanyBankList(id, bankId) {
      selectCompanyBankAccountListApi({ companyInfoBId: id, pageNum: 1, pageSize: 999 }).then(res => {
        // this.sysBankList = res.data.list || [];
        // let obj = this.sysBankList.filter(e => {
        //   return e.id === bankId
        // })[0];
        // this.detailForm.sellerBankAddress = obj.bankAddress;
        // this.detailForm.sellerBranchName = obj.branchName;
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    openDialog(type, row) {
      this.clearData();
      this.dialogVisible = true;
      this.dialogType = type;
      if (type === 'edit') {
        this.addForm = Object.assign(this.addForm, row);
        this.fileList = this.addForm.salesCollectionProofList.map(e => {
          e.url = e.attachmentPath;
          e.name = e.attachmentName;
          return { ...e }
        })
      }
    },
    openDetail(row) {
      this.dialogVisible1 = true;
      this.addFormDetail = Object.assign(this.addForm, row);
      this.fileList = this.addFormDetail.salesCollectionProofList.map(e => {
        e.url = e.attachmentPath;
        e.name = e.attachmentName;
        return { ...e }
      })
    },
    handleRemove(file, fileList) {
      // this.payFileList = [];
      this.payFileList = fileList.map(e => {
        e.attachmentName = e.name;
        e.attachmentPath = e.attachmentPath || e.response.data.filePath
        e.attachmentUuid = e.attachmentUuid || e.response.data.UUID;
        return { ... e }
      })
    },
    detailComponent(file) {
      // console.log(file);
      window.open(file.attachmentPath)
    },
    handleExceed(files, fileList) {
      this.$message.warning('最多只能上传5个文件');
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    handleSuccess(res, file, fileList) {
      this.payFileList = fileList.map(e => {
        e.attachmentName = e.name;
        e.attachmentPath = e.attachmentPath || e.response.data.filePath
        e.attachmentUuid = e.attachmentUuid || e.response.data.UUID;
        return { ... e }
      })
    },
    savePayRecord(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let api = this.dialogType === 'add' ? addPaymentRecord : updatePaymentsRecord;
          this.addForm.paymentDocList = this.payFileList.length ? this.payFileList : this.addForm.paymentDocList;
          // this.addForm.salesOrderBId = this.detailForm.logisticsOrderDetail.supplierInfo.bid;
          this.addForm.nodeType = 2;
          this.addForm.paymentOrderType = 1
          this.addForm.paymentInstructNo = this.$route.query.paymentInstructNo
          this.addForm.paymentAssociatedOrders = this.detailForm.purchaseOrder.purchaseNo
          this.addForm.associatedOrderBId = this.detailForm.purchaseOrder.bid
          this.addForm.customerBId = this.detailForm.purchaseOrder.supplierBId
          api(this.addForm).then(res => {
            this.$message.success(this.dialogType === 'add' ? '新增成功' : '保存成功');
            this.fileList = [];
            this.$refs.upload.clearFiles();
            this.dialogVisible = false;
            this.getSaleOrderDetail();
          }).catch(err => {
            this.$message.error(err.message)
          })
        } else {
          this.$message.warning('请填写完整')
        }
      });
    },
    // 客户列表
    getCustomerInfoListFun() {
      listCustomerInfoContactApi().then(res => {
        this.customerInfoList = res.data || []
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 主体企业列表
    getSysCustomerInfoListFun() {
      getSupplyCompanyList().then(res => {
        this.sysCustomerInfoList = res.data || []
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 查询获取币种
    getCurrencyCodeList(query) {
      if (query !== '') {
        this.loading1 = true;
        setTimeout(() => {
          this.loading1 = false;
          selectCurrencyCodeListApi(query).then(res => {
            this.currencyCodeList = res.data || []
          })
        }, 200);
      } else {
        this.currencyCodeList = [];
      }
    },
    // 根据节点类型获取流程节点
    getSaleOrderDetail() {
      detailPaymentDataApi({ bid: this.$route.query.id }).then(res => {
        console.log(res.data)
        this.detailForm = Object.assign(this.detailForm, res.data);
        this.addForm.paymentCurrency = this.detailForm.paymentCurrency;
        this.recRecordList = (res.data.paymentRecordVoList || []).map(e => {
          e.fileName = e.paymentDocList.map(e => e.attachmentName).join(',');
          return { ...e }
        })
        this.allNodeList = res.data.purchaseOrder.wfplist.filter((e) => {
          e.currentCompletion = e.currentCompletion.toString();
          return e.nodeType === 2
        });
        this.getCustomerBankList(this.detailForm.customerBId, this.detailForm.buyerBankId);
        this.getCompanyBankList(this.detailForm.sysCompanyBId, this.detailForm.sellerBankId);
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
  .editPayRecord {
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
