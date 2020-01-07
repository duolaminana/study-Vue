<template>
  <div class="app-container editQuoted">
    <div class="edit-title">报价单</div>
    <el-form ref="editForm" :model="editForm" label-width="120px" size="small" :rules="editRules" class="edit-form" v-loading="loading">
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
                <el-select v-model="editForm.buyerBId" size="mini" filterable clearable :disabled="buyType" placeholder="请选择公司名称" class="edit-form-width input-center">
                  <el-option v-for="(item, index) in customerInfoList" :label="item.companyName" :value="item.bid" :key="index"></el-option>
                </el-select>
              </td>
            </tr>
            <tr>
              <td>买方联系人</td>
              <td>
                <el-select v-model="editForm.buyerContact" size="mini" clearable :disabled="buyType" placeholder="请选择购买人" class="edit-form-width input-center">
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
                <el-select v-model="editForm.sysCompanyBId" size="mini" filterable clearable placeholder="请选择卖方企业名称" class="edit-form-width input-center">
                  <el-option v-for="(item, index) in sysCustomerInfoList" :label="item.companyName" :value="item.bid" :key="index"></el-option>
                </el-select>
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
        <!--<el-col :span="12">-->
          <!--<el-form-item label="购买公司" prop="buyerBId">-->
            <!--<el-select v-model="editForm.buyerBId" clearable placeholder="请选择公司名称" class="edit-form-width">-->
              <!--<el-option v-for="(item, index) in customerInfoList" :label="item.companyName" :value="item.bid" :key="index"></el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
        <!--<el-col :span="12">-->
          <!--<el-form-item label="购买人" prop="userBId2">-->
            <!--<el-select v-model="editForm.userBId2" clearable placeholder="请选择购买人" class="edit-form-width">-->
              <!--<el-option v-for="(item, index) in modalList" :label="item.contactName" :value="item.accountBId" :key="index"></el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
        <!--</el-col>-->
        <!--<el-col :span="12">-->
          <!--<el-form-item label="地址" prop="contactAddress">-->
            <!--<el-input v-model="editForm.contactAddress" clearable placeholder="请输入地址" class="edit-form-width" />-->
          <!--</el-form-item>-->
        <!--</el-col>-->
        <!--<el-col :span="12">-->
          <!--<el-form-item label="电话" prop="mobilePhone">-->
            <!--<el-input v-model="editForm.mobilePhone" clearable placeholder="请输入联系电话" class="edit-form-width" />-->
          <!--</el-form-item>-->
        <!--</el-col>-->
        <!--<el-col :span="12">-->
          <!--<el-form-item label="联系人" prop="contactBy">-->
            <!--<el-input v-model="editForm.contactBy" clearable placeholder="请输入联系人" class="edit-form-width" />-->
          <!--</el-form-item>-->
        <!--</el-col>-->
        <!--<el-col :span="12">-->
          <!--<el-form-item label="邮箱" prop="emailAddress">-->
            <!--<el-input v-model="editForm.emailAddress" clearable placeholder="请输入联系邮箱" class="edit-form-width" />-->
          <!--</el-form-item>-->
        <!--</el-col>-->
        <el-col :span="12">
          <el-form-item label="运输委托方" prop="transportation">
            <el-select v-model="editForm.transportation" clearable placeholder="请选择运输委托方" class="edit-form-width">
              <el-option label="委托卖方" :value="1"></el-option>
              <el-option label="自提" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="运输方式" prop="transportationWay">
            <el-select v-model="editForm.transportationWay" clearable placeholder="请选择运输方式" class="edit-form-width">
              <el-option label="汽运" :value="0"></el-option>
              <el-option label="铁路" :value="1"></el-option>
              <el-option label="海运" :value="2"></el-option>
              <el-option label="空运" :value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出发港口/地址" prop="departurePort">
            <el-input v-model="editForm.departurePort" clearable placeholder="请输入出发港口/地址" class="edit-form-width" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="目的港口/地址" prop="destinationPort">
            <el-input v-model="editForm.destinationPort" clearable placeholder="请输入目的港口/地址" class="edit-form-width" />
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
          <el-form-item label="交付期限" prop="dateOfDelivery">
            到款后<el-input v-model.number="editForm.dateOfDelivery" class="input-center" style="width: 100px"/>个工作日
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="付款方式" prop="paymentCondition">
            <el-select v-model="editForm.paymentCondition" clearable placeholder="请选择付款方式" class="edit-form-width">
              <el-option v-for="(item, index) in paymentMethodList" :label="item.label" :value="item.paymentCondition" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!--<el-col>-->
          <!--<el-form-item label="其他条款" prop="otherTerms">-->
            <!--<el-input v-model="editForm.otherTerms" clearable style="width: 80%" />-->
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
              <el-input v-model.number="item.paymentRatio" :min="0" :precision="0" clearable style="width: 120px" class="input-center" />&nbsp;%
            </td>
            <td>
              <el-input v-model.number="item.dayNum" :min="0" :precision="0" clearable style="width: 120px" class="input-center" />&nbsp;天
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

        <!--<el-table-column align="center" width="120" label="询价备注" prop="inquiryRemark" show-overflow-tooltip/>-->

        <!--<el-table-column align="center" width="100" label="询价量" prop="inquiryQuantity" show-overflow-tooltip/>-->

        <el-table-column align="center" width="120" label="报价量" prop="quotedQuantity" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-input v-model="scope.row.quotedQuantity" size="small" :min="0" class="input-center" @change="changeNumber(scope.row, scope.row.quotedQuantity)"/>
          </template>
        </el-table-column>

        <el-table-column align="center" width="120" label="先前报价" prop="lastQuotedPrice" show-overflow-tooltip/>

        <el-table-column align="center" width="120" label="报价单价" prop="quotedPrice">
          <template slot-scope="scope">
            <el-input v-model="scope.row.quotedPrice" size="small" :min="0" class="input-center" @change="changePrice(scope.row, scope.row.quotedPrice)"/>
          </template>
        </el-table-column>

        <el-table-column align="center" width="120" label="报价金额" prop="productAmount"/>

        <el-table-column align="center" label="报价备注" prop="quotedRemark">
          <template slot-scope="scope">
            <el-input v-model="scope.row.quotedRemark" :autosize="{ minRows: 4, maxRows: 6}" type="textarea" size="small" clearable style="font-size: 12px"/>
          </template>
        </el-table-column>

        <el-table-column align="center" width="70" label="操作">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="deleteSku(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--<Pagination :total="editForm.total" :page.sync="editForm.pageNum" :limit.sync="editForm.pageSize" @pagination="getDetail"></Pagination>-->
      <el-form-item/>
      <el-row>
        <el-col :span="12">
          <el-form-item label="运费">
            <el-input v-model.number="editForm.transportationCost" type="number" :min="0" size="small" clearable style="width: 180px" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="订单总额">
            {{quoteMoneyTotal}}
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="报价备注" prop="quotedRemarks">
            <el-input v-model="editForm.quotedRemarks" :autosize="{ minRows: 4, maxRows: 6}" type="textarea" size="small" clearable style="width: 80%"/>
          </el-form-item>
        </el-col>
<!--        <el-col>-->
<!--          <el-form-item label="是否审核" prop="ifAudit">-->
<!--            <el-radio-group v-model="editForm.isApproval">-->
<!--              <el-radio :label="1">是</el-radio>-->
<!--              <el-radio :label="0">否</el-radio>-->
<!--            </el-radio-group>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
<!--        <el-col>-->
<!--          <el-form-item label="选择审批流程" prop="approvalBId" v-if="editForm.isApproval">-->
<!--            <el-select v-model="editForm.approvalBId" clearable filterable placeholder="请选择" style="width: 300px">-->
<!--              <el-option v-for="(item,index) in approvalSelectList" :key="index" :label="item.approvalName" :value="item.bid">-->
<!--              </el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
      </el-row>
      <el-form-item style="text-align: center">
        <el-button type="primary" size="small" :loading="saveLoading" @click="confirmAdd('editForm', 1, editType)">保存</el-button>
        <el-button type="primary" size="small" :loading="saveLoading" @click="confirmAdd('editForm', 2, editType)">提交</el-button>
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
          <el-input v-model="searchObj.productCode" clearable placeholder="商品名称" style="width: 240px"/>
        </el-form-item>
        <el-form-item label="商品名称" prop="productName">
          <el-input v-model="searchObj.productName" clearable placeholder="商品名称" style="width: 240px"/>
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
import { selectCurrencyCodeListApi, approvalSelectList, getSupplyCompanyList } from '@/api/system'
import { listCustomerInfoContactApi, getCustomerInfo } from '@/api/customer'
import { parseTime } from '@/utils/index'
import { detailQuotedPrice, saveQuotedPrice, updateQuotedPrice, selectCustomByIdApi } from '@/api/inquiry'
// import { selectCustomByIdApi } from '@/api/query'
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
      buyType: false,
      countryList: [],
      currencyCodeList: [],
      customerInfoList: [],
      sysCustomerInfoList: [],
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
        buyerBId: '',
        buyerContact: '',
        buyerAddress: '',
        buyerTelephone: '',
        buyerEmail: '',
        buyerName: '',
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
        inquiryNo: '',
        otherTerms: ''
      },
      editRules: {
        // buyerBId: [
        //   { required: true, message: '请选择购买公司', trigger: 'change' }
        // ],
        // userBId2: [
        //   { required: true, message: '请选择购买人', trigger: 'change' }
        // ],
        // contactAddress: [
        //   { required: true, message: '请填写联系地址', trigger: 'blur' }
        // ],
        // mobilePhone: [
        //   { required: true, message: '请填写联系电话', trigger: 'blur' }
        // ],
        // contactBy: [
        //   { required: true, message: '请填写联系人', trigger: 'blur' }
        // ],
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
      inquiryStatusList: [
        {
          label: '待报价',
          inquiryStatus: 1
        },
        {
          label: '审批中',
          inquiryStatus: 2
        },
        {
          label: '已报价',
          inquiryStatus: 3
        },
        {
          label: '重新待报价',
          inquiryStatus: 4
        },
        {
          label: '重新待审批',
          inquiryStatus: 5
        },
        {
          label: '已重新报价',
          inquiryStatus: 6
        },
        {
          label: '废弃',
          inquiryStatus: 7
        },
        {
          label: '拒绝报价',
          inquiryStatus: 8
        }
      ],
      quoteTypeList: [
        // 报价类型（0-EXW,1-FOB）
        {
          label: 'EXW',
          quoteType: 0
        },
        {
          label: 'FOB',
          quoteType: 1
        }
      ],
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
      ],
      portList: [
        {
          portName: '港口1',
          bid: '1'
        },
        {
          portName: '港口2',
          bid: '2'
        },
        {
          portName: '港口3',
          bid: '3'
        },
        {
          portName: '港口4',
          bid: '4'
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
        val += Number(e.productAmount)
      });
      val += Number(this.editForm.transportationCost);
      return val
    }
  },
  watch: {
    'editForm.buyerBId' (val, oldVal) {
      if (val && !oldVal) {
        this.customerContactFun(val, false);
        if (!this.$route.query.id && !this.$route.query.customBId) {
          let obj = this.customerInfoList.filter(e => e.bid === val)[0];

          this.editForm.buyerShort = obj.shortName;
          this.editForm.buyerContact = '';
          this.editForm.buyerAddress = obj.officeAddress;
          this.editForm.buyerName = obj.companyName;
          this.editForm.buyerTelephone = obj.mobilePhone;
          this.editForm.buyerEmail = obj.emailAddress;
        } else if (this.$route.query.customBId) {
          let obj = this.customerInfoList.filter(e => e.bid === val)[0];
          this.editForm.buyerShort = obj.shortName;
          this.editForm.buyerCode = obj.customerCode;
          this.editForm.buyerCountryCode = obj.countryCode;
          this.editForm.buyerName = obj.companyName;
        }
      } else if (val && oldVal) {
        this.customerContactFun(val, true);
        let obj = this.customerInfoList.filter(e => e.bid === val)[0];
        this.editForm.buyerContact = '';
        this.editForm.buyerAddress = obj.officeAddress;
        this.editForm.buyerName = obj.companyName;
        this.editForm.buyerTelephone = obj.mobilePhone;
        this.editForm.buyerEmail = obj.emailAddress;
      } else {
        this.editForm.buyerContact = '';
        this.editForm.buyerAddress = '';
        this.editForm.buyerTelephone = '';
        this.editForm.buyerEmail = '';
        this.controlTowerList = [];
      }
    },
    'editForm.sysCompanyBId' (val) {
      if (val) {
        let obj = this.sysCustomerInfoList.filter(e => e.bid === val)[0];
        this.editForm.sellerBId = obj.bid;
        this.editForm.sellerShort = obj.companyShort;
        this.editForm.sellerCode = obj.companyCode;
        this.editForm.sellerCountryCode = obj.countryCode;
        this.editForm.sellerName = obj.companyName;
      } else {
        // this.editForm.sellerContact = '';
        // this.editForm.sellerAddress = '';
        // this.editForm.sellerTelephone = '';
        // this.editForm.sellerEmail = '';
        this.editForm.sellerName = '';
      }
    }
  },
  created() {
    if (this.$route.query.id) {
      this.editType = true;
    }
    // this.getCustomerInfoListFun();
    // this.getSysCustomerInfoListFun();
    this.getApprovalSelectList();
    // 获取类目列表
    this.getAllDataList();
    this.getCurrencyCodeList();
    // this.getDetail();
    this.promise()
  },
  methods: {
    closePage() {
      this.$store.dispatch('delView', this.activeRoute).then(() => {
        this.$router.push({
          path: '/query/quoted'
        })
      })
    },
    changePrice(item, val) {
      this.$nextTick(() => {
        item.productAmount = ((Number(item.quotedQuantity) * Number(item.quotedPrice) * 100) / 100).toFixed(4)
      })
    },
    async promise() {
      try {
        await this.getCustomerInfoListFun();
        await this.getSysCustomerInfoListFun();
        this.getDetail();
        this.loading = false
      } catch (e) {
        this.$message.error(e)
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
    getApprovalSelectList() {
      approvalSelectList().then(res => {
        this.approvalSelectList = res.data || [];
      })
    },
    getAllDataList() {
      getPublicCategory({ pageSize: 999, pageNum: 1 }).then(res => {
        this.searchDataList = res.data.list;
      })
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
    // 客户下的联系人列表
    customerContactFun(val, flag) {
      getCustomerInfo({ bid: val }).then(res => {
        if (res.data) {
          let payterms = res.data.customerPaymentTerms.customerOrderPayNodeList;
          this.modalList = res.data.customerContactList || [];
          if (!this.$route.query.id && !this.$route.query.customBId) {
            this.controlTowerList = payterms && payterms.length ? payterms : res.data.customerPaymentTerms.sysOrderPayNodeList;
          }
          if (this.modalList.length && flag) {
            this.editForm.buyerContact = this.modalList[0].accountBId
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
    getDetail() {
      if (this.$route.query.id) {
        detailQuotedPrice({ quotedPriceBId: this.$route.query.id }).then(res => {
          this.editForm = Object.assign(this.editForm, res.data);
          this.editForm.dateOfDelivery = this.editForm.dateOfDelivery;
          if (this.$route.query.flag) {
            this.editForm.lastQuotedBId = this.editForm.bid;
            this.editForm.bid = ''
          }
          if (res.data.customBId) {
            this.buyType = true;
          }
          this.editForm.buyerContact = res.data.inquirerBId;
          this.editForm.sysCompanyBId = res.data.sellerBId;
          this.controlTowerList = res.data.quotedOrderPayNodeList || [];
          this.dataList = res.data.quotedPriceDetailList.map(e => {
            e.mininum = e.productPriceGradient ? (e.productPriceGradient.mininum || 0) : 0;
            e.unitPrice = e.productPriceGradient ? (e.productPriceGradient.unitPrice || 0) : 0;
            e.mininumMoney = (e.mininum * 100) * (e.unitPrice * 100) / 100;
            e.productAmount = Number(e.quotedQuantity * 100) * Number(e.quotedPrice * 100) / 10000;
            if (this.$route.query.flag) {
              e.lastQuoteNumber = e.quotedQuantity;
              e.lastQuotePrice = e.quotedPrice;
              e.lastQuotedRemarks = e.quoteRemark;
            }
            return { ...e }
          });
        }).catch(err => {
          this.$message(err.message);
        });
      } else if (this.$route.query.customBId) {
        selectCustomByIdApi({ bId: this.$route.query.customBId }).then(res => {
          console.log('res.data')
          console.log(res.data)
          this.editForm.inqueryTailormadeNo = res.data.tailormadeFormNumber;
          this.editForm.inqueryTailormadeBId = res.data.bid;
          this.editForm.buyerBId = res.data.customerBasicInfoBId;
          this.editForm.buyerContact = res.data.customBy;
          this.editForm.buyerEmail = res.data.buyerMailbox;
          this.editForm.buyerTelephone = res.data.buyerTelephone;
          this.editForm.sellerContact = this.userInfo.userName;
          this.editForm.sellerAddress = this.userInfo.contactAddress;
          this.editForm.sellerTelephone = this.userInfo.mobilePhone;
          this.editForm.sellerEmail = this.userInfo.emailAddress;
          this.editForm.buyerAddress = res.data.buyerAddress;
          this.editForm.currency = res.data.currency;
          this.editForm.paymentCondition = Number(res.data.paymentMethods);
          this.editForm.remarks = res.data.customRemarks;
          this.editForm.departurePort = res.data.departurePort;
          this.editForm.destinationPort = res.data.destinationPort;
          this.editForm.customBId = res.data.inqueryTailormadeBId;
          this.editForm.inquiryNo = res.data.customNo;
          this.editForm.dateOfDelivery = res.data.dateOfDelivery;
          this.editForm.transportation = res.data.transportation;
          this.editForm.transportationWay = res.data.transportationWay;
          this.controlTowerList = res.data.customizeOrderPayNodeList || [];
          this.dataList = res.data.customizeProductList.map(e => {
            e.mininumMoney = (e.inquiryQuantity * e.defaultPrice * 100) / 100;
            e.quotedQuantity = e.productQuantity;
            e.quotedPrice = 0;
            e.productAmount = 0;
            return { ...e }
          })
          this.buyType = true;
        }).catch(err => {
          this.$message(err.message);
        });
      } else {
        this.editForm.sellerContact = this.userInfo.userName;
        this.editForm.sellerAddress = this.userInfo.contactAddress;
        this.editForm.sellerTelephone = this.userInfo.mobilePhone;
        this.editForm.sellerEmail = this.userInfo.emailAddress;
      }
    },
    changeNumber(item, val) {
      this.$nextTick(() => {
        item.productAmount = ((Number(item.quotedQuantity) * Number(item.quotedPrice) * 100) / 100).toFixed(4)
      })
    },
    // changePrice(item, val) {
    //   this.$nextTick(() => {
    //     item.productAmount = ((item.quotedQuantity * item.quotedPrice * 100) / 100).toFixed(2)
    //   })
    // },
    openDialog() {
      this.selectList = [];
      this.dialogVisible = true;
      this.getQuotedProductSku()
    },
    deleteSku(scope) {
      let delSku = this.dataList.splice(scope.$index, 1)[0];
      if (delSku.id) {
        this.delSkuList.push(delSku);
      }
    },
    deleteAllSku() {
      if (this.delSkuList.length) {
        this.delSkuList = this.dataList.filter(e => e.id)
      } else {
        let arr = this.dataList.filter(e => e.id);
        this.delSkuList = [... new Set(this.delSkuList.concat(arr))]
      }
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
          quotedQuantity: 0,
          quotedPrice: 0,
          productAmount: 0
        }
      }).filter(t => {
        return !skuBIdArr.includes(t.skuBId)
      });
      this.dataList = this.dataList.concat(arr);
      this.dialogVisible = false
    },
    confirmAdd(formName, status, type) {
      if (!this.editForm.buyerBId || !this.editForm.buyerContact) {
        return this.$message.warning('请选择购买人')
      }
      if (!this.editForm.sysCompanyBId) {
        return this.$message.warning('请选择卖方')
      }
      if (!this.dataList.length) {
        return this.$message.warning('请选择调价商品')
      }
      if (this.totalSum !== 100) {
        return this.$message.warning('付款比例总数只能为100')
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let api = (type && !this.$route.query.flag) ? updateQuotedPrice : saveQuotedPrice;
          this.editForm.quoteStatus = status;
          this.delSkuList.forEach(e => {
            e.delFlag = 1
          });
          this.editForm.quotedPriceDetailList = this.dataList.concat(this.delSkuList);
          this.editForm.quotedOrderPayNodeList = this.controlTowerList;
          // 报价来源(1-定制, 2-非定制(询价))
          this.editForm.quotedType = 1;
          this.editForm.inquirerBId = this.editForm.buyerContact;
          this.saveLoading = true;
          api(this.editForm).then(res => {
            this.$message.success(status === 2 ? '提交成功' : '保存成功');
            this.closePage();
            this.saveLoading = false;
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
  .editQuoted {
    width: 90%;
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
