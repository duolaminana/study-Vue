<template>
  <div class="app-container noticeTack">
    <div class="search-box">
      <el-form label-width="100px" inline size="small">
        <div>
          <el-form-item label="任务名称">
            <el-input v-model="postData.taskName" clearable placeholder="请输入任务名称" style="width: 200px" />
          </el-form-item>
          <el-form-item label="任务时间">
            <el-date-picker
              v-model="customTime"
              type="daterange"
              align="right"
              unlink-panels
              clearable
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 380px"
              :picker-options="pickerOptions"
              @change="getSearchTime">
            </el-date-picker>
          </el-form-item>
          <el-form-item style="padding-left: 110px;">
            <el-button type="primary" class="export" @click="searchData">搜索</el-button>
          </el-form-item>
        </div>
        <div>
        </div>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="openEdit('add')">新增</el-button>
      <el-button type="primary" size="small" @click="deleteListByIds">删除</el-button>
      <!--<el-button type="primary" size="small" class="export">导出excel</el-button>-->
    </div>
    <el-table
      v-loading="listLoading"
      :data="dataList"
      element-loading-text="正在查询中。。。"
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

      <el-table-column min-width="150" label="任务名称" prop="taskName" show-overflow-tooltip >
        <template slot-scope="{row}">
          {{row.taskName || '无'}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="160" label="开始时间" prop="runBeginTime">
        <template slot-scope="scope">
          {{scope.row.runBeginTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="160" label="终止时间" prop="runEndTime">
        <template slot-scope="scope">
          {{scope.row.runEndTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="150" label="修改人" prop="updateUserName" show-overflow-tooltip/>

      <el-table-column align="center" width="160" label="修改时间" prop="updateTime">
        <template slot-scope="scope">
          {{scope.row.updateTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="100" label="状态" prop="customStatus">
        <template slot-scope="{row}">
          <el-tag :type="(row.taskStatus === 0 ) ? 'danger' : 'primary'" size="mini">{{row.taskStatus | statusFmt}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column header-align="center" label="操作" width="120" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" class="export" @click="detailDialog(row)">查看</el-button>
          <el-button type="primary" size="mini" v-if="row.taskStatus === 0" @click="openEdit('edit', row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList" ></Pagination>

    <el-dialog :visible.sync="detailVisible" title="查看任务" center class="menuDialog" width="1000px" @closed="clearData">
      <el-form ref="addDepartment" :model="taskData" label-width="70px" label-position="left" size="small">
        <el-form-item label="任务名称" prop="taskName">
          <el-input v-model="taskData.taskName" readonly placeholder="任务名称" class="form-dialog-width" />
        </el-form-item>

        <el-form-item label="执行时间" prop="selectTime">
          <el-date-picker
            v-model="taskData.selectTime"
            readonly
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="时间间隔" prop="timeInterval">
          <el-input v-model="taskData.timeInterval" readonly placeholder="时间间隔" class="form-dialog-width" />
        </el-form-item>

        <el-form-item label="模版名称" prop="templateBId">
          <el-select v-model="taskData.templateBId" readonly placeholder="请选择模版名称" class="form-dialog-width">
            <el-option v-for="(item, index) in templateList" disabled :label="item.templateName" :value="item.bid" :key="index"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态" prop="taskStatus">
          <el-select v-model="taskData.taskStatus" readonly placeholder="请选择状态" class="form-dialog-width">
            <el-option v-for="(item, index) in statusList" disabled :label="item.label" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="接收方" style="border-top: 1px solid #ccc; padding-top: 10px">
<!--          <el-button type="primary" size="small" class="export" style="margin-bottom: 10px" @click="openUserDialog">选择接收方</el-button>-->
        </el-form-item>
      </el-form>
      <el-table
        :data="sendList"
        border
        fit
        size="mini"
        max-height="900"
        :header-cell-style="{background: '#a7bfee'}">
        <!--            <el-table-column-->
        <!--              align="center"-->
        <!--              type="index"-->
        <!--              label="序号"-->
        <!--              width="55">-->
        <!--            </el-table-column>-->

        <el-table-column align="center" label="公司名" prop="companyName" />

        <el-table-column align="center" label="账号" prop="userAccount" />

        <el-table-column align="center" min-width="100" label="名称" prop="userName"/>

        <el-table-column align="center" min-width="100" label="邮箱" prop="userEmail"/>

        <el-table-column align="center" min-width="100" label="账户类型" prop="userType">
          <template slot-scope="scope">
            {{scope.row.userType === 1 ? '客户' : '供应商'}}
          </template>
        </el-table-column>

        <!--            <el-table-column align="center" label="操作" width="90" class-name="small-padding fixed-width">-->
        <!--              <template slot-scope="scope">-->
        <!--                <el-button type="danger" size="mini" class="export" @click="deleteSend(scope.$index)">删除</el-button>-->
        <!--              </template>-->
        <!--            </el-table-column>-->
      </el-table>
      <Pagination :total="sendListData.total" :page.sync="sendListData.pageNum" :limit.sync="sendListData.pageSize" @pagination="getSendListData(taskData.bid)" ></Pagination>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="detailVisible=false">关闭</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="editVisible" :title="dialogType==='add'?'新增任务':'编辑任务'" center :close-on-click-modal="false" class="menuDialog" width="1000px" @closed="clearData">
      <el-form ref="addDepartment" :model="taskData" label-width="90px" label-position="left" size="small" :rules="taskDataRules">
        <el-form-item label="任务名称" prop="taskName">
          <el-input v-model="taskData.taskName" clearable placeholder="任务名称" class="form-dialog-width" />
        </el-form-item>

        <el-form-item label="执行时间" prop="selectTime">
          <el-date-picker
            v-model="taskData.selectTime"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="getSelectTime"
            align="right">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="时间间隔" prop="timeInterval">
          <el-input v-model.number="taskData.timeInterval" clearable placeholder="time interval" class="form-dialog-width" />
        </el-form-item>

        <el-form-item label="模版名称" prop="templateBId">
          <el-select v-model="taskData.templateBId" placeholder="请选择模版名称" class="form-dialog-width">
            <el-option v-for="(item, index) in templateList" :label="item.templateName" :value="item.bid" :key="index"></el-option>
          </el-select>
        </el-form-item>

<!--        <el-form-item label="状态" prop="taskStatus">-->
<!--          <el-select v-model="taskData.taskStatus" clearable placeholder="请选择状态" class="form-dialog-width">-->
<!--            <el-option v-for="(item, index) in statusList" :label="item.label" :value="item.id" :key="index"></el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->

        <el-form-item label="选择接收方" style="border-top: 1px solid #ccc; padding-top: 10px">
          <el-button type="primary" size="small" class="export" style="margin-bottom: 10px" @click="openUserDialog">选择接收方</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="sendList"
        border
        fit
        size="mini"
        max-height="1000"
        :header-cell-style="{background: '#a7bfee'}">
        <!--            <el-table-column-->
        <!--              align="center"-->
        <!--              type="index"-->
        <!--              width="55">-->
        <!--            </el-table-column>-->

        <el-table-column align="center" label="公司名" prop="companyName" />

        <el-table-column align="center" label="账号" prop="userAccount" />

        <el-table-column align="center" min-width="100" label="名称" prop="userName"/>

        <el-table-column align="center" min-width="100" label="邮箱" prop="userEmail"/>

        <el-table-column align="center" min-width="100" label="账户类型" prop="userType">
          <template slot-scope="scope">
            {{scope.row.userType === 1 ? '客户' : '供应商'}}
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="90" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="deleteSend(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :visible.sync="editVisible1" title="选择接收人" center :close-on-click-modal="false" append-to-body width="1000px">
        <el-form :model="dialogSearchData" label-width="100px" label-position="right" size="small" inline>
          <el-form-item label="用户类型">
            <el-select v-model="dialogSearchData.userType" placeholder="请选择用户类型" style="width: 180px">
              <el-option label="客户" :value="1"></el-option>
              <el-option label="供应商" :value="2"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="客户名称" v-if="dialogSearchData.userType === 1">
            <el-input v-model="dialogSearchData.customerName" clearable placeholder="请输入用户名称" style="width: 180px" />
          </el-form-item>

          <el-form-item label="客户编码" v-if="dialogSearchData.userType === 1">
            <el-input v-model="dialogSearchData.customerCode" clearable placeholder="请输入用户编码" style="width: 180px" />
          </el-form-item>

          <el-form-item label="客户邮箱" v-if="dialogSearchData.userType === 1">
            <el-input v-model="dialogSearchData.customerEmailAddress" clearable placeholder="请输入用户邮箱" style="width: 180px" />
          </el-form-item>

          <el-form-item label="供应商名称" v-if="dialogSearchData.userType === 2">
            <el-input v-model="dialogSearchData.supplierName" clearable placeholder="请输入用户名称" style="width: 180px" />
          </el-form-item>

          <el-form-item label="供应商编码" v-if="dialogSearchData.userType === 2">
            <el-input v-model="dialogSearchData.supplierCode" clearable placeholder="请输入用户编码" style="width: 180px" />
          </el-form-item>

          <el-form-item label="供应商邮箱" v-if="dialogSearchData.userType === 2">
            <el-input v-model="dialogSearchData.supplierEmailAddress" clearable placeholder="请输入用户邮箱" style="width: 180px" />
          </el-form-item>

          <el-form-item label="用户公司">
            <el-input v-model="dialogSearchData.companyName" clearable placeholder="请输入用户公司" style="width: 180px" />
          </el-form-item>

          <el-form-item label="用户国家">
            <el-input v-model="dialogSearchData.countryCode" clearable placeholder="请输入国家名称" style="width: 180px" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" size="small" class="export" @click="userSearch(dialogSearchData.userType)">搜索</el-button>
          </el-form-item>
        </el-form>
        <div>
          <el-table
            ref="multipleTable"
            :data="userList"
            border
            fit
            size="mini"
            :header-cell-style="{background: '#a7bfee'}"
            @selection-change="getDialogSelect">
            <el-table-column
              label="序号"
              type="selection"
              width="50">
            </el-table-column>

<!--            <el-table-column-->
<!--              label="序号"-->
<!--              type="index"-->
<!--              width="50">-->
<!--            </el-table-column>-->

            <el-table-column align="center" label="国家" prop="countryCode" />

            <el-table-column align="center" min-width="100" label="公司" prop="companyName"/>

            <el-table-column align="center" min-width="100" label="账户" prop="userAccount"/>

            <el-table-column align="center" min-width="100" label="名称" prop="contactName">
              <template slot-scope="scope">
                {{scope.row.contactName}}
              </template>
            </el-table-column>

            <el-table-column align="center" min-width="100" label="邮箱" prop="userEmail"/>

            <el-table-column align="center" min-width="100" label="账户类型" prop="userType">
              <template slot-scope="scope">
                {{scope.row.userType === 1 ? '客户' : '供应商'}}
              </template>
            </el-table-column>
          </el-table>
          <Pagination :total="dialogSearchData.total" :page.sync="dialogSearchData.pageNum" :limit.sync="dialogSearchData.pageSize" @pagination="getUserDataList(dialogSearchData.userType)" ></Pagination>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="addSendUser">添加</el-button>
          <el-button type="danger" size="small" @click="editVisible1=false">取消</el-button>
        </div>
      </el-dialog>

      <div slot="footer" class="dialog-footer">
        <el-button v-if="dialogType==='add'" type="primary" size="small" @click="confirmAdd('addDepartment')">确认</el-button>
        <el-button v-if="dialogType==='edit'" type="primary" size="small" @click="confirmEdit('addDepartment')">确认</el-button>
        <el-button type="danger" size="small" @click="editVisible=false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { pagephCustomerContactByCustomerInfo } from '@/api/customer'
import { pagephSupplierContactBySupplierInfo } from '@/api/supplier'
import Pagination from '@/components/Pagination'
import { pagephNoticeTimingTask, deleteNoticeTimingTaskByIds, detailNoticeTimingTask, saveNoticeTimingTask, listNoticeTemplate, updateNoticeTimingTask, pagephNoticeTaskRecipient } from '@/api/system'
import { parseTime } from '@/utils/index'
export default {
  components: {
    Pagination
  },
  filters: {
    statusFmt(val) {
      switch (Number(val)) {
        case 1: return '已执行';
        case 0: return '待执行';
        case 3: return '执行中';
        default:
          return '数据异常';
      }
    },
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
    }
  },
  data() {
    return {
      taskDataRules: {
        taskName: [
          { required: true, message: '请填写任务名称', trigger: 'blur' }
        ],
        taskStatus: [
          { required: true, message: '请选择任务状态', trigger: 'blur' }
        ],
        templateBId: [
          { required: true, message: '请选择模版', trigger: 'blur' }
        ],
        timeInterval: [
          { type: 'number', required: true, message: 'Please fill in tiem interval with number', trigger: 'blur' }
        ],
        selectTime: [
          { required: true, message: '请选择任务时间', trigger: 'change' }
        ]
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      detailVisible: false,
      editVisible: false,
      editVisible1: false,
      templateList: [],
      selectList: [],
      idsForm: {
        ids: ''
      },
      statusList: [
        {
          label: '已执行',
          id: 1
        },
        {
          label: '待执行',
          id: 0
        },
        {
          label: '执行中',
          id: 3
        }
      ],
      dialogType: '',
      dataList: [],
      sendList: [],
      userList: [],
      loading1: false,
      loading2: false,
      countryList: [],
      currencyCodeList: [],
      dialogSelectList: [],
      listLoading: true,
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        updateTime: '',
        updateUserName: '',
        taskStatus: '',
        taskName: '',
        startTime: '',
        endTime: ''
      },
      customTime: [],
      taskData: {
        templateBId: '',
        taskName: '',
        taskStatus: 0,
        // gradeType: 1,
        runBeginTime: '',
        runEndTime: '',
        timeInterval: 1,
        delFlag: 1,
        updateTime: '',
        createTime: '',
        updateUserName: '',
        selectTime: [],
        sysNoticeTaskRecipientList: []
      },
      sendListData: {
        taskBId: '',
        pageSize: 10,
        pageNum: 1,
        total: 0
      },
      dialogSearchData: {
        userType: 1,
        customerCode: '',
        customerName: '',
        companyName: '',
        customerEmailAddress: '',
        countryCode: '',
        supplierCode: '',
        supplierName: '',
        supplierEmailAddress: '',
        pageSize: 10,
        pageNum: 1,
        total: 0
      }
    }
  },
  created() {
    this.getDataList()
    this.listNoticeTemplate();
  },
  methods: {
    clearData() {
      this.taskData.selectTime = [];
      this.taskData.templateBId = '';
      this.taskData.runBeginTime = '';
      this.taskData.runEndTime = '';
      this.taskData.taskName = '';
      this.taskData.taskStatus = 0;
      this.taskData.runEndTime = 1;
      this.taskData.updateTime = '';
      this.taskData.createTime = '';
      this.taskData.sysNoticeTaskRecipientList = [];
      this.dialogSelectList = [];
      this.sendList = [];
    },
    // 查看任务详情  接受方分页
    getSendListData(bId) {
      this.sendListData.taskBId = bId;
      pagephNoticeTaskRecipient(this.sendListData).then(res => {
        this.sendList = res.data.list;
        this.sendListData.total = res.data.total;
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    confirmAdd(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.taskData.sysNoticeTaskRecipientList = this.sendList;
          saveNoticeTimingTask(this.taskData).then(res => {
            if (res.status === 200) {
              if (res.data) {
                this.$message.success("操作成功");
              } else {
                this.$message.error("操作失败");
              }
            }
            this.$refs[formName].resetFields();
            this.getDataList();
            this.editVisible = false;
            this.clearData();
          }).catch(err => {
            this.$message.error(err.message);
          });
        } else {
          this.$message.warning('验证未通过');
          return false;
        }
      });
    },
    confirmEdit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.taskData.sysNoticeTaskRecipientList = this.sendList;
          updateNoticeTimingTask(this.taskData).then(res => {
            if (res.status === 200) {
              if (res.data) {
                this.$message.success("操作成功");
              } else {
                this.$message.error("操作失败");
              }
            }
            this.$refs[formName].resetFields();
            this.getDataList();
            this.editVisible = false;
            this.clearData();
          }).catch(err => {
            this.$message.error(err.message);
          });
        } else {
          this.$message.warning('验证未通过');
          return false;
        }
      });
    },
    getSelectTime(date) {
      if (date && date.length) {
        this.taskData.runBeginTime = date[0];
        this.taskData.runEndTime = date[1];
      } else {
        this.taskData.runBeginTime = '';
        this.taskData.runEndTime = '';
      }
      console.log(this.taskData);
    },
    openEdit(type, row) {
      this.userList = [];
      if (type === 'edit') {
        this.taskData.bid = row.bid;
        let obj = {
          bId: row.bid
        };
        detailNoticeTimingTask(obj).then(res => {
          this.taskData = Object.assign(this.taskData, res.data);
          this.taskData.selectTime = [res.data.runBeginTime, res.data.runEndTime];
          this.sendList = res.data.sysNoticeTaskRecipientList;
        }).catch(err => {
          this.$message.error(err.message);
        });
      }
      this.dialogType = type;
      this.editVisible = true;
    },
    deleteSend(index) {
      this.sendList.splice(index, 1)
    },
    openUserDialog() {
      this.editVisible1 = true;
      this.userSearch()
    },
    addSendUser() {
      if (!this.dialogSelectList.length) {
        return this.$message.warning('请勾选用户作为接收人')
      }
      if (!this.sendList.length) {
        this.sendList = this.dialogSelectList;
      } else {
        let arr = [];
        let addArr = [];
        this.dialogSelectList.forEach(e => {
          this.sendList.forEach(t => {
            if ((e.userType === t.userType) && (e.userName === t.userName) && (e.userAccount === t.userAccount) && (e.companyName === t.companyName)) {
              arr.push(e)
            }
          })
        });
        if (arr.length) {
          addArr = this.dialogSelectList.filter(e => {
            let flag = false;
            arr.forEach(t => {
              if ((e.userName === t.userName) && (e.userAccount === t.userAccount) && (e.companyName === t.companyName)) {
                flag = true
              }
            });
            return !flag
          });
        } else {
          addArr = this.dialogSelectList
        }
        this.sendList = this.sendList.concat(addArr);
      }
      this.$refs.multipleTable.clearSelection();
      this.dialogSelectList = [];
      this.editVisible1 = false;
    },
    userSearch(type) {
      this.dialogSearchData.pageNum = 1;
      this.getUserDataList(type)
    },
    getUserDataList(type) {
      // let obj = {};
      // for (let key in this.dialogSearchData) {
      //   if (this.dialogSearchData[key] !== '') {
      //     obj[key] = this.dialogSearchData[key]
      //   }
      // }
      if (type === 1) {
        pagephCustomerContactByCustomerInfo(this.dialogSearchData).then(res => {
          this.userList = res.data.list.map(e => {
            e.userBId = e.accountBId;
            e.userName = e.contactName;
            e.userAccount = e.emailAddress;
            e.userType = 1;
            e.userEmail = e.emailAddress;
            return { ...e }
          });
          this.dialogSearchData.total = res.data.total;
        }).catch(err => {
          this.$message.error(err.message);
        });
      }
      if (type === 2) {
        pagephSupplierContactBySupplierInfo(this.dialogSearchData).then(res => {
          this.userList = res.data.list.map(e => {
            e.userBId = e.accountBId;
            e.userName = e.contactName;
            e.userAccount = e.emailAddress;
            e.userType = 2;
            e.userEmail = e.emailAddress;
            return { ...e }
          });
          this.dialogSearchData.total = res.data.total;
        }).catch(err => {
          this.$message.error(err.message);
        });
      }
    },
    searchData() {
      this.postData.pageNum = 1;
      this.getDataList()
    },
    listNoticeTemplate() {
      listNoticeTemplate({}).then(res => {
        this.templateList = res.data;
      });
    },
    getDataList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      pagephNoticeTimingTask(obj).then(res => {
        this.dataList = res.data.list || [];
        this.postData.total = res.data.total;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message);
      });
    },
    openDialog(type, row) {
    },
    // 查看详情
    detailDialog(row) {
      detailNoticeTimingTask({ bId: row.bid }).then(res => {
        this.taskData = Object.assign(this.taskData, res.data);
        this.taskData.selectTime = [res.data.runBeginTime, res.data.runEndTime];
        // this.sendList = res.data.sysNoticeTaskRecipientList;
        this.detailVisible = true;
      }).catch(err => {
        this.$message.error(err.message);
      });
      this.sendListData.taskBId = row.bid;
      pagephNoticeTaskRecipient(this.sendListData).then(res => {
        this.sendList = res.data.list;
        this.sendListData.total = res.data.total;
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    getSearchTime(date) {
      if (date && date.length) {
        this.postData.startTime = date[0];
        this.postData.endTime = date[1]
      } else {
        this.postData.startTime = '';
        this.postData.endTime = ''
      }
    },
    deleteListByIds() {
      if (!this.selectList.length) {
        return this.$message.warning('请选择数据');
      }
      // for (let i = 0; i < this.selectList.length; i++) {
      //   if (this.selectList[i].quotedStatus !== 1) {
      //     return this.$message.warning('只能删除编辑中的数据')
      //   }
      // }
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.idsForm.ids = this.selectList.map(e => {
          return e.id;
        }).join(',');
        let formData = new FormData();
        formData.append("ids", this.idsForm.ids);
        deleteNoticeTimingTaskByIds(formData).then(res => {
          if (res.status === 200) {
            this.$message.success('操作成功!');
          }
          this.getDataList();
        }).catch(err => {
          this.$message.error(err.message);
        });
      }).catch(() => {
        this.$message.error('测试')
      });
    },
    getSelect(selects) {
      this.selectList = selects;
    },
    getDialogSelect(selects) {
      this.dialogSelectList = selects;
    }
  }
}
</script>

<style lang="scss">
  @import '~@/styles/variables.scss';
  .noticeTack {
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
        width: 800px;
      }
      .form-dialog-width {
        width: 400px;
      }
    }
  }
</style>
