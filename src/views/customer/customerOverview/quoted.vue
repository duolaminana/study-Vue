<template>
  <div class="app-container quoted">
    <div class="topBtns">
      <el-button type="primary" size="small" class="export" @click="exportExcelFun()">{{$t('system.role.export')}}</el-button>
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
      <!--<el-table-column align="center" width="70px" label="报价来源" prop="quotedType">-->
        <!--<template slot-scope="{row}">-->
          <!--<el-tag :type="row.quotedType !== 1 ? 'primary' : 'danger'" size="mini">{{row.quotedType === 1 ? '定制' : '询价'}}</el-tag>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column label="报价单号" prop="quotationNo" show-overflow-tooltip/>

      <!-- <el-table-column label="询价(定制)单号" prop="inqueryTailormadeNo" show-overflow-tooltip>
        <template slot-scope="{row}">
          {{row.inqueryTailormadeNo || '无'}}
        </template>
      </el-table-column> -->
      <el-table-column label="客户简称" show-overflow-tooltip>
        <!--<template slot-scope="scope">-->
          <!--{{scope.row.customerInfoVo.companyName}}-->
        <!--</template>-->
        <template slot-scope="scope">
          {{scope.row.buyerName}}
        </template>
      </el-table-column>

      <el-table-column label="国家/电话" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.buyerCountryCode }}/{{scope.row.buyerTelephone }}
        </template>
      </el-table-column>

      <el-table-column align="center" width="80" label="SKU数" prop="skuQuantity">
        <template slot-scope="scope">
          {{scope.row.skuQuantity || 0 }}
        </template>
      </el-table-column>

      <el-table-column align="center" width="80" label="金额" prop="totalAmounts" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.totalAmounts| moneyFmt }}
        </template>
      </el-table-column>

      <el-table-column align="center" width="100px" label="报价人" prop="quotedUserName" show-overflow-tooltip/>

      <el-table-column align="center" width="150px" label="创建时间" prop="createTime">
        <template slot-scope="scope">
          {{scope.row.createTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="100" label="状态" prop="quoteStatus">
        <template slot-scope="{row}">
          <el-tag :type="(row.quoteStatus === 1 || row.quoteStatus === 8) ? 'danger' : 'primary'" size="mini">{{row.quoteStatus | quoteStatusFmt}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column header-align="center" label="操作" width="120" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" class="export" @click="goEdit(0, row.bid)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin:20px;text-align:right;cursor:pointer">
      <span @click="toMore">更多>></span>
    </div>
    <!-- <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList" ></Pagination> -->
  </div>
</template>

<script>
import { selectCountryListApi, selectCurrencyCodeListApi } from '@/api/system'
import { pageQuotedPrice, deleteQuotedPriceByIds, exportQuotedPriceExcelApi } from '@/api/inquiry'
import { parseTime } from '@/utils/index'
import moneyFmt from '@/mixin/moneyFmt'
export default {
  props: { customBid: { type: String, default: '' }, supplierBId: { type: String, default: '' }},
  mixins: [moneyFmt],
  filters: {
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
    },
    quoteStatusFmt(val) {
      switch (Number(val)) {
        case 1: return '编辑中';
        case 2: return '审批中';
        case 3: return '已报价';
        case 4: return '待重新报价';
        case 5: return '废弃';
        case 6: return '拒绝报价';
        case 7: return '审批通过';
        case 8: return '审批未通过';
        case 9: return '已拒绝';
        default:
          return '数据异常';
      }
    }
  },
  data() {
    return {
      selectList: [],
      idsForm: {
        ids: ''
      },
      dataList: [],
      loading1: false,
      loading2: false,
      countryList: [],
      currencyCodeList: [],
      filesList: [],
      listLoading: true,
      postData: {
        costomerBId: '',
        quotedType: '',
        pageNum: 1,
        pageSize: 5,
        total: 0,
        buyerName: '',
        buyerCode: '',
        buyerCountryCode: '',
        quoteStatus: '',
        quotationTime: '',
        startTime: '',
        endTime: '',
        quotationNo: ''
      },
      quotationTime: [],
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
      quoteStatusList: [
        // 报价单状态：1编辑中、2审批中、3已报价、4重新待报价、5废弃、6拒绝报价, 7审批通过', 8 审批未通过 , 9 已拒绝
        {
          label: '编辑中',
          quoteStatus: 1
        },
        {
          label: '审批中',
          quoteStatus: 2
        },
        {
          label: '已报价',
          quoteStatus: 3
        },
        {
          label: '待重新报价',
          quoteStatus: 4
        },
        {
          label: '废弃',
          quoteStatus: 5
        },
        {
          label: '拒绝报价',
          quoteStatus: 6
        },
        {
          label: '审批通过',
          quoteStatus: 7
        },
        {
          label: '审批未通过',
          quoteStatus: 8
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
  created() {
    this.getDataList()
  },
  methods: {
    toMore() {
      let obj = {}
      if (this.customBid) {
        obj = { customBid: this.customBid }
      }
      if (this.supplierBId) {
        obj = { supplierBId: this.supplierBId }
      }
      this.$router.push({
        path: '/query/quoted', query: obj })
    },
    goEdit(type, id, quoteType, flag) {
      let path = '';
      if (type && quoteType === 1) {
        path = '/query/editQuoted'
      } else if (type) {
        path = '/query/editInquiry'
      } else {
        path = '/query/detailQuoted'
      }
      this.$router.push({
        path: path,
        query: { id, flag }
      })
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
      if (this.customBid) {
        obj.costomerBId = this.customBid
      }
      if (this.supplierBId) {
        obj.buyerSupplierBId = this.supplierBId
      }
      // console.log(obj)
      pageQuotedPrice(obj).then(res => {
        this.dataList = res.data.list || [];
        this.postData.total = res.data.total;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message);
      });
    },
    openDialog(type, row) {
    },
    // 查看详情
    detailDialog(row) {
    },
    // 报价按钮
    openQuoted() {
    },
    // 查看询价按钮
    detailQuoted() {
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
    deleteListByIds() {
      if (!this.selectList.length) {
        return this.$message.warning('请选择数据');
      }
      for (let i = 0; i < this.selectList.length; i++) {
        if (this.selectList[i].quoteStatus !== 1) {
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
        deleteQuotedPriceByIds(formData).then(res => {
          if (res.status === 200) {
            this.$message.success('操作成功!');
          }
          this.getDataList();
        }).catch(err => {
          this.$message.error(err.message);
        });
      }).catch(() => {
        this.$message.error('测试')
      });
    },
    // 多选
    getSelect(selects) {
      this.selectList = selects;
    },
    // 导出操作
    exportExcelFun() {
      exportQuotedPriceExcelApi().then(res => {
        const link = document.createElement('a');
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        link.style.display = 'none';
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'quoted.xls');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link)
      }).catch(err => {
        this.$message.error(err.message)
      });
    }
  }
}
</script>

<style lang="scss">
  @import '~@/styles/variables.scss';
  .quoted {
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
  }
</style>
