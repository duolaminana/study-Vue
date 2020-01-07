<template>
  <div class="memoRemind">
    <!--<div class="memoRemind-editor-container">-->
      <!--<panel-group/>-->
    <!--</div>-->
    <!--<div class="memoRemind-top"><span>备忘提醒</span></div>-->

    <div class="saleOrder">
      <div class="search-box">
        <el-form label-width="90px" inline size="small">
          <div>
            <el-form-item label="标题">
              <el-input v-model="postData.remindTitle" clearable placeholder="请输入标题" style="width: 495px" />
            </el-form-item>
          </div>
          <div>
            <el-form-item label="提醒时间">
              <el-date-picker
                v-model="remindTime"
                type="daterange"
                align="right"
                unlink-panels
                clearable
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 360px"
                :picker-options="pickerOptions"
                @change="getSearchTime">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="处理状态" v-if="activeName === 'first'">
              <el-select v-model="postData.disposeStatus" clearable placeholder="请选择状态" style="width: 200px">
                <el-option v-for="(item, index) in disposeStatusList" :label="item.label" :value="item.disposeStatus" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="padding-left: 120px;">
              <el-button type="primary" class="export" @click="searchData(activeName)">搜索</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick(activeName)">
        <el-tab-pane label="我接收的提醒" name="first">
          <el-table
            v-loading="listLoading"
            :data="MemoRemindUserDateList"
            element-loading-text="正在查询中。。。"
            border
            fit
            size="mini"
            row-key="id"
            :header-cell-style="{background: '#a7bfee'}">
            <el-table-column
              align="center"
              label="序号"
              type="index"
              width="55">
            </el-table-column>

            <el-table-column width="200" label="标题" prop="remindTitle" show-overflow-tooltip />

            <el-table-column label="提醒内容" prop="remindContent" />

            <el-table-column align="center" width="150" label="提醒时间" prop="remindTime">
              <template slot-scope="scope">
                {{scope.row.remindTime | timeFmt}}
              </template>
            </el-table-column>

            <el-table-column align="center" width="100" label="提醒人" prop="remindUserName" show-overflow-tooltip/>

            <el-table-column align="center" width="100" label="处理状态" prop="disposeStatus">
              <template slot-scope="{row}">
                <el-tag :type="row.disposeStatus === 1 ? 'danger' : 'primary'" size="mini">{{ row.disposeStatus === 1 ? '待处理' : '已处理' }}</el-tag>
              </template>
            </el-table-column>

            <el-table-column align="center" label="操作" width="100" class-name="small-padding fixed-width">
              <template slot-scope="{row}">
                <el-button type="primary" size="mini" v-if="row.disposeStatus === 1" @click="changeStatus(row)">处理</el-button>
                <el-button type="primary" size="mini" v-if="row.disposeStatus === 2" class="export" @click="openDisposeDetails(row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>

          <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getMemoRemindUserDateList" ></Pagination>

        </el-tab-pane>
        <el-tab-pane label="我发送的提醒" name="second">
          <div class="topBtns">
          <el-button type="primary" size="small" @click="openRemind('add')">新增</el-button>
          <el-button type="primary" size="small" @click="deleteClick">删除</el-button>
          </div>

          <el-table
            v-loading="memoListLoading"
            :data="MemoDateList"
            element-loading-text="正在查询中。。。"
            border
            fit
            size="mini"
            row-key="id"
            header-align="center"
            :header-cell-style="{background: '#a7bfee'}"
            @selection-change="getSelect">

            <el-table-column
              align="center"
              type="selection"
              width="55">
            </el-table-column>

            <el-table-column
              align="center"
              label="序号"
              type="index"
              width="55">
            </el-table-column>

            <el-table-column width="200" label="标题" prop="remindTitle" show-overflow-tooltip/>

            <el-table-column label="提醒内容" prop="remindContent" />

            <el-table-column width="200" label="提醒对象" prop="sysMemoRemindUserList" show-overflow-tooltip>
              <template slot-scope="scope">
                {{getPostUserName(scope.row.sysMemoRemindUserList)}}
              </template>
            </el-table-column>

            <el-table-column align="center" width="150" label="提醒时间" prop="remindTime">
              <template slot-scope="scope">
                {{scope.row.remindTime | timeFmt}}
              </template>
            </el-table-column>

            <el-table-column align="center" label="操作" width="80" class-name="small-padding fixed-width">
              <template slot-scope="{row}">
                <el-button type="primary" size="mini" class="export" @click="openRemind('details',row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>

          <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getMemoRemindList" ></Pagination>

        </el-tab-pane>
      </el-tabs>
      <el-dialog :visible.sync="disposeDetailsVisible" title="提醒事项详情" center width="900px">
        <el-form :model="disposeDetailsForm" label-width="120px" label-position="right" size="small">
          <el-form-item label="提醒标题:">
            <el-input v-model="disposeDetailsForm.remindTitle" clearable style="width: 700px" readonly/>
          </el-form-item>
          <el-form-item label="提醒内容:">
            <el-input v-model="disposeDetailsForm.remindContent" type="textarea" :rows="10" clearable style="width: 700px" readonly/>
          </el-form-item>
          <el-form-item label="提醒人:">
            {{disposeDetailsForm.remindUserName}}
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="danger" size="small" @click="disposeDetailsVisible=false">关闭</el-button>
        </div>
      </el-dialog>

      <el-dialog :visible.sync="dialogVisible" :title="dialogType==='add'?'新增提醒事项': '提醒事项详情'" center width="900px" @closed="clearData">
        <el-form ref="memoRemind" :model="addMemoRemind" label-width="110px" label-position="right" size="small" :rules="addMemoRemindRules">
          <el-form-item label="提醒标题" prop="remindTitle">
            <el-input v-model="addMemoRemind.remindTitle" clearable :readonly="dialogType === 'details'" placeholder="请输入提醒标题" style="width: 700px" />
          </el-form-item>
          <el-form-item label="提醒对象" prop="sysMemoRemindUserList">
            <el-select multiple filterable :loading="loading" v-model="addMemoRemind.disposeUsersIds" :disabled="dialogType === 'details'" clearable placeholder="请选择提醒对象" @change="getRemindUser" style="width: 700px">
              <el-option v-for="(itemUser, index) in userInfoList" :label="itemUser.userName" :value="itemUser.accountBId" :key="index">
                {{itemUser.userName}}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="提醒内容" prop="remindContent">
            <el-input v-model="addMemoRemind.remindContent" :readonly="dialogType === 'details'" :autosize="{ minRows: 7, maxRows: 7}" type="textarea" clearable placeholder="内容字数不超过150" style="width: 700px" />
          </el-form-item>
          <el-form-item label="提醒人" prop="remindUserName">
            {{addMemoRemind.remindUserName}}
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" v-if="dialogType === 'add'" @click="addRemind('memoRemind', dialogType === 'add' ? 1 : 2)">发送</el-button>
          <el-button type="danger" size="small" v-if="dialogType === 'add'" @click="dialogVisible=false">取消</el-button>
          <el-button type="danger" size="small" v-if="dialogType !== 'add'" @click="dialogVisible=false">关闭</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
// import PanelGroup from './components/PanelGroup'
import { mapGetters } from 'vuex'
import { selectMemoRemindUserListApi, updateDisposeStatusApi, selectMemoRemindListApi, selectUserListAllApi, saveMemoRemindApi, deleteMemoRemindByIdsApi } from '@/api/system'
import { deepClone } from '@/utils/index'
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils/index'
import moneyFmt from '@/mixin/moneyFmt'

export default {
  name: 'DashboardAdmin',
  components: {
    // PanelGroup,
    Pagination
  },
  mixins: [moneyFmt],
  filters: {
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
    }
  },
  data() {
    return {
      idsForm: {
        ids: ''
      },
      listLoading: true,
      memoListLoading: true,
      MemoRemindUserDateList: [],
      MemoDateList: [],
      dialogVisible: false,
      disposeDetailsVisible: false,
      remindTime: [],
      selectList: [],
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        disposeUsersId: '',
        remindUserId: '',
        remindTitle: '',
        disposeStatus: '',
        endTime: '',
        startTime: ''
      },
      disposeDetailsForm: {
        remindTitle: '',
        remindContent: '',
        remindUserName: ''
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
      disposeStatusList: [
        // 处理状态（1-待处理/2-已处理）
        {
          label: '待处理',
          disposeStatus: 1
        },
        {
          label: '已处理',
          disposeStatus: 2
        }
      ],
      activeName: 'first',
      loading: false,
      dialogType: '',
      addMemoRemind: {
        remindTitle: '',
        disposeUsersIds: [],
        remindUserName: '',
        remindContent: '',
        sysMemoRemindUserList: []
      },
      userInfoList: [],
      addMemoRemindRules: {
        remindTitle: [
          { required: true, message: '请输入提醒标题', trigger: 'blur' }
        ],
        remindContent: [
          { required: true, message: '请输入提醒内容', trigger: 'blur' }
        ],
        sysMemoRemindUserList: [
          { required: true, message: '提醒对象不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'avatar'
    ]),
    userInfo () {
      return this.$store.state.user.userInfo
    }
  },
  created() {
    this.getMemoRemindUserDateList(); // 分页查询-我的提醒列表数据
    this.selectUserListAllFun(); // 获取后台人员
  },
  methods: {
    // 时间搜索
    getSearchTime(date) {
      if (date && date.length) {
        this.postData.startTime = date[0];
        this.postData.endTime = date[1]
      } else {
        this.postData.startTime = '';
        this.postData.endTime = ''
      }
    },
    // 打开新增备忘记录框
    openRemind(type, row) {
      this.dialogType = type;
      this.addMemoRemind.remindUserName = this.userInfo.userName;
      if (type === 'details') {
        this.addMemoRemind = deepClone(row);
        this.addMemoRemind.disposeUsersIds = this.addMemoRemind.sysMemoRemindUserList.map(e => e.disposeUsersId)
      }
      this.dialogVisible = true;
    },
    selectUserListAllFun() { // 获取后台人员
      selectUserListAllApi().then(res => {
        this.userInfoList = res.data;
      });
    },
    getRemindUser(arr) {
      this.addMemoRemind.sysMemoRemindUserList = this.userInfoList.filter(e => {
        e.disposeUsersId = e.accountBId;
        e.disposeUsersName = e.userName;
        return arr.includes(e.accountBId)
      });
    },
    getPostUserName(arr = []) {
      return arr.map(e => e.disposeUsersName).join(',')
    },
    // 关闭清空数据
    clearData() {
      this.addMemoRemind.remindTitle = '';
      this.addMemoRemind.remindContent = '';
      this.addMemoRemind.disposeUsersIds = [];
      this.addMemoRemind.sysMemoRemindUserList = [];
    },
    // 新增一条备忘记录
    addRemind(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          saveMemoRemindApi(this.addMemoRemind).then(res => {
            this.$message.success(res.message);
            this.$refs[formName].resetFields();
            this.getMemoRemindList(); // 分页查询-我的发送列表数据
            this.dialogVisible = false;
          }).catch(err => {
            this.$message.error(err.message)
          });
        } else {
          this.$message.warning('验证未通过');
          return false;
        }
      });
    },
    deleteClick() {
      if (!this.selectList.length) {
        return this.$message.warning('请选择数据')
      }
      this.$confirm('此操作将删除该备忘提醒, 是否继续?', '提示', {
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
        deleteMemoRemindByIdsApi(formData).then(res => {
          this.getMemoRemindList();
          this.$message.success('删除成功');
        }).catch(err => {
          this.$message.error(err.message)
        });
      }).catch(() => {
      });
    },
    searchData(activeName) {
      this.postData.pageNum = 1;
      if (activeName === 'first') {
        this.getMemoRemindUserDateList() // 分页查询-我的提醒列表数据
      } else {
        this.getMemoRemindList(); // 分页查询-我的发送列表数据
      }
    },
    // 卡片选择
    handleClick(activeName) {
      if (activeName === 'first') {
        this.getMemoRemindUserDateList(); // 分页查询-我的提醒列表数据
      } else {
        this.getMemoRemindList(); // 分页查询-我的发送列表数据
      }
    },
    // 分页查询-我的提醒列表数据
    getMemoRemindUserDateList() {
      this.postData.disposeUsersId = this.userInfo.accountBId;
      selectMemoRemindUserListApi(this.postData).then(res => {
        this.MemoRemindUserDateList = res.data.list;
        this.postData.total = res.data.total;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message)
      });
    },
    // 分页查询-我的发送列表数据
    getMemoRemindList() {
      this.postData.remindUserId = this.userInfo.accountBId;
      selectMemoRemindListApi(this.postData).then(res => {
        this.MemoDateList = res.data.list;
        this.postData.total = res.data.total;
        this.memoListLoading = false;
      }).catch(err => {
        this.memoListLoading = false;
        this.$message.error(err.message)
      });
    },
    // 打开提醒对象详情页
    openDisposeDetails(row) {
      this.disposeDetailsForm = deepClone(row);
      this.disposeDetailsVisible = true;
    },
    // 进行状态处理
    changeStatus(row) {
      let data = {
        id: row.id,
        disposeStatus: 2
      };
      updateDisposeStatusApi(data).then(res => {
        this.$message.success(res.message)
        this.getMemoRemindUserDateList();
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    // 勾选触发 selects为选择的数据数组
    getSelect(selects) {
      this.selectList = selects
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables.scss';
  .memoRemind {
    background-color: #f6f7fb;
  }
  .memoRemind-editor-container {
    padding: 25px 25px 15px 25px;
    background-color: #f6f7fb;
    position: relative;
    height: 100%;
    .github-corner {
      position: absolute;
      top: 0;
      border: 0;
      right: 0;
    }
  }
  .memoRemind-top{
    background-color: rgb(234, 225, 225);
    height: 40px;
    text-align: center;
    line-height: 41px;
    font-size: 18px;
  }
  .saleOrder {
    padding-top: 20px;
    .search-box {
      margin-bottom: 15px;
      border-bottom: 1px solid $border-light-color;
    }
    .leftBtns {
      float: left;
      margin-bottom: 10px;
      button {
        margin: 0 10px;
      }
    }
    .topBtns {
      margin-bottom: 10px;
      text-align: right;
      button {
        margin: 0 10px;
      }
    }
    .row-item {
      margin-bottom: 20px;
    }
    .step-node {
      position: relative;
      font-weight: bold;
      font-size: 15px;
      line-height: 40px;
      padding: 5px 5px 5px 20px;
      border-bottom: 1px solid $border-light-color;
    }
  }
</style>
