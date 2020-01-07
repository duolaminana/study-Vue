<template>
  <div class="app-container roleManagement">
    <div class="search-box">
      <el-form label-width="150px" inline size="small">
        <el-form-item :label="$t('system.approvalFlow.name')">
          <el-input v-model="postData.approvalName" clearable placeholder="approval name" style="width: 200px"/>
        </el-form-item>
        <el-form-item :label="$t('system.approvalFlow.code')">
          <el-input v-model="postData.approvalCode" clearable placeholder="approval code" style="width: 200px"/>
        </el-form-item>
        <el-form-item :label="$t('system.approvalFlow.status')">
          <el-select v-model="postData.approvalStatus" clearable placeholder="approval status" style="width: 200px">
            <el-option v-for="(item, index) in statusList" :label="language === 'zh' ? item.labelZh : item.label" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <!--        <el-form-item label="创建时间">-->
        <!--          <el-date-picker-->
        <!--            v-model="value2"-->
        <!--            type="daterange"-->
        <!--            align="right"-->
        <!--            unlink-panels-->
        <!--            range-separator="至"-->
        <!--            start-placeholder="开始日期"-->
        <!--            end-placeholder="结束日期"-->
        <!--            :picker-options="pickerOptions">-->
        <!--          </el-date-picker>-->
        <!--        </el-form-item>-->
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
      element-loading-text="loading。。。"
      border
      fit
      size="small"
      :header-cell-style="{background: '#a7bfee'}" @selection-change="getSelect">
      <el-table-column
        align="center"
        type="selection"
        width="55">
      </el-table-column>

      <el-table-column :label="$t('system.approvalFlow.name')" prop="approvalName" show-overflow-tooltip/>

      <el-table-column :label="$t('system.approvalFlow.code')" prop="approvalCode" show-overflow-tooltip/>

      <el-table-column :label="$t('system.approvalFlow.module')" prop="approvalType" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ approvalTypeFilter(scope.row.approvalType) }}
          <!--{{scope.row.approvalType}}-->
        </template>
      </el-table-column>

      <el-table-column :label="$t('common.table.remark')" prop="approvalRemarks" show-overflow-tooltip/>

      <el-table-column align="center" width="80" :label="$t('common.table.status')" prop="approvalStatus">
        <template slot-scope="scope">
          <el-tag :type="scope.row.approvalStatus === 1 ? 'primary' : 'danger' " size="mini">
            {{ scope.row.approvalStatus === 1 ? $t('common.table.inUse') : $t('common.table.disabled') }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('common.table.actions')" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" class="export table-btn-width" @click="clickMethod(row.bid,row.approvalCode,row.approvalName)">
            {{$t('system.approvalFlow.editNode')}}
          </el-button>
          <el-button type="primary" size="mini" class="table-btn-width" @click="openDialog('edit', row)">{{$t('common.table.edit')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageIndex" :limit.sync="postData.pageSize"
                @pagination="getDataList"></Pagination>
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='add'?$t('system.approvalFlow.addFlow'):$t('system.approvalFlow.editFlow')"
               center width="600px">
      <el-form :model="entity" ref="ruleForm" label-width="155px" label-position="right" size="small" :rules="entityDataRules">
        <el-form-item :label="$t('system.approvalFlow.code')" prop="approvalCode">
          <el-input v-model="entity.approvalCode" clearable placeholder="flow code" class="form-dialog-width"/>
        </el-form-item>
        <el-form-item :label="$t('system.approvalFlow.name')" prop="approvalName">
          <el-input v-model="entity.approvalName" clearable placeholder="flow name" class="form-dialog-width"/>
        </el-form-item>
        <el-form-item :label="$t('system.approvalFlow.module')">
          <el-select v-model="entity.approvalType" clearable placeholder="Business module">
            <el-option v-for="(item, index) in approvalTypeList" :label="item.label" :value="item.value" :key="index"></el-option>
          </el-select>
          <!--          <el-input v-model="entity.ownModule" clearable placeholder="请输入所属业务模块" class="form-dialog-width"/>-->
        </el-form-item>
        <el-form-item :label="$t('system.approvalFlow.status')" prop="approvalStatus">
          <el-select v-model="entity.approvalStatus" clearable placeholder="select approval flow status" style="width: 200px">
            <el-option v-for="(item, index) in statusList" :label="language === 'zh' ? item.labelZh : item.label" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('common.table.remark')">
          <el-input type="textarea" v-model="entity.approvalRemarks" clearable placeholder="remark" class="form-dialog-width"/>
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
  approvalFlowPageph,
  approvalFlowAdd,
  approvalFlowUpdateById,
  approvalFlowDeleteByIds,
  selectgetDictionaryBykeyApi
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
      approvalTypeList: [],
      indent: 20,
      entity: {},
      rowData: {},
      postData: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      statusList: [
        {
          label: 'Active',
          labelZh: '正常',
          id: 1
        },
        {
          labelZh: '禁用',
          label: 'Disabled',
          id: 0
        }
      ],
      list: [],
      departmentList: [],
      entityDataRules: {
        approvalCode: [
          { required: true, message: 'Please fill in approval code', trigger: 'blur' }
        ],
        approvalName: [
          { required: true, message: 'Please fill in approval name', trigger: 'blur' }
        ],
        ownModule: [
          { required: true, message: 'Please select approval business module', trigger: 'change' }
        ],
        approvalStatus: [
          { required: true, message: 'Please select approval status', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getApporvalTypeList();
    // this.getDataList()
  },
  methods: {
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
      approvalFlowPageph(obj).then(res => {
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
      } else {
        this.entity = {};
        this.entity.approvalStatus = 1;
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
            approvalFlowUpdateById(this.entity).then(res => {
              this.$message.success('Update success');
              this.postData.pageIndex = 1;
              this.dialogVisible = false;
              this.getDataList();
              this.closOPenDialog()
            }).catch(err => {
              this.$message.error(err.message)
            });
          } else {
            approvalFlowAdd(this.entity).then(res => {
              this.$message.success('Add Success');
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
        return this.$message.warning('Please select the data you want to delete');
      }
      this.$confirm('This action will delete the data and continue?', 'Tips', {
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
        approvalFlowDeleteByIds(formData).then(res => {
          if (res.status === 200) {
            this.$message.success('Delete Success!');
          }
          this.getDataList();
        }).catch(err => {
          this.$message.error(err.message);
        });
      }).catch(() => {
      });
    },
    getApporvalTypeList() {
      selectgetDictionaryBykeyApi({ key: 'approval_type' }).then(res => {
        this.approvalTypeList = res.data || [];
        this.getDataList()
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    clickMethod(bid, approvalCode, approvalName) {
      this.$router.push({
        query: {
          bid, approvalCode, approvalName
        },
        path: '/system/approvalFlowNode'
      })
    },
    approvalTypeFilter(type) {
      let obj = this.approvalTypeList.filter(e => e.value === type)[0];
      if (obj == null) {
        return;
      }
      return obj.label;
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
