<template>
  <div class="app-container saleOrder">
    <div class="search-box">
      <el-form label-width="90px" inline size="small">
        <div>
          <el-form-item :label="$t('logistics.logisticsTrace.customerUserName')">
            <el-input
              v-model="postData.customerUserName"
              clearable
              :placeholder="$t('logistics.logisticsTrace.customerUserName')"
              style="width: 295px"
            />
          </el-form-item>
          <el-form-item :label="$t('logistics.logisticsTrace.orderNo')">
            <el-input
              v-model="postData.orderNo"
              clearable
              :placeholder="$t('logistics.logisticsTrace.orderNo')"
              style="width: 295px"
            />
          </el-form-item>
        </div>
        <div>
          <el-form-item :label="$t('logistics.logisticsTrace.countryCode')" prop="countryCode">
            <el-select
              filterable
              remote
              :remote-method="getCountryList"
              :loading="loading1"
              v-model="postData.customerCountryCode"
              clearable
              :placeholder="$t('logistics.logisticsTrace.countryCodeExplain')"
              style="width: 295px"
            >
              <el-option
                v-for="(item, index) in countryList"
                :label="item.chEnName"
                :value="item.countryCode"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('logistics.logisticsTrace.rangeTime')">
            <el-date-picker
              v-model="rangeTime"
              type="daterange"
              align="right"
              unlink-panels
              clearable
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 295px"
              :picker-options="pickerOptions"
              @change="getSearchTime"
            ></el-date-picker>
          </el-form-item>
          <el-form-item style="padding-left: 50px;">
            <el-button type="primary" class="export" @click="searchData">{{$t('common.search')}}</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="topBtns">
      <!--<el-button type="primary" size="small" @click="deleteClick">删除</el-button>-->
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
      @selection-change="getSelect"
    >
      <el-table-column align="center" type="selection" width="55"></el-table-column>
      <el-table-column :label="$t('logistics.logisticsTrace.orderNo')" prop="orderNo" show-overflow-tooltip />

      <el-table-column :label="$t('logistics.logisticsTrace.customerUserName')" prop="buyerName" show-overflow-tooltip />

      <el-table-column :label="$t('logistics.logisticsTrace.countryPhone')" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.buyerCountryCode}}/{{scope.row.buyerTelephone}}</template>
      </el-table-column>

      <el-table-column align="center" width="80" :label="$t('logistics.logisticsTrace.prodcutSkuCount')" prop="prodcutSkuCount" />

      <el-table-column align="center" :label="$t('logistics.logisticsTrace.totalAmount')" prop="totalAmount" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.totalAmount | moneyFmt}}</template>
      </el-table-column>

      <el-table-column align="center" width="100" :label="$t('logistics.logisticsTrace.createUserName')" prop="createUserName" show-overflow-tooltip/>

      <el-table-column align="center" width="150" :label="$t('logistics.logisticsTrace.rangeTime')" prop="createTime">
        <template slot-scope="scope">{{scope.row.createTime | timeFmt}}</template>
      </el-table-column>

      <el-table-column align="center" width="80px" :label="$t('logistics.logisticsTrace.statusStr')" prop="statusStr">
        <template slot-scope="scope">{{scope.row.statusStr}}</template>
      </el-table-column>

      <el-table-column header-align="center" :label="$t('common.table.actions')" width="180" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" class="export table-btn-width" @click="goRouter(0, scope.row.bid)">{{$t('common.table.view')}}</el-button>
          <el-button type="primary" size="mini" class="table-btn-width" v-if="scope.row.orderStatus === 5" @click="openDialog(scope.row.bid)">{{$t('common.table.maintenance')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageIndex" :limit.sync="postData.pageSize" @pagination="getDataList"></Pagination>

    <el-dialog :visible.sync="dialogVisible" :title="$t('logistics.logisticsTrace.orderMaintenance')" width="1100px" center :close-on-click-modal="false">
      <el-form ref="detailForm" :model="detailForm" label-width="120px" size="small">
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$t('logistics.logisticsTrace.orderNo')">{{detailForm.orderNo}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('logistics.logisticsTrace.rangeTime')">{{detailForm.createTime | timeFmt}}</el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-item" justify="space-around">
          <el-col :span="11">
            <table class="form-table" border="0" cellspacing="0" cellpadding="0" width="100%">
              <tr>
                <td width="40%">{{$t('logistics.logisticsTrace.buyer')}}</td>
                <td width="60%">
                  <el-select
                    v-model="detailForm.customerBId"
                    disabled
                    placeholder="请选择公司名称"
                    class="edit-form-width"
                  >
                    <el-option
                      v-for="(item, index) in customerInfoList"
                      :label="item.companyName"
                      :value="item.bid"
                      :key="index"
                    ></el-option>
                  </el-select>
                </td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsTrace.buyerContactBy')}}</td>
                <td>
                  <el-select
                    v-model="detailForm.buyerContactBy"
                    disabled
                    placeholder="请选择购买人"
                    class="edit-form-width"
                  >
                    <el-option
                      v-for="(item, index) in modalList"
                      :label="item.contactName"
                      :value="item.accountBId"
                      :key="index"
                    ></el-option>
                  </el-select>
                </td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsTrace.buyerAddress')}}</td>
                <td>{{detailForm.buyerAddress}}</td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsTrace.buyerTelephone')}}</td>
                <td>{{detailForm.buyerTelephone}}</td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsTrace.buyerEmail')}}</td>
                <td>{{detailForm.buyerEmail}}</td>
              </tr>
              <tr>
                <td>
                  <span class="label-required">{{$t('logistics.logisticsTrace.buyerBank')}}</span>
                </td>
                <td>{{detailForm.buyerBank}}</td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsTrace.buyerBankAccount')}}</td>
                <td>{{detailForm.buyerBankAccount}}</td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsTrace.buyerSwiftcode')}}</td>
                <td>{{detailForm.buyerSwiftcode}}</td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsTrace.arrivePort')}}</td>
                <td>{{detailForm.arrivePort}}</td>
              </tr>
            </table>
          </el-col>
          <el-col :span="11">
            <table class="form-table" border="0" cellspacing="0" cellpadding="0" width="100%">
              <tr>
                <td width="40%">{{$t('logistics.logisticsTrace.seller')}}</td>
                <td width="60%">
                  <el-select
                    v-model="detailForm.sysCompanyBId"
                    disabled
                    placeholder="请选择卖方企业名称"
                    class="edit-form-width"
                  >
                    <el-option
                      v-for="(item, index) in sysCustomerInfoList"
                      :label="item.companyName"
                      :value="item.bid"
                      :key="index"
                    ></el-option>
                  </el-select>
                </td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsTrace.sellerContact')}}</td>
                <td>{{detailForm.sellerContact}}</td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsTrace.sellerAddress')}}</td>
                <td>{{detailForm.sellerAddress}}</td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsTrace.sellerTelephone')}}</td>
                <td>{{detailForm.sellerTelephone}}</td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsTrace.sellerEmail')}}</td>
                <td>{{detailForm.sellerEmail}}</td>
              </tr>
              <tr>
                <td>
                  <span class="label-required">{{$t('logistics.logisticsTrace.sellerBank')}}</span>
                </td>
                <td>{{detailForm.sellerBank}}</td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsTrace.sellerBankAccount')}}</td>
                <td>{{detailForm.sellerBankAccount}}</td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsTrace.sellerSwifcode')}}</td>
                <td>{{detailForm.sellerSwifcode}}</td>
              </tr>
              <tr>
                <td>{{$t('logistics.logisticsTrace.departurePort')}}</td>
                <td>{{detailForm.departurePort}}</td>
              </tr>
            </table>
          </el-col>
        </el-row>
        <div class="step-node">{{$t('logistics.logisticsTrace.OrderNodeProgress')}}</div>
        <div style="margin: 20px 0; border-bottom: 1px solid #eee;">{{$t('logistics.logisticsTrace.logisticsProcess')}}
          <order-step :list="nodeList3" :canclick="true"></order-step>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="dialogVisible=false">{{$t('common.buttonText.close')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import OrderStep from "@/components/OrderStep";
import { parseTime } from "@/utils/index";
import { selectCountryListApi, getSupplyCompanyList } from "@/api/system";
import {
  listCustomerInfoContactApi,
  listCustomerContact
} from "@/api/customer";
import {
  getSaleOrderList,
  saleOrderDetail,
  allNodeSaleOrder
} from "@/api/order";
import moneyFmt from "@/mixin/moneyFmt";
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
        customerUserName: "",
        orderNo: "",
        customerCountryCode: "",
        orderEndTime: "",
        orderStartTime: ""
      },
      dataList: [],
      countryList: [],
      detailForm: {},
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      customerInfoList: [],
      sysCustomerInfoList: [],
      modalList: [],
      allNodeList: [],
      // nodeList1: [],
      // nodeList2: [],
      nodeList3: []
    };
  },
  created() {
    this.getDataList();
    this.getCustomerInfoListFun();
    this.getSysCustomerInfoListFun();
  },
  methods: {
    goRouter(type, id) {
      let path =
        type === 1 ? "/order/sale/editOrder" : "/order/sale/saleOrderDetail";
      this.$router.push({
        path: path,
        query: {
          id: id,
          type: type
        }
      });
    },
    // 查询获取国家
    getCountryList(query) {
      if (query !== "") {
        this.loading1 = true;
        setTimeout(() => {
          this.loading1 = false;
          selectCountryListApi(query).then(res => {
            this.countryList = res.data || [];
          });
        }, 200);
      } else {
        this.countryList = [];
      }
    },
    // 客户人列表
    getCustomerInfoListFun() {
      listCustomerInfoContactApi()
        .then(res => {
          this.customerInfoList = res.data || [];
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    // 客户下的联系人列表
    customerContactFun(val) {
      listCustomerContact({ customerBId: val })
        .then(res => {
          this.modalList = res.data.list || [];
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    // 主体企业列表
    getSysCustomerInfoListFun() {
      getSupplyCompanyList()
        .then(res => {
          this.sysCustomerInfoList = res.data || [];
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    openDialog(id) {
      this.getSaleOrderDetail(id);
      this.getAllNodeSaleOrder(id);
    },
    getSaleOrderDetail(id) {
      saleOrderDetail({ orderBid: id })
        .then(res => {
          this.detailForm = Object.assign(this.detailForm, res.data);
          this.dialogVisible = true;
          this.customerContactFun(this.detailForm.customerBId);
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    getAllNodeSaleOrder(id) {
      allNodeSaleOrder({ orderBid: id })
        .then(res => {
          let allNodeList = res.data.workflowProcessList.map((e, index) => {
            e.currentCompletion = e.currentCompletion.toString();
            return { ...e };
          });
          // this.nodeList1 = allNodeList.filter(e => e.nodeType === 1);
          // this.nodeList2 = allNodeList.filter(e => e.nodeType === 2);
          this.nodeList3 = allNodeList.filter(e => e.nodeType === 3);
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    getSearchTime(date) {
      if (date && date.length) {
        this.postData.orderStartTime = date[0];
        this.postData.orderEndTime = date[1];
      } else {
        this.postData.orderStartTime = "";
        this.postData.orderEndTime = "";
      }
    },
    searchData() {
      this.postData.pageIndex = 1;
      this.getDataList();
    },
    getDataList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== "") {
          obj[key] = this.postData[key];
        }
      }
      obj.apiType = 2;
      getSaleOrderList(obj)
        .then(res => {
          this.dataList = res.data.list;
          this.postData.total = res.data.total;
          this.listLoading = false;
        })
        .catch(err => {
          this.listLoading = false;
          this.$message.error(err.message);
        });
    },
    // 勾选触发 selects为选择的数据数组
    getSelect(selects) {
      this.selectList = selects;
    }
  },
  filters: {
    timeFmt(val) {
      if (val) {
        return parseTime(val);
      }
    }
  }
};
</script>

<style lang="scss">
@import "~@/styles/variables.scss";
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
