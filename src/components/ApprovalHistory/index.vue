<template>
  <div class="approval-history">
    <div class="history-title">审核记录：</div>
    <el-table
      :data="list"
      border
      fit
      size="small"
      max-height="200"
      :header-cell-style="{background: '#a7bfee'}">
      <el-table-column
        align="center"
        type="index"
        label="序号"
        width="55">
      </el-table-column>

      <el-table-column align="center" width="150" label="审核人" prop="processBy" show-overflow-tooltip/>

      <el-table-column align="center" width="180" label="审核时间" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.createTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="180" label="审核结果" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.processStatus | statusName}}
        </template>
      </el-table-column>

      <el-table-column align="center" label="审核意见" prop="processRemarks" show-overflow-tooltip/>
    </el-table>
  </div>
</template>

<script>
import { parseTime } from '@/utils/index'
import { getApprovalHistoryList } from '@/api/system';
export default {
  name: 'ApprovalFlow',
  data() {
    return {
      loading: false,
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
.approval-history {
  margin: 20px 0;
  .history-title {
    line-height: 1.5rem;
  }
}
</style>
