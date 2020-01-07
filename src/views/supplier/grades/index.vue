<template>
  <div class="app-container grades-container">
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
      <el-button type="primary" size="small" @click="deleteGrade()">删除</el-button>
      <!--<el-button type="primary" size="small" class="export">导出excel</el-button>-->
    </div>
    <el-table
      v-loading="listLoading"
      :data="datalist"
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

      <el-table-column align="center" label="等级名称" prop="gradeName" show-overflow-tooltip/>

      <el-table-column align="center" label="修改人" width="150" prop="updateUserId" show-overflow-tooltip />

      <el-table-column align="center" label="修改时间" width="160" prop="updateTime" >
        <template slot-scope="scope">
          {{scope.row.updateTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="100" label="状态" prop="gradeStatus">
        <template slot-scope="scope">
          <el-tag :type="scope.row.gradeStatus === 1 ? 'primary' : 'danger' " size="mini">{{ scope.row.gradeStatus === 1 ? '使用中' : '已禁用' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="180" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" class="export" @click="openDetail(scope.row)">查看</el-button>
          <el-button type="primary" size="mini" @click="openEdit('edit',scope.row)">编辑</el-button>
          <el-button :type="scope.row.gradeStatus ===1 ? 'info' : 'danger'" size="mini" @click="changeStatus(scope.row)">{{scope.row.gradeStatus !== 1 ? '启用' : '禁用'}}</el-button>
          <!--<el-button v-if="scope.row.gradeStatus !== 1" type="danger" size="mini" @click="deleteGrade(scope.row)">删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList" ></Pagination>

    <el-dialog :visible.sync="detailVisible" title="查看等级" class="menuDialog" center @closed="clearData">
      <el-form :model="gradeData" label-width="80px" label-position="right" size="small">
        <el-form-item label="等级名称" prop="gradeName">
          <el-input v-model="gradeData.gradeName" readonly="readonly" placeholder="菜单名称" class="form-dialog-width" />
        </el-form-item>
        <el-form-item label="状态" prop="gradeStatus">
          <el-select v-model="gradeData.gradeStatus" readonly="readonly" placeholder="请选择状态" class="form-dialog-width">
            <el-option v-for="(item, index) in statusList" :label="item.label" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="detailVisible=false">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="editVisible" :title="dialogType==='add'?'新增等级':'编辑等级'" center class="menuDialog" @closed="clearData">
      <el-form :model="gradeData" label-width="80px" label-position="right" size="small" :rules="gradeDataRules">
        <el-form-item label="等级名称" prop="gradeName">
          <el-input v-model="gradeData.gradeName" clearable placeholder="菜单名称" class="form-dialog-width" />
        </el-form-item>
        <el-form-item label="状态" prop="gradeStatus">
          <el-select v-model="gradeData.gradeStatus" clearable placeholder="请选择状态" class="form-dialog-width">
            <el-option v-for="(item, index) in statusList" :label="item.label" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="confirmAdd">保存</el-button>
        <el-button type="danger" size="small" @click="editVisible=false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { gradesPageList, gradesSave, gradesStatusById, gradesDelete } from '@/api/supplier';
import { deepClone, parseTime } from "@/utils";
export default {
  components: {
    Pagination
  },
  data() {
    return {
      listLoading: true,
      editVisible: false,
      detailVisible: false,
      dialogType: '',
      gradeData: {
        gradeName: '',
        gradeStatus: 1,
        gradeId: ''
      },
      gradeDataRules: {
        gradeName: [
          { required: true, message: '请填写等级名称', trigger: 'blur' }
        ],
        gradeStatus: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      },
      checkAll: false,
      selectList: [],
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        gradeName: '',
        gradeStatus: ''
      },
      reviewForm: {
        idlist: '',
        gradeStatus: 0
      },
      statusList: [
        {
          label: '启用',
          id: 1
        },
        {
          label: '禁用',
          id: 2
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
      this.gradeData.id = '';
      this.gradeData.gradeStatus = 1;
    },
    searchData() {
      this.postData.pageNum = 1;
      this.getDataList()
    },
    getDataList() {
      gradesPageList(this.postData).then(res => {
        this.datalist = res.data.list;
        this.postData.total = res.data.total;
      }).catch(err => {
        this.$message.error(err.message);
      });
      this.listLoading = false;
    },
    changeStatus(row) {
      let obj = {
        bids: row.bid,
        gradeStatus: row.gradeStatus === 1 ? 2 : 1
      };
      gradesStatusById(obj).then(res => {
        this.getDataList();
        this.$message.success('操作成功');
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    openEdit(type, row) {
      if (type === 'edit') {
        this.gradeData = deepClone(row)
      }
      this.dialogType = type;
      this.editVisible = true;
    },
    openDetail(row) {
      this.detailVisible = true;
      this.gradeData = deepClone(row)
    },
    // 单选
    getSelect(selects) {
      this.selectList = selects;
    },
    clearForm() {
      this.gradeData.gradeName = '';
      this.gradeData.gradeStatus = 1;
    },
    deleteGrade(row) {
      let obj = {};
      if (!row) {
        if (!this.selectList.length) {
          return this.$message.error('请先选择数据')
        } else {
          if (this.selectList.length !== 1) {
            return this.$message('只能删除一条数据');
          }
          for (let i = 0; i < this.selectList.length; i++) {
            if (this.selectList[i].gradeStatus === 1) {
              return this.$message.error('不能选择使用中的数据')
            }
          }
        }
        obj = { bids: this.selectList.map(e => e.bid).join(',') }
      } else {
        obj = { bids: row.bid };
      }
      this.$confirm('此操作将删除该等级, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        gradesDelete(obj).then(res => {
          this.getDataList();
          this.$message.success('删除成功')
        }).catch(err => {
          this.$message.error(err.message);
        });
      }).catch(() => {
      });
    },
    confirmAdd() {
      gradesSave(this.gradeData).then(res => {
        this.$message.success('保存成功');
        this.getDataList();
        this.clearForm();
      }).catch(err => {
        this.$message.error(err.message);
      });
      this.editVisible = false;
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
  .grades-container {
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
  }
</style>
