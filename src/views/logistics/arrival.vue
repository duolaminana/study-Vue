<template>
  <div class="app-container stock">
    <div class="edit-title">{{$t('logistics.arrival.arrivalTitle')}}</div>
    <el-form ref="detailForm" :model="detailForm" label-width="190px" size="small" class="edit-form" v-loading="loading">
      <el-row class="row-item">
        <el-col :span="10">
          <el-form-item :label="$t('logistics.arrival.orderNo')">
            {{detailForm.orderNo}}
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('logistics.arrival.createTime')">
            {{detailForm.createTime | timeFmt}}
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('logistics.arrival.buyerName')">
            {{detailForm.buyerName}}
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item :label="$t('logistics.arrival.buyerCountryCode')">
            {{detailForm.buyerCountryCode}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="row-item">
        <el-col>
          <el-form-item :label="$t('logistics.arrival.OrderNodeProgress')">
            <order-step :list="allNodeList"></order-step>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="row-item">
        <div class="row-label" style="width: 100%">{{$t('logistics.arrival.arrivalCase')}}</div>
        <el-form ref="stockForm" :model="stockForm" label-width="190px" size="small" :rules="stockFormRules">
          <el-form-item :label="$t('logistics.arrival.currentCompletion')" prop="currentCompletion">
            <el-input-number v-model="stockForm.currentCompletion" controls-position="right" :min="0" :max="100" size="small" style="width: 200px"/> &nbsp;%
          </el-form-item>
          <el-form-item :label="$t('logistics.arrival.eventRemark')" prop="eventRemark">
            <el-input v-model="stockForm.eventRemark" :autosize="{ minRows: 3, maxRows: 5}" type="textarea" size="small" clearable style="width: 60%"/>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row class="row-item">
        <div style="padding-bottom: 10px;">
          <el-button type="primary" size="small" @click="addLogistic">{{$t('logistics.arrival.addLogistics')}}</el-button>
        </div>
        <div v-for="(logistic,index1) in logisticsOrderDetailList" :key="index1">
          <div>{{$t('logistics.arrival.logisticsInformation')}}{{index1 + 1}}</div>
          <el-col :span="24">
            <el-form-item :label="$t('logistics.arrival.logisticsOrderNo')">
              <el-input v-model="logistic.logisticsOrderNo" size="small" clearable style="width: 44%"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('logistics.arrival.destinationPort')">
              <el-input v-model="logistic.destinationPort" size="small" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('logistics.arrival.arriveDate')">
              <el-date-picker
                v-model="logistic.arriveDate"
                type="datetime"
                style="width: 270px"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item :label="$t('logistics.arrival.files')" style="width: 500px">
              <my-upload
                :accept="logistic"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                :file-list="logistic.logisticsTraceAttachmentsList">
              </my-upload>
            </el-form-item>
          </el-col>
        </div>
      </el-row>
      <el-form-item style="text-align: center;margin-top: 20px">
        <el-button type="primary" size="small" :loading="confirmLoading" @click="saveRecord('stockForm')">{{$t('common.buttonText.save')}}</el-button>
        <el-button type="danger" size="small" @click="goBack">{{$t('common.buttonText.back')}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import OrderStep from '@/components/OrderStep'
import MyUpload from '@/components/MyUpload'
import { saleOrderDetail, typeNodeSaleOrder, updateOrderFlowInfo, selectOrderWorkflowNodeBIdApi } from '@/api/order'
import { selectLogisticsOrderDetailList, saveLogisticsOrderDetail } from '@/api/logistic'
import { uploadActionUrl } from '@/api/common'
import { parseTime } from '@/utils/index'
import moneyFmt from '@/mixin/moneyFmt'
export default {
  components: {
    OrderStep,
    MyUpload
  },
  mixins: [moneyFmt],
  data() {
    return {
      uploadActionUrl,
      loading: false,
      confirmLoading: false,
      detailForm: {
        sellerBankAddress: '',
        sellerBranchName: '',
        buyerBankAddress: '',
        buyerBranchName: '',
        orderNo: '',
        createTime: '',
        buyerName: '',
        buyerCountryCode: ''
      },
      stockForm: {
        attachmentName: '',
        attachmentPath: '',
        attachmentUuid: '',
        eventRemark: '',
        currentCompletion: '',
        logisticsOrderNo: '',
        transportationMethod: '',
        vesselBookingNo: '',
        departurePort: '',
        destinationPort: '',
        shippingFlightNo: '',
        departureDate: '',
        arriveDate: '',
        etd: '',
        eta: '',
        workflowProcessBId: this.$route.query.bId,
        orderBId: this.$route.query.id
      },
      stockFormRules: {
        currentCompletion: [{ required: true, message: 'The completion ratio cannot be empty', trigger: 'blur' }],
        eventRemark: [{ required: true, message: 'The Remarks cannot be empty', trigger: 'blur' }]
      },
      allNodeList: [],
      recordList: [],
      payFileList: [],
      logisticsOrderDetailList: [
        {
          logisticsOrderNo: '',
          destinationPort: '',
          arriveDate: '',
          logisticsTraceAttachmentsList: [],
          workflowProcessBId: this.$route.query.bId,
          orderBId: this.$route.query.id
        }
      ],
      transportModeList: [
        // 1-汽运,2-铁路,3-海运,4-空运
        {
          label: '汽运',
          id: 1
        },
        {
          label: '铁路',
          id: 2
        },
        {
          label: '海运',
          id: 3
        },
        {
          label: '空运',
          id: 4
        }
      ]
    }
  },
  computed: {
    activeRoute() {
      let visitedViews = this.$store.state.tagsView.visitedViews;
      let activePath = visitedViews.filter(e => {
        return e.path === this.$route.path
      })[0];
      return activePath
    }
  },
  created() {
    this.getSaleOrderDetail(); // 销售订单详情
    this.getTypeNodeSaleOrder(); // 根据节点类型获取流程节点
    this.getLogisticsOrderDetailListFun(); // 根据销售订单bid获取物流订单详情列表数据
  },
  filters: {
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
    }
  },
  methods: {
    closePage() {
      this.$store.dispatch('delView', this.activeRoute).then(() => {
        this.$router.push({
          path: '/order/sale/saleOrder'
        })
      })
    },
    // 返回上一级
    goBack() {
      this.$router.go(-1);
      // this.$emit('close');
    },
    clearForm() {
      this.stockForm.attachmentName = '';
      this.stockForm.attachmentPath = '';
      this.stockForm.attachmentUuid = '';
      this.stockForm.eventRemark = '';
      this.stockForm.currentCompletion = '';
      this.stockForm.id = '';
      this.stockForm.bid = '';
    },
    addLogistic() {
      this.logisticsOrderDetailList.push({
        logisticsOrderNo: '',
        destinationPort: '',
        arriveDate: '',
        logisticsTraceAttachmentsList: [],
        workflowProcessBId: this.$route.query.bId,
        orderBId: this.$route.query.id
      })
    },
    // 上传文件组件方法：handleRemove、handleSuccess
    handleRemove(file, fileList, item) {
      item.logisticsTraceAttachmentsList = fileList.map(e => {
        e.logisticsOrderDetailBId = this.$route.query.id;
        e.attachmentName = e.attachmentName || e.name;
        e.attachmentPath = e.attachmentPath || e.response.data.filePath;
        return { ...e }
      })
    },
    handleSuccess(res, file, fileList, item) {
      item.logisticsTraceAttachmentsList = fileList.map(e => {
        e.logisticsOrderDetailBId = this.$route.query.id;
        e.attachmentName = e.attachmentName || e.name;
        e.attachmentPath = e.attachmentPath || e.response.data.filePath;
        return { ...e }
      });
    },
    // 保存按钮
    saveRecord(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.confirmLoading = true;
          let obj1 = {
            currentCompletion: this.stockForm.currentCompletion,
            eventRemark: this.stockForm.eventRemark,
            id: this.$route.query.nodeId,
            orderBId: this.$route.query.id
          };
          updateOrderFlowInfo(obj1).then(res => {
            this.confirmLoading = false;
            this.getTypeNodeSaleOrder()
          }).catch(err => {
            this.confirmLoading = false;
            this.$message.error(err.message)
          });

          saveLogisticsOrderDetail(this.logisticsOrderDetailList).then(res => {
            this.confirmLoading = false;
            this.$message.success('保存成功');
            this.clearForm();
            this.goBack();
          }).catch(err => {
            this.confirmLoading = false;
            this.$message.error(err.message)
          });
        } else {
          this.$message.warning('请填写完整')
        }
      });
    },
    // 根据节点类型获取流程节点
    getTypeNodeSaleOrder() {
      typeNodeSaleOrder({ orderBid: this.$route.query.id, nodeType: this.$route.query.type }).then(res => {
        this.allNodeList = res.data.workflowProcessList.map((e, index) => {
          e.currentCompletion = e.currentCompletion.toString();
          return { ...e }
        });
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    // 根据销售订单bid获取物流订单详情列表数据
    getLogisticsOrderDetailListFun() {
      // 根据销售订单bid和订单节点bid获取某个节点详情
      selectOrderWorkflowNodeBIdApi({ orderBId: this.$route.query.id, workflowNodeBId: this.$route.query.workflowId }).then(res => {
        this.stockForm.currentCompletion = res.data.currentCompletion;
        this.stockForm.eventRemark = res.data.eventRemark;
      }).catch(err => {
        this.$message.error(err.message)
      });
      // 根据销售订单bid获取物流订单详情列表数据
      selectLogisticsOrderDetailList({ orderBId: this.$route.query.id }).then(res => {
        this.logisticsOrderDetailList = res.data;
        this.logisticsOrderDetailList.forEach(e => {
          e.logisticsTraceAttachmentsList.map(t => {
            t.name = t.attachmentName;
            t.url = t.attachmentPath;
            return { ...e }
          })
        })
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    // 销售订单详情
    getSaleOrderDetail() {
      this.loading = true;
      saleOrderDetail({ orderBid: this.$route.query.id }).then(res => {
        this.detailForm = Object.assign(this.detailForm, res.data);
        this.loading = false;
      }).catch(err => {
        this.loading = false;
        this.$message.error(err.message)
      })
    }
  }
}
</script>

<style lang="scss">
  @import '~@/styles/variables.scss';
  .stock {
    width: 80%;
    margin: 0 auto;
    border: 1px solid $border-light-color;
    .edit-title {
      position: relative;
      text-align: center;
      height: 50px;
      line-height: 50px;
      font-size: 20px;
      font-weight: bold;
      border-bottom: 1px solid $border-light-color;
    }
    .edit-form {
      /*margin-top: 20px;*/
    }
    .row-item {
      padding: 10px 0;
      border-bottom: 1px solid $border-light-color;
    }
    .topBtns {
      margin-bottom: 10px;
      text-align: right;
      button {
        margin: 0 10px;
      }
    }
    .row-label {
      float: left;
      line-height: 32px;
      font-weight: bold;
    }
  }
</style>
