<template>
  <div class="app-container applySample">
    <div class="search-box">
      <el-form label-width="130px" inline size="small">
        <el-form-item :label="$t('product.categoryTemplate.category')">
          <el-cascader
            style="width: 200px"
            v-model="parentsName"
            :options="searchDataList"
            :props="{value: 'bid', label: 'catalogName', children: 'children'}"
            filterable
            clearable
            placeholder="Search"
            change-on-select
            @change="getParentId"
          ></el-cascader>
        </el-form-item>
        <el-form-item :label="$t('product.product.productName')">
          <el-input v-model="postData.productName" clearable :placeholder="$t('product.product.productName')" style="width: 200px" />
        </el-form-item>
        <el-form-item :label="$t('common.status')">
          <el-select v-model="postData.applyStatus" clearable placeholder="select status" style="width: 200px">
            <el-option v-for="(item, index) in statusList" :label="language === 'zh' ? item.labelZh : item.label" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchModal">{{$t('common.search')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" class="export">{{$t('common.export')}}</el-button>
      <!--<el-button type="primary" size="small" @click="outportData" class="export">{{$t('common.export')}}</el-button>-->
    </div>
    <el-table
      v-loading="listLoading"
      :data="dataList"
      element-loading-text="Loading。。。"
      border
      fit
      size="mini"
      :header-cell-style="{background: '#a7bfee'}">
      <el-table-column
        align="center"
        type="index"
        label="序号"
        width="55">
      </el-table-column>

      <el-table-column :label="$t('product.categoryTemplate.category')" prop="categoryName" show-overflow-tooltip/>

      <el-table-column :label="$t('product.product.productName')" prop="productName" show-overflow-tooltip/>

      <el-table-column label="申请人" prop="createUserId" show-overflow-tooltip/>

      <el-table-column label="申请时间" align="center" width="160px" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.createTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column :label="$t('newProduct.apply.applyNum')" align="center" width="100px" prop="appliedAmount" show-overflow-tooltip/>

      <el-table-column :label="$t('newProduct.apply.server')" align="center" width="100px" prop="customerServiceName" show-overflow-tooltip/>

      <el-table-column align="center" width="80" :label="$t('common.table.status')" prop="applyStatus">
        <template slot-scope="scope">
          <el-tag :type="scope.row.applyStatus === 1 ? 'primary' : 'danger' " size="mini">
            {{ scope.row.applyStatus === 1 ? $t('newProduct.apply.finished') : $t('newProduct.apply.application') }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList" ></Pagination>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils/index'
import { getPublicCategory, exportExcelProductList } from '@/api/product'
import { getNewProductRecord } from '@/api/newProduct'
export default {
  components: {
    Pagination
  },
  data() {
    return {
      listLoading: true,
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        productName: '',
        applyStatus: '',
        productPublicCategoryBId: ''
      },
      parentsName: [],
      selectList: [],
      statusList: [
        {
          labelZh: '完成',
          label: 'finished',
          id: 1
        },
        {
          labelZh: '申请中',
          label: 'Application',
          id: 0
        }
      ],
      searchDataList: [],
      dataList: []
    }
  },
  created() {
    this.getDataList();
    this.getAllDataList()
  },
  methods: {
    getParentId(arr) {
      if (arr.length) {
        this.postData.productPublicCategoryBId = arr.join(',');
      } else {
        this.postData.productPublicCategoryBId = '';
      }
    },
    searchModal() {
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
      obj.appliedType = 1;
      getNewProductRecord(obj).then(res => {
        this.dataList = res.data.list || [];
        this.postData.total = res.data.total;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message)
      });
    },
    getAllDataList() {
      getPublicCategory({ pageSize: 999, pageNum: 1 }).then(res => {
        this.searchDataList = res.data.list;
      })
    },
    outportData() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      exportExcelProductList(obj).then(res => {
        const link = document.createElement('a');
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        link.style.display = 'none';
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', '产品详情管理列表.xls')
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link)
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
}
</script>
