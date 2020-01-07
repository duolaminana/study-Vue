<template>
  <div class="app-container editQuoted">
    <div class="edit-title">
      报价单
      <div class="detail-status">{{editForm.quoteStatus | statusName}}</div>
    </div>
    <el-form ref="editForm" :model="editForm" label-width="120px" size="small" :rules="editRules" class="edit-form">
      <el-row>
        <el-col :span="12" v-if="editType">
          <el-form-item :label="$t('query.tableLabel.quotationNumber')">
            {{editForm.quotationNo}}
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="editType">
          <el-form-item :label="$t('query.tableLabel.QuotationTime')">
            {{editForm.quotationTime | timeFmt}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-item" justify="space-around">
        <el-col :span="10">
          <table class="form-table" border="0" cellspacing="0" cellpadding="0" style="width: 100%">
            <tr>
              <td width="40%" style="min-width: 100px">买方</td>
              <td width="60%">
                {{editForm.buyerName}}
              </td>
            </tr>
            <tr>
              <td>买方联系人</td>
              <td>
                <el-select v-model="editForm.buyerContact" size="mini" disabled placeholder="请选择购买人" class="edit-form-width input-center">
                  <el-option v-for="(item, index) in modalList" :label="item.contactName" :value="item.accountBId" :key="index"></el-option>
                </el-select>
              </td>
            </tr>
            <tr>
              <td>买方地址</td>
              <td>{{editForm.buyerAddress}}</td>
            </tr>
            <tr>
              <td>买方电话</td>
              <td>{{editForm.buyerTelephone}}</td>
            </tr>
            <tr>
              <td>买方邮箱</td>
              <td>{{editForm.buyerEmail}}</td>
            </tr>
          </table>
        </el-col>
        <el-col :span="10">
          <table class="form-table" border="0" cellspacing="0" cellpadding="0" style="width: 100%">
            <tr>
              <td width="40%" style="min-width: 100px">卖方</td>
              <td width="60%">
                {{editForm.sellerName}}
              </td>
            </tr>
            <tr>
              <td>卖方联系人</td>
              <td>
                {{editForm.sellerContact}}
              </td>
            </tr>
            <tr>
              <td>卖方地址</td>
              <td>{{editForm.sellerAddress}}</td>
            </tr>
            <tr>
              <td>卖方联系电话</td>
              <td>{{editForm.sellerTelephone}}</td>
            </tr>
            <tr>
              <td>卖方邮箱</td>
              <td>{{editForm.sellerEmail}}</td>
            </tr>
          </table>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="运输委托方" prop="transportation">
            <el-select v-model="editForm.transportation" disabled placeholder="请选择运输委托方" class="edit-form-width">
              <el-option label="委托卖方" :value="1"></el-option>
              <el-option label="自提" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="运输方式" prop="transportationWay">
            <el-select v-model="editForm.transportationWay" disabled placeholder="请选择运输方式" class="edit-form-width">
              <el-option label="汽运" :value="0"></el-option>
              <el-option label="铁路" :value="1"></el-option>
              <el-option label="海运" :value="2"></el-option>
              <el-option label="空运" :value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出发港口/地址" prop="departurePort">
            <el-input v-model="editForm.departurePort" readonly placeholder="请输入出发港口/地址" class="edit-form-width" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="目的港口/地址" prop="destinationPort">
            <el-input v-model="editForm.destinationPort" readonly placeholder="请输入目的港口/地址" class="edit-form-width" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="币种" prop="currency">
            <el-select filterable remote :remote-method="getCurrencyCodeList" :loading="loading2" v-model="editForm.currency" disabled placeholder="请输入币种名或者币种编码查找" class="edit-form-width">
              <el-option v-for="(item, index) in currencyCodeList" :label="item.searchCurrencyCodeStr" :value="item.searchCurrencyCodeStr" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="交付期限" prop="dateOfDelivery">
            到款后<el-input v-model="editForm.dateOfDelivery" readonly class="buyer-input" style="width: 60px" />个工作日
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="付款方式" prop="paymentCondition">
            <el-select v-model="editForm.paymentCondition" disabled placeholder="请选择付款方式" class="edit-form-width">
              <el-option v-for="(item, index) in paymentMethodList" :label="item.label" :value="item.paymentCondition" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!--<el-col>-->
          <!--<el-form-item label="其他条款" prop="otherTerms">-->
            <!--<el-input v-model="editForm.otherTerms" readonly="" clearable style="width: 80%" />-->
          <!--</el-form-item>-->
        <!--</el-col>-->
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
        <div class="top-title">报价单商品列表</div>
      </div>
      <el-table
        :data="dataList"
        border
        fit
        show-summary
        size="small"
        max-height="520"
        style="font-size: 12px"
        :header-cell-style="{background: '#a7bfee'}"
        @selection-change="getSelect">
        <el-table-column align="center" type="selection" width="50"/>

        <el-table-column align="center" type="index" label="序号" width="55"/>

        <!--<el-table-column align="center" min-width="285px" label="商品信息" prop="inqueryNo" >-->
          <!--<template slot-scope="scope">-->
            <!--<div class="table-goods">-->
              <!--<div class="goods-img"><img :src="scope.row.productImge" alt=""></div>-->
              <!--<div class="goods-text">-->
                <!--<div>{{scope.row.productName}}</div>-->
                <!--<div>{{scope.row.attrValueList}}</div>-->
                <!--<div>商品编码：{{scope.row.productCode}}</div>-->
                <!--<div>海关编码：{{scope.row.customsCode}}</div>-->
              <!--</div>-->
            <!--</div>-->
          <!--</template>-->
        <!--</el-table-column>-->

        <el-table-column align="center" width="150" label="商品" prop="inqueryNo" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.productName}}
          </template>
        </el-table-column>

        <el-table-column align="center" width="180" label="SKU描述" prop="attrValueList" show-overflow-tooltip/>

        <!--<el-table-column v-if="editForm.quotedType === 1" min-width="80" align="center" label="起订量" prop="mininum" />-->

        <!--<el-table-column v-if="editForm.quotedType === 2" min-width="80" align="center" label="询价量" prop="orderNumber" />-->

        <el-table-column align="center" width="120" label="报价量" prop="quotedQuantity" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.quotedQuantity}}
          </template>
        </el-table-column>

        <el-table-column align="center" width="120" label="先前报价" prop="lastQuotedPrice" show-overflow-tooltip/>

        <el-table-column align="center" width="120" label="报价单价" prop="quotedPrice" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.quotedPrice}}
          </template>
        </el-table-column>

        <el-table-column align="center" width="120" label="报价金额" prop="productAmount" show-overflow-tooltip/>

        <el-table-column align="center" label="报价备注" prop="quotedRemark" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.quotedRemark}}
          </template>
        </el-table-column>
      </el-table>
      <!--<Pagination :total="editForm.total" :page.sync="editForm.pageNum" :limit.sync="editForm.pageSize" @pagination="getDetail"></Pagination>-->
      <el-form-item/>
      <el-row>
        <el-col :span="12">
          <el-form-item label="运费">
            {{editForm.transportationCost}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="订单总额">
            {{quoteMoneyTotal}}
            <!--{{editForm.estimatedAmountAll}}-->
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="报价备注" prop="quotedRemarks">
            <el-input v-model="editForm.quotedRemarks" :autosize="{ minRows: 4, maxRows: 6}" type="textarea" size="small" readonly style="width: 80%"/>
          </el-form-item>
        </el-col>
<!--        <el-col>-->
<!--          <el-form-item label="是否审核" prop="ifAudit">-->
<!--            <el-radio-group v-model="editForm.isApproval" disabled>-->
<!--              <el-radio :label="1">是</el-radio>-->
<!--              <el-radio :label="0">否</el-radio>-->
<!--            </el-radio-group>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col>-->
<!--          <el-form-item label="选择审批流程" prop="approvalBId" v-if="editForm.isApproval">-->
<!--            <el-select v-model="editForm.approvalBId" disabled filterable placeholder="请选择" style="width: 300px">-->
<!--              <el-option v-for="(item,index) in approvalSelectList" :key="index" :label="item.approvalName" :value="item.bid">-->
<!--              </el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
      </el-row>

      <ApprovalHistory></ApprovalHistory>

      <el-form-item style="text-align: center">
        <el-button type="primary" v-if="editForm.quoteStatus === 3" size="small" @click="setOrder">下订单</el-button>
        <el-button type="primary" v-if="editForm.quoteStatus === 3" size="small" @click="againQuote">重新报价</el-button>
        <el-button type="danger" size="small" @click="closePage">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import Pagination from '@/components/Pagination'
import ApprovalHistory from '@/components/ApprovalHistory'
import { selectCurrencyCodeListApi, approvalSelectList, getSupplyCompanyList } from '@/api/system'
import { listCustomerInfoContactApi, getCustomerInfo } from '@/api/customer'
import { parseTime } from '@/utils/index'
import { detailQuotedPrice } from '@/api/inquiry'
export default {
  components: {
    ApprovalHistory
  },
  filters: {
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
    },
    statusName(val) {
      switch (Number(val)) {
        case 1: return '编辑中';
        case 2: return '审批中';
        case 3: return '已报价';
        case 4: return '待重新报价';
        case 5: return '废弃';
        case 6: return '拒绝报价';
        case 7: return '审批通过';
        case 8: return '审批未通过';
        default:
          return '数据异常';
      }
    }
  },
  data() {
    return {
      dataList: [],
      listLoading1: false,
      dialogVisible: false,
      loading1: false,
      loading2: false,
      editType: false,
      countryList: [],
      currencyCodeList: [],
      customerInfoList: [],
      approvalSelectList: [],
      modalList: [],
      parentsName: [],
      searchDataList: [],
      selectList: [],
      productSkuList: [],
      delSkuList: [],
      controlTowerList: [],
      editForm: {
        quotationNo: '',
        quotationTime: '',
        costomerBId: '',
        buyerContact: '',
        buyerAddress: '',
        buyerTelephone: '',
        buyerEmail: '',
        sellerContact: '',
        sellerAddress: '',
        sellerTelephone: '',
        sellerEmail: '',
        sysCompanyBId: '',
        transportationWay: 2,
        transportation: 1,
        departurePort: '',
        destinationPort: '',
        emailAddress: '',
        currency: '',
        exchangeRate: 0,
        dateOfDelivery: '',
        paymentCondition: '',
        isApproval: 1,
        approvalBId: '',
        quotedRemarks: '',
        transportationCost: 0,
        otherTerms: ''
      },
      editRules: {
        departurePort: [
          { required: true, message: '出发港口/地址', trigger: 'change' }
        ],
        destinationPort: [
          { required: true, message: '目的港口/地址', trigger: 'change' }
        ],
        emailAddress: [
          { required: true, message: '请填写邮箱', trigger: 'blur' }
        ],
        exchangeRate: [
          { required: true, message: '请填写邮汇率', trigger: 'blur' }
        ],
        dateOfDelivery: [
          { required: true, message: '请填写付款限制天数', trigger: 'blur' }
        ],
        paymentCondition: [
          { required: true, message: '请选择付款方式', trigger: 'change' }
        ],
        approvalBId: [
          { required: true, message: '请选择审批流程', trigger: 'change' }
        ]
      },
      searchObj: {
        productCode: '',
        productName: '',
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      customTime: [],
      sysCustomerInfoList: [],
      paymentMethodList: [
        // 付款方式:1、T/T；2、L/C；3、P/A；4、D/A
        {
          label: 'T/T',
          paymentCondition: 1
        },
        {
          label: 'L/C',
          paymentCondition: 2
        },
        {
          label: 'P/A',
          paymentCondition: 3
        },
        {
          label: 'D/A',
          paymentCondition: 4
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
    quoteMoneyTotal() {
      let val = 0;
      this.dataList.forEach(e => {
        val += Number(e.productAmount)
      });
      val += Number(this.editForm.transportationCost);
      return val
    }
  },
  watch: {
    'editForm.costomerBId' (val, oldVal) {
      if (val && !oldVal) {
        this.customerContactFun(val);
      } else if (val && oldVal) {
        this.customerContactFun(val);
      }
    }
  },
  created() {
    this.getCustomerInfoListFun();
    this.getApprovalSelectList();
    this.getSysCustomerInfoListFun();
    if (this.$route.query.id) {
      this.editType = true;
      this.getDetail()
    }
  },
  methods: {
    closePage() {
      this.$store.dispatch('delView', this.activeRoute).then(() => {
        this.$router.push({
          path: '/query/quoted'
        })
      })
    },
    // 勾选触发 selects为选择的数据数组
    getSelect(selects) {
      this.selectList = selects;
    },
    againQuote() {
      this.$router.push({
        path: '/query/editQuoted',
        query: {
          id: this.editForm.bid,
          flag: true
        }
      });
    },
    setOrder() {
      if (!this.selectList.length) {
        return this.$message.warning('请先选择商品再下订单')
      }
      this.$store.commit('SET_QUOTE_SKU', this.selectList);
      this.$store.dispatch('delView', this.activeRoute).then(() => {
        this.$router.push({
          path: '/order/sale/editOrder',
          query: {
            quoteId: this.$route.query.id
          }
        });
      })
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
    getApprovalSelectList() {
      approvalSelectList().then(res => {
        this.approvalSelectList = res.data || [];
      })
    },
    // 客户下的联系人列表
    customerContactFun(val) {
      getCustomerInfo({ bid: val }).then(res => {
        this.modalList = res.data.customerContactList || [];
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
    getDetail() {
      detailQuotedPrice({ quotedPriceBId: this.$route.query.id }).then(res => {
        this.editForm = res.data;
        this.editForm.paymentCondition = Number(this.editForm.paymentCondition);
        this.editForm.buyerContact = res.data.inquirerBId;
        this.controlTowerList = res.data.quotedOrderPayNodeList || [];
        this.dataList = res.data.quotedPriceDetailList.map(e => {
          e.mininum = e.productPriceGradient ? (e.productPriceGradient.mininum || 0) : 0;
          e.unitPrice = e.productPriceGradient ? (e.productPriceGradient.unitPrice || 0) : 0;
          e.mininumMoney = Number(e.mininum * e.unitPrice * 100) / 100;
          e.productAmount = (Number(e.quotedQuantity * e.quotedPrice * 100) / 100).toFixed(4);
          return { ...e }
        });
      }).catch(err => {
        this.$message.error(err.message);
      });
    }
  }
}
</script>

<style lang="scss">
  @import '~@/styles/variables.scss';
  .editQuoted {
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
      .detail-status {
        position: absolute;
        right: 5%;
        top: 25%;
        font-size: 16px;
        line-height: 24px;
        color: #ff3a3d;
        width: 100px;
        border: 1px solid #ff3a3d;
        transform:rotate(45deg);
      }
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
  }
</style>
