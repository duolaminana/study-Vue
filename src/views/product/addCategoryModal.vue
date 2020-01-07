<template>
  <div class="addCategoryModal">
    <div class="mainContent">
      <div class="topPanel">
        <el-form label-width="130px" :model="ModalForm" inline size="small" :rules="formRules">
          <el-form-item :label="$t('product.categoryTemplate.code')" prop="templateCode">
            <el-input v-model="ModalForm.templateCode" clearable :placeholder="$t('product.categoryTemplate.code')" style="width: 260px" />
          </el-form-item>
          <el-form-item :label="$t('product.categoryTemplate.name')" prop="templateName">
            <el-input v-model="ModalForm.templateName" clearable :placeholder="$t('product.categoryTemplate.name')" style="width: 260px" />
          </el-form-item>
          <el-form-item :label="$t('product.categoryTemplate.category')" required>
            <el-cascader
              ref="catalogName"
              style="width: 350px"
              v-model="cascaderArr"
              :options="searchDataList"
              :props="{value: 'bid', label: 'catalogName', children: 'children'}"
              filterable
              clearable
              :placeholder="$t('common.search')"
              change-on-select
              @change="getParentId"
            ></el-cascader>
          </el-form-item>
        </el-form>
      </div>
      <div class="modal-item">
        <div class="label-top">
          {{$t('product.categoryTemplate.category')}}：<el-button type="primary" size="mini" style="margin-left: 50px" @click="addCategoryAttr">{{$t('common.add')}}</el-button>
        </div>
        <el-table
          :data="categoryAttrList"
          border
          fit
          default-expand-all
          size="small"
          :header-cell-style="{background: '#a7bfee'}">
          <el-table-column type="expand">
            <template slot-scope="props">
              <div class="table-expand" v-for="(item, childIndex) in props.row.pcavlist" :key="childIndex">
                <div class="expand-box"></div>
                <div class="table-flex">
                  <div>
                    <el-input v-model="item.attributeValue" clearable size="mini" :placeholder="$t('product.categoryTemplate.addAttrValue')" />
                  </div>
                  <div></div>
                  <div>
                    <svg-icon class-name="svgClass" icon-class="shuangjiantoushang" size="18" @click.native="moveFirst(props.row.pcavlist, childIndex, 2)" />
                    <svg-icon class-name="svgClass" icon-class="jiantoushang" size="18" @click.native="moveOne(props.row.pcavlist, childIndex, 1, 2)" />
                    <svg-icon class-name="svgClass" icon-class="jiantouxia" size="18" @click.native="moveOne(props.row.pcavlist, childIndex, -1, 2)" />
                    <svg-icon class-name="svgClass" icon-class="shuangjiantouxia" size="18" @click.native="moveLast(props.row.pcavlist, childIndex, 2)" />
                  </div>
                  <!--<div>-->
                    <!--<el-select v-model="item.attrState" clearable placeholder="请选择状态">-->
                      <!--<el-option v-for="(status, index) in statusList" :label="status.label" :value="status.id" :key="index"></el-option>-->
                    <!--</el-select>-->
                  <!--</div>-->
                  <div>
                    <el-button type="primary" size="mini" @click="removeAttrValue(props.$index, childIndex)">{{$t('common.delete')}}</el-button>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="$t('product.categoryTemplate.categoryAttributeName')">
            <template slot-scope="scope">
              <el-input v-model="scope.row.attributeName" clearable size="small" :placeholder="$t('product.categoryTemplate.categoryAttributeName')" />
            </template>
          </el-table-column>

          <el-table-column header-align="center" :label="$t('product.categoryTemplate.attributeType')">
            <template slot-scope="scope">
              <el-radio-group v-model="scope.row.attributeType" size="mini" @change="changeAttrType(scope)">
                <el-radio :label="1">{{$t('product.categoryTemplate.radio')}}</el-radio>
                <el-radio :label="2">{{$t('product.categoryTemplate.multipleSelection')}}</el-radio>
                <el-radio :label="3">{{$t('product.categoryTemplate.dropdown')}}</el-radio>
                <el-radio :label="4">{{$t('product.categoryTemplate.textbox')}}</el-radio>
                <el-radio :label="5">{{$t('product.categoryTemplate.textfield')}}</el-radio>
              </el-radio-group>
            </template>
          </el-table-column>

          <el-table-column align="center" :label="$t('common.sort')" prop="templateName">
            <template slot-scope="scope">
              <svg-icon class-name="svgClass" icon-class="shuangjiantoushang" size="18" @click.native="moveFirst(categoryAttrList, scope.$index, 1)" />
              <svg-icon class-name="svgClass" icon-class="jiantoushang" size="18" @click.native="moveOne(categoryAttrList, scope.$index, 1, 1)" />
              <svg-icon class-name="svgClass" icon-class="jiantouxia" size="18" @click.native="moveOne(categoryAttrList, scope.$index, -1, 1)" />
              <svg-icon class-name="svgClass" icon-class="shuangjiantouxia" size="18" @click.native="moveLast(categoryAttrList, scope.$index, 1)" />
            </template>
          </el-table-column>

          <!--<el-table-column align="center" label="状态">-->
            <!--<template slot-scope="scope">-->
              <!--<el-select v-model="scope.row.attrState" placeholder="请选择状态">-->
                <!--<el-option v-for="(status, index) in statusList" :label="status.label" :value="status.id" :key="index"></el-option>-->
              <!--</el-select>-->
            <!--</template>-->
          <!--</el-table-column>-->

          <el-table-column align="center" :label="$t('common.table.actions')">
            <template slot-scope="scope">
              <el-button :type="scope.row.attributeType === 4 || scope.row.attributeType === 5 ? 'info' : 'primary'" size="mini" :disabled="scope.row.attributeType === 4 || scope.row.attributeType === 5" @click="addAttrValue(scope.$index)">{{$t('product.categoryTemplate.valueAdded')}}</el-button>
              <el-button type="primary" size="mini" @click="removeCategoryAttr(categoryAttrList, scope.$index)">{{$t('common.delete')}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="modal-item">
        <div class="label-top">
          {{$t('product.categoryTemplate.salesAttribute')}}：<el-button type="primary" size="mini" style="margin-left: 50px" @click="addCategorySale">{{$t('common.add')}}</el-button>
        </div>
        <el-table
          :data="categorySaleList"
          border
          fit
          size="small"
          :header-cell-style="{background: '#a7bfee'}">
          <el-table-column align="center" :label="$t('product.categoryTemplate.salesAttributeName')" prop="roleName" >
            <template slot-scope="scope">
              <el-input v-model="scope.row.attributeName" clearable size="small" :placeholder="$t('product.categoryTemplate.salesAttributeName')" />
            </template>
          </el-table-column>

          <el-table-column align="center" :label="$t('product.categoryTemplate.attributeType')">
            <template slot-scope="scope">
              <el-radio-group v-model="scope.row.attributeType" size="mini">
                <el-radio :label="1">{{$t('product.categoryTemplate.datasheets')}}</el-radio>
              </el-radio-group>
            </template>
          </el-table-column>

          <el-table-column align="center" :label="$t('common.sort')">
            <template slot-scope="scope">
              <svg-icon class-name="svgClass" icon-class="shuangjiantoushang" size="18" @click.native="moveFirst(categorySaleList, scope.$index, 1)" />
              <svg-icon class-name="svgClass" icon-class="jiantoushang" size="18" @click.native="moveOne(categorySaleList, scope.$index, 1, 1)" />
              <svg-icon class-name="svgClass" icon-class="jiantouxia" size="18" @click.native="moveOne(categorySaleList, scope.$index, -1, 1)" />
              <svg-icon class-name="svgClass" icon-class="shuangjiantouxia" size="18" @click.native="moveLast(categorySaleList, scope.$index, 1)" />
            </template>
          </el-table-column>

          <!--<el-table-column align="center" label="状态">-->
            <!--<template slot-scope="scope">-->
              <!--<el-select v-model="scope.row.attrState" clearable placeholder="请选择状态">-->
                <!--<el-option v-for="(status, index) in statusList" :label="status.label" :value="status.id" :key="index"></el-option>-->
              <!--</el-select>-->
            <!--</template>-->
          <!--</el-table-column>-->

          <el-table-column align="center" :label="$t('common.actions')">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="removeCategorySale(categorySaleList, scope.$index)">{{$t('common.delete')}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="category-footer">
        <el-button type="primary" size="small" @click="saveCategoryModal">{{$t('common.buttonText.save')}}</el-button>
        <el-button type="danger" size="small" @click="closePage">{{$t('common.buttonText.back')}}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'
import {
  getPublicCategory,
  editCategoryModal,
  addCategoryModal,
  detailCategoryModal,
  deleteAttrName,
  deleteAttrValue
} from '@/api/product'

export default {
  components: {
    SvgIcon
  },
  data() {
    return {
      saveLoading: false,
      searchDataList: [],
      cascaderArr: [],
      ModalForm: {
        templateCode: '',
        templateName: '',
        catalogBIdList: '',
        catalogName: ''
      },
      formRules: {
        templateName: [
          { required: true, message: '请填写模板名称', trigger: 'blur' }
        ],
        templateCode: [
          { required: true, message: '请填写模板编码', trigger: 'blur' }
        ]
      },
      categoryAttrList: [{ attributeName: '', attributeType: 1, attributeState: 1, pcavlist: [{ attributeValue: '', attrState: 1 }] }],
      categorySaleList: [{ attributeName: '', attributeType: 1, attributeState: 1 }],
      statusList: [
        {
          label: '启用',
          id: 1
        },
        {
          label: '禁用',
          id: 2
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
    this.getAllDataList();
    if (this.$route.query.id) {
      this.getCategoryModalDetail()
    }
  },
  methods: {
    closePage() {
      this.$store.dispatch('delView', this.activeRoute).then(() => {
        this.$router.push({
          path: '/product/categoryModal'
        })
      })
    },
    getParentId(arr) {
      if (arr.length) {
        this.ModalForm.catalogBIdList = arr.join(',');
        this.ModalForm.catalogName = this.$refs['catalogName'].currentLabels.join('/');
      } else {
        this.ModalForm.catalogBIdList = '';
        this.ModalForm.catalogName = '';
      }
    },
    getAllDataList() {
      getPublicCategory({ pageSize: 999, pageNum: 1 }).then(res => {
        this.searchDataList = res.data.list || [];
      })
    },
    getCategoryModalDetail() {
      detailCategoryModal({ bid: this.$route.query.id }).then(res => {
        this.ModalForm = res.data;
        this.cascaderArr = res.data.catalogBIdList.split(',');
        this.categoryAttrList = res.data.basePctd.map(e => {
          if (!e.pcavlist) {
            e.pcavlist = []
          }
          return { ...e }
        });
        this.categorySaleList = res.data.sellPctd || [];
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    saveCategoryModal() {
      if (!this.ModalForm.templateName) {
        return this.$message.error('请填写模板名称');
      }
      if (!this.ModalForm.templateCode) {
        return this.$message.error('请填写模板编码');
      }
      if (!this.categoryAttrList.length) {
        return this.$message.error('至少填写一条类目属性');
      } else {
        for (let i = 0; i < this.categoryAttrList.length; i++) {
          if (!this.categoryAttrList[i].attributeName) {
            return this.$message.error('类目属性名称不能为空');
          }
          for (let j = 0; j < this.categoryAttrList[i].pcavlist.length; j++) {
            if (!this.categoryAttrList[i].pcavlist[j].attributeValue) {
              return this.$message.error('类目属性值不能为空');
            }
          }
        }
      }
      for (let n = 0; n < this.categorySaleList.length; n++) {
        if (!this.categorySaleList[n].attributeName) {
          return this.$message.error('销售属性名称不能为空');
        }
      }
      this.ModalForm.basePctd = this.categoryAttrList;
      this.ModalForm.sellPctd = this.categorySaleList;
      let api = '';
      if (this.$route.query.id) {
        api = editCategoryModal
      } else {
        api = addCategoryModal
      }
      this.saveLoading = true;
      api(this.ModalForm).then(res => {
        this.$message.success('保存成功');
        setTimeout(() => {
          this.saveLoading = false;
          this.closePage();
        }, 300)
      }).catch(err => {
        this.saveLoading = false;
        this.$message.error(err.message)
      })
    },
    changeAttrType(scope) {
      if (scope.row.attributeType === 4 || scope.row.attributeType === 5) {
        scope.row.pcavlist = []
      } else {
        scope.row.pcavlist = [{ attributeValue: '', attrState: 1 }]
      }
    },
    addCategoryAttr() {
      this.categoryAttrList.push({ attributeName: '', attributeType: 1, attributeState: 1, pcavlist: [{ attributeValue: '', attrState: 1 }] })
    },
    addCategorySale() {
      this.categorySaleList.push({ attributeName: '', attributeType: 1, attributeState: 1 })
    },
    addAttrValue(index) {
      this.categoryAttrList[index].pcavlist.push({ attributeValue: '', attrState: 1 })
    },
    removeCategoryAttr(arr, index) {
      if (this.$route.query.id) {
        let obj = {
          bid: this.categoryAttrList[index].bid
        };
        deleteAttrName(obj).then(res => {
          this.$message.success('删除成功');
          arr.splice(index, 1)
        }).catch(err => {
          this.$message.error(err.message)
        })
      } else {
        arr.splice(index, 1)
      }
    },
    removeCategorySale(arr, index) {
      if (this.categorySaleList.length <= 1) {
        return this.$message.warning('最少1条销售属性');
      }
      if (this.$route.query.id) {
        let obj = {
          bid: this.categorySaleList[index].bid
        };
        deleteAttrName(obj).then(res => {
          this.$message.success('删除成功');
          arr.splice(index, 1)
        }).catch(err => {
          this.$message.error(err.message)
        })
      } else {
        arr.splice(index, 1)
      }
    },
    removeAttrValue(index, cIndex) {
      if (this.$route.query.id) {
        let obj = {
          dictId: this.categoryAttrList[index].pcavlist[cIndex].id
        };
        deleteAttrValue(obj).then(res => {
          this.$message.success('删除成功');
          this.categoryAttrList[index].pcavlist.splice(cIndex, 1)
        }).catch(err => {
          this.$message.error(err.message)
        })
      } else {
        this.categoryAttrList[index].pcavlist.splice(cIndex, 1)
      }
    },
    // 置顶类目属性
    moveFirst(arr, rowIndex, type) {
      let sequ = type === 1 ? 'attributeSequence' : 'valueSequence';
      if (rowIndex === 0) {
        return this.$message.warning('已是顶部');
      }
      if (arr[rowIndex][sequ] && arr[0][sequ]) {
        // let oldAttrSequ = arr[rowIndex][sequ];
        let newAttrSequ = arr[0][sequ];
        arr[rowIndex][sequ] = (newAttrSequ - 10).toString();
        // arr[0][sequ] = oldAttrSequ;
      }
      let top = arr.splice(rowIndex, 1)[0];
      arr.unshift(top);
    },
    // 移到尾部类目属性
    moveLast(arr, rowIndex, type) {
      let sequ = type === 1 ? 'attributeSequence' : 'valueSequence';
      if (rowIndex === arr.length - 1) {
        return this.$message.warning('已是底部');
      }
      if (arr[rowIndex][sequ] && arr[arr.length - 1][sequ]) {
        // let oldAttrSequ = arr[rowIndex][sequ];
        let newAttrSequ = arr[arr.length - 1][sequ];
        arr[rowIndex][sequ] = (newAttrSequ + 10).toString();
        // arr[arr.length - 1][sequ] = oldAttrSequ;
      }
      let end = arr.splice(rowIndex, 1)[0];
      arr.push(end);
    },
    // 替换
    moveComm(arr, curIndex, nextIndex, type) {
      let sequ = type === 1 ? 'attributeSequence' : 'valueSequence';
      if (arr[curIndex][sequ] && arr[nextIndex][sequ]) {
        let oldAttrSequ = arr[curIndex][sequ];
        let newAttrSequ = arr[nextIndex][sequ];
        arr[curIndex][sequ] = newAttrSequ;
        arr[nextIndex][sequ] = oldAttrSequ;
      }
      arr[curIndex] = arr.splice(nextIndex, 1, arr[curIndex])[0];
      return arr;
    },
    // 上下移动
    moveOne(arr, rowIndex, move, type) {
      if (rowIndex === 0 && move === 1) {
        return this.$message.warning('已是顶部');
      } else if (rowIndex === arr.length - 1 && move === -1) {
        return this.$message.warning('已是底部');
      } else {
        arr = this.moveComm(arr, rowIndex, rowIndex - move, type);
      }
    }
  }
}
</script>

<style lang="scss">
  @import '~@/styles/variables.scss';
.addCategoryModal {
  width: 1000px;
  margin: 0 auto;
  padding-top: 20px;
  border: 1px solid $border-light-color;
  .topPanel {
    width: 100%;
    border-bottom: 1px solid $border-light-color;
  }
  .modal-item {
    margin: 10px 0;
    .label-top {
      height: 36px;
      line-height: 36px;
      padding-left: 15px;
    }
    .table-expand {
      display: -webkit-flex;
      display: flex;
      width: 100%;
      .expand-box {
        width: 50px;
      }
      .table-flex {
        display: -webkit-flex;
        display: flex;
        width: 100%;
        >div {
          flex: 1;
          height: 36px;
          line-height: 36px;
          text-align: center;
          padding: 0 10px;
        }
      }
    }
  }
  .table-expand + .table-expand {
    border-top: 1px solid $border-light-color;
  }
  .svgClass {
    cursor: pointer;
    &:hover {
      background: #eee;
    }
  }
  .el-table__expanded-cell[class*=cell] {
    padding: 0 !important;
  }
  .el-radio {
    margin-right: 20px;
  }
  .category-footer {
    text-align: center;
    margin: 50px 0;
    button {
      margin:  0 20px;
    }
  }
}
</style>

