<!--suppress ALL -->
<template>
  <div class="app-container form-test">
    <div class="search-box">
      <el-form label-width="126px" inline size="small">
        <div>
          <el-form-item :label="$t('system.ad.positionName')">
            <el-input v-model="postData.positionName" clearable :placeholder="$t('system.ad.positionName')" style="width: 200px" />
          </el-form-item>
          <el-form-item :label="$t('system.ad.intermediary')">
            <el-select v-model="postData.intermediary" clearable :placeholder="$t('system.ad.intermediary')" style="width: 200px">
              <el-option v-for="(item, index) in mediumList" :label="item.label" :value="item.intermediary" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('system.ad.adSequence')">
            <el-input v-model="postData.adSequence" clearable :placeholder="$t('system.ad.adSequence')" style="width: 200px" />
          </el-form-item>
        </div>
        <div>
          <el-form-item :label="$t('system.ad.beginTime')" prop="reBeginTime">
            <el-date-picker
            v-model="postData.startDate"
            type="datetime"
            style="width: 200px"
            placeholder="select Date">
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('system.ad.endTime')" prop="reBeginTime">
            <el-date-picker
              v-model="postData.endDate"
              type="datetime"
              style="width: 200px"
              placeholder="select Date">
            </el-date-picker>
          </el-form-item>
          <el-form-item :label="$t('common.status')">
            <el-select v-model="postData.adSchedulingStatus" clearable :placeholder="$t('common.status')" style="width: 200px">
              <el-option v-for="(item, index) in areaList" :label="language === 'zh' ? item.labelZh : item.label" :value="item.adSchedulingStatus" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="export" @click="searchData">{{$t('common.search')}}</el-button>
          </el-form-item>
        </div>

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

      <el-table-column :label="$t('system.ad.positionName')" prop="positionName" show-overflow-tooltip />

      <el-table-column :label="$t('system.ad.adTitle')" prop="adTitle" show-overflow-tooltip />

      <el-table-column align="center" :label="$t('system.ad.intermediary')" width="100px" prop="intermediary" show-overflow-tooltip>
        <template slot-scope="{row}">
          {{ row.intermediary | intermediaryName }}
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('system.ad.adSequence')" prop="adSequence" width="125px" show-overflow-tooltip />

      <el-table-column align="center" :label="$t('common.table.beginTime')" width="150px" prop="startDate" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.startDate | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('common.table.endTime')" width="150px" prop="endDate" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.endDate | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="100" :label="$t('common.table.status')" prop="adSchedulingStatus">
        <template slot-scope="{row}">
          <el-tag :type="row.adSchedulingStatus === 1 ? 'primary' : 'danger'" size="mini">
            {{ row.adSchedulingStatus ? $t('common.table.inUse') : $t('common.table.disabled') }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('common.table.actions')" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" class="export" @click="openDetail(row)">{{$t('common.table.view')}}</el-button>
          <el-button type="primary" size="mini" @click="openDialog('edit', row)">{{$t('common.table.edit')}}</el-button>
          <el-button :type="row.adSchedulingStatus === 1 ? 'info' : 'danger'" size="mini" @click="changeStatus(row)">
            {{row.adSchedulingStatus === 1 ? $t('common.table.disable') : $t('common.table.enable')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList"></Pagination>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='add'?$t('system.ad.addScheduling'): $t('system.ad.editScheduling')"
               center @closed="clearData" width="600px">
      <el-form ref="addCompany" :model="menuData" label-width="140px" label-position="right" size="small" :rules="menuDataRules">
        <el-form-item :label="$t('system.ad.positionName')" prop="adPositionBId">
          <el-select v-model="menuData.adPositionBId" clearable
                     :placeholder="$t('system.ad.positionName')"
                     style="width: 300px"
                     :disabled="Boolean(menuData.id)"
                     @change="getAdPositionContentFun">
            <el-option v-for="(item, index) in positionNameList" :label="item.positionName" :value="item.bid" :key="index" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('system.ad.intermediary')" prop="intermediary">
          <el-select v-model="menuData.intermediary" clearable :placeholder="$t('system.ad.intermediary')" style="width: 300px">
            <el-option v-for="(item, index) in mediumList" :label="item.label" :value="item.intermediary" :key="index"></el-option>
            <!--<el-option v-for="(item, index) in intermediaryList" :value="item.intermediary" :key="index"></el-option>-->
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('system.ad.adSequence')" prop="adSequence">
          <el-input-number :min="1" :step="1" :precision="0" v-model="menuData.adSequence" controls-position="right" clearable :placeholder="$t('system.ad.adSequence')" style="width: 300px" class="form-dialog-width" />
        </el-form-item>
        <el-form-item :label="$t('system.ad.adTitle')" prop="sysAdDetailBId">
          <el-select v-model="menuData.sysAdDetailBId" :disabled="Boolean(menuData.id)" clearable :placeholder="$t('system.ad.adTitle')" style="width: 300px">
            <el-option v-for="(item, index) in adTitleList" :label="item.adTitle" :value="item.bid" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('system.ad.beginTime')" prop="startDate">
          <el-date-picker
            v-model="menuData.startDate"
            type="datetime"
            style="width: 300px"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('system.ad.endTime')" prop="endDate">
          <el-date-picker
            v-model="menuData.endDate"
            type="datetime"
            style="width: 300px"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('common.table.status')" prop="adSchedulingStatus">
          {{ menuData.adSchedulingStatus === 1 ? $t('common.table.inUse') : $t('common.table.disabled') }}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="confirmAdd('addCompany', dialogType === 'add' ? 1 : 2)">{{$t('common.buttonText.confirm')}}</el-button>
        <el-button type="danger" size="small" @click="dialogVisible=false">{{$t('common.buttonText.cancel')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="detailModal" :title="$t('system.ad.schedulingDetail')" center @closed="clearData" width="600px">
      <el-form ref="addCompany" :model="menuData" label-width="140px" label-position="right" size="small" :rules="menuDataRules">
        <el-form-item :label="$t('system.ad.positionName')" prop="adPositionBId">
          <el-select v-model="menuData.adPositionBId" clearable
                     :placeholder="$t('system.ad.positionName')"
                     style="width: 300px"
                     @change="getAdPositionContentFun"
                      disabled>
            <el-option v-for="(item, index) in positionNameList" :label="item.positionName" :value="item.bid" :key="index" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('system.ad.intermediary')" prop="intermediary">
          <el-select v-model="menuData.intermediary" clearable :placeholder="$t('system.ad.intermediary')" disabled style="width: 300px">
            <!--<el-option v-for="(item, index) in intermediaryList" :label="item.label" :value="item.intermediary" :key="index">-->
            <!--{{item.label}}-->
            <!--</el-option>-->
            <el-option v-for="(item, index) in mediumList" :label="item.label" :value="item.intermediary" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('system.ad.adSequence')" prop="adSequence">
          <el-input-number :min="1" :step="1" :precision="0" v-model="menuData.adSequence" disabled controls-position="right" clearable :placeholder="$t('system.ad.adSequence')" style="width: 300px" class="form-dialog-width" />
        </el-form-item>
        <el-form-item :label="$t('system.ad.adTitle')" prop="sysAdDetailBId">
          <el-select v-model="menuData.sysAdDetailBId" clearable :placeholder="$t('system.ad.adTitle')" disabled style="width: 300px">
            <el-option v-for="(item, index) in adTitleList" :label="item.adTitle" :value="item.bid" :key="index" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('system.ad.beginTime')" prop="startDate">
          <el-date-picker
            v-model="menuData.startDate"
            type="datetime"
            disabled
            style="width: 300px"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('system.ad.endTime')" prop="endDate">
          <el-date-picker
            v-model="menuData.endDate"
            type="datetime"
            disabled
            style="width: 300px"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('common.table.status')" prop="adSchedulingStatus">
          {{ menuData.adSchedulingStatus === 1 ? $t('common.table.inUse') : $t('common.table.disabled') }}
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
import {
  selectAdSchedulingListApi,
  selectAdvertPositionListApi,
  saveAdSchedulingApi,
  updateAdSchedulingApi,
  updateSchedulingStatusApi,
  delectAdSchedulingApi,
  getListApi
} from '@/api/system';
import { deepClone } from '@/utils/index'
import { parseTime } from '@/utils/index'
import { uploadActionUrl } from '@/api/common';
export default {
  components: {
    Pagination
  },
  filters: {
    intermediaryName(val) {
      switch (val) {
        // 媒介：1PC、2APP、3H5
        case "1": return 'PC';
        case "2": return 'APP';
        case "3": return 'H5';
        default:
          return '';
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
      idsForm: {
        ids: ''
      },
      expandArr: [1036013, 1036014],
      menuData: {
        id: '',
        adPositionBId: '',
        intermediary: '',
        adSequence: 1,
        sysAdDetailBId: '',
        startDate: '',
        endDate: '',
        adSchedulingStatus: 1,
        pcMedium: '',
        appMedium: '',
        h5Medium: ''
      },
      showRecordList: [],
      menuDataRules: {
        sysAdDetailBId: [
          { required: true, message: 'The name of the advertisement Content must be filled in.', trigger: 'change' }
        ],
        adPositionBId: [
          { required: true, message: 'Please select the advertisement position.', trigger: 'change' }
        ],
        intermediary: [
          { required: true, message: 'Please select the intermediary', trigger: 'change' }
        ],
        adSequence: [
          { required: true, message: 'The rolling Sequence must be filled in', trigger: 'change' }
        ],
        startDate: [
          { required: true, message: 'Please select the begin Time', trigger: 'change' }
        ],
        endDate: [
          { required: true, message: 'Please select the end Time', trigger: 'change' }
        ]
      },
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        positionName: '',
        intermediary: '',
        adSequence: '',
        startDate: '',
        endDate: '',
        adSchedulingStatus: ''
      },
      areaList: [
        {
          labelZh: '使用中',
          label: 'Active',
          adSchedulingStatus: 1
        },
        {
          labelZh: '已禁用',
          label: 'Disabled',
          adSchedulingStatus: 0
        }
      ],
      mediumList: [
        // 媒介：1PC、2APP、3H5
        {
          label: 'PC',
          intermediary: "1"
        },
        {
          label: 'APP',
          intermediary: "2"
        },
        {
          label: 'H5',
          intermediary: "3"
        }
      ],
      intermediaryList: [],
      positionNameList: [],
      adTitleList: []
    }
  },
  created() {
    this.getDataList();
    this.getPositionNameList()
  },
  methods: {
    clearData() {
      this.menuData.id = '';
      this.menuData.adPositionBId = '';
      this.menuData.intermediary = '';
      this.menuData.adSequence = 1;
      this.menuData.adSchedulingStatus = 1;
      this.menuData.sysAdDetailBId = '';
      this.menuData.startDate = '';
      this.menuData.endDate = '';
    },
    searchData() {
      this.postData.pageNum = 1;
      this.getDataList()
    },
    getDataList() { // 广告发布列表
      selectAdSchedulingListApi(this.postData).then(res => {
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
    // 通过广告位置bid获取广告内容集合
    getAdPositionContentFun(val) {
      if (val) {
        let obj = this.positionNameList.filter(e => e.bid === val)[0];
        this.intermediaryList = obj;
        console.info("this.intermediaryList集合>>>>{}", this.intermediaryList)
        getListApi({ bId: val }).then(res => {
          this.adTitleList = res.data;
        }).catch(err => {
          this.$message.error(err.message);
        });
      }
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
            saveAdSchedulingApi(this.menuData).then(res => {
              this.$message.success('Add Success');
              this.$refs[formName].resetFields();
              this.getDataList();
              this.dialogVisible = false;
            }).catch(err => {
              this.listLoading = false;
              this.$message.error(err.message)
            });
          } else {
            updateAdSchedulingApi(this.menuData).then(res => {
              this.$message.success('Update Sucess');
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
        adSchedulingStatus: row.adSchedulingStatus === 1 ? 0 : 1,
        id: row.id
      };
      updateSchedulingStatusApi(obj).then(res => {
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
        return this.$message('Please Select the Data');
      }
      this.$confirm('Are you sure to delete?', 'Tips', {
        confirmButtonText: this.$t('common.buttonText.confirm'),
        cancelButtonText: this.$t('common.buttonText.cancel'),
        type: 'warning',
        center: true
      }).then(() => {
        this.idsForm.ids = this.selectList.map(e => {
          return e.id;
        }).join(',');
        let formData = new FormData();
        formData.append("ids", this.idsForm.ids);
        delectAdSchedulingApi(formData).then(res => {
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

