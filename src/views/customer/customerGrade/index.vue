<template>
  <div class="app-container customer-grade">
    <div class="search-box">
      <el-form label-width="90px" inline size="small">
        <el-form-item label="等级名称">
          <el-input v-model="postData.gradeName" clearable placeholder="请输入等级名称" style="width: 200px" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="postData.gradeStatus" clearable placeholder="请选择状态" style="width: 200px">
            <el-option v-for="(item, index) in statusList" :label="item.label" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchData">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="openEdit('add')">新增</el-button>
      <el-button type="primary" size="small" @click="deleteListByIds()">删除</el-button>
      <!--<el-button type="primary" size="small" @click="disableClick(1)">启用</el-button>-->
      <!--<el-button type="danger" size="small" @click="disableClick(2)">禁用</el-button>-->
      <!--<el-button type="primary" size="small" class="export">导出excel</el-button>-->
    </div>

    <el-table
      v-loading="listLoading"
      :data="datalist"
      element-loading-text="正在查询中。。。"
      type="expand"
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
      <el-table-column label="客户等级图标" width="100px" property="smallMark" >
        <template slot-scope="scope">
          <img v-if="scope.row.smallMark" :src="scope.row.smallMark" style="border-style: none;width: 70px;height: 70px;">
        </template>
      </el-table-column>

      <el-table-column label="客户等级编号" width="150px" prop="gradeCode" show-overflow-tooltip/>

      <el-table-column label="客户等级名称" prop="gradeName" show-overflow-tooltip/>

      <el-table-column align="center" width="160" label="创建时间" prop="createTime" >
        <template slot-scope="scope">
          {{scope.row.createTime | timeFmt}}
        </template>
      </el-table-column>

      <!--<el-table-column align="center" label="排序值" prop="sortValue" />-->
      <el-table-column align="center" width="100" label="状态" prop="gradeStatus">
        <template slot-scope="scope">
          <el-tag :type="scope.row.gradeStatus === 1 ? 'primary' : 'danger' " size="mini">{{ scope.row.gradeStatus === 1 ? '使用中' : '已禁用' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="265" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" class="export table-btn-width" @click="openDetail(row.bid)">查看</el-button>
          <el-button type="primary" size="mini" class="table-btn-width" @click="openEdit('edit',row.bid)">编辑</el-button>
          <el-button :type="row.gradeStatus === 1 ? 'info' : 'danger'" size="mini" class="table-btn-width" @click="changeStatus(row.id, row.gradeStatus)">{{row.gradeStatus === 1 ? '禁用' : '启用'}}</el-button>
<!--          <el-button type="danger" size="mini" @click="delteClick(row.id)">删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList" ></Pagination>

    <el-dialog :visible.sync="detailVisible" title="查看等级" class="menuDialog" center @closed="clearData">
      <el-form ref="addDepartment" :model="gradeData" label-width="110px" label-position="right" size="small" :rules="gradeDataRules">
        <el-form-item label="等级名称" prop="gradeName">
          <el-input v-model="gradeData.gradeName" clearable placeholder="等级名称" class="form-dialog-width" readonly />
        </el-form-item>

        <el-form-item label="等级编码" prop="gradeCode">
          <el-input v-model="gradeData.gradeCode" clearable placeholder="等级编码" class="form-dialog-width" readonly />
        </el-form-item>

        <!--<el-form-item label="排序值" prop="sortValue">-->
          <!--<el-input v-model="gradeData.sortValue" clearable placeholder="排序值" class="form-dialog-width" readonly />-->
        <!--</el-form-item>-->

        <el-form-item label="状态" prop="gradeStatus">
          <el-select v-model="gradeData.gradeStatus" clearable placeholder="请选择状态" class="form-dialog-width">
            <el-option v-for="(item, index) in statusList" disabled :label="item.label" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="客户等级图标" prop="smallMark">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :action="uploadActionUrl"
            style=" border: 1px dashed #d9d9d9;!important;height: 100px;width: 100px"
            :before-upload="beforeAvatarUpload"
            :on-success="handleSuccess2"
            :on-remove="handleRemove2"
            disabled>
            <img v-if="gradeData.smallMark" :src="gradeData.smallMark" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <div class="el-upload__tip">请上传JPG或PNG格式并大小不超过2MB的照片</div>
        </el-form-item>

        <el-form-item label="客户等级底图" prop="underlayPath">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :action="uploadActionUrl"
            style=" border: 1px dashed #d9d9d9;!important;height: 100px;width: 100px"
            :before-upload="beforeAvatarUpload"
            :on-success="handleSuccess"
            :on-remove="handleRemove"
            disabled>
            <img v-if="gradeData.underlayPath" :src="gradeData.underlayPath" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <div class="el-upload__tip">请上传JPG或PNG格式并大小不超过2MB的照片</div>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="detailVisible=false">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="editVisible" :title="dialogType==='add'?'新增等级':'编辑等级'" center class="menuDialog" @closed="clearData">
      <el-form ref="addDepartment" :model="gradeData" label-width="110px" label-position="right" size="small" :rules="gradeDataRules">
        <el-form-item label="等级名称" prop="gradeName">
        <el-input v-model="gradeData.gradeName" clearable placeholder="等级名称" class="form-dialog-width" />
      </el-form-item>

        <el-form-item label="等级编码" prop="gradeName">
          <el-input v-model="gradeData.gradeCode" clearable placeholder="等级编码" class="form-dialog-width" />
        </el-form-item>

        <!--<el-form-item label="排序值" prop="gradeName">-->
          <!--<el-input v-model="gradeData.sortValue" clearable placeholder="排序值" class="form-dialog-width" />-->
        <!--</el-form-item>-->

        <el-form-item label="状态" prop="gradeStatus">
          <el-select v-model="gradeData.gradeStatus" clearable placeholder="请选择状态" class="form-dialog-width">
            <el-option v-for="(item, index) in statusList2" :label="item.label" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="客户等级图标" prop="smallMark">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :action="uploadActionUrl"
            style=" border: 1px dashed #d9d9d9;!important;height: 100px;width: 100px"
            :before-upload="beforeAvatarUpload"
            :on-success="handleSuccess2"
            :on-remove="handleRemove2">
            <img v-if="gradeData.smallMark" :src="gradeData.smallMark" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <div class="el-upload__tip">请上传JPG或PNG格式并大小不超过2MB的照片</div>
        </el-form-item>

        <el-form-item label="客户等级底图" prop="underlayPath">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            :action="uploadActionUrl"
            style=" border: 1px dashed #d9d9d9;!important;height: 100px;width: 100px"
            :before-upload="beforeAvatarUpload"
            :on-success="handleSuccess"
            :on-remove="handleRemove">
            <img v-if="gradeData.underlayPath" :src="gradeData.underlayPath" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <div class="el-upload__tip">请上传JPG或PNG格式并大小不超过2MB的照片</div>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="dialogType==='add'" type="primary" size="small" @click="confirmAdd('addDepartment')">确认</el-button>
        <el-button v-if="dialogType==='edit'" type="primary" size="small" @click="confirmEdit('addDepartment')">确认</el-button>
        <el-button type="danger" size="small" @click="editVisible=false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { updateGrade, listGrade, getCustomerGradeByBId, saveGrade, deleteGradeById, deleteGradeByIds } from "@/api/customer";
import { uploadActionUrl } from '@/api/common';
import { parseTime } from '@/utils/index'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      idsForm: {
        ids: ''
      },
      uploadActionUrl,
      listLoading: true,
      editVisible: false,
      detailVisible: false,
      dialogType: '',
      indent: 20,
      expandArr: [1036013, 1036014],
      gradeData: {
        gradeName: '',
        gradeStatus: 1,
        // gradeType: 1,
        gradeId: '',
        sortValue: 1,
        gradeCode: '',
        underlayUuid: '',
        underlayPath: '',
        smallMark: '',
        smallMarkUuid: ''
      },
      gradeDataRules: {
        gradeName: [
          { required: true, message: '请填写等级名称', trigger: 'blur' }
        ],
        gradeCode: [
          { required: true, message: '请填写等级编号', trigger: 'blur' }
        ],
        // sortValue: [
        //   { required: true, message: '请填写排序值', trigger: 'blur' }
        // ],
        gradeStatus: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        underlayPath: [
          { required: true, message: '请上传图片', trigger: 'blur' }
        ],
        smallMark: [
          { required: true, message: '请上传图片', trigger: 'blur' }
        ]
      },
      checkAll: false,
      selectList: [],
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        // gradeType: 1,
        gradeName: '',
        gradeStatus: ''
      },
      reviewForm: {
        idlist: '',
        gradeStatus: 0
      },
      statusList: [
        {
          label: '使用中',
          id: 1
        },
        {
          label: '已禁用',
          id: 0
        }
      ],
      statusList2: [
        {
          label: '启用',
          id: 1
        },
        {
          label: '禁用',
          id: 0
        }
      ],
      datalist: []
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    clearData() {
      this.gradeData.gradeName = '';
      this.gradeData.gradeStatus = 1;
      this.gradeData.gradeCode = '';
      this.gradeData.sortValue = 1;
      this.gradeData.underlayPath = '';
      this.gradeData.smallMark = '';
    },
    searchData() {
      this.postData.pageNum = 1;
      this.getDataList()
    },
    getDataList() {
      listGrade(this.postData).then(res => {
        this.datalist = res.data.list;
        this.postData.total = res.data.total;
      }).catch(err => {
        this.$message.error(err.message);
      });
      this.listLoading = false;
    },
    openEdit(type, bid) {
      if (type === 'edit') {
        this.gradeData.bid = bid;
        let obj = {
          bid: bid
        }
        getCustomerGradeByBId(obj).then(res => {
          this.gradeData = res.data;
        }).catch(err => {
          this.$message.error(err.message);
        });
      }
      this.dialogType = type;
      this.editVisible = true;
    },
    openDetail(bid) {
      this.detailVisible = true;
      let obj = {
        bid: bid
      }
      getCustomerGradeByBId(obj).then(res => {
        this.gradeData = res.data;
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 单选
    getSelect(selects) {
      this.selectList = selects;
    },
    delteClick(id) {
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        deleteGradeById({ id: id }).then(res => {
          if (res.status === 200) {
            if (res.data) {
              this.$message.success("操作成功");
            } else {
              this.$message.error("操作失败");
            }
            // this.$message.success('操作成功!');
          }
          this.getDataList();
        }).catch(err => {
          this.$message.error(err.message);
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    },
    changeStatus(id, gradeStatus) {
      let obj = {
        gradeStatus: gradeStatus === 0 ? 1 : 0,
        id: id
      };
      updateGrade(obj).then(res => {
        this.$message.success('操作成功');
        this.getDataList();
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    disableClick(gradeStatus) {
      let text = '';
      if (gradeStatus === 1) {
        text = '启用';
      } else {
        text = '禁用';
      }
      if (!this.selectList.length) {
        return this.$message('请选择数据');
      }
      this.$confirm('是否确定' + text + '?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.reviewForm.idlist = this.selectList.map(e => {
          return e.id;
        }).join(',');
        this.reviewForm.gradeStatus = gradeStatus;
        deleteGradeById(this.reviewForm).then(res => {
          if (res.status === 200) {
            if (res.data) {
              this.$message.success("操作成功");
            } else {
              this.$message.error("操作失败");
            }
            // this.$message.success('操作成功');
          }
          this.getDataList();
        }).catch(err => {
          this.$message.error(err.message);
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    },
    clearForm() {
      this.gradeData.gradeName = '';
      this.gradeData.gradeStatus = 1;
      this.gradeData.tradeCode = '';
    },
    confirmEdit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          updateGrade(this.gradeData).then(res => {
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
            this.clearForm();
          }).catch(err => {
            this.$message.error(err.message);
          });
        } else {
          this.$message.warning('验证未通过');
          return false;
        }
      });
    },
    confirmAdd(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          saveGrade(this.gradeData).then(res => {
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
            this.clearForm();
          }).catch(err => {
            this.$message.error(err.message);
          });
        } else {
          this.$message.warning('验证未通过');
          return false;
        }
      });
    },
    // 上传客户等级底图成功
    handleSuccess(res, file, filename) {
      this.gradeData.underlayUuid = res.data.UUID;
      this.gradeData.underlayPath = res.data.filePath;
    },
    // 删除客户等级底图
    handleRemove(file, fileList) {
      this.gradeData.underlayUuid = '';
      this.gradeData.underlayPath = '';
    },
    // 上传客户等级图标成功
    handleSuccess2(res, file, filename) {
      this.gradeData.smallMarkUuid = res.data.UUID;
      this.gradeData.smallMark = res.data.filePath;
    },
    // 删除客户等级图标
    handleRemove2(file, fileList) {
      this.gradeData.smallMarkUuid = '';
      this.gradeData.smallMark = '';
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG && !isPNG) {
        this.$message.error('上传图片只能是 JPG或PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      return (isJPG || isPNG) && isLt2M;
    },
    deleteListByIds() {
      if (!this.selectList.length) {
        return this.$message('请选择数据');
      }
      if (this.selectList.length !== 1) {
        return this.$message('只能删除一条数据');
      }
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
        deleteGradeByIds(formData).then(res => {
          if (res.status === 200) {
            this.$message.success('操作成功!');
          }
          this.getDataList();
        }).catch(err => {
          this.$message.error(err.message);
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
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
  .customer-grade {
    .search-box {
      margin-bottom: 15px;
      border-bottom: 1px solid $border-light-color;
    }
    .topBtns {
      margin-bottom: 10px;
      text-align: right;
      .export {
        background: green;
        border: green;
      }
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
      width: 100px;
      height: 100px;
      line-height: 100px;
      text-align: center;
    }
    .avatar {
      width: 100px;
      height: 100px;
      display: block;
    }
  }
</style>
