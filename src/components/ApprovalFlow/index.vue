<template>
  <div class="approval-flow">
    <div class="history-title">审核记录：</div>
    <el-table
      :data="list"
      border
      fit
      size="small"
      :header-cell-style="{background: '#a7bfee'}">
      <el-table-column
        align="center"
        type="index"
        label="序号"
        width="55">
      </el-table-column>

      <el-table-column align="center" width="150" label="审核人" prop="processBy" />

      <el-table-column align="center" width="180" label="审核时间">
        <template slot-scope="scope">
          {{scope.row.createTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="180" label="审核结果">
        <template slot-scope="scope">
          {{scope.row.processStatus | statusName}}
        </template>
      </el-table-column>

      <el-table-column align="center" label="审核意见" prop="processRemarks"/>
    </el-table>
    <el-form ref="opinionForm" :model="opinionForm" :rules="opinionFormRules" label-width="100px" size="small" style="margin: 30px 0">
      <el-form-item label="审核意见" prop="opinion">
        <el-input v-model="opinionForm.opinion" type="textarea" :autosize="{ minRows: 5, maxRows: 6}" clearable placeholder="请输入审核意见" style="width: 85%"/>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button type="primary" :loading="loading" @click="onSubmit('opinionForm', 0)">驳回修改</el-button>
        <el-button type="primary" :loading="loading" @click="onSubmit('opinionForm', 1)">审核通过</el-button>
        <el-button type="danger" @click="goBack">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { parseTime } from '@/utils/index'
import { getApprovalHistoryList, approvalFlow } from '@/api/system';
export default {
  name: 'ApprovalFlow',
  data() {
    return {
      loading: false,
      opinionForm: {
        opinion: ''
      },
      opinionFormRules: {
        opinion: [{ required: true, message: '请输入审核意见', trigger: 'blur' }]
      },
      list: []
    }
  },
  created() {
    this.getApprovalHistoryList()
  },
  methods: {
    getApprovalHistoryList() {
      let date = {
        receiptBId: this.$route.query.id
      };
      getApprovalHistoryList(date).then(res => {
        this.list = res.data || [];
      })
    },
    goBack() {
      this.$emit('close')
    },
    onSubmit(formName, status) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true;
          let obj = {
            processRemarks: this.opinionForm.opinion,
            processStatus: status,
            approvalBId: this.$route.query.approvalBid,
            receiptBId: this.$route.query.id,
            nodeBId: this.$route.query.approvalNodeBid,
            approvalProcessBid: this.$route.query.processBid
          };
          approvalFlow(obj).then(res => {
            this.$message.success('审核完成');
            this.loading = false;
            this.$emit('close')
          }).catch(err => {
            this.loading = false;
            this.$message.error(err.message)
          })
        } else {
          this.$message.warning('请填写审核意见')
        }
      })
    }
  },
  filters: {
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
    },
    statusName(val) {
      switch (Number(val)) {
        case 0: return '驳回修改';
        case 1: return '审核通过';
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables.scss';
.approval-flow {
  .history-title {
    border-top: 1px solid $border-light-color;
    height: 30px;
    line-height: 30px;
    padding-left: 20px;
  }
}
</style>
