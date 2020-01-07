<template>
  <div class="app-container clientUser">
    <div class="search-box">
      <el-form label-width="90px" inline size="small">
        <div>
          <el-form-item :label="$t('system.agreement.agreeName')" >
            <el-input v-model="postData.protocolName" clearable style="width: 200px"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="export" @click="search">{{$t('system.role.search')}}</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="addDialog">{{$t('system.role.add')}}</el-button>
      <el-button type="warning" size="small" @click="agreementDelete()">{{$t('system.role.delete')}}</el-button>
      <!--<el-button type="primary" size="small" class="export">导出excel</el-button>-->
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      :element-loading-text="$t('system.userManage.loading')"
      border
      fit
      size="mini"
      :header-cell-style="{background: '#a7bfee'}" @selection-change="getSelect">
      <el-table-column
        align="center"
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column :label="$t('system.agreement.agreeName')" prop="agreementName" show-overflow-tooltip align="center"/>
      <el-table-column align="center" width="100" :label="$t('system.role.status')" prop="status" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 0 ? 'primary' : 'danger' " size="mini">{{ scope.row.status === 0 ? $t('system.role.active') : $t('system.role.inactive') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.agreement.type')" width="150" prop="agreementType" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column :label="$t('system.agreement.version')" width="150" prop="versionNumber" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column :label="$t('system.role.modifier')" width="150" prop="createUserName" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" width="160" :label="$t('system.userManage.editTime')" prop="createTime" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.createTime | timeFmt}}
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('system.role.operation')" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" class="export" @click="openDetail(row)">{{$t('system.role.view')}}</el-button>
          <el-button type="warning" size="mini" @click="updateDialog(row)">{{$t('system.userManage.editUser')}}</el-button>
          <el-button :type="row.status === 0 ? 'info' : 'danger'" size="mini" @click="previewMethod(row)">
            {{row.status === 0 ? $t('system.role.disable') : $t('system.role.enable')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageIndex" :limit.sync="postData.pageSize" @pagination="getDataList"></Pagination>

    <!-- 详情-->
    <el-dialog :visible.sync="detailModal3" :title="$t('system.agreement.agreementDetail')" center class="menuDialog">
      <el-form label-width="100px" label-position="right" size="small">
        <el-form-item :label="$t('system.agreement.agreeName')">
          <el-input v-model="entityForm.agreementName" class="form-dialog-width2" readonly/>
        </el-form-item>
        <el-form-item :label="$t('system.agreement.version')">
          <el-input v-model="entityForm.versionNumber" class="form-dialog-width2" readonly/>
        </el-form-item>
        <el-form-item :label="$t('system.agreement.type')">
          <el-input v-model="entityForm.agreementType" class="form-dialog-width2" readonly/>
        </el-form-item>
        <el-form-item :label="$t('system.role.status')">
          <el-select v-model="entityForm.status" disabled class="form-dialog-width2">
            <el-option
              v-for="item in options"
              :key="item.status"
              :label="item.label"
              :value="item.status">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('system.agreement.agreementFile')">
          <el-upload
            class="upload-demo"
            ref="upload"
            :limit="1"
            :on-exceed="handleExceed"
            :action="uploadActionUrl"
            :headers="upLoadHeaders"
            :on-success="handleSuccess"
            :on-remove="handleRemove"
            :before-upload="beforeUpload"
            :file-list="filesList">
            <el-button size="small" type="primary">{{$t('system.agreement.clickUpload')}}</el-button>
            <div slot="tip" class="el-upload__tip">{{$t('system.agreement.uploadWord')}}</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="closeDetail">{{$t('system.role.return')}}</el-button>
      </div>
    </el-dialog>
    <!-- 新增-->
    <el-dialog :visible.sync="addProtocolModal" :title="editOrAdd === 1 ? $t('system.agreement.addAgreement') : $t('system.agreement.editAgreement')" center class="menuDialog">
      <el-form ref="rulesFrom" :model="entityForm" label-width="100px" label-position="right" size="small" :rules="entityDataRules">
        <el-form-item :label="$t('system.agreement.agreeName')" prop="agreementName">
          <el-input v-model="entityForm.agreementName" clearable class="form-dialog-width2"/>
        </el-form-item>
        <el-form-item :label="$t('system.agreement.version')" prop="versionNumber">
          <el-input v-model="entityForm.versionNumber" clearable class="form-dialog-width2"/>
        </el-form-item>
        <el-form-item :label="$t('system.agreement.type')" prop="agreementType">
          <el-input v-model="entityForm.agreementType" clearable class="form-dialog-width2"/>
        </el-form-item>
        <el-form-item :label="$t('system.role.status')" prop="status">
          <el-select v-model="entityForm.status" class="form-dialog-width2">
            <el-option
              v-for="item in options"
              :key="item.status"
              :label="item.label"
              :value="item.status">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('system.agreement.agreementFile')">
          <el-upload
            class="upload-demo"
            ref="upload"
            :limit="1"
            :on-exceed="handleExceed"
            :action="uploadActionUrl"
            :headers="upLoadHeaders"
            :on-success="handleSuccess"
            :on-remove="handleRemove"
            :before-upload="beforeUpload"
            :file-list="filesList">
            <el-button size="small" type="primary">{{$t('system.agreement.clickUpload')}}</el-button>
            <div slot="tip" class="el-upload__tip">{{$t('system.agreement.uploadPdf')}}</div>
          </el-upload>
        </el-form-item>
        <el-form-item :label="$t('system.agreement.agreementContent')" prop="agreementType">
          <el-input type="textarea" autosize v-model="entityForm.agreementContent" clearable class="form-dialog-width2" style="height:100px"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :loading="addLoading" v-if="editOrAdd === 1" type="primary" size="small" @click="addMethod('rulesFrom')">{{$t('system.role.seave')}}</el-button>
        <el-button :loading="editLoading" v-if="editOrAdd === 2" type="primary" size="small" @click="editMethod('rulesFrom')">{{$t('system.agreement.update')}}</el-button>
        <el-button type="danger" size="small" @click="closeDetail">{{$t('system.role.return')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { sysProtocolList, enableUserFront, sysProtocolSave, sysProtocolEdit, agreementEnable, sysProtocolDeletes } from '@/api/system'
import treeMenu from '@/mixin/treeMenu'
import { deepClone, parseTime } from '@/utils/index'
import { uploadActionUrl } from '@/api/common'
import { getToken } from '@/utils/auth'

export default {
  components: {
    Pagination
  },
  mixins: [treeMenu],
  data() {
    return {
      selectList: [],
      uploadActionUrl,
      filesList: [],
      imageUrl: '',
      listLoading: true,
      addLoading: false,
      editLoading: false,
      detailModal3: false,
      addProtocolModal: false,
      editOrAdd: 0,
      entityForm: {
        agreementName: '',
        versionNumber: '',
        agreementType: '',
        // agreementStatus: '',
        status: '',
        agreementContent: ''
      },
      detailData: {},
      postData: {
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        protocolName: ''
      },
      areaList: [
        {
          label: '正常',
          id: 0
        },
        {
          label: '禁用',
          id: 1
        }
      ],
      entityDataRules: {
        protocolName: [
          { required: true, message: '请输入协议名称', trigger: 'blur' }
        ],
        protocolVersion: [
          { required: true, message: '请输入协议版本号', trigger: 'blur' }
        ],
        protocolType: [
          { required: true, message: '请输入协议类型', trigger: 'blur' }
        ],
        protocolStatus: [
          { required: true, message: '请选择协议状态', trigger: 'blur' }
        ]
      },
      list: [],
      upLoadHeaders: {
        token: getToken()
      },
      options: [{
        status: 1,
        label: '可用'
      }, {
        status: 0,
        label: '不可用'
      }]
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    // getcommLanguage(arr) {
    //   if (arr.length) {
    //     this.sysUserForm.preferedLanguage = arr.join(',')
    //   } else {
    //     this.sysUserForm.preferedLanguage = ''
    //   }
    // },
    // getSelect(selects) {
    //   this.selectList = selects;
    // },
    getSelect(selects) {
      this.selectList = selects;
    },
    //  删除
    agreementDelete() {
      if (!this.selectList.length) {
        return this.$message(this.$t('system.userManage.option'));
      }
      this.$confirm(this.$t('system.userManage.whether'), this.$t('system.userManage.hint'), {
        confirmButtonText: this.$t("system.role.affirm"),
        cancelButtonText: this.$t("system.role.return"),
        type: 'warning'
      }).then(() => {
        this.deleteIdsForm = this.selectList.map(e => {
          return e.id;
        }).join(",");
        // console.log(this.deleteIdsForm)
        // let formData = new FormData();
        // formData.append(this.deleteIdsForm)
        // console.log(formData)
        sysProtocolDeletes({ ids: this.deleteIdsForm }).then(res => {
          if (res.status === 200) {
            this.$message.success(this.$t("system.userManage.handle"));
          }
          this.getDataList();
        }).catch(err => {
          this.$message.error(err.message);
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t("system.userManage.cancel")
        })
      })
    },
    previewMethod(row) {
      console.log(row)
      let obj = {
        id: row.id,
        type: row.status === 1 ? 0 : 1
      };
      agreementEnable(obj).then(res => {
        console.log(res)
        this.getDataList();
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    changeStatus(row) {
      let obj = {
        type: row.accountStatus === 1 ? 0 : 1,
        accountBid: row.accountBId
      };
      enableUserFront(obj).then(res => {
        this.getDataList();
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    search() {
      this.postData.pageIndex = 1;
      this.getDataList()
    },
    getDataList() {
      let formData = new FormData();
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          formData.append(key, this.postData[key]);
        }
      }
      sysProtocolList(formData).then(res => {
        this.list = res.data.list || [];
        this.postData.total = res.data.total;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message)
      });
    },
    // 新增协议
    addMethod(formName) {
      if (!this.entityForm.templetPath) {
        this.$message.error(this.$t('system.agreement.agreementPDF'));
        return;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addLoading = true;
          sysProtocolSave(this.entityForm).then(res => {
            console.log(res)
            this.addProtocolModal = false;
            this.$message.success(this.$t('system.role.saveAdd'));
            this.addLoading = false;
            this.search();
          }).catch(err => {
            this.addLoading = false;
            this.$message.error(err.message)
          });
        } else {
          this.$message.error(this.$t('system.agreement.check'));
        }
      });
    },
    // 更新协议
    editMethod(formName) {
      if (!this.entityForm.templetPath) {
        this.$message.error(this.$t('system.agreement.agreementPDF'));
        return;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.editLoading = true;
          sysProtocolEdit(this.entityForm).then(res => {
            this.addProtocolModal = false;
            this.$message.info(this.$t('system.userManage.update'));
            this.editLoading = false;
            this.search();
          }).catch(err => {
            this.editLoading = false;
            this.$message.error(err.message)
          });
        } else {
          this.$message.error(this.$t('system.agreement.check'))
        }
      });
    },
    // 查看协议详情
    openDetail(row) {
      this.entityForm = deepClone(row);
      if (this.entityForm.templetPath) {
        this.filesList = [{ name: this.entityForm.templetName, url: this.entityForm.templetPath }];
      }
      this.detailModal3 = true;
    },
    // 打开协议
    addDialog() {
      this.editOrAdd = 1;
      this.filesList = [];
      this.entityForm = {};
      this.addProtocolModal = true;
    },
    // 打开更新协议
    updateDialog(row) {
      this.editOrAdd = 2;
      this.entityForm = deepClone(row);
      if (this.entityForm.templetPath) {
        this.filesList = [{ name: this.entityForm.templetName, url: this.entityForm.templetPath }];
      }
      this.addProtocolModal = true;
    },
    // previewMethod(url) {
    //   window.open(url);
    // },
    closeDetail() {
      this.detailModal3 = false;
      this.addProtocolModal = false;
    },
    beforeAvatarUpload() {
    },
    handleAvatarSuccess() {
    },
    // 上传文件删除
    handleRemove(file, filesList) {
      this.entityForm.filesName = '';
      this.entityForm.filesUrl = '';
      this.entityForm.templetPath = '';
    },
    // 上传成功
    handleSuccess(res, file, filename) {
      this.entityForm.templetPath = res.data.filePath;
      this.entityForm.templetName = file.name;
    },
    handleExceed(files, fileList) {
      this.$message.warning(this.$t('system.agreement.impose1'));
    },
    // 上传之前限制
    beforeUpload(file) {
      let testmsg = file.name.substring(file.name.lastIndexOf('.') + 1);
      const extension3 = testmsg === 'pdf';
      // const extension4 = testmsg === 'docx';
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!extension3) {
        this.$message({
          message: this.$t('system.agreement.PDF'),
          type: 'warning'
        });
      }
      if (!isLt2M) {
        this.$message({
          message: this.$t('system.agreement.impose'),
          type: 'warning'
        });
      }
      return extension3 && isLt2M
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

<style lang="scss">
@import '~@/styles/variables.scss';

.clientUser {
  .divleft {
    text-align: right;
  }

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
      width: 500px;
    }
  }

  .form-dialog-width2 {
    width: 300px !important;
  }

  .form-dialog-width {
    width: 540px !important;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .A {
    width: 350px !important;
    float: left;
  }
}
</style>
