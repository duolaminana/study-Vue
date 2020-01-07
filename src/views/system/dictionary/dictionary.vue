<template>
  <div class="app-container roleManagement">
    <div class="search-box">
      <el-form label-width="125px" inline size="small">
        <el-form-item :label="$t('system.dictionary.dictName')">
          <el-input v-model="postData.dictName" clearable :placeholder="$t('system.dictionary.dictName')" style="width: 200px"/>
        </el-form-item>
        <el-form-item :label="$t('system.dictionary.dictLabel')">
          <el-input v-model="postData.dictLabel" clearable :placeholder="$t('system.dictionary.dictLabel')" style="width: 200px"/>
        </el-form-item>
        <el-form-item :label="$t('system.dictionary.dictStatus')">
          <el-select v-model="postData.dictStatus" clearable :placeholder="$t('system.dictionary.dictStatus')" style="width: 200px">
            <el-option v-for="(item, index) in dictList" :label="language === 'zh' ? item.labelZh :item.label" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchData">{{$t('common.search')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="openDialog('add')">{{$t('common.add')}}</el-button>
      <el-button type="primary" size="small" @click="deleteBatchMethod()">{{$t('common.delete')}}</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="正在查询中。。。"
      border
      fit
      size="small"
      :header-cell-style="{background: '#a7bfee'}" @selection-change="getSelect">
      <el-table-column
        align="center"
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column :label="$t('system.dictionary.dictName')" prop="dictName" show-overflow-tooltip/>

      <el-table-column :label="$t('system.dictionary.dictLabel')" width="150" prop="dictLabel" show-overflow-tooltip/>

      <el-table-column :label="$t('system.dictionary.dictRemark')" prop="dictRemark" show-overflow-tooltip/>

      <el-table-column align="center" width="100" :label="$t('system.dictionary.dictStatus')" prop="dictStatus">
        <template slot-scope="scope">
          <el-tag :type="scope.row.dictStatus === 1 ? 'primary' : 'danger' " size="mini">
            {{ scope.row.dictStatus === 1 ? $t('common.table.inUse') : $t('common.table.disabled') }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" width="150" :label="$t('system.dictionary.createTime')" prop="createTime" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.createTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('common.table.actions')" width="175" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" class="export table-btn-width" @click="clickMethod(row.bid,row.dictLabel)">{{$t('common.table.dictionaryValue')}}</el-button>
          <el-button type="primary" size="mini" class="table-btn-width" @click="openDialog('edit', row)">{{$t('common.table.edit')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageIndex" :limit.sync="postData.pageSize" @pagination="getDataList"></Pagination>
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='add'?$t('system.dictionary.addDictionary'):$t('system.dictionary.editDictionary')" center width="600px" @closed="clearData">
      <el-form :model="entity" ref="ruleForm" label-width="135px" label-position="right" size="small" :rules="dictionaryDataRules">
        <el-form-item :label="$t('system.dictionary.dictName')" prop="dictName">
          <el-input v-model="entity.dictName" clearable :placeholder="$t('system.dictionary.dictName')" style="width: 350px"/>
        </el-form-item>
        <el-form-item :label="$t('system.dictionary.dictLabel')" prop="dictLabel">
          <el-input v-model="entity.dictLabel" clearable :placeholder="$t('system.dictionary.dictLabel')" style="width: 350px"/>
        </el-form-item>
        <el-form-item :label="$t('system.dictionary.dictStatus')" prop="dictStatus">
          <el-select v-model="entity.dictStatus" clearable :placeholder="$t('system.dictionary.dictStatus')" style="width: 350px">
            <el-option v-for="(item, index) in dictList" :label="language === 'zh' ? item.labelZh :item.label" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('system.dictionary.dictRemark')">
          <el-input type="textarea" v-model="entity.dictRemark" :autosize="{ minRows: 4, maxRows: 6}" clearable :placeholder="$t('system.dictionary.dictRemark')" style="width: 350px"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" :loading="addLoading" @click="addMethod('ruleForm')">{{$t('common.buttonText.confirm')}}</el-button>
        <el-button type="danger" size="small" @click="closOPenDialog">{{$t('common.buttonText.cancel')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import {
  sysDictionaryPageph,
  sysDictionaryAdd,
  sysDictionaryUpdateById,
  sysDictionaryDeleteById,
  sysDictionaryDeleteByIds
} from '@/api/system'
import treeMenu from '@/mixin/treeMenu'
import { deepClone, parseTime } from '@/utils/index'

export default {
  components: {
    Pagination
  },
  mixins: [treeMenu],
  data() {
    return {
      listLoading: true,
      addLoading: false,
      dialogVisible: false,
      selectList: [],
      dialogType: '',
      indent: 20,
      entity: {
        dictName: '',
        dictLabel: '',
        dictStatus: 1,
        dictRemark: ''
      },
      rowData: {},
      postData: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      dictList: [
        {
          labelZh: '使用中',
          label: 'Active',
          id: 1
        },
        {
          labelZh: '已禁用',
          label: 'Disabled',
          id: 0
        }
      ],
      list: [],
      departmentList: [],
      dictionaryDataRules: {
        dictName: [
          { required: true, message: 'Dictionary Name must be filled in.', trigger: 'blur' }
        ],
        dictLabel: [
          { required: true, message: 'Dictionary Coding must be filled in.', trigger: 'blur' }
        ],
        dictStatus: [
          { required: true, message: 'Please select the Status.', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getDataList();
  },
  methods: {
    // 清空数据
    clearData() {
      this.entity.dictName = '';
      this.entity.dictLabel = '';
      this.entity.dictStatus = 1;
      this.entity.dictRemark = '';
    },
    // 搜索
    searchData() {
      this.postData.pageIndex = 1;
      this.getDataList()
    },
    // 获取数据列表
    getDataList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      sysDictionaryPageph(obj).then(res => {
        this.list = res.data.list || [];
        this.postData.total = res.data.total;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message)
      });
    },
    // 编辑和新增模块
    openDialog(type, row) {
      this.dialogType = type;
      if (type === 'edit') {
        this.entity = deepClone(row);
      }
      this.dialogVisible = true;
    },
    closOPenDialog() {
      this.dialogVisible = false;
    },
    // 勾选触发 selects为选择的数据数组
    getSelect(selects) {
      this.selectList = selects;
    },
    // 具体添加方法
    addMethod(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.entity.id) {
            sysDictionaryUpdateById(this.entity).then(res => {
              this.$message.success('Update Success');
              this.postData.pageIndex = 1;
              this.dialogVisible = false;
              this.getDataList();
              this.closOPenDialog()
            }).catch(err => {
              this.$message.error(err.message)
            });
          } else {
            sysDictionaryAdd(this.entity).then(res => {
              this.$message.success('Save Success');
              this.postData.pageIndex = 1;
              this.dialogVisible = false;
              this.getDataList();
              this.closOPenDialog()
            }).catch(err => {
              this.$message.error(err.message)
            });
          }
        } else {
          this.$message.error("Please fill in the complete.");
        }
      });
    },
    deleteBatchMethod() {
      if (!this.selectList.length) {
        return this.$message('Please Select the Data.');
      }
      this.$confirm('Are you sure to delete?', 'Tips', {
        confirmButtonText: this.$t('common.buttonText.confirm'),
        cancelButtonText: this.$t('common.buttonText.cancel'),
        type: 'warning',
        center: true
      }).then(() => {
        this.deleteIdsForm = this.selectList.map(e => {
          return e.id;
        }).join(",");
        let formData = new FormData();
        formData.append('ids', this.deleteIdsForm)
        sysDictionaryDeleteByIds(formData).then(res => {
          if (res.status === 200) {
            this.$message.success('Delete Success!');
          }
          this.getDataList();
        }).catch(err => {
          this.$message.error(err.message);
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Cancelled operation'
        });
      });
    },
    deleteMethod(row) {
      this.$confirm('Are you sure to delete?', 'Tips', {
        confirmButtonText: this.$t('common.buttonText.confirm'),
        cancelButtonText: this.$t('common.buttonText.cancel'),
        type: 'warning',
        center: true
      }).then(() => {
        let obj = { id: row.id };
        sysDictionaryDeleteById(obj).then(res => {
          this.searchData();
          this.$message.success('Delete Success!');
        }).catch(err => {
          this.$message.error(err.message)
        });
      }).catch(() => {
      });
    },
    clickMethod(bid, dictName) {
      this.$router.push({
        query: {
          bid, dictName
        },
        path: '/system/dictionaryValue'
      })
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      };
      return statusMap[status]
    },
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';

.roleManagement {
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

  .dialogClass {
    .el-dialog {
      width: 500px;
    }
  }
}
</style>
