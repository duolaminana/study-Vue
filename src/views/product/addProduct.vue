<template>
  <div class="addProduct">
    <div class="detailContent">
        <!--基本属性-->
        <el-tabs v-model="activeName" :before-leave="changeTab">
          <el-tab-pane :label="$t('product.product.basicInformation')" name="1">
            <div class="panel-item">
              <el-form ref="productBaseInfo" :model="ModalForm" label-width="150px" size="small" :rules="formRules">
                <el-row>
                  <el-col :span="12">
                    <el-form-item :label="$t('product.product.productCode')" prop="productCode">
                      <el-input v-model="ModalForm.productCode" clearable :placeholder="$t('product.product.productCode')"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item :label="$t('product.product.productName')" prop="productName">
                      <el-input v-model="ModalForm.productName" clearable :placeholder="$t('product.product.productName')" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item :label="$t('product.categoryTemplate.category')" prop="cascaderArr">
                      <el-cascader
                        ref="catalogBName"
                        style="width: 100%"
                        v-model="ModalForm.cascaderArr"
                        :options="searchDataList"
                        :props="{value: 'bid', label: 'catalogName', children: 'children'}"
                        filterable
                        clearable
                        :placeholder="$t('common.search')"
                        change-on-select
                        @change="getParentId"
                      ></el-cascader>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item :label="$t('product.categoryTemplate.categoryTemplate')" prop="templateBId">
                      <el-select v-model="ModalForm.templateBId" clearable :disabled="editable" :placeholder="$t('product.product.selectStatus')" style="width: 100%">
                        <el-option v-for="(item, index) in modalList" :label="item.templateName" :value="item.bid" :key="index"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item :label="$t('product.product.customsCode')" prop="customsCode">
                      <el-input v-model="ModalForm.customsCode" clearable :placeholder="$t('product.product.customsCode')"/>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-form-item :label="$t('product.product.promotionTitle')" prop="productHeadline">
                  <el-input v-model="ModalForm.productHeadline" clearable :placeholder="$t('product.product.promotionTitle')" style="width: 100%" />
                  <!--<span class="tips" style="display: block">标题和描述关键词请规范使用，以便站内和站外搜索</span>-->
                </el-form-item>
              </el-form>
              <div class="product-footer">
                <el-button type="warning" size="small" :loading="saveLoading" @click="saveProductBase('productBaseInfo', 1)">{{$t('common.buttonText.save')}}</el-button>
                <el-button type="danger" size="small" @click="closePage">{{$t('common.buttonText.back')}}</el-button>
                <!--<el-button type="primary" size="small" :loading="saveLoading" @click="saveProductBase('productBaseInfo', 2)">提交</el-button>-->
              </div>
            </div>
          </el-tab-pane>
          <!--类目属性-->
          <el-tab-pane :label="$t('product.categoryTemplate.categoryAttributeName')" name="2">
            <div class="panel-item">
              <el-form ref="productCategoryAttr" label-width="150px" size="small">
                <el-form-item :label="item.attributeName" required v-for="(item, index) in categoryAttrList" :key="index">
                  <el-radio-group v-model="item.attrValue" v-if="item.attributeType === 1">
                    <el-radio :label="item1.attributeValue" v-for="(item1, index1) in item.pcavlist" :key="index1"></el-radio>
                  </el-radio-group>
                  <el-checkbox-group v-model="item.check2" v-if="item.attributeType === 2">
                    <el-checkbox :label="item1.attributeValue" v-for="(item1, index1) in item.pcavlist" :key="index1"></el-checkbox>
                  </el-checkbox-group>
                  <el-select v-model="item.attrValue" clearable :placeholder="`${item.attributeName}`" v-if="item.attributeType === 3" style="width: 60%">
                    <el-option v-for="(item1, index1) in item.pcavlist" :label="item1.attributeValue" :value="item1.attributeValue" :key="index1"></el-option>
                  </el-select>
                  <el-input v-if="item.attributeType === 4" v-model="item.attrValue" size="small" clearable :placeholder="`${item.attributeName}`" style="width: 60%" />
                  <el-input v-if="item.attributeType === 5" v-model="item.attrValue" type="textarea" :autosize="{ minRows: 4, maxRows: 6}" size="small" clearable :placeholder="`${item.attributeName}`" style="width: 80%" />
                </el-form-item>
              </el-form>
              <div class="product-footer">
                <el-button type="primary" size="small" :loading="saveLoading" @click="saveCategoryAttr">{{$t('common.buttonText.save')}}</el-button>
                <el-button type="danger" size="small" @click="closePage">{{$t('common.buttonText.back')}}</el-button>
              </div>
            </div>
          </el-tab-pane>
          <!--销售属性-->
          <el-tab-pane :label="$t('product.categoryTemplate.salesAttribute')" name="3">
            <div class="panel-item">
              <el-form ref="productSaleAttr" :model="ModalForm" label-width="150px" size="small" :rules="formRules">
                <div v-for="(item, index) in categorySaleList" :key="index">
                  <el-form-item :label="item.attributeName">
                    <el-input v-model="item.attrValue" size="mini" clearable :placeholder="$t('product.product.definedValue')" style="width: 250px" @keyup.enter.native="addChecks(index+1, item.attrValue, item.attributeName)" />
                    <el-button type="primary" :disabled="addLoading" size="mini" style="margin-left: 30px" @click="addChecks(index+1, item.attrValue, item.attributeName)">
                      {{$t('product.categoryTemplate.valueAdded')}}
                    </el-button>
                  </el-form-item>
                  <el-form-item>
                    <el-checkbox-group v-model="item.checks" @change="setSkuList">
                      <el-checkbox :label="item1.sellAttrValue" v-for="(item1, index1) in saleList['saleList-' + item.attributeName]" :key="index1">
                        <svg-icon icon-class="left-arrow" size="20" class-name="arrowClass" @click.prevent.native="moveOne(saleList['saleList-' + item.attributeName],index1,1)"></svg-icon>
                        <svg-icon icon-class="right-arrow" size="20" class-name="arrowClass" @click.prevent.native="moveOne(saleList['saleList-' + item.attributeName],index1,-1)"></svg-icon>
                        <el-tag type="info" size="small" closable @close.prevent="closeChecks(index+1, index1, item1,item.attributeName)">
                          {{item1.sellAttrValue}}
                        </el-tag>
                      </el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </div>
                  <div class="sale-batch">
                    <div style="display: inline;float: left;;line-height: 36px;height: 36px;font-weight: bold;font-size: 15px">{{$t('product.product.listDisplay')}}:</div>
                    {{$t('product.product.batch')}}：
                    <el-select v-model="tableAttr" clearable style="width: 180px">
                      <el-option v-for="(item, index) in tableAttrList" :label="item.label" :value="item.value" :key="index"></el-option>
                    </el-select>
                    <el-input v-if="tableAttr === 'skuUnit'" v-model="tableAttrValue" size="small" style="width: 150px;margin-left: 20px"/>
                    <el-input-number v-else v-model="tableAttrValue" :min="0" size="small" style="width: 150px;margin-left: 20px"/>
                    <el-button type="primary" size="small" @click="addProductSkuAttr">{{$t('common.buttonText.confirm')}}</el-button>
                  </div>
                  <el-table :data="skuList2" border fit size="small" max-height="500" style="width: 100%" :header-cell-style="{background: '#a7bfee'}">
                    <el-table-column align="center" type="index" width="55" :label="$t('common.table.id')"></el-table-column>

                    <el-table-column align="center" :label="$t('product.product.skuAttributes')" prop="attrValueList"></el-table-column>

                    <el-table-column align="center" width="180" :label="$t('product.product.skuCode')" prop="skuCode">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.skuCode" size="small"/>
                      </template>
                    </el-table-column>

                    <el-table-column align="center" width="150" :label="$t('product.product.minimumOrderQuantity')" prop="miniOrderNumber">
                      <template slot-scope="scope">
                        <el-input-number v-model="scope.row.miniOrderNumber" :min="0" size="small" class="hidden-control"/>
                      </template>
                    </el-table-column>

                    <el-table-column align="center" width="100" :label="$t('product.product.unit')" prop="skuUnit">
                      <template slot-scope="scope">
                        <el-input v-model="scope.row.skuUnit" size="small" align="center" class="input-center"/>
                      </template>
                    </el-table-column>

                    <el-table-column align="center" width="150" :label="$t('product.product.decimal')" prop="skuDecimalPlaces">
                      <template slot-scope="scope">
                        <el-input-number v-model="scope.row.skuDecimalPlaces" :precision="0" :min="0" size="small" class="hidden-control"/>
                      </template>
                    </el-table-column>

                    <el-table-column align="center" width="150" :label="$t('product.product.quantityPackage')" prop="skuSinglePackage">
                      <template slot-scope="scope">
                        <el-input-number v-model="scope.row.skuSinglePackage" :min="0" size="small" class="hidden-control"/>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" width="150" :label="$t('product.product.skuVolume')" prop="skuVolume">
                      <template slot-scope="scope">
                        <el-input-number v-model="scope.row.skuVolume" :min="0" size="small" class="hidden-control"/>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" width="150" :label="$t('product.product.skuWeight')" prop="skuWeight">
                      <template slot-scope="scope">
                        <el-input-number v-model="scope.row.skuWeight" :min="0" size="small" class="hidden-control"/>
                      </template>
                    </el-table-column>

                    <el-table-column align="center" width="80" :label="$t('common.table.actions')" class-name="small-padding fixed-width">
                      <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="delProductSkuAttr(scope)">{{$t('common.table.delete')}}</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
              </el-form>
              <div class="product-footer">
                <el-button type="primary" size="small" :loading="saveLoading" @click="saveSaleAttr">{{$t('common.buttonText.save')}}</el-button>
                <el-button type="danger" size="small" @click="closePage">{{$t('common.buttonText.back')}}</el-button>
              </div>
            </div>
          </el-tab-pane>
          <!--图文描述-->
          <el-tab-pane :label="$t('product.product.graphicDescription')" name="4">
            <el-form ref="productTextImg" :model="textImgForm" label-width="150px" size="small" :rules="textImgRules">
              <el-form-item :label="$t('product.product.pcroductPicture')" required>
                {{$t('product.product.pictureNoMoreThan')}}<span class="form-tips">  3MB </span>。
                <!--<span class="form-tips">700*700</span>以上的图片上传后宝贝详情页自动提供放大镜功能。-->
                <!--第五张图发商品白底图可增加手淘首页曝光机会。-->
                <div>
                  <el-upload
                    :action="uploadActionUrl"
                    list-type="picture-card"
                    :file-list="imgList"
                    :limit="5"
                    :on-exceed="handleExceed"
                    :before-upload="beforeUpload"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove"
                    :on-success="handleSuccess">
                    <i class="el-icon-plus"></i>
                  </el-upload>
                  <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                  </el-dialog>
                </div>
              </el-form-item>
              <el-form-item :label="$t('product.product.computerDescription')" prop="detPcPage">
                <tinymce v-model="textImgForm.detPcPage" style="width: 99%" />
              </el-form-item>
            </el-form>
            <div class="product-footer">
              <el-button type="primary" size="small" :loading="saveLoading" @click="saveTextImg('productTextImg')">{{$t('common.buttonText.save')}}</el-button>
              <el-button type="danger" size="small" @click="closePage">{{$t('common.buttonText.back')}}</el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
    </div>
    <!--<div class="product-footer">-->
      <!--<el-button type="danger" size="small" @click="closePage">返回</el-button>-->
      <!--<el-button type="warning" size="small" :loading="saveLoading" @click="saveProduct('productForm', 1)">保存</el-button>-->
      <!--<el-button type="primary" size="small" :loading="saveLoading" @click="saveProduct('productForm', 2)">提交</el-button>-->
    <!--</div>-->
  </div>
</template>

<script>
import { uploadActionUrl } from '@/api/common'
import Tinymce from '@/components/Tinymce'
// import { deepClone } from '@/utils/index'
import {
  getAllPublicCategory,
  detailCategoryModal,
  getAllCategoryModalList,
  addProduct,
  editProduct,
  getCategoryAttr,
  getProductDetail,
  addCategoryAttr,
  editCategoryAttr,
  updateProductTemplate,
  getTextImgInfo,
  addTextImgInfo,
  editTextImgInfo,
  deleteTextImg,
  saveTextImg,
  getSaleAttr,
  addSaleAttr,
  editSaleAttr,
  getProductImgList,
  saveAttrValue,
  getProductSaleAttrValue,
  deleteProductSaleAttrValue,
  sortProductSaleAttrValue
} from '@/api/product'

export default {
  components: {
    Tinymce
  },
  data() {
    return {
      uploadActionUrl,
      activeName: '1',
      dialogImageUrl: '',
      saveLoading: false,
      addLoading: false,
      dialogVisible: false,
      firstSave: false,
      editable: false,
      searchDataList: [],
      modalList: [],
      categoryAttrList: [],
      categorySaleList: [],
      saleList: {
        saleList1: [],
        saleList2: [],
        saleList3: []
      },
      skuList: [],
      skuList1: [],
      skuList2: [],
      columns: [],
      imgList: [],
      templateBId: '',
      catalogBId: '',
      // imgList: [{ name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }],
      ModalForm: {
        cascaderArr: [],
        productCode: '',
        productName: '',
        customsCode: '',
        catalogBId: '',
        catalogBName: '',
        templateBId: '',
        productUnit: '',
        singleWeight: '',
        singleBulk: '',
        singlePackage: '',
        bulkUnit: '1',
        weightUnit: '1',
        productHeadline: '',
        decimalPlaces: 0
      },
      formRules: {
        productName: [
          { required: true, message: '请填写商品名称', trigger: 'blur' }
        ],
        productCode: [
          { required: true, message: '请填写商品编码', trigger: 'blur' }
        ],
        cascaderArr: [
          { type: 'array', required: true, message: '请选择所属类目', trigger: 'blur' }
        ],
        productUnit: [
          { required: true, message: '请填写商品单位', trigger: 'blur' }
        ],
        templateBId: [
          { required: true, message: '请选择模板', trigger: 'change' }
        ],
        productHeadline: [
          { required: false, message: '请输入推广标题', trigger: 'blur' },
          { min: 1, max: 60, message: '长度在 1 到 60 个字符', trigger: 'blur' }
        ]
      },
      textImgForm: {
        detAppPage: '',
        detPcPage: ''
      },
      textImgRules: {
        detPcPage: [{ required: true, message: '请填写商品图文', trigger: 'blur' }]
      },
      tableAttrList: [
        {
          label: 'Minimum Order Quantity',
          value: 'miniOrderNumber'
        },
        {
          label: 'Unit',
          value: 'skuUnit'
        },
        {
          label: 'Decimal',
          value: 'skuDecimalPlaces'
        },
        {
          label: 'Quantity Package',
          value: 'skuSinglePackage'
        },
        {
          label: 'Volume(Cube)',
          value: 'skuVolume'
        },
        {
          label: 'Weight(Kilogram)',
          value: 'skuWeight'
        }
      ],
      tableAttr: '',
      tableAttrValue: 0
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
  watch: {
    'ModalForm.templateBId' (val) {
      if (val) {
        this.getCategoryModalDetail(val)
      } else {
        this.categoryAttrList = [];
        this.categorySaleList = [];
        // this.saleList.saleList1 = [];
        // this.saleList.saleList2 = [];
        // this.saleList.saleList3 = [];
        this.saleList = {}
      }
    },
    skuList(arr) {
      arr = [].concat(arr);
      let arrInLength = arr.filter(e => {
        return !e.length
      }).length;
      if (arrInLength === arr.length) {
        this.skuList2 = []
      } else {
        let result = this.getComposeByArrays(arr).map(e => {
          e.productBId = this.ModalForm.bid;
          e.skuCode = '';
          e.miniOrderNumber = 0;
          e.skuUnit = '';
          e.skuDecimalPlaces = 0;
          e.skuSinglePackage = 0;
          this.skuList1.forEach(t => {
            if (e.attrValueList === t.attrValueList) {
              e = t;
            }
          });
          return { ...e };
        });
        this.skuList2 = result;
      }
    }
  },
  created() {
    this.noEnbledCategoryModalList();
    this.getAllCategoryList();
    if (this.$route.query.id) {
      this.editable = true;
      this.getProductDetail()
    }
  },
  methods: {
    closePage() {
      this.$store.dispatch('delView', this.activeRoute).then(() => {
        this.$router.push({
          path: '/product/productList'
        })
      })
    },
    getParentId(arr) {
      if (arr.length) {
        this.ModalForm.catalogBId = arr.join(',');
        this.ModalForm.catalogBName = this.$refs['catalogBName'].currentLabels.join('/');
      } else {
        this.ModalForm.catalogBId = '';
        this.ModalForm.catalogBName = '';
      }
      if (!this.ModalForm.bid) {
        this.noEnbledCategoryModalList(this.ModalForm.catalogBId);
        this.ModalForm.templateBId = ''
      }
    },
    setInt() {
      if (!isNaN(this.ModalForm.decimalPlaces)) {
        this.ModalForm.decimalPlaces = Math.round(this.ModalForm.decimalPlaces);
      } else {
        this.ModalForm.decimalPlaces = 0
      }
    },
    addProductSkuAttr() {
      if (!this.tableAttrValue || !this.tableAttr) {
        return this.$message.warning('请填写完整')
      }
      this.skuList2.forEach(e => {
        e[this.tableAttr] = this.tableAttrValue
      });
      this.tableAttr = '';
      this.tableAttrValue = 0
    },
    delProductSkuAttr(scope) {
      this.skuList2.splice(scope.$index, 1)
    },
    changeTab(name) {
      if (name !== '1' && !this.ModalForm.bid) {
        this.$message.warning('请先填写完整基础信息并保存成功');
        return false
      }
      if (!this.ModalForm.templateBId) {
        this.$message.warning('请先选择类目模板');
        return false
      }
      switch (Number(name)) {
        case 2: this.getCategoryAttr(); break;
        case 3: this.getSaleAttr(); break;
        case 4: this.getTextImg(); this.getProductImgList(); break;
        default: break;
      }
    },
    getCategoryAttr() {
      getCategoryAttr({ productBId: this.ModalForm.bid }).then(res => {
        if (res.data && res.data.length) {
          this.firstSave = false;
          this.categoryAttrList = this.categoryAttrList.map(e => {
            e.attrName = e.attributeName;
            e.createTime = '';
            e.updateTime = '';
            res.data.forEach(t => {
              e.id = t.id;
              e.productBId = t.productBId;
              if (e.attributeName === t.attrName) {
                e.attrValue = t.attrValue;
                if (e.attributeType === 2) {
                  e.check2 = t.attrValue.split(',');
                }
              }
            });
            return { ...e }
          })
        } else {
          this.firstSave = true;
          this.categoryAttrList = this.categoryAttrList.map(e => {
            e.attrName = e.attributeName;
            e.productBId = this.ModalForm.bid;
            e.createTime = '';
            e.updateTime = '';
            return { ...e }
          })
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    getSaleAttr() {
      getSaleAttr({ bid: this.ModalForm.bid }).then(res => {
        if (res.data.skuList && res.data.skuList.length) {
          this.firstSave = false;
          this.categorySaleList = this.categorySaleList.map(e => {
            (res.data.productSellAttributeList || []).forEach((t, index) => {
              if (e.attributeName === t.attributeValue) {
                e.attributeValue = e.attributeName;
                e.attrValue = '';
                e.checks = t.psabvList.filter(n => n.isDelete).map(n => { return n.sellAttrValue; });
              }
            });
            return { ...e }
          });
          this.skuList1 = res.data.skuList.map(e => { return { ...e } });
          this.skuList2 = res.data.skuList.map(e => { return { ...e } });
        } else {
          this.categorySaleList = this.categorySaleList.map(e => {
            e.checks = [];
            return { ...e }
          });
          this.firstSave = true;
          this.skuList2 = []
        }
        // this.setSkuList();
        this.getProductSaleAttrValue()
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    getProductSaleAttrValue() {
      getProductSaleAttrValue({ productBId: this.ModalForm.bid }).then(res => {
        if (res.data.productSellAttributeList && res.data.productSellAttributeList.length) {
          res.data.productSellAttributeList.forEach((e, index) => {
            this.saleList['saleList-' + e.attributeValue] = e.psabvList
          });
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    saveSaleAttr() {
      for (let i = 0; i < this.categorySaleList.length; i++) {
        if (!this.categorySaleList[i].checks.length) {
          return this.$message.error('请添加并选择销售属性');
        }
      }
      let api = '';
      let obj = {};
      if (this.firstSave) {
        api = addSaleAttr
      } else {
        api = editSaleAttr
      }
      this.categorySaleList.forEach((e, index) => {
        e.attributeSequ = index + 1;
        e.productBId = this.ModalForm.bid;
        e.psabvList = this.saleList['saleList-' + e.attributeName].filter(t => {
          return e.checks.includes(t.sellAttrValue)
        }).map(n => {
          n.isDelete = 1;
          return { ...n }
        })
      });
      console.log(this.skuList2);
      obj.productBId = this.ModalForm.bid;
      obj.skuList = this.skuList2.map(e => {
        e.checks = e.attrValueList.split('/');
        let arr = [];
        for (let key in this.saleList) {
          arr = arr.concat(this.saleList[key].filter(t => e.checks.includes(t.sellAttrValue)))
        }
        e.attrBIdList = e.attrBIdList || arr.map(n => n.bid).join(',');
        return { ...e }
      });
      obj.productSellAttributeList = this.categorySaleList;
      this.saveLoading = true;
      api(obj).then(res => {
        this.firstSave = false;
        this.saveLoading = false;
        this.getSaleAttr();
        this.$message.success('保存成功')
      }).catch(err => {
        this.saveLoading = false;
        this.$message.error(err.message)
      })
    },
    moveOne(arr, index, move) {
      if (index === 0 && move === 1) {
        return false
      } else if (index === arr.length - 1 && move === -1) {
        return false
      } else {
        let obj = {
          oneBid: arr[index].bid,
          twoBid: arr[index - move].bid
        };
        sortProductSaleAttrValue(obj).then(res => {
          arr[index] = arr.splice(index - move, 1, arr[index])[0];
        }).catch(err => {
          this.$message.error(err.message)
        })
      }
    },
    getProductImgList() {
      getProductImgList({ bid: this.ModalForm.bid }).then(res => {
        if (res.data) {
          this.imgList = res.data.map(e => {
            e.name = e.imageName;
            e.url = e.imagePath;
            return { ...e }
          })
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    getTextImg() {
      getTextImgInfo({ bid: this.ModalForm.bid }).then(res => {
        if (res.data) {
          this.firstSave = false;
          this.textImgForm = res.data;
        } else {
          this.firstSave = true;
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    saveCategoryAttr() {
      let api = '';
      if (this.firstSave) {
        api = addCategoryAttr
      } else {
        api = editCategoryAttr
      }
      for (let i = 0; i < this.categoryAttrList.length; i++) {
        if (this.categoryAttrList[i].attributeType === 2 && !this.categoryAttrList[i].check2.length) {
          return this.$message.error('请填写完整类目属性！');
        } else if (!this.categoryAttrList[i].attrValue && this.categoryAttrList[i].attributeType !== 2) {
          return this.$message.error('请填写完整类目属性！');
        }
      }
      this.categoryAttrList.forEach(e => {
        if (e.attributeType === 2) {
          e.attrValue = e.check2.join(',');
        }
        return { ...e };
      });
      this.saveLoading = true;
      api({ productAttributeList: this.categoryAttrList }).then(res => {
        this.firstSave = false;
        this.saveLoading = false;
        this.$message.success('保存成功')
      }).catch(err => {
        this.saveLoading = false;
        this.$message.error(err.message)
      })
    },
    saveTextImg(name) {
      let api = '';
      if (this.firstSave) {
        api = addTextImgInfo
      } else {
        api = editTextImgInfo
      }
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.saveLoading = true;
          this.textImgForm.productBId = this.ModalForm.bid;
          api(this.textImgForm).then(res => {
            this.firstSave = false;
            this.saveLoading = false;
            this.$message.success('保存成功')
          }).catch(err => {
            this.saveLoading = false;
            this.$message.error(err.message)
          })
        } else {
          this.$message.error('请填写完整')
        }
      })
    },
    getProductDetail() {
      getProductDetail({ bid: this.$route.query.id }).then(res => {
        this.ModalForm = Object.assign(this.ModalForm, res.data);
        this.ModalForm.cascaderArr = this.ModalForm.catalogBId.split(',') || []
        this.catalogBId = this.ModalForm.catalogBId;
        this.templateBId = this.ModalForm.templateBId;
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    getComposeByArrays(arrays) {
      let arr = [{ attrValueList: '' }];
      for (let i = 0; i < arrays.length; i++) {
        arr = this.two_compose(arr, arrays[i], i)
      }
      return arr
    },
    two_compose(arr1, arr2, index) {
      let arr = [];
      // let objAttr = ['skuDimenOne', 'skuDimenTwo', 'skuDimenThr'];
      // let objAttrValue = objAttr[index];
      if (!arr2.length) {
        arr2 = [''];
      }
      for (let i = 0; i < arr1.length; i++) {
        for (let j = 0; j < arr2.length; j++) {
          let arrObj = Object.assign({}, arr1[i]);
          arrObj.attrValueList = arrObj.attrValueList + (arrObj.attrValueList && arr2[j] ? `/` : '') + arr2[j];
          arr.push(arrObj);
        }
      }
      return arr
    },
    addChecks(index, value, label) {
      if (!value) {
        return this.$message.error('不能添加空值');
      }
      if (this.saleList['saleList-' + label].findIndex(e => e.sellAttrValue === value) > -1) {
        return this.$message.error('不能添加重复值');
      }
      // 调用接口新增
      this.addLoading = true;
      let params = { productBId: this.ModalForm.bid, attributeValue: label, productSellAttributeValue: { sellAttrValue: value }};
      saveAttrValue(params).then(res => {
        this.getProductSaleAttrValue();
        this.addLoading = false;
      }).catch(err => {
        this.addLoading = false;
        this.$message.error(err.message)
      });
      // this.saleList['saleList' + index].push(value);
      this.categorySaleList[index - 1].attrValue = '';
    },
    closeChecks(index, tagIndex, item, label) {
      deleteProductSaleAttrValue({ psavBid: item.bid }).then(res => {
        this.saleList['saleList-' + label].splice(tagIndex, 1);
        if (this.categorySaleList[index - 1].checks.indexOf(item.sellAttrValue) > -1) {
          let spliceIndex = this.categorySaleList[index - 1].checks.indexOf(item.sellAttrValue);
          this.categorySaleList[index - 1].checks.splice(spliceIndex, 1)
          this.setSkuList()
        }
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    setSkuList() {
      this.skuList = this.categorySaleList.map(e => {
        return e.checks;
      });
    },
    getAllCategoryList() {
      getAllPublicCategory().then(res => {
        this.searchDataList = res.data || [];
      })
    },
    handleRemove(file, fileList) {
      if (file.id) {
        deleteTextImg({ id: file.id }).then(res => {
          this.$message.success('删除成功')
        }).catch(err => {
          this.$message.error(err.message)
        });
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleSuccess(res, file, fileList) {
      let obj = {
        productBId: this.ModalForm.bid,
        imagePath: res.data.filePath,
        imageUuid: res.data.UUID,
        imageName: file.name
      };
      saveTextImg(obj).then(res => {
        fileList.forEach(e => {
          if (!e.id) {
            e.id = res.data
          }
        });
        this.$message.success('上传成功')
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    handleExceed(files, fileList) {
      this.$message.warning(`最多只能上传5张图片`);
    },
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 3;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG,PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 3MB!');
      }
      return isJPG && isLt2M;
    },
    noEnbledCategoryModalList(val) {
      getAllCategoryModalList({ bid: val }).then(res => {
        this.modalList = res.data || [];
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    getCategoryModalDetail(val) {
      detailCategoryModal({ bid: val }).then(res => {
        this.categoryAttrList = (res.data.basePctd || []).map(e => {
          if (!e.pcabvlist) {
            e.pcabvlist = []
          }
          if (e.attributeType === 2) {
            e.check2 = [];
          }
          e.attrValue = '';
          return { ...e }
        });
        this.categorySaleList = (res.data.sellPctd || []).map((e, index) => {
          e.attributeValue = e.attributeName;
          e.checks = [];
          e.attrValue = '';
          this.$set(this.saleList, 'saleList-' + e.attributeValue, []);
          return { ...e }
        });
        if (this.templateBId !== val && this.ModalForm.bid) {
          this.updateProductTemplate()
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    updateProductTemplate() {
      let obj = {
        templateBId: this.ModalForm.templateBId,
        bid: this.ModalForm.bid,
        catalogBId: this.ModalForm.catalogBId,
        catalogBName: this.ModalForm.catalogBName
      };
      updateProductTemplate(obj).then(res => {
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    saveProductBase(name, type) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          let api = '';
          this.saveLoading = true;
          this.ModalForm.productType = type;
          if (this.ModalForm.bid) {
            api = editProduct
          } else {
            api = addProduct
          }
          api(this.ModalForm).then(res => {
            if (res.data.cnt === 1) {
              this.$message.success('保存成功');
              if (!this.editable) {
                this.ModalForm.bid = res.data.bid;
                this.catalogBId = res.data.catalogBId;
                this.templateBId = res.data.templateBId;
              }
            } else if (res.data.cnt === -1) {
              this.$message.error('已存在该商品编码');
            } else if (res.data.cnt === -2) {
              this.$message.error('已存在该商品名称');
            }
            setTimeout(() => {
              this.saveLoading = false;
            }, 200);
          }).catch(err => {
            this.saveLoading = false;
            this.$message.error(err.message)
          })
        } else {
          this.$message.error('请填写完整')
        }
      })
    }
  }
}
</script>

<style lang="scss">
  @import '~@/styles/variables.scss';
.addProduct {
  width: 90%;
  margin: 0 auto;
  padding-top: 20px;
  .panel-item {
    min-height: 70%;
    overflow: auto;
    overflow-x: hidden;
    padding: 20px 20px 0 20px;
    border: 1px solid $border-light-color;
    .noModal {
      text-align: center;
      padding: 15px 0;
      color: red;
    }
  }
  .sale-batch {
    text-align: right;
    padding: 10px 20px;
  }
  .product-footer {
    text-align: center;
    margin: 20px 0;
    button {
      margin:  0 20px;
    }
  }
  .hidden-control {
    >span {
      display: none;
    }
  }
  .arrowClass {
    vertical-align: -0.25em;
    color: #EAAF10;
  }
}
</style>

