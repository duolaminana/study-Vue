<template>
  <div class="app-container financingProduct">
    <div class="search-box">
      <el-form label-width="160px" inline size="small">
        <el-form-item :label="$t('finance.financeProduct.code')">
          <el-input v-model="postData.financingProductCode" clearable placeholder="financing product code" style="width: 200px"/>
        </el-form-item>
        <el-form-item :label="$t('finance.financeProduct.name')">
          <el-input v-model="postData.financingProductName" clearable placeholder="financing product name" style="width: 200px"/>
        </el-form-item>
        <el-form-item :label="$t('common.status')">
          <el-select v-model="postData.status" clearable placeholder="status" style="width: 200px">
            <el-option v-for="(item, index) in statusList" :label="language === 'zh' ? item.labelZh : item.label" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchData">{{$t('common.search')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="openDialog('add')">{{$t('common.add')}}</el-button>
      <el-button type="primary" size="small" @click="deleteClick()">{{$t('common.delete')}}</el-button>
      <!--<el-button type="primary" size="small" class="export">{{$t('common.export')}}</el-button>-->
    </div>
    <el-table
      v-loading="listLoading"
      :data="dataList"
      element-loading-text="loading。。。"
      border
      fit
      size="mini"
      :header-cell-style="{background: '#a7bfee'}" @selection-change="getSelect1">
      <el-table-column
        align="center"
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column :label="$t('finance.financeProduct.code')" prop="financingProductCode" show-overflow-tooltip/>

      <el-table-column :label="$t('finance.financeProduct.name')" prop="financingProductName" show-overflow-tooltip/>

      <el-table-column align="center" width="150" :label="$t('common.table.updateBy')" prop="updateUserId" show-overflow-tooltip/>

      <el-table-column align="center" width="160" :label="$t('common.table.updateTime')" prop="createTime">
        <template slot-scope="scope">
          {{scope.row.updateTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="100" :label="$t('common.table.status')" prop="roleStatus">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 1 ? 'primary' : 'danger' " size="mini">
            {{ scope.row.status === 1 ? $t('common.table.inUse') : $t('common.table.disabled') }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('common.table.actions')" width="265px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" class="export table-btn-width" @click="openDetail(row)">{{$t('common.table.view')}}</el-button>
          <el-button type="primary" size="mini" class="table-btn-width" @click="openDialog('edit', row)">{{$t('common.table.edit')}}</el-button>
          <el-button :type="row.status === 1 ? 'info' : 'danger'" size="mini" class="table-btn-width" @click="changeStatus(row)">
            {{row.status === 1 ? $t('common.table.disable') : $t('common.table.enable')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList"></Pagination>

    <el-dialog :visible.sync="addModel" :title="dialogType === 'add' ? $t('finance.financeProduct.add') : $t('finance.financeProduct.edit')"
               width="600px" center @close="clearData('addForm')">
      <el-tabs v-model="activeName">
        <el-tab-pane :label="$t('finance.financeProduct.basic')" name="1">
          <el-form ref="addForm" :model="addForm" label-width="165px" label-position="right" size="small" style="margin-top: 15px" :rules="addFormRules">
            <el-form-item :label="$t('finance.financeProduct.code')" prop="financingProductCode">
              <el-input v-model="addForm.financingProductCode" clearable placeholder="product code" class="form-dialog-width"/>
            </el-form-item>
            <el-form-item :label="$t('finance.financeProduct.name')" prop="financingProductName">
              <el-input v-model="addForm.financingProductName" clearable placeholder="finance product" class="form-dialog-width"/>
            </el-form-item>
            <div style="text-align: center;margin: 30px 0">
              <el-button type="primary" size="small" :loading="addLoading" @click="submitClick('addForm', !addForm.bid ? 1 : 2)">
                {{$t('common.buttonText.save')}}
              </el-button>
              <el-button type="danger" size="small" @click="addModel = false">{{$t('common.buttonText.close')}}</el-button>
            </div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane :label="$t('finance.financeProduct.channelList')" name="2" v-if="addForm.bid">
          <div style="text-align: right">
            <el-button type="primary" size="mini" @click="openChannelDialog">{{$t('finance.financeProduct.addFrom')}}</el-button>
          </div>
          <el-table
            :data="productChannelList"
            border
            fit
            style="margin: 10px 0"
            size="mini"
            :header-cell-style="{background: '#a7bfee'}">
            <el-table-column
              align="center"
              type="index"
              width="55">
            </el-table-column>

            <el-table-column align="center" :label="$t('finance.financeChannel.code')" prop="instituteName"/>

            <el-table-column align="center" :label="$t('finance.financeChannel.name')" prop="instituteName"/>
          </el-table>
          <div style="text-align: center;margin: 30px 0">
            <el-button type="danger" size="small" @click="addModel = false">{{$t('common.buttonText.close')}}</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <el-dialog :visible.sync="detailModal" :title="$t('finance.financeProduct.detail')" width="600px" center>
      <el-tabs v-model="activeName">
        <el-tab-pane :label="$t('finance.financeProduct.basic')" name="1">
          <el-form label-width="160px" label-position="right" size="small" style="margin-top: 15px">
            <el-form-item :label="$t('finance.financeProduct.code')" prop="financingProductCode">
              <el-input v-model="detailData.financingProductCode" disabled placeholder="product code" class="form-dialog-width"/>
            </el-form-item>
            <el-form-item :label="$t('finance.financeProduct.name')" prop="financingProductName">
              <el-input v-model="detailData.financingProductName" disabled placeholder="finance product" class="form-dialog-width"/>
            </el-form-item>
            <div style="text-align: center;margin: 30px 0">
              <el-button type="danger" size="small" @click="detailModal = false">{{$t('common.buttonText.close')}}</el-button>
            </div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane :label="$t('finance.financeProduct.channelList')" name="2">
          <el-table
            :data="productChannelList"
            border
            fit
            style="margin: 10px 0"
            size="mini"
            :header-cell-style="{background: '#a7bfee'}">
            <el-table-column
              align="center"
              type="index"
              width="55">
            </el-table-column>

            <el-table-column align="center" :label="$t('finance.financeChannel.code')" prop="instituteCode"/>

            <el-table-column align="center" :label="$t('finance.financeChannel.name')" prop="instituteName"/>

          </el-table>
          <div style="text-align: center;margin: 30px 0">
            <el-button type="danger" size="small" @click="detailModal = false">{{$t('common.buttonText.close')}}</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <el-dialog
      width="800px"
      center
      title="Select the Channels"
      :close-on-click-modal="false"
      :visible.sync="addChannelModal"
      append-to-body>
      <div class="search-box">
        <el-form label-width="160px" label-position="right" inline size="small">
          <el-form-item :label="$t('finance.financeChannel.name')">
            <el-input v-model="channelPostData.instituteName" clearable placeholder="channel name" style="width: 200px"/>
          </el-form-item>
          <el-form-item style="float:right;">
            <el-button type="primary" class="export" @click="searchChannel">{{$t('common.search')}}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="channelList"
        v-loading="channelLoading"
        border
        fit
        style="margin: 10px 0"
        size="mini"
        :header-cell-style="{background: '#a7bfee'}"
        @selection-change="getSelect">
        <el-table-column
          align="center"
          type="selection"
          width="55">
        </el-table-column>

        <el-table-column align="center" :label="$t('finance.financeChannel.code')" prop="instituteCode"/>

        <el-table-column align="center" :label="$t('finance.financeChannel.name')" prop="instituteName"/>

      </el-table>

      <Pagination :total="channelPostData.total" :page.sync="channelPostData.pageNum" :limit.sync="channelPostData.pageSize" @pagination="getChannelList"/>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="addChannelToProduct">{{$t('common.add')}}</el-button>
        <el-button type="danger" size="small" @click="addChannelModal=false">{{$t('common.buttonText.cancel')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import {
  financeProduct,
  addFinanceProduct,
  updateFinanceProduct,
  delBatchFinanceProduct,
  enableFinanceProduct,
  financeChannel,
  getFinanceChannelByProduct,
  addFinanceChannelByProduct
} from '@/api/finance'
import { deepClone, parseTime } from '@/utils/index'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      listLoading: true,
      addLoading: false,
      channelLoading: false,
      addModel: false,
      detailModal: false,
      addChannelModal: false,
      activeName: '1',
      dialogType: '',
      newRoleName: '',
      detailData: {},
      addForm: {
        financingProductCode: '',
        financingProductName: ''
      },
      addFormRules: {
        financingProductCode: [
          { required: true, message: 'Please fill in financing product code', trigger: 'blur' }
        ],
        financingProductName: [
          { required: true, message: 'Please fill in financing product name', trigger: 'blur' }
        ]
      },
      channelList: [],
      productChannelList: [],
      selectList: [],
      selectList1: [],
      channelPostData: {
        instituteName: '',
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        financingProductCode: '',
        financingProductName: '',
        status: ''
      },
      statusList: [
        {
          labelZh: '使用中',
          label: 'Active',
          id: 1
        },
        {
          labelZh: '已禁用',
          label: 'Disabled',
          id: 0
        }
      ],
      dataList: []
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    clearData() {
      this.$refs['addForm'].resetFields();
    },
    searchData() {
      this.postData.pageNum = 1;
      this.getDataList()
    },
    searchChannel() {
      this.channelPostData.pageNum = 1;
      this.getChannelList()
    },
    getDataList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      financeProduct(obj).then(res => {
        this.dataList = res.data.list || [];
        this.postData.total = res.data.total;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message)
      });
    },
    openDialog(type, row) {
      this.activeName = '1';
      this.dialogType = type;
      if (type === 'edit') {
        this.addForm = deepClone(row);
        this.getChannelListByBId(row.bid)
      }
      this.addModel = true;
    },
    openDetail(row) {
      this.activeName = '1';
      this.detailData = deepClone(row);
      this.getChannelListByBId(row.bid);
      this.detailModal = true;
    },
    openChannelDialog() {
      this.addChannelModal = true;
      this.getChannelList()
    },
    getChannelListByBId(id) {
      getFinanceChannelByProduct({ bid: id }).then(res => {
        this.productChannelList = res.data || [];
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    getChannelList() {
      let obj = {};
      for (let key in this.channelPostData) {
        if (this.channelPostData[key] !== '') {
          obj[key] = this.channelPostData[key]
        }
      }
      this.channelLoading = true;
      financeChannel(obj).then(res => {
        this.channelList = res.data.list || [];
        this.channelPostData.total = res.data.total;
        this.channelLoading = false;
      }).catch(err => {
        this.channelLoading = false;
        this.$message.error(err.message)
      });
    },
    addChannelToProduct() {
      if (!this.selectList.length) {
        return this.$message.warning('Please choose the channel data')
      }
      let obj = {
        productBid: this.addForm.bid,
        instituteBids: this.selectList.map(e => e.bid)
      };
      addFinanceChannelByProduct(obj).then(res => {
        this.$message.success('Add Success');
        this.getChannelListByBId(this.addForm.bid);
        this.addChannelModal = false;
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    submitClick(formName, type) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let api = type === 1 ? addFinanceProduct : updateFinanceProduct;
          this.addLoading = true;
          api(this.addForm).then(res => {
            this.$message.success(type === 1 ? 'Add Success' : 'Update Success');
            this.addForm.bid = type === 1 ? res.data : this.addForm.bid;
            this.postData.pageNum = 1;
            this.addLoading = false;
            this.getDataList();
          }).catch(err => {
            this.addLoading = false;
            this.$message.error(err.message)
          });
        }
      })
    },
    changeStatus(row) {
      let obj = {
        id: row.id,
        type: row.status === 1 ? 0 : 1
      };
      enableFinanceProduct(obj).then(res => {
        this.$message.success('Change Success');
        this.getDataList();
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    deleteClick() {
      if (!this.selectList1.length) {
        return this.$message.warning('请选择需要删除的数据');
      }
      this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        let obj = { ids: this.selectList1.map(e => e.id).join(',') };
        delBatchFinanceProduct(obj).then(res => {
          this.getDataList();
          this.$message.success('Delete Success');
        }).catch(err => {
          this.$message.error(err.message)
        });
      }).catch(() => {
      });
    },
    // 勾选触发 selects为选择的数据数组
    getSelect(selects) {
      this.selectList = selects
    },
    getSelect1(selects) {
      this.selectList1 = selects
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
