<template>
  <div class="app-container saleOrder">
    <div class="search-box">
      <el-form label-width="90px" inline size="small">
        <div>
          <el-form-item label="供应商名称">
            <el-input v-model="postData.sellerName" clearable placeholder="请输入供应商名称" style="width: 200px" />
          </el-form-item>
          <el-form-item label="供应商编码">
            <el-input v-model="postData.sellerCode" clearable placeholder="请输入供应商编码" style="width: 200px" />
          </el-form-item>
          <el-form-item style="padding-left: 90px;">
            <el-button type="primary" class="export" @click="searchData">搜索</el-button>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="订单号">
            <el-input v-model="postData.purchaseNo" clearable placeholder="请输入订单号" style="width: 200px" />
          </el-form-item>
          <el-form-item label="订单日期">
            <el-date-picker
              v-model="rangeTime"
              type="daterange"
              align="right"
              unlink-panels
              clearable
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 360px"
              :picker-options="pickerOptions"
              @change="getSearchTime">
            </el-date-picker>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="addClick(1)">从销售订单新增</el-button>
      <el-button type="primary" size="small" @click="addClick(2)">新增</el-button>
      <el-button type="primary" size="small" @click="deleteClick">删除</el-button>
      <el-button type="primary" size="small" @click="outportData" class="export">导出excel</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="dataList"
      element-loading-text="正在查询中。。。"
      border
      fit
      size="mini"
      row-key="id"
      :header-cell-style="{background: '#a7bfee'}"
      @selection-change="getSelect">
      <el-table-column
        align="center"
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column label="订单号" prop="purchaseNo" show-overflow-tooltip/>

      <el-table-column label="供应商编码" prop="sellerCode" show-overflow-tooltip/>

      <el-table-column label="供应商名称" prop="sellerName" show-overflow-tooltip/>

      <el-table-column label="电话" prop="sellerTelephone" show-overflow-tooltip/>

      <el-table-column align="center" width="70" label="SKU数" prop="skuCount" />

      <el-table-column align="center" label="金额" prop="netTotalAmount" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.totalAmount | moneyFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="100" label="修改人" prop="updateUserId" show-overflow-tooltip/>

      <el-table-column align="center" width="150" label="订单日期" prop="orderCreateTime">
        <template slot-scope="scope">
          {{scope.row.orderCreateTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="80px" label="状态" prop="orderStatus">
        <template slot-scope="scope">
          {{scope.row.orderStatus | orderStatusFmt}}
        </template>
      </el-table-column>

      <el-table-column header-align="center" label="操作" width="280" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" class="export table-btn-width" @click="goRouter(0, scope.row.bid)">查看</el-button>
          <el-button type="primary" size="mini" class="table-btn-width" v-if="scope.row.orderStatus === 1 || scope.row.orderStatus === 3" @click="goRouter(1, scope.row.bid)">编辑</el-button>
          <el-button type="primary" size="mini" class="table-btn-width" v-if="scope.row.orderStatus === 4" @click="goRouter(4, scope.row.bid)">确认/作废</el-button>
          <el-button type="primary" size="mini" class="table-btn-width" v-if="scope.row.orderStatus === 5" @click="openDialog(scope.row.bid)">状态维护</el-button>
          <el-button type="primary" size="mini" class="table-btn-width" v-if="scope.row.orderStatus === 5" @click="openPayDialog(scope.row)">付款说明</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList" ></Pagination>

    <el-dialog :visible.sync="dialogVisible" title="采购订单状态维护" width="1100px" center :close-on-click-modal="false">
      <el-form ref="detailForm" :model="detailForm" label-width="120px" size="small">
        <el-row>
          <el-col :span="8">
            <el-form-item label="订单号">
              {{detailForm.purchaseNo}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="订单日期">
              {{detailForm.createTime | timeFmt}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-item" justify="space-around">
          <el-col :span="11">
            <table class="form-table" border="0" cellspacing="0" cellpadding="0" width="100%">
              <tr>
                <td width="40%">买方</td>
                <td width="60%">
                  {{detailForm.buyerName}}
                </td>
              </tr>
              <tr>
                <td>买方联系人</td>
                <td>
                  {{detailForm.buyerContactBy}}
                </td>
              </tr>
              <tr>
                <td>买方地址</td><td>{{detailForm.buyerAddress}}</td>
              </tr>
              <tr>
                <td>买方电话</td><td>{{detailForm.buyerTelephone}}</td>
              </tr>
              <tr>
                <td>买方邮箱</td><td>{{detailForm.buyerEmail}}</td>
              </tr>
              <tr>
                <td><span class="label-required">开户银行</span></td>
                <td>
                  {{detailForm.buyerBank}}
                </td>
              </tr>
              <tr>
                <td>银行账号</td><td>{{detailForm.buyerBankAccount}}</td>
              </tr>
              <tr>
                <td>SWIF编码</td><td>{{detailForm.buyerSwiftcode}}</td>
              </tr>
              <tr>
                <td>目的港口</td><td>{{detailForm.arrivePort}}</td>
              </tr>
            </table>
          </el-col>
          <el-col :span="11">
            <table class="form-table" border="0" cellspacing="0" cellpadding="0" width="100%">
              <tr>
                <td width="40%">卖方</td>
                <td width="60%">
                  {{detailForm.sellerName}}
                </td>
              </tr>
              <tr>
                <td>卖方联系人</td><td>{{detailForm.sellerContact}}</td>
              </tr>
              <tr>
                <td>卖方地址</td><td>{{detailForm.sellerAddress}}</td>
              </tr>
              <tr>
                <td>卖方联系电话</td><td>{{detailForm.sellerTelephone}}</td>
              </tr>
              <tr>
                <td>卖方邮箱</td><td>{{detailForm.sellerEmail}}</td>
              </tr>
              <tr>
                <td><span class="label-required">开户银行</span></td>
                <td>
                  {{detailForm.sellerBank}}
                </td>
              </tr>
              <tr>
                <td>银行账号</td><td>{{detailForm.sellerBankAccount}}</td>
              </tr>
              <tr>
                <td>SWIF编码</td><td>{{detailForm.sellerSwifcode}}</td>
              </tr>
              <tr>
                <td>出发港口</td><td>{{detailForm.departurePort}}</td>
              </tr>
            </table>
          </el-col>
        </el-row>
        <div style="margin-top: 20px">
          订单节点进度
          <!--<el-button type="primary" size="mini" style="float: right" @click="openFiles(detailForm.bid)">相关文件上传</el-button>-->
        </div>

        <div>
          <order-step :list="allNodeList" :canclick="true" :type="1"></order-step>
        </div>

        <div class="related-file" v-if="detailForm.orderStatus === 5" @click="openRecordDialog">采购订单相关记录和附件</div>
        <el-popover
          placement="bottom-start"
          trigger="hover">
          <el-table
            fit
            size="mini"
            :data="saleOrderWithPurchaseList">
            <el-table-column width="120" align="center" prop="orderNo" label="订单号"></el-table-column>
            <el-table-column width="150" align="center" prop="buyerName" label="买方"></el-table-column>
            <el-table-column width="120" align="center" prop="sellerName" label="卖方"></el-table-column>
            <el-table-column align="center" width="160" label="订单日期">
              <template slot-scope="scope">
                {{scope.row.createTime | timeFmt}}
              </template>
            </el-table-column>
          </el-table>
          <div slot="reference" class="related-file" style="width: 120px">相关销售订单</div>
        </el-popover>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="dialogVisible=false">关闭</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisible1" title="采购订单文件和记录" width="900px" center :close-on-click-modal="false">
      <el-form label-width="120px" size="small">
        <el-row>
          <el-col :span="10">
            <el-form-item label="订单号">
              {{detailForm.purchaseNo}}
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="订单日期">
              {{detailForm.createTime | timeFmt}}
            </el-form-item>
          </el-col>
        </el-row>
        <div style="margin-top: 20px">
          订单节点进度
        </div>
        <order-step :list="allNodeList"></order-step>

        <ApprovalHistory></ApprovalHistory>

        <div class="file-record-item">
          <div class="file-record-label">付款凭证：</div>
          <el-table
            :data="payRecordList"
            border
            fit
            size="small"
            max-height="200"
            :header-cell-style="{background: '#a7bfee'}">
            <el-table-column
              align="center"
              type="index"
              label="序号"
              width="55">
            </el-table-column>

            <el-table-column align="center" width="180" label="上传时间">
              <template slot-scope="scope">
                {{scope.row.createTime | timeFmt}}
              </template>
            </el-table-column>

            <el-table-column align="center" label="凭证">
              <template slot-scope="scope">
                {{scope.row.attachmentName}}
              </template>
            </el-table-column>

            <el-table-column align="center" width="120" label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" class="export" @click="exportFile(scope.row.attachmentPath)">下载</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="file-record-item">
          <div class="file-record-label">备货凭证：</div>
          <el-table
            :data="stockRecordList"
            border
            fit
            size="small"
            max-height="200"
            :header-cell-style="{background: '#a7bfee'}">
            <el-table-column
              align="center"
              type="index"
              label="序号"
              width="55">
            </el-table-column>

            <el-table-column align="center" width="180" label="上传时间">
              <template slot-scope="scope">
                {{scope.row.attachmentUploadTime | timeFmt}}
              </template>
            </el-table-column>

            <el-table-column align="center" label="凭证">
              <template slot-scope="scope">
                {{scope.row.attachmentName || '无凭证'}}
              </template>
            </el-table-column>

            <el-table-column align="center" width="120" label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" class="export" @click="exportFile(scope.row.attachmentPath)">下载</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="file-record-item">
          <div class="file-record-label">发货凭证：</div>
          <el-table
            :data="deliveryRecordList"
            border
            fit
            size="small"
            max-height="200"
            :header-cell-style="{background: '#a7bfee'}">
            <el-table-column
              align="center"
              type="index"
              label="序号"
              width="55">
            </el-table-column>

            <el-table-column align="center" width="180" label="上传时间">
              <template slot-scope="scope">
                {{scope.row.attachmentUploadTime | timeFmt}}
              </template>
            </el-table-column>

            <el-table-column align="center" label="凭证">
              <template slot-scope="scope">
                {{scope.row.attachmentName || '无凭证'}}
              </template>
            </el-table-column>

            <el-table-column align="center" width="120" label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" class="export" @click="exportFile(scope.row.attachmentPath)">下载</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="file-record-item">
          <div class="file-record-label">验收凭证：</div>
          <el-table
            :data="checkRecordList"
            border
            fit
            size="small"
            max-height="200"
            :header-cell-style="{background: '#a7bfee'}">
            <el-table-column
              align="center"
              type="index"
              label="序号"
              width="55">
            </el-table-column>

            <el-table-column align="center" width="180" label="上传时间">
              <template slot-scope="scope">
                {{scope.row.attachmentUploadTime | timeFmt}}
              </template>
            </el-table-column>

            <el-table-column align="center" label="凭证">
              <template slot-scope="scope">
                {{scope.row.attachmentName || '无凭证'}}
              </template>
            </el-table-column>

            <el-table-column align="center" width="120" label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" class="export" @click="exportFile(scope.row.attachmentPath)">下载</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="dialogVisible1=false">关闭</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="payDialogVisible" title="付款指令详情" width="900px" center :close-on-click-modal="false">
      <div class="payment-box">
        <div class="payment-order">
          <div class="payment-order-item">
            <div>
              <div class="item-label">订单号</div>
              <div class="item-text">{{paymentData.purchaseNo}}</div>
            </div>
            <div>
              <div class="item-label">订单日期</div>
              <div class="item-text">{{paymentData.orderCreateTime | timeFmt}}</div>
            </div>
          </div>
          <div class="payment-order-item">
            <div>
              <div class="item-label">当前节点</div>
              <div class="item-text">{{paymentData.orderStatus | orderStatusFmt}}</div>
            </div>
            <div>
              <div class="item-label">申请人</div>
              <div class="item-text">{{paymentData.updateUserId}}</div>
            </div>
          </div>
        </div>
        <div class="payment-supplier">
          <div>
            <div>供应商信息</div>
            <div class="payment-supplier-item">
              <div class="item-label">供应商名称</div>
              <div class="item-text">{{paymentData.sellerName}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">联系人</div>
              <div class="item-text">{{paymentData.buyerContactBy}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">联系方式</div>
              <div class="item-text">{{paymentData.buyerTelephone}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">地址</div>
              <div class="item-text">{{paymentData.buyerAddress}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">国家</div>
              <div class="item-text">{{paymentData.sellerCountryCode}}</div>
            </div>
          </div>
          <div>
            <div>账户信息</div>
            <div class="payment-supplier-item">
              <div class="item-label">银行名称</div>
              <div class="item-text">{{paymentData.sellerBank}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">支行名称</div>
              <div class="item-text">{{paymentData.branchName}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">账户号码</div>
              <div class="item-text">{{paymentData.sellerBankAccount}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">地址</div>
              <div class="item-text">{{paymentData.sellerAddress}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">swift编码</div>
              <div class="item-text">{{paymentData.sellerSwifcode}}</div>
            </div>
          </div>
        </div>
        <div class="payment-supplier">
          <div>
            <div>支付信息</div>
            <div class="payment-supplier-item">
              <div class="item-label">订单金额</div>
              <div class="item-text">{{paymentForm.amountAll | toThousandFilter}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">订单货币</div>
              <div class="item-text">{{paymentData.orderCurrency}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">待付款</div>
              <div class="item-text">{{paymentForm.pendingPayment | toThousandFilter}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">申请付款</div>
              <div class="item-text">
                <el-input v-model.number="paymentForm.applyPaymentAmount" size="small" clearable style="width: 200px"/>
              </div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">付款日期</div>
              <div class="item-text">
                <el-date-picker v-model="paymentForm.paymentTime" type="date" placeholder="select date" style="width: 200px"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="addOrderPayment">{{$t('common.buttonText.submit')}}</el-button>
        <el-button type="danger" size="small" @click="payDialogVisible=false">{{$t('common.buttonText.close')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import OrderStep from '@/components/OrderStep'
import ApprovalHistory from '@/components/ApprovalHistory'
import { parseTime, deepClone } from '@/utils/index'
import moneyFmt from '@/mixin/moneyFmt'
import { selectCountryListApi, selectCompanyBankAccountListApi } from '@/api/system'
import { supplierBankList } from '@/api/supplier'
import { getPaymentAmount, addPaymentInstruction } from '@/api/finance'
import {
  getPurchaseOrderList,
  deletePurchaseOrder,
  getDetailPOFlowById,
  getNodePurchase,
  getPurchaseRecordList,
  getPurchaseRelateOrder,
  exportPurchaseOrderExcel
} from '@/api/purchaseOrder'
export default {
  components: {
    Pagination,
    OrderStep,
    ApprovalHistory
  },
  mixins: [moneyFmt],
  data() {
    return {
      listLoading: true,
      loading1: false,
      dialogVisible: false,
      dialogVisible1: false,
      payDialogVisible: false,
      rangeTime: [],
      selectList: [],
      saleOrderWithPurchaseList: [],
      payRecordList: [],
      stockRecordList: [],
      deliveryRecordList: [],
      checkRecordList: [],
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        sellerName: '',
        sellerCode: '',
        purchaseNo: '',
        sdate: '',
        edate: ''
      },
      detailForm: {},
      paymentData: {},
      paymentForm: {
        paymentTime: '',
        applyPaymentAmount: '',
        paymentOrderType: 1,
        paymentCurrency: '',
        amountAll: 0,
        pendingPayment: 0,
        associatedOrderBId: '',
        customerBId: '',
        customerName: ''
      },
      dataList: [],
      countryList: [],
      allNodeList: [],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      customerInfoList: [],
      sysCustomerInfoList: [],
      modalList: []
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    goRouter(type, id) {
      let path = type === 1 ? '/order/purchase/editPurchaseOrder' : '/order/purchase/detailPurchaseOrder';
      this.$router.push({
        path: path,
        query: {
          id: id,
          type: type
        }
      });
    },
    addClick(type) {
      let path = type === 1 ? '/order/purchase/addPurchaseOrder' : '/order/purchase/editPurchaseOrder';
      this.$router.push({
        path: path,
        query: {
          type: type
        }
      });
    },
    outportData() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      exportPurchaseOrderExcel(obj).then(res => {
        const link = document.createElement('a')
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        link.style.display = 'none'
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', '采购订单管理列表.xlsx')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    exportFile(url) {
      if (url) {
        window.open(url)
      }
    },
    // 查询获取国家
    getCountryList(query) {
      if (query !== '') {
        this.loading1 = true;
        setTimeout(() => {
          this.loading1 = false;
          selectCountryListApi(query).then(res => {
            this.countryList = res.data || []
          })
        }, 200);
      } else {
        this.countryList = [];
      }
    },
    getSearchTime(date) {
      if (date && date.length) {
        this.postData.sdate = date[0];
        this.postData.edate = date[1]
      } else {
        this.postData.sdate = '';
        this.postData.edate = '';
      }
    },
    openRecordDialog() {
      getPurchaseRecordList({ bid: this.detailForm.bid }).then(res => {
        this.stockRecordList = res.data.stocking;
        this.deliveryRecordList = res.data.ship;
        this.checkRecordList = res.data.acceptance;
        this.payRecordList = res.data.ppflist;
        this.dialogVisible1 = true;
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    openDialog(id) {
      this.getPurchaseOrderDetail(id);
      this.getAllNodePurchaseOrder(id);
      this.getSalesOrderByPurchase(id)
    },
    openPayDialog(row) {
      this.payDialogVisible = true;
      this.paymentData = deepClone(row);
      this.paymentForm.paymentCurrency = this.paymentData.orderCurrency;
      this.paymentForm.amountAll = this.paymentData.totalAmount;
      this.paymentForm.customerBId = this.paymentData.supplierBId;
      this.paymentForm.customerName = this.paymentData.sellerName;
      this.paymentForm.associatedOrderBId = this.paymentData.bid;
      this.paymentForm.paymentAssociatedOrders = this.paymentData.purchaseNo;
      this.selectSurplusAmountFun(row.bid);
      this.getSupplierBankList(row.supplierBId, row.type);
    },
    getPurchaseOrderDetail(id) {
      getDetailPOFlowById({ bid: id }).then(res => {
        this.detailForm = Object.assign(this.detailForm, res.data);
        this.dialogVisible = true;
        // this.customerContactFun(this.detailForm.customerBId);
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    getAllNodePurchaseOrder(id) {
      getNodePurchase({ purchaseBid: id }).then(res => {
        this.allNodeList = res.data.map((e, index) => {
          e.currentCompletion = e.currentCompletion.toString();
          return { ...e }
        });
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    getSalesOrderByPurchase(id) {
      getPurchaseRelateOrder({ bid: id }).then(res => {
        this.saleOrderWithPurchaseList = res.data
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    // 获取供应商银行卡列表
    getSupplierBankList(val, type) {
      if (type === 2) {
        supplierBankList({ supplierBId: val }).then(res => {
          let obj = res.data.filter(e => e.id === this.paymentData.sellerBankId)[0];
          this.paymentData.branchName = obj.branchName
        }).catch(err => {
          this.$message.error(err.message);
        });
      } else {
        selectCompanyBankAccountListApi({ companyInfoBId: val, pageNum: 1, pageSize: 999 }).then(res => {
          let obj = res.data.list.filter(e => e.id === this.paymentData.sellerBankId)[0];
          this.paymentData.branchName = obj.branchName
        }).catch(err => {
          this.$message.error(err.message);
        });
      }
    },
    // 通过采购bid获取当前付款金额
    selectSurplusAmountFun(id) {
      getPaymentAmount({ associatedOrderBId: id, type: 1 }).then(res => {
        this.paymentForm.pendingPayment = res.data;
      });
    },
    addOrderPayment() {
      const { paymentTime, applyPaymentAmount } = this.paymentForm;
      if (!paymentTime || !applyPaymentAmount) {
        return this.$message.warning('Payment and application time cannot be empty')
      }
      addPaymentInstruction(this.paymentForm).then(res => {
        this.$message.success('Submit Success');
        this.paymentForm.paymentTime = '';
        this.paymentForm.applyPaymentAmount = '';
        this.payDialogVisible = false;
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    deleteClick() {
      if (!this.selectList.length) {
        return this.$message.warning('请选择数据')
      }
      for (let i = 0; i < this.selectList.length; i++) {
        if (this.selectList[i].orderStatus !== 1) {
          return this.$message.warning('只能删除编辑中的数据')
        }
      }
      this.$confirm('此操作将删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        let obj = {
          ids: this.selectList.map(e => e.id).join(',')
        };
        deletePurchaseOrder(obj).then(res => {
          this.getDataList();
          this.$message.success('删除成功');
        }).catch(err => {
          this.$message.error(err.message)
        });
      }).catch(() => {
      });
    },
    searchData() {
      this.postData.pageNum = 1;
      this.getDataList();
    },
    getDataList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      if (this.$route.query.customerUserBid) {
        obj.customerUserBid = this.$route.query.customerUserBid
      }
      getPurchaseOrderList(obj).then(res => {
        this.dataList = res.data.list;
        this.postData.total = res.data.total;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message)
      })
    },
    // 勾选触发 selects为选择的数据数组
    getSelect(selects) {
      this.selectList = selects
    }
  },
  filters: {
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
    },
    timeFmt1(val) {
      if (val) {
        return parseTime(val)
      }
    },
    orderStatusFmt: function (val) {
      let statusName = '';
      if (val === 0) {
        statusName = '作废';
      } else if (val === 1) {
        statusName = '编辑中';
      } else if (val === 2) {
        statusName = '审核中';
      } else if (val === 3) {
        statusName = '审核驳回';
      } else if (val === 4) {
        statusName = '待确认';
      } else if (val === 5) {
        statusName = '已确认';
      }
      return statusName;
    },
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
  .saleOrder {
    .search-box {
      margin-bottom: 15px;
      border-bottom: 1px solid $border-light-color;
    }
    .topBtns {
      margin-bottom: 10px;
      text-align: right;
      button {
        margin: 0 10px;
      }
    }
    .related-file {
      text-decoration: underline;
      font-size: 16px;
      color: #1e6abc;
      cursor: pointer;
      margin: 20px;
    }
    .file-record-item {
      margin: 20px 0;
      .file-record-label {
        line-height: 1.5rem;
      }
    }
    .payment-box {
      >div {
        margin: 20px 0;
      }
      .payment-order {
        &-item {
          display: flex;
          line-height: 28px;
          >div {
            flex: 1;
            display: flex;
            .item-label {
              width: 130px;
            }
            .item-text {
              flex: 1;
            }
          }
        }
      }
      .payment-supplier {
        display: flex;
        border-top: 1px solid $border-light-color;
        padding-top: 10px;
        >div {
          flex: 1;
          .payment-supplier-item {
            padding-left: 100px;
            flex: 1;
            display: flex;
            line-height: 35px;
            .item-label {
              width: 130px;
            }
            .item-text {
              flex: 1;
            }
          }
        }
      }
    }
  }
</style>
