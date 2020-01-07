<template>
  <div class="app-container roleManagement">
    <div class="search-box">
      <el-form label-width="90px" inline size="small">
        <el-form-item label="模版名称">
          <el-input v-model="postData.templateName" clearable placeholder="请输入模版名称" style="width: 200px"/>
        </el-form-item>
        <el-form-item label="模板类型">
          <el-select v-model="postData.templateType" clearable placeholder="请选择字典状态" style="width: 200px">
            <el-option v-for="(item, index) in noticeTypeList" :label="item.label" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchData">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="openDialog('add')">新增</el-button>
      <el-button type="primary" size="small" @click="deleteBatchMethod()">删除</el-button>
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
      <el-table-column label="模版名称" prop="templateName" show-overflow-tooltip/>

      <el-table-column label="模版编码" prop="templateCode" show-overflow-tooltip/>

      <el-table-column label="模版类型" prop="templateType" show-overflow-tooltip>
        <template slot-scope="{row}">
          {{ row.templateType | noticeTypeSwitch }}
        </template>
      </el-table-column>

      <el-table-column align="center" width="160" label="修改时间" prop="updateTime">
        <template slot-scope="scope">
          {{scope.row.updateTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="100" label="状态" prop="dictStatus">
        <template slot-scope="scope">
          <el-tag :type="scope.row.templateStatus === 1 ? 'primary' : 'danger' " size="mini">{{ scope.row.templateStatus
            === 1 ?
            '打开' : '关闭' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="180" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" class="export" @click="openDetail(row)">
            查看
          </el-button>
          <el-button type="primary" size="mini" @click="openDialog('edit', row)">编辑</el-button>
          <el-button v-if="row.templateStatus === 1" type="info" size="mini" @click="enableNoticeTemplateMethod(row.id)">
            禁用
          </el-button>
          <el-button v-if="row.templateStatus === 0" type="danger" size="mini" @click="enableNoticeTemplateMethod(row.id)">
            启用
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageIndex" :limit.sync="postData.pageSize"
                @pagination="getDataList"></Pagination>
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='add'?'新增通知模版':'编辑通知模版'" center width="700px" @close="clearData">
      <el-form :model="entity" ref="ruleForm" label-width="80px" label-position="left" size="small" :rules="dictionaryDataRules">
        <el-form-item label="模版名称" prop="templateName">
          <el-input v-model="entity.templateName" clearable placeholder="请输入模版名称" class="form-dialog-width"/>
        </el-form-item>
        <el-form-item label="模版编码" prop="templateCode">
          <el-input v-model="entity.templateCode" clearable placeholder="请输入模版编码" class="form-dialog-width"/>
        </el-form-item>
        <el-form-item label="模版类型" prop="templateType">
          <el-select v-model="entity.templateType" clearable placeholder="请选择模版类型" style="width: 300px" @change="changeType">
            <el-option v-for="(item, index) in noticeTypeList" :label="item.label" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item v-show="showNode" label="触发点" prop="nodeBId">
              <el-select v-model="entity.nodeBId" clearable placeholder="请选择触发点" style="width: 100%">
                <el-option v-for="(item, index) in noticeNodeBidList" :label="item.nodeNameCh" :value="item.bid" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-show="showNode" label="驱动时间" prop="nodeWhen">
              <el-select v-model="entity.nodeWhen" clearable placeholder="请选择模版类型" style="width: 100%">
                <el-option label="节点前" :value="1"></el-option>
                <el-option label="节点后" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="通知类型" prop="noticeTypeStr">
          <el-checkbox-group v-model="entity.noticeTypeStr" @change="getCheckBoxVal">
            <el-checkbox label="0">站内通知</el-checkbox>
            <el-checkbox label="1">APP通知</el-checkbox>
            <el-checkbox label="2">短信通知</el-checkbox>
            <el-checkbox label="3">邮件通知</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="通知标题" prop="noticeTitle">
          <el-input v-model="entity.noticeTitle" clearable placeholder="请输入通知标题" class="form-dialog-width"/>
        </el-form-item>
        <el-form-item label="通知内容" prop="noticeContent">
          <el-input type="textarea" v-model="entity.noticeContent" :autosize="{ minRows: 4, maxRows: 6}" clearable placeholder="请输入通知内容" style="width: 100%"/>
        </el-form-item>
        <!--        <el-form-item label="通知附件">-->
        <!--          <el-input type="textarea" v-model="entity.dictRemark" clearable placeholder="请输入字典备注" class="form-dialog-width"/>-->
        <!--        </el-form-item>-->
        <el-form-item label="附件：" style="width: 500px">
          <my-upload
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :file-list="entity.sysNoticeAnnexList">
          </my-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" :loading="addLoading" @click="addMethod('ruleForm')">确认</el-button>
        <el-button type="danger" size="small" @click="closeOPenDialog">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisible1" title="通知模版详情" center width="700px">
      <el-form :model="entity" ref="ruleForm" label-width="80px" label-position="left" size="small" :rules="dictionaryDataRules">
        <el-form-item label="模版名称" prop="templateName">
          <el-input v-model="entity.templateName" placeholder="请输入模版名称" disabled class="form-dialog-width"/>
        </el-form-item>
        <el-form-item label="模版编码" prop="templateCode">
          <el-input v-model="entity.templateCode" placeholder="请输入模版编码" disabled class="form-dialog-width"/>
        </el-form-item>
        <el-form-item label="模版类型" prop="templateType">
          <el-select v-model="entity.templateType" clearable placeholder="请选择模版类型" style="width: 300px" disabled>
            <el-option v-for="(item, index) in noticeTypeList" :label="item.label" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item v-show="showNode" label="触发点" prop="nodeBId">
              <el-select v-model="entity.nodeBId" clearable placeholder="请选择触发点" disabled style="width: 100%">
                <el-option v-for="(item, index) in noticeNodeBidList" :label="item.nodeNameCh" :value="item.bid" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-show="showNode" label="驱动时间" prop="nodeWhen">
              <el-select v-model="entity.nodeWhen" clearable placeholder="请选择模版类型" disabled style="width: 100%">
                <el-option label="节点前" :value="1"></el-option>
                <el-option label="节点后" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="通知类型" prop="noticeTypeStr" disabled>
          <el-checkbox-group v-model="entity.noticeTypeStr" @change="getCheckBoxVal">
            <el-checkbox label="0">站内通知</el-checkbox>
            <el-checkbox label="1">APP通知</el-checkbox>
            <el-checkbox label="2">短信通知</el-checkbox>
            <el-checkbox label="3">邮件通知</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="通知标题" prop="dictLabel">
          <el-input v-model="entity.noticeTitle" placeholder="请输入模版标题" class="form-dialog-width" disabled/>
        </el-form-item>
        <el-form-item label="通知内容" prop="dictLabel" disabled>
          <el-input v-model="entity.noticeContent" type="textarea" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入模版内容" disabled style="width: 100%"/>
        </el-form-item>
        <el-form-item label="通知附件">
          <div v-for="(item, index) in entity.sysNoticeAnnexList" :key="index">
            {{item.annexName}}
            <el-button type="primary" size="mini" style="margin-left: 20px" @click="downLoadFile(item.annexPath, item.annexName)">下载</el-button>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="closeOPenDialog1">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import MyUpload from '@/components/MyUpload'
import {
  pagephNoticeTemplate,
  selectControlTowerByTypeList,
  saveNoticeTemplate,
  updateNoticeTemplate,
  deleteNoticeTemplate,
  deleteBatchNoticeTemplate,
  enableNoticeTemplate
} from '@/api/system'
import treeMenu from '@/mixin/treeMenu'
import { deepClone, parseTime } from '@/utils/index'

export default {
  components: {
    Pagination,
    MyUpload
  },
  mixins: [treeMenu],
  data() {
    return {
      listLoading: true,
      addLoading: false,
      dialogVisible: false,
      dialogVisible1: false,
      selectList: [],
      dialogType: '',
      indent: 20,
      showNode: false,
      entity: {
        bid: "",
        id: "",
        nodeBId: "",
        nodeWhen: "",
        noticeContent: "",
        noticeTitle: "",
        noticeType: "",
        noticeTypeStr: [],
        templateCode: "",
        templateName: "",
        templateStatus: 0,
        templateType: "",
        sysNoticeAnnexList: []
      },
      rowData: {},
      postData: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      noticeNodeBidList: [],
      noticeTypeList: [
        {
          label: '系统模板',
          id: 0
        },
        {
          label: '定制',
          id: 1
        },
        {
          label: '节点',
          id: 2
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
    this.selectControlTowerByTypeListMethod();
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
      pagephNoticeTemplate(obj).then(res => {
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
        this.entity = Object.assign(this.entity, row);
        if (this.entity.noticeType) {
          this.entity.noticeTypeStr = this.entity.noticeType.split(",");
        }
        if (this.entity.templateType === 2) {
          this.showNode = true;
        } else {
          this.showNode = false;
        }
        this.entity.sysNoticeAnnexList.forEach(e => {
          e.url = e.annexPath;
          e.name = e.annexName
        })
      } else {
        this.showNode = false;
        this.entity = {
          bid: "",
          id: "",
          nodeBId: "",
          nodeWhen: "",
          noticeContent: "",
          noticeTitle: "",
          noticeType: "",
          noticeTypeStr: [],
          templateCode: "",
          templateName: "",
          templateStatus: 0,
          templateType: "",
          sysNoticeAnnexList: []
        };
        // this.entity.dictStatus = 1;
      }
      this.dialogVisible = true;
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
    closeOPenDialog() {
      this.dialogVisible = false;
    },
    closeOPenDialog1() {
      this.dialogVisible1 = false;
    },
    // 勾选触发 selects为选择的数据数组
    getSelect(selects) {
      this.selectList = selects;
    },
    downLoadFile(url, name) {
      // window.open(url);
      const form = document.createElement('a');
      form.setAttribute("download", name);
      form.setAttribute("href", url);
      document.body.appendChild(form);
      form.click();
      document.body.removeChild(form)
    },
    // 具体添加方法
    addMethod(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.entity.id) {
            updateNoticeTemplate(this.entity).then(res => {
              this.$message.success('更新成功');
              this.postData.pageIndex = 1;
              this.dialogVisible = false;
              this.getDataList();
              this.closeOPenDialog()
            }).catch(err => {
              this.$message.error(err.message)
            });
          } else {
            saveNoticeTemplate(this.entity).then(res => {
              this.$message.success('新增成功');
              this.postData.pageIndex = 1;
              this.dialogVisible = false;
              this.getDataList();
              this.closeOPenDialog()
            }).catch(err => {
              this.$message.error(err.message)
            });
          }
        } else {
          this.$message.error("验证未通过");
        }
      });
    },
    deleteBatchMethod() {
      if (!this.selectList.length) {
        return this.$message('请选择数据');
      }
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteIdsForm = this.selectList.map(e => {
          return e.id;
        }).join(",");
        let formData = new FormData();
        formData.append('ids', this.deleteIdsForm)
        deleteBatchNoticeTemplate(formData).then(res => {
          if (res.status === 200) {
            this.$message.success('操作成功!');
          }
          this.getDataList();
        }).catch(err => {
          this.$message.error(err.message);
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    },
    deleteMethod(row) {
      this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let obj = { id: row.id };
        deleteNoticeTemplate(obj).then(res => {
          this.searchData();
          this.$message.success('删除成功');
        }).catch(err => {
          this.$message.error(err.message)
        });
      }).catch(() => {
      });
    },
    selectControlTowerByTypeListMethod() {
      let obj = { nodeType: 1 };
      selectControlTowerByTypeList(obj).then(res => {
        this.noticeNodeBidList = res.data;
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    enableNoticeTemplateMethod(id) {
      let obj = { id: id };
      enableNoticeTemplate(obj).then(res => {
        this.getDataList();
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    getCheckBoxVal(arr) {
      if (arr && arr.length) {
        this.entity.noticeType = arr.join(',')
      } else {
        this.entity.noticeType = ''
      }
    },
    changeType(arr) {
      if (arr === 2) {
        this.showNode = true;
      } else {
        this.entity.nodeBId = '';
        this.entity.nodeWhen = '';
        this.showNode = false;
      }
    },
    // 上传文件组件方法：handleRemove、handleSuccess
    handleRemove(file, fileList) {
      this.entity.sysNoticeAnnexList = fileList.map(e => {
        e.annexName = e.annexName || e.name;
        e.annexPath = e.annexPath || e.response.data.filePath;
        return { ...e }
      });
    },
    handleSuccess(res, file, fileList) {
      this.entity.sysNoticeAnnexList = fileList.map(e => {
        e.annexName = e.annexName || e.name;
        e.annexPath = e.annexPath || e.response.data.filePath;
        return { ...e }
      });
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
        case 0:
          return '系统模版';
        case 1:
          return '定制模版';
        case 2:
          return '节点模版';
        default:
          return '未知模版';
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
