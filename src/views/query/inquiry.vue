<template>
  <div class="app-container inquiry">
    <div class="search-box">
      <el-form label-width="120px" inline size="small">
        <div>
          <el-form-item :label="$t('inquiry.inquiryOrder.buyerName')">
            <el-input v-model="postData.buyerName" clearable :placeholder="$t('inquiry.inquiryOrder.buyerName')" style="width: 200px" />
          </el-form-item>
          <el-form-item :label="$t('inquiry.inquiryOrder.buyerCode')">
            <el-input v-model="postData.buyerCode" clearable :placeholder="$t('inquiry.inquiryOrder.buyerCode')" style="width: 200px" />
          </el-form-item>
          <el-form-item :label="$t('inquiry.inquiryOrder.inquiryStatus')">
            <el-select v-model="postData.inquiryStatus" clearable :placeholder="$t('inquiry.inquiryOrder.inquiryStatus')" style="width: 200px">
              <el-option v-for="(item, index) in inquiryStatusList" :label="item.label" :value="item.inquiryStatus" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item :label="$t('inquiry.inquiryOrder.inqueryNo')">
            <el-input v-model="postData.inqueryNo" clearable :placeholder="$t('inquiry.inquiryOrder.inqueryNo')" style="width: 200px" />
          </el-form-item>
          <el-form-item :label="$t('inquiry.inquiryOrder.buyerCountryCode')" prop="buyerCountryCode">
            <el-select filterable remote :remote-method="getCountryList" :loading="loading1" v-model="postData.buyerCountryCode" clearable :placeholder="$t('inquiry.inquiryOrder.countryCodeExplain')" style="width: 200px">
              <el-option v-for="(item, index) in countryList" :label="item.chEnName" :value="item.countryCode" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('inquiry.inquiryOrder.inquiryTime')">
            <el-date-picker
              v-model="inquiryTime"
              type="daterange"
              align="right"
              unlink-panels
              clearable
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 380px"
              :picker-options="pickerOptions"
              @change="getSearchTime">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="export" @click="searchData">{{$t('common.search')}}</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="topBtns">
      <!--替用户新增报价单，之后删除-->
      <!--<el-button type="primary" size="small" @click="addInquiry">新增</el-button>-->
      <!--<el-button type="primary" size="small" @click="deleteListByIds()">删除</el-button>-->
      <el-button type="primary" size="small" class="export" @click="exportExcelByEasypoiFun()">{{$t('system.role.export')}}</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="dataList"
      :element-loading-text="$t('system.userManage.lodding')"
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

      <el-table-column :label="$t('inquiry.inquiryOrder.inqueryNo')" prop="inqueryNo" show-overflow-tooltip />

      <el-table-column :label="$t('inquiry.inquiryOrder.buyerAddress')" prop="buyerAddress" show-overflow-tooltip />

      <el-table-column :label="$t('inquiry.inquiryOrder.countryPhone')" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.customerInfoVo.cnCountryName }}/{{scope.row.buyerTelephone }}
        </template>
      </el-table-column>

      <el-table-column align="center" width="100" :label="$t('inquiry.inquiryOrder.skuQuantity')" prop="skuQuantity"/>

      <el-table-column align="center" width="150" :label="$t('inquiry.inquiryOrder.inquiryUserName')" prop="inquiryUserName" show-overflow-tooltip/>

      <el-table-column align="center" width="150" :label="$t('inquiry.inquiryOrder.inquiryTime')" prop="inquiryTime">
        <template slot-scope="scope">
          {{scope.row.inquiryTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="130" :label="$t('inquiry.inquiryOrder.inquiryStatus')" prop="inquiryStatus">
        <template slot-scope="{row}">
          <el-tag :type="(row.inquiryStatus === 1) ? 'danger' : 'primary'" size="mini">{{row.inquiryStatus | inquiryStatusFmt}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column header-align="center" :label="$t('common.table.actions')" width="190" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" class="export table-btn-width" @click="detailDialog(row)">{{$t('common.table.view')}}</el-button>
          <span v-if="row.inquiryStatus !== 0 && row.inquiryStatus !== 1 && row.inquiryStatus !== 4 && row.inquiryStatus !== 13 && row.inquiryStatus !== 14">
            <el-button type="primary" v-if="row.quotedPriceList.length === 1" size="mini" style="margin-left: 10px" class="export table-btn-width" @click="detailQuoted(row.quotedPriceList[0].bid)">{{$t('query.tableLabel.CheckTheQuotation')}}</el-button>
            <el-dropdown size="mini" v-else type="primary" @command="detailQuoted">
              <el-button type="primary" size="mini" class="export" style="margin-left: 10px">{{$t('query.tableLabel.CheckTheQuotation')}}<i class="el-icon-arrow-down el-icon--right"></i></el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="(item,index) in row.quotedPriceList" :command="item.bid" :key="index">{{$t('query.tableLabel.quotationNumber')}}：{{item.quotedNo}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
          <el-button type="warning" size="mini" class="table-btn-width" v-if="row.inquiryStatus === 1 || row.inquiryStatus === 4" @click="openQuoted(row)">报价</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList" ></Pagination>

    <el-dialog :visible.sync="detailModal" :title="$t('inquiry.inquiryOrder.inquiryDetails')" center width="900px">
      <el-form ref="editForm" :model="editForm" label-width="155px" size="small" class="edit-form">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('inquiry.inquiryOrder.inqueryNo')">
              {{editForm.inqueryNo}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('inquiry.inquiryOrder.inquiryTime')">
              {{editForm.inquiryTime | timeFmt}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('inquiry.inquiryOrder.costomerBId')" prop="costomerBId">
              <el-select v-model="editForm.costomerBId" disabled style="width: 200px">
                <el-option v-for="(item, index) in customerInfoList" :label="item.companyName" :value="item.bid" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('inquiry.inquiryOrder.inquirerBId')" prop="inquirerBId">
              <el-select v-model="editForm.inquirerBId" disabled class="edit-form-width">
                <el-option v-for="(item, index) in modalList" :label="item.contactName" :value="item.accountBId" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('inquiry.inquiryOrder.buyerAddress2')" prop="buyerAddress">
              <el-input v-model="editForm.buyerAddress" readonly style="width: 200px" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('inquiry.inquiryOrder.buyerTelephone')" prop="buyerTelephone">
              <el-input v-model="editForm.buyerTelephone" readonly style="width: 200px" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('inquiry.inquiryOrder.buyerContactBy')" prop="buyerContactBy">
              <el-input v-model="editForm.buyerContactBy" readonly style="width: 200px" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('inquiry.inquiryOrder.buyerEmail')" prop="buyerEmail">
              <el-input v-model="editForm.buyerEmail" readonly style="width: 200px" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('inquiry.inquiryOrder.entrustTransportation')" prop="entrustTransportation">
              {{editForm.entrustTransportation === 1 ? '委托卖方' : '自提'}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('inquiry.inquiryOrder.transportationWay')" prop="transportationWay">
              {{editForm.transportationWay | transportTypeName}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('inquiry.inquiryOrder.departurePort')" prop="departurePort">
              <el-input v-model="editForm.departurePort" readonly style="width: 200px" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('inquiry.inquiryOrder.destinationPort')" prop="destinationPort">
              <el-input v-model="editForm.destinationPort" readonly style="width: 200px" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('inquiry.inquiryOrder.currency')" prop="currency">
              <el-select filterable remote :remote-method="getCurrencyCodeList" :loading="loading2" v-model="editForm.currency" disabled style="width: 200px">
                <el-option v-for="(item, index) in currencyCodeList" :label="item.searchCurrencyCodeStr" :value="item.searchCurrencyCodeStr" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('inquiry.inquiryOrder.dateOfDelivery')" prop="dateOfDelivery">
              <el-input v-model="editForm.dateOfDelivery" readonly class="input-center" style="width: 200px" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('inquiry.inquiryOrder.paymentCondition')" prop="paymentCondition">
              <el-select v-model="editForm.paymentCondition" disabled style="width: 200px">
                <el-option v-for="(item, index) in paymentMethodList" :label="item.label" :value="item.paymentCondition" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="$t('inquiry.inquiryOrder.paymentDefault')">
          <table border="0" cellspacing="0" cellpadding="0" class="tableSet">
            <thead>
            <tr>
              <th>{{$t('inquiry.inquiryOrder.indexCode')}}</th>
              <th>{{$t('inquiry.inquiryOrder.nodeName')}}</th>
              <th>{{$t('inquiry.inquiryOrder.paymentRatio')}}</th>
              <th>{{$t('inquiry.inquiryOrder.dayNum')}}</th>
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
                {{item.dayNum}}{{$t('inquiry.inquiryOrder.day')}}
              </td>
            </tr>
            <tr v-if="!controlTowerList.length">
              <td colspan="4" style="text-align: center;padding: 5px">暂无数据</td>
            </tr>
            </tbody>
          </table>
        </el-form-item>
        <div class="table-top">
          <div class="top-title">{{$t('inquiry.inquiryOrder.inquiryPriceDetails')}}</div>
        </div>
        <el-table
          :data="editForm.inquiryPriceDetails"
          border
          fit
          show-summary
          size="small"
          min-height="520"
          style="font-size: 12px"
          :header-cell-style="{background: '#a7bfee'}">
          <el-table-column align="center" type="index" :label="$t('inquiry.inquiryOrder.indexCode')" width="55"/>

          <!--<el-table-column align="center" min-width="285px" :label="$t('inquiry.inquiryOrder.productInformation')" prop="inqueryNo" >-->
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
          <el-table-column align="center" :label="$t('inquiry.inquiryOrder.productName')" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.productName}}
            </template>
          </el-table-column>
          <el-table-column align="center" :label="$t('inquiry.inquiryOrder.attrValueList')" show-overflow-tooltip >
            <template slot-scope="scope">
              {{scope.row.attrValueList}}
            </template>
          </el-table-column>

          <el-table-column align="center" :label="$t('inquiry.inquiryOrder.inquiryQuantity')" prop="inquiryQuantity" />

          <el-table-column align="center" width="200px" :label="$t('inquiry.inquiryOrder.inquiryRemark')" prop="inquiryRemark" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.inquiryRemark}}
            </template>
          </el-table-column>
        </el-table>
        <el-form-item/>
        <el-row>
          <el-col>
            <el-form-item :label="$t('inquiry.inquiryOrder.remarks')" prop="remarks">
              <el-input v-model="editForm.remarks" :autosize="{ minRows: 4, maxRows: 6}" type="textarea" size="small" readonly style="width: 80%"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="detailModal=false">{{$t('common.buttonText.close')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { selectCountryListApi, selectCurrencyCodeListApi } from '@/api/system'
import { uploadActionUrl } from '@/api/common'
import { listCustomerInfoContactApi, listCustomerContact } from '@/api/customer'
import { detailInquiryPrice, pageInquiryPrice, deleteInquiryPriceByIds, exportExcelByEasypoiApi } from '@/api/inquiry'
import { parseTime } from '@/utils/index'
import { getToken } from '@/utils/auth'
export default {
  components: {
    Pagination
  },
  filters: {
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
    },
    inquiryStatusFmt(val) {
      switch (Number(val)) {
        case 0: return '编辑中';
        case 1: return '待报价';
        case 2: return '审批中';
        case 3: return '已报价';
        case 4: return '重新待报价';
        case 5: return '重新待审批';
        case 6: return '已重新报价';
        case 7: return '废弃';
        case 8: return '拒绝报价';
        case 9: return '审批通过';
        case 10: return '审批不通过';
        case 11: return '重新审批通过';
        case 12: return '重新审批不通过';
        case 13: return '报价中';
        case 14: return '重新报价中';
        default:
          return '数据异常';
      }
    },
    transportTypeName(val) {
      switch (Number(val)) {
        case 0: return '铁路';
        case 1: return '汽运';
        case 2: return '海运';
        case 3: return '空运';
      }
    }
  },
  data() {
    return {
      selectList: [],
      idsForm: {
        ids: ''
      },
      uploadActionUrl,
      dataList: [],
      loading1: false,
      loading2: false,
      countryList: [],
      currencyCodeList: [],
      filesList: [],
      controlTowerList: [],
      listLoading: true,
      dialogVisible: false,
      detailModal: false,
      dialogType: '',
      editForm: {},
      // exportExcelForm: {
      //   pageNum: 1,
      //   pageSize: 10
      // },
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        buyerName: '',
        buyerCode: '',
        buyerCountryCode: '',
        inquiryStatus: '',
        inquiryTime: '',
        startTime: '',
        endTime: '',
        inqueryNo: ''
      },
      inquiryTime: [],
      customerInfoList: [],
      modalList: [],
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
      inquiryStatusList: [
        {
          label: '编辑中',
          inquiryStatus: 0
        },
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
        },
        {
          label: '审批通过',
          inquiryStatus: 9
        },
        {
          label: '审批不通过',
          inquiryStatus: 10
        },
        {
          label: '重新审批通过',
          inquiryStatus: 11
        },
        {
          label: '重新审批不通过',
          inquiryStatus: 12
        },
        {
          label: '报价中',
          inquiryStatus: 13
        },
        {
          label: '重新报价中',
          inquiryStatus: 14
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
          paymentCondition: '1'
        },
        {
          label: 'L/C',
          paymentCondition: '2'
        },
        {
          label: 'P/A',
          paymentCondition: '3'
        },
        {
          label: 'D/A',
          paymentCondition: '4'
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
      ],
      upLoadHeaders: {
        token: getToken()
      }
    }
  },
  created() {
    this.getDataList();
    this.getCustomerInfoListFun()
  },
  watch: {
    'editForm.costomerBId' (val, oldVal) {
      if (val && !oldVal) {
        this.customerContactFun(val);
      } else if (val && oldVal) {
        this.customerContactFun(val);
        this.editForm.inquirerBId = ''
      }
    }
  },
  methods: {
    addInquiry() {
      this.$router.push('/query/addInquiry')
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
      if (this.$route.query.customBid) {
        obj.costomerBId = this.$route.query.customBid
      }
      if (this.$route.query.supplierBId) {
        obj.supplierBId = this.$route.query.supplierBId
      }
      pageInquiryPrice(obj).then(res => {
        this.dataList = res.data.list;
        this.postData.total = res.data.total;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message(err.message);
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
    // 客户下的联系人列表
    customerContactFun(val) {
      listCustomerContact({ customerBId: val }).then(res => {
        this.modalList = res.data.list || [];
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 查看详情
    detailDialog(row) {
      detailInquiryPrice({ inquiryPriceBId: row.bid }).then(res => {
        this.detailModal = true;
        this.editForm = res.data;
        this.filesList = res.data.inquiryPriceDetails;
        this.controlTowerList = res.data.inquiryOrderPayNodeList || [];
      }).catch(err => {
        this.$message.error(err.message);
      })
      // this.editForm = deepClone(row);
      // this.filesList = row.filesList;
    },
    // 报价按钮
    openQuoted(row) {
      this.$router.push({
        path: '/query/editInquiry',
        query: {
          inquiryId: row.bid
        }
      })
    },
    // 查看询价按钮
    detailQuoted(id) {
      this.$router.push({
        path: '/query/detailQuoted',
        query: { id }
      })
    },
    getSearchTime(date) {
      if (date && date.length) {
        this.postData.startTime = date[0];
        this.postData.endTime = date[1]
      } else {
        this.postData.startTime = '';
        this.postData.endTime = ''
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
    // 删除协议
    removeFile(scope) {
      this.filesList.splice(scope.$index, 1)
    },
    // 下载协议
    exportPactFile(row) {
      window.open(row.customFilePath)
    },
    // 上传文件删除
    handleRemove(file, filesList) {
      this.editForm.customFileName = '';
      this.editForm.customFilePath = '';
    },
    // 上传成功
    handleSuccess(res, file, filename) {
      this.editForm.customFileName = file.name;
      this.editForm.customFilePath = res.data.filePath;
      this.filesList.push({ customFileName: this.editForm.customFileName, customFilePath: this.editForm.customFilePath });
    },
    // 上传之前限制
    beforeUpload(file) {
      for (let i = 0; i < this.filesList.length; i++) {
        if (this.filesList[i].customFileName === file.name) {
          this.$message.error('已有文件不能重复上传');
          return false
        }
      }
      let testmsg = file.name.substring(file.name.lastIndexOf('.') + 1);
      const extension = testmsg === 'PDF';
      const extension2 = testmsg === 'pdf';
      const extension3 = testmsg === 'doc';
      const extension4 = testmsg === 'docx';
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!extension && !extension2 && !extension3 && !extension4) {
        this.$message({
          message: '上传文件只能是 PDF、doc、docx格式!',
          type: 'warning'
        });
      }
      if (!isLt2M) {
        this.$message({
          message: '上传文件大小不能超过 10MB!',
          type: 'warning'
        });
      }
      return (extension || extension2 || extension3 || extension4) && isLt2M
    },
    deleteListByIds() {
      if (!this.selectList.length) {
        return this.$message('请选择数据');
      }
      for (let i = 0; i < this.selectList.length; i++) {
        if (this.selectList[i].inquiryStatus !== 0) {
          return this.$message.warning('只能删除编辑中的数据')
        }
      }
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.idsForm.ids = this.selectList.map(e => {
          return e.id;
        }).join(',');
        let formData = new FormData();
        formData.append("ids", this.idsForm.ids);
        deleteInquiryPriceByIds(formData).then(res => {
          if (res.status === 200) {
            this.$message.success('操作成功!');
          }
          this.getDataList();
        }).catch(err => {
          this.$message.error(err.message);
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    },
    // 导出操作
    exportExcelByEasypoiFun() {
      exportExcelByEasypoiApi().then(res => {
        const link = document.createElement('a');
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        link.style.display = 'none';
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'inquiry.xls');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link)
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    // 多选
    getSelect(selects) {
      this.selectList = selects;
    }
  }
}
</script>

<style lang="scss">
  @import '~@/styles/variables.scss';
  .inquiry {
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
    .menuDialog {
      .el-dialog {
        width: 500px;
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
    .deliveryDate-input {
      width: 60px;
      input {
        text-align: center;
      }
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
  }
</style>
