<template>
  <div class="app-container logisticOrderDetail">
    <el-form label-position="left" label-width="130px" size="small" inline>
      <div>
        <el-form-item label="物流订单号">
          {{detailForm.logisticsOrderNo || 'Null'}}
        </el-form-item>
      </div>
      <el-row :gutter="16">
        <el-col>
          <el-form-item label="订单类型" prop="orderType">
            <el-radio-group v-model="detailForm.orderType" disabled>
              <el-radio label="0">销售订单</el-radio>
              <el-radio label="1">转单</el-radio>
              <el-radio label="2">采购订单</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="订单号" prop="orderNoArr">
            <el-input v-model="detailForm.orderNo" readonly placeholder="Please click the button to add order" style="width:500px;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="承运方" prop="supplierInfoBId">
            <el-select v-model="detailForm.supplierInfoBId" disabled>
              <el-option v-for="(item, index) in supplierList" :label="item.supplierName" :value="item.bid" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发货人" prop="customerBasicInfoBId">
            <el-select v-model="detailForm.customerBasicInfoBId" disabled placeholder="select">
              <el-option v-for="(item, index) in companyList" :label="item.companyName" :value="item.bid" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="运输方式" prop="transportationMethod">
            <el-select v-model="detailForm.transportationMethod" disabled>
              <el-option label="汽运" value="0"></el-option>
              <el-option label="铁路" value="1"></el-option>
              <el-option label="海运" value="2"></el-option>
              <el-option label="空运" value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="币种" prop="paymentCurrency">
            <el-select filterable remote :remote-method="getCurrencyCodeList" :loading="loading2" v-model="detailForm.paymentCurrency" disabled placeholder="请输入币种名或者币种编码查找">
              <el-option v-for="(item, index) in currencyCodeList" :label="item.currencyCode" :value="item.currencyCode" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="起运港" prop="departurePortAdd">
            <el-input v-model="detailForm.departurePortAdd" disabled style="width:300px;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="目的港" prop="destinationPortAdd">
            <el-input v-model="detailForm.destinationPortAdd" disabled style="width:300px;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="预定出发时间" prop="eta">
            <el-date-picker v-model="detailForm.eta" type="datetime" disabled leplaceholder="select date">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="估计到达时间" prop="etd">
            <el-date-picker v-model="detailForm.etd" type="datetime" disabled placeholder="select date">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-table
            :data="detailForm.logisticsOrderProductsList"
            style="margin: 16px 0"
            border
            fit
            size="mini"
            :header-cell-style="{background: '#a7bfee'}">
            <el-table-column align="center" type="index" width="55"></el-table-column>
            <el-table-column align="center" label="商品" prop="productName" />
            <el-table-column align="center" label="描述" prop="productDescription" />
            <el-table-column align="center" label="客户产品参考" prop="clientProductRef" />
            <el-table-column align="center" label="数量" prop="productQuantity" />
          </el-table>
        </el-col>
        <el-col :span="8">
          <el-form-item label="总重量" prop="logisticsOrderWeight">
            <el-input v-model.number="detailForm.logisticsOrderWeight" readonly style="width:160px;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="总体积" prop="logisticsOrderVolume">
            <el-input v-model.number="detailForm.logisticsOrderVolume" readonly style="width:160px;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="总金额" prop="logisticsOrderAmount">
            <el-input v-model.number="detailForm.logisticsOrderAmount" readonly style="width:160px;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="detailForm.remark" type="textarea" readonly :autosize="{ minRows: 4, maxRows: 6}" style="width:600px;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="附件">
            <div v-for="(item,index) in detailForm.logisticsOrderAttachmentsList" :key="index">
              {{item.attachmentName}}
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <ApprovalFlow @close="closePage"></ApprovalFlow>
  </div>
</template>

<script>
import ApprovalFlow from '@/components/ApprovalFlow'
import { parseTime, deepClone } from "@/utils/index";
import { selectCountryListApi, getSupplyCompanyList, selectCurrencyCodeListApi } from "@/api/system";
import { supplierTypeList } from "@/api/supplier";
import {
  // selectLogisticsOrderDetailListAPI,
  // getLogisticsOrderNoAPI,
  // getSaleOrderListByType,
  // getTransitradeOrderListByType,
  // getPurchaseOrderListByType,
  // addSaleOrderProductToLogistic,
  // addTransitradeOrderProductToLogistic,
  // addPurchaseOrderProductToLogistic,
  // saveLogisticsOrderDetailAPI,
  // submitLogisticsOrderDetailAPI,
  selectLogisticsOrderByIdAPI
} from '@/api/logistic'
import moneyFmt from "@/mixin/moneyFmt";
export default {
  components: {
    ApprovalFlow
  },
  mixins: [moneyFmt],
  data() {
    return {
      loading1: false,
      loading2: false,
      currencyCodeList: [],
      supplierList: [],
      companyList: [],
      detailForm: {
        logisticsOrderNo: '',
        customerBasicInfoBId: '',
        supplierInfoBId: '',
        departurePortAdd: '',
        destinationPortAdd: '',
        eta: '',
        etd: '',
        logisticsOrderAmount: 0,
        logisticsOrderVolume: 0,
        logisticsOrderWeight: 0,
        orderNo: '',
        paymentCurrency: '',
        remark: '',
        transportationMethod: '0',
        orderType: '0',
        logisticsOrderProductsList: [],
        logisticsOrderAttachmentsList: []
      },
      orderTypeList: [
        {
          labelZh: '销售',
          label: 'Sales',
          orderType: 0
        },
        {
          labelZh: '转单',
          label: 'Other',
          orderType: 1
        },
        {
          labelZh: '采购',
          label: 'Purchase',
          orderType: 2
        }
      ]
    };
  },
  computed: {
    activeRoute() {
      let visitedViews = this.$store.state.tagsView.visitedViews;
      let activePath = visitedViews.filter(e => {
        return e.path === this.$route.path
      })[0];
      return activePath
    }
  },
  created() {
    this.getCurrencyCodeList();
    this.getSupplierList();
    this.getSysCustomerInfoListFun();
    this.getOrderDettail()
  },
  methods: {
    closePage() {
      this.$store.dispatch('delView', this.activeRoute).then(() => {
        this.$router.back()
      })
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
    // 物流供应商列表
    getSupplierList() {
      supplierTypeList({ supplierType: 1 }).then(res => {
        this.supplierList = res.data || [];
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 主体企业列表
    getSysCustomerInfoListFun() {
      getSupplyCompanyList().then(res => {
        this.companyList = res.data || [];
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    getOrderDettail () {
      selectLogisticsOrderByIdAPI({ bId: this.$route.query.id }).then(res => {
        this.detailForm = deepClone(res.data);
      }).catch(err => {
        this.$message.error(err.message)
      });
    }
  },
  filters: {
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
    }
  }
};
</script>

<style lang="scss">
@import "~@/styles/variables.scss";
.logisticOrderDetail {
  width: 70%;
  margin: 0 auto;
  .payment-box {
    >div {
      margin: 20px 0;
    }
    .payment-order {
      &-item {
        display: flex;
        line-height: 28px;
        >div {
          flex: 1;
          display: flex;
          .item-label {
            width: 130px;
          }
          .item-text {
            flex: 1;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
    .payment-supplier {
      display: flex;
      border-top: 1px solid $border-light-color;
      padding-top: 10px;
      >div {
        flex: 1;
        .payment-supplier-item {
          padding-left: 100px;
          flex: 1;
          display: flex;
          line-height: 35px;
          .item-label {
            width: 130px;
          }
          .item-text {
            flex: 1;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }
}
</style>
