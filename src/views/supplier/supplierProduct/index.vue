<template>
  <div class="app-container supplierProduct">
    <div class="search-box">
      <el-form label-width="90px" inline size="small">
        <el-form-item label="供应商">
          <el-input v-model="postData.supplierName" clearable placeholder="请输入供应商名称" style="width: 200px" />
        </el-form-item>
        <el-form-item label="商品类目">
          <el-cascader
            style="width: 200px"
            v-model="parentsName"
            :options="searchDataList"
            :props="{value: 'bid', label: 'catalogName', children: 'children'}"
            filterable
            clearable
            placeholder="可搜索"
            change-on-select
            @change="getParentId"
          ></el-cascader>
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
    <div class="topBtns">
      <el-button type="primary" size="small" @click="openEdit">新增</el-button>
      <el-button type="primary" size="small" @click="delSupplierProduct()">删除</el-button>
      <!--<el-button type="primary" size="small" class="export">导出excel</el-button>-->
    </div>
    <el-table
      v-loading="listLoading"
      :data="dataList"
      element-loading-text="正在查询中。。。"
      border
      fit
      size="mini"
      :header-cell-style="{background: '#a7bfee'}"
      @selection-change="getDataSelect">
      <el-table-column
        align="center"
        type="selection"
        width="55">
      </el-table-column>

      <el-table-column label="供应商名称" prop="supplierName" show-overflow-tooltip/>

      <el-table-column label="所属类目" prop="catalogBName" show-overflow-tooltip/>

      <el-table-column label="商品名称" prop="productName" show-overflow-tooltip/>

      <el-table-column label="SKU" prop="attrValueList" show-overflow-tooltip/>

      <el-table-column align="center" width="100" label="修改人" prop="updateUserId" show-overflow-tooltip/>

      <el-table-column align="center" width="160" label="修改时间">
        <template slot-scope="scope">
          {{scope.row.updateTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="80" label="状态" prop="labelStatus">
        <template slot-scope="scope">
          <el-tag :type="scope.row.priceStatus === 1 ? 'primary' : 'danger' " size="mini">{{ scope.row.priceStatus === 1 ? '采购中' : '禁用采购' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="110" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button :type="scope.row.priceStatus === 1 ? 'info' : 'primary'" size="mini" @click="changeStatus(scope.row)">{{scope.row.priceStatus === 1 ? '停止采购' : '开始采购'}}</el-button>
          <!--<el-button type="danger" v-if="scope.row.priceStatus !== 1" size="mini" @click="delSupplierProduct(scope.row)">删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList" ></Pagination>

    <el-dialog :visible.sync="editVisible" title="新增供应商商品" center class="menuDialog">
      <el-form :model="dialogForm" label-width="80px" label-position="right" inline size="small" >
        <el-form-item label="商品编码">
          <el-input v-model="dialogForm.productCode" clearable placeholder="商品编码" style="width: 180px" />
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="dialogForm.productName" clearable placeholder="商品名称" style="width: 180px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchProductSkuList">搜索</el-button>
        </el-form-item>
      </el-form>
      <div style="margin-top: 15px;border-top: 1px dashed #F4F4F4;padding-top: 15px">
        <el-form :model="addForm" label-width="100px" label-position="right" inline size="small" >
          <el-form-item label="选择供应商">
            <el-select v-model="addForm.supplierBId" clearable filterable placeholder="请选择供应商" style="width: 250px">
              <el-option v-for="(item, index) in supplierList" :label="item.supplierName" :value="item.bid" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            {{addForm.priceStatus === 1 ? '采购中' : '停止采购'}}
          </el-form-item>
        </el-form>
      </div>
      <div style="margin: 10px 0">
        商品sku:
        <el-table
          :data="productSkuList"
          border
          fit
          size="small"
          style="margin-top: 10px"
          :header-cell-style="{background: '#a7bfee'}"
          @selection-change="getSelect">
          <el-table-column
            align="center"
            type="selection"
            width="55">
          </el-table-column>

          <el-table-column align="center" label="商品编码" prop="productCode" show-overflow-tooltip/>

          <el-table-column align="center" label="商品名称" prop="productName" show-overflow-tooltip/>

          <el-table-column align="center" label="SKU" prop="attrValueList" show-overflow-tooltip/>
        </el-table>
        <Pagination :total="dialogForm.total" :page.sync="dialogForm.pageNum" :limit.sync="dialogForm.pageSize" @pagination="getProductSkuList" ></Pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" :loading="saveLoading" @click="confirmAdd">保存</el-button>
        <el-button type="danger" size="small" @click="editVisible=false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getPublicCategory, getProductSkuList } from '@/api/product'
import { getSupplierProductList, addSupplierProduct, updateSupplierProduct, delSupplierProduct, getSupplierList } from '@/api/supplier';
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
    this.getAllSupplierList();
    this.getAllDataList();
  },
  methods: {
    getParentId(arr) {
      if (arr.length) {
        this.postData.catalogBId = arr.join(',');
      } else {
        this.postData.catalogBId = '';
      }
    },
    getAllDataList() {
      getPublicCategory({ pageSize: 999, pageNum: 1 }).then(res => {
        this.searchDataList = res.data.list;
      })
    },
    searchProductSkuList() {
      this.dialogForm.pageNum = 1;
      this.getProductSkuList();
    },
    getProductSkuList() {
      let obj = {};
      for (let key in this.dialogForm) {
        if (this.dialogForm[key]) {
          obj[key] = this.dialogForm[key]
        }
      }
      getProductSkuList(obj).then(res => {
        this.productSkuList = res.data.list || [];
        this.dialogForm.total = res.data.total;
      })
    },
    getAllSupplierList() {
      getSupplierList().then(res => {
        this.supplierList = res.data;
      })
    },
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
    },
    openEdit() {
      this.dialogForm.pageNum = 1;
      this.getProductSkuList();
      this.editVisible = true;
    },
    // 单选
    getSelect(selects) {
      this.selectList = selects;
    },
    getDataSelect(selects) {
      this.selectDataList = selects;
    },
    delSupplierProduct(row) {
      let obj = {};
      if (!row) {
        if (!this.selectDataList.length) {
          return this.$message.error('请先选择数据')
        } else {
          for (let i = 0; i < this.selectDataList.length; i++) {
            if (this.selectDataList[i].priceStatus === 1) {
              return this.$message.error('不能选择状态为采购中的数据')
            }
          }
          obj = { ids: this.selectDataList.map(e => e.id).join(',') }
        }
      } else {
        obj = { ids: row.id };
      }
      this.$confirm('此操作将删除该供应商商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        delSupplierProduct(obj).then(res => {
          this.postData.pageNum = 1;
          this.getDataList();
          this.$message.success('删除成功')
        }).catch(err => {
          this.$message.error(err.message);
        });
      }).catch(() => {
      });
    },
    changeStatus(row) {
      let obj = {
        id: row.id,
        priceStatus: row.priceStatus === 1 ? 2 : 1
      };
      updateSupplierProduct(obj).then(res => {
        this.getDataList();
        this.$message.success('操作成功');
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    clearForm() {
      this.dialogForm.productCode = '';
      this.dialogForm.productName = 1;
      this.productSkuList = [];
      this.addForm.supplierBId = '';
    },
    confirmAdd() {
      if (!this.selectList.length) {
        return this.$message.error('请先选择Sku.')
      }
      if (!this.addForm.supplierBId) {
        return this.$message.error('请选择供应商')
      }
      this.saveLoading = true;
      this.addForm.productSkuList = this.selectList;
      addSupplierProduct(this.addForm).then(res => {
        if (res.status === 200) {
          this.$message({ message: res.data, type: 'success' })
        }
        this.editVisible = false;
        this.saveLoading = false;
        this.getDataList();
        this.clearForm();
      }).catch(err => {
        this.saveLoading = false;
        this.$message.error(err.message);
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

<style lang="scss">
  @import '~@/styles/variables.scss';
  .supplierProduct {
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
