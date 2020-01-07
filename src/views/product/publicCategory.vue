<template>
  <div class="app-container category">
    <div class="search-box">
      <el-form label-width="130px" inline size="small">
        <el-form-item :label="$t('product.category.name')">
          <el-input v-model="postData.catalogName" clearable placeholder="Category Name" style="width: 200px" />
        </el-form-item>
        <el-form-item :label="$t('common.status')">
          <el-select v-model="postData.catalogStatus" clearable placeholder="status" style="width: 200px">
            <el-option v-for="(item, index) in statusList" :label="item.label" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchDataList">{{$t('common.search')}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="openSequenceCategory">{{$t('common.sort')}}</el-button>
      <el-button type="primary" size="small" @click="openDialog('add')">{{$t('common.add')}}</el-button>
      <el-button type="primary" size="small" @click="deleteCategory">{{$t('common.delete')}}</el-button>
      <!--<el-button type="primary" size="small" class="export">导出excel</el-button>-->
    </div>
    <el-table
      ref="listTable"
      v-loading="listLoading"
      :data="dataList"
      element-loading-text="load。。。"
      border
      fit
      size="mini"
      row-key="id"
      :indent="indent"
      :header-cell-style="{background: '#a7bfee'}"
      @selection-change="getSelect"
      @select="setChildSelect">
      <el-table-column
        align="center"
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column :label="$t('product.category.name')" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.catalogName}}
        </template>
      </el-table-column>

      <el-table-column :label="$t('product.category.code')" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.catalogCode}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="100px" :label="$t('common.table.updateBy')" prop="updateUserId" show-overflow-tooltip/>

      <el-table-column align="center" width="160px" :label="$t('common.table.updateTime')" prop="updateTime" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.updateTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="90" :label="$t('common.status')" prop="status">
        <template slot-scope="scope">
          <el-tag :type="scope.row.catalogStatus === 1 ? 'primary' : 'danger' " size="mini">
            {{ scope.row.catalogStatus === 1 ? $t('common.table.inUse') : $t('common.table.disabled') }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" :label="$t('common.table.actions')" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" class="export" @click="openDetail(row)">{{$t('common.table.view')}}</el-button>
          <el-button type="primary" size="mini" @click="openDialog('edit', row)">{{$t('common.table.edit')}}</el-button>
          <el-button :type="row.catalogStatus ===1 ? 'info' : 'danger'" size="mini" @click="changeStatus(row)">
            {{row.catalogStatus === 1 ? $t('common.table.disable') : $t('common.table.enable')}}
          </el-button>
          <!--<el-button v-if="row.catalogStatus !== 1" type="danger" size="mini" @click="deleteCategory(row)">删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList" ></Pagination>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='add'?$t('product.category.addCategory'):$t('product.category.editCategory')"
               center width="500px" @closed="clearData">
      <el-form ref="category" :model="formLine" label-width="130px" label-position="left" size="small" :rules="formLineRules">
        <el-form-item :label="$t('product.category.parentCategory')" prop="parentsName">
          <el-cascader
            class="form-dialog-width"
            v-model="formLine.parentsName"
            :options="addDataList"
            :props="{value: 'bid', label: 'catalogName', children: 'children'}"
            filterable
            clearable
            :placeholder="$t('product.category.search')"
            change-on-select
            @change="getParentId"
          ></el-cascader>
        </el-form-item>
        <el-form-item :label="$t('product.category.code')" prop="catalogCode">
          <el-input v-model="formLine.catalogCode" clearable :placeholder="$t('product.category.code')" class="form-dialog-width" />
        </el-form-item>
        <el-form-item :label="$t('product.category.name')" prop="catalogName">
          <el-input v-model="formLine.catalogName" clearable :placeholder="$t('product.category.name')" class="form-dialog-width" />
        </el-form-item>
        <el-form-item :label="$t('product.category.img')" prop="catalogImgUrl">
          <div class="avatar">
            <el-upload
              class="avatar-uploader"
              :action="uploadActionUrl"
              :show-file-list="false"
              :on-success="handleSuccess"
              :before-upload="beforeUpload">
              <img v-if="formLine.catalogImgUrl" :src="formLine.catalogImgUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <div style="font-size: 10px;text-align: center;color: red;padding-bottom: 5px;">{{$t('product.category.tips')}}</div>
          </div>
        </el-form-item>
        <el-form-item :label="$t('common.status')" prop="status" style="margin-top: 40px">
          {{ formLine.catalogStatus === 1 ? $t('common.table.inUse') : $t('common.table.disabled') }}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" :loading="confirmLoading" @click="confirmAdd('category')">{{$t('common.buttonText.confirm')}}</el-button>
        <el-button type="danger" size="small" @click="dialogVisible=false">{{$t('common.buttonText.cancel')}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogVisible1" :title="$t('product.category.categoryDetail')" center width="500px">
      <el-form ref="category" :model="formLine1" label-width="130px" label-position="left" size="small" :rules="formLineRules" @closed="clearData">
        <el-form-item :label="$t('product.category.parentCategory')" prop="parentsName">
          <el-cascader
            class="form-dialog-width"
            v-model="formLine1.parentsName"
            :options="addDataList"
            :props="{value: 'bid', label: 'catalogName', children: 'children'}"
            disabled
            change-on-select
          ></el-cascader>
        </el-form-item>
        <el-form-item :label="$t('product.category.code')" prop="catalogCode">
          <el-input v-model="formLine1.catalogCode" readonly :placeholder="$t('product.category.code')" class="form-dialog-width" />
        </el-form-item>
        <el-form-item :label="$t('product.category.name')" prop="catalogName">
          <el-input v-model="formLine1.catalogName" readonly :placeholder="$t('product.category.name')" class="form-dialog-width" />
        </el-form-item>
        <el-form-item :label="$t('product.category.img')" prop="catalogName">
            <img :src="formLine1.catalogImgUrl" class="avatar">
        </el-form-item>
        <el-form-item :label="$t('common.status')" prop="status">
          {{ formLine.catalogStatus === 1 ? $t('common.table.inUse') : $t('common.table.disabled') }}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="dialogVisible1=false">{{$t('common.buttonText.close')}}</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="sortVisible" :title="$t('product.category.sortTitle')" width="500px" center :close-on-click-modal="false" @close="closeSortDialog">
      <div style="height: 400px;overflow: auto">
        <el-tree
          ref="tree"
          :data="sortDataList"
          node-key="id"
          :props="{label: 'catalogName', children: 'children'}"
          :expand-on-click-node="false">
        <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            :class="canClick ? 'no-can-click' : ''"
            @click="moveFirst(node, data)">
            <svg-icon class-name="svgClass" icon-class="shuangjiantoushang" size="18" />
          </el-button>
          <el-button
            type="text"
            size="mini"
            :class="canClick ? 'no-can-click' : ''"
            @click="moveOne(node, data, 1)">
            <svg-icon class-name="svgClass" icon-class="jiantoushang" size="18" />
          </el-button>
          <el-button
            type="text"
            size="mini"
            :class="canClick ? 'no-can-click' : ''"
            @click="moveOne(node, data, -1)">
            <svg-icon class-name="svgClass" icon-class="jiantouxia" size="18" />
          </el-button>
          <el-button
            type="text"
            size="mini"
            :class="canClick ? 'no-can-click' : ''"
            @click="moveLast(node, data)">
            <svg-icon class-name="svgClass" icon-class="shuangjiantouxia" size="18" />
          </el-button>
        </span>
      </span>
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" size="small" @click="closeSortDialog">{{$t('common.buttonText.cancel')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { uploadActionUrl } from '@/api/common'
import {
  getPublicCategory,
  addPublicCategory,
  deletePublicCategory,
  changePublicCategory,
  catalogSortMove,
  catalogSortMoveMost
} from '@/api/product'
import { parseTime } from '@/utils/index'
import { deepClone } from "../../utils";
export default {
  components: {
    Pagination
  },
  data() {
    return {
      uploadActionUrl,
      list: null,
      listLoading: true,
      confirmLoading: false,
      dialogVisible: false,
      dialogVisible1: false,
      canClick: false,
      dialogType: '',
      indent: 20,
      selectList: [],
      sortDataList: [],
      sortVisible: false,
      formLine: {
        parentsName: [],
        parentBId: '',
        catalogName: '',
        catalogCode: '',
        catalogStatus: 1,
        parentBIds: '',
        catalogImgUrl: ''
      },
      formLine1: {
      },
      formLineRules: {
        catalogName: [
          { required: true, message: 'Please fill in the category name', trigger: 'blur' }
        ],
        catalogCode: [
          { required: true, message: 'Please fill in the category code', trigger: 'blur' }
        ]
      },
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        name: '',
        status: ''
      },
      statusList: [
        {
          label: 'disabled',
          id: 2
        },
        {
          label: 'Using',
          id: 1
        }
      ],
      dataList: [],
      addDataList: []
    }
  },
  created() {
    this.getDataList();
  },
  methods: {
    clearData() {
      this.formLine.parentsName = [];
      this.formLine.catalogName = '';
      this.formLine.catalogCode = '';
      this.formLine.parentBId = '';
      this.formLine.catalogStatus = 1;
      this.formLine.parentBIds = '';
      this.formLine.catalogImgUrl = ''
    },
    searchDataList() {
      this.postData.pageNum = 1;
      this.getDataList()
    },
    getDataList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== '') {
          obj[key] = this.postData[key]
        }
      }
      getPublicCategory(obj).then(res => {
        this.listLoading = false;
        this.dataList = res.data.list;
        this.postData.total = res.data.total;
      }).catch(err => {
        this.$message.error(err.message);
        this.listLoading = false;
      })
    },
    getAllDataList() {
      getPublicCategory({ pageSize: 999, pageNum: 1 }).then(res => {
        this.addDataList = res.data.list;
      })
    },
    getParentId(arr) {
      if (arr.length) {
        this.formLine.parentBId = arr[arr.length - 1];
        this.formLine.parentBIds = arr.join(',')
      } else {
        this.formLine.parentBId = '';
        this.formLine.parentBIds = ''
      }
    },
    openDetail(row) {
      this.getAllDataList();
      this.dialogVisible1 = true;
      this.formLine1 = deepClone(row);
      if (row.parentBIds) {
        this.formLine1.parentsName = this.formLine1.parentBIds.split(',').map(e => {
          return e;
        })
      } else {
        this.formLine1.parentsName = []
      }
    },
    openDialog(type, row) {
      this.getAllDataList();
      this.dialogType = type;
      if (type === 'edit') {
        this.formLine = deepClone(row);
        if (row.parentBIds) {
          this.formLine.parentsName = this.formLine.parentBIds.split(',').map(e => {
            return e;
          })
        } else {
          this.formLine.parentsName = []
        }
      }
      this.dialogVisible = true;
    },
    openSequenceCategory() {
      getPublicCategory({ pageSize: 9999, pageNum: 1 }).then(res => {
        this.sortDataList = JSON.parse(JSON.stringify(res.data.list));
        this.sortVisible = true;
      })
    },
    closeSortDialog() {
      this.searchDataList();
      this.sortVisible = false;
    },
    // 置顶
    moveFirst(node, data) {
      let arr = node.parent.data.children || node.parent.data;
      let rowIndex = arr.findIndex(e => e.id === data.id);
      if (rowIndex === 0) {
        return this.$message.warning('Already on top of the layer');
      }
      this.canClick = true;
      catalogSortMoveMost({ id: data.id, type: 1 }).then(res => {
        let top = deepClone(arr.splice(rowIndex, 1)[0]);
        this.canClick = false;
        arr.unshift(top);
      }).catch(err => {
        this.canClick = false;
        this.$message.error(err.message)
      })
    },
    // 移到尾部
    moveLast(node, data) {
      let arr = node.parent.data.children || node.parent.data;
      let rowIndex = arr.findIndex(e => e.id === data.id);
      if (rowIndex === arr.length - 1) {
        return this.$message.warning('Already the bottom of the layer');
      }
      this.canClick = true;
      catalogSortMoveMost({ id: data.id, type: 2 }).then(res => {
        let end = deepClone(arr.splice(rowIndex, 1)[0]);
        this.canClick = false;
        arr.push(end);
      }).catch(err => {
        this.canClick = false;
        this.$message.error(err.message)
      })
    },
    // 替换
    moveComm(arr, curIndex, nextIndex, data, move) {
      this.canClick = true;
      catalogSortMove({ id: data.id, type: move === 1 ? 1 : 2 }).then(res => {
        arr[curIndex] = deepClone(arr.splice(nextIndex, 1, arr[curIndex])[0]);
        this.canClick = false;
        return arr;
      }).catch(err => {
        this.$message.error(err.message);
        this.canClick = false;
        return arr;
      })
    },
    // 上下移动一格
    moveOne(node, data, move) {
      let arr = node.parent.data.children || node.parent.data;
      let rowIndex = arr.findIndex(e => e.id === data.id);
      if (rowIndex === 0 && move === 1) {
        return this.$message.warning('已是该层顶部');
      } else if (rowIndex === arr.length - 1 && move === -1) {
        return this.$message.warning('已是该层底部');
      } else {
        arr = this.moveComm(arr, rowIndex, rowIndex - move, data, move);
      }
    },
    handleSuccess(res, file) {
      this.formLine.catalogImgUrl = res.data.filePath;
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt1M = file.size / 1024 / 1024 < 1;

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG/PNG 格式!');
      }
      if (!isLt1M) {
        this.$message.error('上传图片大小不能超过 1MB!');
      }
      return isJPG && isLt1M;
    },
    confirmAdd(formName) {
      if (this.dialogType === 'add') {
        this.formLine.id = '';
        this.formLine.bid = '';
      }
      // if (!this.formLine.catalogImgUrl) {
      //   return this.$message.warning('请上传类目图片')
      // }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.confirmLoading = true;
          addPublicCategory(this.formLine).then(res => {
            this.$message.success('操作成功');
            this.confirmLoading = false;
            this.dialogVisible = false;
            this.postData.pageNum = 1;
            this.getDataList();
          }).catch(err => {
            this.confirmLoading = false;
            this.$message.error(err.message);
          });
        } else {
          this.$message.warning('验证未通过')
          return false;
        }
      });
    },
    changeStatus(row) {
      let obj = {
        id: row.id,
        catalogStatus: row.catalogStatus === 1 ? 2 : 1
      };
      changePublicCategory(obj).then(res => {
        this.getDataList();
        this.$message.success('操作成功');
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    deleteCategory() {
      if (this.selectList.length !== 1) {
        return this.$message.warning('请选择一条数据删除')
      }
      let row = this.selectList[0];
      if (row.children && row.children.length) {
        return this.$message.error('存在下级类目，不能删除');
      }
      if (row.catalogStatus === 1) {
        return this.$message.warning('使用中的数据不能删除')
      }
      this.$confirm('此操作将删除该类目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        let obj = { id: row.id };
        deletePublicCategory(obj).then(res => {
          this.getDataList();
          this.$message.success('删除成功');
        }).catch(err => {
          this.$message.error(err.message)
        });
      }).catch(() => {
      })
    },
    getSelect(selects) {
      this.selectList = selects
    },
    setChildSelect(section, row) {
      if (section.indexOf(row) > -1) {
        this.setCheckTable(section, true)
      } else {
        this.setCheckTable([row], false)
      }
    },
    setCheckTable(arr = [], flag) {
      arr.forEach(e => {
        if (e.children && e.children.length) {
          e.children.forEach(e => {
            this.$refs.listTable.toggleRowSelection(e, flag);
          });
          this.setCheckTable(e.children, flag)
        }
      })
    }
  },
  filters: {
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
  .category {
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

    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      height: 120px;
    }

    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 130px;
      height: 130px;
      line-height: 130px;
      text-align: center;
    }

    .avatar {
      width: 130px;
      height: 130px;
      display: block;
    }
  }
</style>
