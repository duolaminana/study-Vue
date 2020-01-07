<template>
  <div class="app-container roleManagement">
    <div class="search-box">
      <el-form label-width="90px" inline size="small">
        <el-form-item :label="$t('system.userManage.account')">
          <el-input v-model="postData.userAccount" style="width: 200px"/>
        </el-form-item>
        <el-form-item :label="$t('system.role.status')">
          <el-select v-model="postData.accountStatus" clearable style="width: 200px">
            <el-option v-for="(item, index) in areaList" :label="item.label" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchData">{{$t('system.role.search')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="openDialog('add')">{{$t('system.role.add')}}</el-button>
      <el-button type="primary" size="small" @click="deleteBatchMethod()">{{$t('system.role.delete')}}</el-button>
      <!--<el-button type="primary" size="small" class="export">导出excel</el-button>-->
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      :element-loading-text="$t('system.userManage.lodding')"
      border
      fit
      size="mini"
      :header-cell-style="{background: '#a7bfee'}" @selection-change="getSelect">
      <el-table-column
        align="center"
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column :label="$t('system.userManage.account')" prop="userAccount" show-overflow-tooltip align="center"/>

      <el-table-column :label="$t('system.role.roleName')" prop="rolesStr" show-overflow-tooltip align="center"/>

      <el-table-column :label="$t('system.userManage.email')" prop="emailAddress" show-overflow-tooltip align="center"/>

      <el-table-column :label="$t('system.role.contact')" prop="mobilePhone" show-overflow-tooltip align="center"/>

      <el-table-column align="center" width="100" :label="$t('system.role.status')" prop="accountStatus">
        <template slot-scope="scope">
          <el-tag :type="scope.row.accountStatus === 0 ? 'primary' : 'danger' " size="mini">{{ scope.row.accountStatus
            === 0 ?
            $t('system.role.active') : $t('system.role.inactive') }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('system.role.operation')" width="210" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" class="export" @click="detailDialog(row)">{{$t('system.role.view')}}</el-button>
          <el-button type="primary" size="mini" v-if="row.accountStatus === 0" @click="openDialog('edit', row)">{{$t('system.userManage.editUser')}}</el-button>
          <el-button :type="row.accountStatus === 1 ? 'info' : 'danger'" size="mini" @click="changeMethod(row)">
            {{row.accountStatus === 0 ? $t('system.role.disable') : $t('system.role.enable')}}
          </el-button>
          <!--          <el-button type="danger" size="mini" @click="deleteMethod(row)">删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageIndex" :limit.sync="postData.pageSize"
                @pagination="getDataList"></Pagination>
    <!-- 详情-->
    <el-dialog :visible.sync="detialModel" :title="$t('system.role.userDetails')" class="dialogClass" center width="800px">
      <el-form label-width="120px" label-position="right" size="small">
        <el-row :gutter="28">
          <el-col :span="16">
            <el-form-item :label="$t('system.userManage.account')" prop="userAccount">
              <el-input v-model="sysUserForm.userAccount" readonly />
            </el-form-item>
            <el-form-item :label="$t('system.userManage.employee')" prop="accountId">
              <el-input v-model="sysUserForm.accountId" readonly />
            </el-form-item>
            <!--<el-form-item label="账号id" hidden>-->
              <!--<el-input v-model="sysUserForm.accountBId" readonly/>-->
            <!--</el-form-item>-->
            <el-form-item :label="$t('system.role.givenName')" prop="firstName">
              <el-input v-model="sysUserForm.firstName" readonly/>
            </el-form-item>
            <el-form-item :label="$t('system.role.surname')" prop="lastName">
              <el-input v-model="sysUserForm.lastName" readonly/>
            </el-form-item>
            <el-form-item :label="$t('system.role.gender')" prop="userSex" >
              <el-radio-group v-model="sysUserForm.userSex" disabled>
                <el-radio :label="1">{{$t('system.role.man')}}</el-radio>
                <el-radio :label="2">{{$t('system.role.woman')}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <div class="avatar">
              <el-upload
                disabled
                class="avatar-uploader"
                :action="uploadActionUrl"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="sysUserForm.photoPath" :src="sysUserForm.photoPath" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
          </el-col>
        </el-row>
        <el-form-item :label="$t('system.userManage.email')" prop="emailAddress">
          <el-input v-model="sysUserForm.emailAddress" readonly/>
        </el-form-item>
        <el-form-item :label="$t('system.userManage.emailAddress')" prop="contactAddress">
          <el-input v-model="sysUserForm.contactAddress" readonly/>
        </el-form-item>
        <el-row :gutter="28">
          <el-col :span="12">
            <el-form-item :label="$t('system.userManage.StraightTelephone')" prop="officePhone">
              <el-input v-model="sysUserForm.officePhone" :min="0" readonly/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('system.userManage.extension')" prop="officePhone2">
              <el-input v-model="sysUserForm.officePhone2" :min="0" readonly/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('system.userManage.mobile1')" prop="mobilePhone">
              <el-input v-model="sysUserForm.mobilePhone" :min="0" readonly/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('system.userManage.mobile2')" prop="mobilePhone2">
              <el-input v-model="sysUserForm.mobilePhone2" :min="0" readonly/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('system.userManage.preLanguage')">
              <el-select v-model="sysUserForm.usedLanguage" clearable disabled @change="setOtherList">
                <el-option v-for="(item, index) in languageList" :label="item.label" :value="item.id" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('system.userManage.otherLanguage')" prop="preferedLanguageStr">
              <el-select v-model="sysUserForm.preferedLanguageStr" multiple @change="getcommLanguage" disabled>
                <el-option v-for="(item, index) in languageList1" :label="item.label" :value="item.id" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="$t('system.role.roleName')" prop="roles">
          <el-select v-model="sysUserForm.roles" multiple disabled style="width: 100%">
            <el-option v-for="(item, index) in sysRoleList" :label="item.roleName" :value="item.bid" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="初始化账号密码" v-if="dialogType==='add'" prop="password">-->
        <!--<el-input v-model="sysUserForm.password" clearable placeholder="请输入账号初始化密码"/>-->
        <!--</el-form-item>-->
        <el-form-item :label="$t('system.userManage.company')" prop="companyName">
          <el-select v-model="sysUserForm.companyStr" multiple disabled style="width: 100%" @change="getDefaultCompany">
            <el-option v-for="(item, index) in supplyCompanyList" :label="item.companyName" :value="item.bid" :key="index" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('system.userManage.default')" prop="usedCompanyName">
          <el-select v-model="sysUserForm.usedCompany" disabled style="width: 100%">
            <el-option v-for="(item, index) in defaultCompanyList" :label="item.companyName" :value="item.bid" :key="index" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('system.userManage.department')" prop="departments">
          <el-select v-model="sysUserForm.departments" multiple disabled style="width: 100%">
            <el-option v-for="(item, index) in departmentList" :label="item.departmentName" :value="item.bid" :key="index" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('system.userManage.designation')" prop="position">
          <el-input v-model="sysUserForm.position" readonly/>
        </el-form-item>
        <el-form-item :label="$t('system.userManage.isLead')" >
          <el-radio-group v-model="sysUserForm.isLead" disabled>
            <el-radio :label="1">{{$t('system.role.yes')}}</el-radio>
            <el-radio :label="0">{{$t('system.role.no')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('system.role.status')" prop="accountStatus">
          {{sysUserForm.accountStatus ? $t('system.userManage.inDisable') : $t('system.userManage.inEmploy')}}
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="detailDialogClos()">{{$t('system.role.return')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='add'? $t('system.role.addTheCustomer'):$t('system.role.editTheCustomer')" center width="800px">
      <el-form :model="sysUserForm" ref="ruleForm" label-width="120px" label-position="right" size="small" :rules="sysUserDataRules">
        <el-row :gutter="28">
          <el-col :span="16">
            <el-form-item :label="$t('system.userManage.account')" prop="userAccount">
              <el-input v-model="sysUserForm.userAccount" :disabled="dialogType === 'edit'" clearable />
            </el-form-item>
            <el-form-item :label="$t('system.userManage.employee')" prop="accountId">
              <el-input v-model="sysUserForm.accountId" clearable />
            </el-form-item>
            <!--<el-form-item label="账号id" hidden>-->
              <!--<el-input v-model="sysUserForm.accountBId" clearable/>-->
            <!--</el-form-item>-->
            <el-form-item :label="$t('system.role.givenName')" prop="firstName">
              <el-input v-model="sysUserForm.firstName" clearable />
            </el-form-item>
            <el-form-item :label="$t('system.role.surname')" prop="lastName">
              <el-input v-model="sysUserForm.lastName" clearable />
            </el-form-item>
            <el-form-item :label="$t('system.role.gender')" prop="userSex">
              <el-radio-group v-model="sysUserForm.userSex">
                <el-radio :label="1">{{$t('system.role.man')}}</el-radio>
                <el-radio :label="2">{{$t('system.role.woman')}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <div class="avatar">
              <el-upload
                class="avatar-uploader"
                :action="uploadActionUrl"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="sysUserForm.photoPath" :src="sysUserForm.photoPath" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <!--<div style="font-size: 10px;text-align: center;color: #ff3a3d;padding: 5px 0;">点击头像进行更换</div>-->
            </div>
          </el-col>
        </el-row>
        <el-form-item :label="$t('system.userManage.email')" prop="emailAddress">
          <el-input v-model="sysUserForm.emailAddress" clearable />
        </el-form-item>
        <el-form-item :label="$t('system.userManage.address')" prop="contactAddress">
          <el-input v-model="sysUserForm.contactAddress" clearable />
        </el-form-item>
        <el-row :gutter="28">
          <el-col :span="12">
            <el-form-item :label="$t('system.userManage.StraightTelephone')" prop="officePhone">
              <el-input v-model="sysUserForm.officePhone" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('system.userManage.extension')" prop="officePhone2">
              <el-input v-model="sysUserForm.officePhone2" :min="0" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('system.userManage.mobile1')" prop="mobilePhone">
              <el-input v-model="sysUserForm.mobilePhone" :min="0" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('system.userManage.mobile2')" prop="mobilePhone2">
              <el-input v-model="sysUserForm.mobilePhone2" :min="0" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('system.userManage.preLanguage')">
              <el-select v-model="sysUserForm.usedLanguage" clearable @change="setOtherList">
                <el-option v-for="(item, index) in languageList" :label="item.label" :value="item.id" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('system.userManage.otherLanguage')" prop="preferedLanguageStr">
              <el-select v-model="sysUserForm.preferedLanguageStr" multiple @change="getcommLanguage">
                <el-option v-for="(item, index) in languageList1" :label="item.label" :value="item.id" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="$t('system.role.roleName')">
          <el-select v-model="sysUserForm.roles" multiple clearable style="width: 100%">
            <el-option v-for="(item, index) in sysRoleList" :label="item.roleName" :value="item.bid" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="初始化账号密码" v-if="dialogType==='add'" prop="password">-->
        <!--<el-input v-model="sysUserForm.password" clearable placeholder="请输入账号初始化密码"/>-->
        <!--</el-form-item>-->
        <el-form-item :label="$t('system.userManage.company')" prop="companyStr">
          <el-select v-model="sysUserForm.companyStr" multiple clearable style="width: 100%" @change="getDefaultCompany">
            <el-option v-for="(item, index) in supplyCompanyList" :label="item.companyName" :value="item.bid" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('system.userManage.default')" prop="usedCompany">
          <el-select v-model="sysUserForm.usedCompany" clearable style="width: 100%">
            <el-option v-for="(item, index) in defaultCompanyList" :label="item.companyName" :value="item.bid" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('system.userManage.department')" prop="departments">
          <el-select v-model="sysUserForm.departments" multiple clearable style="width: 100%">
            <el-option v-for="(item, index) in departmentList" :label="item.departmentName" :value="item.bid" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('system.userManage.designation')" prop="position">
          <el-input v-model="sysUserForm.position" clearable />
        </el-form-item>
        <!--<el-form-item :label="$t('system.userManage.isLead')">-->
          <!--<el-select v-model="sysUserForm.isLead" multiple clearable style="width: 100%">-->
            <!--<el-option v-for="(item, index) in isLeadList" :label="item.label" :value="item.id" :key="index"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item :label="$t('system.userManage.isLead')" >
          <el-radio-group v-model="sysUserForm.isLead">
            <el-radio :label="1">{{$t('system.role.yes')}}</el-radio>
            <el-radio :label="0">{{$t('system.role.no')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('system.role.status')" prop="accountStatus">
          {{sysUserForm.accountStatus ? $t('system.userManage.inDisable') : $t('system.userManage.inEmploy')}}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="resetPwdMethod">{{$t('system.userManage.reset')}}</el-button>
        <el-button type="primary" size="small" @click="unlockPassword">{{$t('system.userManage.unlock')}}</el-button>
        <el-button type="primary" size="small" :loading="addLoading" @click="addMethod('ruleForm')">{{$t('system.role.seave')}}</el-button>
        <el-button type="danger" size="small" @click="closOPenDialog">{{$t('system.role.return')}}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import {
  selectUserAccountList,
  addSysUser,
  editSysUser,
  // deleteSysUser,
  deleteBatchSysUser,
  enableSysUser,
  getDepartmentList,
  getSupplyCompanyList,
  getSysRoleList,
  selectUserBackdetail,
  resetPwdSyssUser
} from '@/api/system'
import { uploadActionUrl } from '@/api/common'
import { unlockPassword } from '@/api/user'
import treeMenu from '@/mixin/treeMenu'

export default {
  components: {
    Pagination
  },
  mixins: [treeMenu],
  data() {
    return {
      uploadActionUrl,
      listLoading: true,
      addLoading: false,
      detialModel: false,
      dialogVisible: false,
      detailModal: false,
      selectList: [],
      dialogType: '',
      indent: 20,
      sysUserForm: {
        isLead: '',
        accountBId: '',
        userAccount: '',
        accountId: '',
        firstName: '',
        lastName: '',
        userSex: '',
        emailAddress: '',
        contactAddress: '',
        officePhone: '',
        officePhone2: '',
        mobilePhone: '',
        mobilePhone2: '',
        usedLanguage: '',
        preferedLanguageStr: [],
        usedCompanyName: '',
        department: '',
        parDepartment: '',
        company: '',
        roles: [],
        usedCompany: '',
        photoPath: '',
        departments: [],
        position: '',
        approvalType: ''
      },
      departmentList: [],
      supplyCompanyList: [],
      sysRoleList: [],
      detailData: {},
      rowData: {},
      postData: {
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        roleName: '',
        status: ''
      },
      departmentData: {
        departmentCode: '',
        departmentName: '',
        departmentStatus: ''
      },
      areaList: [
        {
          label: this.$t("system.userManage.inEmploy"),
          id: 0
        },
        {
          label: this.$t("system.userManage.inDisable"),
          id: 1
        }
      ],
      isLeadList: [
        {
          label: this.$t("system.role.yes"),
          id: 1
        },
        {
          label: this.$t("system.role.no"),
          id: 0
        }
      ],
      languageList: [
        {
          id: '1',
          label: this.$t("system.role.english")
        },
        {
          id: '2',
          label: this.$t("system.role.simplified")
        },
        {
          id: '3',
          label: this.$t("system.role.traditional")
        }
      ],
      languageList1: [],
      list: [],
      defaultCompanyList: [],
      sysUserDataRules: {
        userAccount: [
          { required: true, message: this.$t('system.userManage.userAccount'), trigger: 'blur' }
        ],
        firstName: [
          { required: true, message: this.$t('system.userManage.lastName'), trigger: 'blur' }
        ],
        lastName: [
          { required: true, message: this.$t('system.userManage.firstName'), trigger: 'blur' }
        ],
        userSex: [
          { required: true, message: this.$t('system.userManage.userGender'), trigger: 'blur' }
        ],
        emailAddress: [
          { required: true, message: this.$t('system.userManage.userEmail'), trigger: 'blur' }
        ],
        contactAddress: [
          { required: true, message: this.$t('system.userManage.userAddress'), trigger: 'blur' }
        ],
        mobilePhone: [
          { required: true, message: this.$t('system.userManage.userPhone'), trigger: 'blur' }
        ],
        preferedLanguage: [
          { required: true, message: this.$t('system.userManage.userLanguage'), trigger: 'blur' }
        ],
        password: [
          { required: true, message: this.$t('system.userManage.userPassword'), trigger: 'blur' }
        ],
        departments: [
          { required: true, message: this.$t('system.userManage.userPart'), trigger: 'blur' }
        ],
        companyStr: [
          { required: true, message: this.$t('system.userManage.userCompany'), trigger: 'blur' }
        ],
        usedCompany: [
          { required: true, message: this.$t('system.userManage.defaultCompany'), trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getDataList();
    this.getDepartmentListMethod(); // 部门列表
    this.getSupplyCompanyListMethod();// 公司列表
    this.getSysRoleListMethod();// 角色列表
  },
  methods: {
    // 搜索
    searchData() {
      this.postData.pageIndex = 1;
      this.getDataList()
    },
    // 获取数据列表
    getDataList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      selectUserAccountList(obj).then(res => {
        this.list = res.data.list || [];
        this.postData.total = res.data.total;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message)
      });
    },
    getParentId(arr) {
      if (arr.length) {
        this.sysUserForm.department = arr[arr.length - 1];
        this.sysUserForm.parDepartment = arr.join(',')
      } else {
        this.sysUserForm.department = '';
        this.sysUserForm.parDepartment = ''
      }
    },
    setOtherList(val) {
      this.languageList1 = this.languageList.filter(e => {
        return e.id !== val
      });
      if (this.sysUserForm.preferedLanguageStr.includes(val)) {
        this.sysUserForm.preferedLanguageStr = this.sysUserForm.preferedLanguageStr.filter(e => e !== val)
      }
    },
    getDefaultCompany(arr) {
      if (arr.length) {
        this.sysUserForm.company = arr.join(',')
      } else {
        this.sysUserForm.company = arr.join(',')
      }
      this.defaultCompanyList = this.supplyCompanyList.filter(e => {
        return arr.includes(e.bid)
      })
    },
    getcommLanguage(arr) {
      if (arr.length) {
        this.sysUserForm.preferedLanguage = arr.join(',')
      } else {
        this.sysUserForm.preferedLanguage = ''
      }
    },
    // 关闭详情模块
    detailDialogClos() {
      this.detialModel = false;
    },
    // 详情模块
    detailDialog(row) {
      selectUserBackdetail({ accountCode: row.accountBId }).then(res => {
        this.sysUserForm = Object.assign(this.sysUserForm, res.data);
        if (this.sysUserForm.preferedLanguage) {
          this.sysUserForm.preferedLanguageStr = this.sysUserForm.preferedLanguage.split(',')
        } else {
          this.sysUserForm.preferedLanguageStr = []
        }
        if (this.sysUserForm.company) {
          this.sysUserForm.companyStr = this.sysUserForm.company.split(',')
          this.defaultCompanyList = this.supplyCompanyList.filter(e => {
            return this.sysUserForm.companyStr.includes(e.bid)
          })
        } else {
          this.sysUserForm.companyStr = []
        }
      }).catch(err => {
        this.$message.error(err.message)
      });
      // 回显上级
      this.detialModel = true;
    },
    // 编辑和新增模块
    openDialog(type, row) {
      this.dialogType = type;
      if (type === 'edit') {
        selectUserBackdetail({ accountCode: row.accountBId }).then(res => {
          this.sysUserForm = Object.assign(this.sysUserForm, res.data);
          if (this.sysUserForm.preferedLanguage) {
            this.sysUserForm.preferedLanguageStr = this.sysUserForm.preferedLanguage.split(',')
          } else {
            this.sysUserForm.preferedLanguageStr = []
          }
          if (this.sysUserForm.company) {
            this.sysUserForm.companyStr = this.sysUserForm.company.split(',')
            this.defaultCompanyList = this.supplyCompanyList.filter(e => {
              return this.sysUserForm.companyStr.includes(e.bid)
            })
          } else {
            this.sysUserForm.companyStr = []
          }
        }).catch(err => {
          this.$message.error(err.message)
        });
        this.languageList1 = this.languageList.filter(e => {
          return e.id !== this.sysUserForm.usedLanguage
        });
      } else {
        this.sysUserForm = {
          preferedLanguageStr: [],
          departments: [],
          roles: [],
          companyStr: []
        };
      }
      this.dialogVisible = true;
    },
    closOPenDialog() {
      this.dialogVisible = false;
    },
    // openDetail(row) {
    //   this.detailData = deepClone(row);
    //   if (this.detailData.parDepartment) {
    //     this.detailData.departments = this.detailData.parDepartment.split(',')
    //   }
    //   this.detailModal = true;
    // },
    // 勾选触发 selects为选择的数据数组
    getSelect(selects) {
      this.selectList = selects;
    },
    // 具体添加方法
    addMethod(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.sysUserForm.accountBId) {
            editSysUser(this.sysUserForm).then(res => {
              this.$message.success(this.$t('system.userManage.updata'));
              this.postData.pageIndex = 1;
              this.dialogVisible = false;
              this.getDataList();
              this.closOPenDialog();
            }).catch(err => {
              this.$message.error(err.message);
            });
          } else {
            addSysUser(this.sysUserForm).then(res => {
              this.$message.success(this.$t('system.userManage.addSuccess'));
              this.postData.pageIndex = 1;
              this.dialogVisible = false;
              this.getDataList();
              this.closOPenDialog()
            }).catch(err => {
              this.$message.error(err.message)
            });
          }
        } else {
          this.$message.error(this.$t('system.userManage.check'))
        }
      });
    },
    deleteBatchMethod() {
      if (!this.selectList.length) {
        return this.$message(this.$t('system.userManage.option'));
      }
      this.$confirm(this.$t('system.userManage.whether'), this.$t('system.userManage.hint'), {
        confirmButtonText: this.$t("system.role.affirm"),
        cancelButtonText: this.$t("system.role.return"),
        type: 'warning'
      }).then(() => {
        this.deleteIdsForm = this.selectList.map(e => {
          return e.accountBId;
        }).join(",");
        let formData = new FormData();
        formData.append('accountBIds', this.deleteIdsForm)
        deleteBatchSysUser(formData).then(res => {
          if (res.status === 200) {
            this.$message.success(this.$t("system.role.handle"));
          }
          this.getDataList();
        }).catch(err => {
          this.$message.error(err.message);
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t("system.userManage.cancel")
        });
      });
    },
    // deleteMethod(row) {
    //   this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     let obj = { accountCode: row.accountCode };
    //     deleteSysUser(obj).then(res => {
    //       this.searchData();
    //       this.$message.success('删除成功');
    //     }).catch(err => {
    //       this.$message.error(err.message)
    //     });
    //   }).catch(() => {
    //   });
    // },
    // 获取部门列表
    getDepartmentListMethod() {
      getDepartmentList().then(res => {
        this.departmentList = res.data;
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    // 获取部门列表
    resetPwdMethod() {
      resetPwdSyssUser({ accountBid: this.sysUserForm.accountBId }).then(res => {
        this.$message.success(this.$t('system.userManage.resetSuccess'))
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    // 解锁密码
    unlockPassword() {
      unlockPassword({ accountBid: this.sysUserForm.accountBId }).then(res => {
        this.$message.success(this.$t('system.userManage.unlocked'))
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    // 获取国家列表
    getSupplyCompanyListMethod() {
      getSupplyCompanyList({}).then(res => {
        this.supplyCompanyList = res.data;
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    // 获取角色列表
    getSysRoleListMethod() {
      getSysRoleList({ type: 0 }).then(res => {
        this.sysRoleList = res.data;
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    // 禁用或启用
    changeMethod(row) {
      let obj = {
        type: row.accountStatus === 1 ? 0 : 1,
        accountBId: row.accountBId
      };
      enableSysUser(obj).then(res => {
        this.searchData();
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    handleAvatarSuccess(res, file) {
      this.sysUserForm.photoPath = res.data.filePath;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
      const isLt3M = file.size / 1024 / 1024 < 3;

      if (!isJPG) {
        this.$message.error(this.$t('system.userManage.loading1'));
      }
      if (!isLt3M) {
        this.$message.error(this.$t('system.userManage.loading2'));
      }
      return isJPG && isLt3M;
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

.roleManagement {
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

  .avatar {
    width: 60%;

    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
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
      width: 150px;
      height: 150px;
      line-height: 150px;
      text-align: center;
      border: 1px solid $border-light-color;
    }

    .avatar {
      width: 150px;
      height: 150px;
      display: block;
    }
  }

  .dialogClass {
    .el-dialog {
      width: 500px;
    }
  }
}
</style>
