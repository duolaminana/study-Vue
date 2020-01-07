<template>
  <div class="app-container roleManagement">
    <div class="search-box">
      <el-form label-width="90px" inline size="small">
        <el-form-item label="角色名称">
          <el-input v-model="postData.roleName" clearable placeholder="请输入角色名称" style="width: 200px"/>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="postData.status" clearable placeholder="请选择状态" style="width: 200px">
            <el-option v-for="(item, index) in areaList" :label="item.label" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchRole">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="addDialog">新增</el-button>
      <el-button type="primary" size="small" @click="deleteRole()">删除</el-button>
      <!--<el-button type="primary" size="small" class="export">导出excel</el-button>-->
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="正在查询中。。。"
      border
      fit
      size="mini"
      :header-cell-style="{background: '#a7bfee'}" @selection-change="getSelect1">
      <el-table-column
        align="center"
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column label="角色名称" prop="roleName" show-overflow-tooltip/>

      <el-table-column align="center" width="150" label="修改人" prop="updateUserName" show-overflow-tooltip/>

      <el-table-column align="center" width="160" label="修改时间" prop="createTime">
        <template slot-scope="scope">
          {{scope.row.createTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="100" label="状态" prop="roleStatus">
        <template slot-scope="scope">
          <el-tag :type="scope.row.roleStatus === 1 ? 'primary' : 'danger' " size="mini">{{ scope.row.roleStatus === 1 ?
            '使用中' : '已禁用' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="265px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" class="export table-btn-width" @click="openDetail(row)">详情</el-button>
          <el-button type="primary" size="mini" class="table-btn-width" @click="openDialog(row)">编辑权限</el-button>
          <el-button :type="row.roleStatus === 1 ? 'info' : 'danger'" size="mini" class="table-btn-width" @click="changeStatus(row)">
            {{row.roleStatus === 1 ? '禁用' : '启用'}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageIndex" :limit.sync="postData.pageSize" @pagination="getDataList"></Pagination>

    <el-dialog :visible.sync="addModel" title="新增角色" width="500px" center>
      <el-form label-width="80px" label-position="right" size="mini">
        <el-form-item label="角色名称" required>
          <el-input v-model="newRoleName" clearable placeholder="请输入角色名称" class="form-dialog-width"/>
          <div class="tips">注意：角色名称一旦新建不能修改</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" :loading="addLoading" @click="addRole">确认</el-button>
        <el-button type="danger" size="small" @click="addDialog">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      width="800px"
      center
      title="添加用户列表"
      :close-on-click-modal="false"
      :visible.sync="addUserModel"
      append-to-body>
      <div class="search-box">
        <el-form label-width="130px" label-position="right" inline size="small">
          <el-form-item label="名">
            <el-input v-model="userListParam.firstName" clearable placeholder="请输入用户名" style="width: 200px"/>
          </el-form-item>
          <el-form-item label="姓">
            <el-input v-model="userListParam.lastName" clearable placeholder="请输入用户姓" style="width: 200px"/>
          </el-form-item>
          <el-form-item label="用户账号">
            <el-input v-model="userListParam.userAccount" clearable placeholder="请输入用户账号" style="width: 200px"/>
          </el-form-item>
          <el-form-item label="用户手机号码">
            <el-input v-model="userListParam.mobilePhone" clearable placeholder="请输入用户账号" style="width: 200px"/>
          </el-form-item>
          <el-form-item style="float:right;">
            <el-button type="primary" class="export" @click="searchUser">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="userListData"
        border
        fit
        highlight-current-row
        style="margin: 10px 0"
        size="mini"
        @selection-change="getSelectUserList"
        :header-cell-style="{background: '#a7bfee'}">
        <el-table-column
          align="center"
          type="selection"
          width="55">
        </el-table-column>

        <el-table-column align="center" label="姓名" prop="userName">
        </el-table-column>

        <el-table-column align="center" label="账号" prop="userAccount"/>

        <el-table-column align="center" label="电话" prop="mobilePhone"/>

        <el-table-column align="center" width="80px" label="用户状态" prop="accountStatus">
          <template slot-scope="scope">
            <el-tag :type="scope.row.accountStatus === 0 ? 'primary' : 'danger' " size="mini">{{ scope.row.accountStatus
              === 0 ?
              '正常' : '已禁用' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>

      <Pagination :total="userListParam.total" :page.sync="userListParam.pageNum" :limit.sync="userListParam.pageSize" @pagination="searchUser"/>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="addUserBatchMethod">确定</el-button>
        <el-button type="danger" size="small" @click="addUserModel=false">取消</el-button>
      </div>
    </el-dialog>

    <!-- 角色详情-->
    <el-dialog :visible.sync="detailModal" title="角色详情" width="600px" center>
      <el-form :model="detailData" label-width="100px" label-position="right" size="small" inline>
        <el-form-item label="角色名称：">
          {{detailData.roleName}}
        </el-form-item>
        <el-form-item label="状态：">
          {{detailData.roleStatus === 1 ? '正常' : '已禁用'}}
        </el-form-item>
      </el-form>
      <el-tabs value="1">
        <el-tab-pane label="菜单" name="1">
          <div style="max-height: 500px;overflow: auto">
            <el-tree :data="roleTree" :props="{label: 'menuTitle'}" check-strictly default-expand-all></el-tree>
          </div>
        </el-tab-pane>
        <el-tab-pane label="涉及用户" name="2">
          <el-table
            :data="roleUserList"
            border
            fit
            size="mini"
            :header-cell-style="{background: '#a7bfee'}">
            <el-table-column align="center" label="用户账号" prop="userAccount"/>
            <el-table-column align="center" label="用户名称" prop="userName"/>
            <el-table-column align="center" label="状态" prop="prop">
              <template slot-scope="scope">
                <el-tag :type="scope.row.accountStatus === 0 ? 'primary' : 'danger' " size="mini">
                  {{scope.row.accountStatus === 0 ? '正常' : '已禁用' }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
          <Pagination :total="roleUserData.total" :page.sync="roleUserData.pageIndex" :limit.sync="roleUserData.pageSize" @pagination="getRoleUserList"></Pagination>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="detailModal = false">关闭</el-button>
      </div>
    </el-dialog>
    <!--编辑菜单权限-->
    <el-dialog :visible.sync="dialogVisible" title="编辑菜单权限" center>
      <el-tabs value="1">
        <el-tab-pane label="编辑菜单" name="1">
          <el-form :model="detailData" label-width="100px" label-position="right" size="small" inline style="border-bottom: 1px solid #f4f4f4">
            <el-form-item label="角色名称：">
              {{detailData.roleName}}
            </el-form-item>
            <el-form-item label="状态：">
              {{detailData.roleStatus === 1 ? '使用中' : '已禁用'}}
            </el-form-item>
          </el-form>
          <div style="max-height: 500px;overflow: auto">
            <el-tree ref="allTree" :data="routes" :props="{label: 'title'}" :default-checked-keys="menuIds" :check-strictly="checkStrictly" show-checkbox node-key="menuId"></el-tree>
          </div>
          <div style="text-align: center;margin: 15px 0">
            <el-button type="primary" size="small" @click="saveRoleMenu">确认</el-button>
            <el-button type="danger" size="small" @click="dialogVisible=false">取消</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="编辑用户" name="2">
          <div class="topBtns">
            <el-button type="primary" size="small" @click="addUserDialog">添加用户</el-button>
          </div>
          <el-table
            :data="roleUserList"
            border
            fit
            size="mini"
            :header-cell-style="{background: '#a7bfee'}">
            <el-table-column align="center" label="用户账号" prop="userAccount"/>
            <el-table-column align="center" label="用户名称" prop="userName"/>
            <el-table-column align="center" width="80px" label="状态" prop="prop">
              <template slot-scope="scope">
                <el-tag :type="scope.row.accountStatus === 0 ? 'primary' : 'danger' " size="mini">{{
                  scope.row.accountStatus === 0 ? '正常' : '已禁用' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" width="80px" label="操作">
              <template slot-scope="{row}">
                <el-button type="primary" size="mini" @click="deleteUser(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <Pagination :total="roleUserData.total" :page.sync="roleUserData.pageIndex" :limit.sync="roleUserData.pageSize" @pagination="getRoleUserList"></Pagination>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import {
  getRoleList,
  addRole,
  deleteRole,
  enableRole,
  getRoleTree,
  getRoleUserList,
  getRoleAllTree,
  setRoleMenu,
  selectUserAccountList,
  addRoleMember,
  deleteRoleMember
} from '@/api/system'
import treeMenu from '@/mixin/treeMenu'
import { deepClone, parseTime } from '@/utils/index'

export default {
  components: {
    Pagination
  },
  mixins: [treeMenu],
  data() {
    return {
      checkStrictly: false,
      listLoading: true,
      addLoading: false,
      addModel: false,
      dialogVisible: false,
      detailModal: false,
      addUserModel: false,
      dialogType: '',
      indent: 20,
      newRoleName: '',
      detailData: {},
      menuIds: [],
      roleUserList: [],
      userListData: [],
      selectList: [],
      selectList1: [],
      userListParam: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      postData: {
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        roleName: '',
        status: ''
      },
      roleUserData: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      areaList: [
        {
          label: '使用中',
          id: 1
        },
        {
          label: '禁用',
          id: 0
        }
      ],
      list: [],
      roleTree: [],
      roleAllTree: []
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    changeStatus(row) {
      let obj = {
        enable: row.roleStatus === 1 ? 0 : 1,
        id: row.id
      };
      enableRole(obj).then(res => {
        this.getDataList();
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    searchRole() {
      this.postData.pageIndex = 1;
      this.getDataList()
    },
    searchUser() {
      this.userListParam.pageIndex = 1;
      this.getDataUserList()
    },
    getDataUserList() {
      // selectUserAccountList
      let obj = {};
      for (let key in this.userListParam) {
        if (this.userListParam[key] !== '') {
          obj[key] = this.userListParam[key]
        }
      }
      selectUserAccountList(obj).then(res => {
        this.userListData = res.data.list || [];
        this.userListParam.total = res.data.total;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message)
      });
    },
    getDataList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      getRoleList(obj).then(res => {
        this.list = res.data.list || [];
        this.postData.total = res.data.total;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message)
      });
    },
    addDialog() {
      this.addModel = !this.addModel;
    },
    addUserDialog() {
      this.addUserModel = !this.addUserModel;
      this.userListData = null;
      this.searchUser();
    },
    openDialog(row) {
      this.detailData = deepClone(row);
      this.dialogVisible = true;
      this.checkStrictly = true;
      this.getRoleAllTree();
      this.getRoleUserList(this.detailData.bid);
    },
    confirmAdd() {
      this.addModel = false;
    },
    getSelectUserList(selects) {
      this.selectList = selects;
    },
    addUserBatchMethod() {
      if (!this.selectList.length) {
        return this.$message('请选择数据');
      }
      this.$confirm('是否确定添加?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.deleteIdsForm = this.selectList.map(e => {
          return e.accountBId;
        }).join(",");
        let formData = new FormData();
        formData.append('accountBids', this.deleteIdsForm);
        formData.append("roleBid", this.detailData.bid);
        addRoleMember(formData).then(res => {
          if (res.status === 200) {
            this.$message.success('操作成功!');
          }
          this.addUserModel = false;
          this.getRoleUserList(this.detailData.bid);
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
    openDetail(row) {
      this.detailData = deepClone(row);
      this.detailModal = true;
      this.getRoleTree();
      this.getRoleUserList(this.detailData.bid);
    },
    getRoleTree() {
      getRoleTree({ bId: this.detailData.bid }).then(res => {
        this.roleTree = res.data || []
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    getRoleUserList(roleBid) {
      this.roleUserData.roleBid = roleBid;
      getRoleUserList(this.roleUserData).then(res => {
        this.roleUserList = res.data.list || [];
        this.roleUserData.total = res.data.total
        this.roleUserData.pageIndex = res.data.pageNum;
        this.roleUserData.pageSize = res.data.pageSize;
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    getRoleAllTree() {
      getRoleAllTree({ bId: this.detailData.bid }).then(res => {
        // this.roleAllTree = res.data || [];
        this.menuIds = this.getMenuIds(res.data, 'check');
        this.$store.commit('SET_ROLEROUTES', res.data);
        this.getRoutes();
        this.checkStrictly = false;
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    getMenuIds(arr = [], val) {
      let menuId = [];
      arr.forEach(e => {
        e.path = e.menuPath;
        if (e.menuLevel === 0) {
          e.root = true;
        }
        if (e[val]) {
          menuId.push(e.bid);
        }
        if (e.children && e.children.length) {
          menuId = menuId.concat(this.getMenuIds(e.children, val))
        }
      });
      return menuId;
    },
    saveRoleMenu() {
      let obj = {
        menuBIds: this.$refs.allTree.getCheckedKeys().concat(this.$refs.allTree.getHalfCheckedKeys()),
        roleBId: this.detailData.bid
      };
      setRoleMenu(obj).then(res => {
        this.dialogVisible = false;
        this.$message.success('保存成功')
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    addRole() {
      if (!this.newRoleName) {
        return this.$message.warning('请填写角色名称')
      }
      let obj = { roleName: this.newRoleName };
      this.addLoading = true;
      addRole(obj).then(res => {
        this.$message.success('新增成功');
        this.postData.pageIndex = 1;
        this.addLoading = false;
        this.newRoleName = '';
        this.getDataList();
        this.addDialog()
      }).catch(err => {
        this.addLoading = false;
        this.$message.error(err.message)
      });
    },
    deleteRole() {
      if (!this.selectList1.length) {
        return this.$message('请选择需要删除的行');
      }
      if (this.selectList1.length > 1) {
        return this.$message('一次只能删除一条记录');
      }
      this.$confirm('此操作将删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        let obj = { id: this.selectList1[0].id };
        deleteRole(obj).then(res => {
          this.getDataList();
          this.$message.success('删除成功');
        }).catch(err => {
          this.$message.error(err.message)
        });
      }).catch(() => {
      });
    },
    deleteUser(row) {
      this.$confirm('此操作将删除该角色下的成员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        let obj = new FormData();
        obj.append("id", row.id);
        deleteRoleMember(obj).then(res => {
          this.getRoleUserList(this.detailData.bid);
          this.$message.success('删除成功');
        }).catch(err => {
          this.$message.error(err.message)
        });
      }).catch(() => {
      });
    },
    // 勾选触发 selects为选择的数据数组
    getSelect(selects) {
      this.selectList = selects
    },
    getSelect1(selects) {
      this.selectList1 = selects
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
