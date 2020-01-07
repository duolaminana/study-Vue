<template>
  <div class="app-container roleManagement">
    <div class="search-box">
      <el-form label-width="90px" inline size="small">
        <el-form-item :label="$t('member.activity.activityName')">
          <el-input v-model="postData.name" style="width: 200px" />
        </el-form-item>
        <el-form-item :label="$t('member.activity.levelTime')">
          <el-date-picker
            v-model="memberActivityStart"
            type="daterange"
            align="right"
            unlink-panels
            clearable
            range-separator="~"
            :start-placeholder="$t('member.activity.start')"
            :end-placeholder="$t('member.activity.end')"
            style="width: 380px"
            :picker-options="pickerOptions"
            @change="getSearchTime">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('system.role.status')">
          <el-select v-model="postData.status" clearable style="width: 200px">
            <el-option
              v-for="(item, index) in areaList"
              :label="item.label"
              :value="item.id"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchData">{{$t('system.role.search')}}</el-button>
        </el-form-item>
        <!--<el-form-item label="有下属时不允许删除" label-width="500px"></el-form-item>-->
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="openDialog('add')">{{$t('system.role.add')}}</el-button>
      <el-button type="primary" size="small" @click="deleteBatchMethod()">{{$t('system.role.delete')}}</el-button>
      <el-button type="primary" size="small" @click="putaway">{{$t('member.activity.onshelf')}}</el-button>
      <el-button type="primary" size="small" @click="soldOut">{{$t('member.activity.offshelf')}}</el-button>
      <el-button type="primary" size="small" class="export">{{$t('system.role.export')}}</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      :element-loading-text="$t('system.userManage.lodding')"
      border
      fit
      size="mini"
      :header-cell-style="{background: '#a7bfee'}"
      @selection-change="getSelect"
    >
      <el-table-column align="center" type="selection" width="55"></el-table-column>
      <el-table-column :label="$t('member.activity.activityName')" prop="memberActivityName" show-overflow-tooltip />
      <el-table-column :label="$t('member.activity.start')" prop="memberActivityStart" width="160px" align="center">
      <template slot-scope="scope">
        {{scope.row.memberActivityStart | timeFmt}}
      </template>
      </el-table-column>
      <el-table-column :label="$t('member.activity.end')" prop="memberActivityEnd" width="160px" align="center">
      <template slot-scope="scope">
        {{scope.row.memberActivityEnd | timeFmt}}
      </template>
      </el-table-column>
      <el-table-column align="center" width="100" :label="$t('member.activity.participantNum')" show-overflow-tooltip prop="acountNum"/>
      <el-table-column align="center" width="100" :label="$t('system.role.modifier')" prop="updateUserName" show-overflow-tooltip/>
      <el-table-column align="center" width="160" :label="$t('system.userManage.editTime')" show-overflow-tooltip prop="updateTime">
        <template slot-scope="scope">
          {{scope.row.updateTime | timeFmt}}
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('system.role.status')" width="80px" prop="memberActivityStatus">
        <template slot-scope="scope">
          <el-tag :type="scope.row.memberActivityStatus === 0 ? 'primary' : 'danger' " size="mini">{{ scope.row.memberActivityStatus === 0 ?
            $t('system.role.active') : $t('system.role.inactive') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('system.role.operation')" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" class="export" @click="detailDialog(row)">{{$t('system.role.view')}}</el-button>
          <el-button
            type="primary"
            size="mini"
            class="export"
            @click="overParticipate(row)"
          >
            {{$t('member.activity.participant')}}
          </el-button>
          <el-button
            type="primary"
            size="mini"
            @click="openDialog('edit', row)"
          >{{$t('system.userManage.editUser')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :total="postData.total"
      :page.sync="postData.pageNum"
      :limit.sync="postData.pageSize"
      @pagination="getDataList"
    ></Pagination>
      <!--编辑-->
    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogType==='add'? $t('member.activity.addMembership'):$t('member.activity.editMembership')"
      center
      width="700px"
    >
      <el-form
        :model="ruleForm"
        status-icon
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        :rules="rules"
      >
        <el-form-item :label="$t('member.activity.activityName')" prop="memberActivityName">
          <el-input v-model="ruleForm.memberActivityName" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item :label="$t('member.activity.start')" prop="memberActivityStart">
          <el-date-picker
            v-model="ruleForm.memberActivityStart"
            type="date"
            :placeholder="$t('member.activity.selectDate')">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('member.activity.end')" prop="memberActivityEnd">
          <el-date-picker
            v-model="ruleForm.memberActivityEnd"
            type="date"
            :placeholder="$t('member.activity.selectDate')">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('member.activity.location')" prop="memberActivityAddress">
          <el-input v-model="ruleForm.memberActivityAddress" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item :label="$t('member.activity.remark')" prop="remark">
          <el-input
            type="textarea"
            placeholder="500字内"
            maxlength="500"
            show-word-limit
            v-model="ruleForm.remark"
          >
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('member.activity.detail')" prop="memberActivityDetail">
          <div class="avatar">
            <el-upload
              class="avatar-uploader"
              :action="uploadActionUrl"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="ruleForm.memberActivityPath" :src="ruleForm.memberActivityPath" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <div slot="tip" class="el-upload__tip">{{$t('member.activity.description')}}</div>
            <!--<div style="font-size: 10px;text-align: center;color: #ff3a3d;padding: 5px 0;">点击头像进行更换</div>-->
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          size="small"
          :loading="addLoading"
          @click="addMethod('ruleForm')"
        >{{$t('system.role.seave')}}</el-button>
        <el-button type="danger" size="small" @click="closOPenDialog">{{$t('system.role.return')}}</el-button>
      </div>
    </el-dialog>
    <!--详情-->
    <el-dialog :visible.sync="overDetails" :title="$t('member.activity.membership')" center width="700px">
      <el-form
        v-model="detailForm"
        status-icon
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="$t('member.activity.activityName')" >
          <el-input v-model="detailForm.memberActivityName" style="width:300px" readonly></el-input>
        </el-form-item>
        <el-form-item :label="$t('member.activity.start')" >
        <el-date-picker
          v-model="detailForm.memberActivityStart"
          type="date"
          readonly
          :placeholder="$t('member.activity.selectDate')">
        </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('member.activity.end')" >
          <el-date-picker
            v-model="detailForm.memberActivityEnd"
            type="date"
            readonly
            :placeholder="$t('member.activity.selectDate')">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('member.activity.location')" >
          <el-input v-model="detailForm.memberActivityAddress" style="width:300px" readonly></el-input>
        </el-form-item>
        <el-form-item :label="$t('member.activity.remark')" prop="remark">
          <el-input
            type="textarea"
            placeholder="500字内"
            v-model="detailForm.remark"
            maxlength="500"
            show-word-limit
            readonly
          >
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('member.activity.detail')" readonly>
          <div class="avatar">
            <el-upload
              disabled
              class="avatar-uploader"
              :action="uploadActionUrl"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="detailForm.memberActivityPath" :src="detailForm.memberActivityPath" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <div slot="tip" class="el-upload__tip">{{$t('member.activity.description')}}</div>
            <!--<div style="font-size: 10px;text-align: center;color: #ff3a3d;padding: 5px 0;">点击头像进行更换</div>-->
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="closOPenDialog">{{$t('system.role.return')}}</el-button>
      </div>
    </el-dialog>
    <!--参与-->
    <el-dialog :visible.sync="participate" :title="$t('member.activity.participantList')" center width="800px">
      <el-form
        v-model="participateForm"
        status-icon
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="$t('member.activity.activityName')" >
          <el-input v-model="participateForm.memberActivityName" style="width:300px" readonly></el-input>
        </el-form-item>
        <el-form-item :label="$t('member.activity.start')" >
          <el-date-picker
            v-model="participateForm.memberActivityStart"
            type="date"
            readonly
            :placeholder="$t('member.activity.selectDate')">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('member.activity.end')" >
          <el-date-picker
            v-model="participateForm.memberActivityEnd"
            type="date"
            readonly
            :placeholder="$t('member.activity.selectDate')">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('member.activity.location')" >
          <el-input readonly v-model="participateForm.memberActivityAddress" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item :label="$t('member.activity.participantList')" >
          <div class="topBtns">
          <el-button type="primary" size="small" class="export">{{$t('system.role.export')}}</el-button>
          </div>
          <el-table
            v-loading="listLoading"
            :data="list"
            :element-loading-text="$t('system.userManage.lodding')"
            border
            fit
            size="mini"
            :header-cell-style="{background: '#a7bfee'}"
            @selection-change="getSelect"
          >
            <el-table-column
              type="index"
              width="35">
            </el-table-column>
            <el-table-column align="center" :label="$t('system.role.account')" prop="accountBID" show-overflow-tooltip />
            <el-table-column align="center" :label="$t('system.role.name')" prop="userAccount" show-overflow-tooltip />
            <el-table-column align="center" :label="$t('system.role.contact')" show-overflow-tooltip prop="mobilePhone" />
            <el-table-column align="center" :label="$t('system.userManage.company')" show-overflow-tooltip prop="companyName" />
            <el-table-column align="center" :label="$t('member.activity.registration')" show-overflow-tooltip prop="createTime" >
              <template slot-scope="scope">
                {{scope.row.createTime | timeFmt}}
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="closOPenDialog">{{$t('system.role.return')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import { uploadActionUrl } from '@/api/common'
import { parseTime } from '@/utils/index'
import {
  pagephMemberActivity,
  saveMemberActivity,
  deleteByIds,
  updateMemberActivity,
  updateBatchByIds,
  detailMemberActivity,
  getMembgerActivityMembers
} from "@/api/member";
export default {
  components: {
    Pagination
  },
  data() {
    return {
      disabledDate(time) {
        return time.getTime() > Date.now();
      },
      textarea: '',
      uploadActionUrl,
      memberActivityStart: "",
      // 详情
      detailForm: {
        memberActivityAddress: "",
        memberActivityDetail: "",
        memberActivityName: "",
        memberActivityStart: "",
        memberActivityEnd: "",
        memberActivityPath: "",
        remark: ""
      },
      // 参与
      participateForm: {
        memberActivityAddress: "",
        memberActivityName: "",
        memberActivityStart: "",
        memberActivityEnd: ""
      },
      // 新增
      ruleForm: {
        memberActivityAddress: "",
        memberActivityDetail: "",
        memberActivityName: "",
        memberActivityStart: "",
        memberActivityEnd: "",
        memberActivityPath: "",
        remark: ""
      },
      participate: false,
      overDetails: false,
      listLoading: true,
      addLoading: false,
      dialogVisible: false,
      dialogType: "",
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        name: "",
        end: "",
        start: "",
        status: "",
        memberActivityStart: "",
        memberActivityEnd: ""
      },
      areaList: [
        {
          label: this.$t("system.userManage.inEmploy"),
          id: 0
        },
        {
          label: this.$t("system.userManage.inDisable"),
          id: 1
        }
      ],
      list: [],
      rules: {
        memberActivityName: [
          { required: true, message: this.$t('member.activity.memberName'), trigger: 'blur' }
        ],
        memberActivityAddress: [
          { required: true, message: this.$t('member.activity.memberAddress'), trigger: 'blur' }
        ],
        memberActivityStart: [
          { required: true, message: this.$t('member.activity.selectDate'), trigger: 'blur' }
        ],
        memberActivityEnd: [
          { required: true, message: this.$t('member.activity.selectDate'), trigger: 'blur' }
        ],
        remark: [
          { required: true, message: this.$t('member.activity.memberRemark'), trigger: 'blur' }
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
      }
    };
  },
  created() {
    this.getDataList();
  },
  methods: {
    getSearchTime(date) {
      if (date && date.length) {
        this.postData.start = date[0];
        this.postData.end = date[1]
      } else {
        this.postData.start = '';
        this.postData.end = ''
      }
    },
    putaway() {
      if (!this.selectList.length) {
        return this.$message(this.$t("system.userManage.option"));
      }
      this.$confirm(
        this.$t('member.activity.shelves'),
        this.$t("system.userManage.hint"),
        {
          confirmButtonText: this.$t("system.role.affirm"),
          cancelButtonText: this.$t("system.role.return"),
          type: "warning"
        }
      )
        .then(() => {
          this.deleteIdsForm = this.selectList
            .map(e => {
              return e.id;
            })
          let ids = []
          ids.push(this.deleteIdsForm)
          let obj = {
            ids: ids[0],
            status: 0
          }
          updateBatchByIds(obj)
            .then(res => {
              if (res.status === 200) {
                this.$message.success(this.$t('member.activity.shelvesSave'));
              }
              this.getDataList();
            })
            .catch(err => {
              this.$message.error(err.message);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("system.userManage.cancel")
          });
        });
    },
    soldOut() {
      if (!this.selectList.length) {
        return this.$message(this.$t("system.userManage.option"));
      }
      this.$confirm(
        this.$t('member.activity.soldOut'),
        this.$t("system.userManage.hint"),
        {
          confirmButtonText: this.$t("system.role.affirm"),
          cancelButtonText: this.$t("system.role.return"),
          type: "warning"
        }
      )
        .then(() => {
          this.deleteIdsForm = this.selectList
            .map(e => {
              return e.id;
            })
          let ids = []
          ids.push(this.deleteIdsForm)
          let obj = {
            ids: ids[0],
            status: 1
          }
          updateBatchByIds(obj)
            .then(res => {
              if (res.status === 200) {
                this.$message.success(this.$t('member.activity.soldOutSave'));
              }
              this.getDataList();
            })
            .catch(err => {
              this.$message.error(err.message);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("system.userManage.cancel")
          });
        });
    },
    // 参与
    overParticipate (row) {
      this.participate = true
      detailMemberActivity({ bid: row.bid }).then(res => {
        this.participateForm = res.data
      })
      getMembgerActivityMembers({
        pageNum: 1,
        pageSize: 10
      }).then(res => {
        console.log(res)
      })
    },
    // 搜索
    searchData() {
      this.postData.pageNum = 1;
      this.getDataList();
    },
    // 获取数据列表
    getDataList() {
      let obj = {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        memberActivityName: this.postData.name,
        memberActivityEnd: this.postData.end,
        memberActivityStart: this.postData.start,
        memberActivityStatus: this.postData.status
      };
      pagephMemberActivity(obj)
        .then(res => {
          this.list = res.data.list || [];
          this.postData.total = res.data.total;
          this.listLoading = false;
        })
        .catch(err => {
          this.listLoading = false;
          this.$message.error(err.message);
        });
    },
    // 关闭详情模块
    detailDialogClos() {
      this.overDetails = false;
    },
    // 详情模块
    detailDialog(row) {
      this.overDetails = true;
      detailMemberActivity({ bid: row.bid }).then(res => {
        this.detailForm = res.data
      })
    },
    // 编辑模块
    openDialog(type, row) {
      this.dialogType = type;
      if (type === "edit") {
        detailMemberActivity({ bid: row.bid }).then(res => {
          this.ruleForm = res.data
        }).catch(err => {
          this.$message.error(err.message);
        })
      } else {
        this.ruleForm = {}
      }
      this.dialogVisible = true;
    },
    closOPenDialog() {
      this.dialogVisible = false;
      this.overDetails = false;
      this.participate = false
    },
    // 勾选触发 selects为选择的数据数组
    getSelect(selects) {
      this.selectList = selects;
    },
    // 具体添加方法
    addMethod(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.ruleForm.id) {
            updateMemberActivity(this.ruleForm)
              .then(res => {
                this.$message.success(this.$t("system.userManage.updata"));
                this.postData.pageNum = 1;
                this.dialogVisible = false;
                this.getDataList();
                this.closOPenDialog();
                this.$refs[formName].resetFields()
              })
              .catch(err => {
                this.$message.error(err.message);
              });
          } else {
            saveMemberActivity(this.ruleForm)
              .then(res => {
                this.$message.success(this.$t("system.userManage.addSuccess"));
                this.postData.pageNum = 1;
                this.dialogVisible = false;
                this.getDataList();
                this.closOPenDialog();
                this.$refs[formName].resetFields()
              })
              .catch(err => {
                this.$message.error(err.message);
              });
          }
        } else {
          this.$message.error(this.$t("system.userManage.check"));
        }
      });
    },
    deleteBatchMethod() {
      if (!this.selectList.length) {
        return this.$message(this.$t("system.userManage.option"));
      }
      this.$confirm(
        this.$t("system.userManage.whether"),
        this.$t("system.userManage.hint"),
        {
          confirmButtonText: this.$t("system.role.affirm"),
          cancelButtonText: this.$t("system.role.return"),
          type: "warning"
        }
      )
        .then(() => {
          this.deleteIdsForm = this.selectList
            .map(e => {
              return e.id;
            })
            .join(",");
          let formData = new FormData();
          formData.append("ids", this.deleteIdsForm);
          deleteByIds(formData)
            .then(res => {
              if (res.status === 200) {
                this.$message.success(this.$t("system.userManage.handle"));
              }
              this.getDataList();
            })
            .catch(err => {
              this.$message.error(err.message);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("system.userManage.cancel")
          });
        });
    },
    handleAvatarSuccess(res, file) {
      this.detailForm.memberActivityPath = res.data.filePath;
      this.ruleForm.memberActivityPath = res.data.filePath;
    },
    beforeAvatarUpload(file) {
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/gif";
      const isLt3M = file.size / 1024 / 1024 < 3;

      if (!isJPG) {
        this.$message.error(this.$t("system.userManage.uplode1"));
      }
      if (!isLt3M) {
        this.$message.error(this.$t("system.userManage.uplode2"));
      }
      return isJPG && isLt3M;
    }
  },

  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "gray",
        deleted: "danger"
      };
      return statusMap[status];
    },
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/styles/variables.scss";

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

  .avatar {
    width: 60%;

    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
      border-color: #409eff;
    }

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 150px;
      height: 150px;
      line-height: 150px;
      text-align: center;
      border: 1px solid $border-light-color;
    }

    .avatar {
      width: 150px;
      height: 150px;
      display: block;
    }
  }

  .dialogClass {
    .el-dialog {
      width: 500px;
    }
  }
}
</style>
