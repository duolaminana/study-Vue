<template>
  <div class="app-container biddingPrice">
    <div class="search-box">
      <el-form label-width="90px" inline size="small">
        <el-form-item label="类目编码">
          <el-input v-model="postData.catalogCode" clearable placeholder="请输入类目编码" style="width: 200px" />
        </el-form-item>
        <el-form-item label="类目名称">
          <el-input v-model="postData.catalogName" clearable placeholder="请输入类目名称" style="width: 200px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchDataList">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="openDialog">新增</el-button>
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
      :indent="indent"
      :header-cell-style="{background: '#a7bfee'}"
      @selection-change="getSelect">
      <el-table-column
        align="center"
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column label="类目编码" prop="catalogCode" show-overflow-tooltip/>

      <el-table-column label="类目名称" prop="catalogName" show-overflow-tooltip/>

      <el-table-column align="center" width="100px" label="修改人" prop="updateUserId" show-overflow-tooltip />

      <el-table-column align="center" width="160px" label="修改时间" prop="updateTime" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.updateTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="90" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="danger" size="mini" @click="deleteCategory(row)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList" ></Pagination>

    <el-dialog :visible.sync="dialogVisible" title="新增竞价类目" center width="500px" @closed="clearData">
      <div>
        <el-input placeholder="输入关键字进行过滤" v-model="filterText" style="margin-bottom: 20px"></el-input>

        <el-tree
          ref="tree"
          :data="addDataList"
          show-checkbox
          node-key="id"
          :props="{value: 'bid', label: 'catalogName', children: 'children'}"
          :filter-node-method="filterNode"
          @check="handleCheckChange">
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" :loading="confirmLoading" @click="confirmAdd">确认</el-button>
        <el-button type="danger" size="small" @click="dialogVisible=false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import {
  getAllPublicCategory,
  addBiddingPrice,
  getBiddingPriceList,
  deleteBiddingPrice
} from '@/api/product'
import { parseTime } from '@/utils/index'
export default {
  components: {
    Pagination
  },
  data() {
    return {
      list: null,
      listLoading: true,
      confirmLoading: false,
      dialogVisible: false,
      filterText: '',
      indent: 20,
      formLine: {
        parentsName: [],
        parentBId: '',
        catalogName: '',
        catalogCode: '',
        catalogStatus: 1,
        parentBIds: ''
      },
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        name: '',
        status: ''
      },
      dataList: [],
      addDataList: [],
      checkList: []
    }
  },
  created() {
    this.getDataList();
  },
  watch: {
    filterText(val) {
      this.$refs.tree.setCheckedKeys([]);
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    clearData() {
      this.checkList = []
    },
    searchDataList() {
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
      getBiddingPriceList(obj).then(res => {
        this.listLoading = false;
        this.dataList = res.data.list;
        this.postData.total = res.data.total;
      }).catch(err => {
        this.$message.error(err.message);
        this.listLoading = false;
      })
    },
    openDialog() {
      this.getPublicCategory()
      this.dialogVisible = true;
    },
    getPublicCategory() {
      getAllPublicCategory().then(res => {
        this.addDataList = res.data || []
      }).catch(err => {
        this.$message.error(err.message);
      })
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.catalogName.indexOf(value) !== -1;
    },
    handleCheckChange(data, checks) {
      this.checkList = checks.checkedNodes.map(e => {
        e.createTime = '';
        e.updateTime = '';
        return { ...e }
      });
    },
    getParentId(arr) {
      if (arr.length) {
        this.formLine.parentBId = arr[arr.length - 1];
        this.formLine.parentBIds = arr.join(',')
      } else {
        this.formLine.parentBId = '';
        this.formLine.parentBIds = ''
      }
    },
    confirmAdd() {
      if (!this.checkList.length) {
        return this.$message.warning('请先选择类目')
      }
      this.confirmLoading = true;
      addBiddingPrice({ pclist: this.checkList }).then(res => {
        this.$message.success('保存成功');
        this.confirmLoading = false;
        this.dialogVisible = false;
        this.postData.pageNum = 1;
        this.getDataList();
      }).catch(err => {
        this.confirmLoading = false;
        this.$message.error(err.message);
      });
    },
    deleteCategory(row) {
      if (row.children && row.children.length) {
        return this.$message.error('存在下级类目，不能删除');
      }
      this.$confirm('此操作将移除该类目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        let obj = { id: row.id };
        deleteBiddingPrice(obj).then(res => {
          this.getDataList();
          this.$message.success('移除成功');
        }).catch(err => {
          this.$message.error(err.message)
        });
      }).catch(() => {
      })
    },
    // 勾选触发 selects为选择的数据数组
    getSelect(selects) {
      console.log(selects)
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
  .biddingPrice {
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
  }
</style>
