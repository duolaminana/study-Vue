<template>
  <div class="app-container label-container">
    <div class="search-box">
      <el-form label-width="90px" inline size="small">
        <el-form-item label="标签名称">
          <el-input v-model="postData.labelName" clearable placeholder="请输入标签名称" style="width: 200px" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="postData.labelStatus" clearable placeholder="请选择状态" style="width: 200px">
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
      <el-button type="danger" size="small" @click="disableClick(1)">启用</el-button>
      <el-button type="info" size="small" @click="disableClick(2)">禁用</el-button>
      <!--<el-button type="primary" size="small" class="export">导出excel</el-button>-->
    </div>
    <el-table
      v-loading="listLoading"
      :data="datalist"
      element-loading-text="正在查询中。。。"
      type="expand"
      border
      fit
      size="small"
      row-key="id"
      :indent="indent"
      :expand-row-keys="expandArr"
      :header-cell-style="{background: '#a7bfee'}"
      @selection-change="getSelect">
      <el-table-column
        align="center"
        type="selection"
        width="55">
      </el-table-column>

      <el-table-column align="center" label="标签名称" prop="labelName" />

      <el-table-column align="center" label="颜色" prop="labelColor" />

      <el-table-column align="center" label="修改人" prop="createBy" />

      <el-table-column align="center" label="创建时间" prop="createTime" />

      <el-table-column align="center" label="状态" prop="labelStatus">
        <template slot-scope="scope">
          <el-tag :type="scope.row.labelStatus === 1 ? 'primary' : 'danger' " size="mini">{{ scope.row.labelStatus === 1 ? '使用中' : '已禁用' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="250" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" class="export" @click="openDetail(scope.row.labelId)">查看</el-button>
          <el-button type="primary" size="mini" @click="openEdit('edit',scope.row.labelId)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList" ></Pagination>

    <el-dialog :visible.sync="detailVisible" title="查看标签" class="menuDialog">
      <el-form :model="labelData" label-width="80px" label-position="right" size="small">
        <el-form-item label="标签名称" prop="labelName">
          <el-input v-model="labelData.labelName" readonly="readonly" placeholder="菜单名称" class="form-dialog-width" />
        </el-form-item>
        <el-form-item label="标签颜色" prop="labelColor">
          <el-select v-model="labelData.labelColor" @change="selectGet" clearable placeholder="请选择状态" class="form-dialog-width">
            <el-option v-for="(item, index) in colorList" :label="item.label" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="labelStatus">
          <el-select v-model="labelData.labelStatus" readonly="readonly" placeholder="请选择状态" class="form-dialog-width">
            <el-option v-for="(item, index) in statusList" :label="item.label" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="detailVisible=false">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="editVisible" :title="dialogType==='add'?'新增标签':'编辑标签'" class="menuDialog">
      <el-form :model="labelData" label-width="80px" label-position="right" size="small" :rules="gradeDataRules">
        <el-form-item label="标签名称" prop="labelName">
          <el-input v-model="labelData.labelName" clearable placeholder="菜单名称" class="form-dialog-width" />
        </el-form-item>
        <el-form-item label="标签颜色" prop="labelColor">
          <el-select v-model="labelData.labelColor" @change="selectGet" clearable placeholder="请选择状态" class="form-dialog-width">
            <el-option v-for="(item, index) in colorList" :label="item.label" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="labelStatus">
          <el-select v-model="labelData.labelStatus" clearable placeholder="请选择状态" class="form-dialog-width">
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
import { labelPageList, labelSave, labelStatusById, labelDetailById } from '@/api/supplier';
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
      indent: 20,
      expandArr: [1036013, 1036014],
      labelData: {
        labelName: '',
        labelStatus: 1,
        labelType: 3,
        labelId: '',
        labelColor: '',
        labelColorValue: ''
      },
      gradeDataRules: {
        labelName: [
          { required: true, message: '请填写标签名称', trigger: 'blur' }
        ],
        labelStatus: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      },
      checkAll: false,
      selectList: [],
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        labelType: 3,
        labelName: '',
        labelStatus: ''
      },
      reviewForm: {
        idlist: '',
        labelStatus: 0
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
      colorList: [
        {
          label: '红',
          id: '#FF0000'
        },
        {
          label: '绿',
          id: '#00FF00'
        },
        {
          label: '蓝',
          id: '#0000FF'
        },
        {
          label: '黄',
          id: '#FFFF00'
        },
        {
          label: '紫',
          id: '#8B00FF'
        },
        {
          label: '橙',
          id: '#FF7F00'
        },
        {
          label: '青',
          id: '#00FFFF'
        }
      ],
      datalist: []
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    // 下拉框选中事件
    selectGet(vId) { // 这个vId也就是value值
      let obj = this.colorList.filter((item) => { // 这里的userList就是上面遍历的数据源
        return item.id === vId;// 筛选出匹配数据
      })[0];
      this.labelData.labelColor = obj.label;
      this.labelData.labelColorValue = obj.id;
    },
    searchData() {
      this.postData.pageNum = 1;
      this.getDataList()
    },
    getDataList() {
      labelPageList(this.postData).then(res => {
        this.datalist = res.data.list;
        this.postData.total = res.data.total;
      }).catch(err => {
        this.$message.error(err.message);
      });
      this.listLoading = false;
    },
    openEdit(type, labelId) {
      if (type === 'edit') {
        this.labelData.labelId = labelId;

        let obj = {
          id: labelId
        }
        labelDetailById(obj).then(res => {
          this.labelData = res.data;
        }).catch(err => {
          this.$message.error(err.message);
        });
      }
      this.dialogType = type;
      this.editVisible = true;
    },
    openDetail(labelId) {
      this.detailVisible = true;
      let obj = {
        id: labelId
      }
      labelDetailById(obj).then(res => {
        this.labelData = res.data;
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 单选
    getSelect(selects) {
      this.selectList = selects;
    },
    disableClick(labelStatus) {
      let text = '';
      if (labelStatus === 1) {
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
          return e.labelId;
        }).join(',');
        this.reviewForm.labelStatus = labelStatus;
        labelStatusById(this.reviewForm).then(res => {
          if (res.status === 200) {
            this.$message.success('操作成功');
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
      this.labelData.labelName = '';
      this.labelData.labelStatus = 1;
      this.labelData.labelColor = '';
      this.labelData.labelColorValue = '';
    },
    confirmAdd() {
      labelSave(this.labelData).then(res => {
        if (res.status === 200) {
          this.$message({ message: res.data, type: 'success' })
        }
        this.getDataList();
        this.clearForm();
      }).catch(err => {
        this.$message({ message: err.message });
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
    }
  }
}
</script>

<style lang="scss">
  @import '~@/styles/variables.scss';
  .label-container {
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
