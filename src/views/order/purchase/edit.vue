<template>
  <div class="app-container editPurchase">
    <div class="edit-title">采购订单</div>
    <el-form ref="editForm" :model="editForm" :rules="editFormRules" label-width="120px" size="small" class="edit-form" v-loading="loading">
      <el-row>
        <el-col :span="8">
          <el-form-item label="采购订单号">
            {{editForm.purchaseNo || '暂无单号'}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="订单日期">
            {{(editForm.orderCreateTime || new Date()) | timeFmt}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" class="row-item" justify="space-around">
        <el-col :span="10">
          <table class="form-table" border="0" cellspacing="0" cellpadding="0" style="width: 100%">
            <tr>
              <td width="40%" style="min-width: 100px">买方</td>
              <td width="60%">
                <el-select v-model="editForm.sysCompanyBId" placeholder="请选择买方企业名称" size="mini" filterable clearable class="edit-form-width input-center" @change="selectBuyerCompany">
                  <el-option v-for="(item, index) in mainCompanyList" :label="item.companyName" :value="item.bid" :key="index"></el-option>
                </el-select>
              </td>
            </tr>
            <tr>
              <td>买方联系人</td>
              <td>{{editForm.buyerContactBy}}</td>
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
                <el-select v-model="editForm.buyerBankId" clearable size="mini" placeholder="请选择开户银行" class="edit-form-width input-center" @change="setBuyerBankInfo">
                  <el-option v-for="(item, index) in sysBankList" :label="item.bankName" :value="item.id" :key="index"></el-option>
                </el-select>
              </td>
            </tr>
            <tr>
              <td>银行账号</td><td>{{editForm.buyerBankAccount}}</td>
            </tr>
            <tr>
              <td>SWIF编码</td><td>{{editForm.buyerSwiftcode}}</td>
            </tr>
          </table>
        </el-col>
        <el-col :span="10">
          <table class="form-table" border="0" cellspacing="0" cellpadding="0" style="width: 100%">
            <tr>
              <td width="40%" style="min-width: 100px">卖方</td>
              <td width="60%">
                <el-select v-model="editForm.supplierBId" placeholder="请选择卖方企业名称" size="mini" filterable clearable class="edit-form-width input-center" @change="selectSellerCompany">
                  <el-option v-for="(item, index) in supplierCompanyList" :label="item.companyName" :value="item.bid" :key="index"></el-option>
                </el-select>
              </td>
            </tr>
            <tr>
              <td>卖方联系人</td>
              <td>
                <el-select v-model="editForm.sellerContact" allow-create filterable default-first-option size="mini" placeholder="请选择联系人" class="edit-form-width input-center">
                  <el-option v-for="(item, index) in modalList" :label="item.contactName" :value="item.contactName" :key="index"></el-option>
                </el-select>
              </td>
            </tr>
            <tr>
              <td>卖方地址</td><td>{{editForm.sellerAddress}}</td>
            </tr>
            <tr>
              <td>卖方电话</td><td>{{editForm.sellerTelephone}}</td>
            </tr>
            <tr>
              <td>卖方邮箱</td><td>{{editForm.sellerEmail}}</td>
            </tr>
            <tr>
              <td><span class="label-required">开户银行</span></td>
              <td>
                <el-select v-model="editForm.sellerBankId" clearable placeholder="请选择开户银行" size="mini" class="edit-form-width input-center" @change="setSellerBankInfo">
                  <el-option v-for="(item, index) in supplierBankList" :label="item.bankName" :value="item.id" :key="index"></el-option>
                </el-select>
              </td>
            </tr>
            <tr>
              <td>银行账号</td><td>{{editForm.sellerBankAccount}}</td>
            </tr>
            <tr>
              <td>SWIF编码</td><td>{{editForm.sellerSwifcode}}</td>
            </tr>
          </table>
        </el-col>
      </el-row>
      <div class="table-top">
        <div class="top-title">
          采购商品：
        </div>
        <div class="top-btns">
          <el-button type="primary" size="small" :loading="loading2" @click="addSaleProduct">从销售订单中添加商品</el-button>
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
        :header-cell-style="{background: '#a7bfee'}">

        <el-table-column align="center" type="index" label="序号" width="55"/>

        <!--<el-table-column align="center" min-width="285px" label="商品信息" prop="inquiryNo" >-->
          <!--<template slot-scope="scope">-->
            <!--<div class="table-goods">-->
              <!--<div class="goods-img"><img :src="scope.row.productImge" alt=""></div>-->
              <!--<div class="goods-text">-->
                <!--<div style="font-weight: bold">商品名称：{{scope.row.productName}}</div>-->
                <!--<div>商品编码：{{scope.row.productCode}}</div>-->
                <!--<div>海关编码：{{scope.row.customsCode}}</div>-->
              <!--</div>-->
            <!--</div>-->
          <!--</template>-->
        <!--</el-table-column>-->

        <!--<el-table-column align="center" min-width="150px" label="SKU描述" >-->
          <!--<template slot-scope="scope">-->
            <!--<div class="table-goods">-->
              <!--<div class="goods-text" style="text-align: center">-->
                <!--<div>{{scope.row.productDescription}}</div>-->
                <!--<div>sku编码：{{scope.row.skuCode}}</div>-->
              <!--</div>-->
            <!--</div>-->
          <!--</template>-->
        <!--</el-table-column>-->

        <el-table-column align="center" width="80" label="HS码" prop="customsCode"/>

        <el-table-column align="center" width="80" label="SKU码" prop="skuCode"/>

        <el-table-column align="center" width="120" label="产品名称" prop="productName"/>

        <el-table-column align="center" min-width="150" label="产品描述" prop="productDescription"/>

        <el-table-column align="center" width="120" label="客户产品参考">
          <template slot-scope="scope">
            {{scope.row.clientProductRef}}
          </template>
        </el-table-column>

        <el-table-column align="center" min-width="100" label="销售订单号" prop="salesOrderNo"/>

        <el-table-column align="center" width="80" label="订货量" prop="productQuantity"/>

        <el-table-column align="center" width="100" label="单价">
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.productPrice" size="small" :min="0" class="input-center" @change="changeNumber(scope.row)"/>
          </template>
        </el-table-column>

        <el-table-column align="center" width="80" label="金额" prop="productAmount"/>

        <el-table-column align="center" min-width="150" label="备注">
          <template slot-scope="scope">
            {{scope.row.productRemark}}
          </template>
        </el-table-column>

        <el-table-column align="center" width="70" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="deleteSaleProduct(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row style="margin-top: 20px">
        <el-col :span="12">
          <el-form-item label="运输委托方" prop="entrustTransportation">
            <el-select v-model="editForm.entrustTransportation" class="form-dialog-width">
              <el-option label="自提" :value="0"></el-option>
              <el-option label="委托卖方" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="运输方式" prop="transportationWay">
            <el-select v-model="editForm.transportationWay" class="form-dialog-width">
              <el-option label="汽运" :value="0"></el-option>
              <el-option label="铁路" :value="1"></el-option>
              <el-option label="海运" :value="2"></el-option>
              <el-option label="空运" :value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出发港口/地址" prop="departurePort">
             <el-input v-model="editForm.departurePort" clearable placeholder="出发港口" class="form-dialog-width" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="目的港口/地址" prop="arrivePort">
            <el-input v-model="editForm.arrivePort" clearable placeholder="目的港口" class="form-dialog-width" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="币种" prop="orderCurrency">
            <el-select filterable remote :remote-method="getCurrencyCodeList" :loading="loading2" v-model="editForm.orderCurrency" placeholder="请输入币种名或者币种编码查找" class="edit-form-width">
              <el-option v-for="(item, index) in currencyCodeList" :label="item.searchCurrencyCodeStr" :value="item.searchCurrencyCodeStr" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="运费" prop="orderFreight">
            <el-input v-model="editForm.orderFreight" type="number" :min="0" clearable placeholder="请输入运费" class="form-dialog-width" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="订单总额">
            {{netOrderMoneyTotal | moneyFmt}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="付款方式" prop="payMode">
            <el-select v-model="editForm.payMode" placeholder="请选择付款方式" class="form-dialog-width">
              <el-option v-for="(item, index) in paymentMethodList" :label="item.label" :value="item.paymentMethod" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="交货日期" prop="dateOfDelivery">
            到款后<el-input-number v-model="editForm.dateOfDelivery" :min="0"></el-input-number>个工作日
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="付款条件设定">
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
              <!--{{item.dayNum || 0}}天-->
              <el-input v-model.number="item.paymentTerm" :min="0" :precision="0" clearable style="width: 120px" class="input-center" />&nbsp;天
            </td>
          </tr>
          <tr v-if="!controlTowerList.length">
            <td colspan="4" style="text-align: center;padding: 5px">暂无数据</td>
          </tr>
          </tbody>
        </table>
      </el-form-item>

      <el-row style="margin-top: 16px">
        <el-col>
          <el-form-item label="需要的附件:">
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

      <div style="margin: 20px;">
        <order-step v-if="!Number($route.query.type)" :list="allNodeList"></order-step>
      </div>

      <el-form-item style="text-align: center">
        <el-button type="primary" size="small" :loading="loading2" @click="submitOrder('editForm', 1)">保存</el-button>
        <el-button type="primary" size="small" :loading="loading2" @click="submitOrder('editForm', 2)">提交</el-button>
        <el-button type="danger" size="small" @click="closePage">返回</el-button>
      </el-form-item>
    </el-form>

    <el-dialog :visible.sync="dialogVisible" title="从销售订单中选择商品" width="1050px" center :close-on-click-modal="false">
      <div class="sale-order-list">
        <div class="search-div">
          <div>
            销售订单号：
            <el-input v-model="postData.orderNo" clearable placeholder="请输入销售订单号" size="small" style="width: 180px" />
          </div>
          <div>
            客户名称：
            <el-input v-model="postData.customerUserName" clearable placeholder="请输入客户名称" size="small" style="width: 180px" />
          </div>
          <div>
            <el-button type="primary" class="export" size="small" @click="searchSaleOrder">搜索</el-button>
          </div>
        </div>
        <div class="search-div">
          <div>待采购销售订单：</div>
        </div>
        <el-table
          :data="dataList"
          border
          fit
          size="mini"
          highlight-current-row
          :header-cell-style="{background: '#a7bfee'}"
          @row-click="handleCurrentChange">

          <el-table-column align="center" width="60">
            <template slot-scope="scope">
              <el-radio v-model="scope.row.radio" :label="true">{{null}}</el-radio>
            </template>
          </el-table-column>

          <el-table-column
            align="center"
            type="index"
            width="55">
          </el-table-column>
          <el-table-column label="销售订单号" prop="orderNo" />

          <el-table-column align="center" label="客户名称" prop="buyerName" />

          <el-table-column align="center" label="国家" prop="buyerCountryCode" />

          <el-table-column align="center" width="200" label="订单日期" prop="orderTime">
            <template slot-scope="scope">
              {{scope.row.orderTime | timeFmt}}
            </template>
          </el-table-column>
        </el-table>
        <Pagination :total="postData.total" :page.sync="postData.pageIndex" :limit.sync="postData.pageSize" @pagination="getDataList" ></Pagination>
      </div>
      <div class="sale-order-sku">
        <div class="company-fill">
          请选择商品：
        </div>
        <el-table
          ref="multipleTable"
          :data="dialogOrderSkuList"
          border
          fit
          show-summary
          size="mini"
          max-height="520"
          style="font-size: 12px"
          :header-cell-style="{background: '#a7bfee'}"
          @selection-change="getDialogSelect">

          <el-table-column
            align="center"
            type="selection"
            width="55">
          </el-table-column>

          <el-table-column align="center" type="index" label="序号" width="55"/>

          <el-table-column align="center" min-width="285px" label="商品信息" prop="inquiryNo" >
            <template slot-scope="scope">
              <div class="table-goods">
                <div class="goods-img"><img :src="scope.row.productImge" alt=""></div>
                <div class="goods-text">
                  <div style="font-weight: bold">商品名称：{{scope.row.productName}}</div>
                  <div>商品编码：{{scope.row.productCode}}</div>
                  <div>海关编码：{{scope.row.customsCode}}</div>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column align="center" min-width="150px" label="SKU描述" >
            <template slot-scope="scope">
              <div class="table-goods">
                <div class="goods-text" style="text-align: center">
                  <div>{{scope.row.productDescription}}</div>
                  <div>sku编码：{{scope.row.skuCode}}</div>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column align="center" width="150px" label="订货量" prop="productQuantity"/>

          <el-table-column align="center" width="180" label="销售订单号" prop="salesOrderNo"/>
        </el-table>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="addOrderSku">确定</el-button>
        <el-button type="danger" size="small" @click="dialogVisible=false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import OrderStep from '@/components/OrderStep'
import { selectCurrencyCodeListApi, selectSysOrderParameterApi, selectgetDictionaryBykeyApi, selectCompanyBankAccountListApi } from '@/api/system'
import { getDetailPOFlowById,
  selectSupplierCompanyList,
  addPurchaseOrder,
  updatePurchaseOrder,
  payTermsByBid,
  getSaleOrderSkuByBId,
  getWaitSaleOrder
} from '@/api/purchaseOrder'
import { supplierBankList, getLinkList } from '@/api/supplier'
import { parseTime } from '@/utils/index'
import moneyFmt from '@/mixin/moneyFmt'
export default {
  components: {
    Pagination,
    OrderStep
  },
  mixins: [moneyFmt],
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
      loading: true,
      loading1: false,
      loading2: false,
      currencyCodeList: [],
      modalList: [],
      selectList: [],
      dialogSelectList: [],
      controlTowerList: [],
      orderSkuList: [],
      fileTypeCheck: [],
      allNodeList: [],
      dataList: [],
      dialogOrderSkuList: [],
      newFileType: '',
      overAllowMoney: false,
      editForm: {
        netTotalAmount: 0, // 订单总金额
        purchaseNo: '',
        buyerName: '',
        buyerContactBy: '',
        buyerAddress: '',
        buyerTelephone: '',
        buyerEmail: '',
        buyerBank: '',
        buyerBankId: '',
        buyerBankAccount: '',
        buyerSwiftcode: '',
        salesOrderBId: '',
        sellerName: '',
        sellerContact: '',
        sellerAddress: '',
        sellerTelephone: '',
        sellerEmail: '',
        sellerBank: '',
        sellerBankId: '',
        sellerBankAccount: '',
        sellerSwifcode: '',
        supplierBId: '', // 供应商BID
        orderCreateTime: '', // 采购订单创建时间
        sysCompanyBId: '', //  企业主体BID
        transportationWay: 0, // 运输方式
        entrustTransportation: 1, // 运输委托方（0铭美、1自提）
        orderCurrency: '', // 订单货币
        dateOfDelivery: 0, // 交货日期说明
        payMode: '', // 支付方式
        orderFreight: 0, // 运费
        choosedAttachment: '', // 选择的附件
        orderRemarks: '', // 订单备注
        arrivePort: '', // 到达港口
        departurePort: '', // 出发港口
        type: '' // 是否需要转单(1.转单，2.不转单)
      },
      editFormRules: {
        dateOfDelivery: [
          { required: true, message: '请填写付款限制天数', trigger: 'blur' }
        ],
        payMode: [
          { required: true, message: '请选择付款方式', trigger: 'change' }
        ],
        departurePort: [
          { required: true, message: '请填写出发港口', trigger: 'blur' }
        ],
        arrivePort: [
          { required: true, message: '请选择到达港口', trigger: 'blur' }
        ],
        orderFreight: [
          { required: true, message: '请填写运费', trigger: 'blur' }
        ],
        orderCurrency: [
          { required: true, message: '请选择币种', trigger: 'change' }
        ]
      },
      postData: {
        productCode: '',
        productName: '',
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      saleOrder: {},
      mainCompanyList: [], // 主体企业
      supplierCompanyList: [], // 供应商主体企业
      sysBankList: [],
      supplierBankList: [],
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
    netOrderMoneyTotal() {
      let val = 0;
      this.orderSkuList.forEach(e => {
        val += Number(e.productAmount)
      });
      val += Number(this.editForm.orderFreight);
      return val.toFixed(4)
    },
    orderMoneyTotal() {
      let val = 0;
      this.orderSkuList.forEach(e => {
        val += Number(e.productAmount)
      });
      return val.toFixed(4)
    },
    totalPayments() {
      let val = 0;
      this.controlTowerList.forEach(e => {
        val += Number(e.paymentRatio)
      });
      return val
    }
  },
  watch: {
    'editForm.supplierBId' (val) {
      if (val) {
        let obj = this.supplierCompanyList.filter(e => e.bid === val)[0];
        if (obj.type === 2) {
          this.supplierContactFun(val);
        } else {
          this.modalList = [];
        }
        this.editForm.type = obj.type;
        this.getSupplierBankList(val, obj.type)
      }
    },
    'editForm.sysCompanyBId' (val) {
      if (val) {
        this.getCompanyBankList(val);
      }
    }
  },
  created() {
    this.getCurrencyCodeList();
    this.getFileTypeList();
    this.promise()
  },
  methods: {
    closePage() {
      this.$store.dispatch('delView', this.activeRoute).then(() => {
        this.$router.push({
          path: '/order/purchase/purchaseOrder'
        })
      })
    },
    async promise() {
      try {
        await this.getSysCompanyList();
        await this.getSupplierCompanyList();
        if (this.$route.query.id) {
          this.getPurchaseOrderDetail();
        }
        this.loading = false
      } catch (e) {
        this.loading = false;
        this.$message.error(e.message)
      }
    },
    addSaleProduct() {
      this.dialogVisible = true;
      this.postData.pageIndex = 1;
      this.dialogOrderSkuList = [];
      this.selectList = [];
      this.saleOrder = {};
      this.getDataList()
    },
    searchSaleOrder() {
      this.postData.pageIndex = 1;
      this.getDataList()
    },
    getDataList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      getWaitSaleOrder(obj).then(res => {
        this.dataList = res.data.list;
        this.postData.total = res.data.total;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message);
      })
    },
    handleCurrentChange(row) {
      this.saleOrder = row;
      this.dataList.forEach(e => {
        e.radio = false;
      });
      row.radio = true;
      getSaleOrderSkuByBId({ salesOrderBid: row.bid }).then(res => {
        this.dialogOrderSkuList = res.data.map(e => {
          e.salesOrderNo = row.orderNo;
          return { ...e }
        });
        this.listLoading = false;
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    addOrderSku() {
      if (!this.selectList.length) {
        return this.$message.warning('请先选择商品');
      }
      if (!this.orderSkuList.length) {
        this.orderSkuList = this.selectList
      } else {
        let arr = [];
        let ids = [];
        this.orderSkuList.forEach(e => {
          this.selectList.forEach(t => {
            if ((e.skuBId === t.skuBId) && (e.salesOrderNo === t.salesOrderNo)) {
              arr.push(t)
            }
          })
        });
        ids = arr.map(e => e.id);
        let addArr = this.selectList.filter(e => !ids.includes(e.id));
        this.orderSkuList = this.orderSkuList.concat(addArr);
      }
      this.$refs.multipleTable.clearSelection();
      this.dialogVisible = false;
    },
    deleteSaleProduct(index) {
      this.orderSkuList.splice(index, 1)
    },
    selectBuyerCompany(val) {
      if (val) {
        let obj = this.mainCompanyList.filter(e => {
          return e.bid === val
        })[0];
        this.editForm.buyerName = obj.companyName;
        this.editForm.buyerContactBy = obj.chargeBy;
        this.editForm.buyerAddress = obj.officeAddress;
        this.editForm.buyerTelephone = obj.officePhone;
        this.editForm.buyerEmail = obj.emailAddress;
        this.editForm.buyerShort = obj.companyShortName;
        this.editForm.buyerCode = obj.companyCode;
        this.editForm.buyerCountryCode = obj.countryName;
        this.editForm.buyerBankId = '';
      } else {
        this.editForm.buyerName = '';
        this.editForm.buyerContactBy = '';
        this.editForm.buyerAddress = '';
        this.editForm.buyerTelephone = '';
        this.editForm.buyerShort = '';
        this.editForm.buyerCountryCode = '';
        this.editForm.buyerCode = '';
        this.editForm.buyerEmail = '';
      }
    },
    selectSellerCompany(val) {
      if (val) {
        let obj = this.supplierCompanyList.filter(e => {
          return e.bid === val
        })[0];
        this.editForm.sellerName = obj.companyName;
        if (obj.type === 1) {
          this.editForm.sellerContact = obj.chargeBy;
        } else {
          this.editForm.sellerContact = '';
        }
        this.editForm.sellerAddress = obj.officeAddress;
        this.editForm.sellerTelephone = obj.officePhone;
        this.editForm.sellerEmail = obj.emailAddress;
        this.editForm.sellerCode = obj.companyCode;
        this.editForm.sellerShort = obj.companyShortName;
        this.editForm.sellerCountryCode = obj.countryName;
        this.editForm.sellerBankId = '';
        this.editForm.type = obj.type;
        this.selectPayTermsByBid(val);
      } else {
        this.editForm.sellerName = '';
        this.editForm.sellerContact = '';
        this.editForm.sellerAddress = '';
        this.editForm.sellerTelephone = '';
        this.editForm.sellerEmail = '';
        this.editForm.sellerShort = '';
        this.editForm.sellerCountryCode = '';
        this.editForm.sellerCode = '';
        this.editForm.sellerBankId = '';
        this.editForm.type = '';
      }
    },
    getFileCheckBox(arr) {
      if (arr.length) {
        this.editForm.choosedAttachment = arr.join(',')
      } else {
        this.editForm.choosedAttachment = ''
      }
    },
    getDialogSelect(selects) {
      this.selectList = selects;
    },
    changeNumber(item) {
      this.$nextTick(() => {
        item.productAmount = ((item.productQuantity * item.productPrice * 100) / 100).toFixed(4)
      })
    },
    // 主体企业和供应商列表
    getSupplierCompanyList() {
      return new Promise((resolve, reject) => {
        selectSupplierCompanyList({ type: 1 }).then(res => {
          this.supplierCompanyList = res.data || [];
          resolve(res)
        }).catch(err => {
          reject(err);
          this.$message.error(err.message);
        });
      })
    },
    getSysCompanyList() {
      return new Promise((resolve, reject) => {
        selectSupplierCompanyList({ type: 0 }).then(res => {
          this.mainCompanyList = res.data || [];
          resolve(res)
        }).catch(err => {
          reject(err);
          this.$message.error(err.message);
        });
      })
    },
    // 获取供应商联系人
    supplierContactFun(val) {
      getLinkList({ supplierBId: val }).then(res => {
        this.modalList = res.data || [];
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 获取主体企业银行卡列表
    getCompanyBankList(id) {
      selectCompanyBankAccountListApi({ companyInfoBId: id, pageNum: 1, pageSize: 999 }).then(res => {
        this.sysBankList = res.data.list || [];
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 获取供应商银行卡列表
    getSupplierBankList(val, type) {
      if (type === 2) {
        supplierBankList({ supplierBId: val }).then(res => {
          this.supplierBankList = res.data || [];
        }).catch(err => {
          this.$message.error(err.message);
        });
      } else {
        selectCompanyBankAccountListApi({ companyInfoBId: val, pageNum: 1, pageSize: 999 }).then(res => {
          this.supplierBankList = res.data.list || [];
        }).catch(err => {
          this.$message.error(err.message);
        });
      }
    },
    getFileTypeList() {
      selectgetDictionaryBykeyApi({ key: 'accessory' }).then(res => {
        this.getSaleSetting(res.data);
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    setBuyerBankInfo(val) {
      if (val) {
        let obj = this.sysBankList.filter(e => {
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
        let obj = this.supplierBankList.filter(e => {
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
    getSaleSetting(fileTypeList) {
      selectSysOrderParameterApi({ orderParameterType: 3 }).then(res => {
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
    // 获取付款条件节点数据
    selectPayTermsByBid(val) {
      payTermsByBid({ supplierBId: val }).then(res => {
        if (res.data.sopnList && res.data.sopnList.length) {
          this.controlTowerList = res.data.sopnList.map(e => {
            e.paymentTerm = e.dayNum;
            return { ...e }
          });
        } else {
          this.controlTowerList = res.data.sysOrderPayNodeList.map(e => {
            e.paymentTerm = e.dayNum;
            return { ...e }
          });
        }
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    getPurchaseOrderDetail() {
      getDetailPOFlowById({ bid: this.$route.query.id }).then(res => {
        this.editForm = Object.assign(this.editForm, res.data);
        this.orderSkuList = this.editForm.productList;
        if (this.editForm.paymentList && this.editForm.paymentList.length) {
          this.controlTowerList = this.editForm.paymentList;
        } else {
          this.selectPayTermsByBid(this.editForm.supplierBId);
        }
        if (res.data.wfplist && res.data.wfplist.length) {
          this.allNodeList = res.data.wfplist.map(e => {
            e.currentCompletion = e.currentCompletion.toString();
            return { ...e }
          });
        }
        if (this.editForm.sysCompanyBId) {
          this.getCompanyBankList(this.editForm.sysCompanyBId);
        }
        // if (this.editForm.supplierBId) {
        //   this.getSupplierBankList(this.editForm.supplierBId)
        // }
        if (this.editForm.choosedAttachment) {
          this.fileTypeCheck = this.editForm.choosedAttachment.split(',');
        }
      }).catch(err => {
        this.$message.error(err.message);
      })
    },
    submitOrder(formName, orderStatus) {
      const { sysCompanyBId, supplierBId, sellerBankId, buyerBankId, sellerContact } = this.editForm;
      if (!sysCompanyBId && !supplierBId && !sellerBankId && !buyerBankId && !sellerContact) {
        return this.$message.warning('请选择买卖企业、联系人和开户银行账户')
      }
      if (this.totalPayments !== 100) {
        return this.$message.warning('付款总额只能为100%')
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading2 = true;
          // 订单状态
          this.editForm.orderStatus = orderStatus;
          this.editForm.productList = this.orderSkuList.map(e => {
            e.supplierBId = this.editForm.supplierBId;
            e.type = this.editForm.type;
            return { ...e }
          });
          this.editForm.salesOrderBId = [... new Set(this.orderSkuList.map(e => e.salesOrderBId))].join(',');
          this.editForm.netTotalAmount = this.orderMoneyTotal;
          this.editForm.paymentList = this.controlTowerList;
          let api = this.$route.query.id ? updatePurchaseOrder : addPurchaseOrder;
          api(this.editForm).then(res => {
            this.loading2 = false;
            this.$message.success(orderStatus === 2 ? '提交成功' : '保存成功');
            this.closePage()
          }).catch(err => {
            this.loading2 = false;
            this.$message.error(err.message)
          })
        } else {
          this.$message.warning('请填写完整')
        }
      });
    }
  }
}
</script>

<style lang="scss">
  @import '~@/styles/variables.scss';
  .editPurchase {
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
      width: 700px !important;
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
    .sale-order-list {
      margin: 20px 0;
      border-bottom: 1px solid $border-light-color;
      .search-div {
        padding: 5px;
        line-height: 38px;
        >div {
          display: inline-block;
          margin-right: 50px;
        }
      }
    }
    .sale-order-sku {
      margin: 20px 0;
      .company-fill {
        text-align: left;
        padding: 5px;
      }
    }
  }
</style>
