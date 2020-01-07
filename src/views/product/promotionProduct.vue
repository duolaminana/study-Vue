<template>
  <div class="app-container promotionProduct">
    <div class="search-box">
      <el-form label-width="90px" inline size="small">
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
        <el-form-item label="商品编码">
          <el-input v-model="postData.productCode" clearable placeholder="请输入商品编码" style="width: 200px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchData">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="openAddDialog">添加商品</el-button>
      <el-button type="primary" size="small" @click="openShelf(1)">上架</el-button>
      <el-button type="primary" size="small" @click="openShelf(0)">下架</el-button>
      <el-button type="primary" size="small" @click="deletePromotionProduct">删除</el-button>
      <!--<el-button type="primary" size="small" class="export">导出excel</el-button>-->
    </div>
    <el-table
      ref="checkTable"
      v-loading="listLoading"
      :data="dataList"
      element-loading-text="正在查询中。。。"
      border
      fit
      stripe
      size="mini"
      :header-cell-style="{background: '#a7bfee'}"
      :span-method="arraySpanMethod"
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
              <div>
                <div>SKU</div>
                <div>{{item.attrValueList}}</div>
              </div>
              <div>
                <div>
                <span v-if="item.editable">
                  <el-input-number v-model="item.productStock" controls-position="right" :min="0" size="small"/>
                </span>
                  <span v-else>{{item.productStock}}</span>
                </div>
                <div>
                <span v-if="item.editable">
                  <el-input-number v-model="item.defineNumber" controls-position="right" :min="0" size="small"/>
                </span>
                  <span v-else>{{item.defineNumber}}</span>
                </div>
                <div>
                <span v-if="item.editable">
                  <el-input-number v-model="item.unitPrice" controls-position="right" :min="0" size="small"/>
                </span>
                  <span v-else>{{item.unitPrice}}</span>
                </div>
              </div>
              <div>
                <div >
                  <span v-if="item.editable">
                    <el-date-picker
                      size="small"
                      v-model="item.deadlineTime"
                      type="datetime"
                      placeholder="选择截止时间"
                      align="right">
                    </el-date-picker>
                  </span>
                  <span v-else>{{item.deadlineTime | timeFmt}}</span>
                </div>
                <div>
                  <el-tag :type="item.isShelf === 1 ? 'primary' : 'info' " size="mini">{{ item.isShelf === 1 ? '上架中' : '下架中' }}</el-tag>
                </div>
                <div>
                  <el-button type="primary" size="mini" :loading="item.loading" @click="saveSkuPrice(item, props.$index)">{{item.editable ? '更新' : '编辑'}}</el-button>
                </div>
              </div>
            </div>
          </div>
          </el-checkbox-group>
        </template>
      </el-table-column>
      <el-table-column header-align="center" label="所属类目" prop="catalogBName" show-overflow-tooltip/>
      <el-table-column header-align="center" label="商品编码" prop="productCode" show-overflow-tooltip/>
      <el-table-column header-align="center" label="商品名称" prop="productName" show-overflow-tooltip/>
      <el-table-column align="center" label="库存" prop="updateUserId" show-overflow-tooltip>
        <template slot-scope="scope">
          <!--<el-input-number v-model="scope.row.productStock" controls-position="right" :precision="2" :min="0" size="small"/>-->
        </template>
      </el-table-column>

      <el-table-column align="center" label="单客户限购" prop="updateTime" show-overflow-tooltip>
        <template slot-scope="scope">
          <!--<el-input-number v-model="scope.row.defineNumber" controls-position="right" :precision="2" :min="0" size="small"/>-->
        </template>
      </el-table-column>

      <el-table-column align="center" label="价格" prop="updateUserId" show-overflow-tooltip>
        <template slot-scope="scope">
          <!--<el-input-number v-model="scope.row.unitPrice" controls-position="right" :precision="2" :min="0" size="small"/>-->
        </template>
      </el-table-column>

      <el-table-column align="center" label="截止时间" prop="updateTime" show-overflow-tooltip>
        <template slot-scope="scope">
          <!--<el-date-picker-->
            <!--size="small"-->
            <!--v-model="scope.row.deadlineTime"-->
            <!--type="datetime"-->
            <!--placeholder="选择截止时间"-->
            <!--align="right">-->
          <!--</el-date-picker>-->
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态">
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" v-if="scope.row.expand" @click="openDialog(scope)">批量更新</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList" ></Pagination>

    <el-dialog :visible.sync="dialogVisible" :title="productTitle" width="500px" center :close-on-click-modal="false" @close="clearData">
      <el-form ref="morePrice" :model="morePriceData" label-width="100px" label-position="right" size="small" inline :rules="morePriceRules">
        <el-form-item label="库存量：" prop="productStock">
          <el-input-number v-model="morePriceData.productStock" controls-position="right" clearable :min="0" style="width: 250px"/>
        </el-form-item>
        <el-form-item label="限购量：" prop="defineNumber">
          <el-input-number v-model="morePriceData.defineNumber" controls-position="right" clearable :min="0" style="width: 250px"/>
        </el-form-item>
        <el-form-item label="促销价格：" prop="unitPrice">
          <el-input-number v-model="morePriceData.unitPrice" controls-position="right" clearable :min="0" style="width: 250px"/>
        </el-form-item>
        <el-form-item label="截止时间：" prop="deadlineTime">
          <el-date-picker
          v-model="morePriceData.deadlineTime"
          type="datetime"
          clearable
          placeholder="选择截止时间"
          align="right"
          style="width: 250px">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" size="small" :loading="dialogLoading" @click="setMorePrice('morePrice')">确定</el-button>
        <el-button type="danger" size="small" @click="dialogVisible = false">关闭</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisible1" title="添加商品" width="700px" center>
      <el-form :model="dialogForm" label-width="80px" label-position="right" inline size="mini" >
        <el-form-item label="所属类目">
          <el-cascader
            style="width: 200px"
            v-model="parentsName"
            :options="searchDataList"
            :props="{value: 'bid', label: 'catalogName', children: 'children'}"
            filterable
            clearable
            placeholder="可搜索"
            change-on-select
            @change="getParentId1"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="商品编码">
          <el-input v-model="dialogForm.productCode" clearable placeholder="商品编码" style="width: 200px" />
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="dialogForm.productName" clearable placeholder="商品名称" style="width: 200px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchProductList">搜索</el-button>
        </el-form-item>
      </el-form>
      <div style="margin: 10px 0">
        商品sku:
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

          <el-table-column align="center" label="所属类目" prop="catalogBName" />
          <el-table-column align="center" label="商品编码" prop="productCode" />
          <el-table-column align="center" label="商品名称" prop="productName" />
        </el-table>
        <Pagination :total="dialogForm.total" :page.sync="dialogForm.pageNum" :limit.sync="dialogForm.pageSize" @pagination="getPromotionsProductList" ></Pagination>
      </div>
      <div slot="footer">
        <el-button type="primary" size="small" :loading="saveLoading" @click="confirmAdd">保存</el-button>
        <el-button type="danger" size="small" @click="dialogVisible1=false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination';
import { getPromotionsProductList,
  getPublicCategory,
  searchPromotionSkuList,
  updatePromotionShelfSku,
  updatePromotionPriceSku,
  promotionPagedList,
  addPromotionProduct,
  delPromotionProduct
} from '@/api/product';
import { parseTime, deepClone } from '@/utils/index'
export default {
  components: {
    Pagination
  },
  data() {
    return {
      dialogVisible: false,
      dialogVisible1: false,
      productTitle: '',
      checkList: [],
      listLoading: true,
      dialogLoading: false,
      dialogLoading1: false,
      listLoading1: false,
      saveLoading: false,
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        productName: '',
        productCode: '',
        catalogBId: ''
      },
      dialogForm: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        productName: '',
        productCode: '',
        categoryBId: ''
      },
      morePriceData: {
        productStock: '',
        defineNumber: '',
        unitPrice: '',
        deadlineTime: null
      },
      morePriceRules: {
        productStock: [{ type: 'number', required: true, message: '请输入库存量', trigger: 'blur' }],
        defineNumber: [{ type: 'number', required: true, message: '请输入限购量', trigger: 'blur' }],
        unitPrice: [{ type: 'number', required: true, message: '请输入促销价格', trigger: 'blur' }],
        deadlineTime: [{ required: true, message: '请选择截止时间', trigger: 'change' }]
      },
      searchDataList: [],
      parentsName: [],
      selectList: [],
      selectList1: [],
      productList: [],
      dataList: [],
      rowIndex: '',
      cloneItem: {}
    }
  },
  created() {
    this.getDataList();
    this.getAllDataList();
  },
  methods: {
    clearData() {
      this.$refs.morePrice.resetFields();
    },
    searchData() {
      this.postData.pageNum = 1;
      this.checkList = [];
      this.getDataList()
    },
    searchProductList() {
      this.dialogForm.pageNum = 1;
      this.getPromotionsProductList()
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
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 4) {
        return [1, 6];
      } else if (columnIndex > 4 && columnIndex < 10) {
        return [0, 0]
      }
    },
    cellMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        return 'table-expand-border'
      }
    },
    expandTable(row, rows) {
      let expandFlag = rows.indexOf(row) > -1;
      let rowIndex = this.dataList.indexOf(row);
      let hasChilds = this.dataList[rowIndex].childs.length > 0;
      if (expandFlag) {
        this.dataList[rowIndex].expand = true
      } else {
        this.dataList[rowIndex].expand = false
      }
      if (expandFlag && !hasChilds) {
        searchPromotionSkuList({ productBId: row.productBId }).then(res => {
          if (res.data && res.data.length) {
            this.dataList[rowIndex].childs = res.data.map(e => {
              e.editable = false;
              e.loading = false;
              return { ...e }
            })
          } else {
            this.$message.warning('该商品下没有SKU，请去添加SKU')
          }
        }).catch(err => {
          this.$message.error(err.message);
        });
      }
    },
    getPromotionsProductList() {
      let obj = {};
      for (let key in this.dialogForm) {
        if (this.dialogForm[key]) {
          obj[key] = this.dialogForm[key]
        }
      }
      this.listLoading1 = true;
      getPromotionsProductList(obj).then(res => {
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
    openShelf(val) {
      if (!this.checkList.length) {
        return this.$message.warning('请选择数据');
      }
      let text = '';
      if (val === 1) {
        text = '上架';
        for (let i = 0; i < this.checkList.length; i++) {
          if (!this.checkList[i].productStock || !this.checkList[i].unitPrice) {
            return this.$message.warning('不能选择未设置促销价格的SKU上架');
          }
        }
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
            bid: e.bid,
            delFlag: e.delFlag,
            attrValueList: e.attrValueList,
            id: e.id
          };
        });
        let shelfBId = this.checkList.map(e => {
          return e.bid
        });
        updatePromotionShelfSku({ isShelf: val, productSkuList: shelfSku }).then(res => {
          if (res.status === 200) {
            this.$message.success('操作成功');
          }
          this.checkList = [];
          this.dataList.forEach(e => {
            e.childs.forEach(t => {
              if (shelfBId.includes(t.bid)) {
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
      let delSku = row.childs.map(e => e.bid);
      if (selects.indexOf(row) > -1) {
        selects.forEach(e => {
          e.childs.forEach(t => {
            this.checkList = [... new Set(this.checkList.concat(t))]
          })
        });
      } else {
        this.checkList = this.checkList.filter(e => {
          return !delSku.includes(e.bid)
        });
      }
    },
    getSelect1(selects) {
      this.selectList1 = selects;
    },
    deletePromotionProduct() {
      if (!this.checkList.length && !this.selectList.length) {
        return this.$message.warning('请选择要删除的促销商品或促销商品SKU');
      }
      let obj = {
        productBId: this.selectList.map(e => e.productBId).join(','),
        skuBId: this.checkList.map(e => e.bid).join(',')
      };
      this.$confirm('此操作将删除这些促销商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        delPromotionProduct(obj).then(res => {
          this.getDataList();
          this.checkList = [];
          this.selectList = [];
          this.$message.success('删除成功');
        }).catch(err => {
          this.$message.error(err.message)
        });
      }).catch(() => {
      });
    },
    openDialog(scope) {
      if (!scope.row.childs.length) {
        return this.$message.warning('本商品没有SKU,请先添加商品SKU！')
      }
      if (!this.checkList.length) {
        return this.$message.warning('请选择该商品下的sku');
      }
      this.rowIndex = scope.$index;
      this.dialogVisible = true
    },
    openAddDialog() {
      this.dialogForm.pageNum = 1;
      this.getPromotionsProductList();
      this.dialogVisible1 = true;
      this.selectList1 = []
    },
    confirmAdd() {
      if (!this.selectList1.length) {
        return this.$message.warning('请选择要添加的商品')
      }
      this.selectList1.forEach(e => {
        e.productBId = e.bid;
      });
      this.saveLoading = true;
      addPromotionProduct({ promotionsList: this.selectList1 }).then(res => {
        this.$message.success('添加成功');
        this.dialogVisible1 = false;
        this.saveLoading = false;
        this.searchData();
      }).catch(err => {
        this.saveLoading = false;
        this.$message.error(err.message)
      });
    },
    saveSkuPrice(item, rowIndex) {
      let { productStock, defineNumber, unitPrice, deadlineTime } = item;
      if (!item.editable) {
        item.editable = true;
        this.cloneItem = deepClone(item);
      } else {
        if (!productStock || !defineNumber || !unitPrice || !deadlineTime) {
          return this.$message.warning('请先填写完整');
        }
        item.loading = true;
        updatePromotionPriceSku({ productBId: item.productBId, productSkuList: [item] }).then(res => {
          this.$message.success('更新成功');
          this.checkList = [];
          searchPromotionSkuList({ productBId: item.productBId }).then(res => {
            this.dataList[rowIndex].childs = res.data.map(e => {
              e.editable = false;
              e.loading = false;
              return { ...e }
            })
          }).catch(err => {
            this.$message.error(err.message);
          });
        }).catch(err => {
          item = this.cloneItem;
          item.loading = false;
          this.$message.error(err.message)
        })
      }
    },
    setMorePrice(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let shelfSku = this.checkList.map(e => {
            return {
              productBId: e.productBId,
              bid: e.bid,
              attrValueList: e.attrValueList,
              id: e.id,
              productStock: this.morePriceData.productStock,
              defineNumber: this.morePriceData.defineNumber,
              unitPrice: this.morePriceData.unitPrice,
              deadlineTime: this.morePriceData.deadlineTime
            };
          });
          this.dialogLoading = true;
          updatePromotionPriceSku({ productBId: this.dataList[this.rowIndex].productBId, productSkuList: shelfSku }).then(res => {
            this.$message.success('更新成功');
            this.checkList = [];
            searchPromotionSkuList({ productBId: this.dataList[this.rowIndex].productBId }).then(res => {
              this.dataList[this.rowIndex].childs = res.data.map(e => {
                e.editable = false;
                e.loading = false;
                return { ...e }
              })
            }).catch(err => {
              this.$message.error(err.message);
            });
            this.dialogVisible = false;
            this.dialogLoading = false;
          }).catch(err => {
            this.dialogLoading = false;
            this.$message.error(err.message)
          })
        } else {
          this.$message.warning('请填写完整')
        }
      });
    },
    getDataList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key]) {
          obj[key] = this.postData[key]
        }
      }
      promotionPagedList(obj).then(res => {
        this.dataList = res.data.list.map(e => {
          e.childs = [];
          e.expand = false;
          return { ...e }
        });
        this.postData.total = res.data.total;
        this.checkList = [];
      }).catch(err => {
        this.$message.error(err.message);
      });
      this.listLoading = false;
    },
    getAllDataList() {
      getPublicCategory({ pageSize: 999, pageNum: 1 }).then(res => {
        this.searchDataList = res.data.list;
      })
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
  .promotionProduct {
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
        >div {
          flex: 1;
          display: -webkit-flex;
          display: flex;
          >div {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 0 10px;
            word-wrap: break-word;
            word-break: normal;
          }
        }
        .sku-attr {
          flex: 1;
          display: -webkit-flex;
          display: flex;
          >div {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            word-wrap: break-word;
            word-break: normal;
            padding: 0 10px;
          }
        }
        .sku-msg {
          flex: 1;
          display: -webkit-flex;
          display: flex;
          >div {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            word-wrap: break-word;
            word-break: normal;
            padding: 0 10px;
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
