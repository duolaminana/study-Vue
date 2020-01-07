<template>
  <div class="app-container financingChannel">
    <div class="search-box">
      <el-form label-width="160px" inline size="small">
        <el-form-item :label="$t('finance.financeChannel.code')">
          <el-input v-model="postData.instituteCode" clearable placeholder="financing product code" style="width: 200px"/>
        </el-form-item>
        <el-form-item :label="$t('finance.financeChannel.name')">
          <el-input v-model="postData.instituteName" clearable placeholder="financing product name" style="width: 200px"/>
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
      <el-table-column :label="$t('finance.financeChannel.code')" prop="instituteCode" show-overflow-tooltip/>

      <el-table-column :label="$t('finance.financeChannel.name')" prop="instituteName" show-overflow-tooltip/>

      <el-table-column :label="$t('finance.financeChannel.contact')" prop="instituteContact" show-overflow-tooltip/>

      <el-table-column align="center" width="150" :label="$t('common.table.updateBy')" prop="updateUserId" show-overflow-tooltip/>

      <el-table-column align="center" width="160" :label="$t('common.table.updateTime')">
        <template slot-scope="scope">
          {{scope.row.updateTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('common.table.actions')" width="120px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" class="export" @click="openDetail(row)">{{$t('common.table.view')}}</el-button>
          <el-button type="primary" size="mini" @click="openDialog('edit', row)">{{$t('common.table.edit')}}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList"></Pagination>

    <el-dialog :visible.sync="addModel" :title="dialogType === 'add' ? $t('finance.financeChannel.add') : $t('finance.financeChannel.edit')"
               width="600px" center @close="clearData('addForm')">
      <el-form ref="addForm" :model="addForm" label-width="165px" label-position="right" size="small" style="margin-top: 15px" :rules="addFormRules">
        <el-form-item :label="$t('finance.financeChannel.code')" prop="instituteCode">
          <el-input v-model="addForm.instituteCode" clearable placeholder="channel code" class="form-dialog-width"/>
        </el-form-item>
        <el-form-item :label="$t('finance.financeChannel.name')" prop="instituteName">
          <el-input v-model="addForm.instituteName" clearable placeholder="channel name" class="form-dialog-width"/>
        </el-form-item>
        <el-form-item :label="$t('finance.financeChannel.contact')" prop="instituteContact">
          <el-input v-model="addForm.instituteContact" clearable placeholder="channel contact" class="form-dialog-width"/>
        </el-form-item>
        <el-form-item :label="$t('finance.financeChannel.phone')" prop="instituteContactNumber">
          <el-input v-model="addForm.instituteContactNumber" clearable placeholder="channel phone" class="form-dialog-width"/>
        </el-form-item>
        <el-form-item :label="$t('finance.financeChannel.address')" prop="instituteContactAddress">
          <el-input v-model="addForm.instituteContactAddress" clearable placeholder="channel address" class="form-dialog-width"/>
        </el-form-item>
        <el-form-item :label="$t('finance.financeProduct.name')" prop="productCheck">
          <el-checkbox-group v-model="addForm.productCheck" @change="getProductBId">
            <el-checkbox v-for="(item, index) in productList" :label="item.bid" :key="index">{{item.financingProductName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :label="$t('finance.financeChannel.annexe')" prop="fileCheck">
          <el-checkbox-group v-model="addForm.fileCheck" @change="getFileId">
            <el-checkbox v-for="(item, index) in fileList" :label="item.id" :key="index">{{item.labelZh}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center">
        <el-button type="primary" size="small" :loading="addLoading" @click="submitClick('addForm', !addForm.bid ? 1 : 2)">
          {{$t('common.buttonText.save')}}
        </el-button>
        <el-button type="danger" size="small" @click="addModel = false">{{$t('common.buttonText.close')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="detailModal" :title="$t('finance.financeChannel.detail')" width="600px" center>
      <el-form label-width="160px" label-position="right" size="small" style="margin-top: 15px">
        <el-form-item :label="$t('finance.financeChannel.code')">
          <el-input v-model="detailData.instituteCode" readonly placeholder="channel code" class="form-dialog-width"/>
        </el-form-item>
        <el-form-item :label="$t('finance.financeChannel.name')">
          <el-input v-model="detailData.instituteName" readonly placeholder="channel name" class="form-dialog-width"/>
        </el-form-item>
        <el-form-item :label="$t('finance.financeChannel.contact')">
          <el-input v-model="detailData.instituteContact" readonly placeholder="channel contact" class="form-dialog-width"/>
        </el-form-item>
        <el-form-item :label="$t('finance.financeChannel.phone')">
          <el-input v-model="detailData.instituteContactNumber" readonly placeholder="channel phone" class="form-dialog-width"/>
        </el-form-item>
        <el-form-item :label="$t('finance.financeChannel.address')">
          <el-input v-model="detailData.instituteContactAddress" readonly placeholder="channel address" class="form-dialog-width"/>
        </el-form-item>
        <el-form-item :label="$t('finance.financeProduct.name')">
          <el-checkbox-group v-model="detailData.productCheck" disabled>
            <el-checkbox v-for="(item, index) in productList" :label="item.bid" :key="index">{{item.financingProductName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :label="$t('finance.financeChannel.annexe')">
          <el-checkbox-group v-model="detailData.fileCheck" disabled>
            <el-checkbox v-for="(item, index) in fileList" :label="item.id" :key="index">{{item.labelZh}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center;margin: 30px 0">
        <el-button type="danger" size="small" @click="detailModal = false">{{$t('common.buttonText.close')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import {
  financeProduct,
  financeChannel,
  addFinanceChannel,
  updateFinanceChannel,
  delBatchFinanceChannel
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
      addModel: false,
      detailModal: false,
      addChannelModal: false,
      dialogType: '',
      newRoleName: '',
      detailData: {},
      addForm: {
        instituteName: '',
        instituteCode: '',
        instituteContact: '',
        instituteContactNumber: '',
        instituteContactAddress: '',
        attachmentCode: '',
        financingProductBids: '',
        productCheck: [],
        fileCheck: []
      },
      addFormRules: {
        instituteCode: [
          { required: true, message: 'Please fill in financing channel code', trigger: 'blur' }
        ],
        instituteName: [
          { required: true, message: 'Please fill in financing channel name', trigger: 'blur' }
        ],
        instituteContact: [
          { required: true, message: 'Please fill in financing channel contact', trigger: 'blur' }
        ],
        instituteContactNumber: [
          { required: true, message: 'Please fill in financing channel phone', trigger: 'blur' }
        ],
        instituteContactAddress: [
          { required: true, message: 'Please fill in financing channel address', trigger: 'blur' }
        ],
        productCheck: [
          { type: 'array', required: true, message: 'Please choose the financing product', trigger: 'change' }
        ],
        fileCheck: [
          { type: 'array', required: true, message: 'Please choose the file type', trigger: 'change' }
        ]
      },
      productList: [],
      selectList: [],
      selectList1: [],
      userListParam: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        instituteName: '',
        instituteCode: ''
      },
      fileList: [
        {
          labelZh: '合同',
          label: 'Active',
          id: 1
        },
        {
          labelZh: '提单原件(到付快递)',
          label: 'Disabled',
          id: 2
        },
        {
          labelZh: '清关证明',
          label: 'Active',
          id: 3
        },
        {
          labelZh: '形式发票',
          label: 'Disabled',
          id: 4
        },
        {
          labelZh: '海关申报表',
          label: 'Active',
          id: 5
        },
        {
          labelZh: '原产地证明',
          label: 'Disabled',
          id: 6
        },
        {
          labelZh: '保险单',
          label: 'Active',
          id: 7
        }
      ],
      dataList: []
    }
  },
  created() {
    this.getDataList();
    this.getProductList()
  },
  methods: {
    clearData() {
      this.$refs['addForm'].resetFields();
      this.addForm.fileCheck = [];
      this.addForm.productCheck = []
    },
    getProductBId(arr) {
      if (arr) {
        this.addForm.financingProductBids = this.addForm.productCheck.join(',')
      } else {
        this.addForm.financingProductBids = ''
      }
    },
    getFileId(arr) {
      if (arr) {
        this.addForm.attachmentCode = this.addForm.fileCheck.join(',')
      } else {
        this.addForm.attachmentCode = ''
      }
    },
    searchData() {
      this.postData.pageNum = 1;
      this.getDataList()
    },
    searchUser() {
      this.userListParam.pageNum = 1;
    },
    getDataList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      financeChannel(obj).then(res => {
        this.dataList = res.data.list || [];
        this.postData.total = res.data.total;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message)
      });
    },
    getProductList() {
      financeProduct({ pageNum: 1, pageSize: 999 }).then(res => {
        this.productList = res.data.list || [];
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    openDialog(type, row) {
      this.dialogType = type;
      if (type === 'edit') {
        this.addForm = Object.assign(this.addForm, row);
        if (this.addForm.attachmentCode) {
          this.addForm.fileCheck = this.addForm.attachmentCode.split(',').map(e => Number(e))
        }
        if (this.addForm.financingProductBids) {
          this.addForm.productCheck = this.addForm.financingProductBids.split(',')
        }
      }
      this.addModel = true;
    },
    openDetail(row) {
      this.detailData = deepClone(row);
      if (this.detailData.attachmentCode) {
        this.detailData.fileCheck = this.detailData.attachmentCode.split(',').map(e => Number(e))
      }
      if (this.detailData.financingProductBids) {
        this.detailData.productCheck = this.detailData.financingProductBids.split(',')
      }
      this.detailModal = true;
    },
    submitClick(formName, type) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let api = type === 1 ? addFinanceChannel : updateFinanceChannel;
          this.addLoading = true;
          api(this.addForm).then(res => {
            this.$message.success(type === 1 ? 'Add Success' : 'Update Success');
            this.postData.pageNum = 1;
            this.addLoading = false;
            this.addModel = false;
            this.getDataList();
          }).catch(err => {
            this.addLoading = false;
            this.$message.error(err.message)
          });
        }
      })
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
        delBatchFinanceChannel(obj).then(res => {
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
