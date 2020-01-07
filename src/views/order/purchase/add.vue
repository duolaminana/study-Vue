<template>
  <div class="app-container add-from-saleOrder">
    <div class="edit-title">从销售订单新增采购订单</div>
    <div class="sale-order-list">
      <div class="search-div">
        <el-form label-width="90px" size="small" inline class="edit-form">
          <el-form-item label="销售订单号">
            <el-input v-model="postData.orderNo" clearable placeholder="请输入销售订单号" style="width: 200px" />
          </el-form-item>
          <el-form-item label="客户名称">
            <el-input v-model="postData.customerUserName" clearable placeholder="请输入客户名称" style="width: 200px" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="export" size="small" @click="searchSaleOrder">搜索</el-button>
          </el-form-item>
        </el-form>
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
          :index="indexMethod"
          label="序号"
          width="55">
        </el-table-column>
        <el-table-column label="销售订单号" prop="orderNo" show-overflow-tooltip />

        <el-table-column align="center" label="客户名称" prop="buyerName" show-overflow-tooltip />

        <el-table-column align="center" label="国家" prop="buyerCountryCode" show-overflow-tooltip />

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
        <el-select v-model="companyBId" placeholder="请选择卖方企业名称" clearable size="small" class="edit-form-width">
          <el-option v-for="(item, index) in mainCompanyList" :label="item.companyName" :value="item.bid" :key="index"></el-option>
        </el-select>
        <el-button type="primary" size="small" @click="fillSkuSupplierBId">批量选择</el-button>
      </div>
      <el-table
        :data="orderSkuList"
        border
        fit
        show-summary
        size="mini"
        max-height="520"
        style="font-size: 12px"
        :header-cell-style="{background: '#a7bfee'}"
        @selection-change="getSelect">

        <el-table-column
          align="center"
          type="selection"
          label="序号"
          width="55">
        </el-table-column>

        <el-table-column align="center" type="index" label="序号" width="55"/>

        <el-table-column align="center" min-width="260px" label="商品信息" prop="inquiryNo" >
          <template slot-scope="scope">
            <div class="table-goods">
              <div class="goods-img"><img :src="scope.row.productImge" alt=""></div>
              <div class="goods-text">
                <div style="font-weight: bold">商品名称：{{scope.row.productName}}</div>
                <div>商品编码：{{scope.row.catalogName}}</div>
                <div>商品编码：{{scope.row.productCode}}</div>
                <div>海关编码：{{scope.row.customsCode}}</div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column align="center" min-width="150px" label="SKU描述" show-overflow-tooltip >
          <template slot-scope="scope">
            <div class="table-goods">
              <div class="goods-text" style="text-align: center">
                <div>{{scope.row.productDescription}}</div>
                <div>sku编码：{{scope.row.skuCode}}</div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column align="center" width="100" label="订货量" prop="productQuantity" show-overflow-tooltip/>

        <el-table-column align="center" width="100" label="销售订单号" prop="salesOrderNo"/>

        <el-table-column align="center" width="150px" label="供应商">
          <template slot-scope="scope">
            <el-select v-model="scope.row.supplierBId" placeholder="请选择供应商" size="small" clearable class="edit-form-width" @change="setType(scope.row)">
              <el-option v-for="(item, index) in supplierCompanyList" :label="item.companyName" :value="item.bid" :key="index"></el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-form ref="editForm" label-width="80px" size="small">
      <el-form-item label="备注">
        <el-input v-model="saleOrder.orderRemarks" :autosize="{ minRows: 4, maxRows: 6}" type="textarea" size="small" clearable style="width: 80%"/>
      </el-form-item>

      <el-form-item style="text-align: center;margin: 40px 0">
        <el-button type="primary" size="small" :loading="loading" @click="submitOrder">生成采购订单</el-button>
        <el-button type="danger" size="small" @click="closePage">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils/index'
import { getWaitSaleOrder, selectSupplierCompanyList, getSaleOrderSkuByBId, addBatchPurchase } from '@/api/purchaseOrder'
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
      listLoading: false,
      loading: false,
      dataList: [],
      orderSkuList: [],
      mainCompanyList: [],
      supplierCompanyList: [],
      selectList: [],
      companyBId: '',
      saleOrder: {},
      postData: {
        pageIndex: 1,
        pageSize: 5,
        total: 0,
        orderNo: '',
        customerUserName: ''
      }
    }
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
    this.getDataList();
    this.getSupplierCompanyList();
    this.getSysCompanyList()
  },
  methods: {
    closePage() {
      this.$store.dispatch('delView', this.activeRoute).then(() => {
        this.$router.push({
          path: '/order/purchase/purchaseOrder'
        })
      })
    },
    getSysCompanyList() {
      selectSupplierCompanyList({ type: 0 }).then(res => {
        this.mainCompanyList = res.data || []
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    getSupplierCompanyList() {
      selectSupplierCompanyList({ type: 1 }).then(res => {
        this.supplierCompanyList = res.data || []
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    handleCurrentChange(row) {
      this.saleOrder = row;
      this.dataList.forEach(e => {
        e.radio = false;
      });
      row.radio = true;
      getSaleOrderSkuByBId({ salesOrderBid: row.bid }).then(res => {
        this.orderSkuList = res.data.map(e => {
          e.salesOrderNo = row.orderNo;
          return { ...e }
        });
        this.listLoading = false;
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    fillSkuSupplierBId() {
      if (this.companyBId) {
        let obj = this.mainCompanyList.filter(e => e.bid === this.companyBId)[0];
        this.orderSkuList.forEach(e => {
          e.supplierBId = this.companyBId;
          e.type = obj.type;
        });
        this.companyBId = '';
      }
    },
    setType(item) {
      let obj = this.supplierCompanyList.filter(e => e.bid === item.supplierBId)[0];
      item.type = obj.type;
    },
    // 勾选触发 selects为选择的数据数组
    getSelect(selects) {
      this.selectList = selects;
    },
    searchSaleOrder() {
      this.postData.pageIndex = 1;
      this.getDataList()
    },
    indexMethod(index) {
      return index + 1 + (this.postData.pageIndex - 1) * this.postData.pageSize;
    },
    getDataList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      getWaitSaleOrder(obj).then(res => {
        this.dataList = res.data.list.map(e => {
          e.radio = false;
          return { ...e }
        });
        this.postData.total = res.data.total;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message)
      })
    },
    submitOrder() {
      if (!this.selectList.length) {
        return this.$message.warning('请选择商品')
      }
      for (let i = 0; i < this.selectList.length; i++) {
        if (!this.selectList[i].supplierBId) {
          return this.$message.warning('请选择商品供应商')
        }
      }
      let obj = {
        purchaseOrderProductsList: this.selectList,
        salesOrderBId: this.saleOrder.bid,
        orderRemarks: this.saleOrder.orderRemarks
      };
      addBatchPurchase(obj).then(res => {
        this.$message.success('新增成功');
        this.loading = false;
        this.closePage();
      }).catch(err => {
        this.loading = false;
        this.$message.error(err.message)
      })
    }
  }
}
</script>

<style lang="scss">
  @import '~@/styles/variables.scss';
  .add-from-saleOrder {
    width: 84%;
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
          margin-right: 80px;
        }
      }
    }
    .sale-order-sku {
      margin: 20px 0;
      .company-fill {
        text-align: right;
        padding: 5px 50px;
      }
    }
  }
</style>
