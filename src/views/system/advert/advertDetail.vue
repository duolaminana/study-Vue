<!--suppress ALL -->
<template>
  <div class="app-container form-test">
    <div class="search-box">
      <el-form label-width="126px" inline size="small">
        <el-form-item :label="$t('system.ad.adTitle')">
          <el-input v-model="postData.adTitle" clearable :placeholder="$t('system.ad.adTitle')" style="width: 200px" />
        </el-form-item>
        <el-form-item :label="$t('common.status')">
          <el-select v-model="postData.adStatus" clearable :placeholder="$t('common.status')" style="width: 200px">
            <el-option v-for="(item, index) in areaList" :label="language === 'zh' ? item.labelZh :item.label" :value="item.adStatus" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchData">{{$t('common.search')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="openDialog('add')">{{$t('common.add')}}</el-button>
      <el-button type="primary" size="small" @click="disableClick()">{{$t('common.delete')}}</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="datalist"
      element-loading-text="loading。。。"
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
      <el-table-column property="adImgPath" width="100px" :label="$t('system.ad.img')">
        <template slot-scope="scope">
          <img v-if="scope.row.adImgPath" :src="scope.row.adImgPath" style="border-style: none;width: 70px;height: 70px;">
        </template>
      </el-table-column>

      <el-table-column :label="$t('system.ad.adTitle')" prop="adTitle" show-overflow-tooltip />

      <el-table-column :label="$t('system.ad.positionName')" prop="positionName" show-overflow-tooltip />

      <el-table-column align="center" :label="$t('common.table.updateBy')" width="80px" prop="updateUserId" show-overflow-tooltip />

      <el-table-column align="center" :label="$t('common.table.updateTime')" width="150px" prop="updateTime" >
        <template slot-scope="scope">
          {{scope.row.updateTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="100" :label="$t('common.table.status')" prop="adStatus">
        <template slot-scope="{row}">
          <el-tag :type="row.adStatus === 1 ? 'primary' : 'danger'" size="mini">
            {{ row.adStatus ? $t('common.table.inUse') : $t('common.table.disabled') }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('common.table.actions')" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" class="export" @click="openDetail(row)">{{$t('common.table.view')}}</el-button>
          <el-button type="primary" size="mini" @click="openDialog('edit', row)">{{$t('common.table.edit')}}</el-button>
          <el-button :type="row.adStatus === 1 ? 'info' : 'danger'" size="mini" @click="changeStatus(row)">
            {{row.adStatus === 1 ? $t('common.table.disable') : $t('common.table.enable')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList"></Pagination>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='add'?$t('system.ad.addContent'): $t('system.ad.editContent')"
               center @closed="clearData" width="840px">
      <el-form ref="addCompany" :model="menuData" label-width="140px" label-position="right" inline size="small" :rules="menuDataRules">
        <el-form-item :label="$t('system.ad.adTitle')" prop="adTitle">
          <el-input v-model="menuData.adTitle" clearable :placeholder="$t('system.ad.adTitle')" style="width: 500px" />
        </el-form-item>
        <el-form-item :label="$t('system.ad.positionName')" prop="positionBId">
          <el-select v-model="menuData.positionBId" clearable :placeholder="$t('system.ad.positionName')" style="width: 300px">
            <el-option v-for="(item, index) in positionNameList" :label="item.positionName" :value="item.bid" :key="index" >
              {{item.positionName}}
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('common.table.status')" prop="adStatus">
          {{ menuData.adStatus === 1 ? $t('common.table.inUse') : $t('common.table.disabled') }}
        </el-form-item>

        <el-form-item :label="$t('system.ad.uploadImg')" prop="adImgPath">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :action="uploadActionUrl"
            style="border: 1px dashed #d9d9d9;!important;height: 178px;width: 178px"
            :before-upload="beforeAvatarUpload"
            :on-success="handleSuccess"
            :on-remove="handleRemove">
            <img v-if="menuData.adImgPath" :src="menuData.adImgPath" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <div class="el-upload__tip">{{$t('system.ad.explain')}}</div>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="confirmAdd('addCompany', dialogType === 'add' ? 1 : 2)">{{$t('common.buttonText.confirm')}}</el-button>
        <el-button type="danger" size="small" @click="dialogVisible=false">{{$t('common.buttonText.cancel')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="detailModal" :title="$t('system.ad.contentDetail')" center @closed="clearData" width="840px">
      <el-form ref="addCompany" :model="menuData" label-width="140px" label-position="right" inline size="small" :rules="menuDataRules">
        <el-form-item :label="$t('system.ad.adTitle')" prop="adTitle">
          <el-input v-model="menuData.adTitle" clearable :placeholder="$t('system.ad.adTitle')" style="width: 500px" readonly/>
        </el-form-item>
        <el-form-item :label="$t('system.ad.positionName')" prop="positionBId">
          <el-select v-model="menuData.positionBId" clearable disabled style="width: 300px" readonly>
            <el-option v-for="(item, index) in positionNameList" :disabled="true" :label="item.positionName" :value="item.bid" :key="index" style="width: 250px" >
              {{item.positionName}}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('common.status')" prop="adStatus">
          {{ menuData.adStatus === 1 ? $t('common.table.inUse') : $t('common.table.disabled') }}
        </el-form-item>

        <el-form-item :label="$t('system.ad.uploadImg')" prop="adImgPath">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :action="uploadActionUrl"
            style=" border: 1px dashed #d9d9d9;!important;height: 178px;width: 178px"
            :before-upload="beforeAvatarUpload"
            :on-success="handleSuccess"
            :on-remove="handleRemove"
            disabled>
            <img v-if="menuData.adImgPath" :src="menuData.adImgPath" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <div class="el-upload__tip">{{$t('system.ad.explain')}}</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="detailModal=false">{{$t('common.buttonText.close')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import Pagination from '@/components/Pagination'
import { selectAdvertListApi, selectAdvertPositionListApi, saveAdvertApi, updateAdvertApi, updateAdvertStatusApi, delectByAdvertIdApi } from '@/api/system';
import { deepClone } from '@/utils/index'
import { parseTime } from '@/utils/index'
import { uploadActionUrl } from '@/api/common';
export default {
  components: {
    Pagination
  },
  filters: {
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
    }
  },
  data() {
    return {
      uploadActionUrl,
      dialogImageUrl: '',
      datalist: [],
      list: null,
      listLoading: true,
      dialogVisible: false,
      dialogVisible2: false,
      detailModal: false,
      dialogType: '',
      indent: 20,
      selectList: [],
      reviewForm: {
        positionIds: ''
      },
      expandArr: [1036013, 1036014],
      menuData: {
        adTitle: '',
        positionBId: '',
        positionName: '',
        adImgPath: '',
        adImgUuid: '',
        adStatus: 1
      },
      showRecordList: [],
      menuDataRules: {
        adTitle: [
          { required: true, message: 'The name of the advertisement must be filled in.', trigger: 'change' }
        ],
        positionBId: [
          { required: true, message: 'Please select the advertisement position.', trigger: 'change' }
        ]
      },
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        adTitle: '',
        adStatus: ''
      },
      areaList: [
        {
          labelZh: '使用中',
          label: 'Active',
          adStatus: 1
        },
        {
          labelZh: '已禁用',
          label: 'Disabled',
          adStatus: 0
        }
      ],
      positionNameList: []
    }
  },
  created() {
    this.getDataList();
    this.getPositionNameList()
  },
  methods: {
    clearData() {
      this.menuData.adTitle = '';
      this.menuData.positionBId = '';
      this.menuData.positionName = '';
      this.menuData.adStatus = 1;
      this.menuData.adImgPath = '';
    },
    searchData() {
      this.postData.pageNum = 1;
      this.getDataList()
    },
    getDataList() { // 广告内容列表
      selectAdvertListApi(this.postData).then(res => {
        this.datalist = res.data.list;
        this.postData.total = res.data.total;
      }).catch(err => {
        this.$message({ message: err.message });
      });
      this.listLoading = false;
    },
    getPositionNameList() { // 广告位置列表
      let data = {
        pageNum: 1,
        pageSize: 9999
      };
      selectAdvertPositionListApi(data).then(res => {
        this.positionNameList = res.data.list;
      }).catch(err => {
        this.$message({ message: err.message });
      });
      this.listLoading = false;
    },
    openDetail(row) {
      this.menuData = deepClone(row);
      this.detailModal = true;
    },
    openDialog(type, row) {
      this.dialogType = type;
      if (type === 'edit') {
        this.menuData = deepClone(row);
      }
      this.dialogVisible = true;
    },
    confirmAdd(formName, type) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (type === 1) {
            saveAdvertApi(this.menuData).then(res => {
              this.$message.success('Add Success');
              this.$refs[formName].resetFields();
              this.getDataList();
              this.dialogVisible = false;
            }).catch(err => {
              this.listLoading = false;
              this.$message.error(err.message)
            });
          } else {
            updateAdvertApi(this.menuData).then(res => {
              this.$message.success('Update Success');
              this.$refs[formName].resetFields();
              this.getDataList();
              this.dialogVisible = false;
            }).catch(err => {
              this.listLoading = false;
              this.$message.error(err.message)
            });
          }
        } else {
          this.$message.warning('Please fill in the complete.')
          return false;
        }
      });
    },
    changeStatus(row) {
      let obj = {
        adStatus: row.adStatus === 1 ? 0 : 1,
        id: row.id
      };
      updateAdvertStatusApi(obj).then(res => {
        this.$message.success(res.message)
        this.getDataList();
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    // 勾选触发 selects为选择的数据数组
    getSelect(selects) {
      this.selectList = selects;
    },
    disableClick() {
      if (!this.selectList.length) {
        return this.$message('Please Select the Data.');
      }
      this.$confirm('Are you sure to delete?', 'Tips', {
        confirmButtonText: this.$t('common.buttonText.confirm'),
        cancelButtonText: this.$t('common.buttonText.cancel'),
        type: 'warning',
        center: true
      }).then(() => {
        this.reviewForm.adIds = this.selectList.map(e => {
          return e.id;
        }).join(',');
        delectByAdvertIdApi(this.reviewForm).then(res => {
          if (res.status === 200) {
            this.$message.success('Delete Success!');
          }
          this.getDataList();
        }).catch(err => {
          this.$message.error(err.message);
        });
      }).catch(() => {
      });
    },
    // 上传成功
    handleSuccess(res, file, filename) {
      this.menuData.adImgUuid = res.data.UUID;
      this.menuData.adImgPath = res.data.filePath;
    },
    // 删除图片
    handleRemove(file, fileList) {
      this.menuData.adImgUuid = '';
      this.menuData.adImgPath = '';
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG && !isPNG) {
        this.$message.error('Upload pictures can only be in JPG or PNG format!');
      }
      if (!isLt2M) {
        this.$message.error('Upload picture size can not exceed 2MB!');
      }
      return (isJPG || isPNG) && isLt2M;
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables.scss';
  .form-test {
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
    .avatar-uploader .el-upload {
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
  }
</style>

