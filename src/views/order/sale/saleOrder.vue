<template>
  <div class="app-container saleOrder">
    <div class="search-box">
      <el-form label-width="90px" inline size="small">
        <div>
          <el-form-item label="客户名称">
            <el-input v-model="postData.customerUserName" clearable placeholder="请输入客户名称" style="width: 200px" />
          </el-form-item>
          <el-form-item label="订单号">
            <el-input v-model="postData.orderNo" clearable placeholder="请输入订单号" style="width: 200px" />
          </el-form-item>
          <el-form-item style="padding-left: 90px;">
            <el-button type="primary" class="export" @click="searchData">搜索</el-button>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="国家" prop="countryCode">
            <el-select filterable remote :remote-method="getCountryList" :loading="loading1" v-model="postData.customerCountryCode" clearable placeholder="国家中文名或者英文名" style="width: 200px">
              <el-option v-for="(item, index) in countryList" :label="item.chEnName" :value="item.countryCode" :key="index"></el-option>
            </el-select>
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
        </div>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="goAddRouter">新增</el-button>
      <el-button type="primary" size="small" @click="deleteClick">删除</el-button>
      <!--<el-button type="primary" size="small" class="export">导出excel</el-button>-->
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
      <el-table-column
        align="center"
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column label="订单号" prop="orderNo" show-overflow-tooltip/>

      <el-table-column label="客户名称" prop="buyerName" show-overflow-tooltip/>

      <el-table-column label="国家/电话" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.buyerCountryCode}}/{{scope.row.buyerTelephone}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="80" label="SKU数" prop="prodcutSkuCount" />

      <el-table-column align="center" label="金额" prop="totalAmount" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.totalAmount | moneyFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="100" label="创建人" prop="createUserName" show-overflow-tooltip/>

      <el-table-column align="center" width="150" label="订单日期" prop="createTime">
        <template slot-scope="scope">
          {{scope.row.createTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="80px" label="状态" prop="statusStr">
        <template slot-scope="scope">
          {{scope.row.statusStr}}
        </template>
      </el-table-column>

      <el-table-column header-align="center" label="操作" width="180" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" class="export table-btn-width" @click="goRouter(0, scope.row.bid)">查看</el-button>
          <el-button type="primary" size="mini" class="table-btn-width" v-if="scope.row.status === 1 || scope.row.status === 3" @click="goRouter(1, scope.row.bid)">编辑</el-button>
          <el-button type="primary" size="mini" class="table-btn-width" v-if="scope.row.status === 4" @click="goRouter(4, scope.row.bid)">确认订单</el-button>
          <el-button type="primary" size="mini" class="table-btn-width" v-if="scope.row.orderStatus === 5" @click="openDialog(scope.row.bid)">状态维护</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageIndex" :limit.sync="postData.pageSize" @pagination="getDataList" ></Pagination>

    <el-dialog :visible.sync="dialogVisible" title="销售订单状态维护" width="1100px" center :close-on-click-modal="false">
      <el-form ref="detailForm" :model="detailForm" label-width="120px" size="small">
        <el-row>
          <el-col :span="8">
            <el-form-item label="订单号">
              {{detailForm.orderNo}}
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
                  <el-select v-model="detailForm.customerBId" disabled placeholder="请选择公司名称" class="edit-form-width">
                    <el-option v-for="(item, index) in customerInfoList" :label="item.companyName" :value="item.bid" :key="index"></el-option>
                  </el-select>
                </td>
              </tr>
              <tr>
                <td>买方联系人</td>
                <td>
                  <el-select v-model="detailForm.buyerContactBy" disabled placeholder="请选择购买人" class="edit-form-width">
                    <el-option v-for="(item, index) in modalList" :label="item.contactName" :value="item.accountBId" :key="index"></el-option>
                  </el-select>
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
                  <el-select v-model="detailForm.sysCompanyBId" disabled placeholder="请选择卖方企业名称" class="edit-form-width">
                    <el-option v-for="(item, index) in sysCustomerInfoList" :label="item.companyName" :value="item.bid" :key="index"></el-option>
                  </el-select>
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
        <div class="step-node">
          订单节点进度
          <el-button type="primary" size="mini" style="float: right" @click="openFiles(detailForm.bid)">相关文件上传</el-button>
        </div>

        <div style="margin: 20px 0; border-bottom: 1px solid #eee;">
          <order-step :list="allNodeList" :canclick="true"></order-step>
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="dialogVisible=false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import OrderStep from '@/components/OrderStep'
import { parseTime } from '@/utils/index'
import { selectCountryListApi, getSupplyCompanyList } from '@/api/system'
import { listCustomerInfoContactApi, listCustomerContact } from '@/api/customer'
import { getSaleOrderList, deleteSaleOrder, saleOrderDetail, allNodeSaleOrder } from '@/api/order'
import moneyFmt from '@/mixin/moneyFmt'
export default {
  components: {
    Pagination,
    OrderStep
  },
  mixins: [moneyFmt],
  data() {
    return {
      list: null,
      listLoading: true,
      loading1: false,
      dialogVisible: false,
      rangeTime: [],
      selectList: [],
      postData: {
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        customerUserName: '',
        orderNo: '',
        customerCountryCode: '',
        orderEndTime: '',
        orderStartTime: ''
      },
      dataList: [],
      countryList: [],
      detailForm: {},
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
      modalList: [],
      allNodeList: []
    }
  },
  created() {
    this.getDataList();
    this.getCustomerInfoListFun();
    this.getSysCustomerInfoListFun();
  },
  methods: {
    // 点击 相关文件上传 到按钮跳转上传列表页面操作
    openFiles(id) {
      this.$router.push({
        path: '/order/relevantFiles',
        query: {
          id: id
        }
      });
    },
    goRouter(type, id) {
      let path = type === 1 ? '/order/sale/editOrder' : '/order/sale/saleOrderDetail';
      this.$router.push({
        path: path,
        query: {
          id, type
        }
      });
    },
    goAddRouter() {
      this.$router.push({
        path: '/order/sale/editOrder',
        query: {
          editType: true
        }
      });
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
    // 主体企业列表
    getSysCustomerInfoListFun() {
      getSupplyCompanyList().then(res => {
        this.sysCustomerInfoList = res.data || []
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    openDialog(id) {
      this.getSaleOrderDetail(id);
      this.getAllNodeSaleOrder(id)
    },
    getSaleOrderDetail(id) {
      saleOrderDetail({ orderBid: id }).then(res => {
        this.detailForm = Object.assign(this.detailForm, res.data);
        this.dialogVisible = true;
        this.customerContactFun(this.detailForm.customerBId);
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    getAllNodeSaleOrder(id) {
      allNodeSaleOrder({ orderBid: id }).then(res => {
        this.allNodeList = res.data.workflowProcessList.map((e, index) => {
          e.currentCompletion = e.currentCompletion.toString();
          return { ...e }
        });
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    getSearchTime(date) {
      if (date && date.length) {
        this.postData.orderStartTime = date[0];
        this.postData.orderEndTime = date[1]
      } else {
        this.postData.orderStartTime = '';
        this.postData.orderEndTime = ''
      }
    },
    deleteClick() {
      if (!this.selectList.length) {
        return this.$message.warning('请选择数据')
      }
      for (let i = 0; i < this.selectList.length; i++) {
        if (this.selectList[i].status !== 1) {
          return this.$message.warning('只能删除编辑中的数据')
        }
      }
      this.$confirm('此操作将删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        let obj = {
          ids: this.selectList.map(e => e.id).join(',')
        };
        deleteSaleOrder(obj).then(res => {
          this.getDataList();
          this.$message.success('删除成功');
        }).catch(err => {
          this.$message.error(err.message)
        });
      }).catch(() => {
      });
    },
    searchData() {
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
      obj.apiType = 2;
      if (this.$route.query.customerUserBid) {
        obj.customerUserBid = this.$route.query.customerUserBid
      }
      getSaleOrderList(obj).then(res => {
        this.dataList = res.data.list;
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
    .row-item {
      margin-bottom: 20px;
    }
    .step-node {
      position: relative;
      font-weight: bold;
      font-size: 15px;
      line-height: 40px;
      padding: 5px 5px 5px 20px;
      border-bottom: 1px solid $border-light-color;
    }
  }
</style>
