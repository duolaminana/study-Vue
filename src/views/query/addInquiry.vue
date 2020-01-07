<template>
  <div class="app-container addInquiry">
    <div class="edit-title">新增报价单</div>
    <el-form ref="editForm" :model="editForm" label-width="120px" size="small" :rules="editRules" class="edit-form" v-loading="loading">
      <el-row type="flex" class="row-item" justify="center">
        <el-col>
          <table class="form-table" border="0" cellspacing="0" cellpadding="0" style="width: 100%">
            <tr>
              <td width="40%">客户</td>
              <td width="60%">
                <el-select v-model="editForm.costomerBId" size="mini" placeholder="请选择公司名称" class="edit-form-width input-center">
                  <el-option v-for="(item, index) in customerInfoList" :label="item.companyName" :value="item.bid" :key="index"></el-option>
                </el-select>
              </td>
            </tr>
            <tr>
              <td>联系人</td>
              <td>
                <el-select v-model="editForm.userBId" size="mini" placeholder="请选择购买人" class="edit-form-width input-center" @change="getContactName">
                  <el-option v-for="(item, index) in modalList" :label="item.contactName" :value="item.accountBId" :key="index"></el-option>
                </el-select>
              </td>
            </tr>
            <tr>
              <td>地址</td>
              <td>{{editForm.contactAddress}}</td>
            </tr>
            <tr>
              <td>电话</td>
              <td>{{editForm.mobilePhone}}</td>
            </tr>
            <tr>
              <td>邮箱</td>
              <td>{{editForm.emailAddress}}</td>
            </tr>
          </table>
        </el-col>
        <!--<el-col :span="10">-->
          <!--<table class="form-table" border="0" cellspacing="0" cellpadding="0" style="width: 100%">-->
            <!--<tr>-->
              <!--<td width="40%">卖方</td>-->
              <!--<td width="60%">-->
                <!--<el-select v-model="editForm.sysCompanyBId" clearable size="mini" placeholder="请选择卖方企业名称" class="edit-form-width input-center">-->
                  <!--<el-option v-for="(item, index) in sysCustomerInfoList" :label="item.companyName" :value="item.bid" :key="index"></el-option>-->
                <!--</el-select>-->
              <!--</td>-->
            <!--</tr>-->
            <!--<tr>-->
              <!--<td>卖方联系人</td>-->
              <!--<td>-->
                <!--{{editForm.sellerContact}}-->
              <!--</td>-->
            <!--</tr>-->
            <!--<tr>-->
              <!--<td>卖方地址</td>-->
              <!--<td>{{editForm.sellerAddress}}</td>-->
            <!--</tr>-->
            <!--<tr>-->
              <!--<td>卖方联系电话</td>-->
              <!--<td>{{editForm.sellerTelephone}}</td>-->
            <!--</tr>-->
            <!--<tr>-->
              <!--<td>卖方邮箱</td>-->
              <!--<td>{{editForm.sellerEmail}}</td>-->
            <!--</tr>-->
          <!--</table>-->
        <!--</el-col>-->
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="运输委托方" prop="transportMode">
            <el-select v-model="editForm.transportMode" clearable placeholder="请选择运输委托方" class="edit-form-width">
              <el-option label="委托卖方" :value="1"></el-option>
              <el-option label="自提" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="运输方式" prop="transportType">
            <el-select v-model="editForm.transportType" clearable placeholder="请选择运输方式" class="edit-form-width">
              <el-option label="汽运" :value="0"></el-option>
              <el-option label="铁路" :value="1"></el-option>
              <el-option label="海运" :value="2"></el-option>
              <el-option label="空运" :value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出发港口/地址" prop="shippingPort">
            <el-input v-model="editForm.shippingPort" clearable placeholder="请输入出发港口/地址" class="edit-form-width" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="目的港口/地址" prop="purposePort">
            <el-input v-model="editForm.purposePort" clearable placeholder="请输入目的港口/地址" class="edit-form-width" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="币种" prop="currency">
            <el-select filterable remote :remote-method="getCurrencyCodeList" :loading="loading2" v-model="editForm.currency" clearable placeholder="请输入币种名或者币种编码查找" class="edit-form-width">
              <el-option v-for="(item, index) in currencyCodeList" :label="item.searchCurrencyCodeStr" :value="item.searchCurrencyCodeStr" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="付款方式" prop="paymentTerms">
            <el-select v-model="editForm.paymentTerms" clearable placeholder="请选择付款方式" class="edit-form-width">
              <el-option v-for="(item, index) in paymentMethodList" :label="item.label" :value="item.paymentMethod" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="交付期限" prop="deliveryDate">
            到款后<el-input v-model.number="editForm.deliveryDate" :min="0" class="input-center" style="width: 60px"/>个工作日
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="其他条款" prop="otherTerms">
            <el-input v-model="editForm.otherTerms" clearable style="width: 80%" />
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
              <el-input v-model.number="item.paymentRatio" type="number" :min="0" :precision="0" clearable style="width: 200px" >
                <template slot="append">%</template>
              </el-input>
            </td>
            <td>
              <el-input v-model.number="item.dayNum" type="number" :min="0" :precision="0" clearable style="width: 200px" >
                <template slot="append">天</template>
              </el-input>
            </td>
          </tr>
          <tr v-if="!controlTowerList.length">
            <td colspan="4" style="text-align: center;padding: 5px">暂无数据</td>
          </tr>
          </tbody>
        </table>
      </el-form-item>
      <div class="table-top">
        <div class="top-title">询价商品列表</div>
        <div class="top-btns">
          <el-button type="primary" size="small" @click="openDialog">添加商品</el-button>
          <el-button type="danger" size="small" @click="deleteAllSku">清空</el-button>
        </div>
      </div>
      <el-table
        :data="dataList"
        border
        fit
        show-summary
        size="small"
        max-height="520"
        style="font-size: 12px"
        :header-cell-style="{background: '#a7bfee'}">
        <el-table-column align="center" type="index" label="序号" width="55"/>

        <!--<el-table-column align="center" type="selection" width="50"/>-->

        <el-table-column align="center" min-width="285px" label="商品信息" prop="inquiryNo" >
          <template slot-scope="scope">
            <div class="table-goods">
              <div class="goods-img"><img :src="scope.row.productImge" alt=""></div>
              <div class="goods-text">
                <div>{{scope.row.productName}}</div>
                <div>{{scope.row.attrValueList}}</div>
                <div>商品编码：{{scope.row.productCode}}</div>
                <div>海关编码：{{scope.row.customsCode}}</div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column align="center" width="150px" label="起订量">
          <template slot-scope="scope">
            {{scope.row.mininum}}
          </template>
        </el-table-column>

        <el-table-column align="center" width="150px" label="询价量" prop="orderNumber">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.orderNumber" controls-position="right" size="small" :min="0" />
          </template>
        </el-table-column>

        <el-table-column align="center" width="200px" label="询价备注">
          <template slot-scope="scope">
            <el-input v-model="scope.row.inquiryRemark" :autosize="{ minRows: 4, maxRows: 6}" type="textarea" size="small" clearable style="font-size: 12px"/>
          </template>
        </el-table-column>

        <el-table-column align="center" width="100" label="操作">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="deleteSku(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--<Pagination :total="editForm.total" :page.sync="editForm.pageNum" :limit.sync="editForm.pageSize" @pagination="getDetail"></Pagination>-->
      <el-form-item/>
      <el-row>
        <el-col>
          <el-form-item label="询价备注" prop="remarks">
            <el-input v-model="editForm.remarks" :autosize="{ minRows: 4, maxRows: 6}" type="textarea" size="small" clearable style="width: 80%"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item style="text-align: center">
        <el-button type="primary" size="small" :loading="saveLoading" @click="confirmAdd('editForm')">提交</el-button>
        <el-button type="danger" size="small" @click="closePage">返回</el-button>
      </el-form-item>
    </el-form>

    <el-dialog :visible.sync="dialogVisible" title="选择商品报价" width="1000px" center close-on-click-modal>
      <el-form ref="editForm" :model="searchObj" label-width="100px" label-position="right" inline size="small">
        <el-form-item label="所属类目">
          <el-cascader
            style="width: 240px"
            v-model="parentsName"
            :options="searchDataList"
            :props="{value: 'bid', label: 'catalogName', children: 'children'}"
            filterable
            clearable
            placeholder="可搜索"
            change-on-select
            @change="getParentId"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="商品编码" prop="productCode">
          <el-input v-model="searchObj.productCode" clearable placeholder="调价单名称" style="width: 240px"/>
        </el-form-item>
        <el-form-item label="商品名称" prop="productName">
          <el-input v-model="searchObj.productName" clearable placeholder="调价单名称" style="width: 240px"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchProductSku">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="listLoading1"
        :data="productSkuList"
        element-loading-text="正在查询中。。。"
        border
        fit
        size="mini"
        :header-cell-style="{background: '#a7bfee'}"
        @selection-change="getSelect">
        <el-table-column
          align="center"
          type="selection"
          width="55">
        </el-table-column>

        <el-table-column align="center" width="180" label="所属类目" prop="catalogBName" />

        <el-table-column align="center" label="商品名称" prop="productName"/>

        <el-table-column align="center" width="100" label="商品编码" prop="productCode"/>

        <el-table-column align="center" min-width="180px" label="SKU" prop="attrValueList" />

        <el-table-column align="center" width="80" label="起订量" prop="mininum" />

        <el-table-column align="center" width="80" label="单价" prop="unitPrice" />
      </el-table>

      <Pagination :total="searchObj.total" :page.sync="searchObj.pageNum" :limit.sync="searchObj.pageSize" @pagination="getQuotedProductSku"></Pagination>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="addQuotedSku">保存</el-button>
        <el-button type="danger" size="small" @click="dialogVisible=false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getPublicCategory, getQuotedProductSku } from '@/api/product'
import { selectCurrencyCodeListApi, getSupplyCompanyList } from '@/api/system'
import { listCustomerInfoContactApi, getCustomerInfo } from '@/api/customer'
import { parseTime } from '@/utils/index'
import { detailQuotedPrice, addInquiry, detailInquiryPrice } from '@/api/inquiry'
export default {
  components: {
    Pagination
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
      dataList: [],
      listLoading1: false,
      dialogVisible: false,
      loading: true,
      loading1: false,
      loading2: false,
      saveLoading: false,
      editType: false,
      parentsName: [],
      countryList: [],
      currencyCodeList: [],
      customerInfoList: [],
      sysCustomerInfoList: [],
      productSkuList: [],
      modalList: [],
      editForm: {
        costomerBId: '',
        contactBy: '',
        contactAddress: '',
        mobilePhone: '',
        emailAddress: '',
        buyerName: '',
        transportType: 0,
        transportMode: 0,
        shippingPort: '',
        purposePort: '',
        currency: '',
        deliveryDate: 0,
        paymentTerms: '',
        forecastFare: 0,
        remarks: '',
        otherTerms: '',
        userBId: ''
      },
      editRules: {
        // costomerBId: [
        //   { required: true, message: '请选择购买公司', trigger: 'change' }
        // ],
        // userBId: [
        //   { required: true, message: '请选择购买人', trigger: 'change' }
        // ],
        shippingPort: [
          { required: true, message: '请填写出发港口/地址', trigger: 'blur' }
        ],
        purposePort: [
          { required: true, message: '请填写目的港口/地址', trigger: 'blur' }
        ],
        emailAddress: [
          { required: true, message: '请填写邮箱', trigger: 'blur' }
        ],
        deliveryDate: [
          { type: 'number', required: true, message: '请填写付款限制天数', trigger: 'blur' }
        ],
        paymentTerms: [
          { required: true, message: '请选择付款方式', trigger: 'change' }
        ]
        // approvalBId: [
        //   { required: true, message: '请选择审批流程', trigger: 'change' }
        // ]
      },
      searchObj: {
        productCode: '',
        productName: '',
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      customTime: [],
      searchDataList: [],
      selectList: [],
      controlTowerList: [],
      paymentMethodList: [
        {
          label: 'T/T',
          paymentMethod: 1
        },
        {
          label: 'L/C',
          paymentMethod: 2
        },
        {
          label: 'P/A',
          paymentMethod: 3
        },
        {
          label: 'D/A',
          paymentMethod: 4
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
    userInfo () {
      return this.$store.state.user.userInfo
    },
    totalSum() {
      let val = 0;
      this.controlTowerList.forEach(e => {
        val += Number(e.paymentRatio)
      });
      return val
    },
    quoteMoneyTotal() {
      let val = 0;
      this.dataList.forEach(e => {
        val += Number(e.quoteMoney)
      });
      val += Number(this.editForm.forecastFare);
      return val.toFixed(4)
    }
  },
  watch: {
    'editForm.costomerBId' (val) {
      if (val) {
        this.customerContactFun(val);
        let obj = this.customerInfoList.filter(e => e.bid === val)[0];
        this.editForm.contactAddress = obj.officeAddress;
        this.editForm.mobilePhone = obj.mobilePhone;
        this.editForm.emailAddress = obj.emailAddress;
      } else {
        this.editForm.contactAddress = '';
        this.editForm.mobilePhone = '';
        this.editForm.emailAddress = '';
      }
      this.editForm.userBId = '';
    }
  },
  created() {
    if (this.$route.query.id) {
      this.editType = true;
    }
    this.getCurrencyCodeList();
    // 获取类目列表
    this.getAllDataList();
    this.promise()
  },
  methods: {
    closePage() {
      this.$store.dispatch('delView', this.activeRoute).then(() => {
        this.$router.push({
          path: '/query/inquiry'
        })
      })
    },
    async promise() {
      try {
        await this.getCustomerInfoListFun();
        await this.getSysCustomerInfoListFun();
        this.getDetail();
        this.loading = false
      } catch (e) {
        this.$message.error(e.message)
      }
    },
    getContactName(val) {
      if (val) {
        let obj = this.modalList.filter(e => e.accountBId === val)[0];
        this.editForm.contactBy = obj.contactName
      } else {
        this.editForm.contactBy = ''
      }
    },
    getParentId(arr) {
      if (arr.length) {
        this.searchObj.catalogBId = arr.join(',');
      } else {
        this.searchObj.catalogBId = '';
      }
    },
    getSelect(selects) {
      this.selectList = selects;
    },
    // 客户人列表
    getCustomerInfoListFun() {
      return new Promise((resolve, reject) => {
        listCustomerInfoContactApi().then(res => {
          this.customerInfoList = res.data || [];
          resolve(res)
        }).catch(err => {
          reject(err);
          this.$message.error(err.message);
        });
      })
    },
    // 主体企业列表
    getSysCustomerInfoListFun() {
      return new Promise((resolve, reject) => {
        getSupplyCompanyList().then(res => {
          this.sysCustomerInfoList = res.data || [];
          resolve(res)
        }).catch(err => {
          reject(err);
          this.$message.error(err.message);
        });
      })
    },
    getAllDataList() {
      getPublicCategory({ pageSize: 999, pageNum: 1 }).then(res => {
        this.searchDataList = res.data.list;
      })
    },
    // 客户下的联系人列表
    customerContactFun(val) {
      getCustomerInfo({ bid: val }).then(res => {
        let payterms = res.data.customerPaymentTerms.customerOrderPayNodeList;
        let payArr = payterms && payterms.length ? payterms : res.data.customerPaymentTerms.sysOrderPayNodeList;
        this.modalList = res.data.customerContactList || [];
        this.controlTowerList = payArr;
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
        this.productSkuList = res.data.list.map(e => {
          e.mininum = e.mininum || 0;
          e.unitPrice = e.unitPrice || 0;
          return { ...e }
        });
        this.searchObj.total = res.data.total;
        this.listLoading1 = false;
      }).catch(() => {
        this.listLoading1 = false;
      })
    },
    getDetail() {
      if (this.$route.query.id && !this.$route.query.inquiryId) {
        detailQuotedPrice({ quotedPriceBId: this.$route.query.id }).then(res => {
          this.editForm = Object.assign(this.editForm, res.data);
          this.editForm.paymentTerms = Number(this.editForm.paymentTerms)
          this.editForm.deliveryDate = Number(this.editForm.deliveryDate);
          if (this.$route.query.flag) {
            this.editForm.lastQuotedBId = this.editForm.bid;
            this.editForm.bid = ''
          }
          this.controlTowerList = res.data.quotedOrderPayNodeList || [];
          this.dataList = res.data.quotedPriceDetailList.map(e => {
            e.mininum = e.productPriceGradient ? (e.productPriceGradient.mininum || 0) : 0;
            e.unitPrice = e.productPriceGradient ? (e.productPriceGradient.unitPrice || 0) : 0;
            e.mininumMoney = Number(e.mininum * e.unitPrice * 100) / 100;
            e.quoteMoney = Number(e.quoteNumber * e.quotePrice * 100) / 100;
            e.imagePath = e.productImge;
            if (this.$route.query.flag) {
              e.lastQuoteNumber = e.quoteNumber;
              e.lastQuotePrice = e.quotePrice;
              e.lastQuotedRemarks = e.quoteRemark;
              e.lastInquiryRemark = e.inquiryRemark;
            }
            return { ...e }
          });
        }).catch(err => {
          this.$message(err.message);
        });
      } else if (!this.$route.query.id && this.$route.query.inquiryId) {
        detailInquiryPrice({ inquiryPriceBId: this.$route.query.inquiryId }).then(res => {
          this.editForm = Object.assign(this.editForm, res.data);
          this.editForm.contactBy = res.data.userBId;
          this.editForm.contactAddress = res.data.contactAddress;
          this.editForm.mobilePhone = res.data.mobilePhone;
          this.editForm.emailAddress = res.data.emailAddress;
          this.editForm.deliveryDate = Number(this.editForm.deliveryDate);
          this.controlTowerList = res.data.inquiryOrderPayNodeList || [];
          if (!this.controlTowerList.length) {
            this.customerContactFun(this.editForm.costomerBId);
          }
          this.dataList = res.data.inquiryPriceDetails.map(e => {
            e.mininumMoney = (e.orderNumber * e.defaultPrice * 100) / 100;
            e.quoteNumber = e.orderNumber;
            e.quotePrice = 0;
            e.quoteMoney = 0;
            return { ...e }
          });
        }).catch(err => {
          this.$message(err.message);
        });
      }
    },
    openDialog() {
      this.selectList = [];
      this.dialogVisible = true;
      this.getQuotedProductSku()
    },
    deleteSku(scope) {
      this.dataList.splice(scope.$index, 1)
    },
    deleteAllSku() {
      this.dataList = []
    },
    addQuotedSku() {
      if (!this.selectList.length) {
        return this.$message.warning('请先选择商品')
      }
      let skuBIdArr = this.dataList.map(e => e.skuBId);
      let arr = this.selectList.map(e => {
        return {
          attrValueList: e.attrValueList,
          catalogBName: e.catalogBName,
          skuBId: e.skuBId,
          skuCode: e.skuCode,
          productCode: e.productCode,
          productName: e.productName,
          productBId: e.bid,
          unitPrice: e.unitPrice,
          mininum: e.mininum,
          productImge: e.imagePath,
          customsCode: e.customsCode,
          singleBulk: e.singleBulk,
          singlePackage: e.singlePackage,
          singleWeight: e.singleWeight,
          mininumMoney: e.mininum * e.unitPrice,
          inquiryRemark: '',
          orderNumber: 0
        }
      }).filter(t => {
        return !skuBIdArr.includes(t.skuBId)
      });
      this.dataList = this.dataList.concat(arr);
      this.dialogVisible = false
    },
    confirmAdd(formName) {
      if (!this.editForm.costomerBId || !this.editForm.userBId) {
        return this.$message.warning('请选择客户和联系人')
      }
      if (!this.dataList.length) {
        return this.$message.warning('请选择调价商品')
      }
      if (this.totalSum !== 100) {
        return this.$message.warning('付款比例总数只能为100')
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.editForm.inquiryPriceDetails = this.dataList;
          this.saveLoading = true;
          this.editForm.quotedOrderPayNodeList = this.controlTowerList;
          addInquiry(this.editForm).then(res => {
            this.saveLoading = false;
            this.$message.success('提交成功');
            this.closePage()
          }).catch(err => {
            this.saveLoading = false;
            this.$message.error(err.message)
          })
        } else {
          this.$message.warning('请填写完整')
        }
      })
    }
  }
}
</script>

<style lang="scss">
  @import '~@/styles/variables.scss';
  .addInquiry {
    width: 80%;
    margin: 0 auto;
    border: 1px solid $border-light-color;
    .edit-title {
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
