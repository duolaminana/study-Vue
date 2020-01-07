<template>
  <div class="app-container roleManagement">
    <div class="search-box">
      <el-form label-width="90px" inline size="small">
        <el-form-item :label="$t('member.level.levelName')">
          <el-input v-model="postData.levelName" style="width: 200px" />
        </el-form-item>
        <el-form-item :label="$t('system.role.status')">
          <el-select v-model="postData.levelStatus" clearable style="width: 200px">
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
      <el-button type="primary" size="small" @click="memberSort">{{$t('member.level.sequence')}}</el-button>
      <el-button type="primary" size="small" @click="openDialog('add')">{{$t('system.role.add')}}</el-button>
      <el-button type="primary" size="small" @click="deleteBatchMethod()">{{$t('system.role.delete')}}</el-button>
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
      <el-table-column :label="$t('member.level.levelName')" prop="levelName" show-overflow-tooltip />
      <el-table-column :label="$t('member.level.members')" prop="memberNum" show-overflow-tooltip align="center" />
      <el-table-column :label="$t('system.role.modifier')" prop="updateUserName" show-overflow-tooltip align="center" />
      <el-table-column align="center" :label="$t('system.userManage.editTime')" width="160px" prop="createTime" show-overflow-tooltip>
      <template slot-scope="scope">
        {{scope.row.createTime | timeFmt}}
      </template>
      </el-table-column>
      <el-table-column
        align="center"
        width="80"
        :label="$t('system.role.status')"
        prop="levelStatus"
      >
        <template slot-scope="scope">
          <el-tag :type="scope.row.levelStatus === 0 ? 'primary' : 'danger' " size="mini">
            {{ scope.row.levelStatus
            === 0 ?
            $t('system.role.active') : $t('system.role.inactive') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('system.role.operation')" width="210" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" class="export" @click="detailDialog(row)">{{$t('system.role.view')}}</el-button>
          <el-button
            type="primary"
            size="mini"
            @click="openDialog('edit', row)"
          >{{$t('system.userManage.editUser')}}</el-button>
          <el-button
          :type="row.levelStatus === 1 ? 'info' : 'danger'"
          size="mini"
          @click="changeMethod(row)"
          >{{row.levelStatus === 1 ? $t('system.role.disable') : $t('system.role.enable')}}</el-button>
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
      :title="dialogType==='add'? $t('member.level.addLevel'):$t('member.level.editLevel')"
      center
      width="1100px"
    >
      <el-form
        :model="ruleForm"
        status-icon
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        :inline="true"
        :rules="rules"
      >
        <el-form-item :label="$t('member.level.levelName')" prop="levelName" >
          <el-input v-model="ruleForm.levelName" style="width:600px"></el-input>
        </el-form-item>
        <el-form-item :label="$t('member.level.card')" prop="cardTemplatePath" style="width:500px">
          <el-upload
            class="upload-demo"
            :action="uploadActionUrl"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            v-model="ruleForm.cardTemplatePath"
            list-type="picture">
            <el-button size="small" type="primary">{{$t('member.level.clickUplode')}}</el-button>
            <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
          </el-upload>
        </el-form-item >
        <el-form-item :label="$t('member.level.badge')" prop="badgeTemplatePath" style="width:500px">
          <el-upload
            class="upload-demo"
            :action="uploadActionUrl"
            :on-success="handleMemberSuccess"
            :before-upload="beforeAvatarUpload"
            v-model="ruleForm.badgeTemplatePath"
            list-type="picture">
            <el-button size="small" type="primary">{{$t('member.level.clickUplode')}}</el-button>
            <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
          </el-upload>
        </el-form-item>
        <el-form-item :label="$t('member.level.rights')" prop="memberLevelRightList" >
          <el-checkbox-group v-model="checkList" style="width:600px" @change="changeDetermine">
              <el-checkbox v-model="ruleForm.memberLevelRightList" :label="item.bid" v-for="(item,index) in rightNameList" :key="index" >{{item.rightName}} </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
       <div>
         <el-form-item :label="$t('system.role.status')" prop="levelStatus">
           <el-select v-model="ruleForm.levelStatus" clearable style="width: 200px">
             <el-option
               v-for="(item, index) in areaList"
               :label="item.label"
               :value="item.id"
               :key="index"
             ></el-option>
           </el-select>
         </el-form-item>
       </div>
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
      :title="$t('member.level.detailLevel')"
      center
      width="1100px"
    >
      <el-form
        :model="sysUserForm"
        status-icon
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        :inline="true"
      >
        <el-form-item :label="$t('member.level.levelName')" >
          <el-input v-model="sysUserForm.levelName" style="width:600px" readonly></el-input>
        </el-form-item>
        <el-form-item :label="$t('member.level.card')" prop="cardTemplateName" style="width:500px">
          <div class="avatar">
            <el-upload
              disabled
              class="avatar-uploader"
              :action="uploadActionUrl"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="sysUserForm.cardTemplatePath" :src="sysUserForm.cardTemplatePath" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </el-form-item >
        <el-form-item :label="$t('member.level.badge')" prop="badgeTemplateName" style="width:500px">
          <div class="avatar">
            <el-upload
              disabled
              class="avatar-uploader"
              :action="uploadActionUrl"
              :show-file-list="false"
              :on-success="handleMemberSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="sysUserForm.badgeTemplatePath" :src="sysUserForm.badgeTemplatePath" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item :label="$t('member.level.rights')" prop="memberLevelRightList" readonly>
          <el-checkbox-group v-model="checkList" style="width:600px" @change="checkedList" disabled>
            <template slot-scope="row">
              <el-checkbox :label="item.bid" v-for="(item,index) in sysUserForm.memberRightVos" :key="index"> {{item.rightName}}</el-checkbox>
            </template>
          </el-checkbox-group>
        </el-form-item>
        <div>
          <el-form-item :label="$t('system.role.status')" prop="levelStatus">
            {{sysUserForm.levelStatus ? $t('system.userManage.inDisable') : $t('system.userManage.inEmploy')}}
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="closOPenDialog">{{$t('system.role.return')}}</el-button>
      </div>
    </el-dialog>
    <!--排序-->
    <el-dialog :visible.sync="editMembership" :title="$t('member.level.editLevelOrder')" center width="700px">
      <el-table
        :data="list"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        v-loading="listLoading"
        default-expand-all
        fit
        size="mini"
        @selection-change="getSelect"
        :element-loading-text="$t('system.userManage.lodding')"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <!--<el-table-column align="center" type="selection" width="55"></el-table-column>-->
        <el-table-column prop="levelName" :label="$t('member.level.levelName')" show-overflow-tooltip></el-table-column>
        <el-table-column
          align="center"
          :label="$t('member.level.sequence')"
          show-overflow-tooltip
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{row}">
            <el-button size="mini" @click="stick(row)">
              <svg-icon class-name="svgClass" icon-class="shuangjiantoushang" size="18" />
            </el-button>
            <el-button size="mini" @click="shiftUp(row)">
              <svg-icon class-name="svgClass" icon-class="jiantoushang" size="18" />
            </el-button>
            <el-button size="mini" @click="moveDown(row)">
              <svg-icon class-name="svgClass" icon-class="jiantouxia" size="18" />
            </el-button>
            <el-button size="mini" @click="profileMode(row)">
              <svg-icon class-name="svgClass" icon-class="shuangjiantouxia" size="18" />
            </el-button>
          </template>
        </el-table-column>
      </el-table>
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
  pagephMemberLevel,
  saveMemberLevel,
  deleteMemberByIds,
  detailMemberLevel,
  updateMemberLevel,
  updateMemberLevelStatus,
  listMemberRight,
  updateByType
} from "@/api/member";
export default {
  components: {
    Pagination
  },
  data() {
    return {
      checkList: [],
      rightNameList: [],
      uploadActionUrl,
      ruleForm: {
        memberLevelRightList: [],
        cardTemplatePath: "",
        badgeTemplatePath: ""
      },
      checkedSort: [],
      overDetails: false,
      fileList: [],
      sysUserForm: {
        memberRightVos: []
      },
      listLoading: true,
      addLoading: false,
      detialModel: false,
      dialogVisible: false,
      detailModal: false,
      editMembership: false,
      selectList: [],
      dialogType: "",
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        levelName: "",
        levelStatus: ""
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
        levelName: [
          { required: true, message: this.$t('member.level.PleaseLevelName'), trigger: 'blur' }
        ]
      }
    };
  },
  created() {
    this.getDataList();
  },
  methods: {
    changeDetermine() {
      console.log(this.checkList)
    },
    memberSort() {
      this.editMembership = true;
    },
    stick(row) {
      console.log(row);
      updateByType({
        bId: row.bid,
        type: 1
      }).then(res => {
        this.getDataList();
      });
    },
    shiftUp(row) {
      updateByType({
        bId: row.bid,
        type: 2
      }).then(res => {
        this.getDataList();
      });
    },
    moveDown(row) {
      updateByType({
        bId: row.bid,
        type: 3
      }).then(res => {
        this.getDataList();
      });
    },
    profileMode(row) {
      updateByType({
        bId: row.bid,
        type: 4
      }).then(res => {
        this.getDataList();
      });
    },
    checkedList() {
      console.log(this.checkedSort)
    },
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
      pagephMemberLevel(obj)
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
      detailMemberLevel({ bid: row.bid }).then(res => {
        this.sysUserForm = res.data;
        this.checkList = res.data.memberRightVos.filter(e => {
          // console.log(e)
          return e.check
        }).map(e => {
          console.log(e)
          return e.bid;
        })
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 编辑和新增模块
    openDialog(type, row) {
      this.dialogType = type;
      listMemberRight().then(res => {
        // console.log(res)
        this.rightNameList = res.data
      })
      if (type === "edit") {
        detailMemberLevel({ bid: row.bid })
          .then(res => {
            this.ruleForm = Object.assign(this.ruleForm, res.data);
            this.checkList = res.data.memberRightVos.filter(e => {
              // console.log(e)
              return e.check
            }).map(e => {
              console.log(e)
              return e.bid;
            })
          })
          .catch(err => {
            this.$message.error(err.message);
          });
      } else {
        this.ruleForm = {};
        this.checkList = []
      }
      this.dialogVisible = true;
    },
    closOPenDialog() {
      this.dialogVisible = false;
      this.overDetails = false
      this.editMembership = false
    },
    // 勾选触发 selects为选择的数据数组
    getSelect(selects) {
      this.selectList = selects;
    },
    // 具体添加方法
    addMethod(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.ruleForm.memberLevelRightList = this.checkList.map(e => {
            return {
              memberRightBId: e
            }
          });
          if (this.ruleForm.id) {
            updateMemberLevel(this.ruleForm)
              .then(res => {
                this.$message.success(this.$t("system.userManage.updata"));
                this.postData.pageNum = 1;
                this.dialogVisible = false;
                this.getDataList();
                this.closOPenDialog();
                this.checkList = []
                this.$refs[formName].resetFields()
              })
              .catch(err => {
                this.$message.error(err.message);
              });
          } else {
            saveMemberLevel(this.ruleForm)
              .then(res => {
                this.$message.success(this.$t("system.userManage.addSuccess"));
                this.postData.pageNum = 1;
                this.dialogVisible = false;
                this.getDataList();
                this.closOPenDialog();
                this.checkList = []
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
      let row = this.selectList[0];
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
          this.sub = row.sub;
          formData.append("ids", this.deleteIdsForm);
          if (this.sub === 0 && this.sub !== '') {
            deleteMemberByIds(formData)
              .then(res => {
                if (res.status === 200) {
                  this.$message.success(this.$t("system.userManage.handle"));
                }
                this.getDataList()
              })
              .catch(err => {
                this.$message.error(err.message);
              });
          } else {
            this.$message.error(this.$t('member.category.subordinate'))
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("system.userManage.cancel")
          });
        });
    },

    // 禁用或启用
    changeMethod(row) {
      console.log(row)
      let obj = {
        levelStatus: row.levelStatus === 0 ? 1 : 0,
        id: row.id
      }
      console.log(obj)
      updateMemberLevelStatus(obj)
        .then(res => {
          this.searchData();
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    handleAvatarSuccess(res, file) {
      this.ruleForm.cardTemplatePath = res.data.filePath
    },
    handleMemberSuccess(res, file) {
      this.ruleForm.badgeTemplatePath = res.data.filePath;
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
