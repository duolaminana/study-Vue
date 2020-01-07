<template>
  <div class="app-container clientUser">
    <div class="search-box">
      <el-form label-width="90px" inline size="small">
        <div>
          <el-form-item :label="$t('system.agreement.agreeName')">
            <el-input v-model="postData.agreementName" clearable style="width: 200px"/>
          </el-form-item>
          <el-form-item :label="$t('system.agreement.signer')">
            <el-input v-model="postData.signer" clearable style="width: 200px"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="export" @click="searchRole">{{$t('system.role.search')}}</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="topBtns">
      <!--<el-button type="primary" size="small" @click="addDialog">新增</el-button>-->
      <!--<el-button type="primary" size="small" class="export">导出excel</el-button>-->
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      :element-loading-text="$t('system.role.loading')"
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
      <el-table-column align="center" :label="$t('system.agreement.version')" width="100" prop="versionNumber" show-overflow-tooltip>
      </el-table-column>
      <el-table-column align="center" :label="$t('system.agreement.signer')" width="100" prop="signer"/>
      <el-table-column align="center" :label="$t('system.agreement.signedTime')" width="150" prop="signedTime" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.signedTime | timeFmt}}
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.agreement.fileName')" align="center" prop="agreementName" show-overflow-tooltip/>
      <el-table-column align="center" :label="$t('system.role.status')" width="120" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" class="export" @click="openDetail(row)">{{$t('system.agreement.view')}}</el-button>
          <el-button type="warning" size="mini" @click="previewMethod(row.filePath)">{{$t('system.agreement.download')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination :total="postData.total" :page.sync="postData.pageIndex" :limit.sync="postData.pageSize" @pagination="getDataList"></Pagination>
    <!-- 详情-->
    <el-dialog :visible.sync="detailModal3" :title="$t('system.agreement.agreementDetail')" center width="500px">
      <el-form label-width="100px" label-position="right" size="small">
        <el-form-item :label="$t('system.agreement.agreeName')">
          <el-input v-model="entityForm.agreementName" clearable class="form-dialog-width2" readonly/>
        </el-form-item>
        <el-form-item :label="$t('system.agreement.version')">
          <el-input v-model="entityForm.versionNumber" clearable class="form-dialog-width2" readonly/>
        </el-form-item>
        <el-form-item :label="$t('system.agreement.signer')">
          <el-input v-model="entityForm.signer" clearable class="form-dialog-width2" readonly/>
        </el-form-item>
        <el-table-column align="center" :label="$t('system.agreement.signedTime')" width="150" prop="signedTime" show-overflow-tooltip>
          <!--<template slot-scope="scope">-->
            <!--{{scope.row.signedTime | timeFmt}}-->
          <!--</template>-->
        </el-table-column>
        <el-form-item :label="$t('system.agreement.fileName')">
          <el-input v-model="entityForm.agreementName" clearable class="form-dialog-width2" readonly/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="closeDetail">{{$t('system.role.return')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { sysSigningList, enableUserFront } from '@/api/system'
import treeMenu from '@/mixin/treeMenu'
import { deepClone, parseTime } from '@/utils/index'

export default {
  components: {
    Pagination
  },
  mixins: [treeMenu],
  data() {
    return {
      imageUrl: '',
      listLoading: true,
      detailModal3: false,
      entityForm: {},
      detailData: {},
      selectList: [],
      postData: {
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        custAccount: '',
        agreementName: '',
        createUserName: '',
        countryCode: '',
        companyName: '',
        status: '',
        signer: '',
        signedTime: ''
      },
      areaList: [
        {
          label: this.$t('system.role.active'),
          id: 0
        },
        {
          label: this.$t('system.role.inactive'),
          id: 1
        }
      ],
      list: []
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    getSelect(selects) {
      this.selectList = selects;
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
    searchRole() {
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
      sysSigningList(formData).then(res => {
        this.list = res.data.list || [];
        this.postData.total = res.data.total;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message)
      });
    },
    previewMethod(url) {
      if (url) {
        window.open(url);
      }
    },
    openDetail(row) {
      this.entityForm = deepClone(row);
      this.detailModal3 = true;
    },
    closeDetail() {
      this.detailModal3 = false;
    },
    beforeAvatarUpload() {
    },
    handleAvatarSuccess() {
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
