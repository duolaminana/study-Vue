<template>
  <div class="app-container goutong-test">
    <div class="connectRecord">
      <div class="cusInfo">
        <div class="cus-grade">
          <div class="grade-img">
            <img v-if="gradeObj.smallMark" :src="gradeObj.smallMark" alt="">
            <svg-icon v-else icon-class="member" size="50" color="#376FF6"></svg-icon>
          </div>
          <div class="grade-text">{{gradeObj.gradeName ? gradeObj.gradeName : '普通客户'}}</div>
        </div>
        <div class="cus-detail">
          <h2 class="cus-company">{{cusInfo.companyName}}</h2>
          <div class="cus-main">
            <div>联系人：{{cusInfo.customerName}}</div>
            <div>电话：{{cusInfo.mobilePhone}}</div>
            <div>E-mail：{{cusInfo.emailAddress}}</div>
            <div>国家：{{countryObj.chEnName}}</div>
            <div>客户状态：{{cusInfo.transaStatus === 1 ? '已成交' : '未成交'}}</div>
            <div>所在领域：{{cusInfo.ownField}}</div>
            <div>来源：{{cusInfo.customerSource | sourceName}}</div>
            <div>登记日期：{{cusInfo.createTime | timeFmt1}}</div>
          </div>
          <el-button class="close-page" type="primary" size="small" @click="closePage">返回</el-button>
        </div>
      </div>
      <div class="record-list">
        <div class="search-top">
          <div>
            <span style="display: inline-block;margin:  0 16px">最近沟通</span>
            <el-input v-model="postData.commTheme" clearable placeholder="请输入关键词" style="width: 200px" />
            <el-date-picker
              v-model="rangeTime"
              type="daterange"
              align="right"
              unlink-panels
              clearable
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 240px"
              :picker-options="pickerOptions"
              @change="getSearchTime">
            </el-date-picker>
            <el-button type="primary" size="small" class="export" @click="searchData">搜索</el-button>
          </div>
          <div class="btn-right">
            <el-button type="primary" size="small" @click="openDialog('add')">
              <svg-icon class-name="svgClass" icon-class="goutong" size="13"></svg-icon>
              新增沟通
            </el-button>
            <!--<el-button type="danger" size="small">-->
              <!--<svg-icon class-name="svgClass" icon-class="xiaoxi" size="14"></svg-icon>-->
              <!--新增提醒-->
            <!--</el-button>-->
            <!--<el-button type="success" size="small">-->
              <!--<svg-icon class-name="svgClass" icon-class="email1" size="14"></svg-icon>-->
              <!--去发信-->
            <!--</el-button>-->
          </div>
        </div>

        <div class="record-item" v-for="(item, index) in dataList" :key="index" :class="(index+1)%2 === 1 ? '' : 'record-item-bg'">
          <div class="record-header">
            <span class="record-contact">
              <svg-icon class-name="svgClass" icon-class="contact" size="18"></svg-icon>
              {{item.contact}}
            </span>
            <span class="record-date">{{item.commTime | timeFmt}}</span>
            <span class="record-date">
              <svg-icon class-name="svgClass" icon-class="email1" size="18"></svg-icon>
              {{cusInfo.emailAddress}}
            </span>
            <el-button class="close-page" type="primary" size="small" @click="openDialog('edit', item)">重新编辑</el-button>
          </div>
          <div class="record-main">
            <div class="record-left">
              <div class="cus-headerImg">
                <!--<img src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif" alt="">-->
                <svg-icon icon-class="user" class-name="svgClass"></svg-icon>
              </div>
            </div>
            <div class="record-content" :class="item.showAll ? 'showClass' : 'hideClass'">
              <h4 class="record-theme" @click="openDetail(item)">{{item.commTheme}}</h4>
              <div v-html="item.commRemarks"></div>
              <div v-html="item.commResult"></div>
              <div v-if="!item.showAll" class="modal-hide">
                <div class="click-text" @click="item.showAll = true">点击展开 <svg-icon icon-class="shuangjiantouxia" size="16" /></div>
              </div>
              <div v-else class="click-text" @click="item.showAll = false">点击收回 <svg-icon icon-class="shuangjiantoushang" size="16" /></div>
            </div>
            <div class="record-file">
              <div class="file-item" v-for="(file, index1) in item.filesList" :key="index1" title="下载" @click="downFile(file.filesUrl)">
                <svg-icon class-name="fileSvg" :icon-class="file.filesName | fileSvg" size="30" />
                {{file.filesName}}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList" ></Pagination>
    </div>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='add'?'客户沟通记录新增': '客户沟通记录编辑'" center width="950px" @closed="clearData">
      <el-form ref="addCompany" :model="adsPosition" label-width="100px" label-position="right" size="small" inline :rules="adsPositionRules">
        <el-form-item label="联系人" prop="contact">
          <el-input v-model="adsPosition.contact" clearable placeholder="请输入联系人" style="width: 330px"/>
        </el-form-item>
        <el-form-item label="沟通日期" prop="commTime">
          <el-date-picker
            v-model="adsPosition.commTime"
            type="datetime"
            style="width: 330px"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="沟通主题" prop="commTheme">
          <el-input v-model="adsPosition.commTheme" clearable placeholder="请输入沟通主题" style="width: 330px"/>
        </el-form-item>
        <el-form-item label="参与者" prop="participantCustomerBId">
          <el-input v-model="adsPosition.participantCustomerBId" clearable placeholder="请输入参与者" style="width: 330px"/>
        </el-form-item>
        <el-form-item label="沟通场所" prop="commPlace">
          <el-input v-model="adsPosition.commPlace" clearable placeholder="请输入沟通场所" style="width: 773px"/>
        </el-form-item>
        <el-form-item label="沟通方式" prop="commType">
          <el-radio-group v-model="adsPosition.commType" style="width: 330px">
            <el-radio :label="1">即时通讯</el-radio>
            <el-radio :label="2">邮件</el-radio>
            <el-radio :label="3">电话</el-radio>
            <el-radio :label="4">见面</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="内容备注" prop="commRemarks">
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
        size="small"
        :header-cell-style="{background: '#a7bfee'}">
        <el-table-column align="center" label="附件名称" prop="filesName">
        </el-table-column>
        <el-table-column align="center" label="操作" >
          <template slot-scope="scope">
            <el-button type="primary" size="mini" class="export" @click="exportPactFile(scope.row)">下载附件</el-button>
            <el-button type="primary" size="mini" @click="removeFile(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="confirmAdd('addCompany', dialogType === 'add' ? 1 : 2)">确认</el-button>
        <el-button type="danger" size="small" @click="dialogVisible=false">取消</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="detailModal" title="客户沟通记录详情" center width="950px" @closed="clearData">
      <el-form ref="addCompany" :model="adsPosition1" label-width="100px" label-position="right" size="small" inline :rules="adsPositionRules">
        <el-form-item label="联系人" prop="contact">
          <el-input v-model="adsPosition1.contact" clearable placeholder="请输入联系人" style="width: 330px" readonly/>
        </el-form-item>
        <el-form-item label="沟通日期" prop="commTime">
          <el-date-picker
            v-model="adsPosition1.commTime"
            type="datetime"
            disabled
            style="width: 330px"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="沟通主题" prop="commTheme">
          <el-input v-model="adsPosition1.commTheme" clearable placeholder="请输入沟通主题" style="width: 773px" readonly/>
        </el-form-item>
        <el-form-item label="沟通方式" prop="commType">
          <el-radio-group v-model="adsPosition1.commType" style="width: 330px" disabled>
            <el-radio :label="1">即时通讯</el-radio>
            <el-radio :label="2">邮件</el-radio>
            <el-radio :label="3">电话</el-radio>
            <el-radio :label="4">见面</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="内容备注" prop="commRemarks">
          <!--<el-input v-model="adsPosition1.commRemarks" clearable type="textarea" :rows="5" placeholder="这里后期用富文本编辑器" style="width: 773px" readonly/>-->
          <tinymce v-model="adsPosition1.commRemarks" style="width: 773px" />
        </el-form-item>
        <!--<el-form-item label="沟通情况" prop="commSituation">-->
          <!--<el-radio-group v-model="adsPosition1.commSituation" style="width: 500px" disabled>-->
            <!--<el-radio :label="1">非常好</el-radio>-->
            <!--<el-radio :label="2">好</el-radio>-->
            <!--<el-radio :label="3">一般</el-radio>-->
            <!--<el-radio :label="4">糟糕</el-radio>-->
            <!--<el-radio :label="5">非常糟糕</el-radio>-->
          <!--</el-radio-group>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="沟通结果内容" prop="commResult">-->
          <!--&lt;!&ndash;<el-input v-model="adsPosition1.commResult" clearable type="textarea" :rows="5" placeholder="这里后期用富文本编辑器" style="width: 773px" readonly/>&ndash;&gt;-->
          <!--<tinymce v-model="adsPosition1.commResult" style="width: 773px" readonly />-->
        <!--</el-form-item>-->
        <el-form-item label="沟通附件上传">
          <el-upload
            class="upload-demo"
            ref="upload"
            :show-file-list="false"
            :action="uploadActionUrl"
            :headers="upLoadHeaders"
            :on-success="handleSuccess"
            :on-remove="handleRemove"
            disabled
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
        size="small"
        :header-cell-style="{background: '#a7bfee'}">
        <el-table-column align="center" label="附件名称" prop="filesName">
        </el-table-column>
        <el-table-column align="center" label="操作" >
          <template slot-scope="scope">
            <el-button type="primary" size="mini" class="export" @click="exportPactFile(scope.row)">下载附件</el-button>
            <el-button type="primary" size="mini" @click="removeFile(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="detailModal=false">关闭</el-button>
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
import Tinymce from '@/components/Tinymce'
import {
  listCustomerCommunicationApi,
  saveCustomerCommunicationApi,
  updateCustomerCommunicationApi,
  deleteCustomerCommunicationApi,
  getCustomerInfoByBId
} from '@/api/customer';
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
        filesList: []
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
        commTime: [
          { required: true, message: '请选择沟通日期', trigger: 'blur' }
        ],
        commType: [
          { required: true, message: '请选择沟通方式', trigger: 'blur' }
        ],
        commSituation: [
          { required: true, message: '请选择沟通情况', trigger: 'blur' }
        ]
      },
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        startTime: '',
        endTime: '',
        commTheme: ''
      },
      areaList: [
        {
          label: '即时通讯',
          commType: 1
        },
        {
          label: '邮件',
          commType: 2
        },
        {
          label: '电话',
          commType: 3
        },
        {
          label: '见面',
          commType: 4
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
  },
  methods: {
    closePage() {
      this.$router.push({
        path: '/customer/customerList'
      })
    },
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
        this.postData.startTime = date[0];
        this.postData.endTime = date[1]
      } else {
        this.postData.startTime = '';
        this.postData.endTime = ''
      }
    },
    downFile(url) {
      window.open(url)
    },
    async promise() {
      try {
        await this.getGradeList();
        await this.getCountryAllList();
        this.getCusInfo();
      } catch (e) {
        this.$message.error(e)
      }
    },
    getGradeList() {
      return new Promise((resolve, reject) => {
        listMemberLevel().then(res => {
          this.gradeList = res.data.list;
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
    getCusInfo() {
      getCustomerInfoByBId({ bid: this.$route.query.id }).then(res => {
        this.cusInfo = res.data;
        if (res.data.memberBId) {
          this.gradeObj = this.gradeList.filter(e => {
            return e.bid === res.data.memberBId
          })[0]
        }
        if (res.data.countryCode) {
          this.countryObj = this.countryList.filter(e => {
            return e.countryCode === res.data.countryCode
          })[0]
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    getDataList() {
      this.customerName = this.$route.query.customerName;
      this.postData.customerBId = this.$route.query.id;
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      listCustomerCommunicationApi(obj).then(res => {
        this.dataList = res.data.list.map(e => {
          e.showAll = false;
          return { ...e }
        });
        this.postData.total = res.data.total;
      }).catch(err => {
        this.$message({ message: err.message });
      });
      this.listLoading = false;
    },
    openDetail(row) {
      this.adsPosition1 = deepClone(row);
      this.filesList = row.filesList;
      this.detailModal = true;
    },
    openDialog(type, row) {
      this.dialogType = type;
      if (type === 'edit') {
        this.adsPosition = deepClone(row);
        this.filesList = row.filesList;
      }
      this.dialogVisible = true;
    },
    confirmAdd(formName, type) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (type === 1) {
            this.adsPosition.customerBId = this.$route.query.id;
            this.adsPosition.filesList = this.filesList;
            saveCustomerCommunicationApi(this.adsPosition).then(res => {
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
            updateCustomerCommunicationApi(this.adsPosition).then(res => {
              this.$message.success('更新成功！');
              this.$refs[formName].resetFields();
              this.getDataList();
              this.dialogVisible = false;
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
    getSelect(selects) {
      this.selectList = selects;
    },
    // 删除接口
    disableClick(row) {
      this.$confirm('此操作将删除该沟通记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        let obj = {
          id: row.id
        };
        deleteCustomerCommunicationApi(obj).then(res => {
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

