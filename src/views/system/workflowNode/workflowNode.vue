<template>
  <div class="app-container roleManagement">
    <div class="search-box">
      <el-form label-width="135px" inline size="small">
        <el-form-item :label="$t('system.workflowNode.nodeName')">
          <el-input v-model="postData.nodeName" clearable :placeholder="$t('system.workflowNode.nodeName')" style="width: 200px"/>
        </el-form-item>
        <el-form-item :label="$t('system.workflowNode.nodeType')">
          <el-select v-model="postData.nodeType" clearable :placeholder="$t('system.workflowNode.nodeType')" style="width: 200px">
            <el-option v-for="(item, index) in nodeTypeList" :label="language === 'zh' ? item.labelZh :item.label" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchData">{{$t('common.search')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="openADJNode()">{{$t('common.adjNode')}}</el-button>
      <el-button type="primary" size="small" @click="openDialog('add')">{{$t('common.addNode')}}</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="dataList"
      element-loading-text="正在查询中。。。"
      border
      fit
      size="small"
      :header-cell-style="{background: '#a7bfee'}" @selection-change="getSelect">
      <el-table-column :label="$t('system.workflowNode.sequence')" align="center" prop="sequence" width="55" show-overflow-tooltip/>

      <el-table-column :label="$t('system.workflowNode.nodeName')" prop="nodeName" show-overflow-tooltip/>

      <el-table-column :label="$t('system.workflowNode.nodeType')" prop="nodeType" show-overflow-tooltip>
        <template slot-scope="{row}">
          {{ row.nodeType | nodeTypeName }}
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('common.table.actions')" width="175" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" class="table-btn-width" @click="openDialog('edit', row)">{{$t('common.table.edit')}}</el-button>
          <el-button :type="row.nodeStatus === 1 ? 'info' : 'danger'" size="mini" @click="changeStatus(row)">
            {{row.nodeStatus === 0 ? $t('common.table.close') : $t('common.table.open')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="workflowProcessVisible" title="订单当前触发节点调整" center width="900px">
      <el-form label-width="135px" inline size="small">
        <div>
          <el-form-item label="订单编号">
            <el-input v-model="workflowProcessDate.orderBId" clearable placeholder="订单编号" style="width: 380px" />
          </el-form-item>
          <el-form-item label="订单时间">
            <el-date-picker
              v-model="operateTime"
              type="daterange"
              align="right"
              unlink-panels
              clearable
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 380px"
              @change="getSearchTime">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="export" @click="processSearchData">搜索</el-button>
          </el-form-item>
        </div>
      </el-form>
      <el-table
        :data="workflowProcessList"
        border
        fit
        size="small"
        :header-cell-style="{background: '#a7bfee'}">
        <el-table-column
          align="center"
          type="index"
          width="55">
        </el-table-column>
        <el-table-column align="center" label="订单编号" prop="orderBId" show-overflow-tooltip/>
        <el-table-column align="center" label="订单时间" prop="operateTime" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.updateTime | timeFmt}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="当前" prop="workflowNodeBId" show-overflow-tooltip>
        </el-table-column>
        <!--<el-table-column align="center" label="当前" prop="workflowNodeBId" show-overflow-tooltip>-->
          <!--<el-select clearable placeholder="请选择节点上级" style="width: 350px">-->
            <!--<el-option v-for="(item, index) in dataList" :label="item.nodeName" :value="item.bid" :key="index" >-->
              <!--{{item.nodeName}}-->
            <!--</el-option>-->
          <!--</el-select>-->
        <!--</el-table-column>-->
      </el-table>
      <Pagination :total="workflowProcessDate.total" :page.sync="workflowProcessDate.pageNum" :limit.sync="workflowProcessDate.pageSize" @pagination="selectWorkflowProcessListFun"></Pagination>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='add'?'添加触发点':'编辑触发点'" center width="600px" @closed="clearData">
      <el-form :model="entity" ref="ruleForm" label-width="135px" label-position="right" size="small" :rules="dictionaryDataRules">
        <el-form-item label="英文名称" prop="nodeName">
          <el-input v-model="entity.nodeName" :disabled="Boolean(entity.id)" clearable placeholder="英文名称" style="width: 350px"/>
        </el-form-item>
        <el-form-item label="中文名称" prop="nodeNameCh">
          <el-input v-model="entity.nodeNameCh" :disabled="Boolean(entity.id)" clearable placeholder="中文名称" style="width: 350px"/>
        </el-form-item>
        <el-form-item label="节点编码" prop="triggerPointCode">
          <el-input v-model="entity.triggerPointCode" :disabled="Boolean(entity.id)" clearable placeholder="一旦保存就无法修改" style="width: 350px"/>
        </el-form-item>
        <el-form-item :label="$t('system.workflowNode.nodeType')" prop="nodeType">
          <el-select v-model="entity.nodeType" clearable :placeholder="$t('system.workflowNode.nodeType')" style="width: 350px">
            <el-option v-for="(item, index) in nodeTypeList" :label="language === 'zh' ? item.labelZh :item.label" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="请求URL" prop="nodeRequestUrl">
          <el-input v-model="entity.nodeRequestUrl" clearable placeholder="请求URL" style="width: 350px"/>
        </el-form-item>
        <el-form-item label="节点上级">
          <el-select :disabled="Boolean(entity.id)" v-model="entity.parentNodeBId" clearable placeholder="请选择节点上级" style="width: 350px">
            <el-option v-for="(item, index) in dataList" :label="item.nodeName" :value="item.bid" :key="index" >
              {{item.nodeName}}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="强制">
          <el-radio-group v-model="entity.mandatoryFlag">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('common.table.status')">
          {{ entity.nodeStatus === 0 ? $t('common.table.open') : $t('common.table.close') }}
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
import {
  selectWorkflowNodeListApi,
  updateNodeStatusApi,
  saveWorkflowNodeApi,
  updateWorkflowNodeApi,
  selectWorkflowProcessListApi
} from '@/api/system'
import treeMenu from '@/mixin/treeMenu'
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils/index'
import { deepClone } from '@/utils/index'

export default {
  components: {
    Pagination
  },
  filters: {
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
    },
    nodeTypeName(val) {
      switch (val) {
        // 节点类型( 1-orderFlow-订单流 2-cashFlow-资金流 3-logisticsFlow-物流)
        case 1: return 'Order Flow';
        case 2: return 'Cash Flow';
        case 3: return 'Logistics Flow';
        default:
          return '';
      }
    }
  },
  mixins: [treeMenu],
  data() {
    return {
      listLoading: true,
      orderNodeListLoading: true,
      addLoading: false,
      workflowProcessVisible: false,
      dialogVisible: false,
      selectList: [],
      dialogType: '',
      indent: 20,
      entity: {
        id: '',
        nodeName: '',
        nodeNameCh: '',
        triggerPointCode: '',
        nodeType: 1,
        mandatoryFlag: 0,
        nodeStatus: 0,
        nodeRequestUrl: '',
        parentNodeBId: ''
      },
      postData: {
        nodeName: '',
        nodeType: ''
      },
      workflowProcessDate: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        orderBId: '',
        startTime: '',
        endTime: ''
      },
      operateTime: [],
      workflowProcessList: [],
      nodeTypeList: [
        // 节点类型( 1-orderFlow-订单流 2-cashFlow-资金流 3-logisticsFlow-物流)
        {
          labelZh: '订单流',
          label: 'Order Flow',
          id: 1
        },
        {
          labelZh: '资金流',
          label: 'Cash Flow',
          id: 2
        },
        {
          labelZh: '物流',
          label: 'Logistics Flow',
          id: 3
        }
      ],
      dataList: [],
      departmentList: [],
      dictionaryDataRules: {
        nodeName: [
          { required: true, message: '英文名称不为空', trigger: 'blur' }
        ],
        nodeNameCh: [
          { required: true, message: '中文名称不为空', trigger: 'blur' }
        ],
        triggerPointCode: [
          { required: true, message: '节点编码不为空，一旦保存成功就无法修改', trigger: 'blur' }
        ],
        nodeType: [
          { required: true, message: '请选择流程类型', trigger: 'blur' }
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
      this.entity.id = '';
      this.entity.nodeName = '';
      this.entity.nodeNameCh = '';
      this.entity.triggerPointCode = '';
      this.entity.nodeType = 1;
      this.entity.nodeRequestUrl = '';
      this.entity.parentNodeBId = '';
      this.entity.mandatoryFlag = 0;
      this.entity.nodeStatus = 0;
    },
    // 搜索
    searchData() {
      this.getDataList()
    },
    processSearchData() {
      this.selectWorkflowProcessListFun();
    },
    // 获取数据列表
    getDataList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      selectWorkflowNodeListApi(obj).then(res => {
        this.dataList = res.data || [];
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
    // 节点调整
    openADJNode() {
      this.selectWorkflowProcessListFun();
      this.workflowProcessVisible = true;
    },
    // 分页查询-订单节点信息列表数据
    selectWorkflowProcessListFun() {
      let obj = {};
      for (let key in this.workflowProcessDate) {
        if (this.workflowProcessDate[key] !== '') {
          obj[key] = this.workflowProcessDate[key]
        }
      }
      selectWorkflowProcessListApi(obj).then(res => {
        this.workflowProcessList = res.data.list;
        this.workflowProcessDate.total = res.data.total;
        this.orderNodeListLoading = false;
      }).catch(err => {
        this.orderNodeListLoading = false;
        this.$message.error(err.message)
      });
    },
    getSearchTime(date) {
      if (date && date.length) {
        this.workflowProcessDate.startTime = date[0];
        this.workflowProcessDate.endTime = date[1]
      } else {
        this.workflowProcessDate.startTime = '';
        this.workflowProcessDate.endTime = ''
      }
    },
    // 控制开关
    changeStatus(row) {
      let obj = {
        nodeStatus: row.nodeStatus === 1 ? 0 : 1,
        id: row.id
      };
      updateNodeStatusApi(obj).then(res => {
        this.$message.success(res.message);
        this.getDataList();
      }).catch(err => {
        this.$message.error(err.message)
      });
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
            updateWorkflowNodeApi(this.entity).then(res => {
              this.$message.success('Update Success');
              this.dialogVisible = false;
              this.getDataList();
              this.closOPenDialog()
            }).catch(err => {
              this.$message.error(err.message)
            });
          } else {
            saveWorkflowNodeApi(this.entity).then(res => {
              this.$message.success('Save Success');
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
