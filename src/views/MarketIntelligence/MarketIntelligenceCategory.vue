<template>
  <div class="app-container roleManagement">
    <div class="search-box">
      <el-form label-width="200px" inline size="small">
        <el-form-item :label="$t('consult.classify.category')">
          <el-input v-model="postData.rightName" style="width: 200px" />
        </el-form-item>
        <el-form-item :label="$t('system.role.status')">
          <el-select
            v-model="postData.rightStatus"
            :placeholder="$t('system.role.all')"
            clearable
            style="width: 200px"
          >
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
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="openDialog('add')">{{$t('system.role.add')}}</el-button>
      <!--<el-button-->
        <!--type="primary"-->
        <!--size="small"-->
        <!--@click="deleteBatchMethod()"-->
      <!--&gt;{{$t('system.role.delete')}}</el-button>-->
      <el-button type="primary" size="small" class="export">{{$t('system.route.export')}}</el-button>
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
      <el-table-column
        :label="$t('consult.classify.category')"
        prop="rightName"
        show-overflow-tooltip
      />
      <el-table-column
        :label="$t('system.agreement.signer')"
        prop="updateUserName"
        show-overflow-tooltip
        align="center"
      />
      <el-table-column
        align="center"
        show-overflow-tooltip
        :label="$t('system.userManage.editTime')"
        prop="createTime"
        width="160px"
      >
        <template slot-scope="scope">{{scope.row.createTime | timeFmt}}</template>
      </el-table-column>
      <el-table-column
        align="center"
        width="80"
        :label="$t('system.role.status')"
        prop="categoryStatus"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.categoryStatus === 0 ? 'primary' : 'danger' " size="mini">
            {{ scope.row.categoryStatus
            === 0 ?
            $t('system.role.active') : $t('system.role.inactive') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('system.role.operation')"
        width="210"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{row}">
          <el-button
            type="primary"
            size="mini"
            class="export"
            @click="detailDialog(row)"
          >{{$t('system.role.view')}}</el-button>
          <el-button
            :type="row.categoryStatus === 1 ? 'info' : 'danger'"
            size="mini"
            @click="changeMethod(row)"
          >{{row.categoryStatus === 1 ? $t('system.role.disable') : $t('system.role.enable')}}</el-button>
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
    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogType==='add'? $t('consult.classify.addCategory'):$t('consult.classify.editCategory')"
      center
      width="600px"
    >
      <el-form
        :model="ruleForm"
        status-icon
        ref="ruleForm"
        label-width="200px"
        class="demo-ruleForm"
      >
        <el-form-item :label="$t('consult.classify.category')" prop="rightName">
          <el-input v-model="ruleForm.rightName" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item :label="$t('system.role.status')" prop="status">
          <el-select v-model="ruleForm.categoryStatus" class="form-dialog-width2">
            <el-option
              v-for="(item, index) in areaList"
              :label="item.label"
              :value="item.id"
              :key="index"
            ></el-option>
          </el-select>
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
    <el-dialog
      :visible.sync="overDetails"
      :title="$t('member.rights.viewRights')"
      center
      width="600px"
    >
      <el-form
        :model="ruleForm"
        status-icon
        ref="ruleForm"
        label-width="200px"
        class="demo-ruleForm"
      >
        <el-form-item :label="$t('consult.classify.category')" prop="rightName">
          <el-input v-model="ruleForm.rightName" style="width:300px" readonly></el-input>
        </el-form-item>
        <el-form-item :label="$t('system.role.status')" prop="status">
          <el-select v-model="ruleForm.categoryStatus" class="form-dialog-width2">
            <el-option
              v-for="(item, index) in areaList"
              :label="item.label"
              :value="item.id"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!--<el-button type="primary" size="small" :loading="addLoading" @click="addMethod('ruleForm')">保存</el-button>-->
        <el-button type="danger" size="small" @click="closOPenDialog">{{$t('system.role.return')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import { parseTime } from "@/utils/index";
import {
  addSaveMemberRight,
  pagephMemberRight,
  dedleteByIds,
  updateMemberRight
} from "@/api/member";
export default {
  components: {
    Pagination
  },
  data() {
    return {
      textarea: "",
      dialogType: "",
      ruleForm: {
        rightName: "",
        rightDescription: "",
        id: ""
      },
      overDetails: false,
      listLoading: true,
      addLoading: false,
      dialogVisible: false,
      selectList: [],
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        rightName: "",
        rightDescription: "",
        rightStatus: ""
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
      list: []
    };
  },
  created() {
    this.getDataList();
  },
  methods: {
    // 搜索
    searchData() {
      this.postData.pageNum = 1;
      this.getDataList();
    },
    // 获取数据列表
    getDataList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== "") {
          obj[key] = this.postData[key];
        }
      }
      pagephMemberRight(obj)
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
    // 详情模块
    detailDialog(row) {
      this.overDetails = true;
      this.ruleForm.rightName = row.rightName;
      this.ruleForm.rightDescription = row.rightDescription;
    },
    openDialog(type, row) {
      this.dialogType = type;
      if (type === "edit") {
        this.ruleForm.rightName = row.rightName;
        this.ruleForm.rightDescription = row.rightDescription;
        this.ruleForm.id = row.id;
      } else {
        this.ruleForm.rightName = "";
        this.ruleForm.rightDescription = "";
        this.ruleForm.id = "";
      }
      this.dialogVisible = true;
    },
    closOPenDialog() {
      this.overDetails = false;
      this.dialogVisible = false;
    },
    // 勾选触发 selects为选择的数据数组
    getSelect(selects) {
      this.selectList = selects;
    },
    // 具体添加方法
    addMethod(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.ruleForm.id);
          if (this.ruleForm.id) {
            updateMemberRight(this.ruleForm)
              .then(res => {
                this.$message.success(this.$t("system.userManage.updata"));
                this.postData.pageNum = 1;
                this.dialogVisible = false;
                this.getDataList();
                this.closOPenDialog();
              })
              .catch(err => {
                this.$message.error(err.message);
              });
          } else {
            addSaveMemberRight(this.ruleForm)
              .then(res => {
                this.$message.success(this.$t("system.userManage.addSuccess"));
                this.postData.pageIndex = 1;
                this.dialogVisible = false;
                this.getDataList();
                this.closOPenDialog();
                this.$refs[formName].resetFields();
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
          dedleteByIds(formData)
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
        return parseTime(val);
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
