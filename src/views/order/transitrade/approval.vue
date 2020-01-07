<template>
  <div class="app-container editOrder">
    <div class="edit-title">销售订单</div>
    <el-form ref="editForm" :model="editForm" label-width="120px" size="small" class="edit-form">
      <el-row>
        <el-col :span="8">
          <el-form-item label="订单号">
            {{editForm.orderNo ? editForm.orderNo : '暂无单号'}}
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="editForm.quotedNo">
          <el-form-item label="报价单号">
            {{editForm.quotedNo}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="订单时间">
            {{(editForm.createTime || new Date()) | timeFmt}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-item" justify="space-around">
        <el-col :span="10">
          <table class="form-table" border="0" cellspacing="0" cellpadding="0" style="width: 100%">
            <tr>
              <td width="40%" style="min-width: 100px">买方</td>
              <td width="60%">
                <el-select v-model="editForm.customerBId" disabled placeholder="请选择公司名称" size="mini" class="edit-form-width input-center">
                  <el-option v-for="(item, index) in customerInfoList" :label="item.companyName" :value="item.bid" :key="index"></el-option>
                </el-select>
              </td>
            </tr>
            <tr>
              <td>买方联系人</td>
              <td>
                <el-select v-model="editForm.buyerContactBy" disabled placeholder="请选择购买人" size="mini" class="edit-form-width input-center">
                  <el-option v-for="(item, index) in modalList" :label="item.contactName" :value="item.accountBId" :key="index"></el-option>
                </el-select>
              </td>
            </tr>
            <tr>
              <td>买方地址</td><td>{{editForm.buyerAddress}}</td>
            </tr>
            <tr>
              <td>买方电话</td><td>{{editForm.buyerTelephone}}</td>
            </tr>
            <tr>
              <td>买方邮箱</td><td>{{editForm.buyerEmail}}</td>
            </tr>
            <tr>
              <td><span class="label-required">开户银行</span></td>
              <td>
                {{editForm.buyerBank}}
              </td>
            </tr>
            <tr>
              <td>银行账号</td><td>{{editForm.buyerBankAccount}}</td>
            </tr>
            <tr>
              <td>SWIFT编码</td><td>{{editForm.buyerSwiftcode}}</td>
            </tr>
            <!--<tr>-->
              <!--<td>目的港口</td><td>{{editForm.arrivePort}}</td>-->
            <!--</tr>-->
          </table>
        </el-col>
        <el-col :span="10">
          <table class="form-table" border="0" cellspacing="0" cellpadding="0" style="width: 100%">
            <tr>
              <td width="40%" style="min-width: 100px">卖方</td>
              <td width="60%">
                <el-select v-model="editForm.sysCompanyBId" disabled placeholder="请选择卖方企业名称" size="mini" class="edit-form-width input-center">
                  <el-option v-for="(item, index) in sysCustomerInfoList" :label="item.companyName" :value="item.bid" :key="index"></el-option>
                </el-select>
              </td>
            </tr>
            <tr>
              <td>卖方联系人</td><td>{{editForm.sellerContact}}</td>
            </tr>
            <tr>
              <td>卖方地址</td><td>{{editForm.sellerAddress}}</td>
            </tr>
            <tr>
              <td>卖方联系电话</td><td>{{editForm.sellerTelephone}}</td>
            </tr>
            <tr>
              <td>卖方邮箱</td><td>{{editForm.sellerEmail}}</td>
            </tr>
            <tr>
              <td><span class="label-required">开户银行</span></td>
              <td>
                {{editForm.sellerBank}}
              </td>
            </tr>
            <tr>
              <td>银行账号</td><td>{{editForm.sellerBankAccount}}</td>
            </tr>
            <tr>
              <td>SWIFT编码</td><td>{{editForm.sellerSwifcode}}</td>
            </tr>
            <!--<tr>-->
              <!--<td>出发港口</td><td>{{editForm.departurePort}}</td>-->
            <!--</tr>-->
          </table>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="运输委托方" prop="entrustTransportation">
            <el-select v-model="editForm.entrustTransportation" disabled class="edit-form-width">
              <el-option label="委托卖方" :value="1"></el-option>
              <el-option label="自提" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="运输方式" prop="transportationWay">
            <el-select v-model="editForm.transportationWay" class="edit-form-width" disabled>
              <el-option label="汽运" :value="0"></el-option>
              <el-option label="铁路" :value="1"></el-option>
              <el-option label="海运" :value="2"></el-option>
              <el-option label="空运" :value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出发港口/地址" prop="departurePort">
            <el-input v-model="editForm.departurePort" readonly placeholder="请填写港口名" class="edit-form-width"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="目的港口/地址" prop="arrivePort">
            <el-input v-model="editForm.arrivePort" readonly placeholder="请填写港口名" class="edit-form-width"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="币种" prop="orderCurrency">
            <el-select filterable remote :remote-method="getCurrencyCodeList" :loading="loading2" v-model="editForm.orderCurrency" disabled placeholder="请输入币种名或者币种编码查找" class="edit-form-width">
              <el-option v-for="(item, index) in currencyCodeList" :label="item.searchCurrencyCodeStr" :value="item.searchCurrencyCodeStr" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="付款方式" prop="payMode">
            <el-select v-model="editForm.payMode" disabled placeholder="请选择付款方式">
              <el-option v-for="(item, index) in paymentMethodList" :label="item.label" :value="item.paymentMethod" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="交货日期" prop="dateOfDelivery">
            到款后<el-input-number v-model="editForm.dateOfDelivery" :min="0" disabled></el-input-number>个工作日
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="付款条件">
        <table border="0" cellspacing="0" cellpadding="0" class="tableSet">
          <thead>
          <tr>
            <th>序号</th>
            <th>付款节点</th>
            <th>默认付款比例</th>
            <th>付款时间</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in controlTowerList" :key="index">
            <td>{{index + 1}}</td>
            <td>{{item.nodeName}}</td>
            <td>
              {{item.paymentRatio}}%
            </td>
            <td>
              {{item.dayNum || 0}}天
            </td>
          </tr>
          <tr v-if="!controlTowerList.length">
            <td colspan="4" style="text-align: center;padding: 5px">暂无数据</td>
          </tr>
          </tbody>
        </table>
      </el-form-item>
      <div class="table-top">
        <div class="top-title">商品列表</div>
      </div>
      <el-table
        :data="orderSkuList"
        border
        fit
        show-summary
        size="small"
        max-height="520"
        style="font-size: 12px"
        :header-cell-style="{background: '#a7bfee'}">

        <el-table-column align="center" type="index" label="序号" width="55"/>

        <el-table-column align="center" width="80" label="海关编码" prop="customsCode">
          <template slot-scope="scope">
            {{scope.row.customsCode}}
          </template>
        </el-table-column>

        <el-table-column align="center" width="80" label="SKU编码" prop="skuCode">
          <template slot-scope="scope">
            {{scope.row.skuCode}}
          </template>
        </el-table-column>

        <el-table-column align="center" width="150" label="商品名称" prop="productName" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.productName}}
          </template>
        </el-table-column>

        <el-table-column align="center" width="180" label="SKU描述" prop="productDescription" show-overflow-tooltip/>

        <el-table-column align="center" width="130" label="客户产品参考" prop="clientProductRef"/>

        <el-table-column align="center" min-width="80" label="订货量">
          <template slot-scope="scope">
            {{scope.row.productQuantity}}
          </template>
        </el-table-column>

        <el-table-column align="center" min-width="80" label="单价">
          <template slot-scope="scope">
            {{scope.row.productPrice}}
          </template>
        </el-table-column>

        <el-table-column align="center" min-width="80" label="金额" prop="productAmount"/>

        <el-table-column align="center" min-width="150" label="备注">
          <template slot-scope="scope">
            {{scope.row.productRemark}}
          </template>
        </el-table-column>
      </el-table>

      <el-row style="margin-top: 16px">
        <el-col :span="8">
          <el-form-item label="运费">
            {{editForm.orderFreight}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="订单总额">
            {{allAmount}}
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="允许的附件类型:">
            <el-checkbox-group v-model="fileTypeCheck" disabled>
              <el-checkbox v-for="(item, index) in fileTypeList" :label="item.value" :key="index">
                <span v-if="item.value !== '8'">{{item.label}}</span>
                <span v-else>{{newFileType}}</span>
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="备注" prop="orderRemarks">
            <el-input v-model="editForm.orderRemarks" readonly :autosize="{ minRows: 4, maxRows: 6}" type="textarea" size="small" clearable style="width: 80%"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <ApprovalFlow @close="closePage"></ApprovalFlow>
  </div>
</template>

<script>
import ApprovalFlow from '@/components/ApprovalFlow'
import { selectCurrencyCodeListApi, getSupplyCompanyList, selectgetDictionaryBykeyApi, selectSysOrderParameterApi } from '@/api/system'
import { listCustomerInfoContactApi, listCustomerContact } from '@/api/customer'
import { parseTime } from '@/utils/index'
import { saleOrderDetail } from '@/api/transitrade'
export default {
  components: {
    ApprovalFlow
  },
  filters: {
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
    }
  },
  data() {
    return {
      listLoading1: false,
      dialogVisible: false,
      loading1: false,
      loading2: false,
      currencyCodeList: [],
      customerInfoList: [],
      modalList: [],
      selectList: [],
      dialogSelectList: [],
      controlTowerList: [],
      quoteSkuList: [],
      orderSkuList: [],
      fileTypeCheck: [],
      newFileType: '',
      editForm: {
        quotedNo: '',
        quotedTime: '',
        customerBId: '',
        buyerContactBy: '',
        buyerAddress: '',
        buyerTelephone: '',
        buyerEmail: '',
        buyerBankId: '',
        buyerBank: '',
        buyerBankAccount: '',
        buyerSwiftcode: '',
        sellerContact: '',
        sellerAddress: '',
        sellerTelephone: '',
        sellerEmail: '',
        sellerBankId: '',
        sellerBank: '',
        sellerBankAccount: '',
        sellerSwifcode: '',
        sysCompanyBId: '',
        transportationWay: 0,
        entrustTransportation: 1,
        shippingPort: '',
        purposePort: '',
        emailAddress: '',
        orderCurrency: '',
        exchangeRate: 0,
        dateOfDelivery: 0,
        payMode: '',
        quotedRemarks: '',
        orderFreight: 0,
        toleranceNumber: '',
        choosedAttachment: '',
        orderRemarks: '',
        arrivePort: '',
        departurePort: ''
      },
      searchObj: {
        productCode: '',
        productName: '',
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      sysCustomerInfoList: [],
      customerBankList: [],
      sysBankList: [],
      fileTypeList: [],
      paymentMethodList: [
        {
          label: 'T/T',
          paymentMethod: 0
        },
        {
          label: 'L/C',
          paymentMethod: 1
        },
        {
          label: 'P/A',
          paymentMethod: 2
        },
        {
          label: 'D/A',
          paymentMethod: 3
        }
      ]
    }
  },
  computed: {
    activeRoute() {
      let visitedViews = this.$store.state.tagsView.visitedViews;
      let activePath = visitedViews.filter(e => {
        return e.path === this.$route.path
      })[0];
      return activePath
    },
    selectQuoteSku() {
      return this.$store.state.order.quoteSku
    },
    quoteMoneyTotal() {
      let val = 0;
      this.quoteSkuList.forEach(e => {
        val += Number(e.quoteMoney)
      });
      val += Number(this.editForm.orderFreight);
      return val
    },
    orderMoneyTotal() {
      let val = 0;
      this.orderSkuList.forEach(e => {
        val += Number(e.productAmount)
      });
      return val
    },
    allAmount() {
      let val = 0;
      this.orderSkuList.forEach(e => {
        val += Number(e.productAmount)
      });
      val += Number(this.editForm.orderFreight);
      return val
    }
  },
  watch: {
    'editForm.customerBId' (val) {
      if (val) {
        this.customerContactFun(val);
      }
    }
  },
  created() {
    this.getFileTypeList();
    this.getCustomerInfoListFun();
    this.getSysCustomerInfoListFun();
    if (this.$route.query.id) {
      this.getSaleOrderDetail();
    }
  },
  destroyed() {
    this.$store.commit('SET_QUOTE_SKU', null);
  },
  methods: {
    closePage() {
      this.$store.dispatch('delView', this.activeRoute).then(() => {
        this.$router.push({
          path: '/order/sale/saleOrder'
        })
      })
    },
    // 勾选触发 selects为选择的数据数组
    getSelect(selects) {
      this.selectList = selects;
    },
    getFileTypeList() {
      selectgetDictionaryBykeyApi({ key: 'accessory' }).then(res => {
        this.getSaleSetting(res.data);
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    getSaleSetting(fileTypeList) {
      selectSysOrderParameterApi({ orderParameterType: 2 }).then(res => {
        if (res.data) {
          this.editForm.toleranceNumber = res.data.toleranceNumber
        }
        let saleFileType = res.data.sysOrderParameterAnnexList.filter(e => {
          if (e.dictCode === '8' && e.isAllow) {
            this.newFileType = e.customizeName;
          }
          return e.isAllow
        }).map(t => {
          return t.dictCode
        });
        this.fileTypeList = fileTypeList.filter(e => {
          return saleFileType.includes(e.value)
        });
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 客户人列表
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
    // 客户下的联系人列表
    customerContactFun(val) {
      listCustomerContact({ customerBId: val }).then(res => {
        this.modalList = res.data.list || [];
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 查询获取币种
    getCurrencyCodeList(query) {
      if (query !== '') {
        this.loading2 = true;
        setTimeout(() => {
          this.loading2 = false;
          selectCurrencyCodeListApi(query).then(res => {
            this.currencyCodeList = res.data || []
          })
        }, 200);
      } else {
        this.currencyCodeList = [];
      }
    },
    getSaleOrderDetail() {
      saleOrderDetail({ orderBid: this.$route.query.id }).then(res => {
        this.editForm = Object.assign(this.editForm, res.data);
        this.controlTowerList = this.editForm.salesOrderCollectionList;
        this.orderSkuList = this.editForm.salesOrderProductsList;
        this.fileTypeCheck = this.editForm.choosedAttachment.split(',');
      }).catch(err => {
        this.$message.error(err.message)
      })
    }
  }
}
</script>

<style lang="scss">
  @import '~@/styles/variables.scss';
  .editOrder {
    width: 90%;
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
    .edit-form-width {
      width: 300px;
    }
    .row-item {
      margin-bottom: 20px;
    }
    .tableSet {
      text-align: center;
      width: 680px !important;
      thead {
        tr {
          th {
            padding: 3px;
            border-right: 1px solid $border-light-color;
            border-top: 1px solid $border-light-color;
            border-bottom: 1px solid $border-light-color;
          }
          th:first-child {
            border-left: 1px solid $border-light-color;
          }
        }
      }
      tr {
        td {
          padding: 3px;
          border-right: 1px solid $border-light-color;
          border-bottom: 1px solid $border-light-color;
        }
        td:first-child {
          border-left: 1px solid $border-light-color;
        }
      }
    }
    .table-top {
      line-height: 1.5rem;
      padding: 5px;
      width: 100%;
      display: flex;
      display: -webkit-flex;
      .top-title {
        width: 50%;
        text-align: left;
      }
      .top-btns {
        width: 50%;
        text-align: right;
      }
      button {
        margin: 0 10px;
      }
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
    .order-record {
      font-size: 16px;
      font-weight: bold;
      color: #3f51b5;
      text-decoration: underline;
    }
  }
</style>
