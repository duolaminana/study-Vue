<template>
  <div class="app-container menu-page">
    <div class="search-box">
      <el-form label-width="130px" inline size="small">
        <el-form-item :label="$t('system.department.departmentCode')">
          <el-input v-model="postData.departmentCode" clearable :placeholder="$t('system.department.departmentCode')" style="width: 200px" />
        </el-form-item>
        <el-form-item :label="$t('system.department.departmentName')">
          <el-input v-model="postData.departmentName" clearable :placeholder="$t('system.department.departmentName')" style="width: 200px" />
        </el-form-item>
        <el-form-item :label="$t('system.department.departmentStatus')">
          <el-select v-model="postData.departmentStatus" clearable :placeholder="$t('system.department.departmentStatus')" style="width: 200px">
            <el-option v-for="(item, index) in areaList" :label="language === 'zh' ? item.labelZh : item.label" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="getDataList">{{$t('common.search')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="openSortDialog">{{$t('common.sort')}}</el-button>
      <el-button type="primary" size="small" @click="openDialog('add')">{{$t('common.add')}}</el-button>
      <el-button type="primary" size="small" @click="deleteMenu()">{{$t('common.delete')}}</el-button>
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

      <el-table-column :label="$t('system.department.departmentName')" prop="departmentName" show-overflow-tooltip/>

      <el-table-column :label="$t('system.department.departmentCode')" width="150px" prop="departmentCode" show-overflow-tooltip/>

      <el-table-column align="center" :label="$t('system.department.departmentUserBy')" width="120px" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.lastName}} {{scope.row.firstName}}
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('system.department.employeeNums')" width="120px" prop="employeeNums"/>

      <el-table-column align="center" width="100" :label="$t('system.department.departmentStatus')" prop="departmentStatus">
        <template slot-scope="{row}">
          <el-tag :type="row.departmentStatus === 1 ? 'primary' : 'danger' " size="mini">
            {{row.departmentStatus === 1 ? $t('common.table.inUse') : $t('common.table.disabled')}}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('common.table.actions')" width="180" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" class="export" @click="detailDialog(row)">{{$t('common.table.view')}}</el-button>
          <el-button type="primary" size="mini" @click="openDialog('edit', row)">{{$t('common.table.edit')}}</el-button>
          <el-button :type="row.departmentStatus === 1 ? 'info' : 'danger'" size="mini" @click="changeStatus(row)">{{row.departmentStatus === 1 ? '禁用' : '启用'}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="sortVisible" :title="$t('system.department.sequenceDepartment')" width="500px" center>
      <div style="overflow: auto;height: 400px">
        <el-tree
          ref="tree"
          :data="sortDataList"
          node-key="id"
          :default-expand-all="false"
          :props="{label: 'departmentName', children: 'children'}"
          :expand-on-click-node="false">
        <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            @click="moveFirst(node, data)">
            <svg-icon class-name="svgClass" icon-class="shuangjiantoushang" size="18" />
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="moveOne(node, data, 1)">
            <svg-icon class-name="svgClass" icon-class="jiantoushang" size="18" />
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="moveOne(node, data, -1)">
            <svg-icon class-name="svgClass" icon-class="jiantouxia" size="18" />
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="moveLast(node, data)">
            <svg-icon class-name="svgClass" icon-class="shuangjiantouxia" size="18" />
          </el-button>
        </span>
      </span>
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="saveSort">{{$t('common.buttonText.save')}}</el-button>
        <el-button type="danger" size="small" @click="sortVisible=false">{{$t('common.buttonText.cancel')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='add'?$t('system.department.addDepartment'):$t('system.department.editDepartment')" width="620px" center @closed="clearData">
      <el-form ref="addDepartment" :model="menuData" label-width="150px" label-position="right" size="small" :rules="menuDataRules">
        <el-form-item :label="$t('system.department.parentDepartment')">
          <el-cascader
            style="width: 355px"
            v-model="menuData.parentsName"
            :options="dataList"
            :props="{value: 'id', label: 'departmentName', children: 'children'}"
            filterable
            clearable
            placeholder="可搜索"
            change-on-select
            @change="getParentId"
          ></el-cascader>
        </el-form-item>
        <el-form-item :label="$t('system.department.departmentCode')" prop="departmentCode">
          <el-input v-model="menuData.departmentCode" clearable :placeholder="$t('system.department.departmentCode')" style="width: 355px" />
        </el-form-item>
        <el-form-item :label="$t('system.department.departmentName')" prop="departmentName">
          <el-input v-model="menuData.departmentName" clearable :placeholder="$t('system.department.departmentName')" style="width: 355px" />
        </el-form-item>
        <el-form-item :label="$t('system.department.departmentUserBy')" prop="userBackendInfoId">
          <el-select filterable remote :remote-method="selectUserListAllFun" :loading="loading1" v-model="menuData.userBackendInfoId" clearable :placeholder="$t('system.department.searchName')" style="width: 355px">
            <el-option v-for="(item, index) in userInfoList" :label="item.userName" :value="item.accountBId" :key="index">
              {{item.userName}}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('system.department.departmentStatus')" prop="departmentStatus">
          {{menuData.departmentStatus === 1 ? $t('common.table.inUse') : $t('common.table.disabled')}}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="confirmAdd('addDepartment', dialogType === 'add' ? 1 : 2)">{{$t('common.buttonText.confirm')}}</el-button>
        <el-button type="danger" size="small" @click="dialogVisible=false">{{$t('common.buttonText.cancel')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="detailModal" :title="$t('system.department.viewDepartment')" width="620px" center @closed="clearData">
      <el-form ref="addDepartment" :model="menuData" label-width="140px" label-position="right" size="small" :rules="menuDataRules">
        <el-tabs v-model="activeName">
          <el-tab-pane :label="$t('system.department.basicInformation')" name="1">
            <el-form-item :label="$t('system.department.parentDepartment')">
              <el-cascader
                style="width: 355px"
                v-model="menuData.parentsName"
                :options="dataList"
                :props="{value: 'id', label: 'departmentName', children: 'children'}"
                filterable
                clearable
                :disabled="true"
                placeholder="可搜索"
                change-on-select
                @change="getParentId"
              ></el-cascader>
            </el-form-item>
            <el-form-item :label="$t('system.department.departmentCode')" prop="departmentCode">
              <el-input v-model="menuData.departmentCode" clearable style="width: 355px" readonly />
            </el-form-item>
            <el-form-item :label="$t('system.department.departmentName')" prop="departmentName">
              <el-input v-model="menuData.departmentName" clearable style="width: 355px" readonly/>
            </el-form-item>
            <el-form-item :label="$t('system.department.departmentUserBy')" prop="userBackendInfoId">
              <el-select filterable remote :remote-method="selectUserListAllFun" :loading="loading1" v-model="menuData.userBackendInfoId" disabled style="width: 355px">
                <el-option v-for="(item, index) in userInfoList" disabled :label="item.userName" :value="item.accountBId" :key="index">
                  {{item.userName}}
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('system.department.employeeNums')" prop="departmentBId">
              <el-input v-model="menuData.departmentBId" clearable style="width: 355px" readonly/>
            </el-form-item>
            <el-form-item :label="$t('system.department.departmentStatus')" prop="departmentStatus">
              {{menuData.departmentStatus === 1 ? $t('common.table.inUse') : $t('common.table.disabled')}}
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane :label="$t('system.department.departmentStaff')" name="2">
            <el-table
              :data="userDepartmentList"
              border
              fit
              size="small"
              :header-cell-style="{background: '#a7bfee'}">
              <el-table-column align="center" :label="$t('system.department.userName')" prop="userName" show-overflow-tooltip/>
              <el-table-column align="center" :label="$t('system.department.mobilePhone')" prop="mobilePhone" show-overflow-tooltip/>
              <el-table-column align="center" :label="$t('system.department.userAccount')" prop="userAccount" show-overflow-tooltip/>
            </el-table>
            <Pagination :total="userDepartmentForm.total" :page.sync="userDepartmentForm.pageNum" :limit.sync="userDepartmentForm.pageSize" @pagination="selectUserDepartmentListFun"></Pagination>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="detailModal=false">{{$t('common.buttonText.close')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import {
  selectDepartmentListAllApi,
  saveDepartmentApi,
  updateDepartmentApi,
  updateStatusApi,
  deleteByIdApi,
  selectUserListAllApi,
  selectUserAccountListAllApi,
  selectSysUserDepartmentCountApi,
  selectUserDepartmentListApi,
  departmentSort
} from '@/api/system'
import { deepClone } from '@/utils/index'
import Pagination from '@/components/Pagination'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      activeName: '1',
      dataList: [],
      selectList: [],
      userDepartmentList: [],
      listLoading: true,
      loading1: false,
      dialogVisible: false,
      dialogVisible1: false,
      sortVisible: false,
      dialogType: '',
      indent: 20,
      detailModal: false,
      menuData: {
        parentsName: [],
        departmentCode: '',
        departmentName: '',
        userBackendInfoId: '',
        departmentStatus: 1,
        parentDepIds: '',
        firstName: '',
        lastName: '',
        departmentBId: ''
      },
      postData: {
        departmentCode: '',
        departmentName: '',
        departmentStatus: ''
      },
      menuDataRules: {
        departmentCode: [
          { required: true, message: 'Department codes must be filled in', trigger: 'blur' }
        ],
        departmentName: [
          { required: true, message: 'Department name must be filled in', trigger: 'blur' }
        ],
        userBackendInfoId: [
          { required: true, message: 'Department heads must fill it out', trigger: 'blur' }
        ]
      },
      areaList: [
        // 部门状态：0无效、1有效
        {
          labelZh: '已禁用',
          label: 'Disabled',
          id: 0
        },
        {
          labelZh: '使用中',
          label: 'Active',
          id: 1
        }
      ],
      sub: '',
      userListPrams: {
        pageSize: 9999,
        total: 0,
        pageIndex: 1,
        searchKey: ''
      },
      userDepartmentForm: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        departmentBId: ''
      },
      linkList: [],
      sortDataList: [],
      userInfoList: ''
    }
  },
  created() {
    this.getDataList();
  },
  methods: {
    clearData() {
      this.menuData.parentsName = [];
      this.menuData.departmentCode = '';
      this.menuData.departmentName = '';
      this.menuData.userBackendInfoId = '';
      this.menuData.depSequence = '';
      this.menuData.departmentStatus = 1;
      this.menuData.parentDepIds = '';
      this.menuData.id = '';
      this.menuData.parentBId = '';
      this.menuData.departmentBId = '';
    },
    getDataList() {
      selectDepartmentListAllApi(this.postData).then(res => {
        this.dataList = res.data.list;
        this.postData.total = res.data.total;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message)
      });
      this.listLoading = false;
    },
    openDialog(type, row) {
      this.dialogType = type;
      if (type === 'edit') {
        this.menuData = deepClone(row);
        // 回显上级
        if (row.parentDepIds) {
          this.menuData.parentsName = this.menuData.parentDepIds.split(',').map(e => {
            return Number(e);
          })
        } else {
          this.menuData.parentsName = []
        }
      }
      this.selectUserListAllFun(); // 获取后台人员
      this.dialogVisible = true;
    },
    getParentId(arr) {
      if (arr.length) {
        this.menuData.parentBId = arr[arr.length - 1];
        this.menuData.parentDepIds = arr.join(',')
      } else {
        this.menuData.parentBId = '';
        this.menuData.parentDepIds = ''
      }
    },
    confirmAdd(formName, type) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (type === 1) {
            saveDepartmentApi(this.menuData).then(res => {
              this.$message.success(res.message);
              this.$refs[formName].resetFields();
              this.getDataList();
              this.dialogVisible = false;
            }).catch(err => {
              this.listLoading = false;
              this.$message.error(err.message)
            });
          } else {
            updateDepartmentApi(this.menuData).then(res => {
              this.$message.success(res.message);
              this.$refs[formName].resetFields();
              this.getDataList();
              this.dialogVisible = false;
            }).catch(err => {
              this.listLoading = false;
              this.$message.error(err.message)
            });
          }
        } else {
          this.$message.warning('Verification failed!');
          return false;
        }
      });
    },
    openSortDialog() {
      this.sortDataList = JSON.parse(JSON.stringify(this.dataList));
      this.sortVisible = true;
    },
    // 置顶部门
    moveFirst(node, data) {
      let arr = node.parent.data.children || node.parent.data;
      let rowIndex = arr.findIndex(e => e.id === data.id);
      if (rowIndex === 0) {
        return this.$message.warning('To the top!');
      }
      let newAttrSequ = arr[0].depSequence;
      arr[rowIndex].depSequence = newAttrSequ - 1;
      let top = deepClone(arr.splice(rowIndex, 1)[0]);
      arr.unshift(top);
    },
    // 移到尾部部门
    moveLast(node, data) {
      let arr = node.parent.data.children || node.parent.data;
      let rowIndex = arr.findIndex(e => e.id === data.id);
      if (rowIndex === arr.length - 1) {
        return this.$message.warning('To the bottom!');
      }
      let newAttrSequ = arr[arr.length - 1].depSequence;
      arr[rowIndex].depSequence = newAttrSequ + 1;
      let end = deepClone(arr.splice(rowIndex, 1)[0]);
      arr.push(end);
    },
    // 替换
    moveComm(arr, curIndex, nextIndex) {
      let oldAttrSequ = arr[curIndex].depSequence;
      let newAttrSequ = arr[nextIndex].depSequence;
      arr[curIndex].depSequence = newAttrSequ;
      arr[nextIndex].depSequence = oldAttrSequ;
      arr[curIndex] = deepClone(arr.splice(nextIndex, 1, arr[curIndex])[0]);
      return arr;
    },
    // 上下移动
    moveOne(node, data, move) {
      let arr = node.parent.data.children || node.parent.data;
      let rowIndex = arr.findIndex(e => e.id === data.id);
      if (rowIndex === 0 && move === 1) {
        return this.$message.warning('To the top!');
      } else if (rowIndex === arr.length - 1 && move === -1) {
        return this.$message.warning('To the bottom!');
      } else {
        arr = this.moveComm(arr, rowIndex, rowIndex - move);
      }
    },
    saveSort() {
      departmentSort(this.sortDataList).then(res => {
        this.sortVisible = false;
        this.getDataList();
        this.$message.success("Update successfully!")
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    detailDialog(row) {
      this.menuData = deepClone(row);
      this.activeName = '1';
      // 回显上级
      if (row.parentDepIds) {
        this.menuData.parentsName = this.menuData.parentDepIds.split(',').map(e => {
          return Number(e);
        })
      } else {
        this.menuData.parentsName = []
      }
      // 根据departmentBId来统计部门现有人数
      selectSysUserDepartmentCountApi({ departmentBId: row.bid }).then(res => {
        this.detailModal = true;
        this.menuData.departmentBId = res.data;
      });
      // 查看部门现有成员人数列表
      this.userDepartmentForm.departmentBId = row.bid;
      this.selectUserDepartmentListFun(this.userDepartmentForm);
      this.selectUserListAllFun(); // 获取后台人员
    },
    // 查看部门现有成员人数列表
    selectUserDepartmentListFun() {
      selectUserDepartmentListApi(this.userDepartmentForm).then(res => {
        this.userDepartmentList = res.data.list;
        this.userDepartmentForm.total = res.data.total;
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    changeStatus(row) {
      let obj = {
        departmentStatus: row.departmentStatus === 1 ? 0 : 1,
        id: row.id
      };
      updateStatusApi(obj).then(res => {
        this.$message.success('Update successfully!');
        this.getDataList();
      }).catch(err => {
        this.$message.error(err.message)
      });
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
    },
    deleteMenu() {
      if (!this.selectList.length) {
        return this.$message('Please select the data you want to delete');
      }
      if (this.selectList.length > 1) {
        return this.$message('Only one record can be deleted at a time');
      }
      this.$confirm('This action will delete the menu and continue?', 'Tips', {
        confirmButtonText: this.$t('common.buttonText.confirm'),
        cancelButtonText: this.$t('common.buttonText.cancel'),
        type: 'warning',
        center: true
      }).then(() => {
        let obj = { id: this.selectList[0].id };
        this.sub = this.selectList[0].sub;
        if (this.sub === 0 && this.sub !== '') {
          deleteByIdApi(obj).then(res => {
            this.getDataList();
            this.$message.success(res.message);
          }).catch(err => {
            this.$message.error(err.message)
          });
        } else {
          this.$message.error("There are sublevels for this department, so it cannot be deleted！")
        }
      }).catch(() => {
      });
    },
    // 从用户列表别获取联系人
    getSelectUserList(val) {
      selectUserAccountListAllApi(val).then(res => {
        this.linkList = res.data
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    selectUserListAllFun(val) {
      const _this = this;
      if (val !== '') {
        this.loading1 = true;
        selectUserListAllApi(val).then(res => {
          _this.userInfoList = res.data;
          _this.loading1 = false;
        });
      } else {
        this.userInfoList = [];
      }
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

<style lang="scss" scoped>
  @import '~@/styles/variables.scss';
  .menu-page {
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
  }
</style>
