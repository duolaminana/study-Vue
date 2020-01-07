<template>
  <div class="detailProduct">
    <div class="detailContent">
      <!--基本属性-->
      <el-tabs v-model="activeName">
        <el-tab-pane label="基本信息" name="1">
          <div class="panel-item">
            <el-form ref="productBaseInfo" :model="ModalForm" label-width="150px" size="small" :rules="formRules">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="商品编码" prop="productCode">
                    <el-input v-model="ModalForm.productCode" readonly placeholder="请输入商品编码" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="商品名称" prop="productName">
                    <el-input v-model="ModalForm.productName" readonly placeholder="请输入商品名称" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="所属类目" prop="cascaderArr">
                    <el-cascader
                      ref="catalogBName"
                      style="width: 100%"
                      v-model="ModalForm.cascaderArr"
                      :options="searchDataList"
                      :props="{value: 'bid', label: 'catalogName', children: 'children'}"
                      filterable
                      disabled
                      placeholder="可搜索"
                      change-on-select
                    ></el-cascader>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="类目模板" prop="templateBId">
                    <el-select v-model="ModalForm.templateBId" disabled placeholder="请选择状态" style="width: 224px">
                      <el-option v-for="(item, index) in modalList" :label="item.templateName" :value="item.bid" :key="index"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="海关编码" prop="customsCode">
                    <el-input v-model="ModalForm.customsCode" readonly placeholder="请输入商品编码" style="width: 100%" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="推广标题" prop="productHeadline">
                <el-input v-model="ModalForm.productHeadline" readonly placeholder="请输入商品名称" style="width: 100%" />
                <!--<span class="tips" style="display: block">标题和描述关键词请规范使用，以便站内和站外搜索</span>-->
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <!--类目属性-->
        <el-tab-pane label="类目属性" name="2">
          <div class="panel-item">
            <el-form ref="productCategoryAttr" label-width="150px" size="small">
              <el-form-item :label="item.attributeName" required v-for="(item, index) in categoryAttrList" :key="index">
                <el-radio-group v-model="item.attrValue" disabled v-if="item.attributeType === 1">
                  <el-radio :label="item1.attributeValue" v-for="(item1, index1) in item.pcavlist" :key="index1"></el-radio>
                </el-radio-group>
                <el-checkbox-group v-model="item.check2" disabled v-if="item.attributeType === 2">
                  <el-checkbox :label="item1.attributeValue" v-for="(item1, index1) in item.pcavlist" :key="index1"></el-checkbox>
                </el-checkbox-group>
                <el-select v-model="item.attrValue" disabled :placeholder="`请选择${item.attributeName}`" v-if="item.attributeType === 3" style="width: 60%">
                  <el-option v-for="(item1, index1) in item.pcavlist" :label="item1.attributeValue" :value="item1.attributeValue" :key="index1"></el-option>
                </el-select>
                <el-input v-if="item.attributeType === 4" v-model="item.attrValue" size="small" readonly :placeholder="`请输入${item.attributeName}`" style="width: 60%" />
                <el-input v-if="item.attributeType === 5" v-model="item.attrValue" type="textarea" :autosize="{ minRows: 4, maxRows: 6}" size="small" readonly :placeholder="`请输入${item.attributeName}`" style="width: 80%" />
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <!--销售属性-->
        <el-tab-pane label="销售属性" name="3">
          <div class="panel-item">
            <el-form ref="productSaleAttr" :model="ModalForm" label-width="150px" size="small" :rules="formRules">
              <div v-for="(item, index) in categorySaleList" :key="index">
                <el-form-item :label="item.attributeName">
                  <el-checkbox-group v-model="item.checks" disabled>
                    <el-checkbox :label="item1" v-for="(item1, index1) in saleList['saleList' + (index+1)]" :key="index1">
                      <el-tag type="info" size="small">{{item1}}</el-tag>
                    </el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </div>
              <el-form-item label="商品属性列表展示" style="width: 100%;padding-right: 10px">
                <el-table :data="skuList2" border fit size="small" :header-cell-style="{background: '#a7bfee'}">
                  <el-table-column align="center" type="index" width="55" label="序号"/>
                  <el-table-column align="center" label="商品属性" prop="attrValueList"/>
                  <el-table-column align="center" label="SKU编码" prop="skuCode"/>
                  <el-table-column align="center" width="150" label="起订量" prop="miniOrderNumber"/>
                  <el-table-column align="center" width="100" label="单位" prop="skuUnit"/>
                  <el-table-column align="center" width="150" label="允许小数位" prop="skuDecimalPlaces"/>
                  <el-table-column align="center" width="150" label="单包装数量" prop="skuSinglePackage"/>
                </el-table>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <!--图文描述-->
        <el-tab-pane label="图文描述" name="4">
          <el-form ref="productTextImg" :model="textImgForm" label-width="150px" size="small" :rules="textImgRules">
            <el-form-item label="电脑端商品图片" required>
              商品图片大小不能超过<span class="form-tips">3MB</span>。
              <!--<span class="form-tips">700*700</span>以上的图片上传后宝贝详情页自动提供放大镜功能。-->
              <!--第五张图发商品白底图可增加手淘首页曝光机会。-->
              <div class="imgPreview">
                <el-upload
                  :action="uploadActionUrl"
                  list-type="picture-card"
                  :file-list="imgList"
                  :on-preview="handlePictureCardPreview">
                  <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible" append-to-body>
                  <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
              </div>
            </el-form-item>
            <el-form-item label="电脑端描述" prop="detPcPage">
              <tinymce v-model="textImgForm.detPcPage" style="width: 80%" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="product-footer">
    <el-button type="danger" size="small" @click="closePage">返回</el-button>
    </div>
  </div>
</template>

<script>
import { uploadActionUrl } from '@/api/common'
import Tinymce from '@/components/Tinymce'
import {
  getAllPublicCategory,
  detailCategoryModal,
  getAllCategoryModalList,
  getCategoryAttr,
  getProductDetail,
  getTextImgInfo,
  getSaleAttr,
  getProductImgList
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
        detPcPage: '',
        productImgeList: []
      },
      textImgRules: {
        detPcPage: [{ required: true, message: '请填写商品图文', trigger: 'blur' }]
      }
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
    'ModalForm.catalogBId' (val) {
      if (val) {
        this.noEnbledCategoryModalList(val)
      }
    },
    'ModalForm.templateBId' (val) {
      if (val) {
        this.getCategoryModalDetail(val)
      } else {
        this.categoryAttrList = [];
        this.categorySaleList = [];
        this.saleList.saleList1 = [];
        this.saleList.saleList2 = [];
        this.saleList.saleList3 = [];
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
                  e.check2 = t.attrValue.split(',')
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
        if (res.data.productSellAttributeList && res.data.productSellAttributeList.length) {
          this.firstSave = false;
          this.categorySaleList = this.categorySaleList.map(e => {
            res.data.productSellAttributeList.forEach((t, index) => {
              if (e.attributeName === t.attributeValue) {
                e.attributeValue = e.attributeName;
                e.attrValue = '';
                e.checks = t.psabvList.map(n => { return n.sellAttrValue; });

                if (index === 0) {
                  this.saleList.saleList1 = t.psabvList.map(n => { return n.sellAttrValue; });
                } else if (index === 1) {
                  this.saleList.saleList2 = t.psabvList.map(n => { return n.sellAttrValue; });
                } else if (index === 2) {
                  this.saleList.saleList3 = t.psabvList.map(n => { return n.sellAttrValue; });
                }
              }
            });
            return { ...e }
          });
          this.skuList1 = res.data.skuList.map(e => { return { ...e } });
          this.skuList2 = res.data.skuList.map(e => { return { ...e } });
        } else {
          this.categorySaleList = this.categorySaleList.map(e => {
            e.checks = []
            return { ...e }
          });
          this.saleList.saleList1 = [];
          this.saleList.saleList2 = [];
          this.saleList.saleList3 = [];
          this.firstSave = true;
        }
        // this.setSkuList();
      }).catch(err => {
        this.$message.error(err.message)
      })
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
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
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
          return { ...e }
        });
        this.getCategoryAttr();
        this.getSaleAttr();
        this.getTextImg();
        this.getProductImgList();
      }).catch(err => {
        this.$message.error(err.message)
      })
    }
  }
}
</script>

<style lang="scss">
  @import '~@/styles/variables.scss';
  .detailProduct {
    width: 90%;
    margin: 0 auto;
    padding-top: 20px;
    .panel-item {
      min-height: 70%;
      overflow: auto;
      overflow-x: hidden;
      padding: 20px;
      border: 1px solid $border-light-color;
      .noModal {
        text-align: center;
        padding: 15px 0;
        color: red;
      }
    }
    .product-footer {
      text-align: center;
      margin: 20px 0;
      button {
        margin:  0 20px;
      }
    }
    .imgPreview {
      .el-upload--picture-card {
        display: none;
      }
      .el-icon-delete{
        display: none;
      }
    }
  }
</style>

