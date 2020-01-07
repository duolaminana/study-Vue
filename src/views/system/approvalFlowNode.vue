<template>
  <div class="app-container roleManagement">
    <div class="search-box">
      <el-form label-width="150px" inline size="small">
        <el-form-item v-show="false">
          <el-input v-model="postData.approvalBid"/>
        </el-form-item>
        <el-form-item :label="$t('system.approvalFlow.code')">
          <el-input v-model="postData.approvalCode" style="width: 200px" readonly/>
        </el-form-item>
        <el-form-item :label="$t('system.approvalFlow.name')">
          <el-input v-model="postData.approvalName" style="width: 200px" readonly/>
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
      <el-table-column :label="$t('system.approvalFlow.nodeCode')" prop="nodeCode" show-overflow-tooltip/>
      <el-table-column :label="$t('system.approvalFlow.nodeName')" prop="nodeName" show-overflow-tooltip/>
      <el-table-column align="center" :label="$t('system.approvalFlow.approvalBy')" prop="disposeUserView" show-overflow-tooltip/>
      <el-table-column align="center" :label="$t('system.approvalFlow.nodeLevel')" width="150" prop="nodeLevel"/>
      <el-table-column align="center" :label="$t('common.table.status')" width="100" prop="nodeStatus">
        <template slot-scope="scope">
          <el-tag :type="scope.row.nodeStatus === 1 ? 'primary' : 'danger' " size="mini">
            {{ scope.row.nodeStatus === 1 ? $t('common.table.inUse') : $t('common.table.disabled') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('common.table.actions')" width="90" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="openDialog('edit', row)">{{$t('common.table.edit')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageIndex" :limit.sync="postData.pageSize"
                @pagination="getDataList"></Pagination>
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='add'?$t('system.approvalFlow.addFlowNode'):$t('system.approvalFlow.editFlowNode')" center width="600px">
      <el-form :model="entity" ref="ruleForm" label-width="155px" label-position="right" size="small" :rules="entityDataRules">
        <el-form-item :label="$t('system.approvalFlow.nodeCode')" prop="nodeCode">
          <el-input v-model="entity.nodeCode" clearable placeholder="node code" class="form-dialog-width"/>
        </el-form-item>
        <el-form-item :label="$t('system.approvalFlow.nodeName')" prop="nodeName">
          <el-input v-model="entity.nodeName" clearable placeholder="node name" class="form-dialog-width"/>
        </el-form-item>
        <el-form-item :label="$t('system.approvalFlow.isLogic')" prop="isLogic">
          <el-select v-model="entity.isLogic" clearable placeholder="treatment conditions" style="width: 300px">
            <el-option v-for="(item, index) in logicList" :label="item.label" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('system.approvalFlow.nodeHandler')" prop="disposeUserList">
          <el-select v-model="entity.disposeUserList" readonly multiple placeholder="Node Handler" class="form-dialog-width" @change="getChangeUser" style="width: 300px">
            <el-option v-for="(item, index) in userList" :label="item.userName" :value="item.accountBId" :key="index"></el-option>
          </el-select>
          <!--          <el-input v-model="entity.nodeName" clearable placeholder="请输入字典唯一编码" class="form-dialog-width"/>-->
        </el-form-item>
        <el-form-item :label="$t('system.approvalFlow.nodeLevel')" prop="nodeLevel">
          <el-input v-model.number="entity.nodeLevel" clearable type="number" :min="1" :precision="1" placeholder="Node hierarchy" class="form-dialog-width"/>
        </el-form-item>
        <el-form-item :label="$t('system.approvalFlow.nodeStatus')" prop="nodeStatus">
          <el-select v-model="entity.nodeStatus" clearable placeholder="node status" style="width: 300px">
            <el-option v-for="(item, index) in statusList" :label="language === 'zh' ? item.labelZh : item.label" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('common.table.remark')">
          <el-input type="textarea" v-model="entity.nodeRemarks" clearable placeholder="remark" class="form-dialog-width"/>
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
  approvalFlowNodePageph,
  approvalFlowNodeAdd,
  approvalFlowNodeUpdateById,
  // approvalFlowNodeDeleteById,
  approvalFlowNodeDeleteByIds,
  selectUserAccountListAllApi
} from '@/api/system'
import treeMenu from '@/mixin/treeMenu'
import { parseTime } from '@/utils/index'

export default {
  components: {
    Pagination
  },
  mixins: [treeMenu],
  data() {
    return {
      bid: "",
      approvalName: '',
      listLoading: true,
      addLoading: false,
      userList: [],
      dialogVisible: false,
      selectList: [],
      dialogType: '',
      indent: 20,
      entity: {
        disposeUserList: [],
        disposeUserStr: '',
        approvalBId: '',
        bid: '',
        createTime: '',
        createUserId: '',
        delFlag: 0,
        disposeUserView: '',
        id: 0,
        isLogic: 0,
        nodeCode: '',
        nodeLevel: 0,
        nodeName: '',
        nodeRemarks: '',
        nodeStatus: 0,
        parentBId: '',
        updateTime: '',
        updateUserId: ''
      },
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
          label: 'Disabled',
          labelZh: '禁用',
          id: 0
        }
      ],
      logicList: [
        {
          label: 'or',
          id: 1
        },
        {
          label: 'and',
          id: 2
        }
      ],
      list: [],
      departmentList: [],
      entityDataRules: {
        nodeCode: [
          { required: true, message: 'Please fill in node code', trigger: 'blur' }
        ],
        nodeName: [
          { required: true, message: 'Please fill in node name', trigger: 'blur' }
        ],
        isLogic: [
          { required: true, message: 'Please select the treatment conditions', trigger: 'change' }
        ],
        disposeUserList: [
          { required: true, message: 'Please select the node handler', trigger: 'change' }
        ],
        nodeLevel: [
          { required: true, message: 'Please fill in node hierarchy', trigger: 'blur' }
        ],
        nodeStatus: [
          { required: true, message: 'Please select the node status', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.bid = this.$route.query.bid;
    this.approvalName = this.$route.query.approvalName;
    this.postData.approvalCode = this.$route.query.approvalCode;
    this.postData.approvalBid = this.bid;
    this.postData.approvalName = this.approvalName;
    this.getDataList();
    this.getUserList();
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
      approvalFlowNodePageph(obj).then(res => {
        this.list = res.data.list || [];
        this.postData.total = res.data.total;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message)
      });
    },
    getUserList() {
      let obj = {};
      selectUserAccountListAllApi(obj).then(res => {
        this.userList = res.data;
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 编辑和新增模块
    openDialog(type, row) {
      this.dialogType = type;
      if (type === 'edit') {
        this.entity.disposeUserList = [];
        this.entity = Object.assign(this.entity, row);
      } else {
        this.entity = { disposeUserList: [], disposeUserStr: '' };
        this.entity.dictStatus = 1;
        this.entity.approvalBId = this.bid;
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
            approvalFlowNodeUpdateById(this.entity).then(res => {
              this.$message.success('Update Success');
              this.postData.pageIndex = 1;
              this.dialogVisible = false;
              this.getDataList();
              this.closOPenDialog()
            }).catch(err => {
              this.$message.error(err.message)
            });
          } else {
            // this.$refs["ruleForm"].validate((valid) => {
            //   if (valid) {、
            approvalFlowNodeAdd(this.entity).then(res => {
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
        approvalFlowNodeDeleteByIds(formData).then(res => {
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
    clickMethod(bid, dictName) {
      this.$router.push({
        query: {
          bid, dictName
        },
        path: '/system/dictionaryValue'
      })
    },
    // 常用语言转为字符
    getChangeUser(arr) {
      if (arr.length) {
        this.entity.disposeUserStr = arr.join(',')
      } else {
        this.entity.disposeUserStr = ''
      }
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
