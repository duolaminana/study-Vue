<template>
  <div class="app-container customer-serving">
    <div class="search-box">
      <el-form label-width="100px" inline size="small">
        <el-form-item label="客户名称">
          <el-input v-model="postData.customerName" clearable placeholder="请输入客户名称" style="width: 200px" />
        </el-form-item>
        <el-form-item label="客户编码">
          <el-input v-model="postData.customerCode" clearable placeholder="请输入客户编码" style="width: 200px" />
        </el-form-item>
        <el-form-item label="服务人员姓名">
          <el-select v-model="postData.accountBId" clearable placeholder="请选择服务人员姓名" style="width: 200px">
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
      <el-button type="danger" size="small" @click="deleteListByIds()">删除</el-button>
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

      <el-table-column align="center" label="客户名称" prop="customerName" show-overflow-tooltip />

      <el-table-column align="center" label="客户编码" prop="customerCode" show-overflow-tooltip />

      <el-table-column align="center" label="国家" prop="cnCountryName" show-overflow-tooltip />

      <el-table-column align="center" label="电话" prop="registerPhone" show-overflow-tooltip />

      <el-table-column align="center" label="服务人员" prop="servingName" show-overflow-tooltip />

      <el-table-column align="center" label="职务" prop="csJob" show-overflow-tooltip />

<!--      <el-table-column align="center" label="操作" width="240" class-name="small-padding fixed-width">-->
<!--        <template slot-scope="scope">-->
<!--          <el-button type="primary" size="mini" class="export" @click="openDetail(scope.row)">查看</el-button>-->
<!--          <el-button type="danger" size="mini" @click="deleteList(scope.row)">删除</el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList" ></Pagination>

    <el-dialog :visible.sync="detailVisible" title="查看等级" class="menuDialog" center @closed="clearData">
      <el-form :model="dialogForm" label-width="80px" label-position="right" size="small">
        <el-form-item label="等级名称" prop="gradeName">
          <el-input v-model="dialogForm.gradeName" readonly="readonly" placeholder="菜单名称" class="form-dialog-width" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="detailVisible=false">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="editVisible" title="批量增加服务人员" center width="700px" @closed="clearData">
      <el-form ref="dialogData" :model="dialogData" label-width="100px" label-position="right" inline="" size="small" :rules="dialogFormRules">
        <el-form-item label="客户分类" prop="customerName">
          <el-cascader
            style="width: 200px"
            v-model="customerSortName"
            :options="sortList"
            :props="{value: 'bid', label: 'sortName', children: 'children'}"
            filterable
            clearable
            placeholder="可搜索"
            change-on-select
            @change="getParentId"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="客户等级" prop="customerName">
          <el-select v-model="dialogData.memberBId" clearable placeholder="请选择客户等级" style="width: 200px">
            <el-option v-for="(item, index) in gradeList" :label="item.levelName" :value="item.bid" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="国家" prop="customerName">
          <el-select
            v-model="dialogData.countryCode"
            clearable
            filterable
            remote
            placeholder="请输入关键词"
            :remote-method="getCountryList"
            :loading="Loading1"
            style="width: 200px">
            <el-option v-for="(item, index) in countryList" :label="item.searchStr" :value="item.searchStr" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户编码" prop="customerName">
          <el-input v-model="dialogData.customerCode" clearable placeholder="客户编码" style="width: 200px"/>
        </el-form-item>
        <el-form-item label="客户名称" prop="customerName">
          <el-input v-model="dialogData.customerName" clearable placeholder="客户名称" style="width: 200px"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchDialogData">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="customerList"
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

        <el-table-column align="center" label="客户编码" prop="customerCode" show-overflow-tooltip />

        <el-table-column align="center" label="客户名称" prop="customerName" show-overflow-tooltip />

        <el-table-column align="center" label="国家" prop="countryCode" show-overflow-tooltip/>
      </el-table>
      <div class="service-bottom">
        <el-row :gutter="28">
          <el-col :span="12">
            服务人员姓名：
            <el-select
              v-model="serviceForm.accountBId"
              size="small"
              clearable
              filterable>
              <el-option v-for="(item, index) in accountUserList" :label="item.userName" :value="item.accountBId" :key="index"></el-option>
            </el-select>
          </el-col>
          <el-col :span="12">
            职务
            <el-select v-model="serviceForm.csJob" clearable size="small">
              <el-option value="客服员"></el-option>
              <el-option value="采购专员"></el-option>
              <el-option value="采购经理"></el-option>
              <el-option value="技术经理"></el-option>
            </el-select>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="confirmAdd">保存</el-button>
        <el-button type="danger" size="small" @click="editVisible=false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { listCustomerServing,
  deleteCustomerServing,
  // listGrade,
  listSort,
  listCustomerInfo,
  saveCustomerServing,
  deleteCustomerServingByIds
} from '@/api/customer';
import { listMemberLevel } from '@/api/member'
import { selectCountryListApi } from '@/api/system'
import { getAdminUserList } from '@/api/user'
import { deepClone, parseTime } from "@/utils";
export default {
  components: {
    Pagination
  },
  data() {
    return {
      reviewForm: {
        ids: ''
      },
      listLoading: true,
      Loading1: false,
      editVisible: false,
      detailVisible: false,
      customerSortName: [],
      dialogForm: {
        gradeName: '',
        gradeStatus: 1,
        gradeId: '',
        countryCode: ''
      },
      serviceForm: {
        accountBId: '',
        csJob: ''
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
        customerName: '',
        customerCode: '',
        serviceName: ''
      },
      dialogData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        customerName: '',
        customerCode: '',
        custSortBId: '',
        memberBId: '',
        countryCode: ''
      },
      sortList: [],
      gradeList: [],
      accountUserList: [],
      dataList: [],
      countryList: [],
      customerList: []
    }
  },
  created() {
    this.getDataList();
    this.getUserAccountList();
    this.getGradeList();
    this.getSortList()
  },
  methods: {
    clearData() {
      this.$refs['dialogData'].resetFields();
      this.customerList = [];
      this.selectList1 = []
    },
    getParentId(arr) {
      if (arr.length) {
        this.dialogData.custSortBId = arr.join(',')
      } else {
        this.dialogData.custSortBId = ''
      }
    },
    // 获取等级列表
    getGradeList() {
      listMemberLevel().then(res => {
        this.gradeList = res.data || []
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 获取分类列表
    getSortList() {
      listSort({ pageNum: 1, pageSize: 999 }).then(res => {
        this.sortList = res.data.list || []
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
      this.getCustomerList();
    },
    getDataList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key]) {
          obj[key] = this.postData[key]
        }
      }
      listCustomerServing(obj).then(res => {
        this.dataList = res.data.list;
        this.postData.total = res.data.total;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message);
      });
    },
    getCustomerList() {
      let obj = {};
      for (let key in this.dialogData) {
        if (this.dialogData[key]) {
          obj[key] = this.dialogData[key]
        }
      }
      listCustomerInfo(obj).then(res => {
        this.customerList = res.data.list;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message);
      });
    },
    openEdit() {
      this.editVisible = true;
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
        obj = { id: this.selectList.map(e => e.id).join(',') }
      } else {
        obj = { id: row.id };
      }
      this.$confirm('此操作将删除该服务人员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        deleteCustomerServing(obj).then(res => {
          this.getDataList();
          this.$message.success('删除成功')
        }).catch(err => {
          this.$message.error(err.message);
        });
      }).catch(() => {
      });
    },
    deleteListByIds() {
      if (!this.selectList.length) {
        return this.$message('请选择数据');
      }
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.reviewForm.ids = this.selectList.map(e => {
          return e.id;
        }).join(',');
        let formData = new FormData();
        formData.append("ids", this.reviewForm.ids);
        deleteCustomerServingByIds(formData).then(res => {
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
    },
    confirmAdd() {
      let obj = {};
      let { accountBId, csJob } = this.serviceForm;
      if (!this.selectList1.length) {
        return this.$message.error('请先选择客户')
      }
      if (!accountBId || !csJob) {
        return this.$message.error('请选择服务人员和职务')
      }
      obj.accountBId = accountBId;
      obj.csJob = csJob;
      obj.customerInfoList = this.selectList1
      saveCustomerServing(obj).then(res => {
        this.$message.success('新增成功');
        this.editVisible = false;
        this.postData.pageNum = 1;
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
  .customer-serving {
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
