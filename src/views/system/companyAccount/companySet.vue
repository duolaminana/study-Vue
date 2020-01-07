<template>
  <div class="app-container companySet">
      <div class="topBtns">
        <el-button type="primary" size="small" @click="openDialog('add')">{{$t('common.add')}}</el-button>
        <el-button type="primary" size="small" @click="disableClick()">{{$t('common.delete')}}</el-button>
      </div>
      <el-table
        :data="datalist"
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

        <el-table-column :label="$t('system.business.companyName')" prop="companyName" show-overflow-tooltip/>

        <el-table-column :label="$t('system.business.companyShort')" prop="companyShort" show-overflow-tooltip/>

        <el-table-column :label="$t('system.business.countryName')" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.chName}} {{scope.row.enName}}
          </template>
        </el-table-column>

        <el-table-column align="center" width="100" :label="$t('common.table.status')" prop="companyStatus">
          <template slot-scope="scope">
            <el-tag :type="scope.row.companyStatus === 1 ? 'primary' : 'danger' " size="mini">
              {{ scope.row.companyStatus === 1 ? $t('common.table.inUse') : $t('common.table.disabled') }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column align="center" :label="$t('common.table.actions')" width="300" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" class="export table-btn-width" @click="openDetail(row)">{{$t('common.table.view')}}</el-button>
            <el-button type="primary" size="mini" class="table-btn-width" @click="openDialog('edit', row)">{{$t('common.table.edit')}}</el-button>
            <el-button v-if="row.isDefault === 0" class="table-btn-width" type="info" size="mini" @click="updateIsDefaul(row.id)">{{$t('common.buttonText.defaultSetting')}}</el-button>
            <el-button v-if="row.isDefault === 1" class="table-btn-width" type="danger" size="mini" @click="updateIsDefaul(row.id)">{{$t('common.buttonText.defaultAccount')}}</el-button>
          </template>
        </el-table-column>
      </el-table>

      <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList" ></Pagination>

      <el-dialog :visible.sync="dialogVisible" :title="dialogType==='add'?$t('system.business.addCompany'):$t('system.business.editCompany')" center width="1000px" @closed="clearData">
        <!--基础信息-->
        <el-tabs v-model="activeName" :before-leave="changeTabs">
          <el-tab-pane :label="$t('system.business.basicInformation')" name="1">
            <el-form ref="addCompany" :model="menuData" label-width="155px" label-position="right" inline size="small" :rules="menuDataRules">
              <el-form-item :label="$t('system.business.companyName')" prop="companyName">
                <el-input v-model="menuData.companyName" clearable :placeholder="$t('system.business.companyName')" style="width: 733px" />
              </el-form-item>
              <el-form-item :label="$t('system.business.companyShort')" prop="companyShort">
                <el-input v-model="menuData.companyShort" clearable :placeholder="$t('system.business.companyShort')" style="width: 283px"/>
              </el-form-item>
              <el-form-item :label="$t('system.business.companyCode')" prop="companyCode">
                <el-input v-model="menuData.companyCode" clearable :placeholder="$t('system.business.companyCode')" style="width: 283px"/>
              </el-form-item>
              <el-form-item :label="$t('system.business.countryCode')" prop="countryCode">
                <el-select filterable remote :remote-method="selectCountryListFun" :loading="loading1" v-model="menuData.countryCode" clearable :placeholder="$t('system.business.searchCountryCode')" style="width: 283px">
                  <el-option v-for="(item, index) in countryList" :label="item.chEnName" :value="item.countryCode" :key="index">
                    {{item.searchStr}}
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('system.business.provinceCode')" prop="provinceCode">
                <el-input v-model="menuData.provinceCode" clearable :placeholder="$t('system.business.provinceCode')" style="width: 283px" />
              </el-form-item>
              <el-form-item :label="$t('system.business.postalCode')" prop="postalCode">
                <el-input v-model="menuData.postalCode" clearable :placeholder="$t('system.business.postalCode')" style="width: 283px" />
              </el-form-item>
              <el-form-item :label="$t('system.business.taxNo')" prop="taxNo">
                <el-input v-model="menuData.taxNo" clearable :placeholder="$t('system.business.taxNo')" style="width: 283px"/>
              </el-form-item>
              <el-form-item :label="$t('system.business.officeAddress')" prop="officeAddress">
                <el-input v-model="menuData.officeAddress" clearable :placeholder="$t('system.business.officeAddress')" style="width: 733px" />
              </el-form-item>
              <el-form-item :label="$t('system.business.registerAddress')" prop="registerAddress">
                <el-input v-model="menuData.registerAddress" clearable :placeholder="$t('system.business.registerAddress')" style="width: 733px" />
              </el-form-item>
              <el-form-item :label="$t('system.business.officePhone')" prop="officePhone">
                <el-input v-model="menuData.officePhone" clearable :placeholder="$t('system.business.officePhone')" style="width: 283px" />
              </el-form-item>
              <el-form-item :label="$t('system.business.chargeBy')" prop="chargeBy">
                <el-input v-model="menuData.chargeBy" clearable :placeholder="$t('system.business.chargeBy')" style="width: 283px" />
              </el-form-item>
              <el-form-item :label="$t('system.business.chargePhone')" prop="chargePhone">
                <el-input v-model="menuData.chargePhone" clearable :placeholder="$t('system.business.chargePhone')" style="width: 283px" />
              </el-form-item>
              <el-form-item :label="$t('system.business.facsimileNo')" prop="facsimileNo">
                <el-input v-model="menuData.facsimileNo" clearable :placeholder="$t('system.business.facsimileNo')" style="width: 283px" />
              </el-form-item>
              <el-form-item :label="$t('system.business.emailAddress')" prop="emailAddress">
                <el-input v-model="menuData.emailAddress" clearable :placeholder="$t('system.business.emailAddress')" style="width: 283px" />
              </el-form-item>
              <el-form-item :label="$t('system.business.companyStatus')" prop="companyStatus">
                <el-select v-model="menuData.companyStatus" clearable :placeholder="$t('system.business.companyStatus')" style="width: 283px">
                  <el-option v-for="(item, index) in companyStatusList" :label="language === 'zh' ? item.labelZh : item.label" :value="item.status" :key="index"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div style="text-align: center;margin-top: 20px">
              <el-button type="primary" size="small" @click="confirmAdd('addCompany', dialogType === 'add' ? 1 : 2)">{{$t('common.buttonText.confirm')}}</el-button>
              <el-button type="danger" size="small" @click="dialogVisible=false">{{$t('common.buttonText.cancel')}}</el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('system.business.bankInformation')" name="2">
            <div style="text-align: right;margin: 10px 0">
              <el-button type="primary" size="small" @click="openBankDialog('add')">{{$t('common.add')}}</el-button>
              <el-button type="primary" size="small" @click="removeBankAccount()">{{$t('common.delete')}}</el-button>
            </div>
            <el-table
              :data="sbalist"
              border
              fit
              size="mini"
              :header-cell-style="{background: '#a7bfee'}"
              @selection-change="getBankSelect">
              <el-table-column
                align="center"
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column :label="$t('system.business.bankName')" prop="bankName" show-overflow-tooltip/>
              <el-table-column :label="$t('system.business.branchName')" prop="branchName" show-overflow-tooltip/>
              <el-table-column :label="$t('system.business.bankAccount')" prop="bankAccount" show-overflow-tooltip/>
              <el-table-column :label="$t('system.business.accountCurrency')" prop="accountCurrency" show-overflow-tooltip/>
              <el-table-column :label="$t('system.business.swiftCode')" prop="swiftCode" show-overflow-tooltip/>
              <el-table-column align="center" width="180" :label="$t('common.table.actions')" class-name="small-padding fixed-width">
                  <template slot-scope="{row}">
                    <el-button type="primary" size="mini" class="table-btn-width" @click="openBankDialog('edit', row)">{{$t('common.table.edit')}}</el-button>
                    <el-button v-if="row.defaultValue === 1" type="danger" class="table-btn-width" size="mini" @click="updateBankDefault(row.id)">{{$t('common.buttonText.defaultAccount')}}</el-button>
                    <el-button v-if="row.defaultValue === 2" type="info" class="table-btn-width" size="mini" @click="updateBankDefault(row.id)">{{$t('common.buttonText.defaultSetting')}}</el-button>
                  </template>
              </el-table-column>
            </el-table>
            <Pagination :total="sbaListData.total" :page.sync="sbaListData.pageNum" :limit.sync="sbaListData.pageSize" @pagination="getCompanyBankList" ></Pagination>

            <el-dialog
              width="600px"
              center
              :title="dialogBankType==='add'?$t('system.business.addBank'):$t('system.business.editBank')"
              :close-on-click-modal="false"
              @closed="clearBankData"
              :visible.sync="addBankVisible"
              append-to-body>
              <el-form ref="bankForm" :model="bankForm" label-width="135px" label-position="right" size="small" :rules="bankFormRules">
                <el-form-item :label="$t('system.business.bankName')" prop="bankName">
                  <el-input type="tel" v-model.number="bankForm.bankName" clearable :placeholder="$t('system.business.bankName')" class="form-dialog-width" />
                </el-form-item>
                <el-form-item :label="$t('system.business.branchName')" prop="branchName">
                  <el-input v-model="bankForm.branchName" clearable :placeholder="$t('system.business.branchName')" class="form-dialog-width" />
                </el-form-item>
                <el-form-item :label="$t('system.business.bankAddress')" prop="bankAddress">
                  <el-input v-model="bankForm.bankAddress" clearable :placeholder="$t('system.business.bankAddress')" class="form-dialog-width" />
                </el-form-item>
                <el-form-item :label="$t('system.business.bankAccount')" prop="bankAccount">
                  <el-input v-model="bankForm.bankAccount" clearable :placeholder="$t('system.business.bankAccount')" class="form-dialog-width" />
                </el-form-item>
                <el-form-item :label="$t('system.business.reservedPhone')" prop="reservedPhone">
                  <el-input v-model.number="bankForm.reservedPhone" type="number" :min="0" clearable :placeholder="$t('system.business.reservedPhone')" class="form-dialog-width" />
                </el-form-item>
                <el-form-item :label="$t('system.business.accountCurrency')" prop="accountCurrency">
                  <el-select filterable remote :remote-method="getCurrencyCodeList" :loading="loading2" v-model="bankForm.accountCurrency" clearable :placeholder="$t('system.business.searchCurrencyCode')" style="width: 300px">
                    <el-option v-for="(item, index) in currencyCodeList" :label="item.currencyCode" :value="item.currencyCode" :key="index">
                      {{item.searchCurrencyCodeStr}}
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('system.business.swiftCode')" prop="swiftCode">
                  <el-input type="tel" v-model.number="bankForm.swiftCode" clearable :placeholder="$t('system.business.swiftCode')" class="form-dialog-width" />
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" @click="addBankAccount('bankForm',dialogBankType === 'add' ? 1 : 2)">{{$t('common.buttonText.confirm')}}</el-button>
                <el-button type="danger" size="small" @click="addBankVisible=false">{{$t('common.buttonText.cancel')}}</el-button>
              </div>
            </el-dialog>
            <div style="text-align: center;margin-top: 20px">
              <el-button type="danger" size="small" @click="dialogVisible=false">{{$t('common.buttonText.cancel')}}</el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-dialog>

      <el-dialog :visible.sync="detailModal" :title="$t('system.business.viewCompany')" center width="1000px" @closed="clearData">
        <!--基础信息-->
        <el-tabs v-model="activeName" :before-leave="changeTabs">
          <el-tab-pane :label="$t('system.business.basicInformation')" name="1">
            <el-form ref="addCompany" :model="menuData" label-width="155px" label-position="right" size="small" inline :rules="menuDataRules">
              <el-form-item :label="$t('system.business.companyName')" prop="companyName">
                <el-input v-model="menuData.companyName" clearable readonly style="width: 733px" />
              </el-form-item>
              <el-form-item :label="$t('system.business.companyShort')" prop="companyShort">
                <el-input v-model="menuData.companyShort" clearable style="width: 283px" readonly />
              </el-form-item>
              <el-form-item :label="$t('system.business.companyCode')" prop="companyCode">
                <el-input v-model="menuData.companyCode" clearable style="width: 283px" readonly />
              </el-form-item>
              <el-form-item :label="$t('system.business.countryCode')" prop="countryCode">
                <el-select filterable remote :remote-method="selectCountryListFun" :loading="loading1" v-model="menuData.countryCode" clearable style="width: 283px">
                  <el-option v-for="(item, index) in countryList" disabled :label="item.chEnName" :value="item.countryCode" :key="index">
                    {{item.searchStr}}
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('system.business.provinceCode')" prop="provinceCode">
                <el-input v-model="menuData.provinceCode" clearable style="width: 283px" readonly />
              </el-form-item>
              <el-form-item :label="$t('system.business.postalCode')" prop="postalCode">
                <el-input v-model="menuData.postalCode" clearable style="width: 283px" readonly />
              </el-form-item>
              <el-form-item :label="$t('system.business.taxNo')" prop="taxNo">
                <el-input v-model="menuData.taxNo" clearable style="width: 283px" readonly/>
              </el-form-item>
              <el-form-item :label="$t('system.business.officeAddress')" prop="officeAddress">
                <el-input v-model="menuData.officeAddress" clearable style="width: 733px" readonly />
              </el-form-item>
              <el-form-item :label="$t('system.business.registerAddress')" prop="registerAddress">
                <el-input v-model="menuData.registerAddress" clearable style="width: 733px" readonly />
              </el-form-item>
              <el-form-item :label="$t('system.business.officePhone')" prop="officePhone">
                <el-input v-model="menuData.officePhone" clearable style="width: 283px" readonly />
              </el-form-item>
              <el-form-item :label="$t('system.business.chargeBy')" prop="chargeBy">
                <el-input v-model="menuData.chargeBy" clearable style="width: 283px" readonly />
              </el-form-item>
              <el-form-item :label="$t('system.business.chargePhone')" prop="chargePhone">
                <el-input v-model="menuData.chargePhone" type="number" :min="0" clearable style="width: 283px" readonly />
              </el-form-item>
              <el-form-item :label="$t('system.business.facsimileNo')" prop="facsimileNo">
                <el-input v-model="menuData.facsimileNo" clearable style="width: 283px" readonly />
              </el-form-item>
              <el-form-item :label="$t('system.business.emailAddress')" prop="emailAddress">
                <el-input v-model="menuData.emailAddress" clearable style="width: 283px" readonly />
              </el-form-item>
              <el-form-item :label="$t('system.business.companyStatus')" prop="companyStatus">
                <el-select v-model="menuData.companyStatus" clearable style="width: 283px">
                  <el-option v-for="(item, index) in companyStatusList" disabled :label="language === 'zh' ? item.labelZh : item.label" :value="item.status" :key="index"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane :label="$t('system.business.bankInformation')" name="2">
            <el-table
              :data="sbalist"
              border
              fit
              size="mini"
              :header-cell-style="{background: '#a7bfee'}"
              @selection-change="getBankSelect">
              <el-table-column
                align="center"
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column :label="$t('system.business.bankName')" prop="bankName" show-overflow-tooltip/>
              <el-table-column :label="$t('system.business.branchName')" prop="branchName" show-overflow-tooltip/>
              <el-table-column :label="$t('system.business.bankAccount')" prop="bankAccount" show-overflow-tooltip/>
              <el-table-column :label="$t('system.business.accountCurrency')" prop="accountCurrency" show-overflow-tooltip/>
              <el-table-column :label="$t('system.business.swiftCode')" prop="swiftCode" show-overflow-tooltip/>

              <el-table-column align="center" width="80" :label="$t('common.table.actions')" class-name="small-padding fixed-width">
                <template slot-scope="{row}">
                  <el-button type="primary" size="mini" class="export" @click="openBankDetail(row)">{{$t('common.table.view')}}</el-button>
                </template>
              </el-table-column>
            </el-table>
            <Pagination :total="sbaListData.total" :page.sync="sbaListData.pageNum" :limit.sync="sbaListData.pageSize" @pagination="getCompanyBankList" ></Pagination>

            <el-dialog
              width="600px"
              center
              :title="$t('system.business.viewBank')"
              :close-on-click-modal="false"
              @closed="clearBankData"
              :visible.sync="detailBankModal"
              append-to-body>
              <el-form ref="bankForm" :model="bankForm" label-width="110px" label-position="right" size="small" :rules="bankFormRules">
                <el-form-item :label="$t('system.business.bankName')" prop="bankName">
                  <el-input type="tel" v-model.number="bankForm.bankName" clearable class="form-dialog-width" readonly />
                </el-form-item>
                <el-form-item :label="$t('system.business.branchName')" prop="branchName">
                  <el-input v-model="bankForm.branchName" clearable class="form-dialog-width" readonly />
                </el-form-item>
                <el-form-item :label="$t('system.business.bankAddress')" prop="bankAddress">
                  <el-input v-model="bankForm.bankAddress" clearable class="form-dialog-width" readonly />
                </el-form-item>
                <el-form-item :label="$t('system.business.bankAccount')" prop="bankAccount">
                  <el-input v-model="bankForm.bankAccount" clearable class="form-dialog-width" readonly />
                </el-form-item>
                <el-form-item :label="$t('system.business.reservedPhone')" prop="reservedPhone">
                  <el-input v-model.number="bankForm.reservedPhone" type="number" :min="0" clearable class="form-dialog-width" readonly />
                </el-form-item>
                <el-form-item :label="$t('system.business.accountCurrency')" prop="accountCurrency">
                  <el-select filterable remote :remote-method="getCurrencyCodeList" :loading="loading2" v-model="bankForm.accountCurrency" clearable style="width: 300px">
                    <el-option v-for="(item, index) in currencyCodeList" disabled :label="item.currencyCode" :value="item.currencyCode" :key="index">
                      {{item.searchCurrencyCodeStr}}
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('system.business.swiftCode')" prop="swiftCode">
                  <el-input type="tel" v-model.number="bankForm.swiftCode" clearable class="form-dialog-width" readonly />
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button type="danger" size="small" @click="detailBankModal=false">{{$t('common.buttonText.close')}}</el-button>
              </div>
            </el-dialog>
          </el-tab-pane>
        </el-tabs>
        <div slot="footer" style="text-align: center;margin-top: 20px">
          <el-button type="danger" size="small" @click="detailModal=false">{{$t('common.buttonText.close')}}</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>

import Pagination from '@/components/Pagination'
import {
  selectCompanyListApi,
  saveCompanyAccountApi,
  updateCompanyAccountApi,
  updateCompanyIsDefaultApi,
  delectByCompanyIdApi,
  selectCountryListApi,
  selectCurrencyCodeListApi,
  saveCompanyBankAccountApi,
  updateCompanyBankAccountApi,
  deleteCompanyBankAccountApi,
  selectCompanyBankAccountListApi,
  updateCompanyBankAccountIsDefaultApi } from '@/api/system';
import { deepClone } from '@/utils/index'
export default {
  components: {
    Pagination
  },
  data() {
    return {
      setType: '0',
      activeName: '1',
      datalist: [],
      currencyCodeList: [],
      list: null,
      listLoading: true,
      dialogVisible: false,
      detailModal: false,
      detailBankModal: false,
      loading1: false,
      loading2: false,
      addBankVisible: false,
      // 银行列表
      sbalist: [],
      dialogType: '',
      dialogBankType: '',
      indent: 20,
      expandArr: [1036013, 1036014],
      menuData: {
        companyName: '',
        companyShort: '',
        companyCode: '',
        countryCode: '',
        provinceCode: '',
        officeAddress: '',
        officePhone: '',
        chargeBy: '',
        chargePhone: '',
        companyStatus: '',
        taxNo: '',
        companyAddress: '',
        bankName: '',
        bankAccount: '',
        swiftCode: '',
        postalCode: '',
        registerAddress: '',
        facsimileNo: '',
        emailAddress: ''
      },
      bankForm: {
        bankAccount: '',
        bankName: '',
        reservedPhone: '',
        swiftCode: '',
        branchName: '',
        bankAddress: '',
        accountCurrency: '',
        companyInfoBId: '',
        defaultValue: 2
        // accountType: 1
      },
      bankFormRules: {
        bankAccount: [
          { required: true, message: 'The bank account needs to fill in', trigger: 'blur' }
          // {
          //   patten: /^-?\d*\.?\d+$/,
          //   message: '请输入正确的银行卡号'
          // }
        ],
        bankName: [
          { required: true, message: 'The head office of the bank needs to fill in', trigger: 'blur' }
        ],
        branchName: [
          { required: true, message: 'Bank branches need to be filled in', trigger: 'blur' }
        ],
        bankAddress: [
          { required: true, message: 'The bank address needs to be filled in', trigger: 'blur' }
        ],
        reservedPhone: [
          { required: true, message: 'Phone number needs to be filled in', trigger: 'blur' }
        ],
        swiftCode: [
          { required: true, message: 'SwiftCode needs to be filled in', trigger: 'blur' }
        ],
        defaultValue: [
          { required: true, message: 'Select whether it is the default', trigger: 'blur' }
        ],
        accountCurrency: [
          { required: true, message: 'Please select the currency', trigger: 'blur' }
        ]
      },
      menuDataRules: {
        companyName: [
          { required: true, message: 'The company name must be filled in', trigger: 'blur' }
        ],
        companyStatus: [
          { required: true, message: 'Please select use status', trigger: 'blur' }
        ]
      },
      selectList: [],
      selectBankList: [],
      reviewForm: {
        companyIds: '',
        companyBankAccountIds: ''
      },
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        isDefault: '',
        setType: 0
      },
      sbaListData: {
        pageNum: 1,
        pageSize: 5,
        total: 0,
        companyInfoBId: ''
      },
      countryList: '',
      companyStatusList: [
        {
          labelZh: '已禁用',
          label: 'Disabled',
          status: 0
        },
        {
          labelZh: '使用中',
          label: 'Active',
          status: 1
        }
      ]
    }
  },
  created() {
    this.getDataList();
    this.selectCountryListFun();
  },
  methods: {
    // 点击切换tabs
    changeTabs(name) {
      if (name !== '1' && !this.menuData.bid) {
        this.$message.warning('Need to fill out the basic information, to fill in other information!');
        return false
      }
      switch (Number(name)) {
        case 2: this.getCompanyBankList(); break;
        default: break;
      }
    },
    // 查询获取币种
    getCurrencyCodeList(query) {
      if (query !== '') {
        this.loading2 = true;
        setTimeout(() => {
          this.loading2 = false;
          selectCurrencyCodeListApi(query).then(res => {
            this.currencyCodeList = res.data || []
          })
        }, 200);
      } else {
        this.currencyCodeList = [];
      }
    },
    // 获取银行卡列表
    getCompanyBankList() {
      this.sbaListData.companyInfoBId = this.menuData.bid;
      selectCompanyBankAccountListApi(this.sbaListData).then(res => {
        this.sbalist = res.data.list;
        this.sbaListData.total = res.data.total;
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 新增银行账号
    addBankAccount(formName, type) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (type === 1) {
            this.bankForm.companyInfoBId = this.menuData.bid;
            saveCompanyBankAccountApi(this.bankForm).then(res => {
              this.$refs[formName].resetFields();
              this.getCompanyBankList();
              this.addBankVisible = false;
              this.$message.success(res.message)
            }).catch(err => {
              this.$message.error(err.message)
            });
          } else {
            this.bankForm.companyInfoBId = this.menuData.bid;
            updateCompanyBankAccountApi(this.bankForm).then(res => {
              this.$refs[formName].resetFields();
              this.getCompanyBankList();
              this.addBankVisible = false;
              this.$message.success('Update Success')
            }).catch(err => {
              this.$message.error(err.message)
            });
          }
        } else {
          return this.$message.warning('Verification failed!');
        }
      });
    },
    // 批量删除主体企业中银行账户接口
    removeBankAccount() {
      if (!this.selectBankList.length) {
        return this.$message('Please select the data you want to delete');
      }
      this.$confirm('This action will delete the menu and continue??', 'Tips', {
        confirmButtonText: this.$t('common.buttonText.confirm'),
        cancelButtonText: this.$t('common.buttonText.cancel'),
        type: 'warning',
        center: true
      }).then(() => {
        this.reviewForm.companyBankAccountIds = this.selectBankList.map(e => {
          return e.id;
        }).join(',');
        deleteCompanyBankAccountApi(this.reviewForm).then(res => {
          if (res.status === 200) {
            this.$message.success('Delete Success!');
          }
          this.getCompanyBankList();
        }).catch(err => {
          this.$message.error(err.message);
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Operation cancelled'
        });
      });
    },
    clearData() {
      this.menuData.bid = '';
      this.menuData.companyName = '';
      this.menuData.companyShort = '';
      this.menuData.companyCode = '';
      this.menuData.countryCode = '';
      this.menuData.provinceCode = '';
      this.menuData.officeAddress = '';
      this.menuData.officePhone = '';
      this.menuData.chargeBy = '';
      this.menuData.chargePhone = '';
      this.menuData.companyStatus = '';
      this.menuData.taxNo = '';
      this.menuData.bankName = '';
      this.menuData.bankAccount = '';
      this.menuData.reservedPhone = '';
      this.menuData.swiftCode = '';
      this.menuData.companyAddress = '';
      this.menuData.postalCode = '';
      this.menuData.registerAddress = '';
      this.menuData.facsimileNo = '';
      this.menuData.emailAddress = '';
    },
    clearBankData() {
      this.bankForm.bankAccount = '';
      this.bankForm.bankName = '';
      this.bankForm.reservedPhone = '';
      this.bankForm.swiftCode = '';
      this.bankForm.branchName = '';
      this.bankForm.bankAddress = '';
      this.bankForm.accountCurrency = '';
      // this.bankForm.accountType = 1;
    },
    getDataList() {
      selectCompanyListApi(this.postData).then(res => {
        this.datalist = res.data.list;
        this.postData.total = res.data.total;
      }).catch(err => {
        this.$message({ message: err.message });
      });
      this.listLoading = false;
    },
    openDetail(row) {
      this.menuData = deepClone(row);
      this.activeName = '1';
      this.detailModal = true;
    },
    openBankDetail(row) {
      this.bankForm = deepClone(row);
      this.activeName = '2';
      this.detailBankModal = true;
    },
    deleteRole(row) {
      this.$confirm('This action will delete the menu and continue??', 'Tips', {
        confirmButtonText: this.$t('common.buttonText.confirm'),
        cancelButtonText: this.$t('common.buttonText.cancel'),
        type: 'warning',
        center: true
      }).then(() => {
        let obj = { companyIds: row.id };
        delectByCompanyIdApi(obj).then(res => {
          this.getDataList();
          this.$message.success('Delete Success!');
        }).catch(err => {
          this.$message.error(err.message)
        });
      }).catch(() => {
      });
    },
    // 批量删除主体企业接口
    disableClick() {
      if (!this.selectList.length) {
        return this.$message('Please select the data you want to delete');
      }
      this.$confirm('This action will delete the menu and continue??', 'Tips', {
        confirmButtonText: this.$t('common.buttonText.confirm'),
        cancelButtonText: this.$t('common.buttonText.cancel'),
        type: 'warning',
        center: true
      }).then(() => {
        this.reviewForm.companyIds = this.selectList.map(e => {
          return e.id;
        }).join(',');
        delectByCompanyIdApi(this.reviewForm).then(res => {
          if (res.status === 200) {
            this.$message.success('Delete Success!');
          }
          this.getDataList();
        }).catch(err => {
          this.$message.error(err.message);
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'Operation cancelled'
        });
      });
    },
    openDialog(type, row) {
      this.dialogType = type;
      if (type === 'edit') {
        this.activeName = '1';
        this.menuData = deepClone(row);
      }
      this.activeName = '1';
      this.dialogVisible = true;
    },
    // 银行账户
    openBankDialog(type, row) {
      this.dialogBankType = type;
      if (type === 'edit') {
        this.activeName = '2';
        this.bankForm = deepClone(row);
      }
      this.activeName = '2';
      this.addBankVisible = true;
    },
    updateIsDefaul(id) {
      updateCompanyIsDefaultApi({ id }).then(res => {
        this.$message.success(res.message);
        this.getDataList();
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    updateBankDefault(id) {
      updateCompanyBankAccountIsDefaultApi({ id }).then(res => {
        this.$message.success(res.message);
        this.getCompanyBankList();
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    confirmAdd(formName, type) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (type === 1) {
            saveCompanyAccountApi(this.menuData).then(res => {
              this.$message.success(res.message);
              this.$refs[formName].resetFields();
              this.getDataList();
              this.dialogVisible = false;
            }).catch(err => {
              this.listLoading = false;
              this.$message.error(err.message)
            });
          } else {
            updateCompanyAccountApi(this.menuData).then(res => {
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
          this.$message.warning('Please fill in the complete.');
          return false;
        }
      });
    },
    // 勾选触发 selects为选择的数据数组
    getSelect(selects) {
      this.selectList = selects;
    },
    // 勾选触发 selects为选择的数据数组
    getBankSelect(selects) {
      this.selectBankList = selects;
    },
    selectCountryListFun(val) {
      const _this = this;
      if (val !== '') {
        this.loading1 = true;
        selectCountryListApi(val).then(res => {
          _this.countryList = res.data;
          _this.loading1 = false;
        });
      } else {
        this.countryList = [];
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
  .companySet {
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
  }
</style>

