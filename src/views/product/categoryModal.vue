<template>
  <div class="app-container categoryModal">
    <div class="search-box">
      <el-form label-width="130px" inline size="small">
        <div>
          <el-form-item :label="$t('product.categoryTemplate.category')">
            <el-cascader
              style="width: 543px"
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
        </div>
        <div>
          <el-form-item :label="$t('product.categoryTemplate.name')">
            <el-input v-model="postData.templateName" clearable placeholder="template name" style="width: 200px" />
          </el-form-item>
          <el-form-item :label="$t('common.status')">
            <el-select v-model="postData.templateStatus" clearable placeholder="select status" style="width: 200px">
              <el-option v-for="(item, index) in statusList" :label="item.label" :value="item.id" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="export" @click="searchModal">{{$t('common.search')}}</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="addModal">{{$t('common.add')}}</el-button>
      <el-button type="primary" size="small" @click="deleteModal">{{$t('common.delete')}}</el-button>
      <!--<el-button type="primary" size="small" class="export">导出excel</el-button>-->
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
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
      <el-table-column :label="$t('product.categoryTemplate.category')" prop="catalogName" show-overflow-tooltip/>

      <el-table-column :label="$t('product.categoryTemplate.code')" prop="templateCode" show-overflow-tooltip/>

      <el-table-column :label="$t('product.categoryTemplate.name')" prop="templateName" show-overflow-tooltip/>

      <el-table-column align="center" width="100px" :label="$t('common.table.updateBy')" prop="updateUserId" show-overflow-tooltip/>

      <el-table-column align="center" width="160px" :label="$t('common.table.updateTime')" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.updateTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="80" :label="$t('common.table.status')" prop="templateStatus">
        <template slot-scope="scope">
          <el-tag :type="scope.row.templateStatus === 1 ? 'primary' : 'danger' " size="mini">
            {{ scope.row.templateStatus === 1 ? $t('common.table.inUse') : $t('common.table.disabled') }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column header-align="center" :label="$t('common.table.actions')" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" class="export" @click="goDetail(row.bid, 'detail')">{{$t('common.table.view')}}</el-button>
          <el-button v-if="row.templateStatus !== 1" type="primary" size="mini" @click="goDetail(row.bid, 'edit')">{{$t('common.table.edit')}}</el-button>
          <el-button :type="row.templateStatus === 1 ? 'info' : 'danger'" size="mini" @click="changeStatus(row)">
            {{row.templateStatus === 1 ? $t('common.table.disable') : $t('common.table.enable')}}
          </el-button>
          <!--<el-button v-if="row.templateStatus !== 1" type="danger" size="mini" @click="deleteModal(row)">删除</el-button>-->
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
  getCategoryModalList,
  deleteCategoryModal,
  enbledCategoryModal
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
        specMoldName: '',
        templateStatus: '',
        ownSpecNo: ''
      },
      selectList: [],
      parentsName: [],
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
      list: []
    }
  },
  created() {
    this.getDataList();
    this.getAllDataList()
    console.log(this.$store.getters.permission_routes)
  },
  methods: {
    addModal() {
      this.$router.push({
        path: '/product/addCategoryModal'
      })
    },
    goDetail(id, type) {
      let path = '';
      if (type === 'edit') {
        path = '/product/addCategoryModal'
      } else {
        path = '/product/detailCategoryModal'
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
        this.postData.catalogBIdList = arr.join(',');
      } else {
        this.postData.catalogBIdList = '';
      }
    },
    changeStatus(row) {
      let obj = {
        templateStatus: row.templateStatus === 1 ? 2 : 1,
        bid: row.bid
      };
      enbledCategoryModal(obj).then(res => {
        this.$message.success('操作成功');
        this.getDataList();
      }).catch(err => {
        this.$message.error(err.message)
      });
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
      getCategoryModalList(obj).then(res => {
        this.list = res.data.list || [];
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
    deleteModal() {
      if (!this.selectList.length) {
        return this.$message.warning('请选择数据删除')
      }
      for (let i = 0; i < this.selectList.length; i++) {
        if (this.selectList[i].templateStatus === 1) {
          return this.$message.warning('只能删除禁用中的数据')
        }
      }
      this.$confirm('此操作将删除该模板, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        let obj = { ids: this.selectList.map(e => e.id).join(',') };
        deleteCategoryModal(obj).then(res => {
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

<style lang="scss">
  @import '~@/styles/variables.scss';
  .categoryModal {
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
