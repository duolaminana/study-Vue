<template>
  <div class="app-container customer-sort">
    <div class="search-box">
      <el-form label-width="90px" inline size="small">
        <el-form-item label="分类名称">
          <el-input v-model="postData.sortName" clearable placeholder="请输入分类名称" style="width: 200px" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="postData.sortStatus" clearable placeholder="请选择状态" style="width: 200px">
            <el-option v-for="(item, index) in statusList" :label="item.label" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchData">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="openDialog('add')">新增</el-button>
      <el-button type="primary" size="small" @click="openSortDialog">排序</el-button>
      <el-button type="primary" size="small" @click="deleteCategory">删除</el-button>
      <!--<el-button type="primary" size="small" class="export">导出excel</el-button>-->
    </div>
    <el-table
      ref="listTable"
      v-loading="listLoading"
      :data="dataList"
      element-loading-text="正在查询中。。。"
      type="expand"
      border
      fit
      size="mini"
      row-key="id"
      :indent="indent"
      :header-cell-style="{background: '#a7bfee'}"
      @selection-change="getSelect"
      @select="setChildSelect">
      <el-table-column
        align="center"
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column label="分类名称" prop="id" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.sortName}}
        </template>
      </el-table-column>

      <el-table-column label="分类编码" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.sortCode}}
        </template>
      </el-table-column>
<!--      <el-table-column align="center" label="修改人" prop="createBy" />-->

      <el-table-column align="center" width="160" label="创建时间" prop="createTime" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.createTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="160" label="修改时间" prop="updateTime" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.updateTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="100" label="状态" prop="status">
        <template slot-scope="scope">
          <el-tag :type="scope.row.sortStatus === 1 ? 'primary' : 'danger' " size="mini">{{ scope.row.sortStatus === 1 ? '使用中' : '已禁用' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="180" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" class="export" @click="openDetail(row)">查看</el-button>
          <el-button type="primary" size="mini" @click="openDialog('edit', row)">编辑</el-button>
          <el-button :type="row.sortStatus ===1 ? 'info' : 'danger'" size="mini" @click="changeStatus(row)">{{row.sortStatus !== 1 ? '启用' : '禁用'}}</el-button>
          <!--<el-button type="danger" size="mini" @click="deleteCategory(row)">删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList" ></Pagination>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='add'?'新增分类':'编辑分类'" width="500px" @closed="clearData" center>
      <el-form ref="category" :model="formLine" label-width="80px" label-position="right" size="small" :rules="formLineRules" >
        <el-form-item label="上级类目" prop="parentsName">
          <el-cascader
            class="form-dialog-width"
            v-model="formLine.parentsName"
            :options="addDataList"
            :props="{value: 'bid', label: 'sortName', children: 'children'}"
            filterable
            clearable
            placeholder="可搜索"
            change-on-select
            @change="getParentId"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="分类编码" prop="sortCode">
          <el-input v-model="formLine.sortCode" clearable placeholder="分类编码" class="form-dialog-width" />
        </el-form-item>
        <el-form-item label="分类名称" prop="sortName">
          <el-input v-model="formLine.sortName" clearable placeholder="分类名称" class="form-dialog-width" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          {{Number(formLine.sortStatus) === 1 ? '使用中' : '已禁用'}}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" :loading="confirmLoading" @click="confirmAdd('category')">确认</el-button>
        <el-button type="danger" size="small" @click="dialogVisible=false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="detailModal" title="分类详情" width="500px" center @closed="clearData">
      <el-form ref="category" :model="formLine" label-width="80px" label-position="right" size="small" :rules="formLineRules" >
        <el-form-item label="上级类目" prop="parentsName">
          <el-cascader
            class="form-dialog-width"
            v-model="formLine.parentsName"
            :options="addDataList"
            :props="{value: 'bid', label: 'sortName', children: 'children'}"
            filterable
            :disabled="true"
            readonly
            placeholder="可搜索"
            change-on-select
            @change="getParentId"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="分类编码" prop="sortCode">
          <el-input v-model="formLine.sortCode" readonly placeholder="分类编码" class="form-dialog-width" />
        </el-form-item>
        <el-form-item label="分类名称" prop="sortName">
          <el-input v-model="formLine.sortName" readonly placeholder="分类名称" class="form-dialog-width" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          {{Number(formLine.sortStatus) === 1 ? '使用中' : '已禁用'}}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="detailModal=false">关闭</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="sortVisible" title="客户分类排序" width="500px" center :close-on-click-modal="false" @close="closeSortDialog">
      <div style="height: 400px;overflow: auto">
        <el-tree
          ref="tree"
          :data="sortDataList"
          node-key="id"
          :props="{label: 'sortName', children: 'children'}"
          :expand-on-click-node="false">
        <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            :class="canClick ? 'no-can-click' : ''"
            @click="moveFirst(node, data)">
            <svg-icon class-name="svgClass" icon-class="shuangjiantoushang" size="18" />
          </el-button>
          <el-button
            type="text"
            size="mini"
            :class="canClick ? 'no-can-click' : ''"
            @click="moveOne(node, data, 1)">
            <svg-icon class-name="svgClass" icon-class="jiantoushang" size="18" />
          </el-button>
          <el-button
            type="text"
            size="mini"
            :class="canClick ? 'no-can-click' : ''"
            @click="moveOne(node, data, -1)">
            <svg-icon class-name="svgClass" icon-class="jiantouxia" size="18" />
          </el-button>
          <el-button
            type="text"
            size="mini"
            :class="canClick ? 'no-can-click' : ''"
            @click="moveLast(node, data)">
            <svg-icon class-name="svgClass" icon-class="shuangjiantouxia" size="18" />
          </el-button>
        </span>
      </span>
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="sortVisible=false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import {
  listSort,
  saveSort,
  updateSort,
  deleteSortById,
  updateByStatus,
  moveSortList
} from '@/api/customer'
import { parseTime } from '@/utils/index'
import { deepClone } from "@/utils";

export default {
  components: {
    Pagination
  },
  data() {
    return {
      selectList: [],
      list: null,
      listLoading: true,
      confirmLoading: false,
      dialogVisible: false,
      detailModal: false,
      sortVisible: false,
      canClick: false,
      dialogType: '',
      indent: 20,
      sortDataList: [],
      formLine: {
        parentsName: [],
        parentBId: '',
        sortName: '',
        sortCode: '',
        sortStatus: 1,
        parentBIds: ''
      },
      formLine1: {
      },
      formLineRules: {
        sortName: [
          { required: true, message: '请填写分类名称', trigger: 'blur' }
        ],
        sortCode: [
          { required: true, message: '请填写分类编码', trigger: 'blur' }
        ]
      },
      postData: {
        page: 1,
        pageSize: 10,
        total: 0,
        name: '',
        status: ''
      },
      statusList: [
        {
          label: '已禁用',
          id: 0
        },
        {
          label: '使用中',
          id: 1
        }
      ],
      dataList: [],
      addDataList: [],
      sub: ''
    }
  },
  created() {
    this.getDataList();
  },
  methods: {
    clearData() {
      this.formLine.parentsName = [];
      this.formLine.sortName = '';
      this.formLine.sortCode = '';
      this.formLine.parentBId = '';
      this.formLine.sortStatus = 1;
      this.formLine.parentBIds = '';
    },
    searchData() {
      this.postData.pageNum = 1;
      this.getDataList()
    },
    getDataList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      listSort(obj).then(res => {
        this.listLoading = false;
        this.dataList = res.data.list;
        this.postData.total = res.data.total;
      }).catch(err => {
        this.$message.error(err.message);
        this.listLoading = false;
      })
    },
    getAllDataList() {
      listSort({ pageSize: 999, pageNum: 1, sortStatus: 1 }).then(res => {
        this.addDataList = res.data.list;
      })
    },
    getParentId(arr) {
      if (arr.length) {
        this.formLine.parentBId = arr[arr.length - 1];
        this.formLine.parentBIds = arr.join(',')
      } else {
        this.formLine.parentBId = '';
        this.formLine.parentBIds = ''
      }
    },
    openSortDialog() {
      listSort({ pageSize: 9999, pageNum: 1 }).then(res => {
        this.sortDataList = JSON.parse(JSON.stringify(res.data.list));
        this.sortVisible = true;
      })
    },
    closeSortDialog() {
      this.getDataList()
    },
    openDetail(row) {
      this.getAllDataList();
      this.formLine = deepClone(row);
      // 回显上级
      if (row.parentBIds) {
        this.formLine.parentsName = this.formLine.parentBIds.split(',').map(e => {
          return e;
        })
      } else {
        this.formLine.parentsName = []
      }
      this.detailModal = true;
    },
    openDialog(type, row) {
      this.getAllDataList();
      this.dialogType = type;
      if (type === 'edit') {
        this.formLine = deepClone(row);
        if (row.parentBIds) {
          this.formLine.parentsName = this.formLine.parentBIds.split(',').map(e => {
            return e;
          })
        } else {
          this.formLine.parentsName = []
        }
      }
      this.dialogVisible = true;
    },
    confirmAdd(formName) {
      let api = '';
      if (this.dialogType === 'add') {
        api = saveSort
      } else {
        api = updateSort
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.confirmLoading = true;
          api(this.formLine).then(res => {
            this.$message.success('操作成功');
            this.confirmLoading = false;
            this.dialogVisible = false;
            this.postData.pageNum = 1;
            this.clearData();
            this.getDataList();
          }).catch(err => {
            this.confirmLoading = false;
            this.$message.error(err.message);
          });
        } else {
          this.$message.warning('验证未通过')
          return false;
        }
      });
    },
    changeStatus(row) {
      let obj = {
        id: row.id,
        sortStatus: row.sortStatus === 1 ? 0 : 1
      };
      updateByStatus(obj).then(res => {
        this.getDataList();
        this.$message.success('操作成功');
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    deleteCategory() {
      if (this.selectList.length !== 1) {
        return this.$message.warning('请选择一条数据删除')
      }
      let row = this.selectList[0];
      this.$confirm('此操作将删除该类目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        let obj = {
          id: row.id,
          delFlag: 1
        };
        this.sub = row.sub;
        if (this.sub === 0 && this.sub !== '') {
          deleteSortById(obj).then(res => {
            if (res.status === 200) {
              if (res.data) {
                this.$message.success("操作成功");
              } else {
                this.$message.error("操作失败");
              }
              // this.$message.success('操作成功!');
            }
            this.getDataList();
            this.$message.success('操作成功');
          }).catch(err => {
            this.$message.error(err.message)
          });
        } else {
          this.$message.error("该客户分类存在子级，无法进行删除！")
        }
      }).catch(() => {
      })
    },
    // 置顶
    moveFirst(node, data) {
      let arr = node.parent.data.children || node.parent.data;
      let rowIndex = arr.findIndex(e => e.id === data.id);
      if (rowIndex === 0) {
        return this.$message.warning('已是该层顶部');
      }

      let newAttrSequ = arr[0].sortIndex;
      let oldAttrSequ = data.sortIndex;
      data.sortIndex = newAttrSequ - 1;
      this.canClick = true;
      moveSortList({ customerSortList: [data] }).then(res => {
        let top = deepClone(arr.splice(rowIndex, 1)[0]);
        this.canClick = false;
        arr.unshift(top);
      }).catch(err => {
        this.canClick = false;
        data.sortIndex = oldAttrSequ;
        this.$message.error(err.message)
      })
    },
    // 移到尾部
    moveLast(node, data) {
      let arr = node.parent.data.children || node.parent.data;
      let rowIndex = arr.findIndex(e => e.id === data.id);
      if (rowIndex === arr.length - 1) {
        return this.$message.warning('已是该层底部');
      }
      let newAttrSequ = arr[arr.length - 1].sortIndex;
      let oldAttrSequ = data.sortIndex;
      data.sortIndex = newAttrSequ + 1;
      this.canClick = true;
      moveSortList({ customerSortList: [data] }).then(res => {
        let end = deepClone(arr.splice(rowIndex, 1)[0]);
        this.canClick = false;
        arr.push(end);
      }).catch(err => {
        this.canClick = false;
        data.sortIndex = oldAttrSequ;
        this.$message.error(err.message)
      })
    },
    // 替换
    moveComm(arr, curIndex, nextIndex, data, move) {
      let oldAttrSequ = arr[curIndex].sortIndex;
      let newAttrSequ = arr[nextIndex].sortIndex;
      arr[curIndex].sortIndex = newAttrSequ;
      arr[nextIndex].sortIndex = oldAttrSequ;
      this.canClick = true;
      moveSortList({ customerSortList: [arr[curIndex], arr[nextIndex]] }).then(res => {
        arr[curIndex] = deepClone(arr.splice(nextIndex, 1, arr[curIndex])[0]);
        this.canClick = false;
        return arr;
      }).catch(err => {
        arr[curIndex].sortIndex = oldAttrSequ;
        arr[nextIndex].sortIndex = newAttrSequ;
        this.$message.error(err.message);
        this.canClick = false;
        return arr;
      })
    },
    // 上下移动一格
    moveOne(node, data, move) {
      let arr = node.parent.data.children || node.parent.data;
      let rowIndex = arr.findIndex(e => e.id === data.id);
      if (rowIndex === 0 && move === 1) {
        return this.$message.warning('已是该层顶部');
      } else if (rowIndex === arr.length - 1 && move === -1) {
        return this.$message.warning('已是该层底部');
      } else {
        arr = this.moveComm(arr, rowIndex, rowIndex - move, data, move);
      }
    },
    // 勾选触发 selects为选择的数据数组
    getSelect(selects) {
      this.selectList = selects;
    },
    setChildSelect(section, row) {
      if (section.indexOf(row) > -1) {
        this.setCheckTable(section, true)
      } else {
        this.setCheckTable([row], false)
      }
    },
    setCheckTable(arr = [], flag) {
      arr.forEach(e => {
        if (e.children && e.children.length) {
          e.children.forEach(e => {
            this.$refs.listTable.toggleRowSelection(e, flag);
          });
          this.setCheckTable(e.children, flag)
        }
      })
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
  .customer-sort {
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
    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      padding-right: 8px;
    }
    .menuDialog {
      .el-dialog {
        width: 500px;
      }
    }
    .no-can-click {
      pointer-events: none;
      cursor: default;
    }
  }
</style>
