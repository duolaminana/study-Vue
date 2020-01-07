<template>
  <div class="app-container table-demo">
    <div class="search-box">
      <el-form label-width="90px" inline size="small">
        <div>
          <el-form-item :label="$t('query.tableLabel.CustomerName')">
            <el-input v-model="postData.buyer" clearable :placeholder="$t('query.placeholder.CustomerName')" style="width: 200px" />
          </el-form-item>
          <el-form-item :label="$t('query.tableLabel.CustomerCoding')">
            <el-input v-model="postData.customerCode" clearable :placeholder="$t('query.placeholder.CustomerCoding')" style="width: 200px" />
          </el-form-item>
          <el-form-item :label="$t('common.status')">
            <el-select v-model="postData.customizeStatus" clearable :placeholder="$t('product.product.selectStatus')" style="width: 200px">
              <el-option v-for="(item, index) in customizeStatusList" :label="item.label" :value="item.customizeStatus" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item style="padding-left: 110px;">
            <el-button type="primary" class="export" @click="searchData">{{$t('common.search')}}</el-button>
          </el-form-item>
        </div>
        <div>
          <el-form-item :label="$t('query.tableLabel.CustomOrderNumber')" label-width="">
            <el-input v-model="postData.customNo" clearable :placeholder="$t('query.placeholder.CustomOrderNumber')" style="width: 200px" />
          </el-form-item>
          <el-form-item :label="$t('system.userManage.country')" prop="countryCode">
            <el-select filterable remote :remote-method="getCountryList" :loading="loading1" v-model="postData.countryCode" clearable :placeholder="$t('system.business.searchCountryCode')" style="width: 200px">
              <el-option v-for="(item, index) in countryList" :label="item.chEnName" :value="item.countryCode" :key="index">
                {{item.searchStr}}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('query.tableLabel.InquiryTime')">
            <el-date-picker
              v-model="inquiryTime"
              type="daterange"
              align="right"
              unlink-panels
              clearable
              range-separator="~"
              :start-placeholder="$t('finance.financeService.start')"
              :end-placeholder="$t('finance.financeService.end')"
              style="width: 380px"
              :picker-options="pickerOptions"
              @change="getSearchTime">
            </el-date-picker>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="openDialog('add')">{{$t('common.add')}}</el-button>
      <el-button type="primary" size="small" @click="disableClick()">{{$t('common.delete')}}</el-button>
      <el-button type="primary" size="small" class="export" @click="exportCustomOrderExcelFun()">{{$t('system.route.export')}}</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="datalist"
      :element-loading-text="$t('system.userManage.loading')"
      type="expand"
      border
      fit
      size="mini"
      row-key="customOrderIds"
      :indent="indent"
      :expand-row-keys="expandArr"
      :header-cell-style="{background: '#a7bfee'}"
      @selection-change="getSelect">
      <el-table-column
        align="center"
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column :label="$t('query.tableLabel.CustomOrderNumber')" prop="tailormadeFormNumber" show-overflow-tooltip/>

      <el-table-column :label="$t('query.tableLabel.CustomerCompany')" prop="buyer" show-overflow-tooltip/>

      <el-table-column :label="$t('query.tableLabel.countryAndPhoneNumber')" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.buyerState }}/{{scope.row.buyerTelephone }}
        </template>
      </el-table-column>

      <el-table-column align="center" width="80" :label="$t('query.tableLabel.FileNum')" prop="fileNums"/>

      <el-table-column align="center" width="100" :label="$t('query.tableLabel.inquirer')" prop="customBy" show-overflow-tooltip>
        <!--<template slot-scope="scope">-->
          <!--{{scope.row.contactNameList[0].contactName }}-->
        <!--</template>-->
      </el-table-column>

      <el-table-column align="center" width="150" :label="$t('query.tableLabel.InquiryTime')" prop="inquiryTime">
        <template slot-scope="scope">
          {{scope.row.inquiryTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="80" :label="$t('common.status')" prop="customizeStatus">
        <template slot-scope="{row}">
          <el-tag :type="(row.customizeStatus === 1) ? 'danger' : 'primary'" size="mini">{{row.customizeStatus | customizeStatusFmt}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column header-align="center" :label="$t('common.table.actions')" width="190" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" class="export table-btn-width" @click="detailDialog(row)">{{$t('common.table.view')}}</el-button>
          <!--<el-button type="danger" size="mini" v-if="row.customizeStatus === 1 || row.customizeStatus === 2" @click="deleteClick(row)">删除</el-button>-->
          <el-button type="primary" size="mini" class="table-btn-width" v-if="row.customizeStatus === 2" @click="openQuoted(row)">{{$t('query.tableLabel.offer')}}</el-button>
          <el-button type="primary" size="mini" class="table-btn-width" v-if="row.customizeStatus === 1" @click="openDialog('edit',row)">{{$t('common.table.edit')}}</el-button>
          <span v-if="row.customizeStatus === 4 && row.quotedPriceList.length">
            <el-dropdown size="mini" v-if="row.quotedPriceList.length >1" type="primary" style="margin-left: 10px" @command="detailQuoted">
              <el-button type="primary" size="mini" class="export">{{$t('query.tableLabel.CheckTheQuotation')}}<i class="el-icon-arrow-down el-icon--right"></i></el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="(item,index) in row.quotedPriceList" :command="item.bid" :key="index">{{$t('query.tableLabel.quotationNumber')}}：{{item.quotedNo}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button type="primary" v-else size="mini" class="export table-btn-width" style="margin-left: 10px" @click="detailQuoted(row.quotedPriceList[0].bid)">{{$t('query.tableLabel.CheckTheQuotation')}}</el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList" ></Pagination>
    <!-- 选择添加定制单弹框 -->
    <el-dialog :visible.sync="dialogVisible" :title="detailModal?'查看定制需求单':(dialogType==='add'?$t('query.tableLabel.addCustomized'):$t('query.tableLabel.EditCustomized'))" center @closed="clearData" width="950px">
      <el-form ref="addCompany" v-if="dialogType==='edit' || detailModal" :model="customData" label-width="130px" label-position="right" inline size="small" :rules="menuDataRules">
        <el-form-item :label="'定制单号'" prop="tailormadeFormNumber">
          {{customData.tailormadeFormNumber}}
          <!--<el-input v-model="customData.tailormadeFormNumber" clearable :placeholder="$t('query.placeholder.email')" class="form-dialog-width" readonly/>-->
        </el-form-item>
        <el-form-item :label="'询价时间'" prop="inquiryTime">
          {{customData.inquiryTime | timeFmt}}
          <!--<el-input v-model="customData.inquiryTime" clearable :placeholder="$t('query.placeholder.email')" class="form-dialog-width" readonly/>-->
        </el-form-item>
      </el-form>
      <table class="form-table" border="0" cellspacing="0" cellpadding="0" style="width: 100%">
        <tr>
          <td style="width: 180px;">买方</td>
          <td>
            <el-select v-model="customData.customerBasicInfoBId" filterable clearable :placeholder="$t('system.userManage.userCompany')" style="width: 600px">
              <el-option v-for="(item, index) in customerInfoList" :label="item.companyName" :value="item.bid" :key="index"></el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <td style="width: 180px;">询价人</td>
          <td>
            <el-select v-model="customData.customBy" clearable :placeholder="$t('query.placeholder.selectInquirer')" :no-data-text="$t('query.noDataText')" style="width: 600px">
              <el-option v-for="(item, index) in modalList" :label="item.contactName" :value="item.accountBId" :key="index"></el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <td style="width: 180px;">地址</td>
          <td>
            <el-input v-model="customData.buyerAddress" clearable :placeholder="$t('query.placeholder.address')" style="width: 600px" readonly/>
          </td>
        </tr>
        <tr>
          <td style="width: 180px;">联系电话</td>
          <td>
            <el-input v-model="customData.buyerTelephone" clearable :placeholder="$t('query.placeholder.phone')" style="width: 600px" readonly/>
          </td>
        </tr>
        <tr>
          <td style="width: 180px;">联系人</td>
          <td>
            <el-input v-model="customData.buyerContact" clearable :placeholder="$t('query.placeholder.buyerContact')" style="width: 600px" />
          </td>
        </tr>
        <tr>
          <td style="width: 180px;">{{$t('common.personal.email')}}</td>
          <td>
            <el-input v-model="customData.buyerMailbox" clearable :placeholder="$t('query.placeholder.email')" style="width: 600px" readonly/>
          </td>
        </tr>
      </table>
      <div class="table-top">
        <div class="top-title"></div>
        <div class="top-btns" v-if="!detailModal">
          <el-button type="primary" size="small" @click="openGoodsDialog">选择商品</el-button>
          <el-button type="primary" size="small" @click="addSku">新增商品</el-button>
          <el-button type="danger" size="small" @click="deleteSku">删除</el-button>
        </div>
      </div>
      <el-table
        :data="dataList"
        border
        fit
        show-summary
        size="small"
        max-height="520"
        style="font-size: 12px;margin-bottom:20px;"
        :header-cell-style="{background: '#a7bfee'}"
        @selection-change="selectProd">

        <el-table-column align="center" type="selection" width="50"/>

        <el-table-column align="center" type="index" label="序号" width="55"/>

        <el-table-column align="center" min-width="80" label="商品" >
          <template slot-scope="scope">
            <el-input v-model="scope.row.productName" :autosize="{ minRows: 4, maxRows: 6}" size="small" clearable style="font-size: 12px"/>
          </template>
        </el-table-column>

        <el-table-column align="center" min-width="80" label="描述">
          <template slot-scope="scope">
            <el-input v-model="scope.row.attrValueList" :autosize="{ minRows: 4, maxRows: 6}" size="small" clearable style="font-size: 12px"/>
          </template>
        </el-table-column>

        <!--<el-table-column align="center" label="单价" prop="unitPrice"/>-->

        <!--<el-table-column align="center" label="起订金额" prop="mininumMoney"/>-->

        <el-table-column align="center" width="180px" label="备注">
          <template slot-scope="scope">
            <el-input v-model="scope.row.productRemark" :autosize="{ minRows: 4, maxRows: 6}" type="textarea" size="small" clearable style="font-size: 12px"/>
          </template>
        </el-table-column>

        <el-table-column align="center" min-width="90" label="数量">
         <template slot-scope="scope">
            <el-input-number v-model="scope.row.productQuantity" :autosize="{ minRows: 4, maxRows: 6}" type="textarea" size="small" clearable style="font-size: 12px"/>
          </template>
        </el-table-column>
      </el-table>
      <el-form ref="addCompany" :model="customData" label-width="130px" label-position="right" inline size="small" :rules="menuDataRules">
        <!-- <el-form-item :label="$t('query.tableLabel.CustomerInquirer')" prop="customBy">
          <el-select v-model="customData.customBy" clearable :placeholder="$t('query.placeholder.selectInquirer')" :no-data-text="$t('query.noDataText')" class="form-dialog-width">
            <el-option v-for="(item, index) in modalList" :label="item.contactName" :value="item.accountBId" :key="index"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item :label="'起运港/地址'" prop="departurePort">
          <el-input v-model="customData.departurePort" clearable placeholder="起运港/地址" class="form-dialog-width"/>
        </el-form-item>
        <el-form-item :label="'发货日期'" prop="dateOfDelivery">
          <el-input v-model="customData.dateOfDelivery" clearable placeholder="发货日期" class="form-dialog-width"/>
        </el-form-item>
        <el-form-item :label="'运输'" prop="transportation">
          <el-radio-group v-model="customData.transportation" style="width:300px;">
            <el-radio :label="1">委托卖方</el-radio>
            <el-radio :label="2">自提</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="'运输方式'" prop="transportationWay">
          <el-select v-model="customData.transportationWay" placeholder="请选择运输方式" class="form-dialog-width">
              <el-option label="汽运" :value="0"></el-option>
              <el-option label="铁路" :value="1"></el-option>
              <el-option label="海运" :value="2"></el-option>
              <el-option label="空运" :value="3"></el-option>
            </el-select>
        </el-form-item>
        <!-- <el-form-item :label="$t('common.personal.email')" prop="buyerMailbox">
          <el-input v-model="customData.buyerMailbox" clearable :placeholder="$t('query.placeholder.email')" class="form-dialog-width" readonly/>
        </el-form-item>
        <el-form-item :label="$t('system.userManage.address')" prop="buyerAddress">
          <el-input v-model="customData.buyerAddress" clearable :placeholder="$t('query.placeholder.address')" class="form-dialog-width" readonly/>
        </el-form-item>
        <el-form-item :label="$t('common.personal.telephone')" prop="buyerTelephone">
          <el-input v-model="customData.buyerTelephone" clearable :placeholder="$t('query.placeholder.phone')" class="form-dialog-width" readonly/>
        </el-form-item> -->
        <!--<el-form-item label="联系人" prop="contactBy">-->
          <!--<el-input v-model="customData.contactBy" clearable placeholder="输入联系人" class="form-dialog-width" />-->
        <!--</el-form-item>-->
        <!-- <el-form-item :label="$t('query.tableLabel.CustomizedQuantity')" prop="customQuantity">
          <el-input-number :min="0" :step="1" :precision="0" controls-position="right" v-model="customData.customQuantity" clearable :placeholder="$t('query.placeholder.CustomizedQuantity')" class="form-dialog-width"/>
        </el-form-item> -->
        <!--<el-form-item label="定制关键词" prop="customKeyword">-->
          <!--<el-input v-model="customData.customKeyword" clearable placeholder="请输入关键词" class="form-dialog-width" style="width: 744px"/>-->
        <!--</el-form-item>-->
        <el-form-item :label="$t('query.tableLabel.DestinationPortAddr')" prop="destinationPort">
          <el-input v-model="customData.destinationPort" clearable :placeholder="$t('query.placeholder.DestinationPort')" class="form-dialog-width" style="width: 744px"/>
        </el-form-item>
        <!-- <el-form-item :label="$t('query.tableLabel.QuotationType')" prop="quoteType">
          <el-select v-model="customData.quoteType" clearable :placeholder="$t('query.placeholder.QuotationType')" class="form-dialog-width" style="width: 120px">
            <el-option v-for="(item, index) in quoteTypeList" :label="item.label" :value="item.quoteType" :key="index"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item :label="$t('system.business.payModeArr')" prop="paymentMethods">
          <el-select v-model="customData.paymentMethods" clearable :placeholder="$t('query.placeholder.payModeArr')" class="form-dialog-width" style="width: 120px">
            <el-option v-for="(item, index) in paymentMethodsList" :label="item.label" :value="item.paymentMethods" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('finance.financeService.currency')" prop="currency">
          <el-select filterable remote :remote-method="getCurrencyCodeList" :loading="loading2" v-model="customData.currency" clearable :placeholder="$t('system.business.searchCurrencyCode')" style="width: 215px">
            <el-option v-for="(item, index) in currencyList" :label="item.searchCurrencyCodeStr" :value="item.searchCurrencyCodeStr" :key="index">
              {{item.searchCurrencyCodeStr}}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('query.tableLabel.PaymentLot')+':'">
          <table border="0" cellspacing="0" cellpadding="0" class="tableSet">
            <thead>
            <tr>
              <th>{{$t('common.table.id')}}</th>
              <th>{{$t('system.business.nodeName')}}</th>
              <th>{{$t('system.business.paymentRatio')}}</th>
              <th>{{$t('system.business.dayNum')}}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in controlTowerList" :key="index">
              <td>{{index + 1}}</td>
              <td>{{item.nodeName}}</td>
              <td>
                <el-input v-model.number="item.paymentRatio" type="number" :min="0" :precision="0" clearable style="width: 200px" >
                  <template slot="append">%</template>
                </el-input>
              </td>
              <td>
                <el-input v-model.number="item.dayNum" type="number" :min="0" :precision="0" clearable style="width: 200px" >
                  <template slot="append">{{$t('system.sysPwdSet.day')}}</template>
                </el-input>
              </td>
            </tr>
            </tbody>
          </table>
        </el-form-item>
        <el-form-item :label="$t('query.tableLabel.CustomizedNotes')" prop="remark">
          <el-input v-model="customData.remark" type="textarea" :rows="5" clearable :placeholder="$t('query.placeholder.CustomizedNotes')" class="form-dialog-width" style="width: 744px"/>
        </el-form-item>
        <el-form-item :label="$t('query.tableLabel.AppendixUpload')">
          <el-upload
            v-if="!detailModal"
            class="upload-demo"
            ref="upload"
            :show-file-list="false"
            :action="uploadActionUrl"
            :headers="upLoadHeaders"
            :on-success="handleSuccess"
            :on-remove="handleRemove"
            :before-upload="beforeUpload"
            :file-list="filesList">
            <el-button size="small" type="primary">{{$t('query.tableLabel.ClickUpload')}}</el-button>
            <!--<div slot="tip" class="el-upload__tip">只能上传word/pdf，且不超过10M</div>-->
          </el-upload>
        </el-form-item>
      </el-form>
      <el-table
        :data="filesList"
        border
        fit
        style="margin: 10px 0"
        size="small"
        :header-cell-style="{background: '#a7bfee'}">
        <el-table-column align="center" :label="$t('query.tableLabel.AnnexName')" prop="attachmentName">
        </el-table-column>
        <el-table-column align="center" :label="$t('common.table.actions')" >
          <template slot-scope="scope">
            <el-button type="primary" size="mini" class="export" @click="exportPactFile(scope.row)">{{$t('query.tableLabel.DownloadAttachments')}}</el-button>
            <el-button type="primary" size="mini" v-if="!detailModal" @click="removeFile(scope)">{{$t('common.table.delete')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" v-if="!detailModal" @click="saveClick('addCompany', dialogType === 'add' ? 1 : 2)">{{$t('common.buttonText.save')}}</el-button>
        <el-button type="primary" size="small" v-if="!detailModal" @click="sumbitClick('addCompany', dialogType === 'add' ? 1 : 2)">{{$t('common.buttonText.submit')}}</el-button>
        <el-button type="danger" size="small" @click="dialogVisible=false">{{detailModal?'关闭':$t('common.buttonText.cancel')}}</el-button>
      </div>
    </el-dialog>
    <!-- 选择商品弹框 -->
    <el-dialog :visible.sync="goodsDialogVisible" title="选择商品" width="1000px" center close-on-click-modal>
      <el-form ref="editForm" :model="searchObj" label-width="100px" label-position="right" inline size="small">
        <el-form-item label="所属类目">
          <el-cascader
            style="width: 240px"
            v-model="parentsName"
            :options="searchDataList"
            :props="{value: 'bid', label: 'catalogName', children: 'children'}"
            filterable
            clearable
            placeholder="可搜索"
            change-on-select
            @change="getGoodsParentId"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="商品编码" prop="productCode">
          <el-input v-model="searchObj.productCode" clearable placeholder="商品名称" style="width: 240px"/>
        </el-form-item>
        <el-form-item label="商品名称" prop="productName">
          <el-input v-model="searchObj.productName" clearable placeholder="商品名称" style="width: 240px"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="export" @click="searchProductSku">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="listLoading1"
        :data="productSkuList"
        element-loading-text="正在查询中。。。"
        border
        fit
        size="mini"
        :header-cell-style="{background: '#a7bfee'}"
        @selection-change="getSelect">
        <el-table-column
          align="center"
          type="selection"
          width="55">
        </el-table-column>

        <el-table-column align="center" width="180" label="所属类目" prop="catalogBName" />

        <el-table-column align="center" label="商品名称" prop="productName"/>

        <el-table-column align="center" width="100" label="商品编码" prop="productCode"/>

        <el-table-column align="center" min-width="180px" label="SKU" prop="attrValueList" />

        <el-table-column align="center" width="80" label="起订量" prop="mininum" />

        <el-table-column align="center" width="80" label="单价" prop="unitPrice" />
      </el-table>

      <Pagination :total="searchObj.total" :page.sync="searchObj.pageNum" :limit.sync="searchObj.pageSize" @pagination="getQuotedProductSku"></Pagination>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="addQuotedSku">保存</el-button>
        <el-button type="danger" size="small" @click="goodsDialogVisible=false">取消</el-button>
      </div>
    </el-dialog>
    <!--  -->
    <!-- <el-dialog :visible.sync="detailModal" :title="$t('query.tableLabel.details')" center @closed="clearData" width="950px">
      <el-form ref="addCompany" :model="customData" label-width="130px" label-position="right" inline size="small" :rules="menuDataRules">
        <el-form-item :label="$t('query.tableLabel.CustomOrderNumber')" prop="customNo">
          <div style="width: 180px;padding-left: 15px;padding-right: 283px;">
            {{customData.customNo}}
          </div>
        </el-form-item>
        <el-form-item :label="$t('query.tableLabel.InquiryTime')" prop="inquiryTime">
          <div style="padding-left: 15px;">
            {{customData.inquiryTime | timeFmt}}
          </div>
        </el-form-item>
        <el-form-item :label="$t('query.tableLabel.Customer')" prop="customerBasicInfoBId">
          <el-select v-model="customData.customerBasicInfoBId" clearable disabled :placeholder="$t('system.userManage.userCompany')" class="form-dialog-width">
            <el-option v-for="(item, index) in customerInfoList" disabled :label="item.companyName" :value="item.bid" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('query.tableLabel.inquirer')" prop="customBy">
          <el-select v-model="customData.customBy" clearable disabled :placeholder="$t('query.placeholder.selectInquirer')" :no-data-text="$t('query.noDataText')" class="form-dialog-width">
            <el-option v-for="(item, index) in modalList" disabled :label="item.contactName" :value="item.accountBId" :key="index"></el-option>
          </el-select>
        </el-form-item>
          <el-form-item :label="$t('common.personal.email')" prop="buyerMailbox">
            <el-input v-model="customData.buyerMailbox" clearable :placeholder="$t('query.placeholder.email')" class="form-dialog-width" readonly />
          </el-form-item>
        <el-form-item :label="$t('system.userManage.address')" prop="buyerAddress">
          <el-input v-model="customData.buyerAddress" clearable :placeholder="$t('query.placeholder.address')" class="form-dialog-width" readonly/>
        </el-form-item>
          <el-form-item :label="$t('common.personal.telephone')" prop="buyerTelephone">
            <el-input v-model="customData.buyerTelephone" clearable :placeholder="$t('query.placeholder.phone')" class="form-dialog-width" readonly />
          </el-form-item>
          <el-form-item :label="$t('query.tableLabel.CustomizedQuantity')" prop="customQuantity">
            <el-input-number :min="0" :step="1" :precision="0" controls-position="right" v-model="customData.customQuantity" clearable :placeholder="$t('query.placeholder.CustomizedQuantity')" class="form-dialog-width" disabled/>
          </el-form-item>
          <el-form-item :label="$t('query.tableLabel.DestinationPortAddr')" prop="portPlace">
            <el-input v-model="customData.portPlace" clearable :placeholder="$t('query.placeholder.DestinationPort')" class="form-dialog-width" style="width: 744px" readonly/>
          </el-form-item>
          <el-form-item :label="$t('system.business.payModeArr')" prop="paymentMethods">
            <el-select v-model="customData.paymentMethods" clearable :placeholder="$t('query.placeholder.payModeArr')" class="form-dialog-width" style="width: 120px">
              <el-option v-for="(item, index) in paymentMethodsList" disabled :label="item.label" :value="item.paymentMethods" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('finance.financeService.currency')" prop="currency">
            <el-select filterable remote :remote-method="getCurrencyCodeList" :loading="loading2" v-model="customData.currency" clearable :placeholder="$t('system.business.searchCurrencyCode')" style="width: 215px">
              <el-option v-for="(item, index) in currencyList" disabled :label="item.searchCurrencyCodeStr" :value="item.searchCurrencyCodeStr" :key="index">
              </el-option>
            </el-select>
          </el-form-item>
        <el-form-item :label="$t('query.tableLabel.payment')+':'">
          <table border="0" cellspacing="0" cellpadding="0" class="tableSet">
            <thead>
            <tr>
              <th>{{$t('common.table.id')}}</th>
              <th>{{$t('system.business.nodeName')}}</th>
              <th>{{$t('system.business.paymentRatio')}}</th>
              <th>{{$t('system.business.dayNum')}}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in controlTowerList" :key="index">
              <td>{{index + 1}}</td>
              <td>{{item.nodeName}}</td>
              <td>
                {{item.paymentRatio}}%
              </td>
              <td>
                {{item.dayNum}}{{$t('system.sysPwdSet.day')}}
              </td>
            </tr>
            <tr v-if="!controlTowerList.length">
              <td colspan="4" style="text-align: center;padding: 5px">{{$t('query.tableLabel.nodata')}}</td>
            </tr>
            </tbody>
          </table>
        </el-form-item>
          <el-form-item :label="$t('query.tableLabel.CustomizedNotes')" prop="remark">
            <el-input v-model="customData.remark" type="textarea" :rows="5" clearable :placeholder="$t('query.placeholder.CustomizedNotes')" class="form-dialog-width" style="width: 744px" readonly />
          </el-form-item>
          <el-form-item :label="$t('finance.financeService.fileType')">
          </el-form-item>
          <el-table
            :data="filesList"
            border
            fit
            style="margin: 10px 0;width: 100%"
            size="small"
            :header-cell-style="{background: '#a7bfee'}">
            <el-table-column align="center" :label="$t('query.tableLabel.AnnexName')" prop="attachmentName">
            </el-table-column>
            <el-table-column align="center" :label="$t('common.table.actions')" >
              <template slot-scope="scope">
                <el-button type="primary" size="mini" class="export" @click="exportPactFile(scope.row)">{{$t('query.tableLabel.DownloadAttachments')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="danger" size="small" @click="detailModal=false">{{$t('common.buttonText.close')}}</el-button>
        </div>
    </el-dialog> -->
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getPublicCategory, getQuotedProductSku } from '@/api/product'
import { selectCountryListApi, selectCurrencyCodeListApi, selectControlTowerListApi } from '@/api/system'
import { uploadActionUrl } from '@/api/common'
import { selectCustomOrderListAllApi, saveAdminCustomApi, submitAdminCustomApi, deleteCustomByIdApi, deleteCustomOrderIdsApi, downloadApi, exportCustomOrderExcelApi } from '@/api/inquiry'
import { listCustomerInfoContactApi, getCustomerInfo } from '@/api/customer'
import { deepClone, parseTime } from '@/utils/index'
import { getToken } from '@/utils/auth'
export default {
  components: {
    Pagination
  },
  filters: {
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
    },
    customizeStatusFmt(val) {
      switch (val) {
        // 定制状态（1-编辑中，2-未报价，3-报价中，4-已报价   5 拒绝报价  7 报价审核通过  8 报价审批未通过）
        case 1: return '编辑中';
        case 2: return '未报价';
        case 3: return '报价中';
        case 4: return '已报价';
        case 5: return '拒绝报价';
        case 7: return '报价审核通过';
        case 8: return '报价审核未通过';
        default:
          return '不存在';
      }
    }
  },
  data() {
    return {
      uploadActionUrl,
      datalist: [],
      loading1: false,
      loading2: false,
      loading3: false,
      countryList: [],
      currencyList: [],
      customerInfoList: [],
      companyName: '',
      modalList: [],
      filesList: [],
      orderPayNodeList: [],
      customizeOrderPayNodeList: [],
      selectProdList: [],
      selectList: [],
      list: null,
      listLoading: true,
      listLoading1: false,
      dialogVisible: false,
      productSkuList: [],
      dataList: [],
      parentsName: [],
      searchDataList: [],
      goodsDialogVisible: false,
      detailModal: false,
      dialogType: '',
      indent: 20,
      expandArr: [1036013, 1036014],
      controlTowerList: [],
      customData: {
        filesList: [],
        orderPayNodeList: [],
        customizeOrderPayNodeList: [],
        contactNameList: [],
        attachmentName: '',
        attachmentPath: '',
        customerBasicInfoBId: '',
        customBy: '',
        buyerMailbox: '',
        transportation: 1,
        transportationWay: 1,
        buyerTelephone: '',
        contactBy: '',
        customQuantity: '',
        customKeyword: '',
        buyerAddress: '',
        destinationPort: '',
        departurePort: '',
        dateOfDelivery: '',
        portPlace: '',
        quoteType: 0,
        currency: '',
        paymentMethods: 1,
        remark: '',
        inquiryTime: '',
        customNo: '',
        companyName: '',
        contactName: '',
        customBId: '',
        paymentRatio: '',
        dayNum: '',
        id: '',
        buyerContact: ''
      },
      menuDataRules: {
        customerBasicInfoBId: [
          { required: true, message: '客户公司不为空', trigger: 'change' }
        ],
        customBy: [
          { required: true, message: '询价人不为空', trigger: 'blur' }
        ],
        destinationPort: [
          { required: true, message: '目的港口不为空', trigger: 'change' }
        ],
        quoteType: [
          { required: true, message: '报价类型不为空', trigger: 'change' }
        ],
        paymentMethods: [
          { required: true, message: '付款方式不为空', trigger: 'change' }
        ],
        currency: [
          { required: true, message: '币种不为空', trigger: 'change' }
        ]
      },
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        buyer: '',
        customerCode: '',
        countryCode: '',
        customizeStatus: '',
        inquiryTime: '',
        startTime: '',
        endTime: '',
        customNo: ''
      },
      reviewForm: {
        customOrderIds: '',
        delFlag: 1
      },
      dataId: '1',
      inquiryTime: [],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      customizeStatusList: [
        // 定制状态（1-编辑中，2-未报价，3-报价中，4-已报价）
        {
          label: '编辑中',
          customizeStatus: 1
        },
        {
          label: '未报价',
          customizeStatus: 2
        },
        {
          label: '报价中',
          customizeStatus: 3
        },
        {
          label: '已报价',
          customizeStatus: 4
        },
        {
          label: '拒绝报价',
          customizeStatus: 5
        },
        {
          label: '审核通过',
          customizeStatus: 6
        },
        {
          label: '审核未通过',
          customizeStatus: 7
        }
      ],
      quoteTypeList: [
        // 报价类型（0-EXW,1-FOB）
        {
          label: 'EXW',
          quoteType: 0
        },
        {
          label: 'FOB',
          quoteType: 1
        }
      ],
      paymentMethodsList: [
        // 付款方式:1、T/T；2、L/C；3、P/A；4、D/A
        {
          label: 'T/T',
          paymentMethods: 1
        },
        {
          label: 'L/C',
          paymentMethods: 2
        },
        {
          label: 'P/A',
          paymentMethods: 3
        },
        {
          label: 'D/A',
          paymentMethods: 4
        }
      ],
      editFlagNum: 0,
      searchObj: {
        productCode: '',
        productName: '',
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      upLoadHeaders: {
        token: getToken()
      }
    }
  },
  watch: {
    'customData.customerBasicInfoBId' (val, oldVal) {
      this.editFlagNum++;
      if (val && !oldVal) {
        this.customerContactFun(val);
        if (this.dialogType === 'add') {
          let obj = this.customerInfoList.filter(e => e.bid === val)[0];
          this.customData.buyerAddress = obj.officeAddress;
          this.customData.buyerTelephone = obj.mobilePhone;
          this.customData.buyerMailbox = obj.emailAddress;
        }
      } else if (val && oldVal) {
        this.customerContactFun(val);
        let obj = this.customerInfoList.filter(e => e.bid === val)[0];
        this.customData.customBy = '';
        this.customData.buyerAddress = obj.officeAddress;
        this.customData.buyerTelephone = obj.mobilePhone;
        this.customData.buyerMailbox = obj.emailAddress;
      } else {
        this.customData.customBy = '';
        this.customData.buyerAddress = '';
        this.customData.buyerTelephone = '';
        this.customData.buyerMailbox = '';
        this.controlTowerList = [];
        this.modalList = []
      }
    }
  },
  computed: {
    totalSum() {
      let val = 0;
      this.controlTowerList.forEach(e => {
        val += Number(e.paymentRatio)
      });
      return val;
    }
  },
  created() {
    this.getCustomerInfoListFun(); // 客户人列表
    this.getDataList();
    this.getAllDataList()
  },
  methods: {
    addSku() {
      this.dataId = this.dataId + '1';
      this.dataList.push({ dataId: this.dataId })
    },
    deleteSku() {
      for (let i = 0; i < this.dataList.length; i++) {
        if (this.dataList[i].dataId) {
          this.selectProdList.forEach(e => {
            if (e.dataId === this.dataList[i].dataId) {
              this.dataList.splice(i, 1)
            }
          })
        } else {
          this.selectProdList.forEach(e => {
            if (e.skuBId === this.dataList[i].skuBId) {
              this.dataList.splice(i, 1)
            }
          })
        }
      }
    },
    getAllDataList() {
      getPublicCategory({ pageSize: 999, pageNum: 1 }).then(res => {
        this.searchDataList = res.data.list;
      })
    },
    addQuotedSku() {
      if (!this.selectList.length) {
        return this.$message.warning('请先选择商品')
      }
      let skuBIdArr = this.dataList.map(e => e.skuBId);
      let arr = this.selectList.map(e => {
        return {
          attrValueList: e.attrValueList,
          catalogBName: e.catalogBName,
          skuBId: e.skuBId,
          skuCode: e.skuCode,
          productCode: e.productCode,
          productName: e.productName,
          productBId: e.bid,
          unitPrice: e.unitPrice,
          mininum: e.mininum,
          productImge: e.imagePath,
          customsCode: e.customsCode,
          singleBulk: e.singleBulk,
          singlePackage: e.singlePackage,
          singleWeight: e.singleWeight,
          mininumMoney: e.mininum * e.unitPrice,
          quoteNumber: 0,
          quotePrice: 0,
          quoteMoney: 0
        }
      }).filter(t => {
        return !skuBIdArr.includes(t.skuBId)
      });
      this.dataList = this.dataList.concat(arr);
      this.goodsDialogVisible = false
    },
    searchProductSku() {
      this.searchObj.pageNum = 1;
      this.getQuotedProductSku();
    },
    getGoodsParentId(arr) {
      if (arr.length) {
        this.searchObj.catalogBId = arr.join(',');
      } else {
        this.searchObj.catalogBId = '';
      }
    },
    openGoodsDialog() {
      this.selectList = [];
      this.goodsDialogVisible = true;
      this.getQuotedProductSku()
    },
    getQuotedProductSku() {
      let obj = {};
      for (let key in this.searchObj) {
        if (this.searchObj[key]) {
          obj[key] = this.searchObj[key]
        }
      }
      this.listLoading1 = true;
      getQuotedProductSku(obj).then(res => {
        this.productSkuList = res.data.list.map(e => {
          e.mininum = e.mininum || 0;
          e.unitPrice = e.unitPrice || 0;
          return { ...e }
        });
        this.searchObj.total = res.data.total;
        this.listLoading1 = false;
      }).catch(() => {
        this.listLoading1 = false;
      })
    },
    searchData() {
      this.postData.pageNum = 1;
      this.getDataList()
    },
    getDataList() {
      selectCustomOrderListAllApi(this.postData).then(res => {
        this.datalist = res.data.list;
        this.postData.total = res.data.total;
      }).catch(err => {
        this.$message(err.message);
      });
      this.listLoading = false;
    },
    // 根据类型查询流程控制列表
    selectControlTowerListFun() {
      selectControlTowerListApi({ nodeType: 2 }).then(res => {
        this.controlTowerList = res.data.map(e => {
          if (this.customData.customizeOrderPayNodeList && this.customData.customizeOrderPayNodeList.length) {
            this.customData.customizeOrderPayNodeList.forEach(t => {
              if (e.nodeName === t.nodeName) {
                e.paymentRatio = t.paymentRatio;
                e.dayNum = t.dayNum;
              }
            });
          }
          return { ...e }
        });
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    // 客户人列表
    getCustomerInfoListFun() {
      listCustomerInfoContactApi().then(res => {
        this.customerInfoList = res.data || []
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    getParentId(arr) {
      if (arr.length) {
        this.customData.customerBasicInfoBId = arr.customerBasicInfoBId
      } else {
        this.customData.customerBasicInfoBId = '';
      }
    },
    openDialog(type, row) {
      if (type === 'edit') {
        this.customData = deepClone(row);
        this.customData.paymentMethods = Number(this.customData.paymentMethods);
        this.controlTowerList = row.customizeOrderPayNodeList;
        this.filesList = row.filesList;
        this.dataList = row.customizeProductList;
        // this.selectControlTowerListFun();
      }
      this.dialogType = type;
      this.dialogVisible = true;
      this.detailModal = false;
    },
    // 查看详情
    detailDialog(row) {
      this.customData = deepClone(row);
      this.customData.paymentMethods = Number(this.customData.paymentMethods);
      this.filesList = row.filesList;
      this.controlTowerList = row.customizeOrderPayNodeList;
      this.dataList = row.customizeProductList;
      // this.selectControlTowerListFun();
      this.detailModal = true;
      this.dialogVisible = true;
    },
    // 报价按钮
    openQuoted(row) {
      console.log(row)
      this.$router.push({
        path: '/query/editQuoted',
        query: {
          customBId: row.bid
        }
      })
    },
    // 查看询价按钮
    detailQuoted(id) {
      this.$router.push({
        path: '/query/detailQuoted',
        query: { id }
      })
    },
    // 暂存操作
    saveClick(formName) {
      if (this.totalSum !== 100) {
        return this.$message.warning('付款条件比例必须等于100');
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.customData.filesList = this.filesList;
          this.customData.customizeProductList = this.dataList;
          this.customData.customizeOrderPayNodeList = this.controlTowerList.map(e => {
            return { ...e }
          });
          saveAdminCustomApi(this.customData).then(res => {
            if (res.status === 200) {
              this.$message.success("保存成功");
              this.$refs[formName].resetFields();
              this.dialogVisible = false;
              this.getDataList();
            } else {
              this.listLoading = false;
              this.dialogVisible = false;
              this.$message.error('异常提示：' + res.message);
            }
          });
        } else {
          this.$message.warning('验证未通过');
          return false;
        }
      });
    },
    // 提交操作
    sumbitClick(formName) {
      if (this.totalSum !== 100) {
        return this.$message.warning('付款条件比例必须等于100');
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.customData.filesList = this.filesList;
          this.customData.customizeProductList = this.dataList;
          this.customData.customizeOrderPayNodeList = this.controlTowerList.map(e => {
            return { ...e }
          });
          submitAdminCustomApi(this.customData).then(res => {
            if (res.status === 200) {
              this.$message.success("提交成功");
              this.$refs[formName].resetFields();
              this.dialogVisible = false;
              this.getDataList();
            } else {
              this.listLoading = false;
              this.dialogVisible = false;
              this.$message.error('异常提示：' + res.message);
            }
          });
        } else {
          this.$message.warning('验证未通过');
          return false;
        }
      });
    },
    // 删除接口
    deleteClick(row) {
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        let obj = {
          id: row.id,
          customBId: row.customBId,
          delFlag: 1
        };
        deleteCustomByIdApi(obj).then(res => {
          if (res.status === 200) {
            this.$message.success(res.message);
          }
          this.getDataList();
        }).catch(err => {
          this.$message.error(err.message);
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    },
    selectProd(selects) {
      this.selectProdList = selects;
    },
    // 勾选触发 selects为选择的数据数组
    getSelect(selects) {
      this.selectList = selects;
    },
    // 批量删除接口
    disableClick() {
      if (!this.selectList.length) {
        return this.$message('请选择数据');
      }
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.reviewForm.customOrderIds = this.selectList.map(e => {
          return e.id;
        }).join(',');
        deleteCustomOrderIdsApi(this.reviewForm).then(res => {
          if (res.status === 200) {
            this.$message.success(res.message);
          }
          this.getDataList();
        }).catch(err => {
          this.$message.error(err.message);
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    },
    // 导出定制单列表Excel数据
    exportCustomOrderExcelFun() {
      exportCustomOrderExcelApi(this.postData).then(res => {
        const link = document.createElement('a');
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        link.style.display = 'none';
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'customOrder定制单.xls');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link)
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    getSearchTime(date) {
      if (date && date.length) {
        this.postData.startTime = date[0];
        this.postData.endTime = date[1]
      } else {
        this.postData.startTime = '';
        this.postData.endTime = ''
      }
    },
    // 查询获取国家
    getCountryList(query) {
      if (query !== '') {
        this.loading1 = true;
        setTimeout(() => {
          this.loading1 = false;
          selectCountryListApi(query).then(res => {
            this.countryList = res.data || []
          })
        }, 200);
      } else {
        this.countryList = [];
      }
    },
    // 查询获取币种
    getCurrencyCodeList(query) {
      if (query !== '') {
        this.loading2 = true;
        setTimeout(() => {
          this.loading2 = false;
          selectCurrencyCodeListApi(query).then(res => {
            this.currencyList = res.data || []
          })
        }, 200);
      } else {
        this.currencyList = [];
      }
    },
    // 客户下的联系人列表
    customerContactFun(val) {
      getCustomerInfo({ bid: val }).then(res => {
        let payterms = res.data.customerPaymentTerms.customerOrderPayNodeList;
        this.modalList = res.data.customerContactList || [];
        if ((this.dialogType !== 'add' && this.editFlagNum !== 1) || this.dialogType === 'add') {
          if (this.customData.customizeOrderPayNodeList.length > 0) {
            this.controlTowerList = this.customData.customizeOrderPayNodeList;
          } else {
            this.controlTowerList = payterms && payterms.length ? payterms : res.data.customerPaymentTerms.sysOrderPayNodeList;
          }
        }
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 清空数据
    clearData() {
      this.editFlagNum = 0;
      this.filesList = [];
      this.dataList = [];
      this.customData.orderPayNodeList = [];
      this.customizeOrderPayNodeList = [];
      this.customData.customizeOrderPayNodeList = [];
      this.customData.id = '';
      this.customData.bid = '';
      this.customData.paymentRatio = '';
      this.dayNum = '';
      this.customBId = '';
      this.customData.attachmentName = '';
      this.customData.attachmentPath = '';
      this.customData.customerBasicInfoBId = '';
      this.customData.customBy = '';
      this.customData.buyerMailbox = '';
      this.customData.buyerContact = '';
      this.customData.buyerTelephone = '';
      this.customData.contactBy = '';
      this.customData.customQuantity = '';
      this.customData.customKeyword = '';
      this.customData.buyerAddress = '';
      this.customData.destinationPort = '';
      this.customData.departurePort = '';
      this.customData.dateOfDelivery = '';
      this.customData.transportation = 1;
      this.customData.transportationWay = 1;
      this.customData.quoteType = 0;
      this.customData.currency = '';
      this.customData.paymentMethods = 1;
      this.customData.remark = '';
      this.controlTowerList = [];
      this.getDataList();
    },
    // 删除协议
    removeFile(scope) {
      this.filesList.splice(scope.$index, 1)
    },
    // 下载协议
    exportPactFile(row) {
      window.open(row.attachmentPath)
    },
    // 多附件打包下载
    downloadFilesListFun2(customBId) {
      let date = {
        customBId: customBId
      };
      // debugger;
      downloadApi(date).then(res => {
        // if (res.status === 200) {
        //   this.$message.success("下载成功");
        //   this.getDataList();
        // } else {
        //   this.$message.error('异常提示：' + res.message);
        // }
      }).catch(err => {
        console.info("2=====>" + err);
        this.$message.error('下载失败' + err.message);
      });
    },
    downloadFilesListFun() {
      let data = {
        customBId: this.customData.customBId
      };
      console.log("customBId =====>" + this.customData.customBId);
      downloadApi(data).then(res => {
        const link = document.createElement('a');
        let blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
        link.style.display = 'none';
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'customOrderFile.zip');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link)
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    // 上传文件删除
    handleRemove(file, filesList) {
      this.customData.attachmentName = '';
      this.customData.attachmentPath = '';
    },
    // 上传成功
    handleSuccess(res, file, filename) {
      this.customData.attachmentName = file.name;
      this.customData.attachmentPath = res.data.filePath;
      this.filesList.push({ attachmentName: this.customData.attachmentName, attachmentPath: this.customData.attachmentPath });
    },
    // 上传之前限制
    beforeUpload(file) {
      for (let i = 0; i < this.filesList.length; i++) {
        if (this.filesList[i].attachmentName === file.name) {
          this.$message.error('已有文件不能重复上传');
          return false
        }
      }
      // let testmsg = file.name.substring(file.name.lastIndexOf('.') + 1);
      // const extension = testmsg === 'PDF';
      // const extension2 = testmsg === 'pdf';
      // const extension3 = testmsg === 'doc';
      // const extension4 = testmsg === 'docx';
      const isLt2M = file.size / 1024 / 1024 < 10;
      // if (!extension && !extension2 && !extension3 && !extension4) {
      //   this.$message({
      //     message: '上传文件只能是 PDF、doc、docx格式!',
      //     type: 'warning'
      //   });
      // }
      if (!isLt2M) {
        this.$message({
          message: '上传文件大小不能超过 10MB!',
          type: 'warning'
        });
      }
      // return (extension || extension2 || extension3 || extension4) && isLt2M
      return isLt2M
    }
  }
}
</script>

<style lang="scss">
  @import '~@/styles/variables.scss';
  .table-demo {
    .search-box {
      margin-bottom: 15px;
      border-bottom: 1px solid $border-light-color;
    }
    .topBtns {
      margin-bottom: 10px;
      text-align: right;
      button {
        margin: 0 10px;
      }
    }
    .menuDialog {
      .el-dialog {
        width: 500px;
      }
    }
    .tableSet {
      text-align: center;
      width: 680px !important;
      thead {
        tr {
          th {
            padding: 3px;
            border-right: 1px solid $border-light-color;
            border-top: 1px solid $border-light-color;
            border-bottom: 1px solid $border-light-color;
          }
          th:first-child {
            border-left: 1px solid $border-light-color;
          }
        }
      }
      tr {
        td {
          padding: 3px;
          border-right: 1px solid $border-light-color;
          border-bottom: 1px solid $border-light-color;
        }
        td:first-child {
          border-left: 1px solid $border-light-color;
        }
      }
    }
    .table-top {
      line-height: 1.5rem;
      padding: 5px;
      width: 100%;
      display: flex;
      display: -webkit-flex;
      .top-title {
        width: 50%;
        text-align: left;
      }
      .top-btns {
        width: 50%;
        text-align: right;
      }
      button {
        margin: 0 10px;
      }
    }
    .form-table tr td:last-child{
      text-align: left;
    }
  }
</style>
