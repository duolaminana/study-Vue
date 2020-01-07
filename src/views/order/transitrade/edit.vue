<template>
  <div class="app-container editOrder">
    <div class="edit-title">销售订单</div>
    <el-form ref="editForm" :model="editForm" :rules="editFormRules" label-width="120px" size="small" class="edit-form">
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
                <el-select v-model="editForm.customerBId" filterable :disabled="!editType" placeholder="请选择公司名称" size="mini" class="edit-form-width input-center" @change="setBuyerInfo">
                  <el-option v-for="(item, index) in customerInfoList" :label="item.companyName" :value="item.bid" :key="index"></el-option>
                </el-select>
              </td>
            </tr>
            <tr>
              <td>买方联系人</td>
              <td>
                <el-select v-model="editForm.buyerContactBy" :disabled="!editType" placeholder="请选择购买人" size="mini" class="edit-form-width input-center">
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
                <el-select v-model="editForm.buyerBankId" clearable placeholder="请选择开户银行" size="mini" class="edit-form-width input-center" @change="setBuyerBankInfo">
                  <el-option v-for="(item, index) in customerBankList" :label="item.bankName" :value="item.id" :key="index"></el-option>
                </el-select>
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
              <td width="40%;" style="min-width: 100px">卖方</td>
              <td width="60%">
                <el-select v-model="editForm.sysCompanyBId" filterable :disabled="!editType" placeholder="请选择卖方企业名称" size="mini" class="edit-form-width input-center" @change="setSellerInfo">
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
                <el-select v-model="editForm.sellerBankId" clearable placeholder="请选择开户银行" size="mini" class="edit-form-width input-center" @change="setSellerBankInfo">
                  <el-option v-for="(item, index) in sysBankList" :label="item.bankName" :value="item.id" :key="index"></el-option>
                </el-select>
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
          <el-form-item label="出发港口/地址" prop="departurePort">
            <el-input v-model="editForm.departurePort" :readonly="!!editForm.quotedNo" placeholder="请填写港口名" class="edit-form-width"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="目的港口/地址" prop="arrivePort">
            <el-input v-model="editForm.arrivePort" :readonly="!!editForm.quotedNo" placeholder="请填写港口名" class="edit-form-width"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="运输委托方" prop="entrustTransportation">
            <el-select v-model="editForm.entrustTransportation" class="edit-form-width">
              <el-option label="自提" :value="0"></el-option>
              <el-option label="委托铭美" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="运输方式" prop="transportationWay">
            <el-select v-model="editForm.transportationWay" class="edit-form-width">
              <el-option label="汽运" :value="0"></el-option>
              <el-option label="铁路" :value="1"></el-option>
              <el-option label="海运" :value="2"></el-option>
              <el-option label="空运" :value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="币种" prop="orderCurrency">
            <el-select filterable remote :remote-method="getCurrencyCodeList" :loading="loading2" v-model="editForm.orderCurrency" clearable placeholder="请输入币种名或者币种编码查找" class="edit-form-width">
              <el-option v-for="(item, index) in currencyCodeList" :label="item.searchCurrencyCodeStr" :value="item.searchCurrencyCodeStr" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="付款方式" prop="payMode">
            <el-select v-model="editForm.payMode" placeholder="请选择付款方式" class="edit-form-width">
              <el-option v-for="(item, index) in paymentMethodList" :label="item.label" :value="item.paymentMethod" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="交货期限" prop="dateOfDelivery">
            到款后<el-input v-model.number="editForm.dateOfDelivery" class="input-center" style="width: 70px"/>个工作日
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
              <!--{{item.paymentRatio}}%-->
              <el-input v-model.number="item.paymentRatio" :min="0" :precision="0" clearable style="width: 120px" class="input-center" />&nbsp;%
            </td>
            <td>
              <!--{{item.paymentTerm || 0}}天-->
              <el-input v-model.number="item.paymentTerm" :min="0" :precision="0" clearable style="width: 120px" class="input-center" />&nbsp;天
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
        <div class="top-btns">
          <el-button type="primary" size="small" @click="openDialog">添加商品</el-button>
        </div>
      </div>
      <el-table
        :data="orderSkuList"
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

        <el-table-column align="center" min-width="285px" label="商品信息" prop="inquiryNo" >
          <template slot-scope="scope">
            <div class="table-goods">
              <div class="goods-img"><img :src="scope.row.productImge" alt=""></div>
              <div class="goods-text">
                <div style="font-weight: bold">商品名称：{{scope.row.productName}}</div>
                <div>所属类目：{{scope.row.skuReference}}</div>
                <div>商品编码：{{scope.row.productCode}}</div>
                <div>海关编码：{{scope.row.customsCode}}</div>
              </div>
            </div>
          </template>
        </el-table-column>

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

        <el-table-column align="center" width="130" label="客户产品参考">
          <template slot-scope="scope">
            <el-input v-model="scope.row.clientProductRef" />
          </template>
        </el-table-column>

        <el-table-column align="center" min-width="150" label="备注" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.productRemark}}
          </template>
        </el-table-column>

        <el-table-column align="center" width="100" label="订货量">
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.productQuantity" size="small" :min="0" class="input-center" @change="changeNumber(scope.row)"/>
          </template>
        </el-table-column>

        <el-table-column align="center" width="100" label="单价">
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.productPrice" size="small" :min="0" class="input-center" @change="changeNumber(scope.row)"/>
          </template>
        </el-table-column>

        <el-table-column align="center" min-width="80" label="金额" prop="productAmount"/>

        <el-table-column align="center" width="70" label="操作" prop="quotePrice">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="removeOrderSku(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-row style="margin-top: 16px">
        <el-col :span="8">
          <el-form-item label="运费">
            <el-input v-model.number="editForm.orderFreight" :min="0" :precision="0" placeholder="请填写运费" style="width: 150px" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="报价单总额" v-if="editForm.quotedNo">
            {{editForm.estimatedAmountAll | moneyFmt}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="订单总额">
            {{allAmount | moneyFmt}}<span style="color: red" v-show="overAllowMoney">（订单总额允差不能超过{{editForm.toleranceNumber}}%）</span>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="允许的附件类型:">
            <el-checkbox-group v-model="fileTypeCheck" @change="getFileCheckBox">
              <el-checkbox v-for="(item, index) in fileTypeList" :label="item.value" :key="index">
                <span v-if="item.value !== '8'">{{item.label}}</span>
                <span v-else>{{newFileType}}</span>
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="备注" prop="orderRemarks">
            <el-input v-model="editForm.orderRemarks" :autosize="{ minRows: 4, maxRows: 6}" type="textarea" size="small" clearable style="width: 80%"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item style="text-align: center">
        <el-button type="primary" size="small" :loading="saveLoading" @click="onSubmit(1, 'editForm')">保存</el-button>
        <el-button type="primary" size="small" :loading="saveLoading" @click="onSubmit(2, 'editForm')">提交</el-button>
        <el-button type="danger" size="small" @click="closePage">返回</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :visible.sync="dialogVisible" title="选择订单商品" width="900px" center close-on-click-modal>
      <el-form label-width="100px" label-position="right" inline size="small">
        <el-form-item label="商品编码" prop="productCode">
          <el-input v-model="searchObj.productCode" clearable placeholder="调价单名称" style="width: 240px"/>
        </el-form-item>
        <el-form-item label="商品名称" prop="productName">
          <el-input v-model="searchObj.productName" clearable placeholder="调价单名称" style="width: 240px"/>
        </el-form-item>
          <el-form-item label="sku名称" prop="productName">
            <el-input v-model="searchObj.productName" clearable placeholder="调价单名称" style="width: 240px"/>
          </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchProductSku">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="listLoading1"
        :data="quoteSkuList"
        :element-loading-text="$t('system.userManage.lodding')"
        border
        fit
        size="mini"
        :header-cell-style="{background: '#a7bfee'}"
        @selection-change="getDialogSelect">
        <el-table-column align="center" type="selection" width="50"/>

        <el-table-column align="center" min-width="285px" label="商品信息" prop="inquiryNo" >
          <template slot-scope="scope">
            <div class="table-goods">
              <div class="goods-img"><img :src="scope.row.productImge" alt=""></div>
              <div class="goods-text">
                <div style="font-weight: bold">商品名称：{{scope.row.productName}}</div>
                <div>所属类目：{{scope.row.skuReference}}</div>
                <div>商品编码：{{scope.row.productCode}}</div>
                <div>海关编码：{{scope.row.customsCode}}</div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column align="center" min-width="150px" label="SKU描述" show-overflow-tooltip>
          <template slot-scope="scope">
            <div class="table-goods">
              <div class="goods-text" style="text-align: center">
                <div>{{scope.row.attrValueList}}</div>
                <div>sku编码：{{scope.row.skuCode}}</div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column align="center" width="150px" label="最低订货量" prop="mininum" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.mininum}}
          </template>
        </el-table-column>

        <el-table-column align="center" width="150px" label="单价" prop="unitPrice">
          <template slot-scope="scope">
            {{scope.row.unitPrice}}
          </template>
        </el-table-column>
      </el-table>
      <Pagination :total="searchObj.total" :page.sync="searchObj.pageNum" :limit.sync="searchObj.pageSize" @pagination="getQuotedProductSku"></Pagination>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="getOrderSku">确定</el-button>
        <el-button type="danger" size="small" @click="dialogVisible=false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { selectCurrencyCodeListApi, getSupplyCompanyList, selectCompanyBankAccountListApi, selectgetDictionaryBykeyApi, selectSysOrderParameterApi } from '@/api/system'
import { listCustomerInfoContactApi, getCustomerInfo, listCustomerBank } from '@/api/customer'
import { getQuotedProductSku } from '@/api/product'
import { parseTime } from '@/utils/index'
import { detailQuotedPrice } from '@/api/inquiry'
import { addSaleOrder, saleOrderDetail, updateSaleOrder } from '@/api/transitrade'
import moneyFmt from '@/mixin/moneyFmt'
export default {
  components: {
    Pagination
  },
  mixins: [moneyFmt],
  data() {
    return {
      listLoading1: false,
      dialogVisible: false,
      loading1: false,
      loading2: false,
      saveLoading: false,
      editType: false,
      overAllowMoney: false,
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
        sellerName: '',
        sellerBankAccount: '',
        sellerSwifcode: '',
        sysCompanyBId: '',
        transportationWay: 0,
        entrustTransportation: 0,
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
      editFormRules: {
        // arrivePort: [{ required: true, message: '请输入目的港口/地址', trigger: 'blur' }],
        // departurePort: [{ required: true, message: '请输入出发港口/地址', trigger: 'blur' }],
        entrustTransportation: [{ required: true, message: '请输入运输委托方', trigger: 'change' }],
        transportationWay: [{ required: true, message: '请选择运输方式', trigger: 'change' }],
        orderCurrency: [{ required: true, message: '币种不为空', trigger: 'change' }],
        payMode: [{ required: true, message: '请选择付款方式', trigger: 'change' }]
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
    orderMoneyTotal() {
      let val = 0;
      this.orderSkuList.forEach(e => {
        val += Number(e.productAmount)
      });
      return val.toFixed(4)
    },
    allAmount() {
      let val = 0;
      this.orderSkuList.forEach(e => {
        val += Number(e.productAmount)
      });
      val += Number(this.editForm.orderFreight);
      return val.toFixed(4)
    }
  },
  watch: {
    'editForm.customerBId' (val) {
      if (val) {
        this.customerContactFun(val);
        this.getCustomerBankList(val)
      }
    },
    'editForm.sysCompanyBId' (val) {
      if (val) {
        this.getCompanyBankList(val);
      }
    },
    allAmount(val) {
      this.overAllowMoney = (Math.abs((this.editForm.estimatedAmountAll - val) / this.editForm.estimatedAmountAll * 100) > this.editForm.toleranceNumber) && this.editForm.quotedNo
    }
  },
  created() {
    this.getFileTypeList();
    this.getCustomerInfoListFun();
    this.getSysCustomerInfoListFun();
    this.getCurrencyCodeList();
    if (this.$route.query.quoteId) {
      this.getQuoteDetail();
      this.orderSkuList = (this.selectQuoteSku || []).map(e => {
        e.mininum = e.productPriceGradient ? (e.productPriceGradient.mininum || 0) : 0;
        e.unitPrice = e.productPriceGradient ? (e.productPriceGradient.unitPrice || 0) : 0;
        e.mininumMoney = (e.mininum * e.unitPrice * 100) / 100;
        e.quoteMoney = Number(e.quoteNumber) * Number(e.quotePrice);
        e.productDescription = e.attrValueList;
        e.skuCode = e.productSkuModel.skuCode;
        e.productRemark = e.inquiryRemark;
        e.productPrice = e.quotePrice;
        e.clientProductRef = '';
        e.productQuantity = e.quoteNumber;
        e.singleAmount = e.singlePackage;
        e.skuReference = e.productSkuModel.productInfo.catalogBName;
        e.productUnit = e.productSkuModel.productInfo.productUnit;
        e.productAmount = (e.productQuantity * e.productPrice).toFixed(4);
        e.id = '';
        return { ... e }
      })
    }
    if (this.$route.query.id) {
      this.getSaleOrderDetail();
    }
    this.editType = this.$route.query.editType
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
    // 勾选触发 selects为选择的数据数组
    getDialogSelect(selects) {
      this.dialogSelectList = selects;
    },
    // 获取客户银行列表
    getCustomerBankList(id) {
      listCustomerBank({ customerBId: id, pageNum: 1, pageSize: 999 }).then(res => {
        this.customerBankList = res.data.list || [];
        // if (this.customerBankList.length && this.$route.query.quoteId) {
        //   this.editForm.buyerBankId = this.customerBankList.filter(e => e.defaultValue === 1)[0].id
        // }
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    setBuyerBankInfo(val) {
      if (val) {
        let obj = this.customerBankList.filter(e => {
          return e.id === val
        })[0];
        this.editForm.buyerBank = obj.bankName;
        this.editForm.buyerBankAccount = obj.bankAccount;
        this.editForm.buyerSwiftcode = obj.swiftCode;
      } else {
        this.editForm.buyerBank = '';
        this.editForm.buyerBankAccount = '';
        this.editForm.buyerSwiftcode = '';
      }
    },
    setSellerBankInfo(val) {
      if (val) {
        let obj = this.sysBankList.filter(e => {
          return e.id === val
        })[0];
        this.editForm.sellerBank = obj.bankName;
        this.editForm.sellerBankAccount = obj.bankAccount;
        this.editForm.sellerSwifcode = obj.swiftCode;
      } else {
        this.editForm.sellerBank = '';
        this.editForm.sellerBankAccount = '';
        this.editForm.sellerSwifcode = '';
      }
    },
    // 获取主体企业银行卡列表
    getCompanyBankList(id) {
      selectCompanyBankAccountListApi({ companyInfoBId: id, pageNum: 1, pageSize: 999 }).then(res => {
        this.sysBankList = res.data.list || [];
        // if (this.sysBankList.length && this.$route.query.quoteId) {
        //   this.editForm.sellerBankId = this.sysBankList.filter(e => e.defaultValue === 1)[0].id
        // }
      }).catch(err => {
        this.$message.error(err.message);
      });
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
    removeOrderSku(index) {
      this.orderSkuList.splice(index, 1)
    },
    openDialog() {
      this.dialogVisible = true;
      this.dialogSelectList = [];
      this.searchProductSku()
    },
    searchProductSku() {
      this.searchObj.pageNum = 1;
      this.getQuotedProductSku();
    },
    getQuotedProductSku() {
      let obj = {};
      for (let key in this.searchObj) {
        if (this.searchObj[key]) {
          obj[key] = this.searchObj[key]
        }
      }
      this.listLoading1 = true;
      getQuotedProductSku(obj).then(res => {
        this.quoteSkuList = res.data.list.map(e => {
          e.mininum = e.mininum || e.miniOrderNumber || 0;
          e.unitPrice = e.unitPrice || 0;
          e.mininumMoney = (e.mininum * e.unitPrice * 100) / 100;
          e.quoteMoney = e.mininumMoney;
          e.productDescription = e.attrValueList;
          e.productRemark = '';
          e.productPrice = e.unitPrice;
          e.productQuantity = e.mininum;
          e.singleAmount = e.singlePackage;
          e.skuReference = e.catalogBName;
          e.clientProductRef = '';
          e.productUnit = e.skuUnit;
          e.productImge = e.imagePath;
          e.productBId = e.bid;
          e.productAmount = (e.productQuantity * e.productPrice).toFixed(4);
          e.id = '';
          return { ...e }
        });
        this.searchObj.total = res.data.total;
        this.listLoading1 = false;
      }).catch(() => {
        this.listLoading1 = false;
      })
    },
    getOrderSku() {
      if (!this.dialogSelectList.length) {
        return this.$message.warning('请先选择商品')
      }
      let skuBIdArr = this.orderSkuList.map(e => e.skuBId);
      let arr = this.dialogSelectList.filter(t => {
        return !skuBIdArr.includes(t.skuBId)
      });
      this.orderSkuList = this.orderSkuList.concat(arr);
      this.dialogVisible = false;
      this.dialogSelectList = []
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
    changeNumber(item, val) {
      this.$nextTick(() => {
        item.productAmount = ((item.productQuantity * item.productPrice * 100) / 100).toFixed(4)
      })
    },
    // 客户下的联系人列表
    customerContactFun(val) {
      getCustomerInfo({ bid: val }).then(res => {
        let payterms = res.data.customerPaymentTerms.customerOrderPayNodeList;
        this.modalList = res.data.customerContactList || [];
        if (!this.$route.query.id && !this.$route.query.quoteId) {
          this.controlTowerList = (payterms && payterms.length ? payterms : res.data.customerPaymentTerms.sysOrderPayNodeList).map(e => {
            e.paymentTerm = e.dayNum;
            e.workflowProcessBId = e.controlNodeBId;
            return { ...e }
          });
          if (this.modalList.length) {
            this.editForm.buyerContactBy = this.modalList[0].accountBId
          }
        }
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
    getFileCheckBox(arr) {
      if (arr.length) {
        this.editForm.choosedAttachment = arr.join(',')
      } else {
        this.editForm.choosedAttachment = ''
      }
    },
    setBuyerInfo(val) {
      if (val) {
        let obj = this.customerInfoList.filter(e => e.bid === val)[0];
        this.editForm.buyerAddress = obj.officeAddress;
        this.editForm.buyerName = obj.companyName;
        this.editForm.buyerTelephone = obj.mobilePhone;
        this.editForm.buyerEmail = obj.emailAddress;
        this.editForm.buyerCountryCode = obj.cnCountryName;
        this.editForm.buyerShort = obj.shortName
      } else {
        this.editForm.buyerAddress = '';
        this.editForm.buyerName = '';
        this.editForm.buyerTelephone = '';
        this.editForm.buyerEmail = '';
        this.editForm.buyerCountryCode = '';
        this.editForm.buyerShort = ''
      }
    },
    setSellerInfo(val) {
      if (val) {
        let obj = this.sysCustomerInfoList.filter(e => e.bid === val)[0];
        this.editForm.sellerContact = obj.chargeBy;
        this.editForm.sellerAddress = obj.officeAddress;
        this.editForm.sellerTelephone = obj.chargePhone;
        this.editForm.sellerEmail = obj.emailAddress;
        this.editForm.sellerName = obj.companyName;
        this.editForm.sellerCountryCode = obj.countryCode;
        this.editForm.sellerName = obj.companyName;
        this.editForm.sellerShort = obj.companyShort
      } else {
        this.editForm.sellerContact = '';
        this.editForm.sellerAddress = '';
        this.editForm.sellerTelephone = '';
        this.editForm.sellerEmail = '';
        this.editForm.sellerName = '';
        this.editForm.sellerCountryCode = '';
        this.editForm.sellerName = '';
        this.editForm.sellerShort = ''
      }
    },
    getQuoteDetail() {
      detailQuotedPrice({ quotedPriceBId: this.$route.query.quoteId }).then(res => {
        this.editForm = Object.assign(this.editForm, res.data);
        this.editForm.createTime = '';
        this.editForm.updateTime = '';
        this.editForm.createUserId = '';
        this.editForm.updateUserId = '';
        this.editForm.bid = '';
        this.editForm.quotedBId = res.data.bid;
        this.editForm.id = '';
        this.editForm.entrustTransportation = res.data.transportMode;
        this.editForm.customerBId = res.data.costomerBId;
        this.editForm.buyerContactBy = res.data.buyerContact;
        this.editForm.transportationWay = res.data.transportType;
        this.editForm.orderCurrency = res.data.currency;
        this.editForm.dateOfDelivery = Number(res.data.deliveryDate);
        this.editForm.payMode = res.data.paymentTerms;
        this.editForm.orderFreight = res.data.forecastFare;
        this.editForm.departurePort = res.data.shippingPort;
        this.editForm.arrivePort = res.data.purposePort;
        this.editForm.totalAmount = 0;
        this.editForm.netTotalAmount = 0;
        this.editForm.choosedAttachment = '';
        this.controlTowerList = res.data.quotedOrderPayNodeList.map(e => {
          e.paymentTerm = e.dayNum;
          e.workflowProcessBId = e.controlNodeBId;
          return { ...e }
        });
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    getSaleOrderDetail() {
      saleOrderDetail({ orderBid: this.$route.query.id }).then(res => {
        this.editForm = Object.assign(this.editForm, res.data);
        this.editForm.dateOfDelivery = Number(res.data.dateOfDelivery);
        this.controlTowerList = this.editForm.salesOrderCollectionList;
        this.orderSkuList = this.editForm.salesOrderProductsList;
        this.fileTypeCheck = this.editForm.choosedAttachment.split(',');
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    onSubmit(status, formName) {
      if (status === 2 && !this.orderSkuList.length) {
        return this.$message.error('不能生成没有商品的订单');
      }
      if (!this.editForm.customerBId && !this.editForm.sysCompanyBId) {
        return this.$message.error('请选择买卖方公司');
      }
      if (!this.editForm.buyerBankId || !this.editForm.sellerBankId) {
        return this.$message.error('请选择开户银行');
      }
      if (this.overAllowMoney) {
        return this.$message.error('商品总额已超过报价单总额允差');
      }
      let obj1 = this.customerInfoList.filter(e => e.bid === this.editForm.customerBId)[0];
      let obj2 = this.sysCustomerInfoList.filter(e => e.bid === this.editForm.sysCompanyBId)[0];
      this.editForm.buyerCountryCode = this.editForm.buyerCountryCode || obj1.cnCountryName;
      this.editForm.buyerShort = this.editForm.buyerShort || obj1.shortName;
      this.editForm.sellerCountryCode = this.editForm.sellerCountryCode || obj2.countryCode;
      this.editForm.sellerName = this.editForm.sellerName || obj2.companyName;
      this.editForm.sellerShort = this.editForm.sellerShort || obj2.companyShort;
      this.editForm.orderStatus = status;
      this.editForm.salesOrderCollectionList = this.controlTowerList;
      this.editForm.salesOrderProductsList = this.orderSkuList;
      this.editForm.totalAmount = this.editForm.totalAmount || this.allAmount;
      this.editForm.netTotalAmount = this.editForm.netTotalAmount || this.orderMoneyTotal;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let api = this.$route.query.id ? updateSaleOrder : addSaleOrder;
          this.saveLoading = true;
          api(this.editForm).then(res => {
            this.closePage();
            this.saveLoading = false;
            this.$message.success(status === 1 ? '保存成功' : '提交成功');
          }).catch(err => {
            this.saveLoading = false;
            this.$message.error(err.message)
          })
        } else {
          this.$message.warning('请填写完整')
        }
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
  }
</style>
