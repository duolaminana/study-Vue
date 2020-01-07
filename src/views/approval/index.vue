<template>
  <div class="app-container todo-list">
    <div class="search-box">
      <el-form label-width="90px" inline size="small">
        <el-form-item label="摘要内容">
          <el-input v-model="postData.businessName" clearable placeholder="请输入分类名称" style="width: 200px" />
        </el-form-item>
        <el-form-item label="事项类型">
          <el-select v-model="postData.businessType" clearable placeholder="请选择类型" style="width: 200px">
            <el-option label="供应商调价" :value="1"></el-option>
            <el-option label="销售调价" :value="2"></el-option>
            <el-option label="报价单审核" :value="3"></el-option>
            <el-option label="销售订单审核" :value="4"></el-option>
            <el-option label="采购订单审核" :value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="postData.processStatus" clearable placeholder="请选择状态" style="width: 200px">
            <el-option label="待处理" :value="1"></el-option>
            <el-option label="已处理" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchData">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      v-loading="listLoading"
      :data="dataList"
      element-loading-text="正在查询中。。。"
      border
      fit
      size="mini"
      :header-cell-style="{background: '#a7bfee'}">
      <el-table-column
        align="center"
        type="index"
        label="序号"
        width="55">
      </el-table-column>
      <el-table-column width="160" label="事件类型" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.businessType | businessName}}
        </template>
      </el-table-column>

      <el-table-column width="150" label="单号" prop="businessBid" show-overflow-tooltip/>

      <el-table-column label="摘要内容" prop="businessName" show-overflow-tooltip/>

      <el-table-column align="center" width="160" label="单号时间" prop="businessBid">
        <template slot-scope="scope">
          {{scope.row.createTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="90" label="状态" prop="roleStatus">
        <template slot-scope="scope">
          <el-tag :type="scope.row.processStatus === 1 ? 'primary' : 'danger' " size="mini">{{ scope.row.processStatus === 1 ? '待处理' : '已处理' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="80" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" v-if="row.processStatus === 1" class="export" size="mini" @click="goRouter(row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList"></Pagination>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import {
  getAgendaItemList,
  updateAgendaItem
} from '@/api/system'
import { parseTime } from '@/utils/index'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      listLoading: false,
      dataList: [],
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        precessStatus: '',
        businessType: '',
        businessName: ''
      }
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    searchData() {
      this.postData.pageNum = 1;
      this.getDataList();
    },
    getDataList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      getAgendaItemList(obj).then(res => {
        this.dataList = res.data.list || [];
        this.postData.total = res.data.total;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message)
      })
    },
    goRouter(item) {
      let path = '';
      switch (Number(item.businessType)) {
        case 1: path = '/price/approvalSupplierPrice'; break;
        case 2: path = '/price/approvalSalePrice'; break;
        case 3: path = '/query/quoteApproval'; break;
        case 4: path = '/order/sale/saleOrderApproval'; break;
        case 5: path = '/order/purchase/buyOrderApproval'; break;
        case 6: path = '/settlementFinance/sale/editPayRecord'; break;
      }
      if (path) {
        this.$router.push({
          path: path,
          query: {
            id: item.businessBid,
            approvalBid: item.approvalBid,
            agendaBid: item.bid,
            approvalNodeBid: item.approvalNodeBid,
            processBid: item.processBid
          }
        })
      }
      if (Number(item.businessType) === 6) {
        let obj = {
          id: item.id,
          processStatus: 2
        }
        // 做更新操作
        updateAgendaItem(obj).then(res => {
          console.info(res.data);
        }).catch(err => {
          this.$message.error(err.message)
        });
      }
    }
  },
  filters: {
    businessName(val) {
      switch (Number(val)) {
        case 1: return '供应商调价';
        case 2: return '销售调价';
        case 3: return '报价单审核';
        case 4: return '销售订单审核';
        case 5: return '采购订单审核';
        case 6: return '销售订单收款确认'
      }
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
.todo-list {
  .search-box {
    margin-bottom: 15px;
    border-bottom: 1px solid $border-light-color;
  }
  .topBtns {
    margin-bottom: 10px;
    text-align: right;
    .export {
      background: green;
      border: green;
    }
    button {
      margin: 0 10px;
    }
  }
}
</style>
