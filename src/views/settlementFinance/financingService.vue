<template>
  <div class="app-container financingServer">
    <div class="search-box">
      <el-form label-width="160px" inline size="small">
        <el-form-item :label="$t('finance.financeProduct.name')">
          <el-input v-model="postData.financingProductName" clearable placeholder="financing product name" style="width: 200px"/>
        </el-form-item>
        <el-form-item :label="$t('finance.financeChannel.name')">
          <el-input v-model="postData.financingProductCode" clearable placeholder="financing channel name" style="width: 200px"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchData">{{$t('common.search')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="openDialog('add')">{{$t('common.add')}}</el-button>
      <el-button type="primary" size="small" @click="deleteClick()">{{$t('common.delete')}}</el-button>
      <!--<el-button type="primary" size="small" class="export">{{$t('common.export')}}</el-button>-->
    </div>
    <el-table
      v-loading="listLoading"
      :data="dataList"
      element-loading-text="loading。。。"
      border
      fit
      size="mini"
      :header-cell-style="{background: '#a7bfee'}" @selection-change="getSelect">
      <el-table-column
        align="center"
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column :label="$t('finance.financeService.No')" prop="finacingServiceNo" show-overflow-tooltip/>

      <el-table-column align="center" :label="$t('finance.financeService.amount')" prop="loanAmount" width="120"/>

      <el-table-column :label="$t('finance.financeService.product')" prop="financingProductName" show-overflow-tooltip/>

      <el-table-column :label="$t('finance.financeService.channel')" prop="instituteName" show-overflow-tooltip/>

      <el-table-column align="center" width="150" :label="$t('finance.financeService.applier')" prop="createUserId"/>

      <el-table-column align="center" width="160" :label="$t('finance.financeService.appliedTime')">
        <template slot-scope="scope">
          {{scope.row.createTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('common.table.actions')" width="260px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" class="export" @click="openDetail(row)">{{$t('common.table.view')}}</el-button>
          <el-button type="primary" size="mini" v-if="row.approveStatus === 0 || row.approveStatus === 3" @click="openDialog('edit', row)">
            {{$t('common.table.edit')}}
          </el-button>
          <el-button type="primary" size="mini" v-if="row.approveStatus === 2" @click="openDetail('edit', row)">
            {{$t('finance.financeService.accept')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList"></Pagination>

    <el-dialog :visible.sync="addModel" :title="dialogType === 'add' ? $t('finance.financeService.add') : $t('finance.financeService.edit')"
               width="1100px" center @close="clearData('addForm')">
      <el-tabs v-model="activeName">
        <el-tab-pane :label="$t('finance.financeProduct.basic')" name="1">
          <el-form ref="addForm" :model="addForm" label-width="175px" label-position="right" size="small" style="margin-top: 15px" :rules="addFormRules">
            <el-form-item :label="$t('finance.financeService.productForm')" prop="financingProductBid">
              <el-select v-model="addForm.financingProductBid" filterable clearable
                         placeholder="financing product"
                         class="form-dialog-width"
                         @change="getProductInfo">
                <el-option v-for="(item, index) in productList" :label="item.financingProductName" :value="item.bid" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('finance.financeService.order')" prop="orderArr">
              <el-select multiple v-model="addForm.orderArr" clearable placeholder="order No" style="width: 500px" @change="setOrderStr">
                <el-option v-for="(item, index) in orderList" :label="item.orderNo" :value="item.bid" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('finance.financeService.channelForm')" prop="instituteBid">
              <el-select v-model="addForm.instituteBid" filterable clearable
                         placeholder="Financing Institute"
                         class="form-dialog-width"
                         @change="getChannelInfo">
                <el-option v-for="(item, index) in channelList" :label="item.instituteName" :value="item.bid" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <div style="margin: 20px;border-top: 1px solid #eee"></div>
            <el-row>
              <el-col :span="8">
                <el-form-item :label="$t('finance.financeService.payment')" prop="totalAmount">
                  <el-input v-model.number="addForm.totalAmount" clearable placeholder="Amount to be paid"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('finance.financeService.amount')" prop="loanAmount">
                  <el-input v-model.number="addForm.loanAmount" clearable placeholder="Loan amount"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('finance.financeService.paymentMethod')" prop="paymentMethods">
                  <el-select v-model="addForm.paymentMethods" placeholder="interest computing method">
                    <el-option v-for="(item, index) in payMethodList" :label="language === 'zh' ? item.methodZh : item.method" :value="item.id" :key="index"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col style="padding: 0">
                <el-col :span="8">
                  <el-form-item :label="$t('finance.financeService.currency')" prop="paymentCurrency">
                    <el-select filterable
                               v-model="addForm.paymentCurrency"
                               remote
                               :remote-method="selectCurrencyCodeListFun"
                               :loading="loading1"
                               clearable
                               :placeholder="$t('system.business.searchCurrencyCode')">
                      <el-option v-for="(item, index) in currencyCodeList" :label="item.currencyCode" :value="item.currencyCode" :key="index"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('finance.financeService.rate')" prop="interestRate">
                    <el-input v-model.number="addForm.interestRate" clearable placeholder="interest rate"/>
                  </el-form-item>
                </el-col>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('common.table.status')">
                  {{addForm.approveStatus | statusFilter(language === 'zh')}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('finance.financeService.start')" prop="startDate">
                  <el-date-picker
                    v-model="addForm.startDate"
                    type="date"
                    style="width: 100%"
                    placeholder="Start date">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('finance.financeService.end')" prop="endDate">
                  <el-date-picker
                    v-model="addForm.endDate"
                    type="date"
                    style="width: 100%"
                    placeholder="end date">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>

            <div style="margin-top: 10px">
              {{$t('finance.financeService.file')}}
              <el-button type="primary" size="small" style="margin: 0 20px" @click="addFileRow">{{$t('finance.financeService.addFile')}}</el-button>
            </div>
            <el-table
              :data="fileList"
              border
              fit
              style="margin: 10px 0 20px"
              size="mini"
              :header-cell-style="{background: '#a7bfee'}">
              <el-table-column
                align="center"
                type="index"
                :label="$t('common.table.id')"
                width="55">
              </el-table-column>

              <el-table-column align="center" :label="$t('finance.financeService.fileType')" prop="documentName">
                <template slot-scope="{row}">
                  {{row.documentName || 'null'}}
                </template>
              </el-table-column>

              <el-table-column align="center" :label="$t('common.table.actions')" width="200" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <my-upload
                    style="display: inline-block"
                    :accept="scope.row"
                    :show-file="false"
                    :on-success="handleSuccess">
                  </my-upload>
                  <el-button type="danger" size="mini" @click="deleteFileRow(scope.$index)">{{$t('common.table.delete')}}</el-button>
                </template>
              </el-table-column>
            </el-table>

            <!--<el-form-item :label="$t('common.remark')">-->
              <!--<el-input v-model="addForm.remark" type="textarea" :autosize="{ minRows: 4, maxRows: 6}" clearable placeholder="remark"/>-->
            <!--</el-form-item>-->

            <div style="text-align: center;margin: 30px 0">
              <el-button type="primary" size="small" :loading="addLoading" @click="submitClick('addForm', !addForm.bid ? 1 : 2, 0)">
                {{$t('common.buttonText.save')}}
              </el-button>
              <el-button type="primary" size="small" :loading="addLoading" @click="submitClick('addForm', !addForm.bid ? 1 : 2, 1)">
                {{$t('common.buttonText.submit')}}
              </el-button>
              <el-button type="danger" size="small" @click="addModel = false">{{$t('common.buttonText.close')}}</el-button>
            </div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane :label="$t('finance.financeService.repayment')" name="2" v-if="addForm.bid">
          <div style="text-align: right;padding-right: 30px">
            <el-button type="primary" size="mini" @click="addRecordRow">{{$t('common.add')}}</el-button>
          </div>
          <el-table
            :data="recordList"
            border
            fit
            style="margin: 10px 0"
            size="mini"
            :header-cell-style="{background: '#a7bfee'}">
            <el-table-column
              align="center"
              type="index"
              width="55">
            </el-table-column>

            <el-table-column align="center" :label="$t('finance.financeService.paymentDate')">
              <template slot-scope="scope">
                <el-date-picker
                  v-model="scope.row.paymentDate"
                  type="date"
                  style="width: 100%"
                  placeholder="select date">
                </el-date-picker>
              </template>
            </el-table-column>

            <el-table-column align="center" :label="$t('finance.financeService.principal')">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.principalAmount" clearable/>
              </template>
            </el-table-column>

            <el-table-column align="center" :label="$t('finance.financeService.interest')">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.intrest" clearable/>
              </template>
            </el-table-column>

            <el-table-column align="center" :label="$t('finance.financeService.penalty')">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.penaltyIntrest" clearable/>
              </template>
            </el-table-column>

            <el-table-column align="center" :label="$t('finance.financeService.balance')">
              <template slot-scope="scope">
                <el-input v-model.number="scope.row.balanceAmount" clearable/>
              </template>
            </el-table-column>

            <el-table-column align="center" :label="$t('finance.financeService.currency')" prop="paymentCurrency"/>

            <el-table-column align="center" :label="$t('common.table.actions')" width="70" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="savePaymentRecord(scope)">
                  {{$t('common.buttonText.save')}}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="text-align: center;margin: 30px 0">
            <el-button type="danger" size="small" @click="addModel = false">{{$t('common.buttonText.close')}}</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!--详情-->
    <el-dialog :visible.sync="detailModal" :title="$t('finance.financeService.detail')" width="1100px" center @close="clearData">
      <el-tabs v-model="activeName">
        <el-tab-pane :label="$t('finance.financeProduct.basic')" name="1">
          <el-form ref="addForm" :model="detailData" label-width="175px" label-position="right" size="small" style="margin-top: 15px" :rules="addFormRules">
            <el-form-item :label="$t('finance.financeService.productForm')" prop="financingProductBid">
              <el-select v-model="detailData.financingProductBid" filterable disabled
                         placeholder="financing product"
                         class="form-dialog-width">
                <el-option v-for="(item, index) in productList" :label="item.financingProductName" :value="item.bid" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('finance.financeService.order')" prop="orderArr">
              <el-select multiple v-model="detailData.orderArr" disabled placeholder="order No" style="width: 500px">
                <el-option v-for="(item, index) in orderList" :label="item.orderNo" :value="item.bid" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('finance.financeService.channelForm')" prop="instituteBid">
              <el-select v-model="detailData.instituteBid" filterable disabled
                         placeholder="Financing Institute"
                         class="form-dialog-width">
                <el-option v-for="(item, index) in channelList" :label="item.instituteName" :value="item.bid" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <div style="margin: 20px;border-top: 1px solid #eee"></div>
            <el-row>
              <el-col :span="8">
                <el-form-item :label="$t('finance.financeService.payment')" prop="totalAmount">
                  <el-input v-model.number="detailData.totalAmount" disabled placeholder="Amount to be paid"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('finance.financeService.amount')" prop="loanAmount">
                  <el-input v-model.number="detailData.loanAmount" disabled placeholder="Loan amount"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('finance.financeService.paymentMethod')" prop="paymentMethods">
                  <el-select v-model="detailData.paymentMethods" disabled placeholder="interest computing method">
                    <el-option v-for="(item, index) in payMethodList" :label="language === 'zh' ? item.methodZh : item.method" :value="item.id" :key="index"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col style="padding: 0">
                <el-col :span="8">
                  <el-form-item :label="$t('finance.financeService.currency')" prop="paymentCurrency">
                    <el-select filterable
                               v-model="detailData.paymentCurrency"
                               remote
                               :remote-method="selectCurrencyCodeListFun"
                               :loading="loading1"
                               disabled
                               :placeholder="$t('system.business.searchCurrencyCode')">
                      <el-option v-for="(item, index) in currencyCodeList" :label="item.currencyCode" :value="item.currencyCode" :key="index"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('finance.financeService.rate')" prop="interestRate">
                    <el-input v-model.number="detailData.interestRate" disabled placeholder="interest rate"/>
                  </el-form-item>
                </el-col>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('common.table.status')">
                  {{detailData.approveStatus | statusFilter(language === 'zh')}}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('finance.financeService.start')" prop="startDate">
                  <el-date-picker
                    v-model="detailData.startDate"
                    type="date"
                    disabled
                    style="width: 100%"
                    placeholder="Start date">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('finance.financeService.end')" prop="endDate">
                  <el-date-picker
                    v-model="detailData.endDate"
                    type="date"
                    disabled
                    style="width: 100%"
                    placeholder="end date">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>

            <div style="margin-top: 10px">
              {{$t('finance.financeService.file')}}
            </div>
            <el-table
              :data="fileList"
              border
              fit
              style="margin: 10px 0 20px"
              size="mini"
              :header-cell-style="{background: '#a7bfee'}">
              <el-table-column
                align="center"
                type="index"
                :label="$t('common.table.id')"
                width="55">
              </el-table-column>

              <el-table-column align="center" :label="$t('finance.financeService.fileType')" prop="documentName">
                <template slot-scope="{row}">
                  {{row.documentName || 'null'}}
                </template>
              </el-table-column>

              <el-table-column align="center" :label="$t('common.table.actions')" width="200" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <el-button type="danger" size="mini" class="export" @click="downLoadFile(scope.row.documentPath)">
                    {{$t('common.table.download')}}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <div style="text-align: center;margin: 30px 0">
              <el-button type="danger" size="small" @click="detailModal = false">{{$t('common.buttonText.close')}}</el-button>
            </div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane :label="$t('finance.financeProduct.channelList')" name="2">
          <el-table
            :data="recordList"
            border
            fit
            style="margin: 10px 0"
            size="mini"
            :header-cell-style="{background: '#a7bfee'}">
            <el-table-column
              align="center"
              type="index"
              width="55">
            </el-table-column>

            <el-table-column align="center" :label="$t('finance.financeService.paymentDate')">
              <template slot-scope="scope">
                <el-date-picker
                  v-model="scope.row.paymentDate"
                  type="date"
                  disabled
                  style="width: 100%"
                  placeholder="select date">
                </el-date-picker>
              </template>
            </el-table-column>

            <el-table-column align="center" :label="$t('finance.financeService.principal')">
              <template slot-scope="scope">
                {{scope.row.principalAmount}}
              </template>
            </el-table-column>

            <el-table-column align="center" :label="$t('finance.financeService.interest')">
              <template slot-scope="scope">
                {{scope.row.intrest}}
              </template>
            </el-table-column>

            <el-table-column align="center" :label="$t('finance.financeService.penalty')">
              <template slot-scope="scope">
                {{scope.row.penaltyIntrest}}
              </template>
            </el-table-column>

            <el-table-column align="center" :label="$t('finance.financeService.balance')">
              <template slot-scope="scope">
                {{scope.row.balanceAmount}}
              </template>
            </el-table-column>

            <el-table-column align="center" :label="$t('finance.financeService.currency')" prop="paymentCurrency"/>
          </el-table>
          <div style="text-align: center;margin: 30px 0">
            <el-button type="danger" size="small" @click="detailModal = false">{{$t('common.buttonText.close')}}</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import MyUpload from '@/components/MyUpload'
import {
  financeProduct,
  financeChannel,
  financeService,
  addFinanceService,
  updateFinanceService,
  delBatchFinanceService,
  financeServicePaymentRecord,
  saveServiceRecord,
  updateServiceRecord
} from '@/api/finance'
import { selectCurrencyCodeListApi } from '@/api/system'
import { parseTime } from '@/utils/index'

export default {
  components: {
    Pagination,
    MyUpload
  },
  data() {
    return {
      dataList: [],
      listLoading: true,
      addLoading: false,
      loading1: false,
      channelLoading: false,
      addModel: false,
      detailModal: false,
      addChannelModal: false,
      activeName: '1',
      dialogType: '',
      newRoleName: '',
      detailData: {},
      addForm: {
        approveStatus: 0,
        serviceStatus: 0,
        loanAmount: 0,
        interestRate: 0,
        orderArr: [],
        finacingAssociatedOrders: '',
        financingProductBid: '',
        financingProductName: '',
        paymentCurrency: '',
        paymentMethods: 1,
        totalAmount: 0,
        instituteBid: '',
        instituteName: '',
        startDate: '',
        endDate: ''
      },
      addFormRules: {
        financingProductBid: [
          { required: true, message: 'Please choose financing product', trigger: 'change' }
        ],
        instituteBid: [
          { required: true, message: 'Please choose financing channel', trigger: 'change' }
        ],
        paymentCurrency: [
          { required: true, message: 'Please choose currency', trigger: 'change' }
        ],
        paymentMethods: [
          { required: true, message: 'Please choose the payment method', trigger: 'change' }
        ],
        startDate: [
          { required: true, message: 'Please select then start date', trigger: 'change' }
        ],
        endDate: [
          { required: true, message: 'Please select then end date', trigger: 'change' }
        ],
        orderArr: [
          { type: 'array', required: true, message: 'Please choose order No', trigger: 'change' }
        ],
        loanAmount: [
          { type: 'number', required: true, message: 'Please fill in load amount', trigger: 'blur' }
        ],
        totalAmount: [
          { type: 'number', required: true, message: 'Please choose financing channel', trigger: 'blur' }
        ],
        interestRate: [
          { type: 'number', required: true, message: 'Please fill in interest rate', trigger: 'blur' }
        ]
      },
      channelList: [],
      productList: [],
      recordList: [],
      fileList: [
        {
          attachmentUuid: '',
          documentName: '',
          documentPath: '',
          financingServiceBId: ''
        }
      ],
      orderList: [
        {
          orderNo: 'SA00001',
          bid: 1
        },
        {
          orderNo: 'SA00002',
          bid: 2
        },
        {
          orderNo: 'SA00003',
          bid: 3
        }
      ],
      payMethodList: [
        {
          id: 1,
          methodZh: '按年计算',
          method: 'annualized'
        },
        {
          id: 2,
          methodZh: '按月计算',
          method: 'by the month'
        },
        {
          id: 3,
          methodZh: '按日计算',
          method: 'by the day'
        }
      ],
      currencyCodeList: [],
      selectList: [],
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        financingProductCode: '',
        financingProductName: '',
        status: ''
      },
      statusList: [
        {
          labelZh: '使用中',
          label: 'Active',
          id: 1
        },
        {
          labelZh: '已禁用',
          label: 'Disabled',
          id: 0
        }
      ]
    }
  },
  created() {
    this.getDataList();
    this.getChannelList();
    this.getProductList();
    this.selectCurrencyCodeListFun();
  },
  methods: {
    clearData() {
      this.$refs['addForm'].resetFields();
      this.fileList = [{
        attachmentUuid: '',
        documentName: '',
        documentPath: '',
        financingServiceBId: ''
      }];
      this.addForm.bid = '';
      this.addForm.id = '';
    },
    selectCurrencyCodeListFun(val) {
      const _this = this;
      if (val !== '') {
        this.loading1 = true;
        selectCurrencyCodeListApi(val).then(res => {
          _this.currencyCodeList = res.data;
          _this.loading1 = false;
        });
      } else {
        this.currencyCodeList = [];
      }
    },
    downLoadFile(url) {
      window.open(url)
    },
    searchData() {
      this.postData.pageNum = 1;
      this.getDataList()
    },
    getDataList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      financeService(obj).then(res => {
        this.dataList = res.data.list || [];
        this.postData.total = res.data.total;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message)
      });
    },
    openDialog(type, row) {
      this.activeName = '1';
      this.dialogType = type;
      if (type === 'edit') {
        this.addForm = Object.assign(this.addForm, row);
        if (this.addForm.finacingAssociatedOrders) {
          this.addForm.orderArr = this.addForm.finacingAssociatedOrders.split(',').map(e => Number(e))
        } else {
          this.addForm.orderArr = []
        }
        this.fileList = this.addForm.financingServiceApplyDocList
        this.getRecordList(row.bid);
      }
      this.addModel = true;
    },
    openDetail(row) {
      this.activeName = '1';
      this.detailData = Object.assign(this.detailData, row);
      if (this.detailData.finacingAssociatedOrders) {
        this.detailData.orderArr = this.detailData.finacingAssociatedOrders.split(',').map(e => Number(e))
      } else {
        this.detailData.orderArr = []
      }
      this.fileList = this.detailData.financingServiceApplyDocList
      this.getRecordList(row.bid);
      this.detailModal = true;
    },
    addRecordRow() {
      this.recordList.push({
        balanceAmount: 0,
        financingServiceBId: this.addForm.bid,
        intrest: 0,
        paymentCurrency: this.addForm.paymentCurrency,
        paymentDate: '',
        penaltyIntrest: 0,
        principalAmount: 0
      })
    },
    savePaymentRecord(scope) {
      let api = !scope.row.id ? saveServiceRecord : updateServiceRecord;
      api(scope.row).then(res => {
        this.$message.success('Save Success');
        this.getRecordList()
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    getRecordList(id) {
      financeServicePaymentRecord({ bid: id }).then(res => {
        this.recordList = res.data || [];
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    getProductList() {
      financeProduct({ pageNum: 1, pageSize: 999 }).then(res => {
        this.productList = res.data.list || [];
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    getChannelList() {
      financeChannel({ pageNum: 1, pageSize: 999 }).then(res => {
        this.channelList = res.data.list || [];
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    getProductInfo(val) {
      let obj = this.productList.filter(e => e.bid === val)[0];
      this.addForm.financingProductName = obj.financingProductName
    },
    getChannelInfo(val) {
      let obj = this.channelList.filter(e => e.bid === val)[0];
      this.addForm.instituteName = obj.instituteName
    },
    setOrderStr(arr) {
      if (arr.length) {
        this.addForm.finacingAssociatedOrders = arr.join(',')
      } else {
        this.addForm.finacingAssociatedOrders = ''
      }
    },
    addFileRow() {
      this.fileList.push({
        attachmentUuid: '',
        documentName: '',
        documentPath: '',
        financingServiceBId: ''
      })
    },
    deleteFileRow(index) {
      this.fileList.splice(index, 1)
    },
    submitClick(formName, type, status) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let api = type === 1 ? addFinanceService : updateFinanceService;
          this.addLoading = true;
          this.addForm.financingServiceApplyDocList = this.fileList.filter(e => e.documentPath);
          this.addForm.approveStatus = status;
          api(this.addForm).then(res => {
            this.$message.success(type === 1 ? 'Add Success' : 'Update Success');
            this.addForm.bid = type === 1 ? res.data : this.addForm.bid;
            this.postData.pageNum = 1;
            this.addLoading = false;
            this.getDataList();
          }).catch(err => {
            this.addLoading = false;
            this.$message.error(err.message)
          });
        }
      })
    },
    deleteClick() {
      if (!this.selectList.length) {
        return this.$message.warning('请选择需要删除的数据');
      }
      this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        let obj = { ids: this.selectList.map(e => e.id).join(',') };
        delBatchFinanceService(obj).then(res => {
          this.getDataList();
          this.$message.success('Delete Success');
        }).catch(err => {
          this.$message.error(err.message)
        });
      }).catch(() => {
      });
    },
    // 勾选触发 selects为选择的数据数组
    getSelect(selects) {
      this.selectList = selects
    },
    handleSuccess(res, file, fileList, row) {
      row.attachmentUuid = res.data.Uuid;
      row.documentPath = res.data.filePath;
      row.documentName = file.name;
      row.financingServiceBId = this.addForm.bid
    }
  },
  filters: {
    statusFilter(status, flag) {
      const statusMapZh = ['未提交', '待审核', '审核通过', '审核失败', '已完成'];
      const statusMap = ['Not submitted', 'Approval Pending', 'Approve', 'Approved fail', 'Completed'];
      return flag ? statusMapZh[status] : statusMap[status]
    },
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
    }
  }
}
</script>
