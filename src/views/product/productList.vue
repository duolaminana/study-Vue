<template>
  <div class="app-container productList">
    <div class="search-box">
      <el-form label-width="90px" inline size="small">
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
        <el-form-item :label="$t('product.product.productCode')">
          <el-input v-model="postData.productCode" clearable :placeholder="$t('product.product.productCode')" style="width: 200px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchModal">{{$t('common.search')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="addModal"><!--新增-->{{$t('common.add')}}</el-button>
      <el-button type="primary" size="small" @click="deleteModal"><!--删除-->{{$t('common.delete')}}</el-button>
      <el-button type="primary" size="small" @click="outportData" class="export">{{$t('common.export')}}</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="dataList"
      element-loading-text="Loading。。。"
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

      <el-table-column :label="$t('product.product.productName')" prop="productName" show-overflow-tooltip/>

      <el-table-column :label="$t('product.product.productCode')" prop="productCode" show-overflow-tooltip/>

      <el-table-column :label="$t('product.categoryTemplate.category')" prop="catalogBName" show-overflow-tooltip/>

      <el-table-column :label="$t('common.table.updateBy')" align="center" width="100px" prop="updateUserId" show-overflow-tooltip/>

      <el-table-column :label="$t('common.table.updateTime')" align="center" width="160px" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.updateTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="120" :label="$t('common.table.actions')" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" class="export" @click="goDetail(row.bid, 'detail')"><!--详情-->{{$t('common.table.view')}}</el-button>
          <el-button type="primary" size="mini" @click="goDetail(row.bid, 'edit')"><!--编辑-->{{$t('common.table.edit')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList" ></Pagination>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils/index'
import {
  getPublicCategory,
  getProductList,
  deleteProduct,
  exportExcelProductList
} from '@/api/product'
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
        productCode: '',
        specNo: ''
      },
      parentsName: [],
      selectList: [],
      statusList: [
        {
          label: '使用中',
          id: 1
        },
        {
          label: '禁用',
          id: 2
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
    addModal() {
      this.$router.push({
        path: '/product/addProduct'
      })
    },
    goDetail(id, type) {
      let path = '';
      if (type === 'edit') {
        // path = '/product/editProduct'
        path = '/product/addProduct'
      } else {
        path = '/product/detailProduct'
      }
      this.$router.push({
        path,
        query: {
          id: id
        }
      })
    },
    getParentId(arr) {
      if (arr.length) {
        this.postData.catalogBId = arr.join(',');
      } else {
        this.postData.catalogBId = '';
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
      getProductList(obj).then(res => {
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
    },
    deleteModal() {
      if (!this.selectList.length) {
        return this.$message.warning('请选择数据')
      }
      this.$confirm('此操作将删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        let obj = {
          bids: this.selectList.map(e => e.bid).join(','),
          delFlag: 1
        };
        deleteProduct(obj).then(res => {
          this.getDataList();
          this.$message.success('删除成功');
        }).catch(err => {
          this.$message.error(err.message)
        });
      }).catch(() => {
      });
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
