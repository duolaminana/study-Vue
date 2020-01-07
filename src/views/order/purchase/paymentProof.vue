<template>
  <div class="app-container paymentProof">
    <div class="search-box">
      <el-form label-width="100px" inline size="small">
        <div>
          <el-form-item label="供应商名称">
            <el-input v-model="postData.sellerName" clearable placeholder="请输入供应商名称" style="width: 200px"/>
          </el-form-item>
          <el-form-item label="供应商编码">
            <el-input v-model="postData.sellerCode" clearable placeholder="请输入供应商编码" style="width: 200px"/>
          </el-form-item>
          <!--<el-form-item label="状态">-->
            <!--<el-select v-model="postData.orderStatus" clearable placeholder="请选择状态" style="width: 200px">-->
              <!--<el-option v-for="(item, index) in orderStatusList" :label="item.label" :value="item.orderStatus"-->
                         <!--:key="index"></el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
          <el-form-item style="padding-left: 90px;">
            <el-button type="primary" class="export" @click="searchData">搜索</el-button>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="订单号">
            <el-input v-model="postData.purchaseNo" clearable placeholder="请输入订单号" style="width: 200px"/>
          </el-form-item>
          <!--<el-form-item label="销售订单号" prop="countryCode">-->
            <!--<el-input v-model="postData.salesOrderNo" clearable placeholder="请输入销售订单号" style="width: 200px"/>-->
          <!--</el-form-item>-->
          <el-form-item label="订单日期">
            <el-date-picker
              v-model="rangeTime"
              type="daterange"
              align="right"
              unlink-panels
              clearable
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 360px"
              :picker-options="pickerOptions"
              @change="getSearchTime">
            </el-date-picker>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="topBtns">
      <!--<el-button type="danger" size="small" @click="deleteListByIds()">删除</el-button>-->
      <!--<el-button type="primary" size="small" class="export">导出excel</el-button>-->
    </div>
    <el-table
      v-loading="listLoading"
      :data="dataList"
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

      <el-table-column label="订单号" prop="purchaseNo" show-overflow-tooltip/>

      <!--<el-table-column align="center" label="销售订单号" prop="salesOrderNo"/>-->
      <el-table-column label="供应商编码" prop="sellerCode" show-overflow-tooltip/>

      <el-table-column label="供应商简称" prop="sellerName" show-overflow-tooltip/>

      <el-table-column label="电话" prop="sellerTelephone" show-overflow-tooltip/>

      <el-table-column align="center" width="80" label="SKU数" prop="skuCount" />

      <el-table-column align="center" label="金额" prop="netTotalAmount" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.netTotalAmount | moneyFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="100" label="修改人" prop="updateUserId" show-overflow-tooltip/>

      <el-table-column align="center" width="150" label="订单时间" prop="orderCreateTime">
        <template slot-scope="scope">
          {{scope.row.orderCreateTime | timeFmt}}
        </template>
      </el-table-column>

      <!--<el-table-column align="center" width="100" label="状态" prop="orderStatus">-->
        <!--<template slot-scope="{row}">-->
          <!--<el-tag :type="(row.orderStatus === 1) ? 'danger' : 'primary'" size="mini">{{row.orderStatus |-->
            <!--customStatusFmt}}-->
          <!--</el-tag>-->
        <!--</template>-->
      <!--</el-table-column>-->

      <el-table-column align="center" label="操作" width="180" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!--<el-button type="primary" size="mini" class="export" @click="openDetail('detail',row)">查看</el-button>-->
          <el-button type="primary" size="mini" class="export table-btn-width" @click="goRouter(0, scope.row.bid)">查看</el-button>
          <el-button type="warning" size="mini" class="table-btn-width" @click="openDetail('edit', scope.row)">付款记录</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize"
                @pagination="getDataList"></Pagination>

    <el-dialog :visible.sync="detailModal" :title="dialogType==='detail'?'采购订单付款详情': '采购订单付款编辑'"
               :close-on-click-modal="false" center width="950px">
      <el-form ref="editForm" :model="editForm" label-width="120px" size="small" class="edit-form">
        <el-row>
          <el-col :span="14">
            <el-form-item label="采购订单号">
              {{editForm.purchaseNo}}
            </el-form-item>
          </el-col>
          <!--<el-col :span="8">-->
            <!--<el-form-item label="销售订单号">-->
              <!--{{editForm.salesOrderNo}}-->
            <!--</el-form-item>-->
          <!--</el-col>-->
          <el-col :span="9">
            <el-form-item label="订单日期">
              {{editForm.orderCreateTime | timeFmt}}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="padding-top: 30px">
        <div style="float:left; line-height: 34px;">
          <span style="padding-right: 500px">付款凭证：</span>
          <span>当前待付款：{{surplusAmount}}</span>
        </div>
        <div class="divright" v-if="dialogType !== 'detail'">
          <el-button type="primary" size="small" @click="addPayment(editForm.bid,editForm.orderCurrency)">新增</el-button>
          <el-button type="danger" size="small" @click="deleteListByIds()">删除</el-button>
        </div>
      </div>
      <el-table
        :data="paymentList"
        border
        fit
        style="margin: 10px 0"
        size="small"
        :header-cell-style="{background: '#a7bfee'}"
        @selection-change="getPaymentSelect">
        <el-table-column
          align="center"
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column align="center" label="序号" width="55" type="index" />
        <el-table-column align="center" label="付款时间" prop="paymentTime" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.paymentTime | timeFmt}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="币种" prop="paymentCurrency" show-overflow-tooltip/>
        <el-table-column align="center" label="金额" prop="paymentAmount" show-overflow-tooltip/>
        <el-table-column align="center" label="凭证" prop="attachmentName" show-overflow-tooltip/>
        <el-table-column align="center" label="操作" width="180">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" class="export" @click="openPaymentDetail(row)">查看</el-button>
            <el-button type="primary" size="mini" class="export" @click="exportPactFile(row)">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
      <Pagination :total="paymentData.total" :page.sync="paymentData.pageNum" :limit.sync="paymentData.pageSize"
                  @pagination="getListPaymentProofByIdFun(paymentData.purchaseOrderBId)"></Pagination>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="detailModal=false">关闭</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="addModel" title="新增付款记录" width="500px" :close-on-click-modal="false" center @closed="clearData">
      <el-form ref="addPanyment" :model="paymentForm" label-width="100px" label-position="right" inline size="small"
               :rules="panymentRules">
        <el-form-item label="付款时间" prop="paymentTime">
          <el-date-picker
            v-model="paymentForm.paymentTime"
            type="datetime"
            style="width: 300px"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="付款币种" prop="paymentCurrency">
          <el-input v-model="paymentForm.paymentCurrency" clearable readonly
                    class="form-dialog-width"/>
        </el-form-item>
        <el-form-item label="付款金额" prop="paymentAmount">
          <el-input v-model.number="paymentForm.paymentAmount" clearable placeholder="请输入付款金额" type="number" size="small" class="form-dialog-width"/>
        </el-form-item>
        <el-form-item label="凭证">
          <el-upload
            class="upload-demo"
            ref="upload"
            :limit="1"
            :on-exceed="handleExceed"
            :action="uploadActionUrl"
            :headers="upLoadHeaders"
            :on-success="handleSuccess"
            :on-remove="handleRemove"
            :before-upload="beforeUpload"
            :file-list="filesList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能是 pdf、doc、docx格式，且不超过10M</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="备注" prop="paymentRemarks">
          <el-input v-model="paymentForm.paymentRemarks" type="textarea" :rows="5" clearable placeholder="字数不超过100个" class="form-dialog-width"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" :loading="addLoading" @click="addPaymentModel('addPanyment')">提交</el-button>
        <el-button type="danger" size="small" @click="addModel=false">关闭</el-button>
      </div>
    </el-dialog>

    <!--凭证详情-->
    <el-dialog :visible.sync="detailPayment" title="付款记录详情" width="500px" :close-on-click-modal="false" center @closed="clearData">
      <el-form ref="addPanyment" :model="paymentForm" label-width="100px" label-position="right" inline size="small"
               :rules="panymentRules">
        <el-form-item label="付款时间" prop="paymentTime">
          <el-date-picker
            v-model="paymentForm.paymentTime"
            disabled
            type="datetime"
            style="width: 300px"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="付款币种" prop="paymentCurrency">
          <el-input v-model="paymentForm.paymentCurrency" clearable readonly
                    class="form-dialog-width"/>
        </el-form-item>
        <el-form-item label="付款金额" prop="paymentAmount">
          <el-input v-model="paymentForm.paymentAmount" clearable readonly placeholder="请输入付款金额" class="form-dialog-width"/>
        </el-form-item>
        <el-form-item label="凭证">
          <el-upload
            class="upload-demo"
            ref="upload"
            disabled
            :limit="1"
            :on-exceed="handleExceed"
            :action="uploadActionUrl"
            :headers="upLoadHeaders"
            :on-success="handleSuccess"
            :on-remove="handleRemove"
            :before-upload="beforeUpload"
            :file-list="filesList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能是 pdf、doc、docx格式，且不超过10M</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="备注" prop="paymentRemarks">
          <el-input v-model="paymentForm.paymentRemarks" readonly type="textarea" :rows="5" clearable placeholder="字数不超过100个" class="form-dialog-width"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="detailPayment=false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { uploadActionUrl } from '@/api/common'
import { listpurchaseOrderApi, listPaymentProofByIdApi, selectSurplusAmountApi, savePaymentProofApi, deletePaymentProofsApi } from '@/api/order'
import { deepClone, parseTime } from '@/utils/index'
import { getToken } from '@/utils/auth'
import moneyFmt from '@/mixin/moneyFmt'

export default {
  components: {
    Pagination
  },
  mixins: [moneyFmt],
  filters: {
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
    },
    customStatusFmt(val) {
      switch (Number(val)) {
        case 0:
          return '编辑中';
        case 1:
          return '待报价';
        case 2:
          return '审批中';
        case 3:
          return '已报价';
        case 4:
          return '重新待报价';
        case 5:
          return '重新待审批';
        case 6:
          return '已重新报价';
        case 7:
          return '废弃';
        case 8:
          return '拒绝报价';
        case 9:
          return '审批通过';
        case 10:
          return '审批不通过';
        case 11:
          return '重新审批通过';
        case 12:
          return '重新审批不通过';
        case 13:
          return '报价中';
        case 14:
          return '重新报价中';
        default:
          return '数据异常';
      }
    }
  },
  data() {
    return {
      selectList: [],
      selectPaymentList: [],
      idsForm: {
        ids: ''
      },
      uploadActionUrl,
      rangeTime: [],
      dataList: [],
      paymentList: [],
      filesList: [],
      listLoading: true,
      detailModal: false,
      addModel: false,
      detailPayment: false,
      addLoading: false,
      dialogType: '',
      paymentType: '',
      editForm: {},
      paymentForm: {
        paymentTime: '',
        paymentCurrency: '',
        paymentAmount: '',
        paymentRemarks: '',
        attachmentName: '',
        attachmentPath: '',
        purchaseOrderBId: ''
      },
      surplusAmount: 0, // 剩余待付金额
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        edate: '',
        orderStatus: '',
        purchaseNo: '',
        sdate: '',
        sellerCode: '',
        sellerName: '',
        salesOrderNo: ''
      },
      paymentData: {
        pageNum: 1,
        pageSize: 5,
        total: 0,
        purchaseOrderBId: ''
      },
      customTime: [],
      modalList: [],
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
      orderStatusList: [
        // 采购订单状态(0-作废,1-编辑中,2-审核中,3-审核驳回,4-待确认,5-已确认)
        {
          label: '作废',
          orderStatus: 0
        },
        {
          label: '编辑中',
          orderStatus: 1
        },
        {
          label: '审核中',
          orderStatus: 2
        },
        {
          label: '审核驳回',
          orderStatus: 3
        },
        {
          label: '待确认',
          orderStatus: 4
        },
        {
          label: '已确认',
          orderStatus: 5
        }
      ],
      upLoadHeaders: {
        token: getToken()
      },
      panymentRules: {
        paymentTime: [
          { required: true, message: '付款时间不为空', trigger: 'blur' }
        ],
        paymentAmount: [
          { required: true, message: '付款金额不为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getDataList();
  },
  methods: {
    goRouter(type, id) {
      let path = type === 1 ? '/order/purchase/editPurchaseOrder' : '/order/purchase/detailPurchaseOrder';
      this.$router.push({
        path: path,
        query: {
          id: id,
          type: type
        }
      });
    },
    searchData() {
      this.postData.pageNum = 1;
      this.getDataList()
    },
    getDataList() {
      let obj = {
        pageNum: this.postData.pageNum,
        pageSize: this.postData.pageSize,
        edate: this.postData.edate,
        orderStatus: 5,
        purchaseNo: this.postData.purchaseNo,
        sdate: this.postData.sdate,
        sellerCode: this.postData.sellerCode,
        sellerName: this.postData.sellerName,
        salesOrderNo: this.postData.salesOrderNo
      };
      // for (let key in this.postData) {
      //   if (this.postData[key] !== '') {
      //     obj[key] = this.postData[key]
      //   }
      // }
      console.log(this.$route.query.supplierBId)
      if (this.$route.query.supplierBId) {
        obj.supplierBId = this.$route.query.supplierBId
      }
      listpurchaseOrderApi(obj).then(res => {
        this.dataList = res.data.list;
        this.postData.total = res.data.total;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message(err.message);
      });
    },
    // 分页查询-通过采购订单bid获取相关付款凭证数据列表
    getListPaymentProofByIdFun() {
      let data = {
        pageNum: this.paymentData.pageNum,
        pageSize: this.paymentData.pageSize,
        // purchaseOrderBId: row.bid
        purchaseOrderBId: this.paymentData.purchaseOrderBId
      };
      listPaymentProofByIdApi(data).then(res => {
        this.paymentList = res.data.list;
        this.paymentData.total = res.data.total;
        this.detailModal = true;
      }).catch(err => {
        this.detailModal = true;
        this.$message(err.message);
      });
    },
    // 通过采购bid获取当前付款金额
    selectSurplusAmountFun() {
      selectSurplusAmountApi({ purchaseOrderBId: this.paymentData.purchaseOrderBId }).then(res => {
        this.detailModal = true;
        this.surplusAmount = res.data;
      });
    },
    // 查看详情
    openDetail(type, row) {
      this.dialogType = type;
      this.editForm = deepClone(row);
      if (type === 'detail') {
        this.filesList = row.filesList;
      }
      // 获取bid
      this.paymentData.purchaseOrderBId = row.bid;
      this.selectSurplusAmountFun();
      this.getListPaymentProofByIdFun(); // 根据采购订单bid获取相应的凭证列表
      this.detailModal = true;
    },
    // 通过采购bid新增凭证数据
    addPayment(bid, orderCurrency) {
      this.paymentForm.purchaseOrderBId = bid;
      this.paymentForm.paymentCurrency = orderCurrency;
      console.info("this.paymentForm.purchaseOrderBId ==========> " + this.paymentForm.purchaseOrderBId);
      console.info("this.paymentForm.paymentCurrency ==========> " + this.paymentForm.paymentCurrency);
      this.addModel = true;
    },
    // 通过采购bid查看凭证详情
    openPaymentDetail(row) {
      this.paymentForm = deepClone(row);
      if (this.paymentForm.attachmentPath) {
        this.filesList = [{ name: this.paymentForm.attachmentName, url: this.paymentForm.attachmentPath }];
      }
      this.detailPayment = true;
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
    // 清空数据
    clearData() {
      this.paymentForm.paymentTime = '';
      this.paymentForm.paymentCurrency = '';
      this.paymentForm.paymentAmount = '';
      this.paymentForm.paymentRemarks = '';
      this.paymentForm.attachmentName = '';
      this.paymentForm.attachmentPath = '';
      this.filesList = [];
    },
    addPaymentModel(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          savePaymentProofApi(this.paymentForm).then(res => {
            this.$message.success(res.message);
            this.$refs[formName].resetFields();
            this.addModel = false;
            // this.detailModal = true;
            this.getListPaymentProofByIdFun();
            this.selectSurplusAmountFun();
          }).catch(err => {
            this.$message.error(err.message);
            this.addModel = false;
            // this.detailModal = true;
          });
        } else {
          this.$message.warning('验证未通过');
          return false;
        }
      });
    },
    // 下载协议
    exportPactFile(row) {
      window.open(row.attachmentPath)
    },
    // 上传文件删除
    handleRemove(file, filesList) {
      this.paymentForm.attachmentName = '';
      this.paymentForm.attachmentPath = '';
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制为 1 个文件`);
    },
    // 上传成功
    handleSuccess(res, file, filename) {
      this.paymentForm.attachmentName = file.name;
      this.paymentForm.attachmentPath = res.data.filePath;
    },
    // 上传之前限制
    beforeUpload(file) {
      for (let i = 0; i < this.filesList.length; i++) {
        if (this.filesList[i].attachmentName === file.name) {
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
    },
    // 批量删除凭证
    deleteListByIds() {
      if (!this.selectPaymentList.length) {
        return this.$message('请选择数据');
      }
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.idsForm.ids = this.selectPaymentList.map(e => {
          return e.id;
        }).join(',');
        let formData = new FormData();
        formData.append("ids", this.idsForm.ids);
        deletePaymentProofsApi(formData).then(res => {
          if (res.status === 200) {
            this.$message.success('操作成功!');
          }
          this.detailModal = true;
          this.getListPaymentProofByIdFun();
          this.selectSurplusAmountFun();
        }).catch(err => {
          this.detailModal = true;
          this.$message.error(err.message);
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    },
    // 多选
    getSelect(selects) {
      this.selectList = selects;
    },
    // 凭证多选
    getPaymentSelect(selectsPayment) {
      this.selectPaymentList = selectsPayment;
    }
  }
}
</script>

<style lang="scss">
  @import '~@/styles/variables.scss';

  .paymentProof {
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
    .table-goods {
      display: flex;
      display: -webkit-flex;
      .goods-img {
        width: 90px;
        height: 90px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .goods-text {
        margin-left: 10px;
        flex: 1;
        display: flex;
        display: -webkit-flex;
        flex-direction: column;
        justify-content: space-around;
        text-align: left;
        > div {
          font-size: 12px;
        }
      }
    }
    .divright {
      text-align: right;
    }
    .divleft {
      width: 120px;
      color: #606266;
      padding: 0px 12px 0 0;
    }
  }
</style>
