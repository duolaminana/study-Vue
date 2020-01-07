<template>
  <div class="app-container goutong-test">
    <div class="search-box">
      <!--<el-form label-width="90px" inline size="small">-->
        <!--<div>-->
          <!--<el-form-item label="供应商名称">-->
            <!--<el-input v-model="postData.customerName" clearable style="width: 200px" />-->
          <!--</el-form-item>-->
          <!--<el-form-item :label="$t('customer.record.category')">-->
            <!--<el-cascader-->
              <!--style="width: 200px"-->
              <!--v-model="postData.sortName"-->
              <!--:options="sortList"-->
              <!--:props="{value: 'bid', label: 'sortName', children: 'children'}"-->
              <!--filterable-->
              <!--clearable-->
              <!--change-on-select-->
              <!--@change="getParentId1"-->
            <!--&gt;</el-cascader>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="供应商等级">-->
            <!--<el-select v-model="postData.memberBId" clearable style="width: 200px">-->
              <!--<el-option v-for="(item, index) in gradeList" :label="item.levelName" :value="item.bid" :key="index"></el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
          <!--<el-form-item :label="$t('system.role.status')">-->
            <!--<el-select v-model="postData.customerStatus" clearable style="width: 200px">-->
              <!--<el-option v-for="(item, index) in areaList" :label="item.label" :value="item.id" :key="index"></el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
        <!--</div>-->
        <!--<div>-->
          <!--<el-form-item label="供应商编码">-->
            <!--<el-input v-model="postData.customerCode" clearable style="width: 200px" />-->
          <!--</el-form-item>-->
          <!--<el-form-item :label="$t('customer.record.country')">-->
            <!--<el-select filterable remote v-model="postData.countryCode" clearable style="width: 200px">-->
              <!--<el-option v-for="(item, index) in countryList" :label="item.chEnName" :value="item.countryCode" :key="index">-->
                <!--{{item.searchStr}}-->
              <!--</el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
          <!--<el-form-item :label="$t('customer.record.contactNo')">-->
            <!--<el-input v-model="postData.mobilePhone" clearable style="width: 200px" />-->
          <!--</el-form-item>-->
          <!--<el-form-item>-->
            <!--<el-button type="primary" class="export" @click="searchData">{{$t('system.role.search')}}</el-button>-->
          <!--</el-form-item>-->
        <!--</div>-->
      <!--</el-form>-->
      <el-form label-width="100px" inline size="small">
        <div>
          <el-form-item label="供应商名称">
            <el-input v-model="postData.supplierName" clearable style="width: 200px"/>
          </el-form-item>
          <el-form-item label="分类">
            <el-cascader
              style="width: 200px"
              v-model="searchSortName"
              :options="sortList"
              :props="{value: 'bid', label: 'supplierSortName', children: 'children'}"
              filterable
              clearable
              change-on-select
              @change="getParentId1"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="等级">
            <el-select v-model="postData.supplierGradeBId" clearable style="width: 200px">
              <el-option v-for="(item, index) in gradeList" :label="item.levelName" :value="item.bid"
                         :key="index"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="供应商编码">
            <el-input v-model="postData.supplierCode" clearable style="width: 200px"/>
          </el-form-item>
          <el-form-item label="国家">
            <el-input v-model="postData.countryCode" clearable style="width: 200px"/>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="postData.officePhone" clearable style="width: 200px"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="export" @click="searchData">搜索</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="openDialog('add')">{{$t('system.role.add')}}</el-button>
      <el-button type="primary" size="small" class="export">导入excel</el-button>
      <el-button type="primary" size="small" class="export">导出excel</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="dataList"
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

      <el-table-column label="国家" prop="countryCode" show-overflow-tooltip />

      <el-table-column align="center" label="联系电话" prop="mobilePhone" show-overflow-tooltip />

      <el-table-column align="center" label="修改人" prop="updateUserId" show-overflow-tooltip />

      <el-table-column align="center" width="100px" label="修改时间" prop="updateTime" show-overflow-tooltip >
        <template slot-scope="scope">
          {{scope.row.updateTime | timeFmt}}
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" :label="$t('system.role.status')" prop="accountStatus">
        <template slot-scope="scope">
          <el-tag :type="scope.row.accountStatus === 0 ? 'primary' : 'danger' " size="mini">{{ scope.row.accountStatus
            === 0 ?
            $t('system.role.active') : $t('system.role.inactive') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="265" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" class="export table-btn-width" @click="openDetail(scope.row)">聊天记录</el-button>
          <!--<el-button type="primary" size="mini" class="export table-btn-width" @click="openDetail(scope.row.bid)">禁用</el-button>-->
          <!--<el-button type="primary" size="mini" class="table-btn-width" @click="openEdit('edit',scope.row.bid)">编辑</el-button>-->
          <!--<el-button type="primary" size="mini" class="table-btn-width" @click="addCustomerRecord(scope.row.bid,scope.row.customerName)">沟通记录</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList" ></Pagination>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='add'?'供应商沟通记录新增': '供应商沟通记录编辑'" center width="950px" @closed="clearData">
      <el-form ref="addCompany" :model="adsPosition" label-width="100px" label-position="right" size="small" inline :rules="adsPositionRules">
        <el-form-item label="客户名称" prop="supplierBId">
          <el-select v-model="adsPosition.supplierBId" clearable style="width: 330px">
            <el-option v-for="(item, index) in clientList" :label="item.supplierName" :value="item.bid" :key="index"></el-option>
          </el-select>
          <!--<el-input v-model="adsPosition.customerBId" clearable style="width: 330px"/>-->
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input v-model="adsPosition.contact" clearable style="width: 330px"/>
        </el-form-item>
        <el-form-item label="沟通主题" prop="commTheme">
          <el-input v-model="adsPosition.commTheme" clearable style="width: 330px"/>
        </el-form-item>
        <el-form-item label="参与者" prop="participantCustomerBId">
          <el-input v-model="adsPosition.participantCustomerBId" style="width: 330px"/>
        </el-form-item>
        <el-form-item label="沟通日期" prop="commTime">
          <el-date-picker
            v-model="adsPosition.commTime"
            type="datetime"
            style="width: 330px">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="沟通场所" prop="commPlace">
          <el-input v-model="adsPosition.commPlace" clearable style="width: 773px"/>
        </el-form-item>
        <el-form-item label="通讯模式" prop="commType">
          <el-radio-group v-model="adsPosition.commType" style="width: 330px">
            <el-radio :label="1">即时通讯</el-radio>
            <el-radio :label="2">邮件</el-radio>
            <el-radio :label="3">电话</el-radio>
            <el-radio :label="4">见面</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="沟通内容" prop="commRemarks">
          <!--<el-input v-model="adsPosition.commRemarks" clearable type="textarea" :rows="5" placeholder="这里后期用富文本编辑器" style="width: 773px"/>-->
          <tinymce v-model="adsPosition.commRemarks" style="width: 773px" />
        </el-form-item>
        <el-form-item label="沟通情况" prop="commSituation">
          <el-radio-group v-model="adsPosition.commSituation" style="width: 500px">
            <el-radio :label="1">很好</el-radio>
            <el-radio :label="2">好</el-radio>
            <el-radio :label="3">一般</el-radio>
            <el-radio :label="4">差</el-radio>
            <el-radio :label="5">非常差</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="行动计划" prop="commPlan">
          <!--<el-input v-model="adsPosition.commResult" clearable type="textarea" :rows="5" placeholder="这里后期用富文本编辑器" style="width: 773px"/>-->
          <tinymce v-model="adsPosition.commPlan" style="width: 773px" />
        </el-form-item>
        <el-form-item label="沟通附件上传">
          <el-upload
            class="upload-demo"
            ref="upload"
            :show-file-list="false"
            :action="uploadActionUrl"
            :headers="upLoadHeaders"
            :on-success="handleSuccess"
            :on-remove="handleRemove"
            :before-upload="beforeUpload"
            :file-list="filesList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传word/pdf，且不超过10M</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <el-table
        :data="filesList"
        border
        fit
        style="margin: 10px 0"
        size="small">
        <el-table-column label="附件名称" prop="filesName">
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="confirmAdd('addCompany', dialogType === 'add' ? 1 : 2)">确认</el-button>
        <el-button type="danger" size="small" @click="dialogVisible=false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="detailModal" title="客户沟通记录详情" center width="1000px" @closed="clearData">
      <el-form label-width="90px" inline size="small" v-model="dialogPostData">
        <div>
          <el-form-item label="联系人">
            <el-input v-model="dialogPostData.contact" clearable style="width: 200px" />
          </el-form-item>
          <el-form-item label="通讯模式" prop="commType">
            <el-radio-group v-model="dialogPostData.commType" style="width: 330px">
              <el-radio :label="1">即时通讯</el-radio>
              <el-radio :label="2">邮件</el-radio>
              <el-radio :label="3">电话</el-radio>
              <el-radio :label="4">见面</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="沟通主题">
            <el-input v-model="dialogPostData.commTheme" clearable style="width: 200px" />
          </el-form-item>
          <!--<el-form-item label="日期" prop="commTime">-->
            <!--<el-date-picker-->
              <!--v-model="dialogPostData.commTime"-->
              <!--type="datetime"-->
              <!--style="width: 330px">-->
            <!--</el-date-picker>-->
          <!--</el-form-item>-->
          <el-form-item label="沟通日期">
            <el-date-picker
              v-model="ActivityStart"
              type="daterange"
              align="right"
              unlink-panels
              clearable
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 380px"
              :picker-options="pickerOptions"
              @change="getSearchTime">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="export" @click="searchRecord">搜索</el-button>
          </el-form-item>
        </div>
      </el-form>
      <div class="topBtns">
          <el-button type="primary" size="small" @click="openDialog('edit',dialogPostData)">新增</el-button>
          <el-button type="danger" size="small" @click="deleteListByIds">删除</el-button>
          <el-button type="primary" size="small" class="export">导出excel</el-button>
      </div>
      <el-table
        :data="dialogDataList"
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
        <el-table-column label="供应商名称" show-overflow-tooltip >
          <template>
            {{ customerNameNum }}
          </template>
        </el-table-column>
        <el-table-column label="联系人" prop="contact" show-overflow-tooltip />
        <el-table-column label="沟通主题" prop="commTheme" show-overflow-tooltip/>
        <el-table-column align="center" label="通讯模式" prop="commType" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.commType | commTypeFmt}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="沟通日期" prop="commTime" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.commTime | timeFmt}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="265" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" class="export table-btn-width" @click="openVisibleDetail(scope.row)">查看</el-button>
            <el-button type="primary" size="mini" class="export table-btn-width" @click="openDialog('edit',scope.row)">编辑</el-button>
            <!--<el-button type="primary" size="mini" class="table-btn-width" @click="openEdit('edit',scope.row.bid)">编辑</el-button>-->
            <!--<el-button type="primary" size="mini" class="table-btn-width" @click="addCustomerRecord(scope.row.bid,scope.row.customerName)">沟通记录</el-button>-->
          </template>
        </el-table-column>
      </el-table>

      <Pagination :total="dialogPostData.total" :page.sync="dialogPostData.pageNum" :limit.sync="dialogPostData.pageSize" @pagination="getDialogDataList" ></Pagination>

      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="detailModal=false">关闭</el-button>
      </div>
    </el-dialog>
    <!--详情-->
    <el-dialog :visible.sync="dialogVisibleDetail" title="供应商沟通记录详情" center width="950px" @closed="clearData">
      <el-form ref="addCompany" :model="adsPosition" label-width="100px" label-position="right" size="small" inline :rules="adsPositionRules">
        <el-form-item label="供应商名称" prop="customerBId">
          <el-select v-model="adsPosition.customerBId" clearable style="width: 330px" disabled>
            <el-option v-for="(item, index) in clientList" :label="item.customerName" :value="item.bid" :key="index"></el-option>
          </el-select>
          <!--<el-input v-model="adsPosition.customerBId" clearable style="width: 330px"/>-->
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input v-model="adsPosition.contact" clearable style="width: 330px" readonly/>
        </el-form-item>
        <el-form-item label="沟通主题" prop="commTheme">
          <el-input v-model="adsPosition.commTheme" clearable style="width: 330px" readonly/>
        </el-form-item>
        <el-form-item label="参与者" prop="participantCustomerBId">
          <el-input v-model="adsPosition.participantCustomerBId" style="width: 330px" readonly/>
        </el-form-item>
        <el-form-item label="沟通日期" prop="commTime">
          <el-date-picker
            disabled
            v-model="adsPosition.commTime"
            type="datetime"
            style="width: 330px"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="沟通场所" prop="commPlace">
          <el-input v-model="adsPosition.commPlace" clearable style="width: 773px" readonly/>
        </el-form-item>
        <el-form-item label="通讯模式" prop="commType">
          <el-radio-group v-model="adsPosition.commType" style="width: 330px" disabled>
            <el-radio :label="1">即时通讯</el-radio>
            <el-radio :label="2">邮件</el-radio>
            <el-radio :label="3">电话</el-radio>
            <el-radio :label="4">见面</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="沟通内容" prop="commRemarks">
          <!--<el-input v-model="adsPosition.commRemarks" clearable type="textarea" :rows="5" placeholder="这里后期用富文本编辑器" style="width: 773px"/>-->
          <tinymce v-model="adsPosition.commRemarks" style="width: 773px" readonly/>
        </el-form-item>
        <el-form-item label="沟通情况" prop="commSituation">
          <el-radio-group v-model="adsPosition.commSituation" style="width: 500px" disabled>
            <el-radio :label="1">很好</el-radio>
            <el-radio :label="2">好</el-radio>
            <el-radio :label="3">一般</el-radio>
            <el-radio :label="4">差</el-radio>
            <el-radio :label="5">非常差</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="行动计划" prop="commPlan">
          <!--<el-input v-model="adsPosition.commResult" clearable type="textarea" :rows="5" placeholder="这里后期用富文本编辑器" style="width: 773px"/>-->
          <tinymce v-model="adsPosition.commPlan" style="width: 773px" readonly/>
        </el-form-item>
        <el-form-item label="附件上传">
          <el-upload
            disabled
            class="upload-demo"
            :action="uploadActionUrl"
            :on-success="handleSuccess"
            :on-remove="handleRemove"
            :before-upload="beforeUpload"
          >
          </el-upload>
        </el-form-item>
      </el-form>
      <el-table
        :data="filesList"
        border
        fit
        style="margin: 10px 0"
        size="small">
        <el-table-column label="附件名称" prop="filesName">
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="dialogVisibleDetail=false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import Pagination from '@/components/Pagination'
import { parseTime, deepClone } from '@/utils/index'
import { uploadActionUrl } from '@/api/common'
import { selectCountryListApi } from '@/api/system'
import { getToken } from '@/utils/auth'
import {
  supplierPageList,
  listSupplierCommunicationApi,
  saveSupplierCommunicationApi,
  updateSupplierCommunicationApi,
  deleteBatchByIds,
  getAllSortList
} from '@/api/supplier'
import Tinymce from '@/components/Tinymce'
import { listMemberLevel } from "@/api/member";

export default {
  components: {
    Pagination,
    Tinymce
  },
  filters: {
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
    },
    timeFmt1(val) {
      if (val) {
        return parseTime(val, '{y}-{m}-{d}')
      }
    },
    fileSvg(file) {
      let fileType = file.split('.')[file.split('.').length - 1];
      if (fileType === 'doc' || fileType === 'docx') {
        return 'doc'
      } else if (fileType === 'xls' || fileType === 'xlsx') {
        return 'excel'
      } else if (fileType === 'pdf' || fileType === 'PDF') {
        return 'pdf'
      } else if (fileType === 'zip' || fileType === 'rar') {
        return 'zip'
      } else {
        return 'text'
      }
    },
    commTypeFmt(val) {
      switch (val) {
        // 沟通方式(1-即时通讯 ,  2-邮件 , 3-电话 , 4-见面)
        case 1: return '即时通讯';
        case 2: return '邮件';
        case 3: return '电话';
        case 4: return '见面';
        default:
          return '不存在';
      }
    },
    commSituationFmt(val) {
      switch (val) {
        // 沟通情况(1-非常好 , 2-好 , 3-一般 , 4-糟糕 , 5-非常糟糕)
        case 1: return '非常好';
        case 2: return '好';
        case 3: return '一般';
        case 4: return '糟糕';
        case 5: return '非常糟糕';
        default:
          return '不存在';
      }
    },
    sourceName(val) {
      switch (Number(val)) {
        case 1: return '自助开发';
        case 2: return '询盘';
        case 3: return '展会';
        default: return ''
      }
    }
  },
  data() {
    return {
      ActivityStart: [],
      dialogDataList: [],
      dialogVisibleDetail: false,
      dialogPostData: {
        contact: '',
        commTheme: '',
        customerName: '',
        commType: '',
        startTime: '',
        endTime: '',
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      clientList: [],
      searchSortName: [],
      customerNameNum: '',
      sortList: [],
      uploadActionUrl,
      dataList: [],
      filesList: [],
      listLoading: true,
      dialogVisible: false,
      detailModal: false,
      dialogType: '',
      rangeTime: [],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      selectList: [],
      gradeList: [],
      countryList: [],
      cusInfo: {},
      gradeObj: {},
      countryObj: {},
      reviewForm: {
        positionIds: ''
      },
      adsPosition: {
        supplierBId: '',
        contact: '',
        commTime: '',
        commTheme: '',
        commType: 1,
        commRemarks: '',
        commSituation: 1,
        commResult: '',
        bId: '',
        filesName: '',
        filesUrl: '',
        commBId: '',
        customerBId: '',
        commPlace: '',
        commPlan: '',
        participantCustomerBId: '',
        filesList: [],
        commBID: "",
        customeTime: "",
        supplierName: ""
      },
      adsPosition1: {
        contact: '',
        commTime: '',
        commTheme: '',
        commType: 1,
        commRemarks: '',
        commSituation: 1,
        commResult: '',
        bId: '',
        filesName: '',
        filesUrl: '',
        commBId: '',
        customerBId: '',
        filesList: []
      },
      adsPositionRules: {
        contact: [
          { required: true, message: '请填写联系人名称', trigger: 'blur' }
        ],
        customerBId: [
          { required: true, message: '请选择客户名称', trigger: 'blur' }
        ],
        commTime: [
          { required: true, message: '请选择沟通日期', trigger: 'blur' }
        ],
        commType: [
          { required: true, message: '请选择沟通方式', trigger: 'blur' }
        ],
        commSituation: [
          { required: true, message: '请选择沟通情况', trigger: 'blur' }
        ],
        commTheme: [
          { required: true, message: '请输入沟通主题', trigger: 'blur' }
        ],
        participantCustomerBId: [
          { required: true, message: '请输入参与者', trigger: 'blur' }
        ],
        commPlace: [
          { required: true, message: '请输入沟通场所', trigger: 'blur' }
        ]
      },
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        startTime: '',
        endTime: '',
        commTheme: '',
        customerName: '',
        customerStatus: '',
        customerCode: '',
        mobilePhone: '',
        countryCode: '',
        memberBId: '',
        supplierSortBId: ''
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
      upLoadHeaders: {
        token: getToken()
      }
    }
  },
  created() {
    this.promise();
    this.getDataList();
    this.getSortList()
    this.getGradeList()
  },
  methods: {
    searchRecord() {
      this.dialogPostData.pageNum = 1;
      this.getDialogDataList()
    },
    openVisibleDetail(row) {
      this.dialogVisibleDetail = true
      this.adsPosition = deepClone(row);
      this.filesList = row.filesList;
      supplierPageList({ pageNum: 1, pageSize: 999 }).then(res => {
        this.clientList = res.data.list
      })
    },
    getParentId1(arr) {
      if (arr.length) {
        this.postData.supplierSortBId = arr.join(',')
      } else {
        this.postData.supplierSortBId = ''
      }
    },
    // 分类列表
    // getSortList() {
    //   listSort({ pageNum: 1, pageSize: 999 }).then(res => {
    //     this.sortList = res.data.list || []
    //     console.log(this.sortList)
    //   }).catch(err => {
    //     this.$message.error(err.message);
    //   });
    // },
    // closePage() {
    //   this.$router.push({
    //     path: '/customer/customerList'
    //   })
    // },
    searchData() {
      this.postData.pageNum = 1;
      this.getDataList()
    },
    clearData() {
      this.adsPosition.contact = '';
      this.adsPosition.commTime = '';
      this.adsPosition.commTheme = '';
      this.adsPosition.commType = 1;
      this.adsPosition.commRemarks = '';
      this.adsPosition.commSituation = 1;
      this.adsPosition.commResult = '';
      this.adsPosition.bId = '';
      this.adsPosition.filesName = '';
      this.adsPosition.filesUrl = '';
      this.adsPosition.commBId = '';
      this.filesList = [];
    },
    getSearchTime(date) {
      if (date && date.length) {
        this.dialogPostData.startTime = date[0];
        this.dialogPostData.endTime = date[1]
      } else {
        this.dialogPostData.startTime = '';
        this.dialogPostData.endTime = ''
      }
    },
    downFile(url) {
      window.open(url)
    },
    async promise() {
      try {
        await this.getGradeList();
        await this.getCountryAllList();
        // this.getCusInfo();
      } catch (e) {
        this.$message.error(e)
      }
    },
    getSelect(selects) {
      this.selectList = selects;
    },
    // 供应商分类
    getSortList() {
      getAllSortList().then(res => {
        this.sortList = res.data || []
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 删除
    deleteListByIds() {
      if (!this.selectList.length) {
        return this.$message(this.$t('system.userManage.option'));
      }
      this.$confirm(this.$t('system.userManage.whether'), this.$t('system.userManage.hint'), {
        confirmButtonText: this.$t("system.role.affirm"),
        cancelButtonText: this.$t("system.role.return"),
        type: 'warning'
      }).then(() => {
        this.deleteIdsForm = this.selectList.map(e => {
          return e.id;
        }).join(",");
        deleteBatchByIds({ ids: this.deleteIdsForm }).then(res => {
          if (res.status === 200) {
            this.$message.success(this.$t("system.userManage.handle"));
          }
          this.getDialogDataList();
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
    // 会员等级
    getGradeList() {
      return new Promise((resolve, reject) => {
        listMemberLevel().then(res => {
          this.gradeList = res.data
          resolve(res)
        }).catch(err => {
          reject(err);
          this.$message.error(err.message);
        });
      })
    },
    getCountryAllList() {
      return new Promise((resolve, reject) => {
        selectCountryListApi().then(res => {
          this.countryList = res.data || [];
          resolve(res)
        }).catch(err => {
          reject(err);
          this.$message.error(err.message);
        });
      })
    },
    // 供应商列表
    getDataList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key]) {
          obj[key] = this.postData[key]
        }
      }
      supplierPageList(obj).then(res => {
        this.dataList = res.data.list;
        this.postData.total = res.data.total;
      }).catch(err => {
        this.$message.error(err.message);
      });
      this.listLoading = false;
    },
    openDetail(row) {
      this.adsPosition1 = deepClone(row);
      this.filesList = row.filesList;
      this.customerNameNum = row.supplierName;
      this.dialogPostData.supplierBId = row.bid;
      console.log(row)
      this.getDialogDataList();
      this.detailModal = true;
    },
    // 沟通记录
    getDialogDataList() {
      listSupplierCommunicationApi(this.dialogPostData).then(res => {
        this.dialogDataList = res.data.list;
        // this.dialogPostData = res.data.list[0]
        this.dialogPostData.total = res.data.total;
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    openDialog(type, row) {
      this.dialogType = type;
      if (type === 'edit') {
        this.adsPosition = deepClone(row);
        this.filesList = row.filesList;
      } else {
        this.adsPosition = {}
      }
      supplierPageList({ pageNum: 1, pageSize: 10 }).then(res => {
        this.clientList = res.data.list
      })
      this.dialogVisible = true;
    },
    confirmAdd(formName, type) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (type === 1) {
            // this.adsPosition.customerBId = this.$route.query.id;
            this.adsPosition.filesList = this.filesList;
            saveSupplierCommunicationApi(this.adsPosition).then(res => {
              this.$message.success('保存成功！');
              this.$refs[formName].resetFields();
              this.getDataList();
              this.dialogVisible = false;
            }).catch(err => {
              this.listLoading = false;
              this.$message.error(err.message)
            });
          } else {
            this.adsPosition.filesList = this.filesList;
            updateSupplierCommunicationApi(this.adsPosition).then(res => {
              this.$message.success('更新成功！');
              this.$refs[formName].resetFields();
              this.getDataList();
              this.detailModal = false;
            }).catch(err => {
              this.listLoading = false;
              this.$message.error(err.message)
            });
          }
        } else {
          this.$message.warning('验证未通过');
          return false;
        }
      });
    },
    // 勾选触发 selects为选择的数据数组
    // getSelect(selects) {
    //   this.selectList = selects;
    // },
    // 删除接口
    // deleteListByIds(row) {
    //   this.$confirm('此操作将删除该沟通记录, 是否继续?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning',
    //     center: true
    //   }).then(() => {
    //     let obj = {
    //       id: row.id
    //     };
    //     deleteCustomerCommunication(obj).then(res => {
    //       if (res.status === 200) {
    //         this.$message.success('操作成功!');
    //       }
    //       this.getDataList();
    //     }).catch(err => {
    //       this.$message.error(err.message);
    //     });
    //   }).catch(() => {
    //     this.$message({
    //       type: 'info',
    //       message: '已取消操作'
    //     });
    //   });
    // },
    // 新增协议
    addPactFileList() {
      if (!this.adsPosition.filesName) {
        return this.$message.warning('请填写完整和上传文件');
      }
      // let currency = this.adsPosition.filesName[0];
      // for (let i = 0; i < this.filesList.length; i++) {
      //   if (currency.label === this.filesList[i].filesName) {
      //     return this.$message.error('该文件已存在')
      //   }
      // }
      this.filesList.push({ filesName: this.adsPosition.filesName, filesUrl: this.adsPosition.filesUrl });
      this.adsPosition.filesName = '';
      this.adsPosition.filesUrl = '';
      this.$refs.upload.clearFiles();
    },
    // 删除协议
    removeFile(scope) {
      this.filesList.splice(scope.$index, 1)
    },
    // 下载协议
    exportPactFile(row) {
      window.open(row.filesUrl)
    },
    // 上传文件删除
    handleRemove(file, filesList) {
      this.adsPosition.filesName = '';
      this.adsPosition.filesUrl = '';
    },
    // 上传成功
    handleSuccess(res, file, filename) {
      this.adsPosition.filesName = file.name;
      this.adsPosition.filesUrl = res.data.filePath;
      this.filesList.push({ filesName: this.adsPosition.filesName, filesUrl: this.adsPosition.filesUrl });
    },
    // 上传之前限制
    beforeUpload(file) {
      for (let i = 0; i < this.filesList.length; i++) {
        if (this.filesList[i].filesName === file.name) {
          this.$message.error('已有文件不能重复上传');
          return false
        }
      }
      let testmsg = file.name.substring(file.name.lastIndexOf('.') + 1);
      const extension = testmsg === 'PDF';
      const extension2 = testmsg === 'pdf';
      const extension3 = testmsg === 'doc';
      const extension4 = testmsg === 'docx';
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!extension && !extension2 && !extension3 && !extension4) {
        this.$message({
          message: '上传文件只能是 PDF、doc、docx格式!',
          type: 'warning'
        });
      }
      if (!isLt2M) {
        this.$message({
          message: '上传文件大小不能超过 10MB!',
          type: 'warning'
        });
      }
      return (extension || extension2 || extension3 || extension4) && isLt2M
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables.scss';
  .goutong-test {
    /*width: 90%;*/
    margin: 0 auto;
    overflow: auto;
    background: #F6F7FB;
    .menuDialog {
      .el-dialog {
        width: 500px;
      }
    }
    .item-label {
      .el-form-item__label {
        width: 68px !important;
      }
      .el-form-item__content {
        margin-left: 68px !important;
      }
    }
    .category-footer {
      text-align: center;
      margin: 20px 0;
      button {
        margin:  0 20px;
      }
    }
    .connectRecord {
      padding: 15px;
      .cusInfo {
        display: flex;
        display: -webkit-flex;
        background: white;
        padding: 20px;
        border: 1px solid $border-light-color;
        -webkit-border-radius: 3px;
        border-radius: 3px;
        .cus-grade {
          width: 120px;
          text-align: center;
          .grade-img {
            width: 80px;
            height: 80px;
            margin: 20px auto;
            -webkit-border-radius: 5px;
            border-radius: 5px;
            overflow: hidden;
            display: flex;
            display: -webkit-flex;
            justify-content: center;
            align-items: center;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .grade-text {
            color: #376FF6;
          }
        }
        .cus-detail {
          flex: 1;
          margin-left: 20px;
          position: relative;
          .cus-company {
            color: #505559;
          }
          .cus-main {
            display: flex;
            display: -webkit-flex;
            background: #F6F7FB;
            padding: 16px;
            font-size: 14px;
            -webkit-border-radius: 3px;
            border-radius: 3px;
            flex-wrap: wrap;
            >div {
              width: 25%;
              line-height: 2rem;
            }
          }
        }
      }
      .close-page {
        position: absolute;
        right: 20px;
        top: 8px;
      }
      .record-list {
        padding: 20px;
        margin-top: 20px;
        background: white;
        border: 1px solid $border-light-color;
        -webkit-border-radius: 3px;
        border-radius: 3px;
        .search-top {
          -webkit-border-radius: 3px;
          border-radius: 3px;
          background: #CFD9DB;
          padding: 14px;
          display: -webkit-flex;
          display: flex;
          >div {
            display: inline-block;
          }
          .btn-right {
            flex: 1;
            text-align: right;
          }
          .svgClass {
            margin-right: 6px;
          }
        }
        .record-item-bg {
          background: #F6F7FB;
        }
        .record-item {
          .record-header {
            display: flex;
            display: -webkit-flex;
            position: relative;
            font-size: 14px;
            padding: 15px;
            line-height: 1.25rem;
            border-bottom: 1px solid $border-light-color;
            border-top: 1px solid $border-light-color;
            .record-date {
              color: #376FF6;
              font-size: 14px;
              font-weight: bold;
              display: inline-block;
              margin: 0 20px;
            }
            .record-contact {
              font-size: 14px;
              font-weight: bold;
              display: inline-block;
              margin: 0 20px;
              color: #959998;
            }
          }
          .record-main {
            display: flex;
            display: -webkit-flex;
            padding-top: 24px;
            .record-left {
              width: 90px;
              padding: 10px;
              .cus-headerImg {
                margin: 0 auto;
                display: flex;
                display: -webkit-flex;
                width: 50px;
                height: 50px;
                background: #C7ECF2;
                -webkit-border-radius: 50px;
                border-radius: 50%;
                overflow: hidden;
                justify-content: center;
                align-items: center;
                img {
                  width: 100%;
                  height: 100%;
                }
                .svgClass {
                  color: #35BAC3;
                  font-size: 18px;
                }
              }
            }
            .record-file {
              margin-left: 16px;
              width: 280px;
              display: -webkit-flex;
              display: flex;
              flex-wrap: wrap;
              .file-item {
                font-size: 12px;
                margin: 0 10px;
                .fileSvg {
                  display: block;
                  margin: 5px auto;
                }
              }
            }
            .record-content {
              flex: 1;
              position: relative;
              padding-bottom: 30px;
              -webkit-border-radius: 3px;
              border-radius: 3px;
              .record-theme {
                cursor: pointer;
              }
              img {
                max-width: 100%;
              }
              .modal-hide {
                height: 100px;
                width: 100%;
                z-index: 150;
                position: absolute;
                bottom: 0;
                left: 0;
                background-image: -webkit-gradient(linear,left top, left bottom,from(rgba(255,255,255,0)),color-stop(70%, #fff));
                background-image: linear-gradient(-180deg,rgba(255,255,255,0) 0%,#fff 70%);
              }
              .click-text {
                position: absolute;
                text-align: center;
                color: #376FF6;
                cursor: pointer;
                width: 100%;
                bottom: 10px
              }
            }
            .hideClass {
              height: 200px;
              overflow: hidden;
            }
            .showClass {
              height: auto;
            }
          }
        }
      }
    }
  }
</style>

