<template>
  <div class="app-container roleManagement">
    <div class="search-box">
      <el-form label-width="90px" inline size="small">
        <el-form-item label="通知标题">
          <el-input v-model="postData.noticeTitle" clearable placeholder="请输入模版名称" style="width: 200px"/>
        </el-form-item>
        <el-form-item label="通知类型">
          <el-select v-model="postData.noticeType" clearable placeholder="请选择字典状态" style="width: 200px">
            <el-option v-for="(item, index) in noticeTypeList" :label="item.label" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发送状态">
          <el-select v-model="postData.triggerStatus" clearable placeholder="发送状态" style="width: 200px">
            <el-option v-for="(item, index) in triggerStatusList" :label="item.label" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchData">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="topBtns">
      <!--<el-button type="primary" size="small" @click="deleteBatchMethod()">重新发送</el-button>-->
      <!--<el-button type="primary" size="small" @click="openDialog('add')">导出Excel</el-button>-->
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="正在查询中。。。"
      border
      fit
      size="mini"
      :header-cell-style="{background: '#a7bfee'}" @selection-change="getSelect">
      <el-table-column
        align="center"
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column label="通知标题" prop="noticeTitle" show-overflow-tooltip/>

      <el-table-column align="center" width="150" label="触发点" prop="triggerType" show-overflow-tooltip>
        <template slot-scope="{row}">
          {{ row.triggerType | triggerTypeSwitch }}
        </template>
      </el-table-column>

      <el-table-column align="center" width="150" label="通知类型" prop="noticeType" show-overflow-tooltip>
        <template slot-scope="{row}">
          {{ row.noticeType | noticeTypeSwitch }}
        </template>
      </el-table-column>

      <el-table-column align="center" width="160" label="推送时间" prop="triggerTime">
        <template slot-scope="scope">
          {{scope.row.triggerTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="100" label="阅读状态" prop="readStatus">
        <template slot-scope="scope">
          {{ scope.row.readStatus === '0' ? '未阅读' : '已阅读' }}
        </template>
      </el-table-column>

      <el-table-column align="center" width="100" label="发送状态" prop="triggerStatus">
        <template slot-scope="scope">
          {{ scope.row.triggerStatus === '0' ? '失败' : '成功' }}
        </template>
      </el-table-column>

      <el-table-column align="center" width="70" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" class="export" @click="openDetail(row)">
            查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageIndex" :limit.sync="postData.pageSize"
                @pagination="getDataList"></Pagination>

    <el-dialog :visible.sync="dialogVisible1" title="通知预览" center width="450px">
      <el-form :model="entity" ref="ruleForm" label-width="90px" label-position="right" size="small" :rules="dictionaryDataRules">
        <el-form-item label="通知标题" prop="dictLabel">
          <el-input v-model="entity.noticeTitle" placeholder="请输入模版标题" class="form-dialog-width" disabled/>
        </el-form-item>
        <el-form-item label="通知内容" prop="dictLabel" disabled>
          <el-input type="text" v-model="entity.noticeContent" placeholder="请输入模版内容" class="form-dialog-width" disabled/>
        </el-form-item>
        <el-form-item label="通知附件">
          <div v-for="(item, index) in entity.sysNoticeAnnexList" :key="index">{{item.annexName}}</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="closOPenDialog1">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import {
  pagephNoticeRecording
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
      dialogVisible1: false,
      entity: {
      },
      rowData: {},
      postData: {
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        triggerStatus: '',
        noticeType: '',
        noticeTitle: ''
      },
      noticeTypeList: [
        {
          label: '站内通知',
          id: 0
        },
        {
          label: 'App通知',
          id: 1
        },
        {
          label: '短信通知',
          id: 2
        },
        {
          label: '邮件通知',
          id: 3
        }
      ],
      triggerStatusList: [
        {
          label: '失败',
          id: 0
        },
        {
          label: '成功',
          id: 1
        }
      ],
      list: [],
      departmentList: [],
      dictionaryDataRules: {
        dictName: [
          { required: true, message: '请填写字典名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getDataList();
  },
  methods: {
    clearData() {
      // this.entity.disposeUserStr = [];
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
      pagephNoticeRecording(obj).then(res => {
        this.list = res.data.list || [];
        this.postData.total = res.data.total;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message)
      });
    },
    openDetail(row) {
      this.entity = deepClone(row);
      if (this.entity.noticeType) {
        this.entity.noticeTypeStr = this.entity.noticeType.split(",");
      }
      if (this.entity.templateType === 2) {
        this.showNode = true;
      } else {
        this.showNode = false;
      }
      this.dialogVisible1 = true;
    },
    closOPenDialog1() {
      this.dialogVisible1 = false;
    },
    // 勾选触发 selects为选择的数据数组
    getSelect(selects) {
      this.selectList = selects;
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
    noticeTypeSwitch(val) {
      switch (val) {
        case '0':
          return '站内通知';
        case '1':
          return 'APP通知';
        case '2':
          return '短信通知';
        case '3':
          return '邮件通知';
        default:
          return '未知';
      }
    },
    triggerTypeSwitch(val) {
      switch (val) {
        case '0':
          return '流程触发';
        case '1':
          return '定时任务触发';
        case '2':
          return '其他';
        default:
          return '未知';
      }
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
