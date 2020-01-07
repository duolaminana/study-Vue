<template>
  <div class="app-container personnelAllotment">
    <div class="search-box">
      <el-form label-width="100px" inline size="small">
        <el-form-item label="供应商名称">
          <el-input v-model="postData.supplierName" clearable placeholder="请输入供应商名称" style="width: 200px" />
        </el-form-item>
        <el-form-item label="供应商编码">
          <el-input v-model="postData.supplierCode" clearable placeholder="请输入供应商编码" style="width: 200px" />
        </el-form-item>
        <el-form-item label="服务人员姓名">
          <el-select
            v-model="postData.accountBId"
            size="small"
            remote
            :remote-method="getAccountUserList"
            clearable
            filterable
            :loading="loading1"
            placeholder="请输入姓或名进行搜索">
            <el-option v-for="(item, index) in accountUserList" :label="item.userName" :value="item.accountBId" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchData">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="openEdit">新增</el-button>
      <el-button type="primary" size="small" @click="deleteList()">删除</el-button>
      <!--<el-button type="primary" size="small" class="export">导出excel</el-button>-->
    </div>
    <el-table
      v-loading="listLoading"
      :data="dataList"
      element-loading-text="正在查询中。。。"
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

      <el-table-column label="供应商名称" prop="supplierName" show-overflow-tooltip />

      <el-table-column label="供应商编码" prop="supplierCode" show-overflow-tooltip />

      <el-table-column label="国家" prop="countryCode" show-overflow-tooltip/>

      <el-table-column label="电话" prop="mobilePhone" show-overflow-tooltip/>

      <el-table-column label="服务人员" prop="serviceName" show-overflow-tooltip/>

      <el-table-column align="center" width="100" label="修改人" prop="updateUserId" show-overflow-tooltip/>

      <el-table-column align="center" width="160" label="修改时间" prop="updateTime">
        <template slot-scope="scope">
          {{scope.row.updateTime | timeFmt}}
        </template>
      </el-table-column>

      <!--<el-table-column align="center" label="岗位/职务" prop="csJob" />-->

      <!--<el-table-column align="center" label="操作" width="240" class-name="small-padding fixed-width">-->
        <!--<template slot-scope="scope">-->
          <!--<el-button type="danger" size="mini" @click="deleteList(scope.row)">删除</el-button>-->
        <!--</template>-->
      <!--</el-table-column>-->
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList" ></Pagination>

    <el-dialog :visible.sync="detailVisible" title="查看等级" class="menuDialog" @closed="clearData">
      <el-form :model="dialogForm" label-width="80px" label-position="right" size="small">
        <el-form-item label="等级名称" prop="gradeName">
          <el-input v-model="dialogForm.gradeName" readonly="readonly" placeholder="请输入等级名称" class="form-dialog-width" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="detailVisible=false">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="editVisible" title="批量增加服务人员" center width="700px" @closed="clearData">
      <el-form ref="dialogData" :model="dialogData" label-width="100px" label-position="right" inline="" size="small" :rules="dialogFormRules">
        <el-form-item label="供应商分类" prop="supplierName">
          <el-cascader
            style="width: 200px"
            v-model="supplierSortName"
            :options="sortList"
            :props="{value: 'bid', label: 'supplierSortName', children: 'children'}"
            filterable
            clearable
            placeholder="可搜索"
            change-on-select
            @change="getParentId"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="供应商等级" prop="supplierName">
          <el-select v-model="dialogData.supplierGradeBId" clearable placeholder="请选择供应商分类" style="width: 200px">
            <el-option v-for="(item, index) in gradeList" :label="item.gradeName" :value="item.bid" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="国家" prop="supplierName">
          <el-select
            v-model="dialogData.countryCode"
            clearable
            filterable
            remote
            placeholder="请输入关键词"
            :remote-method="getCountryList"
            :loading="loading1"
            style="width: 200px">
            <el-option v-for="(item, index) in countryList" :label="item.searchStr" :value="item.searchStr" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="供应商编码" prop="supplierName">
          <el-input v-model="dialogData.supplierCode" clearable placeholder="供应商编码" style="width: 200px"/>
        </el-form-item>
        <el-form-item label="供应商名称" prop="supplierName">
          <el-input v-model="dialogData.supplierName" clearable placeholder="供应商名称" style="width: 200px"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchDialogData">搜索</el-button>
        </el-form-item>
      </el-form>
      <div class="service-bottom">
        <el-row :gutter="28">
          <el-col :span="12">
            服务人员姓名：
            <el-select
              v-model="serviceForm.accountBId"
              size="small"
              remote
              :remote-method="getAccountUserList"
              clearable
              filterable
              :loading="loading1"
              placeholder="请输入姓或名进行搜索">
              <el-option v-for="(item, index) in accountUserList" :label="item.userName" :value="item.accountBId" :key="index"></el-option>
            </el-select>
          </el-col>
          <!--<el-col :span="12">-->
            <!--岗位/职务-->
            <!--<el-select v-model="serviceForm.csJob" clearable size="small">-->
              <!--<el-option value="客服员"></el-option>-->
              <!--<el-option value="采购专员"></el-option>-->
              <!--<el-option value="采购经理"></el-option>-->
              <!--<el-option value="技术经理"></el-option>-->
            <!--</el-select>-->
          <!--</el-col>-->
        </el-row>
      </div>
      <el-table
        :data="supplierList"
        border
        fit
        style="margin: 10px 0"
        height="300px"
        size="small"
        :header-cell-style="{background: '#a7bfee'}"
        @selection-change="getDialogSelect">
        <el-table-column
          align="center"
          type="selection"
          width="55">
        </el-table-column>

        <el-table-column align="center" label="供应商编码" prop="supplierCode" />

        <el-table-column align="center" label="供应商名称" prop="supplierName" />

        <el-table-column align="center" label="国家" prop="countryCode"/>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="confirmAdd">保存</el-button>
        <el-button type="danger" size="small" @click="editVisible=false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getServiceListPage,
  deleteBatchService,
  gradeList,
  sortList,
  getSupplierList,
  setServicePeople
} from '@/api/supplier';
import { selectCountryListApi } from '@/api/system'
import { getAdminUserList, selectUserListAllApi } from '@/api/user'
import { deepClone, parseTime } from "@/utils";
export default {
  components: {
    Pagination
  },
  data() {
    return {
      listLoading: true,
      loading1: false,
      editVisible: false,
      detailVisible: false,
      supplierSortName: [],
      dialogForm: {
        gradeName: '',
        gradeStatus: 1,
        gradeId: '',
        countryCode: ''
      },
      serviceForm: {
        accountBId: ''
      },
      dialogFormRules: {
        gradeName: [
          { required: true, message: '请填写等级名称', trigger: 'blur' }
        ],
        gradeStatus: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      },
      selectList: [],
      selectList1: [],
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        supplierName: '',
        supplierCode: '',
        serviceName: ''
      },
      dialogData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        supplierName: '',
        supplierCode: '',
        supplierSortBId: '',
        supplierGradeBId: '',
        countryCode: ''
      },
      sortList: [],
      gradeList: [],
      accountUserList: [],
      dataList: [],
      countryList: [],
      supplierList: []
    }
  },
  created() {
    this.getDataList();
    // this.getUserAccountList();
    this.getGradeList();
    this.getSortList()
  },
  methods: {
    clearData() {
      this.$refs['dialogData'].resetFields();
      this.supplierList = [];
      this.selectList1 = []
    },
    getParentId(arr) {
      if (arr.length) {
        this.dialogData.supplierSortBId = arr.join(',')
      } else {
        this.dialogData.supplierSortBId = ''
      }
    },
    // 获取等级列表
    getGradeList() {
      gradeList().then(res => {
        this.gradeList = res.data || []
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 获取分类列表
    getSortList() {
      sortList().then(res => {
        this.sortList = res.data || []
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 获取后台用户
    getUserAccountList() {
      getAdminUserList().then(res => {
        this.accountUserList = res.data || []
      })
    },
    getAccountUserList(val) {
      const _this = this;
      if (val !== '') {
        this.loading1 = true;
        selectUserListAllApi(val).then(res => {
          _this.accountUserList = res.data;
          _this.loading1 = false;
        });
      } else {
        this.accountUserList = [];
      }
    },
    // 查询获取国家
    getCountryList(query) {
      if (query !== '') {
        this.loading1 = true;
        setTimeout(() => {
          this.loading1 = false;
          selectCountryListApi(query).then(res => {
            this.countryList = res.data || []
          })
        }, 100);
      } else {
        this.countryList = [];
      }
    },
    searchData() {
      this.postData.pageNum = 1;
      this.getDataList();
    },
    searchDialogData() {
      this.dialogData.pageNum = 1;
      this.getSupplierList();
    },
    getDataList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key]) {
          obj[key] = this.postData[key]
        }
      }
      getServiceListPage(obj).then(res => {
        this.dataList = res.data.list;
        this.postData.total = res.data.total;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message);
      });
    },
    getSupplierList() {
      let obj = {};
      for (let key in this.dialogData) {
        if (this.dialogData[key]) {
          obj[key] = this.dialogData[key]
        }
      }
      getSupplierList(obj).then(res => {
        this.supplierList = res.data;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message);
      });
    },
    openEdit() {
      this.editVisible = true;
      this.serviceForm.accountBId = '';
    },
    openDetail(row) {
      this.detailVisible = true;
      this.dialogForm = deepClone(row)
    },
    // 多选
    getSelect(selects) {
      this.selectList = selects;
    },
    getDialogSelect(selects) {
      this.selectList1 = selects;
    },
    clearForm() {
      this.dialogForm.gradeName = '';
      this.dialogForm.gradeStatus = 1;
    },
    deleteList(row) {
      let obj = {};
      if (!row) {
        if (!this.selectList.length) {
          return this.$message.error('请先选择数据')
        }
        obj = { ids: this.selectList.map(e => e.id).join(',') }
      } else {
        obj = { ids: row.id };
      }
      this.$confirm('此操作将删除该服务人员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        deleteBatchService(obj).then(res => {
          this.getDataList();
          this.$message.success('删除成功')
        }).catch(err => {
          this.$message.error(err.message);
        });
      }).catch(() => {
      });
    },
    confirmAdd() {
      let obj = {};
      let { accountBId } = this.serviceForm;
      if (!this.selectList1.length) {
        return this.$message.error('请先选择供应商')
      }
      if (!accountBId) {
        return this.$message.error('请选择服务人员')
      }
      obj.accountBId = accountBId;
      obj.supplierInfoList = this.selectList1;
      setServicePeople(obj).then(res => {
        this.$message.success('新增成功');
        this.editVisible = false;
        this.postData.pageNum = 1;
        this.serviceForm.accountBId = '';
        this.getDataList();
      }).catch(err => {
        this.$message.error(err.message);
      });
    }
  },
  filters: {
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
  .personnelAllotment {
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
    .service-bottom {
      padding-top: 15px;
      border-top: 1px solid $border-light-color;
    }
  }
</style>
