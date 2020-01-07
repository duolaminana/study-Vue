<template>
  <div class="app-container logisticOrder">
    <div class="search-box">
      <el-form label-width="100px" inline size="small">
        <div>
          <el-form-item label="物流单单号">
            <el-input
              v-model="postData.logisticsOrderNo"
              clearable
              placeholder="请输入物流单单号"
              style="width: 200px"/>
          </el-form-item>
          <el-form-item label="开始时间" prop="startDate">
            <el-date-picker
              v-model="postData.etd"
              type="datetime"
              style="width: 200px"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" prop="startDate">
            <el-date-picker
              v-model="postData.eta"
              type="datetime"
              style="width: 200px"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="订单号">
            <el-input
              v-model="postData.orderNo"
              clearable
              placeholder="请输入订单号"
              style="width: 200px"/>
          </el-form-item>
          <el-form-item label="订单类型">
            <el-select v-model="postData.orderType" clearable placeholder="请选择订单类型" style="width: 200px">
              <el-option v-for="(item, index) in orderTypeList" :label="language === 'zh' ? item.labelZh : item.label" :value="item.orderType" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="export" @click="searchData">搜索</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="topBtns">
      <el-button type="primary" size="small" @click="openDialog('add')">新增</el-button>
      <el-button type="primary" size="small" class="export">导出excel</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="dataList"
      element-loading-text="正在查询中。。。"
      border
      fit
      size="mini"
      row-key="id"
      :header-cell-style="{background: '#a7bfee'}"
      @selection-change="getSelect">
      <el-table-column align="center" type="selection" width="55"></el-table-column>
      <el-table-column label="物流单单号" prop="logisticsOrderNo" show-overflow-tooltip />

      <el-table-column label="订单号" prop="orderNo" show-overflow-tooltip/>

      <el-table-column align="center" width="160px" label="日期" prop="logisticsOrderDate">
        <template slot-scope="scope">
          {{scope.row.logisticsOrderDate | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" label="订单类型" width="120" prop="orderType" >
        <template slot-scope="scope">
          {{scope.row.orderType | orderTypeFmt}}
        </template>
      </el-table-column>

      <el-table-column align="center" width="120" label="金额" prop="logisticsOrderAmount" />

      <el-table-column align="center" width="100" label="修改人" prop="updateUserIdName"/>

      <el-table-column label="修改时间" prop="updateTime" width="160px" align="center">
        <template slot-scope="scope">
          {{scope.row.updateTime | timeFmt}}
        </template>
      </el-table-column>

      <el-table-column label="状态" prop="logisticsStatus" width="100" align="center">
        <template slot-scope="scope">
          {{scope.row.logisticsStatus | statusFilter}}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="260" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" class="export" @click="openDetailDialog(scope.row,1)">查看</el-button>
          <el-button type="primary" size="mini" v-if="scope.row.logisticsStatus === 1 || scope.row.logisticsStatus === 4 " @click="openDialog('edit', scope.row)">编辑</el-button>
          <el-button type="primary" size="mini" v-if="scope.row.logisticsStatus === 3 || scope.row.logisticsStatus === 5" @click="payment(scope.row)">支付</el-button>
          <el-button type="primary" size="mini" v-if="scope.row.logisticsStatus === 3" @click="openDetailDialog(scope.row, 2)">确认</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination :total="postData.total" :page.sync="postData.pageNum" :limit.sync="postData.pageSize" @pagination="getDataList"></Pagination>

    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogType==='add'? '新增物流订单': '编辑物流订单'"
      width="1000px"
      center
      @close="clearData"
      :close-on-click-modal="false">
      <el-form ref="editForm" :model="editForm" label-position="left" label-width="130px" size="small" inline :rules="editFormRules">
        <div>
          <el-form-item label="物流订单号">
            {{editForm.logisticsOrderNo || 'Null'}}
          </el-form-item>
        </div>
        <el-row :gutter="16">
          <el-col>
            <el-form-item label="订单类型" prop="orderType">
              <el-radio-group v-model="editForm.orderType">
                <el-radio label="0">销售订单</el-radio>
                <el-radio label="1">转单</el-radio>
                <el-radio label="2">采购订单</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="订单号" prop="orderNoArr">
              <el-input v-model="editForm.orderNo" readonly placeholder="Please click the button to add order" style="width:500px;"></el-input>
              <el-button type="primary" class="export" @click="openAddOrderDialog">添加</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="承运方" prop="supplierInfoBId">
              <el-select v-model="editForm.supplierInfoBId" clearable>
                <el-option v-for="(item, index) in supplierList" :label="item.supplierName" :value="item.bid" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发货人" prop="customerBasicInfoBId">
              <el-select v-model="editForm.customerBasicInfoBId" clearable placeholder="select">
                <el-option v-for="(item, index) in companyList" :label="item.companyName" :value="item.bid" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="运输方式" prop="transportationMethod">
              <el-select v-model="editForm.transportationMethod">
                <el-option label="汽运" value="0"></el-option>
                <el-option label="铁路" value="1"></el-option>
                <el-option label="海运" value="2"></el-option>
                <el-option label="空运" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="币种" prop="paymentCurrency">
              <el-select filterable remote :remote-method="getCurrencyCodeList" :loading="loading2" v-model="editForm.paymentCurrency" clearable placeholder="请输入币种名或者币种编码查找">
                <el-option v-for="(item, index) in currencyCodeList" :label="item.currencyCode" :value="item.currencyCode" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="起运港" prop="departurePortAdd">
              <el-input v-model="editForm.departurePortAdd" clearable style="width:300px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目的港" prop="destinationPortAdd">
              <el-input v-model="editForm.destinationPortAdd" clearable style="width:300px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预定出发时间" prop="eta">
              <el-date-picker v-model="editForm.eta" type="datetime" clearableplaceholder="select date">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="估计到达时间" prop="etd">
              <el-date-picker v-model="editForm.etd" type="datetime" clearable placeholder="select date">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-table
              :data="editForm.logisticsOrderProductsList"
              style="margin: 16px 0"
              border
              fit
              size="mini"
              :header-cell-style="{background: '#a7bfee'}">
              <el-table-column align="center" type="index" width="55"></el-table-column>
              <el-table-column align="center" label="商品" prop="productName" />
              <el-table-column align="center" label="描述" prop="productDescription" />
              <el-table-column align="center" label="客户产品参考" prop="clientProductRef" />
              <el-table-column align="center" label="数量" prop="productQuantity" />
            </el-table>
          </el-col>
          <el-col :span="8">
            <el-form-item label="总重量" prop="logisticsOrderWeight">
              <el-input v-model.number="editForm.logisticsOrderWeight" clearable style="width:160px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="总体积" prop="logisticsOrderVolume">
              <el-input v-model.number="editForm.logisticsOrderVolume" clearable style="width:160px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="总金额" prop="logisticsOrderAmount">
              <el-input v-model.number="editForm.logisticsOrderAmount" clearable style="width:160px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="editForm.remark" type="textarea" :autosize="{ minRows: 4, maxRows: 6}" style="width:600px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="附件">
              <el-upload
                ref="upload"
                :action="uploadActionUrl"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                :on-success="handleSuccess"
                multiple
                :limit="5"
                :on-exceed="handleExceed"
                :file-list="fileList">
                <el-button size="small" type="primary" icon="el-icon-upload">Click Upload</el-button>
                <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-dialog
        width="1000px"
        center
        title="订单列表"
        :close-on-click-modal="false"
        :visible.sync="innerVisible"
        append-to-body>
        <div class="search-box">
          <el-form label-width="190px" size="small" inline class="edit-form">
            <el-form-item label="订单号" prop="eventRemark">
              <el-input v-model="orderSearchData.orderNo" clearable placeholder="订单号" size="mini"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" class="export" @click="searchOrderList">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-table
          ref="multipleTable"
          :data="orderList"
          border
          fit
          style="margin: 10px 0"
          size="small"
          @selection-change="getSelectOrderList"
          :header-cell-style="{background: '#a7bfee'}">
          <el-table-column
            align="center"
            type="selection"
            width="50">
          </el-table-column>

          <el-table-column
            label="序号"
            align="center"
            type="index"
            width="50">
          </el-table-column>

          <el-table-column align="center" label="订单号" prop="orderNo">
            <template slot-scope="scope">
              {{scope.row.orderNo || scope.row.purchaseNo}}
            </template>
          </el-table-column>

          <el-table-column align="center" label="买家" prop="buyerName"/>

          <el-table-column align="center" label="卖家" prop="sellerName"/>

          <el-table-column align="center" width="160" label="币种" prop="orderCurrency"/>

          <el-table-column align="center" width="160" label="订单时间" prop="companyName">
            <template slot-scope="scope">
              {{scope.row.createTime | timeFmt}}
            </template>
          </el-table-column>

        </el-table>

        <Pagination :total="orderSearchData.total" :page.sync="orderSearchData.pageNum"
                    :limit.sync="orderSearchData.pageSize" @pagination="getOrderListByType"/>

        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="addLogisticOrderProduct">确定</el-button>
          <el-button type="danger" size="small" @click="innerVisible=false">取消</el-button>
        </div>
      </el-dialog>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" :loading="loading1" @click="submit('editForm', 1, dialogType === 'add')">保存</el-button>
        <el-button type="primary" size="small" :loading="loading1" @click="submit('editForm', 2, dialogType === 'add')">提交</el-button>
        <el-button type="danger" size="small" @click="shutDown">关闭</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="detailVisible"
      title="物流订单详情"
      width="1000px"
      center
      :close-on-click-modal="false">
      <el-form label-position="left" label-width="130px" size="small" inline>
        <div>
          <el-form-item label="物流订单号">
            {{detailForm.logisticsOrderNo || 'Null'}}
          </el-form-item>
        </div>
        <el-row :gutter="16">
          <el-col>
            <el-form-item label="订单类型" prop="orderType">
              <el-radio-group v-model="detailForm.orderType" disabled>
                <el-radio label="0">销售订单</el-radio>
                <el-radio label="1">转单</el-radio>
                <el-radio label="2">采购订单</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="订单号" prop="orderNoArr">
              <el-input v-model="detailForm.orderNo" readonly placeholder="Please click the button to add order" style="width:500px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="承运方" prop="supplierInfoBId">
              <el-select v-model="detailForm.supplierInfoBId" disabled>
                <el-option v-for="(item, index) in supplierList" :label="item.supplierName" :value="item.bid" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发货人" prop="customerBasicInfoBId">
              <el-select v-model="detailForm.customerBasicInfoBId" disabled placeholder="select">
                <el-option v-for="(item, index) in companyList" :label="item.companyName" :value="item.bid" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="运输方式" prop="transportationMethod">
              <el-select v-model="detailForm.transportationMethod" disabled>
                <el-option label="汽运" value="0"></el-option>
                <el-option label="铁路" value="1"></el-option>
                <el-option label="海运" value="2"></el-option>
                <el-option label="空运" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="币种" prop="paymentCurrency">
              <el-select filterable remote :remote-method="getCurrencyCodeList" :loading="loading2" v-model="detailForm.paymentCurrency" disabled placeholder="请输入币种名或者币种编码查找">
                <el-option v-for="(item, index) in currencyCodeList" :label="item.currencyCode" :value="item.currencyCode" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="起运港" prop="departurePortAdd">
              <el-input v-model="detailForm.departurePortAdd" disabled style="width:300px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目的港" prop="destinationPortAdd">
              <el-input v-model="detailForm.destinationPortAdd" disabled style="width:300px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预定出发时间" prop="eta">
              <el-date-picker v-model="detailForm.eta" type="datetime" disabled leplaceholder="select date">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="估计到达时间" prop="etd">
              <el-date-picker v-model="detailForm.etd" type="datetime" disabled placeholder="select date">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-table
              :data="detailForm.logisticsOrderProductsList"
              style="margin: 16px 0"
              border
              fit
              size="mini"
              :header-cell-style="{background: '#a7bfee'}">
              <el-table-column align="center" type="index" width="55"></el-table-column>
              <el-table-column align="center" label="商品" prop="productName" />
              <el-table-column align="center" label="描述" prop="productDescription" />
              <el-table-column align="center" label="客户产品参考" prop="clientProductRef" />
              <el-table-column align="center" label="数量" prop="productQuantity" />
            </el-table>
          </el-col>
          <el-col :span="8">
            <el-form-item label="总重量" prop="logisticsOrderWeight">
              <el-input v-model.number="detailForm.logisticsOrderWeight" readonly style="width:160px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="总体积" prop="logisticsOrderVolume">
              <el-input v-model.number="detailForm.logisticsOrderVolume" readonly style="width:160px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="总金额" prop="logisticsOrderAmount">
              <el-input v-model.number="detailForm.logisticsOrderAmount" readonly style="width:160px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="detailForm.remark" type="textarea" readonly :autosize="{ minRows: 4, maxRows: 6}" style="width:600px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="附件">
              <div v-for="(item,index) in detailForm.logisticsOrderAttachmentsList" :key="index">
                {{item.attachmentName}}
                <el-button type="danger" size="mini" class="export" style="margin-left: 20px" @click="downLoadFile(item.attachmentPath)">下载</el-button>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="affirmVisible">
            <el-form-item label="审批意见" required>
              <el-input v-model="auditResult" type="textarea" :autosize="{ minRows: 4, maxRows: 6}" style="width:600px;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button type="primary" size="small" v-if="affirmVisible" @click="acceptOrder(1)">接受</el-button>
        <el-button type="primary" size="small" v-if="affirmVisible" @click="acceptOrder(2)">拒绝</el-button>
        <el-button type="danger" size="small" @click="shutDown">关闭</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="paymentVisible" title="物流付款指令详情" width="900px" center :close-on-click-modal="false">
      <div class="payment-box">
        <div class="payment-order">
          <div class="payment-order-item">
            <div>
              <div class="item-label">物流订单号</div>
              <div class="item-text">{{detailForm.logisticsOrderNo}}</div>
            </div>
            <div>
              <div class="item-label">订单日期</div>
              <div class="item-text">{{detailForm.logisticsOrderDate | timeFmt}}</div>
            </div>
          </div>
          <div class="payment-order-item">
            <div>
              <div class="item-label">发货人</div>
              <div class="item-text">{{companyFilter(detailForm.customerBasicInfoBId)}}</div>
            </div>
            <div>
              <div class="item-label">运输方式</div>
              <div class="item-text">{{transportationFilter(detailForm.transportationMethod, language === 'zh')}}</div>
            </div>
          </div>
          <div class="payment-order-item">
            <div>
              <div class="item-label">起运港</div>
              <div class="item-text">{{detailForm.departurePortAdd}}</div>
            </div>
            <div>
              <div class="item-label">目的港</div>
              <div class="item-text">{{detailForm.destinationPortAdd}}</div>
            </div>
          </div>
          <div class="payment-order-item">
            <div>
              <div class="item-label">预定出发时间</div>
              <div class="item-text">{{detailForm.eta | timeFmt}}</div>
            </div>
            <div>
              <div class="item-label">预定到达时间</div>
              <div class="item-text">{{detailForm.etd | timeFmt}}</div>
            </div>
          </div>
          <div class="payment-order-item">
            <div>
              <div class="item-label">订单号</div>
              <div class="item-text">{{detailForm.orderNo}}</div>
            </div>
          </div>
        </div>
        <div class="payment-supplier" v-if="detailForm.supplierInfo">
          <div>
            <div>供应商信息</div>
            <div class="payment-supplier-item">
              <div class="item-label">供应商名称</div>
              <div class="item-text">{{detailForm.supplierInfo.supplierName}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">联系人</div>
              <div class="item-text">{{detailForm.supplierInfo.supplierName}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">联系方式</div>
              <div class="item-text">{{detailForm.supplierInfo.mobilePhone}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">地址</div>
              <div class="item-text">{{detailForm.supplierInfo.registerAddress}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">国家</div>
              <div class="item-text">{{detailForm.supplierInfo.countryCode}}</div>
            </div>
          </div>
          <div>
            <div>账户信息</div>
            <div class="payment-supplier-item">
              <div class="item-label">银行名称</div>
              <div class="item-text">{{detailForm.supplierInfo.supplierBankAccount.bankName}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">支行名称</div>
              <div class="item-text">{{detailForm.supplierInfo.supplierBankAccount.branchName}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">账户号码</div>
              <div class="item-text">{{detailForm.supplierInfo.supplierBankAccount.bankAccount}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">地址</div>
              <div class="item-text">{{detailForm.supplierInfo.supplierBankAccount.bankAddress}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">swift编码</div>
              <div class="item-text">{{detailForm.supplierInfo.supplierBankAccount.swiftCode}}</div>
            </div>
          </div>
        </div>
        <div class="payment-supplier">
          <div>
            <div>支付信息</div>
            <div class="payment-supplier-item">
              <div class="item-label">订单金额</div>
              <div class="item-text">{{paymentForm.logisticsOrderAmount | toThousandFilter}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">订单货币</div>
              <div class="item-text">{{paymentForm.paymentCurrency}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">待付款</div>
              <div class="item-text">{{paymentForm.pendingPayment | toThousandFilter}}</div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">申请付款</div>
              <div class="item-text">
                <el-input v-model.number="paymentForm.applyPaymentAmount" size="small" clearable style="width: 200px"/>
              </div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">付款日期</div>
              <div class="item-text">
                <el-date-picker v-model="paymentForm.paymentTime" type="date" placeholder="select date" style="width: 200px"/>
              </div>
            </div>
            <div class="payment-supplier-item">
              <div class="item-label">备注</div>
              <div class="item-text">
                <el-input type="textarea" v-model="paymentForm.applicationReason" style="width: 60%"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="addOrderPayment">{{$t('common.buttonText.submit')}}</el-button>
        <el-button type="danger" size="small" @click="paymentVisible=false">{{$t('common.buttonText.close')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { parseTime, deepClone } from "@/utils/index";
import { uploadActionUrl } from '@/api/common'
import { selectCountryListApi, getSupplyCompanyList, selectCurrencyCodeListApi } from "@/api/system";
import { supplierTypeList } from "@/api/supplier";
import {
  selectLogisticsOrderDetailListAPI,
  getLogisticsOrderNoAPI,
  getSaleOrderListByType,
  getTransitradeOrderListByType,
  getPurchaseOrderListByType,
  addSaleOrderProductToLogistic,
  addTransitradeOrderProductToLogistic,
  addPurchaseOrderProductToLogistic,
  saveLogisticsOrderDetailAPI,
  submitLogisticsOrderDetailAPI,
  selectLogisticsOrderByIdAPI,
  saveApplyAPI,
  updateAffirmResultAPI
} from '@/api/logistic'
import { getPaymentAmount } from '@/api/finance'
import moneyFmt from "@/mixin/moneyFmt";
export default {
  components: {
    Pagination
    // OrderStep
  },
  mixins: [moneyFmt],
  data() {
    return {
      paymentVisible: false,
      affirmVisible: false,
      detailVisible: false,
      innerVisible: false,
      dialogType: '',
      uploadActionUrl,
      listLoading: true,
      loading1: false,
      loading2: false,
      dialogVisible: false,
      rangeTime: [],
      selectList: [],
      selectOrderList: [],
      postData: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        logisticsOrderNo: '',
        etd: '',
        eta: '',
        orderNo: '',
        orderType: ''
      },
      orderSearchData: {
        orderNo: '',
        orderStatus: 5,
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      paymentForm: {
        paymentTime: '',
        applyPaymentAmount: '',
        paymentOrderType: 1,
        paymentCurrency: '',
        amountAll: 0,
        pendingPayment: 0,
        associatedOrderBId: '',
        customerBId: '',
        customerName: '',
        applicationReason: ''
      },
      dataList: [],
      logisticsOrderProductsList: [],
      currencyCodeList: [],
      orderList: [],
      supplierList: [],
      companyList: [],
      fileList: [],
      auditResult: '',
      detailForm: {},
      editForm: {
        logisticsOrderNo: '',
        customerBasicInfoBId: '',
        supplierInfoBId: '',
        departurePortAdd: '',
        destinationPortAdd: '',
        eta: '',
        etd: '',
        logisticsOrderAmount: 0,
        logisticsOrderVolume: 0,
        logisticsOrderWeight: 0,
        orderNo: '',
        paymentCurrency: '',
        remark: '',
        transportationMethod: '0',
        orderType: '0',
        logisticsOrderProductsList: [],
        logisticsOrderAttachmentsList: []
      },
      editFormRules: {
        customerBasicInfoBId: [{ required: true, message: '请选择发货方', trigger: 'change' }],
        paymentCurrency: [{ required: true, message: '请选择币种', trigger: 'change' }],
        transportationMethod: [{ required: true, message: '请选择币种', trigger: 'change' }],
        departurePortAdd: [{ required: true, message: '请填写出发港口', trigger: 'blur' }],
        destinationPortAdd: [{ required: true, message: '请填写目的港口', trigger: 'blur' }],
        eta: [{ required: true, message: '请填写出发港口', trigger: 'blur' }],
        etd: [{ required: true, message: '请填写目的港口', trigger: 'blur' }],
        logisticsOrderAmount: [{ type: 'number', required: true, message: '请填写运费', trigger: 'blur' }],
        logisticsOrderVolume: [{ type: 'number', required: true, message: '请填写体积', trigger: 'blur' }],
        logisticsOrderWeight: [{ type: 'number', required: true, message: '请填写重量', trigger: 'blur' }]
      },
      orderTypeList: [
        {
          labelZh: '销售',
          label: 'Sales',
          orderType: 0
        },
        {
          labelZh: '转单',
          label: 'Other',
          orderType: 1
        },
        {
          labelZh: '采购',
          label: 'Purchase',
          orderType: 2
        }
      ]
    };
  },
  created() {
    this.getCurrencyCodeList();
    this.getDataList();
    this.getSupplierList();
    this.getSysCustomerInfoListFun();
  },
  methods: {
    clearData() {
      this.$refs['upload'].clearFiles();
      this.editForm = {
        logisticsOrderNo: '',
        customerBasicInfoBId: '',
        supplierInfoBId: '',
        departurePortAdd: '',
        destinationPortAdd: '',
        eta: '',
        etd: '',
        logisticsOrderAmount: 0,
        logisticsOrderVolume: 0,
        logisticsOrderWeight: 0,
        orderNo: '',
        paymentCurrency: '',
        remark: '',
        transportationMethod: '0',
        orderType: '0',
        logisticsOrderProductsList: [],
        logisticsOrderAttachmentsList: []
      }
    },
    downLoadFile(url) {
      window.open(url)
    },
    // 支付
    payment (row) {
      selectLogisticsOrderByIdAPI({ bId: row.bid }).then(res => {
        this.paymentVisible = true;
        this.detailForm = deepClone(res.data);
        this.paymentForm.paymentCurrency = this.detailForm.paymentCurrency;
        this.paymentForm.logisticsOrderAmount = this.detailForm.logisticsOrderAmount;
        this.paymentForm.supplierInfoBId = this.detailForm.supplierInfoBId;
        this.paymentForm.supplierName = this.detailForm.supplierInfo.supplierName;
        this.paymentForm.logisticsOrderBId = this.detailForm.bid;
        this.paymentForm.logisticsOrderNo = this.detailForm.logisticsOrderNo;
        this.selectSurplusAmountFun(row.bid);
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    // 通过采购bid获取当前付款金额
    selectSurplusAmountFun(id) {
      getPaymentAmount({ associatedOrderBId: id, type: 2 }).then(res => {
        this.paymentForm.pendingPayment = res.data;
      });
    },
    addOrderPayment() {
      const { paymentTime, applyPaymentAmount } = this.paymentForm;
      if (!paymentTime || !applyPaymentAmount) {
        return this.$message.warning('Payment and application time cannot be empty')
      }
      saveApplyAPI(this.paymentForm).then(res => {
        this.$message.success('Submit Success');
        this.paymentForm.paymentTime = '';
        this.paymentForm.applyPaymentAmount = '';
        this.paymentForm.applicationReason = '';
        this.paymentVisible = false;
      }).catch(err => {
        this.$message.error(err.message)
      });
    },
    // 详情
    openDetailDialog (row, type) {
      this.detailVisible = true;
      this.auditResult = '';
      this.detailForm = deepClone(row);
      this.affirmVisible = type === 2
    },
    // 打开选择订单窗口
    openAddOrderDialog() {
      this.innerVisible = true;
      this.orderSearchData.orderNo = '';
      this.getOrderListByType()
    },
    addLogisticOrderProduct() {
      let api = '';
      switch (Number(this.editForm.orderType)) {
        case 0: api = addSaleOrderProductToLogistic; break;
        case 1: api = addTransitradeOrderProductToLogistic; break;
        case 2: api = addPurchaseOrderProductToLogistic; break;
      }
      if (!this.selectOrderList.length) {
        return this.$message.warning('请选择订单')
      }
      let obj = {
        orderBids: this.selectOrderList.map(e => e.bid).join(',')
      };
      api(obj).then(res => {
        this.editForm.logisticsOrderProductsList = res.data.map(e => {
          e.productSkuReference = e.clientProductRef;
          return { ...e }
        });
        this.orderType = this.editForm.orderType;
        this.editForm.orderNo = this.selectOrderList.map(e => e.orderNo || e.purchaseNo).join(',');
        this.editForm.orderBIdList = this.selectOrderList.map(e => e.bid).join(',');
        this.selectOrderList = [];
        this.$refs.multipleTable.clearSelection();
        this.innerVisible = false
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    acceptOrder(status) {
      if (!this.auditResult) {
        return this.$message.warning('请填写审批意见')
      }
      let obj = {
        id: this.detailForm.id,
        affirmResult: status,
        auditResult: this.auditResult
      };
      updateAffirmResultAPI(obj).then(res => {
        this.$message.success('operate successfully');
        this.shutDown()
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    shutDown () {
      this.paymentVisible = false;
      this.detailVisible = false;
      this.affirmVisible = false;
      this.dialogVisible = false;
    },
    // 查询获取币种
    getCurrencyCodeList(query) {
      if (query !== '') {
        this.loading2 = true;
        setTimeout(() => {
          this.loading2 = false;
          selectCurrencyCodeListApi(query).then(res => {
            this.currencyCodeList = res.data || []
          })
        }, 200);
      } else {
        this.currencyCodeList = [];
      }
    },
    // 查询获取国家
    getCountryList(query) {
      if (query !== "") {
        this.loading1 = true;
        setTimeout(() => {
          this.loading1 = false;
          selectCountryListApi(query).then(res => {
            this.countryList = res.data || [];
          });
        }, 200);
      } else {
        this.countryList = [];
      }
    },
    // 物流供应商列表
    getSupplierList() {
      supplierTypeList({ supplierType: 1 }).then(res => {
        this.supplierList = res.data || [];
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    // 主体企业列表
    getSysCustomerInfoListFun() {
      getSupplyCompanyList().then(res => {
        this.companyList = res.data || [];
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    openDialog(type, row) {
      this.dialogType = type;
      if (type === 'edit') {
        this.editForm = Object.assign(this.editForm, row);
        this.orderType = this.editForm.orderType;
        this.fileList = this.editForm.logisticsOrderAttachmentsList.map(e => {
          e.name = e.attachmentName;
          e.url = e.attachmentPath;
          return { ...e }
        })
      } else {
        getLogisticsOrderNoAPI().then(res => {
          this.editForm.logisticsOrderNo = res.data;
        })
      }
      this.dialogVisible = true;
    },
    submit(formName, type, flag) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading1 = true;
          this.editForm.logisticsStatus = type;
          this.editForm.orderType = this.orderType;
          let api = type === 1 ? saveLogisticsOrderDetailAPI : submitLogisticsOrderDetailAPI;
          api(this.editForm).then(res => {
            this.dialogVisible = false;
            this.loading1 = false;
            this.$message.success('Save Success');
            this.getDataList()
          }).catch(err => {
            this.loading1 = false;
            this.$message.error(err.message);
          });
        }
      })
    },
    getSearchTime(date) {
      if (date && date.length) {
        this.postData.orderStartTime = date[0];
        this.postData.orderEndTime = date[1];
      } else {
        this.postData.orderStartTime = "";
        this.postData.orderEndTime = "";
      }
    },
    searchOrderList() {
      this.orderSearchData.pageNum = 1;
      this.getOrderListByType()
    },
    getOrderListByType() {
      let api = '';
      switch (Number(this.editForm.orderType)) {
        case 0: api = getSaleOrderListByType; break;
        case 1: api = getTransitradeOrderListByType; break;
        case 2: api = getPurchaseOrderListByType; break;
      }
      api(this.orderSearchData).then(res => {
        this.orderList = res.data.list || [];
        this.orderSearchData.total = res.data.total;
      }).catch(err => {
        this.$message.error(err.message);
      });
    },
    searchData() {
      this.postData.pageNum = 1;
      this.getDataList();
    },
    // 物流单列表
    getDataList() {
      let obj = {};
      for (let key in this.postData) {
        if (this.postData[key] !== "") {
          obj[key] = this.postData[key];
        }
      }
      selectLogisticsOrderDetailListAPI(obj).then(res => {
        this.dataList = res.data.list;
        this.postData.total = res.data.total;
        this.listLoading = false;
      }).catch(err => {
        this.listLoading = false;
        this.$message.error(err.message);
      });
    },
    // 勾选触发 selects为选择的数据数组
    getSelect(selects) {
      this.selectList = selects;
    },
    getSelectOrderList(selects) {
      this.selectOrderList = selects
    },
    handleRemove(file, fileList) {
      this.editForm.logisticsOrderAttachmentsList = fileList.map(e => {
        e.attachmentFileUuid = e.attachmentFileUuid || e.response.data.UUID;
        e.attachmentName = e.attachmentName || e.name;
        e.attachmentPath = e.attachmentPath || e.response.data.filePath;
        return { ...e }
      })
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    handleSuccess(res, file, fileList) {
      this.editForm.logisticsOrderAttachmentsList = fileList.map(e => {
        e.attachmentFileUuid = e.attachmentFileUuid || e.response.data.UUID;
        e.attachmentName = e.attachmentName || e.name;
        e.attachmentPath = e.attachmentPath || e.response.data.filePath;
        return { ...e }
      })
    },
    companyFilter(id) {
      if (id) {
        let obj = this.companyList.filter(e => e.bid === id)[0];
        return obj.companyName
      }
    },
    transportationFilter(id, flag) {
      if (id) {
        switch (Number(id)) {
          case 0: return flag ? '汽运' : 'By Truck';
          case 1: return flag ? '铁路' : 'By Railway';
          case 2: return flag ? '海运' : 'By Ship';
          case 3: return flag ? '空运' : 'By Air';
          default: break
        }
      }
    }
  },
  filters: {
    orderTypeFmt(status) {
      switch (Number(status)) {
        case 0: return '销售';
        case 1: return '转单';
        case 2: return '采购';
      }
    },
    statusFilter(status) {
      switch (Number(status)) {
        case 1: return '编辑中';
        case 2: return '审批中';
        case 3: return '审批通过';
        case 4: return '审批失败';
        case 5: return '运输中';
        case 6: return '商家拒绝';
        default:
          return '不存在';
      }
    },
    timeFmt(val) {
      if (val) {
        return parseTime(val)
      }
    }
  }
};
</script>

<style lang="scss">
@import "~@/styles/variables.scss";
.logisticOrder {
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
  .avatar {
    width: 60%;

    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 150px;
      height: 150px;
      line-height: 150px;
      text-align: center;
      border: 1px solid $border-light-color;
    }

    .avatar {
      width: 150px;
      height: 150px;
      display: block;
    }
  }
  .row-item {
    margin-bottom: 20px;
  }
  .step-node {
    position: relative;
    font-weight: bold;
    font-size: 15px;
    line-height: 40px;
    padding: 5px 5px 5px 20px;
    border-bottom: 1px solid $border-light-color;
  }
  .payment-box {
    >div {
      margin: 20px 0;
    }
    .payment-order {
      &-item {
        display: flex;
        line-height: 28px;
        >div {
          flex: 1;
          display: flex;
          .item-label {
            width: 130px;
          }
          .item-text {
            flex: 1;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
    .payment-supplier {
      display: flex;
      border-top: 1px solid $border-light-color;
      padding-top: 10px;
      >div {
        flex: 1;
        .payment-supplier-item {
          padding-left: 100px;
          flex: 1;
          display: flex;
          line-height: 35px;
          .item-label {
            width: 130px;
          }
          .item-text {
            flex: 1;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }
}
</style>
