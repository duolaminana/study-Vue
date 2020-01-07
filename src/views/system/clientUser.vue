<template>
  <div class="app-container clientUser">
    <div class="search-box">
      <el-form label-width="90px" inline size="small">
        <div>
          <el-form-item :label="$t('system.userManage.account')">
            <el-input v-model="postData.userAccount" clearable style="width: 200px" />
          </el-form-item>
          <el-form-item :label="$t('system.role.name')">
            <el-input v-model="postData.lastName" clearable style="width: 200px" />
          </el-form-item>
          <el-form-item :label="$t('system.userManage.country')">
            <el-input v-model="postData.countryCode" clearable style="width: 200px" />
          </el-form-item>
          <el-form-item :label="$t('system.userManage.company')">
            <el-input v-model="postData.companyName" clearable style="width: 200px" />
          </el-form-item>
        </div>
        <div>
          <el-form-item :label="$t('system.role.status')">
            <el-select v-model="postData.accountStatus" clearable style="width: 200px">
              <el-option v-for="(item, index) in areaList" :label="item.label" :value="item.id" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="export" @click="searchRole">{{$t('system.role.search')}}</el-button>
          </el-form-item>
        </div>

      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="addDialog('add')">{{$t('system.role.add')}}</el-button>
      <el-button type="primary" size="small" @click="deleteBatchMethod()">{{$t('system.role.delete')}}</el-button>
      <el-button type="primary" size="small" class="export">{{$t('system.role.export')}}</el-button>
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
      <el-table-column :label="$t('system.role.name')" show-overflow-tooltip prop="lastName" align="center">
        <template slot-scope="scope">
          {{scope.row.lastName}}{{scope.row.firstName }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.role.roleName')" prop="rolesStr" show-overflow-tooltip align="center">
        <!--<el-select v-model="list.roles" multiple clearable style="width: 100%" >-->
          <!--<el-option v-for="(item, index) in roles" :label="item.roleName" :value="item.bid" :key="index"></el-option>-->
        <!--</el-select>-->
      </el-table-column>
      <el-table-column :label="$t('system.role.contact')" prop="mobilePhone" show-overflow-tooltip align="center"/>
      <el-table-column :label="$t('system.userManage.country')" prop="countryCode" show-overflow-tooltip align="center"/>
      <el-table-column :label="$t('system.userManage.company')" prop="companyName" show-overflow-tooltip align="center"/>
      <el-table-column align="center" width="160" :label="$t('system.userManage.editTime')" prop="registerTime" >
        <template slot-scope="scope">
          {{scope.row.registerTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="100" :label="$t('system.role.status')" prop="accountStatus">
        <template slot-scope="scope">
          <el-tag :type="scope.row.accountStatus === 0 ? 'primary' : 'danger' " size="mini">{{ scope.row.accountStatus === 0 ? $t('system.role.active') : $t('system.role.inactive') }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('system.role.operation')" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" class="export" @click="openDetail(row)">{{$t('system.role.view')}}</el-button>
          <el-button type="warning" size="mini" @click="editDetail(row)">{{$t('system.userManage.editUser')}}</el-button>
          <el-button :type="row.accountStatus === 1 ? 'info' : 'danger'" size="mini" @click="changeStatus(row)">{{row.accountStatus === 1 ? $t('system.role.disable') : $t('system.role.enable')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList" ></Pagination>
    <!-- 详情-->
    <el-dialog :visible.sync="detailModal3" :title="$t('system.userManage.userDetails')" center width="800px">
      <el-form label-width="100px" label-position="right" size="small">
          <div class="divinline">
            <el-form-item :label="$t('system.userManage.account')">
              <el-input v-model="entityForm.userAccount" clearable class="form-dialog-width2" readonly/>
            </el-form-item>
            <el-form-item :label="$t('system.role.givenName')">
              <el-input v-model="entityForm.firstName" clearable class="form-dialog-width2" readonly/>
            </el-form-item>
            <el-form-item :label="$t('system.role.surname')">
              <el-input v-model="entityForm.lastName" clearable class="form-dialog-width2" readonly/>
            </el-form-item>
            <el-form-item :label="$t('system.role.gender')">
              {{entityForm.userSex === 1 ? $t('system.role.man'): $t('system.role.woman')}}
            </el-form-item>
          </div>

        <div class="divinline">
          <el-form-item>
            <el-upload
              class="avatar-uploader"
              :action="uploadActionUrl"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="entityForm.photoPath" :src="entityForm.photoPath" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </div>
        <div></div>
        <el-form-item :label="$t('system.userManage.emailAddress')">
          <el-input v-model="entityForm.emailAddress" clearable readonly/>
        </el-form-item>
        <el-form-item :label="$t('system.userManage.address')">
          <el-input v-model="entityForm.contactAddress" clearable readonly/>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('system.userManage.StraightTelephone')">
              <el-input v-model="entityForm.mobilePhone" clearable readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('system.userManage.extension')">
              <el-input v-model="entityForm.mobilePhone" clearable readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('system.userManage.mobile1')">
              <el-input v-model="entityForm.mobilePhone" clearable readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('system.userManage.mobile2')">
              <el-input v-model="entityForm.mobilePhone" clearable readonly />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('system.userManage.preLanguage')">
              <el-select v-model="entityForm.usedLanguage" clearable disabled @change="setOtherList">
                <el-option v-for="(item, index) in languageList" :label="item.label" :value="item.id" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('system.userManage.otherLanguage')" prop="preferedLanguageStr">
              <el-select v-model="entityForm.preferedLanguageStr" multiple @change="getcommLanguage" disabled>
                <el-option v-for="(item, index) in languageList1" :label="item.label" :value="item.id" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="$t('system.role.roleName')" prop="roles">
          <el-select v-model="entityForm.roles" multiple disabled style="width: 100%">
            <el-option v-for="(item, index) in sysRoleList" :label="item.roleName" :value="item.bid" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('system.userManage.company')" prop="companyName">
          <el-input v-model="entityForm.companyName" clearable readonly/>
        </el-form-item>
        <el-form-item :label="$t('system.userManage.country')" prop="countryCode">
          <el-input v-model="entityForm.countryCode" clearable readonly/>
        </el-form-item>
        <el-form-item :label="$t('system.userManage.designation')" prop="position">
          <el-input v-model="entityForm.position" clearable readonly/>
        </el-form-item>
        <el-form-item :label="$t('system.role.status')" prop="accountStatus">
          {{entityForm.accountStatus === 0 ? $t('system.role.active') : $t('system.role.inactive')}}
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="detailModal3=false">{{$t('system.role.return')}}</el-button>
      </div>
      </el-dialog>
      <!--新增-->
      <el-dialog :visible.sync="openAdd" :title="$t('system.role.addTheCustomer')" center width="800px" @close="clearData">
        <el-form :model="sysUserForm" ref="ruleForm" label-width="120px" label-position="right" size="small" :rules="sysUserDataRules">
          <el-row :gutter="28">
            <el-col :span="16">
              <el-form-item :label="$t('system.userManage.account')" prop="userAccount">
                <el-input v-model="sysUserForm.userAccount" clearable />
              </el-form-item>
              <el-form-item :label="$t('system.role.givenName')" prop="firstName">
                <el-input v-model="sysUserForm.firstName" clearable />
              </el-form-item>
              <el-form-item :label="$t('system.role.surname')" prop="lastName">
                <el-input v-model="sysUserForm.lastName" clearable/>
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
          <el-form-item :label="$t('system.userManage.emailAddress')" prop="emailAddress">
            <el-input v-model="sysUserForm.emailAddress" clearable />
          </el-form-item>
          <el-form-item :label="$t('system.userManage.address')" prop="contactAddress">
            <el-input v-model="sysUserForm.contactAddress" clearable />
          </el-form-item>
          <el-row :gutter="28">
            <el-col :span="12">
              <el-form-item :label="$t('system.userManage.StraightTelephone')" prop="mobilePhone">
                <el-input v-model="sysUserForm.mobilePhone" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('system.userManage.extension')" prop="officePhone2">
                <el-input v-model="sysUserForm.officePhone2" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('system.userManage.mobile1')" prop="officePhone">
                <el-input v-model="sysUserForm.officePhone" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('system.userManage.mobile2')" prop="mobilePhone2">
                <el-input v-model="sysUserForm.mobilePhone2" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('system.userManage.preLanguage')" prop="usedLanguage">
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
          <el-form-item :label="$t('system.role.roleName')" prop="roles">
            <el-select v-model="sysUserForm.roles" multiple clearable style="width: 100%" @change="getRoleBId">
              <el-option v-for="(item, index) in sysRoleList" :label="item.roleName" :value="item.bid" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <!--<el-form-item :label="$t('system.userManage.company')" prop="companyName">-->
            <!--<el-select v-model="sysUserForm.companyName" multiple clearable style="width: 100%" @change="getDefaultCompany">-->
              <!--<el-option v-for="(item, index) in supplyCompanyList" :label="item.companyName" :value="item.bid" :key="index"></el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
          <!--</el-form-item>-->
          <el-form-item :label="$t('system.userManage.company')" prop="companyName">
            <el-input v-model="sysUserForm.companyName" :min="0" clearable />
          </el-form-item>
          <el-form-item :label="$t('system.userManage.country')" prop="countryCode">
            <el-input v-model="sysUserForm.countryCode" :min="0" clearable />
          </el-form-item>
          <el-form-item :label="$t('system.userManage.designation')" prop="position">
            <el-input v-model="sysUserForm.position" clearable />
          </el-form-item>
          <el-form-item :label="$t('system.role.status')" prop="accountStatus">{{$t('system.role.active')}}</el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <!--<el-button type="primary" size="small" @click="resetPwdMethod">重置密码</el-button>-->
          <!--<el-button type="primary" size="small" @click="unlockPassword">解锁密码</el-button>-->
          <el-button type="primary" size="small" :loading="addLoading" @click="addMethod('ruleForm')">{{$t('system.role.seave')}}</el-button>
          <el-button type="danger" size="small" @click="openAdd = false">{{$t('system.role.return')}}</el-button>
        </div>
      </el-dialog>
    <!--编辑-->
    <el-dialog :visible.sync="editUser" :title="$t('system.role.editTheCustomer')" center width="800px">
      <el-form :model="editForm" ref="ruleForm" label-width="120px" label-position="right" size="small" :rules="sysUserDataRules">
        <el-row :gutter="28">
          <el-col :span="16">
            <el-form-item :label="$t('system.userManage.account')" prop="userAccount">
              <el-input v-model="editForm.userAccount" :disabled="dialogType === 'edit'" clearable />
            </el-form-item>
            <el-form-item :label="$t('system.role.givenName')" prop="firstName">
              <el-input v-model="editForm.firstName" clearable />
            </el-form-item>
            <el-form-item :label="$t('system.role.surname')" prop="lastName">
              <el-input v-model="editForm.lastName" clearable />
            </el-form-item>
            <el-form-item :label="$t('system.role.gender')" prop="userSex">
              <el-radio-group v-model="editForm.userSex">
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
                <img v-if="editForm.photoPath" :src="editForm.photoPath" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <!--<div style="font-size: 10px;text-align: center;color: #ff3a3d;padding: 5px 0;">点击头像进行更换</div>-->
            </div>
          </el-col>
        </el-row>
        <el-form-item :label="$t('system.userManage.emailAddress')" prop="emailAddress">
          <el-input v-model="editForm.emailAddress" clearable />
        </el-form-item>
        <el-form-item :label="$t('system.userManage.address')" prop="contactAddress">
          <el-input v-model="editForm.contactAddress" clearable />
        </el-form-item>
        <el-row :gutter="28">
          <el-col :span="12">
            <el-form-item :label="$t('system.userManage.StraightTelephone')" prop="mobilePhone">
              <el-input v-model="editForm.mobilePhone" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('system.userManage.extension')" prop="officePhone2">
              <el-input v-model="editForm.officePhone2" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('system.userManage.mobile1')" prop="officePhone">
              <el-input v-model="editForm.officePhone" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('system.userManage.mobile2')" prop="mobilePhone2">
              <el-input v-model="editForm.mobilePhone2" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('system.userManage.preLanguage')" prop="preferedLanguageStr">
              <el-select v-model="editForm.usedLanguage" clearable @change="setOtherList">
                <el-option v-for="(item, index) in languageList" :label="item.label" :value="item.id" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('system.userManage.otherLanguage')" prop="usedLanguage">
              <el-select v-model="editForm.preferedLanguageStr" multiple @change="getcommLanguage">
                <el-option v-for="(item, index) in languageList1" :label="item.label" :value="item.id" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="$t('system.role.roleName')" prop="roles">
          <el-select v-model="editForm.roles" multiple clearable style="width: 100%" @change="getRoleBId">
            <el-option v-for="(item, index) in sysRoleList" :label="item.roleName" :value="item.bid" :key="index"></el-option>
          </el-select>
        </el-form-item>
          <el-form-item :label="$t('system.userManage.company')" prop="companyName">
            <el-input v-model="editForm.companyName" :min="0" clearable />
          </el-form-item>
        <!--<el-form-item :label="$t('system.userManage.company')" prop="companyName">-->
          <!--<el-select v-model="editForm.companyName" multiple clearable style="width: 100%" @change="getDefaultCompany">-->
            <!--<el-option v-for="(item, index) in supplyCompanyList" :label="item.companyName" :value="item.bid" :key="index"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item :label="$t('system.userManage.country')" prop="countryCode">
          <el-input v-model="editForm.countryCode" :min="0" clearable />
        </el-form-item>
        <el-form-item :label="$t('system.userManage.designation')" prop="position">
          <el-input v-model="editForm.position" clearable />
        </el-form-item>
        <el-form-item :label="$t('system.role.status')" prop="accountStatus">
          {{editForm.accountStatus ? $t('system.role.active') : $t('system.role.inactive')}}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!--<el-button type="primary" size="small" @click="resetPwdMethod">重置密码</el-button>-->
        <!--<el-button type="primary" size="small" @click="unlockPassword">解锁密码</el-button>-->
        <el-button type="primary" size="small" :loading="addLoading" @click="editMethod('ruleForm')">{{$t('system.role.seave')}}</el-button>
        <el-button type="danger" size="small" @click="editUser = false">{{$t('system.role.return')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import {
  selectUserFrontAccountList,
  enableUserFront,
  addUser,
  editUser,
  getSysRoleList,
  // selectUserAccountList,
  // deleteSysUser,
  // deleteBatchSysUser,
  // editSysUser,
  // resetPwdSyssUser,
  // getDepartmentList,
  // getSupplyCompanyList,
  deleteUser,
  selectUserFrontDetail
  // selectUserList
} from '@/api/system'
import treeMenu from '@/mixin/treeMenu'
import { parseTime } from '@/utils/index'
import { uploadActionUrl } from '@/api/common'
export default {
  components: {
    Pagination
  },
  mixins: [treeMenu],
  data() {
    return {
      supplyCompanyList: [],
      // departmentList: [],
      sysRoleList: [],
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
        ]
        // companyName: [
        //   { required: true, message: this.$t('system.userManage.userCompany'), trigger: 'blur' }
        // ],
        // usedCompany: [
        //   { required: true, message: this.$t('system.userManage.defaultCompany'), trigger: 'blur' }
        // ]
      },
      dialogType: '',
      uploadActionUrl,
      addLoading: false,
      editForm: {
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
        companyName: '',
        department: '',
        parDepartment: '',
        company: '',
        // roles: [],
        roleArr: '',
        roles: [],
        usedCompany: '',
        photoPath: '',
        departments: [],
        position: '',
        approvalType: '',
        countryCode: '',
        preferedLanguage: ''
      },
      sysUserForm: {
        countryCode: '',
        preferedLanguage: '',
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
        companyName: '',
        department: '',
        parDepartment: '',
        company: '',
        // roles: [],
        roles: [],
        roleArr: "",
        usedCompany: '',
        photoPath: '',
        departments: [],
        position: '',
        approvalType: ''
      },
      openAdd: false,
      imageUrl: '',
      listLoading: true,
      detailModal3: false,
      entityForm: {
      },
      detailData: {},
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        custAccount: '',
        firstName: '',
        lastName: '',
        countryCode: '',
        companyName: '',
        accountStatus: ''
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
      list: [],
      languageList1: [],
      selectList: [],
      defaultCompanyList: [],
      editUser: false
      // editForm: ''
    }
  },
  created() {
    this.getDataList();
    this.getSysRoleListMethod();// 角色列表
  },
  methods: {
    clearData() {
      this.$refs['ruleForm'].resetFields()
    },
    // 上传图片
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
    },
    // 编辑
    editMethod(formName) {
      this.$refs[formName].validate(() => {
        if (this.editForm.accountBId) {
          editUser(this.editForm).then(res => {
            this.$message.success(this.$t('system.userManage.updata'));
            this.postData.pageNum = 1;
            this.editUser = false;
            this.getDataList();
            this.closOPenDialog();
          }).catch(err => {
            this.$message.error(err.message);
          });
          this.languageList1 = this.languageList.filter(e => {
            return e.id !== this.sysUserForm.usedLanguage
          });
        }
      })
    },
    getRoleBId(arr) {
      if (arr.length) {
        this.sysUserForm.roleArr = arr.join(',')
      } else {
        this.sysUserForm.roleArr = ''
      }
    },
    getDefaultCompany(arr) {
      if (arr.length) {
        console.log(arr)
        this.sysUserForm.company = arr.join(',')
      } else {
        this.sysUserForm.company = ''
      }
      this.defaultCompanyList = this.supplyCompanyList.filter(e => {
        return arr.includes(e.bid)
      })
    },
    getSelect(selects) {
      this.selectList = selects;
    },
    // 删除
    getcommLanguage(arr) {
      if (arr.length) {
        this.sysUserForm.preferedLanguage = arr.join(',')
      } else {
        this.sysUserForm.preferedLanguage = ''
      }
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
        deleteUser(formData).then(res => {
          if (res.status === 200) {
            this.$message.success(this.$t("system.userManage.handle"));
          }
          this.getDataList();
        }).catch(err => {
          this.$message.error(err.message);
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t("system.userManage.cancel")
        })
      })
    },
    setOtherList(val) {
      this.languageList1 = this.languageList.filter(e => {
        return e.id !== val
      });
      if (this.sysUserForm.preferedLanguageStr.includes(val)) {
        this.sysUserForm.preferedLanguageStr = this.sysUserForm.preferedLanguageStr.filter(e => e !== val)
      }
    },
    // 角色列表
    getSysRoleListMethod() {
      getSysRoleList({ type: 1 }).then(res => {
        this.sysRoleList = res.data;
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    // 编辑模块
    editDetail(row) {
      this.editUser = true;
      selectUserFrontDetail({ accountBid: row.accountBId }).then(res => {
        this.editForm = Object.assign(this.editForm, res.data);
        if (this.editForm.preferedLanguage) {
          this.editForm.preferedLanguageStr = this.editForm.preferedLanguage.split(',')
        } else {
          this.editForm.preferedLanguageStr = []
        }
        if (this.editForm.roles) {
          this.editForm.roles = this.editForm.roles
        } else {
          this.editForm.roles = []
        }
      }).catch(err => {
        this.$message.error(err.message)
      });
      this.languageList1 = this.languageList.filter(e => {
        return e.id !== this.editForm.usedLanguage
      });
    },
    addMethod(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.sysUserForm.accountBId) {
            editUser(this.sysUserForm).then(res => {
              this.$message.success(this.$t('system.userManage.updata'));
              this.postData.pageNum = 1;
              this.dialogVisible = false;
              this.getDataList();
              this.closOPenDialog();
            }).catch(err => {
              this.$message.error(err.message);
            });
          } else {
            addUser(this.sysUserForm).then(res => {
              this.$message.success(this.$t('system.userManage.addSuccess'));
              this.postData.pageNum = 1;
              this.openAdd = false;
              this.getDataList();
              this.closOPenDialog()
            }).catch(err => {
              console.log(err)
              this.$message.error(err.message)
            });
          }
        } else {
          this.$message.error(this.$t('system.userManage.check'))
        }
      });
    },
    closOPenDialog() {
      this.dialogVisible = false;
    },
    addDialog() {
      this.openAdd = true
    },
    changeStatus(row) {
      let obj = {
        type: row.accountStatus === 1 ? 0 : 1,
        accountBid: row.accountBId
      };
      enableUserFront(obj).then(res => {
        this.getDataList();
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    searchRole() {
      this.postData.pageNum = 1;
      this.getDataList()
    },
    // 获取列表
    getDataList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      selectUserFrontAccountList(obj).then(res => {
        this.list = res.data.list || [];
        this.postData.total = res.data.total;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message)
      });
    },
    // 详情模块
    openDetail(row) {
      selectUserFrontDetail({ accountBid: row.accountBId }).then(res => {
        this.entityForm = Object.assign(this.entityForm, res.data);
        if (this.entityForm.preferedLanguage) {
          this.entityForm.preferedLanguageStr = this.entityForm.preferedLanguage.split(',')
        } else {
          this.entityForm.preferedLanguageStr = []
        }
      }).catch(err => {
        this.$message.error(err.message)
      });
      // 回显上级
      this.detailModal3 = true;
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
  .clientUser {
    .divleft{
      text-align: right;
    }
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
    .form-dialog-width2{
      width: 300px !important;
    }
    .form-dialog-width{
      width: 540px !important;
    }
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
    .divinline{
      width: 350px !important;
      float: left;
    }
  }
</style>
