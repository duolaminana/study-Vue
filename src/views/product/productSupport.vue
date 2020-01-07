<template>
  <div class="app-container productSupport">
    <div class="search-box">
      <el-form label-width="90px" inline size="small">
        <el-form-item label="供应商名称">
          <el-input v-model="postData.supplierName" clearable placeholder="请输入供应商名称" style="width: 200px" />
        </el-form-item>
        <el-form-item label="商品编码">
          <el-input v-model="postData.productCode" clearable placeholder="请输入供应商名称" style="width: 200px" />
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="postData.productName" clearable placeholder="请输入商品名称" style="width: 200px" />
        </el-form-item>
        <el-form-item label="SKU">
          <el-input v-model="postData.attrValueList" clearable placeholder="请输入SKU" style="width: 200px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchData">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      v-loading="listLoading"
      :data="dataList"
      element-loading-text="正在查询中。。。"
      border
      fit
      size="mini"
      :header-cell-style="{background: '#a7bfee'}">
      <el-table-column
        align="center"
        type="selection"
        width="55">
      </el-table-column>

      <el-table-column label="供应商名称" prop="supplierName" show-overflow-tooltip/>

      <el-table-column label="所属类目" prop="catalogBName" show-overflow-tooltip/>
      <el-table-column label="商品编码" prop="productCode" show-overflow-tooltip/>
      <el-table-column label="商品名称" prop="productName" show-overflow-tooltip/>
      <el-table-column label="SKU编码" prop="skuCode" show-overflow-tooltip/>
      <el-table-column label="SKU" prop="attrValueList" />
      <el-table-column align="center" width="100px" label="修改人" prop="updateUserId" show-overflow-tooltip/>

      <el-table-column align="center" width="140px" label="修改时间" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.updateTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="120" label="状态" prop="labelStatus">
        <template slot-scope="scope">
          <el-tag :type="scope.row.priceStatus === 1 ? 'primary' : 'danger' " size="mini">{{ scope.row.priceStatus === 1 ? '采购中' : '已停止采购采购' }}</el-tag>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList" ></Pagination>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getSupplierProductList } from '@/api/supplier';
import { parseTime } from '@/utils/index'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      listLoading: true,
      saveLoading: false,
      editVisible: false,
      detailVisible: false,
      selectList: [],
      parentsName: [],
      searchDataList: [],
      productSkuList: [],
      supplierList: [],
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        supplierName: '',
        catalogBId: '',
        attrValueList: '',
        productName: ''
      },
      dataList: [],
      dialogForm: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        productName: '',
        productCode: ''
      },
      addForm: {
        supplierBId: '',
        priceStatus: 1
      }
    }
  },
  created() {
    this.getDataList();
  },
  methods: {
    searchData() {
      this.postData.pageNum = 1;
      this.getDataList()
    },
    getDataList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key]) {
          obj[key] = this.postData[key]
        }
      }
      getSupplierProductList(obj).then(res => {
        this.dataList = res.data.list;
        this.postData.total = res.data.total;
      }).catch(err => {
        this.$message.error(err.message);
      });
      this.listLoading = false;
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
  .productSupport {
    .search-box {
      margin-bottom: 15px;
      border-bottom: 1px solid $border-light-color;
    }
    .topBtns {
      margin-bottom: 10px;
      text-align: right;
      .export {
        background: green;
        border: green;
      }
      button {
        margin: 0 10px;
      }
    }
    .menuDialog {
      .el-dialog {
        width: 700px;
      }
    }
  }
</style>
