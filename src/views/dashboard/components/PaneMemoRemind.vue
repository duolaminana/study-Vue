<template>
  <div class="panel-msg1">
    <div class="panel-title">
      {{title}}&nbsp;<el-badge v-if="total" :value="total" type="primary"></el-badge>
      <div style="float: right;padding-right: 10px;margin-top: 3px" @click="openRemind">
        <svg-icon icon-class="jia" size="20"></svg-icon>
      </div>
    </div>
    <div class="panel-list">
      <div class="panel-item" v-for="(item, index) in list" :key="index">
        <div class="panel-index">{{index + 1}}</div>
        <div class="panel-content">
          <div>
            <div>标&emsp;题：{{item.remindTitle}}</div>
          </div>
          <div>
            <div>提醒人：{{item.remindUserName}}</div>
            <div>时&emsp;间：{{item.remindTime | timeFmt}}</div>
            <!--<div>状&emsp;态：<span :class="Number(item.disposeStatus) === 1 ? 'text-red' : 'text-green'">{{item.disposeStatus | statusName}}</span></div>-->
          </div>
          <div>
            <div class="panel-label">内&emsp;容：</div> <div>{{item.remindContent}}</div>
          </div>
        </div>
        <div class="panel-event">
          <el-button type="primary" size="mini" v-if="item.disposeStatus === 1" @click="dealWith(item)">处理</el-button>
        </div>
      </div>
      <div v-if="!list.length" class="no-data">{{$t('common.noData')}}</div>
      <div class="more-data" @click="goMoreDataPath">{{$t('common.more')}}>>></div>

      <el-dialog :visible.sync="dialogVisible" title="提醒事项" center append-to-body width="700px" @closed="clearData">
        <el-form ref="memoRemind" :model="addMemoRemind" label-width="110px" label-position="right" size="small" :rules="addMemoRemindRules">
          <el-form-item label="提醒标题" prop="remindTitle">
            <el-input v-model="addMemoRemind.remindTitle" clearable placeholder="请输入提醒标题"/>
          </el-form-item>
          <el-form-item label="提醒对象" prop="sysMemoRemindUserList">
          <el-select multiple filterable v-model="addMemoRemind.disposeUsersIds" clearable placeholder="请选择提醒对象" @change="getRemindUser" style="width: 100%">
            <el-option v-for="(itemUser, index) in userInfoList" :label="itemUser.userName" :value="itemUser.accountBId" :key="index">
              {{itemUser.userName}}
            </el-option>
          </el-select>
          </el-form-item>
          <el-form-item label="提醒内容" prop="remindContent">
            <el-input v-model="addMemoRemind.remindContent" :autosize="{ minRows: 4, maxRows: 6}" type="textarea" clearable placeholder="内容字数不超过150"/>
          </el-form-item>
          <el-form-item label="提醒人" prop="remindUserName">
            {{addMemoRemind.remindUserName}}
          </el-form-item>
        </el-form>
        <div slot="footer" style="text-align: center;margin-top: -10px">
          <el-button type="primary" size="small" @click="addRemind('memoRemind')">{{$t('common.buttonText.confirm')}}</el-button>
          <el-button type="danger" size="small" @click="dialogVisible=false">{{$t('common.buttonText.cancel')}}</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { parseTime } from '@/utils/index'
import { updateDisposeStatusApi, selectUserListAllApi, saveMemoRemindApi } from '@/api/system';
export default {
  data() {
    return {
      dialogVisible: false,
      loading: false,
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
          { required: true, message: 'Please fill in the remind title', trigger: 'blur' }
        ],
        remindContent: [
          { required: true, message: 'Please fill in the remind content', trigger: 'blur' }
        ],
        sysMemoRemindUserList: [
          { required: true, message: 'Please choose the reminder', trigger: 'change' }
        ]
      }
    }
  },
  props: {
    title: {
      type: String,
      default: '消息'
    },
    list: {
      type: Array,
      default: () => []
    },
    pathType: {
      type: Number,
      default: 1
    },
    type: {
      type: Boolean,
      default: false
    },
    total: {
      type: Number,
      default: 0
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.user.userInfo
    }
  },
  methods: {
    // 进行状态处理
    dealWith(item) {
      let data = {
        id: item.id,
        disposeStatus: 2
      };
      updateDisposeStatusApi(data).then(res => {
        this.$message.success(res.message);
        this.$emit('reLoad')
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    // 打开新增备忘记录框
    openRemind() {
      this.selectUserListAllFun(); // 获取后台人员
      this.addMemoRemind.remindUserName = this.userInfo.userName;
      this.dialogVisible = true;
    },
    // 新增一条备忘记录
    addRemind(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          saveMemoRemindApi(this.addMemoRemind).then(res => {
            this.$message.success(res.message);
            this.$refs[formName].resetFields();
            this.$emit('reLoad');
            this.dialogVisible = false;
          }).catch(err => {
            this.$message.error(err.message)
          });
        } else {
          this.$message.warning('Please complete the form');
          return false;
        }
      });
    },
    selectUserListAllFun() {
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
    // 关闭清空数据
    clearData() {
      this.addMemoRemind.remindTitle = '';
      this.addMemoRemind.remindContent = '';
      this.addMemoRemind.disposeUsersIds = [];
      this.addMemoRemind.sysMemoRemindUserList = [];
    },
    goMoreDataPath() {
      let path = '';
      switch (this.pathType) {
        case 1: path = '/approval/approval'; break;
        case 2: path = '/personal/remind'; break;
      }
      if (path) {
        this.$router.push({ path: path })
      }
    }
  },
  filters: {
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
    },
    statusName(val) {
      switch (Number(val)) {
        case 1: return '待处理';
        case 2: return '已处理';
      }
    }
  }
}
</script>

<style lang="scss">
  @import '~@/styles/variables.scss';
  .panel-msg1{
    width: 100%;
    .panel-title {
      height: 32px;
      line-height: 32px;
      text-align: center;
      background-color: #a7bfee;
    }
    .panel-list {
      .panel-item {
        width: 100%;
        display: -webkit-flex;
        display: flex;
        height: 100px;
        border-bottom: 1px solid #ccc;
        border-right: 1px solid #ccc;
        border-left: 1px solid #ccc;
        .panel-index {
          display: flex;
          display: -webkit-flex;
          justify-content: center;
          align-items: center;
          /*background: #adb8f7;*/
          border-right: 1px solid #ccc;
          width: 30px;
          padding: 5px;
        }
        .panel-content {
          flex: 1;
          display: -webkit-flex;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          padding: 5px;
          font-size: 12px;
          >div {
            display: flex;
            display: -webkit-flex;
            line-height: 1.25rem;
            overflow: hidden;
            >div {
              flex: 1;
              margin-right: 10px;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
              overflow: hidden;
            }
            .panel-label {
              max-width: 48px;margin-right: 0;
            }
          }
          .text-red {
            color: #ff9800;
          }
          .text-green {
            color: #259b24;
          }
        }
        .panel-event {
          width: 90px;
          display: -webkit-flex;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          padding: 5px;
          text-align: center;
          button {
            display: block;
            width: 50px;
            margin: 0 auto;
          }
        }
      }
      .no-data {
        border: 1px solid #ccc;
        border-top: none;
        font-size: 12px;
        /*background: #f6f7fb;*/
        text-align: center;
        line-height: 36px;
      }
      .more-data {
        border: 1px solid #ccc;
        border-top: none;
        /*background: #f6f7fb;*/
        text-align: right;
        font-size: 12px;
        padding-right: 16px;
        line-height: 36px;
        cursor: pointer;
      }
      .more-data:hover {
        text-decoration: underline;
      }
    }
    .form-dialog-width{
      width: 490px;
    }
    .el-dialog__header {
      padding: 5px !important;
    }
  }
</style>
