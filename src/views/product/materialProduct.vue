<template>
  <div class="app-container standardProduct">
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
            :placeholder="$t('common.search')"
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
          <el-button type="primary" class="export" @click="searchData">{{$t('common.search')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="openShelf(1)">{{$t('product.product.onShelf')}}</el-button>
      <el-button type="primary" size="small" @click="openShelf(0)">{{$t('product.product.offShelf')}}</el-button>
      <el-button type="primary" size="small" @click="addNewProduct()">{{$t('common.add')}}</el-button>
      <el-button type="primary" size="small" @click="deleteNewProduct()">{{$t('common.delete')}}</el-button>
      <el-button type="primary" size="small" class="export" @click="exportNewProduct()">{{$t('common.export')}}</el-button>
    </div>
    <el-table
      ref="checkTable"
      v-loading="listLoading"
      :data="dataList"
      element-loading-text="正在查询中。。。"
      border
      fit
      size="mini"
      :header-cell-style="{background: '#a7bfee'}"
      :cell-class-name="cellMethod"
      :header-cell-class-name="cellMethod"
      @expand-change="expandTable"
      @select-all="getSelectAll"
      @select="getSelect">
      <el-table-column
        align="center"
        type="selection"
        width="50">
      </el-table-column>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-checkbox-group v-model="checkList">
          <div class="table-expand" v-for="(item, childIndex) in props.row.childs" :key="childIndex">
            <div class="expand-box"></div>
            <div class="expand-box"><el-checkbox :label="item">{{item.null}}</el-checkbox></div>
            <div class="table-flex">
              <div class="sku-attr">
                <div style="width: 160px">SKU</div>
                <div class="sku-text">{{item.attrValueList}}</div>
              </div>
              <div class="sku-msg">
                <div style="width: 200px;">{{item.updateUserId}}</div>
                <div style="width: 200px;">{{item.updateTime | timeFmt}}</div>
                <div style="width: 160px">
                  <el-tag :type="item.isShelf === 1 ? 'primary' : 'info' " size="mini">{{ item.isShelf === 1 ? 'ON' : 'OFF' }}</el-tag>
                </div>
              </div>
            </div>
          </div>
          </el-checkbox-group>
        </template>
      </el-table-column>
      <el-table-column :label="$t('product.categoryTemplate.category')" prop="categoryName" show-overflow-tooltip/>
      <el-table-column :label="$t('product.product.productCode')" prop="productCode" show-overflow-tooltip/>
      <el-table-column :label="$t('product.product.productName')" prop="productName" show-overflow-tooltip/>
      <el-table-column align="center" width="200" :label="$t('common.table.updateBy')" prop="updateUserId" show-overflow-tooltip/>
      <el-table-column align="center" width="200" :label="$t('common.table.updateTime')" prop="updateTime" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.updateTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="160" :label="$t('common.status')">
      </el-table-column>
    </el-table>
    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList" ></Pagination>

    <el-dialog :visible.sync="dialogVisible" :title="$t('product.product.addstandard')" width="800px" center>
      <el-form :model="dialogForm" label-width="120px" label-position="right" inline size="mini" >
        <el-form-item :label="$t('product.categoryTemplate.category')">
          <el-cascader
            style="width: 200px"
            v-model="parentsName"
            :options="searchDataList"
            :props="{value: 'bid', label: 'catalogName', children: 'children'}"
            filterable
            clearable
            :placeholder="$t('common.search')"
            change-on-select
            @change="getParentId1"
          ></el-cascader>
        </el-form-item>
        <el-form-item :label="$t('product.product.productCode')">
          <el-input v-model="dialogForm.productCode" clearable :placeholder="$t('product.product.productCode')" style="width: 200px" />
        </el-form-item>
        <el-form-item :label="$t('product.product.productName')">
          <el-input v-model="dialogForm.productName" clearable :placeholder="$t('product.product.productName')" style="width: 200px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchProductList">{{$t('common.search')}}</el-button>
        </el-form-item>
      </el-form>
      <div style="margin: 10px 0">
        <el-table
          :data="productList"
          v-loading="listLoading1"
          border
          fit
          size="mini"
          style="margin-top: 10px"
          :header-cell-style="{background: '#a7bfee'}"
          @selection-change="getSelect1">
          <el-table-column
            align="center"
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column align="center" :label="$t('product.categoryTemplate.category')" prop="catalogBName" />

          <el-table-column align="center" :label="$t('product.product.productCode')" prop="productCode" />

          <el-table-column align="center" :label="$t('product.product.productName')" prop="productName" />
        </el-table>
        <Pagination :total="dialogForm.total" :page.sync="dialogForm.pageNum" :limit.sync="dialogForm.pageSize" @pagination="getMaterialProductList" ></Pagination>
      </div>
      <div slot="footer">
        <el-button type="primary" size="small" :loading="saveLoading" @click="confirmAdd">{{$t('common.buttonText.save')}}</el-button>
        <el-button type="danger" size="small" @click="dialogVisible=false">{{$t('common.buttonText.cancel')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination';
import { getMaterialProductList,
  getForProductMaterial,
  getPublicCategory,
  getProductRawMaterialSkuList,
  updateProductRawMaterialSku,
  saveBatchProductRawMaterial,
  deleteProductRawMaterialSku
} from '@/api/product';
import { parseTime } from '@/utils/index'
export default {
  components: {
    Pagination
  },
  data() {
    return {
      checkList: [],
      listLoading: true,
      listLoading1: true,
      dialogVisible: false,
      saveLoading: false,
      cloneList: [],
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        productName: '',
        productCode: '',
        catalogBId: ''
      },
      reviewForm: {
        preferredIds: '',
        preferredStatus: 0
      },
      dialogForm: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        productName: '',
        productCode: '',
        categoryBId: ''
      },
      searchDataList: [],
      parentsName: [],
      selectList: [],
      dataList: [],
      productList: [],
      selectList1: []
    }
  },
  created() {
    this.getDataList();
    this.getAllDataList();
  },
  methods: {
    searchData() {
      this.postData.pageNum = 1;
      this.getDataList()
    },
    getParentId(arr) {
      if (arr.length) {
        this.postData.catalogBId = arr.join(',');
      } else {
        this.postData.catalogBId = '';
      }
    },
    getParentId1(arr) {
      if (arr.length) {
        this.dialogForm.catalogBId = arr.join(',');
      } else {
        this.dialogForm.catalogBId = '';
      }
    },
    expandTable(row, rows) {
      let expandFlag = rows.indexOf(row) > -1;
      let rowIndex = this.dataList.indexOf(row);
      let hasChilds = this.dataList[rowIndex].childs.length > 0;
      if (expandFlag && !hasChilds) {
        getProductRawMaterialSkuList({ productBId: row.productBId }).then(res => {
          this.dataList[rowIndex].childs = res.data
        }).catch(err => {
          this.$message.error(err.message);
        });
      }
    },
    cellMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        return 'table-expand-border'
      }
    },
    searchProductList() {
      this.dialogForm.pageNum = 1;
      this.getMaterialProductList()
    },
    getMaterialProductList() {
      let obj = {};
      for (let key in this.dialogForm) {
        if (this.dialogForm[key]) {
          obj[key] = this.dialogForm[key]
        }
      }
      this.listLoading1 = true;
      getMaterialProductList(obj).then(res => {
        this.productList = res.data.list.map(e => {
          return { ...e }
        });
        this.dialogForm.total = res.data.total;
        this.listLoading1 = false;
      }).catch(err => {
        this.listLoading1 = false;
        this.$message.error(err.message);
      });
    },
    addNewProduct() {
      this.dialogForm.pageNum = 1;
      this.getMaterialProductList();
      this.dialogVisible = true;
      this.selectList1 = []
    },
    deleteNewProduct() {
      if (!this.checkList.length && !this.selectList.length) {
        return this.$message.warning('请选择要删除的优选商品或优选商品SKU')
      }
      this.$confirm('此操作将删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        let obj = {
          productBId: this.selectList.map(e => e.productBId).join(','),
          skuBId: this.checkList.map(e => e.skuBId).join(',')
        };
        deleteProductRawMaterialSku(obj).then(res => {
          this.searchData();
          this.$message.success('删除成功');
        }).catch(err => {
          this.$message.error(err.message)
        });
      }).catch(() => {
      });
    },
    exportNewProduct() {
      console.info('导出方法');
    },
    openShelf(val) {
      if (!this.checkList.length) {
        return this.$message.warning('请选择数据');
      }
      let text = '';
      if (val === 1) {
        text = '上架';
      } else {
        text = '下架';
      }
      this.$confirm('是否确定' + text + '?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        let shelfSku = this.checkList.map(e => {
          return {
            productBId: e.productBId,
            bid: e.skuBId,
            delFlag: e.delFlag,
            attrValueList: e.attrValueList,
            attrBIdList: e.attrBIdList,
            id: e.id
          };
        });
        let shelfBId = this.checkList.map(e => {
          return e.skuBId
        });
        this.cloneList = this.dataList.map(e => e);
        updateProductRawMaterialSku({ isShelf: val, productSkuList: shelfSku }).then(res => {
          if (res.status === 200) {
            this.$message.success('操作成功');
          }
          this.checkList = [];
          this.dataList.forEach(e => {
            e.childs.forEach(t => {
              if (shelfBId.includes(t.skuBId)) {
                t.isShelf = val === 1 ? 1 : 0
              }
            })
          })
        }).catch(err => {
          this.$message.error(err.message);
        });
      }).catch(() => {
      });
    },
    getSelectAll(selects) {
      if (selects.length) {
        selects.forEach(e => {
          e.childs.forEach(t => {
            this.checkList = [... new Set(this.checkList.concat(t))]
          })
        });
      } else {
        this.checkList = [];
      }
    },
    getSelect(selects, row) {
      this.selectList = selects;
      let delSku = row.childs.map(e => e.skuBId);
      if (selects.indexOf(row) > -1) {
        selects.forEach(e => {
          e.childs.forEach(t => {
            this.checkList = [... new Set(this.checkList.concat(t))]
          })
        });
      } else {
        this.checkList = this.checkList.filter(e => {
          return !delSku.includes(e.skuBId)
        });
      }
      console.log(this.checkList)
    },
    getDataList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key]) {
          obj[key] = this.postData[key]
        }
      }
      getForProductMaterial(obj).then(res => {
        this.checkList = [];
        this.dataList = res.data.list.map(e => {
          e.childs = [];
          return { ...e }
        });
        this.postData.total = res.data.total;
      }).catch(err => {
        this.$message.error(err.message);
      });
      this.listLoading = false;
    },
    getAllDataList() {
      getPublicCategory({ pageSize: 999, pageNum: 1 }).then(res => {
        this.searchDataList = res.data.list;
      })
    },
    getSelect1(selects) {
      this.selectList1 = selects;
    },
    getCategoryDataList() {
      getPublicCategory({ pageSize: 999, pageNum: 1 }).then(res => {
        this.searchDataList = res.data.list;
      })
    },
    openDialog() {
      this.dialogForm.pageNum = 1;
      this.getMaterialProductList();
      this.dialogVisible = true;
      this.selectList1 = []
    },
    confirmAdd() {
      if (!this.selectList1.length) {
        return this.$message.warning('请选择要添加的商品')
      }
      this.saveLoading = true;
      saveBatchProductRawMaterial({ productInfoList: this.selectList1 }).then(res => {
        this.$message.success('添加成功')
        this.dialogVisible = false;
        this.saveLoading = false;
        this.searchData();
      }).catch(err => {
        this.saveLoading = false;
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

<style lang="scss">
  @import '~@/styles/variables.scss';
  .standardProduct {
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
    .table-expand {
      display: -webkit-flex;
      display: flex;
      width: 100%;
      .expand-box {
        width: 51px;
        line-height: 30px;
        text-align: center;
        padding: 0 10px;
      }
      .table-flex {
        display: -webkit-flex;
        display: flex;
        width: 100%;
        font-size: 12px;
        .sku-attr {
          flex: 1;
          display: -webkit-flex;
          display: flex;
          >div {
            padding: 0 10px;
            word-wrap: break-word;
            word-break: normal;
            line-height: 1.15rem;
          }
          .sku-text {
            flex: 1;
            text-align: left;
          }
        }
        .sku-msg {
          display: -webkit-flex;
          display: flex;
          >div {
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 0 10px;
            word-wrap: break-word;
            word-break: normal;
            line-height: 1.15rem;
          }
        }
      }
    }
    .table-expand + .table-expand {
      border-top: 1px solid $border-light-color;
    }
    .svgClass {
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
    .el-table__expanded-cell[class*=cell] {
      padding: 0 !important;
    }
    .table-expand-border {
      border-right: none;
    }
  }
</style>
