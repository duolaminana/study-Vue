<template>
  <div class="app-container saleOrder">
    <div class="search-box">
      <el-form label-width="90px" inline size="small">
        <!-- <div>
          <el-form-item label="供应商名称">
            <el-input v-model="postData.sellerName" clearable placeholder="请输入供应商名称" style="width: 200px" />
          </el-form-item>
          <el-form-item label="供应商编码">
            <el-input v-model="postData.sellerCode" clearable placeholder="请输入供应商编码" style="width: 200px" />
          </el-form-item>
        </div> -->
        <div>
          <el-form-item label="采购订单编号" label-width="120">
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
          <el-form-item style="padding-left: 90px;">
            <el-button type="primary" class="export" @click="searchData">搜索</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="topBtns">
      <!-- <el-button type="primary" size="small" @click="addClick(1)">从销售订单新增</el-button>
      <el-button type="primary" size="small" @click="addClick(2)">新增</el-button>
      <el-button type="primary" size="small" @click="deleteClick">删除</el-button> -->
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
      <!-- <el-table-column
        align="center"
        type="selection"
        width="55">
      </el-table-column> -->
      <el-table-column label="支付编号" prop="paymentInstructionNo" show-overflow-tooltip/>
      <el-table-column label="订单编号" prop="paymentAssociatedOrders" show-overflow-tooltip/>

      <el-table-column label="客户简称" prop="customerName" show-overflow-tooltip/>

      <el-table-column align="center" label="类型" prop="paymentOrderType" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.paymentOrderType | OrderType}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="金额" prop="applyPaymentAmount" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.applyPaymentAmount | moneyFmt}}
        </template>
      </el-table-column>

      <el-table-column label="币种" prop="paymentCurrency" show-overflow-tooltip/>

      <el-table-column align="center" width="80px" label="状态" prop="approveStatus">
        <template slot-scope="scope">
          {{scope.row.approveStatus | orderStatusFmt}}
        </template>
      </el-table-column>

      <!-- <el-table-column label="供应商名称" prop="sellerName" show-overflow-tooltip/>

      <el-table-column label="电话" prop="sellerTelephone" show-overflow-tooltip/>

      <el-table-column align="center" width="70" label="SKU数" prop="skuCount" />

      <el-table-column align="center" width="100" label="修改人" prop="updateUserId" show-overflow-tooltip/> -->

      <el-table-column align="center" width="150" label="付款时间" prop="customerName">
        <template slot-scope="scope">
          {{scope.row.paymentTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="left" label="操作" width="258" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" class="export table-btn-width" @click="goRouter(scope.row.paymentOrderType, scope.row, 0)">查看</el-button>
          <el-button type="primary" size="mini" class="export table-btn-width" :disabled="scope.row.approveStatus!=1" @click="goRouter(scope.row.paymentOrderType, scope.row, 1)">申请</el-button>
          <el-button type="primary" size="mini" class="export table-btn-width" :disabled="scope.row.approveStatus!=3" @click="goRouter(scope.row.paymentOrderType, scope.row, 2)">付款记录</el-button>
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
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import OrderStep from '@/components/OrderStep'
import ApprovalHistory from '@/components/ApprovalHistory'
import { parseTime } from '@/utils/index'
import moneyFmt from '@/mixin/moneyFmt'
import { selectCountryListApi } from '@/api/system'
// import { getPurchaseOrderList, deletePurchaseOrder, getDetailPOFlowById, getNodePurchase, getPurchaseRecordList, getPurchaseRelateOrder, exportPurchaseOrderExcel } from '@/api/finance'
import { getPurchaseOrderList, getPurchaseRecordList, exportPurchaseOrderExcel } from '@/api/finance'
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
    goRouter(type, row, isApply) {
      let path = type === 1 ? '/settlementFinance/payment/paymentMGT' : '/settlementFinance/payment/editLogistics';
      this.$router.push({
        path: path,
        query: {
          id: row.bid,
          paymentInstructNo: row.paymentInstructionNo,
          type: type,
          isApply: isApply
        }
      });
    },
    addClick(type) {
      let path = type === 1 ? '/settlementFinance/purchase/addPurchaseOrder' : '/settlementFinance/purchase/editPurchaseOrder';
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
      if (this.$route.query.customerBId) {
        obj.customerBId = this.$route.query.customerBId
      }
      getPurchaseOrderList(obj).then(res => {
        this.dataList = res.data.list;
        // console.log(this.dataList)
        // this.dataList = [{}]
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
    OrderType(val) {
      let typeName = (val === 1) ? '采购订单' : '物流订单'
      return typeName
    },
    timeFmt1(val) {
      if (val) {
        return parseTime(val)
      }
    },
    orderStatusFmt: function (val) {
      let statusName = '';
      switch (val) {
        case 1:
          statusName = '编辑中';
          break;
        case 2:
          statusName = '申请中';
          break;
        case 3:
          statusName = '审核通过';
          break;
        case 4:
          statusName = '审核失败';
          break;
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
  }
</style>
